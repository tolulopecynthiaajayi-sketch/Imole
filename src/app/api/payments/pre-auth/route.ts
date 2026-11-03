import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { dispenseBattery } from '@/lib/hardwareApi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, payment_method_id, kiosk_id } = body;

    if (!user_id || !payment_method_id || !kiosk_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the kiosk has available batteries
    const kiosk = await prisma.kiosk.findUnique({
      where: { kiosk_id },
      include: { batteries: { where: { status: 'AVAILABLE' } } },
    });

    if (!kiosk || kiosk.batteries.length === 0) {
      return NextResponse.json({ error: 'No available batteries at this kiosk' }, { status: 400 });
    }

    // Assume user has a Stripe customer ID, if not, create one or handle it
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.active_rental_status) {
      return NextResponse.json({ error: 'User already has an active rental' }, { status: 400 });
    }

    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ metadata: { user_id } });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { user_id },
        data: { stripe_customer_id: stripeCustomerId },
      });
    }

    // Create a Pre-Authorization hold of €24.99 (2499 cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2499,
      currency: 'eur',
      customer: stripeCustomerId,
      payment_method: payment_method_id,
      capture_method: 'manual', // This creates the hold
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/return`, // required for some payment methods
    });

    if (paymentIntent.status === 'requires_capture') {
      // Hold successful!
      // Pick a battery to dispense
      const batteryToDispense = kiosk.batteries[0];

      // Update Database
      await prisma.$transaction([
        prisma.battery.update({
          where: { battery_id: batteryToDispense.battery_id },
          data: { status: 'RENTED', current_kiosk_id: null },
        }),
        prisma.kiosk.update({
          where: { kiosk_id },
          data: { 
            available_batteries: { decrement: 1 },
            empty_slots: { increment: 1 } 
          }
        }),
        prisma.user.update({
          where: { user_id },
          data: { active_rental_status: true }
        }),
        prisma.transaction.create({
          data: {
            user_id,
            battery_id: batteryToDispense.battery_id,
            pre_auth_id: paymentIntent.id,
            status: 'PRE_AUTH_SUCCESS',
          }
        })
      ]);

      // Call physical hardware station to dispense battery
      const hardwareResult = await dispenseBattery(
        kiosk.kiosk_id,
        batteryToDispense.battery_id,
        1 // bayonet/slot index
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Pre-auth successful, dispensing battery',
        battery_id: batteryToDispense.battery_id,
        hardware_task: hardwareResult,
      });
    } else {
      // requires_action or failed
      return NextResponse.json({ 
        error: 'Payment requires additional action or failed', 
        status: paymentIntent.status 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Pre-auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
