"use client";

import { useI18n } from '@/components/I18nProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { findStationByQrOrSn } from '@/lib/stationsConfig';
import { getStoredRental, ActiveRentalSession } from '@/lib/rentalSession';

function LandingPageContent() {
  const { lang } = useI18n();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawKiosk = searchParams.get('station') || searchParams.get('kiosk') || 'H00000147A';
  const isFr = lang === 'fr';
  const isDark = theme === 'dark';

  const [activeRental, setActiveRental] = useState<ActiveRentalSession | null>(null);

  useEffect(() => {
    const stored = getStoredRental();
    if (stored) {
      setActiveRental(stored);
    }
  }, []);

  const stationData = findStationByQrOrSn(rawKiosk);
  const stationName = stationData 
    ? (isFr ? stationData.name : stationData.nameEn)
    : (isFr ? `Borne Lille #${rawKiosk}` : `Lille Station #${rawKiosk}`);

  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  // Color Tokens based on strict 3-color palette
  const bgColor = isDark ? '#120224' : '#FAF9FE';
  const bgGradient = isDark
    ? `radial-gradient(circle at 15% 10%, rgba(255, 184, 0, 0.14) 0%, transparent 45%), linear-gradient(180deg, #120224 0%, #17032E 100%)`
    : `radial-gradient(circle at 15% 10%, rgba(255, 184, 0, 0.08) 0%, transparent 45%), linear-gradient(180deg, #FAF9FE 0%, #F3F1FA 100%)`;
  const textPrimary = isDark ? '#FFFFFF' : '#18042B';
  const textSecondary = isDark ? 'rgba(255, 255, 255, 0.72)' : '#6B7280';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.45)' : '#9CA3AF';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 4, 43, 0.08)';
  const accentGold = isDark ? '#FFB800' : '#B45309';

  return (
    <div style={{
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: bgColor,
      backgroundImage: bgGradient,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: textPrimary,
      position: 'relative',
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* Top Header */}
      <div>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}>
          <ImoleLogo size="md" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />
            <LanguageToggle variant="auto" />
          </div>
        </header>

        {/* Live Station Status (Simple text line, no box) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: textSecondary,
          marginBottom: activeRental ? '1.25rem' : '2rem',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 10px #10B981',
            display: 'inline-block',
          }} />
          <span style={{ fontWeight: 600, color: textPrimary }}>{stationName}</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.78rem' }}>
            {isFr ? 'Prête' : 'Ready'}
          </span>
        </div>

        {/* Active Rental Detected Alert (If user returns with active rental) */}
        {activeRental && (
          <div style={{
            background: isDark ? 'rgba(255, 184, 0, 0.08)' : 'rgba(180, 83, 9, 0.05)',
            border: `1.5px solid ${accentGold}`,
            borderRadius: '16px',
            padding: '1.1rem 1.15rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 10px #10B981',
                  display: 'inline-block',
                }} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: textPrimary }}>
                  {isFr ? 'Location active détectée' : 'Active Rental Detected'}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: accentGold, fontWeight: 700, fontFamily: 'monospace' }}>
                {activeRental.batteryId}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: textSecondary, lineHeight: 1.45 }}>
              {isFr
                ? 'Une batterie est déjà en cours d\'utilisation sur cet appareil. Pour la rendre, insérez-la simplement dans un emplacement libre avec voyant vert.'
                : 'A power bank is currently active on this device. To return it, simply insert it into any free slot with a green LED.'}
            </p>

            <button
              type="button"
              onClick={() => router.push(`/active?station=${rawKiosk}`)}
              style={{
                marginTop: '0.35rem',
                backgroundColor: accentGold,
                color: isDark ? '#120224' : '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span>{isFr ? 'Voir ma location active & le temps' : 'View active rental & timer'}</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Hero Section (Open, breathable typography, zero stacked boxes) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 0.85rem 0',
            color: textPrimary,
          }}>
            {isFr ? 'Rechargez en toute liberté.' : 'Power up on the go.'}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: textSecondary,
            lineHeight: 1.5,
            margin: '0 0 1.25rem 0',
          }}>
            {isFr
              ? 'Batterie universelle 6000 mAh avec 3 câbles rapides intégrés :'
              : 'Universal 6000 mAh power bank with 3 built-in fast cables:'}
          </p>

          {/* Minimalist cable markers (No heavy colored badges) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: accentGold,
          }}>
            <span>⚡ Lightning (iPhone)</span>
            <span style={{ opacity: 0.3, color: textSecondary }}>•</span>
            <span>⚡ USB-C</span>
            <span style={{ opacity: 0.3, color: textSecondary }}>•</span>
            <span>⚡ Micro-USB</span>
          </div>
        </div>

        {/* Pricing Section (Clean, spacious, single focal area) */}
        <div style={{
          padding: '1.5rem 0',
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
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
              color: accentGold,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              2,49 €
            </span>
            <span style={{
              fontSize: '1rem',
              color: textSecondary,
              fontWeight: 600,
            }}>
              {isFr ? 'pour la 1ère heure' : 'for the 1st hour'}
            </span>
          </div>

          <div style={{
            fontSize: '0.85rem',
            color: textSecondary,
            lineHeight: 1.4,
            marginBottom: '0.75rem',
          }}>
            {isFr ? 'puis 1,99 € / h • Plafond 24h bloqué à 14,99 €' : 'then €1.99 / hr • 24h cap strictly at €14.99'}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: textMuted,
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

        {/* Understated, chic Station & Return link (No box) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => router.push(`/stations?station=${rawKiosk}`)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: accentGold,
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
        {/* Action Button */}
        <button
          onClick={handlePay}
          disabled={isLoading}
          style={{
            width: '100%',
            background: isDark 
              ? 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)' 
              : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
            color: isDark ? '#120224' : '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '1.2rem 1.5rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: isDark 
              ? '0 12px 36px rgba(255, 184, 0, 0.35)' 
              : '0 12px 32px rgba(24, 4, 43, 0.25)',
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
              <span style={{ color: isDark ? '#120224' : '#FFB800' }}>⚡</span>
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
          color: textMuted,
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
            style={{ width: '15px', height: '15px', accentColor: isDark ? '#FFB800' : '#300E58', cursor: 'pointer' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.72rem', color: textMuted, cursor: 'pointer' }}>
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
