"use client";

import { useI18n } from '@/components/I18nProvider';

export default function KioskAttractScreen() {
  const { t } = useI18n();

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
        
        <h1 className="text-brand" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1.1 }}>
          {t('lowBattery')}
        </h1>
        
        <h2 style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>
          {t('scanToStart')}
        </h2>
        
        <div className="card" style={{ display: 'inline-block', padding: '1.5rem', marginTop: '1rem', backgroundColor: 'var(--surface-color)' }}>
          <p className="text-xl text-bold text-brand">{t('pricingTerms')}</p>
        </div>
      </div>

      {/* Right side: QR Code */}
      <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          width: '400px', 
          height: '400px', 
          backgroundColor: '#FFFFFF', 
          border: '4px solid var(--primary-brand)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <span className="text-muted" style={{ fontSize: '1.5rem' }}>[ QR Code Placeholder ]</span>
        </div>
      </div>
    </main>
  );
}
