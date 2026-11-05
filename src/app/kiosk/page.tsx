import type { Metadata } from 'next';
import InteractiveKioskDisplay from '@/components/InteractiveKioskDisplay';

export const metadata: Metadata = {
  title: 'IMỌLẸ Kiosk Display',
  description: 'Attract screen for IMỌLẸ power bank stations',
};

export default async function KioskPage({
  searchParams,
}: {
  searchParams: Promise<{ kiosk?: string; test?: string }>;
}) {
  const params = await searchParams;
  const kiosk = params.kiosk || 'H00000147A';
  const isTest = params.test === '1';

  if (isTest) {
    return <InteractiveKioskDisplay kioskParam={kiosk} />;
  }

  // Pure zero-JS native display for Android Kiosk WebView
  // Delivers 100% rock-solid stability to prevent Android WebView memory crash loops
  const imageSrc = kiosk === 'H00000146A' ? '/kiosk-2.png' : '/kiosk-1.png';

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#120224',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt="IMỌLẸ Power Bank Sharing"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'fill',
          display: 'block',
          border: 'none',
        }}
      />
    </main>
  );
}
