import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

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

    // 1. Find active transaction for this battery
    const txSnap = await db.collection('transactions')
      .where('battery_id', '==', battery_id)
      .where('status', '==', 'PRE_AUTH_SUCCESS')
      .limit(1)
      .get();

    if (txSnap.empty) {
      return NextResponse.json({ error: 'No active transaction found for this battery' }, { status: 404 });
    }

    const txDoc = txSnap.docs[0];
    const txData = txDoc.data();
    const startTime = txData.start_time?.toDate ? txData.start_time.toDate() : new Date(txData.start_time);
    const endTime = new Date();
    const chargeAmountCents = calculateChargeAmount(startTime, endTime);

    // 2. Capture final amount on Stripe & release rest of hold
    if (txData.pre_auth_id) {
      try {
        await stripe.paymentIntents.capture(txData.pre_auth_id, {
          amount_to_capture: chargeAmountCents,
        });
      } catch (stripeError) {
        console.error('Stripe capture failed:', stripeError);
      }
    }

    // 3. Atomic Batch Update in Firestore
    const batch = db.batch();
    const txRef = txDoc.ref;
    const userRef = db.collection('users').doc(txData.user_id);
    const batteryRef = db.collection('batteries').doc(battery_id);
    const kioskRef = db.collection('kiosks').doc(kiosk_id);

    batch.update(txRef, {
      end_time: endTime,
      final_charge_amount: chargeAmountCents / 100, // store in EUR
      status: 'COMPLETED',
    });

    batch.update(userRef, {
      active_rental_status: false,
    });

    batch.update(batteryRef, {
      status: 'AVAILABLE',
      current_kiosk_id: kiosk_id,
    });

    batch.update(kioskRef, {
      available_batteries: FieldValue.increment(1),
      empty_slots: FieldValue.increment(-1),
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      charge_amount_eur: chargeAmountCents / 100,
      elapsed_time_minutes: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
    });

  } catch (error: any) {
    console.error('Hardware return webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
