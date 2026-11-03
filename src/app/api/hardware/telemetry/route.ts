import { NextResponse } from 'next/server';
import { getStationBatteries, findBestAvailableBattery } from '@/lib/hardwareApi';

export async function GET() {
  try {
    const slots = await getStationBatteries();
    const bestBattery = await findBestAvailableBattery();

    return NextResponse.json({
      success: true,
      data: {
        slots,
        bestBattery,
        totalSlots: slots.length,
        availableCount: slots.filter(s => s.occupy === 1 && s.battery_id).length,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

