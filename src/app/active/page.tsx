"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import BottomNav from '@/components/BottomNav';
import LanguageToggle from '@/components/LanguageToggle';

function ActiveRentalContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('kiosk');
  
  const [elapsedMs, setElapsedMs] = useState(120000); // Start at 2 mins for immediate visual satisfaction
  const [batteryId] = useState('BAT-F20002DD6A');

  useEffect(() => {
    const start = Date.now() - 120000;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateCost = (ms: number) => {
    const hours = Math.ceil(ms / (1000 * 60 * 60));
    if (hours <= 1) return '2,49';
    const extraHours = hours - 1;
    const total = 2.49 + (extraHours * 1.99);
    if (hours <= 24) {
      return Math.min(total, 12.99).toFixed(2).replace('.', ',');
    }
    const day2Hours = hours - 24;
    return Math.min(12.99 + (day2Hours * 1.99), 24.99).toFixed(2).replace('.', ',');
  };

  const handleSimulateReturn = () => {
    router.push(`/receipt?duration=${Math.max(1, Math.round(elapsedMs / 60000))}&cost=${calculateCost(elapsedMs)}${kioskId ? `&kiosk=${kioskId}` : ''}`);
  };

  return (
    <div className="page-container animate-slide-up">
      {/* Brand Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <ImoleLogo size="md" />
        <LanguageToggle variant="light" />
      </header>

      {/* Main Active Timer Card */}
      <section className="fintech-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('liveTimerLabel')}
        </p>

        {/* Live Circular Glow Timer */}
        <div style={{
          margin: '1.25rem auto',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFFFFF 60%, #F5F0FC 100%)',
          border: '6px solid var(--primary-brand)',
          boxShadow: '0 0 30px rgba(48, 14, 88, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
        }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-brand)', fontFamily: 'monospace' }}>
            {formatTime(elapsedMs)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
            {t('chargingStatus')}
          </span>
        </div>

        {/* Cost Accumulator */}
        <div style={{ background: '#FAF7FD', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(48, 14, 88, 0.1)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {t('currentCostLabel')}
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-brand)', margin: '0.2rem 0' }}>
            {calculateCost(elapsedMs)} €
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {t('costExplain')}
          </span>
        </div>

        {/* Battery Details */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>N° Batterie : <strong>{batteryId}</strong></span>
        </div>
      </section>

      {/* Return Instructions Card */}
      <section className="fintech-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>📍</span> {t('howToReturnTitle')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', color: '#4B5563' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary-brand)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.75rem' }}>1</span>
            <span>{t('returnStep1')}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary-brand)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.75rem' }}>2</span>
            <span>{t('returnStep2')}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary-brand)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.75rem' }}>3</span>
            <span>{t('returnStep3')}</span>
          </div>
        </div>

        {/* Demo Return Trigger Button */}
        <button 
          onClick={handleSimulateReturn}
          style={{
            marginTop: '1.25rem',
            width: '100%',
            padding: '0.85rem',
            borderRadius: '12px',
            background: '#F3F4F6',
            color: '#374151',
            border: '1px solid #D1D5DB',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {t('testReturnBtn')}
        </button>
      </section>

      <BottomNav activeTab="home" />
    </div>
  );
}

export default function ActiveRentalDashboard() {
  return (
    <Suspense fallback={<div className="page-container">Chargement...</div>}>
      <ActiveRentalContent />
    </Suspense>
  );
}
