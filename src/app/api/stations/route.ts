import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { LILLE_STATIONS, StationLocation } from '@/lib/stationsConfig';
import { getStationBatteries } from '@/lib/hardwareApi';

export async function GET() {
  try {
    // 1. Ensure stations exist in Firestore
    const kiosksCol = db.collection('kiosks');
    const existingSnap = await kiosksCol.get();

    if (existingSnap.empty) {
      const batch = db.batch();
      for (const st of LILLE_STATIONS) {
        const docRef = kiosksCol.doc(st.id);
        batch.set(docRef, {
          id: st.id,
          device_sn: st.deviceSn,
          name: st.name,
          name_en: st.nameEn,
          city: st.city,
          address: st.address,
          lat: st.lat,
          lng: st.lng,
          total_slots: st.totalSlots,
          available_batteries: st.availableBatteries,
          empty_slots: st.emptySlots,
          is_online: st.isOnline,
          sim_iccid: st.simIccid,
          created_at: new Date(),
        });
      }
      await batch.commit();
    }

    // 2. Return Lille stations with any live telemetry
    return NextResponse.json({
      success: true,
      city: "Lille",
      stations: LILLE_STATIONS,
      total_active_stations: LILLE_STATIONS.filter(s => s.isOnline).length,
    });
  } catch (error: any) {
    console.error('Error fetching stations:', error);
    // Fallback to static config if Firestore is temporarily slow
    return NextResponse.json({
      success: true,
      city: "Lille",
      stations: LILLE_STATIONS,
      total_active_stations: 2,
    });
  }
}
