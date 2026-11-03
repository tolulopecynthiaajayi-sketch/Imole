"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImoleLogo from '@/components/ImoleLogo';
import TrustBadges from '@/components/TrustBadges';
import BottomNav from '@/components/BottomNav';
import LanguageToggle from '@/components/LanguageToggle';

function LandingPageContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('kiosk');
  
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) {
      alert("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kiosk_id: kioskId || 'H00000147A' }),
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setTimeout(() => {
          router.push(`/active${kioskId ? `?kiosk=${kioskId}` : ''}`);
        }, 600);
      }
    } catch {
      router.push(`/active${kioskId ? `?kiosk=${kioskId}` : ''}`);
    }
  };

  return (
    <div className="page-container animate-slide-up">
      {/* Brand Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <ImoleLogo size="md" />
        <LanguageToggle variant="light" />
      </header>

      {/* Hero Greeting */}
      <section style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('stationOnline')}
          </span>
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-brand)', lineHeight: 1.2 }}>
          {t('heroTitle')}
        </h1>
      </section>

      {/* Main Kiosk Station Card */}
      <section className="fintech-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 0.2rem 0' }}>
              {t('kioskCardTitle')}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <span>✓</span> {t('kioskCardSubtitle')}
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #300E58 0%, #46157E 100%)',
            color: '#FFFFFF',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(48, 14, 88, 0.25)'
          }}>
            5000 mAh
            <div style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: 500 }}>Fast Charge</div>
          </div>
        </div>

        {/* Cable Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="pill-cable">⚡ Lightning (iPhone)</span>
          <span className="pill-cable">⚡ USB-C (Android / Mac)</span>
          <span className="pill-cable">⚡ Micro-USB</span>
        </div>

        {/* Pricing Matrix */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t('pricingHeader')}
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div className="pill-tier" style={{ borderColor: 'rgba(48, 14, 88, 0.25)', background: '#FAF7FD' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-brand)' }}>{t('pricing1stHour')}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{t('pricing1stHourLabel')}</span>
            </div>
            <div className="pill-tier">
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{t('pricingSubsequent')}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{t('pricingSubsequentLabel')}</span>
            </div>
            <div className="pill-tier">
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{t('pricingDayCap')}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{t('pricingDayCapLabel')}</span>
            </div>
          </div>
        </div>

        {/* Caution Notice */}
        <div style={{
          background: '#F9FAFB',
          border: '1px dashed #D1D5DB',
          borderRadius: '12px',
          padding: '0.75rem 0.9rem',
          fontSize: '0.78rem',
          color: '#4B5563',
          lineHeight: 1.4,
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.1rem' }}>🛡️</span>
          <span>
            <strong>{t('depositNoticeTitle')}</strong> : {t('depositNoticeText')}
          </span>
        </div>
      </section>

      {/* Action Section */}
      <section style={{ marginBottom: '1.5rem' }}>
        <button 
          className="btn-primary-action" 
          onClick={handlePay} 
          disabled={isLoading}
        >
          {isLoading ? (
            <span>{t('unlocking')}</span>
          ) : (
            <>
              <span>⚡</span>
              <span>{t('unlockBtn')}</span>
            </>
          )}
        </button>

        {/* Consent Checkbox */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '1rem', padding: '0 0.25rem' }}>
          <input 
            type="checkbox" 
            id="terms" 
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ 
              marginTop: '0.15rem',
              width: '18px', 
              height: '18px', 
              accentColor: 'var(--primary-brand)', 
              cursor: 'pointer' 
            }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.35 }}>
            {t('termsConsent')}
          </label>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ marginBottom: '1.5rem' }}>
        <TrustBadges variant="light" />
      </section>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ justifyContent: 'center', textAlign: 'center' }}>Chargement...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
