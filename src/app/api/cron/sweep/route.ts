import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    // 1. Find all active rentals older than 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const overdueSnap = await db.collection('transactions')
      .where('status', '==', 'PRE_AUTH_SUCCESS')
      .where('start_time', '<=', fortyEightHoursAgo)
      .get();

    if (overdueSnap.empty) {
      return NextResponse.json({ message: 'No overdue rentals found.' });
    }

    const processed = [];

    // 2. Loop and process captures
    for (const doc of overdueSnap.docs) {
      const tx = doc.data();
      const txId = doc.id;

      if (tx.pre_auth_id) {
        try {
          // Capture full pre-authorized hold (€24.99)
          await stripe.paymentIntents.capture(tx.pre_auth_id, {
            amount_to_capture: 2499,
          });

          // 3. Update Firestore documents
          const batch = db.batch();
          const txRef = doc.ref;
          const userRef = db.collection('users').doc(tx.user_id);
          const batteryRef = db.collection('batteries').doc(tx.battery_id);

          batch.update(txRef, {
            end_time: new Date(),
            final_charge_amount: 24.99,
            status: 'LOST',
          });

          batch.update(userRef, {
            active_rental_status: false,
          });

          batch.update(batteryRef, {
            status: 'LOST',
          });

          await batch.commit();
          processed.push(txId);
        } catch (error) {
          console.error(`Failed to capture for tx ${txId}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed_count: processed.length,
      transactions: processed,
    });
  } catch (error: any) {
    console.error('Cron sweep error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
