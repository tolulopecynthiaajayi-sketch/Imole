import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // 1. Find all active transactions older than 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const overdueTransactions = await prisma.transaction.findMany({
      where: {
        status: 'PRE_AUTH_SUCCESS',
        start_time: {
          lte: fortyEightHoursAgo
        }
      }
    });

    if (overdueTransactions.length === 0) {
      return NextResponse.json({ message: 'No overdue rentals found.' });
    }

    const processed = [];

    // 2. Loop and process captures
    for (const tx of overdueTransactions) {
      if (tx.pre_auth_id) {
        try {
          // Capture the full pre-authorized amount (2499 cents = €24.99)
          await stripe.paymentIntents.capture(tx.pre_auth_id, {
            amount_to_capture: 2499,
          });

          // 3. Update DB
          await prisma.$transaction([
            prisma.transaction.update({
              where: { transaction_id: tx.transaction_id },
              data: {
                end_time: new Date(),
                final_charge_amount: 24.99,
                status: 'LOST'
              }
            }),
            prisma.user.update({
              where: { user_id: tx.user_id },
              data: { active_rental_status: false }
            }),
            prisma.battery.update({
              where: { battery_id: tx.battery_id },
              data: { status: 'LOST' }
            })
          ]);

          processed.push(tx.transaction_id);
        } catch (error) {
          console.error(`Failed to capture for tx ${tx.transaction_id}`, error);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed_count: processed.length,
      transactions: processed 
    });

  } catch (error: any) {
    console.error('Cron sweep error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
