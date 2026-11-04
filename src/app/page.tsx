"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import BottomNav from '@/components/BottomNav';
import { findStationByQrOrSn } from '@/lib/stationsConfig';

function LandingPageContent() {
  const { lang } = useI18n();
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
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 15% 10%, rgba(255, 184, 0, 0.15) 0%, transparent 45%),
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

        {/* Discreet Live Station Indicator (No heavy bordered box) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '1.75rem',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 10px #10B981',
            display: 'inline-block',
          }} />
          <span style={{ fontWeight: 600 }}>{stationName}</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#34D399', fontWeight: 700, fontSize: '0.78rem' }}>
            {isFr ? 'Prête' : 'Ready'}
          </span>
        </div>

        {/* Breathable, Elegant Hero Section (Open typography, NO card box!) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 0.85rem 0',
            color: '#FFFFFF',
          }}>
            {isFr ? 'Rechargez en toute liberté.' : 'Power up on the go.'}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5,
            margin: '0 0 1.25rem 0',
          }}>
            {isFr
              ? 'Batterie universelle 6000 mAh avec 3 câbles rapides intégrés :'
              : 'Universal 6000 mAh power bank with 3 built-in fast cables:'}
          </p>

          {/* Minimalist, Elegant Cable Line (No heavy badges) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFD700',
          }}>
            <span>⚡ Lightning (iPhone)</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>•</span>
            <span>⚡ USB-C</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>•</span>
            <span>⚡ Micro-USB</span>
          </div>
        </div>

        {/* Single Pricing Section (Spacious, transparent, NO 5 nested boxes!) */}
        <div style={{
          padding: '1.5rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            marginBottom: '0.4rem',
          }}>
            <span style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#FFB800',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              2,49 €
            </span>
            <span style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.75)',
              fontWeight: 600,
            }}>
              {isFr ? 'pour la 1ère heure' : 'for the 1st hour'}
            </span>
          </div>

          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
          }}>
            {isFr ? 'puis 1,99 € / h • Plafond 24h bloqué à 14,99 €' : 'then €1.99 / hr • 24h cap strictly at €14.99'}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.45)',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>🛡️</span>
            <span>
              {isFr
                ? 'Empreinte de caution : 24,99 € (non débitée, ajustée à la restitution).'
                : 'Security hold: €24.99 (not charged, adjusted upon return).'}
            </span>
          </div>
        </div>

        {/* Understated, chic Station & Return link (No big heavy box) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => router.push(`/stations?station=${rawKiosk}`)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: '#FFB800',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'opacity 0.15s ease',
            }}
          >
            <span>🗺️</span>
            <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              {isFr ? 'Voir toutes les bornes à Lille & guide de retour' : 'View all stations in Lille & return guide'}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div>
        {/* Pay Now Button with Golden Sheen */}
        <button
          onClick={handlePay}
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            border: 'none',
            borderRadius: '9999px',
            padding: '1.2rem 1.5rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 12px 36px rgba(255, 184, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
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

        {/* Accepted Payment Logos */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '0.85rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.55)',
          fontWeight: 600,
        }}>
          <span> Apple Pay</span>
          <span>•</span>
          <span>Google Pay</span>
          <span>•</span>
          <span>CB / Visa / Mastercard</span>
        </div>

        {/* Terms Agreement Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.75rem' }}>
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#FFB800', cursor: 'pointer' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', cursor: 'pointer' }}>
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
