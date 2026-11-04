"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';

function LandingPageContent() {
  const { lang } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('station') || searchParams.get('kiosk') || 'H00000147A';
  const isFr = lang === 'fr';
  
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
        body: JSON.stringify({ kiosk_id: kioskId }),
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setTimeout(() => {
          router.push(`/active?kiosk=${kioskId}`);
        }, 600);
      }
    } catch {
      router.push(`/active?kiosk=${kioskId}`);
    }
  };

  return (
    <div style={{
      maxWidth: '430px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#FAF9FE',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1.25rem 2rem 1.25rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      position: 'relative',
    }}>
      {/* Top Header */}
      <div>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          <ImoleLogo size="md" />
          <LanguageToggle variant="light" />
        </header>

        {/* Station Location Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          border: '1px solid #ECEAF5',
          borderRadius: '9999px',
          padding: '6px 14px',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(48, 14, 88, 0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)',
              display: 'inline-block',
            }} />
            <span>{isFr ? `Borne #${kioskId}` : `Station #${kioskId}`}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
            {isFr ? 'Prête à l\'éjection' : 'Ready to eject'}
          </span>
        </div>

        {/* Hero Visual Card: The Luxury Power Bank Showcase */}
        <div style={{
          background: 'linear-gradient(145deg, #1A0430 0%, #350A5E 100%)',
          borderRadius: '24px',
          padding: '1.35rem',
          color: '#FFFFFF',
          boxShadow: '0 16px 40px rgba(36, 5, 64, 0.28)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}>
          {/* Subtle background ambient glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 184, 0, 0.28) 0%, transparent 70%)',
          }} />

          {/* Top Row: Specs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 184, 0, 0.15)',
              border: '1px solid rgba(255, 184, 0, 0.35)',
              color: '#FFB800',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}>
              ⚡ 6000 mAh
            </span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
              {isFr ? 'Charge Ultra-Rapide' : 'Fast Charge'}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1.25, margin: '0 0 0.4rem 0' }}>
            {isFr ? 'Rechargez immédiatement' : 'Instant Power On The Go'}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 0.9rem 0', lineHeight: 1.35 }}>
            {isFr 
              ? '3 câbles haute vitesse directement intégrés dans la batterie :'
              : '3 high-speed cables built directly into the battery:'}
          </p>

          {/* 3 Built-in Cable Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#FFD700',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              ⚡ Lightning (iPhone)
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#FFD700',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              ⚡ USB-C (Android / Mac)
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#FFD700',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              ⚡ Micro-USB
            </span>
          </div>
        </div>

        {/* Pricing Card: Clear, decluttered, 14,99 cap */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.15rem 1.25rem',
          border: '1px solid #ECEAF5',
          boxShadow: '0 4px 20px rgba(48, 14, 88, 0.05)',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>
              {isFr ? 'Tarification' : 'Pricing'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
              {isFr ? 'Plafond 24h garanti' : 'Guaranteed 24h Cap'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ background: '#FAF7FD', padding: '10px 6px', borderRadius: '12px', textAlign: 'center', border: '1.5px solid rgba(48, 14, 88, 0.2)' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', color: '#300E58', fontWeight: 800 }}>2,49 €</strong>
              <span style={{ fontSize: '0.68rem', color: '#6B7280', lineHeight: 1.2 }}>{isFr ? '1ère heure' : '1st hour'}</span>
            </div>

            <div style={{ background: '#F9FAFB', padding: '10px 6px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', color: '#111827', fontWeight: 800 }}>1,99 €</strong>
              <span style={{ fontSize: '0.68rem', color: '#6B7280', lineHeight: 1.2 }}>{isFr ? '/ h suppl.' : '/ add. hr'}</span>
            </div>

            <div style={{ background: '#FAF7FD', padding: '10px 6px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(48, 14, 88, 0.15)' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', color: '#300E58', fontWeight: 800 }}>14,99 €</strong>
              <span style={{ fontSize: '0.68rem', color: '#6B7280', lineHeight: 1.2 }}>{isFr ? 'Plafond 24h' : '24h Max Cap'}</span>
            </div>
          </div>

          {/* Deposit Guarantee */}
          <div style={{
            marginTop: '0.85rem',
            padding: '8px 10px',
            borderRadius: '10px',
            background: '#F9FAFB',
            fontSize: '0.73rem',
            color: '#4B5563',
            lineHeight: 1.35,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span>
              {isFr 
                ? 'Empreinte de caution : 24,99 € temporairement réservée, ajustée à la restitution.'
                : 'Security hold: €24.99 temporarily held, released automatically when returned.'}
            </span>
          </div>
        </div>

        {/* Quick Link Card: Return & How It Works */}
        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          style={{
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.15s ease',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#FAF7FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              color: '#300E58',
              flexShrink: 0,
            }}>
              📍
            </span>
            <div>
              <strong style={{ display: 'block', fontSize: '0.82rem', color: '#111827' }}>
                {isFr ? 'Restitution dans n\'importe quelle borne' : 'Return to any partner station'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#300E58', fontWeight: 600 }}>
                {isFr ? 'Comment ça marche & guide de retour →' : 'How it works & return guide →'}
              </span>
            </div>
          </div>
          <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>›</span>
        </button>
      </div>

      {/* Bottom Sticky Action Area */}
      <div>
        {/* Pay Now Button */}
        <button
          onClick={handlePay}
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1A0430 0%, #300E58 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '1.1rem 1.5rem',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 24px rgba(48, 14, 88, 0.3)',
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
          marginTop: '0.75rem',
          fontSize: '0.72rem',
          color: '#6B7280',
          fontWeight: 600,
        }}>
          <span> Apple Pay</span>
          <span>•</span>
          <span>Google Pay</span>
          <span>•</span>
          <span>CB / Visa / Mastercard</span>
        </div>

        {/* Terms Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.65rem' }}>
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#300E58', cursor: 'pointer' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.72rem', color: '#6B7280', cursor: 'pointer' }}>
            {isFr 
              ? 'J\'accepte les CGU et l\'empreinte temporaire de 24,99 €.'
              : 'I accept the Terms and the €24.99 temporary security hold.'}
          </label>
        </div>
      </div>

      {/* Guide Bottom Sheet / Modal */}
      {showGuideModal && (
        <div 
          onClick={() => setShowGuideModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '1.5rem 1.25rem 2rem 1.25rem',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Handle */}
            <div style={{
              width: '40px',
              height: '4px',
              borderRadius: '9999px',
              backgroundColor: '#E5E7EB',
              margin: '0 auto 1.25rem auto',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {isFr ? 'Restitution & Utilisation' : 'Returns & How It Works'}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#6B7280',
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick 3 Steps in Modal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FAF7FD', color: '#300E58', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>1</span>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#111827' }}>
                    {isFr ? 'Éjection automatique' : 'Instant Automatic Ejection'}
                  </strong>
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                    {isFr ? 'Après paiement, la borne clignote et libère la batterie immédiatement.' : 'After payment, the slot flashes and unlocks your battery instantly.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FAF7FD', color: '#300E58', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>2</span>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#111827' }}>
                    {isFr ? 'Chargez n\'importe où' : 'Charge anywhere'}
                  </strong>
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                    {isFr ? '3 câbles intégrés (Lightning, USB-C, Micro-USB) et 6000 mAh de capacité.' : '3 built-in cables (Lightning, USB-C, Micro-USB) with 6000 mAh.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#ECFDF5', padding: '10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>✓</span>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#065F46' }}>
                    {isFr ? 'Restitution dans TOUTE borne du réseau' : 'Return to ANY station in the network'}
                  </strong>
                  <p style={{ fontSize: '0.78rem', color: '#047857', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                    {isFr 
                      ? 'Insérez la batterie dans n\'importe quel emplacement libre d\'une borne IMỌLẸ jusqu\'au clic. La location s\'arrête et votre caution est débloquée.'
                      : 'Push the battery into any empty slot on any IMỌLẸ station until it clicks. Rental ends and deposit is released.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Link to Full Page Guide */}
            <button
              type="button"
              onClick={() => {
                setShowGuideModal(false);
                router.push(`/how-it-works?station=${kioskId}`);
              }}
              style={{
                width: '100%',
                background: '#FAF7FD',
                border: '1.5px solid rgba(48, 14, 88, 0.2)',
                borderRadius: '12px',
                padding: '10px',
                color: '#300E58',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              {isFr ? 'Consulter le guide complet & FAQ →' : 'Read full guide & FAQ →'}
            </button>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              style={{
                width: '100%',
                background: '#300E58',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {isFr ? 'Fermer' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
