"use client";

import { useI18n } from '@/components/I18nProvider';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Suspense } from 'react';

function KioskContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('kiosk') || 'H00000147A';
  const rentalUrl = `https://imole.fr/?kiosk=${kioskId}`;

  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'var(--bg-color)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem',
      gap: '4rem'
    }}>
      {/* Left side: Information */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="logo-placeholder" style={{ margin: 0, width: '180px', height: '60px', fontSize: '1.2rem' }}>
          IMỌLẸ Logo
        </div>
        
        <h1 className="text-brand" style={{ fontSize: '3.8rem', fontWeight: 700, lineHeight: 1.1 }}>
          {t('lowBattery')}
        </h1>
        
        <h2 style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>
          {t('scanToStart')}
        </h2>
        
        <div className="card" style={{ display: 'inline-block', padding: '1.5rem', marginTop: '1rem', backgroundColor: 'var(--surface-color)' }}>
          <p className="text-xl text-bold text-brand">{t('pricingTerms')}</p>
        </div>

        <p className="text-muted text-sm">
          Station: <strong style={{ color: 'var(--primary-brand)' }}>{kioskId}</strong>
        </p>
      </div>

      {/* Right side: Scannable QR Code */}
      <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          padding: '24px',
          backgroundColor: '#FFFFFF', 
          border: '4px solid var(--primary-brand)',
          borderRadius: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <QRCodeSVG 
            value={rentalUrl} 
            size={300}
            level="H"
            fgColor="#4B0082"
          />
        </div>
        <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}>
          Scannez avec l&apos;appareil photo de votre smartphone
        </span>
      </div>
    </main>
  );
}

export default function KioskAttractScreen() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>}>
      <KioskContent />
    </Suspense>
  );
}
