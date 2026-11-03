import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebaseAdmin';
import { dispenseBattery } from '@/lib/hardwareApi';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, payment_method_id, kiosk_id } = body;

    if (!user_id || !payment_method_id || !kiosk_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check user in Firestore
    const userRef = db.collection('users').doc(user_id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = userDoc.data();
    if (userData?.active_rental_status) {
      return NextResponse.json({ error: 'User already has an active rental' }, { status: 400 });
    }

    // 2. Check kiosk & available batteries
    const batteriesSnap = await db.collection('batteries')
      .where('current_kiosk_id', '==', kiosk_id)
      .where('status', '==', 'AVAILABLE')
      .limit(1)
      .get();

    if (batteriesSnap.empty) {
      return NextResponse.json({ error: 'No available batteries at this kiosk' }, { status: 400 });
    }
    const batteryToDispense = batteriesSnap.docs[0];
    const batteryId = batteryToDispense.id;

    // 3. Handle Stripe Customer
    let stripeCustomerId = userData?.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ metadata: { user_id } });
      stripeCustomerId = customer.id;
      await userRef.update({ stripe_customer_id: stripeCustomerId });
    }

    // 4. Create Pre-Authorization hold of €24.99 (2499 cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2499,
      currency: 'eur',
      customer: stripeCustomerId,
      payment_method: payment_method_id,
      capture_method: 'manual', // Hold creation
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/return`,
    });

    if (paymentIntent.status === 'requires_capture') {
      // 5. Atomic Batch Write in Firestore
      const batch = db.batch();
      
      const kioskRef = db.collection('kiosks').doc(kiosk_id);
      const batteryRef = db.collection('batteries').doc(batteryId);
      const txRef = db.collection('transactions').doc();

      batch.update(batteryRef, { status: 'RENTED', current_kiosk_id: null });
      batch.update(kioskRef, {
        available_batteries: FieldValue.increment(-1),
        empty_slots: FieldValue.increment(1),
      });
      batch.update(userRef, { active_rental_status: true });
      batch.set(txRef, {
        transaction_id: txRef.id,
        user_id,
        battery_id: batteryId,
        pre_auth_id: paymentIntent.id,
        start_time: new Date(),
        status: 'PRE_AUTH_SUCCESS',
      });

      await batch.commit();

      // 6. Trigger physical ejection on hardware kiosk
      const hardwareResult = await dispenseBattery(kiosk_id, batteryId, 1);

      return NextResponse.json({
        success: true,
        message: 'Pre-auth successful, dispensing battery',
        battery_id: batteryId,
        hardware_task: hardwareResult,
      });
    } else {
      return NextResponse.json({
        error: 'Payment requires additional action or failed',
        status: paymentIntent.status,
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Pre-auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
