"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import BottomNav from '@/components/BottomNav';
import LanguageToggle from '@/components/LanguageToggle';

function ActiveRentalContent() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('station') || searchParams.get('kiosk');
  const isFr = lang === 'fr';
  
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
      return Math.min(total, 14.99).toFixed(2).replace('.', ',');
    }
    const day2Hours = hours - 24;
    return Math.min(14.99 + (day2Hours * 1.99), 24.99).toFixed(2).replace('.', ',');
  };

  const handleSimulateReturn = () => {
    router.push(`/receipt?duration=${Math.max(1, Math.round(elapsedMs / 60000))}&cost=${calculateCost(elapsedMs)}${kioskId ? `&kiosk=${kioskId}` : ''}`);
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 10% 15%, rgba(255, 184, 0, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
        linear-gradient(180deg, #120224 0%, #1A0430 100%)
      `,
      padding: '1.25rem 1.25rem 6.5rem 1.25rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: '#FFFFFF',
    }}>
      {/* Brand Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <ImoleLogo size="md" light={true} />
        <LanguageToggle variant="dark" />
      </header>

      {/* Main Active Timer Card */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 184, 0, 0.25)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 184, 0, 0.08)',
        textAlign: 'center',
        padding: '1.75rem 1.5rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#34D399',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '1rem',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          <span>{t('activeStatus')}</span>
        </div>

        {/* Live Circular Glow Timer */}
        <div style={{
          margin: '0.5rem auto 1.25rem auto',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 184, 0, 0.1) 0%, rgba(18, 2, 36, 0.8) 70%)',
          border: '4px solid #FFB800',
          boxShadow: '0 0 40px rgba(255, 184, 0, 0.35), inset 0 0 30px rgba(255, 184, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
        }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {formatTime(elapsedMs)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
            {t('chargingStatus')}
          </span>
        </div>

        {/* Cost Accumulator */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          padding: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)' }}>
            {t('currentCostLabel')}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFB800', margin: '0.2rem 0' }}>
            {calculateCost(elapsedMs)} €
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            {t('costExplain')}
          </span>
        </div>

        {/* Battery Details */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          <span>N° Batterie : <strong style={{ color: '#FFFFFF' }}>{batteryId}</strong> (6000 mAh)</span>
        </div>
      </section>

      {/* Return Instructions Card */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '1.25rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📍</span> {t('howToReturnTitle')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: '#FFB800', color: '#120224', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '0.75rem' }}>1</span>
            <span>{isFr ? 'Présentez-vous devant n\'importe quelle borne IMỌLẸ à Lille.' : 'Walk up to any IMỌLẸ station in Lille.'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: '#FFB800', color: '#120224', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '0.75rem' }}>2</span>
            <span>{isFr ? 'Insérez la batterie dans n\'importe quel emplacement libre jusqu\'au clic.' : 'Push the battery into any empty slot until it clicks.'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: '#10B981', color: '#FFFFFF', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '0.75rem' }}>✓</span>
            <span>{isFr ? 'La session prend fin et votre caution est débloquée immédiatement.' : 'Your session ends and your hold is released immediately.'}</span>
          </div>
        </div>

        {/* Find Station Button */}
        <button
          type="button"
          onClick={() => router.push(`/stations${kioskId ? `?station=${kioskId}` : ''}`)}
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '0.85rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(255, 184, 0, 0.25)',
          }}
        >
          <span>🗺️</span>
          <span>{isFr ? 'Trouver une borne de retour à Lille' : 'Find a Return Station in Lille'}</span>
        </button>

        {/* Demo Return Trigger Button */}
        <button 
          onClick={handleSimulateReturn}
          style={{
            marginTop: '0.65rem',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
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
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <ActiveRentalContent />
    </Suspense>
  );
}
