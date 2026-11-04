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
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 15% 12%, rgba(255, 184, 0, 0.15) 0%, transparent 45%),
        radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.18) 0%, transparent 50%),
        linear-gradient(180deg, #120224 0%, #17032E 100%)
      `,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: '#FFFFFF',
      position: 'relative',
    }}>
      {/* Top Header */}
      <div>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}>
          <ImoleLogo size="md" light={true} />
          <LanguageToggle variant="dark" />
        </header>

        {/* Live Status Line (No heavy box) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '2rem',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 10px #10B981',
            display: 'inline-block',
          }} />
          <span style={{ fontWeight: 600 }}>
            {isFr ? 'Location Active' : 'Active Rental'}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.78rem' }}>
            {batteryId} (6000 mAh)
          </span>
        </div>

        {/* Floating Timer Hero (Open, NO card box!) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}>
          {/* Luminous Golden Circular Timer */}
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 184, 0, 0.12) 0%, rgba(18, 2, 36, 0.85) 70%)',
            border: '4px solid #FFB800',
            boxShadow: '0 0 45px rgba(255, 184, 0, 0.3), inset 0 0 25px rgba(255, 184, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            marginBottom: '1.5rem',
          }}>
            <span style={{
              fontSize: '2.35rem',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}>
              {formatTime(elapsedMs)}
            </span>
            <span style={{
              fontSize: '0.78rem',
              color: '#34D399',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              {isFr ? 'Batterie en cours d\'utilisation' : 'Power bank in use'}
            </span>
          </div>

          {/* Cost Accumulator (Clean typography, NO box around it) */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '0.3rem',
            }}>
              <span style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#FFB800',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {calculateCost(elapsedMs)} €
              </span>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                {isFr ? 'coût actuel' : 'current cost'}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              {isFr ? '1ère heure incluse • Plafond 24h bloqué à 14,99 €' : '1st hour included • 24h cap strictly at €14.99'}
            </div>
          </div>
        </div>

        {/* Clean Divider */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.75rem',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
            {isFr ? 'Restitution dans n\'importe quelle borne' : 'Return to Any Station'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
            {isFr 
              ? 'Glissez simplement la batterie dans n\'importe quel emplacement libre d\'une borne IMỌLẸ à Lille jusqu\'au clic audible : la location s\'arrête et votre caution est débloquée automatiquement.'
              : 'Slide the battery into any empty slot on any IMỌLẸ kiosk in Lille until it clicks: rental ends and your hold is released.'}
          </p>

          {/* Station Locator CTA */}
          <button
            onClick={() => router.push(`/stations${kioskId ? `?station=${kioskId}` : ''}`)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
              color: '#120224',
              border: 'none',
              borderRadius: '9999px',
              padding: '1.1rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(255, 184, 0, 0.3)',
              marginBottom: '1rem',
            }}
          >
            <span>🗺️</span>
            <span>{isFr ? 'Trouver une borne de retour à Lille' : 'Find a Return Station in Lille'}</span>
          </button>

          {/* Simulation Test Trigger (Understated, clean) */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSimulateReturn}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              {isFr ? 'Tester la restitution (Simulation)' : 'Test Return (Simulation)'}
            </button>
          </div>
        </div>
      </div>

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
