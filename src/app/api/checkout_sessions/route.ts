import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // In a real app, you would identify the user by session. For demo, we create a dummy user
    let user = await prisma.user.findFirst({ where: { active_rental_status: false } });
    if (!user) {
      user = await prisma.user.create({ data: {} });
    }

    // Get an available kiosk
    const kiosk = await prisma.kiosk.findFirst({
      where: { available_batteries: { gt: 0 } },
      include: { batteries: { where: { status: 'AVAILABLE' } } },
    });

    if (!kiosk || kiosk.batteries.length === 0) {
      // Create a dummy kiosk and battery for demo if not exists
      const dummyKiosk = await prisma.kiosk.create({
        data: {
          location_name: "Demo Station",
          available_batteries: 1,
          empty_slots: 4,
          batteries: {
            create: [{ battery_id: "BAT-" + Date.now(), status: "AVAILABLE" }]
          }
        },
        include: { batteries: true }
      });
      // We will use dummyKiosk for checkout
    }

    // Create Checkout Session
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
        user_id: user.user_id,
        // we'll pass kiosk ID dynamically if needed
      },
      success_url: `${origin}/active?session_id={CHECKOUT_SESSION_ID}&user_id=${user.user_id}`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
