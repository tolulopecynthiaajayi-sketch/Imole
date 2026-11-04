"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import BottomNav from '@/components/BottomNav';
import { findStationByQrOrSn } from '@/lib/stationsConfig';

function LandingPageContent() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawKiosk = searchParams.get('station') || searchParams.get('kiosk') || 'H00000147A';
  const isFr = lang === 'fr';

  const stationData = findStationByQrOrSn(rawKiosk);
  const stationName = stationData 
    ? (isFr ? stationData.name : stationData.nameEn)
    : (isFr ? `Borne Lille #${rawKiosk}` : `Lille Station #${rawKiosk}`);

  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) {
      alert(isFr ? "Veuillez accepter les conditions d'utilisation." : "Please accept the Terms of Service.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kiosk_id: rawKiosk }),
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setTimeout(() => {
          router.push(`/active?kiosk=${rawKiosk}`);
        }, 600);
      }
    } catch {
      router.push(`/active?kiosk=${rawKiosk}`);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 10% 12%, rgba(255, 184, 0, 0.14) 0%, transparent 40%),
        radial-gradient(circle at 85% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
        linear-gradient(180deg, #120224 0%, #1A0430 100%)
      `,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1.25rem 6.5rem 1.25rem',
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
          marginBottom: '1.25rem',
        }}>
          <ImoleLogo size="md" />
          <LanguageToggle variant="dark" />
        </header>

        {/* Live Station Beacon Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          padding: '7px 16px',
          marginBottom: '1.15rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600 }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
              display: 'inline-block',
            }} />
            <span style={{ letterSpacing: '-0.01em' }}>{stationName}</span>
          </div>
          <span style={{
            fontSize: '0.72rem',
            color: '#34D399',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {isFr ? 'Prête' : 'Ready'}
          </span>
        </div>

        {/* Hero Visual Card: The Luxury Power Bank Showcase */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(48, 14, 88, 0.4) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '1.4rem',
          border: '1px solid rgba(255, 184, 0, 0.25)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 184, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.15rem',
        }}>
          {/* Subtle Ambient Radial Orb */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 184, 0, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Top Row: Battery Specs Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 184, 0, 0.16)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              color: '#FFB800',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}>
              ⚡ 6000 mAh
            </span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
              {isFr ? 'Charge Ultra-Rapide' : 'Ultra-Fast Charge'}
            </span>
          </div>

          {/* Hero Headline */}
          <h1 style={{ fontSize: '1.55rem', fontWeight: 800, lineHeight: 1.22, margin: '0 0 0.35rem 0', color: '#FFFFFF' }}>
            {isFr ? 'Rechargez immédiatement' : 'Instant Power On The Go'}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
            {isFr 
              ? 'Aucun câble à prévoir : 3 connecteurs sont intégrés à la batterie.'
              : 'No cable needed: 3 fast-charge cables are built directly in.'}
          </p>

          {/* 3 Built-in Cable Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#FFD700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              ⚡ Lightning (iPhone)
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#FFD700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              ⚡ USB-C (Android / Mac)
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#FFD700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              ⚡ Micro-USB
            </span>
          </div>
        </div>

        {/* Pricing Card: Unified luxury dark glass, 14,99 cap */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          marginBottom: '1.15rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase' }}>
              {isFr ? 'Tarification' : 'Pricing'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
              {isFr ? 'Plafond 24h garanti' : 'Guaranteed 24h Cap'}
            </span>
          </div>

          {/* 3 Fluid Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{
              background: 'rgba(255, 184, 0, 0.12)',
              border: '1.5px solid rgba(255, 184, 0, 0.35)',
              padding: '10px 6px',
              borderRadius: '14px',
              textAlign: 'center',
            }}>
              <strong style={{ display: 'block', fontSize: '1.2rem', color: '#FFB800', fontWeight: 800 }}>
                2,49 €
              </strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.2 }}>
                {isFr ? '1ère heure' : '1st hour'}
              </span>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 6px',
              borderRadius: '14px',
              textAlign: 'center',
            }}>
              <strong style={{ display: 'block', fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800 }}>
                1,99 €
              </strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.2 }}>
                {isFr ? '/ h suppl.' : '/ add. hr'}
              </span>
            </div>

            <div style={{
              background: 'rgba(255, 184, 0, 0.12)',
              border: '1.5px solid rgba(255, 184, 0, 0.35)',
              padding: '10px 6px',
              borderRadius: '14px',
              textAlign: 'center',
            }}>
              <strong style={{ display: 'block', fontSize: '1.2rem', color: '#FFB800', fontWeight: 800 }}>
                14,99 €
              </strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.2 }}>
                {isFr ? 'Plafond 24h' : '24h Max Cap'}
              </span>
            </div>
          </div>

          {/* Deposit Guarantee Note */}
          <div style={{
            marginTop: '0.85rem',
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.4,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
            <span>
              {isFr 
                ? 'Empreinte de caution : 24,99 € temporairement réservée, ajustée à la restitution.'
                : 'Security hold: €24.99 temporarily held, released automatically when returned.'}
            </span>
          </div>
        </div>

        {/* Station Finder & Return Card Trigger */}
        <button
          type="button"
          onClick={() => router.push(`/stations?station=${rawKiosk}`)}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '18px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s ease',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'rgba(255, 184, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#FFB800',
              flexShrink: 0,
            }}>
              🗺️
            </span>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF' }}>
                {isFr ? 'Bornes IMỌLẸ à Lille & Restitution' : 'IMỌLẸ Stations in Lille & Returns'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#FFB800', fontWeight: 600 }}>
                {isFr ? 'Voir la carte des bornes & places libres →' : 'View stations & free return slots →'}
              </span>
            </div>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '1rem' }}>›</span>
        </button>
      </div>

      {/* Bottom Sticky Action Area */}
      <div>
        {/* Pay Now Button with Golden Ambient Sheen */}
        <button
          onClick={handlePay}
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            border: 'none',
            borderRadius: '9999px',
            padding: '1.15rem 1.5rem',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 30px rgba(255, 184, 0, 0.35), 0 0 20px rgba(255, 167, 81, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {isLoading ? (
            <span>{isFr ? 'Paiement en cours...' : 'Processing payment...'}</span>
          ) : (
            <>
              <span>⚡</span>
              <span>{isFr ? 'Payer maintenant • 2,49 €' : 'Pay Now • €2.49'}</span>
            </>
          )}
        </button>

        {/* Accepted Payment Micro Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '0.75rem',
          fontSize: '0.72rem',
          color: 'rgba(255, 255, 255, 0.65)',
          fontWeight: 600,
        }}>
          <span> Apple Pay</span>
          <span>•</span>
          <span>Google Pay</span>
          <span>•</span>
          <span>CB / Visa / Mastercard</span>
        </div>

        {/* Terms Agreement Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.65rem' }}>
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#FFB800', cursor: 'pointer' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)', cursor: 'pointer' }}>
            {isFr 
              ? 'J\'accepte les CGU et l\'empreinte temporaire de 24,99 €.'
              : 'I accept the Terms and the €24.99 temporary security hold.'}
          </label>
        </div>
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
