"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';

function LandingPageContent() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('kiosk');
  const isFr = lang === 'fr';
  
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
          marginBottom: '1.25rem',
        }}>
          <ImoleLogo size="md" />
          <LanguageToggle variant="light" />
        </header>

        {/* Hero Visual Card: The Power Bank Showcase */}
        <div style={{
          background: 'linear-gradient(135deg, #240540 0%, #3B0F6B 100%)',
          borderRadius: '24px',
          padding: '1.5rem',
          color: '#FFFFFF',
          boxShadow: '0 12px 36px rgba(36, 5, 64, 0.22)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.25rem',
        }}>
          {/* Subtle background ambient glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 184, 0, 0.25) 0%, transparent 70%)',
          }} />

          {/* Status Pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34D399',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' }} />
              {isFr ? 'Batterie Disponible • 100%' : 'Battery Available • 100%'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
              5000 mAh
            </span>
          </div>

          {/* Catchphrase */}
          <h1 style={{ fontSize: '1.55rem', fontWeight: 800, lineHeight: 1.2, margin: '0 0 0.5rem 0' }}>
            {isFr ? 'Rechargez votre téléphone immédiatement' : 'Charge your phone right now'}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', margin: 0, lineHeight: 1.4 }}>
            {isFr 
              ? 'Aucun câble à prévoir : 3 câbles de recharge rapide sont directement intégrés.'
              : 'No cable needed: 3 fast-charge cables are built directly into the battery.'}
          </p>

          {/* 3 Built-in Cable Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '5px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, color: '#FFB800' }}>
              ⚡ Lightning (iPhone)
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '5px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, color: '#FFB800' }}>
              ⚡ USB-C (Android / iPad)
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '5px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, color: '#FFB800' }}>
              ⚡ Micro-USB
            </span>
          </div>
        </div>

        {/* Pricing Transparency Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid #EBE9F5',
          boxShadow: '0 4px 20px rgba(36, 5, 64, 0.05)',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>
              {isFr ? 'Tarification' : 'Pricing'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
              {isFr ? 'Sans abonnement' : 'No Subscription'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ background: '#FAF7FD', padding: '10px 8px', borderRadius: '12px', textAlign: 'center', border: '1.5px solid rgba(48, 14, 88, 0.2)' }}>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: '#300E58', fontWeight: 800 }}>2,49 €</strong>
              <span style={{ fontSize: '0.68rem', color: '#6B7280', lineHeight: 1.2 }}>{isFr ? '1ère heure' : '1st hour'}</span>
            </div>

            <div style={{ background: '#F9FAFB', padding: '10px 8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: '#111827', fontWeight: 800 }}>1,99 €</strong>
              <span style={{ fontSize: '0.68rem', color: '#6B7280', lineHeight: 1.2 }}>{isFr ? '/ h suppl.' : '/ add. hr'}</span>
            </div>

            <div style={{ background: '#F9FAFB', padding: '10px 8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: '#111827', fontWeight: 800 }}>12,99 €</strong>
              <span style={{ fontSize: '0.68rem', color: '#6B7280', lineHeight: 1.2 }}>{isFr ? 'Plafond 24h' : '24h Max Cap'}</span>
            </div>
          </div>

          {/* Deposit Guarantee */}
          <div style={{
            marginTop: '0.9rem',
            padding: '8px 10px',
            borderRadius: '10px',
            background: '#F9FAFB',
            fontSize: '0.75rem',
            color: '#4B5563',
            lineHeight: 1.35,
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
      </div>

      {/* Bottom Sticky Action Area */}
      <div>
        {/* Apple Pay / Google Pay / Card Button */}
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
            fontSize: '1.05rem',
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
            <span>{isFr ? 'Déverrouillage en cours...' : 'Unlocking battery...'}</span>
          ) : (
            <>
              <span>⚡</span>
              <span>{isFr ? 'Déverrouiller avec Apple Pay / CB' : 'Unlock with Apple Pay / Card'}</span>
            </>
          )}
        </button>

        {/* Terms Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.85rem' }}>
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#300E58', cursor: 'pointer' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.72rem', color: '#6B7280', cursor: 'pointer' }}>
            {isFr 
              ? 'J\'accepte les CGU et l\'empreinte temporaire de 24,99 €.'
              : 'I accept the Terms and the €24.99 temporary security hold.'}
          </label>
        </div>

        {/* Security Reassurance */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '1rem',
          fontSize: '0.72rem',
          color: '#9CA3AF',
        }}>
          <span>🔒 Paiement SSL Chiffré</span>
          <span>•</span>
          <span>⚡ Batteries Certifiées CE</span>
          <span>•</span>
          <span>✓ Retour Simple</span>
        </div>
      </div>
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
