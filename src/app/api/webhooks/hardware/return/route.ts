import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Pricing rules
const MAX_CAP_CENTS = 2499; // €24.99 (48 hours)
const DAILY_CAP_CENTS = 1299; // €12.99 (Day 1)
const BASE_RATE_CENTS = 249; // €2.49 for unlock + 1st hour
const HOURLY_RATE_CENTS = 199; // €1.99 per subsequent hour

function calculateChargeAmount(startTime: Date, endTime: Date): number {
  const elapsedMs = endTime.getTime() - startTime.getTime();
  const elapsedHours = Math.ceil(elapsedMs / (1000 * 60 * 60)); // Round up to nearest hour

  if (elapsedHours <= 1) {
    return BASE_RATE_CENTS;
  }

  const additionalHours = elapsedHours - 1;
  const totalCharge = BASE_RATE_CENTS + (additionalHours * HOURLY_RATE_CENTS);

  if (elapsedHours <= 24) {
    return Math.min(totalCharge, DAILY_CAP_CENTS);
  } else {
    // Day 2 calculation:
    // Day 1 cap + remaining hours
    const day2Hours = elapsedHours - 24;
    const day2Charge = day2Hours * HOURLY_RATE_CENTS;
    const totalWithDay1Cap = DAILY_CAP_CENTS + day2Charge;
    
    return Math.min(totalWithDay1Cap, MAX_CAP_CENTS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kiosk_id, battery_id, slot_number } = body;

    if (!kiosk_id || !battery_id || slot_number === undefined) {
      return NextResponse.json({ error: 'Missing hardware return parameters' }, { status: 400 });
    }

    // 1. Find the active transaction for this battery
    const transaction = await prisma.transaction.findFirst({
      where: { 
        battery_id,
        status: 'PRE_AUTH_SUCCESS'
      },
      orderBy: { start_time: 'desc' }
    });

    if (!transaction) {
      return NextResponse.json({ error: 'No active transaction found for this battery' }, { status: 404 });
    }

    const endTime = new Date();
    const chargeAmountCents = calculateChargeAmount(transaction.start_time, endTime);

    // 2. Process Capture logic with Stripe
    if (transaction.pre_auth_id) {
      try {
        await stripe.paymentIntents.capture(transaction.pre_auth_id, {
          amount_to_capture: chargeAmountCents,
        });
      } catch (stripeError) {
        console.error('Stripe capture failed:', stripeError);
        // Continue to update DB even if capture failed, or handle specific retry logic
      }
    }

    // 3. Update Database
    await prisma.$transaction([
      prisma.transaction.update({
        where: { transaction_id: transaction.transaction_id },
        data: {
          end_time: endTime,
          final_charge_amount: chargeAmountCents / 100, // store as EUR
          status: 'COMPLETED'
        }
      }),
      prisma.user.update({
        where: { user_id: transaction.user_id },
        data: { active_rental_status: false }
      }),
      prisma.battery.update({
        where: { battery_id },
        data: { 
          status: 'AVAILABLE',
          current_kiosk_id: kiosk_id
        }
      }),
      prisma.kiosk.update({
        where: { kiosk_id },
        data: {
          available_batteries: { increment: 1 },
          empty_slots: { decrement: 1 }
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      charge_amount_eur: chargeAmountCents / 100,
      elapsed_time_minutes: Math.round((endTime.getTime() - transaction.start_time.getTime()) / 60000)
    });

  } catch (error: any) {
    console.error('Hardware return webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
