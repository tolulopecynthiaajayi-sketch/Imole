import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // Find or create an available user
    const usersSnap = await db.collection('users')
      .where('active_rental_status', '==', false)
      .limit(1)
      .get();

    let userId: string;
    if (usersSnap.empty) {
      const newUserRef = await db.collection('users').add({
        active_rental_status: false,
        created_at: new Date(),
      });
      userId = newUserRef.id;
    } else {
      userId = usersSnap.docs[0].id;
    }

    // Ensure demo kiosk & battery exist
    const kiosksSnap = await db.collection('kiosks').limit(1).get();
    if (kiosksSnap.empty) {
      const kioskRef = await db.collection('kiosks').add({
        location_name: "Station Paris Opéra",
        online_status: true,
        available_batteries: 2,
        empty_slots: 6,
        created_at: new Date(),
      });
      await db.collection('batteries').doc('BAT-101').set({
        battery_id: 'BAT-101',
        current_kiosk_id: kioskRef.id,
        status: 'AVAILABLE',
      });
    }

    // Create Checkout Session with €24.99 hold
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'IMỌLẸ Power Bank Rental (Pre-Auth)',
              description: 'Hold of €24.99. You will only be charged for what you use.',
            },
            unit_amount: 2499, // 24.99 EUR
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: 'manual',
      },
      metadata: {
        user_id: userId,
      },
      success_url: `${origin}/active?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
