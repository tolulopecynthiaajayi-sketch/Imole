import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, venueName, venueType, address, email, phone } = body;

    console.log('--- NEW IMỌLẸ VENUE PARTNER INQUIRY ---');
    console.log(`Manager: ${name}`);
    console.log(`Venue: ${venueName} (${venueType})`);
    console.log(`Address: ${address}`);
    console.log(`Contact: ${phone} | ${email}`);
    console.log('---------------------------------------');

    // In production, this can also forward an email via Resend/Sendgrid or insert into Prisma
    return NextResponse.json({
      success: true,
      message: 'Demande partenaire enregistrée avec succès.',
    });
  } catch (error) {
    console.error('Error handling partner inquiry:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

