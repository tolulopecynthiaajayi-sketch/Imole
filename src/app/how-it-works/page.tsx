"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import BottomNav from '@/components/BottomNav';

function HowItWorksContent() {
  const { lang } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('kiosk') || searchParams.get('station');
  const isFr = lang === 'fr';

  const returnUrl = kioskId ? `/?station=${kioskId}` : '/';

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
      {/* Top Bar with Back Button */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        <button
          onClick={() => router.push(returnUrl)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFB800',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span>←</span>
          <span>{isFr ? 'Retour' : 'Back'}</span>
        </button>

        <ImoleLogo size="sm" />
        <LanguageToggle variant="dark" />
      </header>

      {/* Hero Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'rgba(255, 184, 0, 0.14)',
          border: '1px solid rgba(255, 184, 0, 0.3)',
          color: '#FFB800',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.5rem',
        }}>
          💡 {isFr ? 'Guide Réseau & Restitution • Lille' : 'Network & Return Guide • Lille'}
        </span>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, color: '#FFFFFF', margin: '0 0 0.4rem 0' }}>
          {isFr ? 'Comment utiliser & restituer votre batterie' : 'How to use & return your power bank'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', margin: 0, lineHeight: 1.45 }}>
          {isFr 
            ? 'Empruntez en 30 secondes, rechargez librement à Lille, et restituez dans n\'importe quelle borne partenaire.'
            : 'Borrow in 30 seconds, charge on the go in Lille, and return at any partner kiosk.'}
        </p>
      </div>

      {/* 4 Illustrated Luxury Dark Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
        
        {/* Step 1 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            flexShrink: 0,
          }}>
            1
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#FFFFFF' }}>
              {isFr ? 'Scannez & Déverrouillez en 1 clic' : 'Scan & Unlock in 1 Tap'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.72)', margin: 0, lineHeight: 1.4 }}>
              {isFr 
                ? 'Scannez le QR code de la borne avec votre appareil photo. Validez par Apple Pay, Google Pay ou Carte Bancaire. La batterie s\'éjecte automatiquement du slot.'
                : 'Scan the station QR code with your camera. Confirm with Apple Pay, Google Pay, or Card. A 6000 mAh battery pops out automatically.'}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            flexShrink: 0,
          }}>
            2
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#FFFFFF' }}>
              {isFr ? '3 câbles intégrés • 6000 mAh' : '3 Built-In Fast Cables • 6000 mAh'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.72)', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
              {isFr 
                ? 'Inutile d\'avoir votre propre câble. Tirez simplement le connecteur adapté directement depuis la batterie :'
                : 'No cable needed. Pull the connector directly from the battery chassis:'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFD700', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ Lightning (iPhone)
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFD700', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ USB-C (Android / Mac)
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFD700', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ Micro-USB
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: THE RETURN HIGHLIGHT */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.12) 0%, rgba(48, 14, 88, 0.5) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '1.35rem',
          border: '1.5px solid #10B981',
          boxShadow: '0 12px 36px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: '#10B981',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 800,
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          }}>
            📍
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#FFFFFF' }}>
              {isFr ? 'Restitution dans N\'IMPORTE QUELLE borne' : 'Return to ANY Station'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
              {isFr 
                ? 'Vous n\'avez pas besoin de revenir au point de départ ! Déposez la batterie dans n\'importe quelle borne IMỌLẸ à Lille (Grand Place, Gare Lille Flandres, etc.).'
                : 'You do not have to return to the original spot! Simply drop it into any IMỌLẸ station across Lille (Grand Place, Lille Flandres, etc.).'}
            </p>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: '0.78rem',
              color: '#34D399',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>✓</span>
              <span>{isFr ? 'Insérez jusqu\'au clic audible : location terminée immédiatement.' : 'Push firmly until it clicks: rental stops immediately.'}</span>
            </div>
          </div>
        </div>

        {/* Step 4: PRICING & DEPOSIT CLARITY */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            flexShrink: 0,
          }}>
            4
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#FFFFFF' }}>
              {isFr ? 'Tarification & Caution Débloquée' : 'Pricing & Deposit Released'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.72)', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
              {isFr ? 'Vous ne payez que ce que vous consommez :' : 'You are only charged for actual usage:'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 184, 0, 0.12)', border: '1px solid rgba(255, 184, 0, 0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#FFB800', fontWeight: 800 }}>2,49 €</strong>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>{isFr ? '1ère heure' : '1st hour'}</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#FFFFFF', fontWeight: 800 }}>1,99 €</strong>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>{isFr ? '/ h suppl.' : '/ add. hr'}</span>
              </div>
              <div style={{ background: 'rgba(255, 184, 0, 0.12)', border: '1px solid rgba(255, 184, 0, 0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#FFB800', fontWeight: 800 }}>14,99 €</strong>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>{isFr ? 'Plafond 24h' : '24h Max Cap'}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: 1.35 }}>
              🛡️ {isFr 
                ? 'L\'empreinte bancaire de 24,99 € est une simple retenue de garantie temporaire. Dès que la batterie est enclenchée dans une borne, le montant réel est débité et le reste est libéré immédiatement.'
                : 'The €24.99 security hold is a temporary pre-authorization. Once returned to any kiosk, only actual rental is charged and the remaining hold is released.'}
            </p>
          </div>
        </div>
      </div>

      {/* Direct Link to Station Finder */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '1.25rem',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        marginBottom: '1.75rem',
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
          🗺️ {isFr ? 'Où trouver les bornes à Lille ?' : 'Where to find stations in Lille?'}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.72)', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
          {isFr 
            ? 'Consultez la carte des stations en direct pour voir les batteries disponibles et les emplacements de retour libres.'
            : 'Check the live station map to see available batteries and free return slots in real-time.'}
        </p>

        <button
          onClick={() => router.push(`/stations${kioskId ? `?station=${kioskId}` : ''}`)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>📍</span>
          <span>{isFr ? 'Voir les bornes à Lille' : 'View Stations in Lille'}</span>
        </button>
      </div>

      <BottomNav activeTab="history" />
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <HowItWorksContent />
    </Suspense>
  );
}
