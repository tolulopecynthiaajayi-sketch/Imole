"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';

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
      backgroundColor: '#FAF9FE',
      padding: '1.25rem 1.25rem 3rem 1.25rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: '#111827',
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
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '9999px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#300E58',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span>←</span>
          <span>{isFr ? 'Retour' : 'Back'}</span>
        </button>

        <ImoleLogo size="sm" />
        <LanguageToggle variant="light" />
      </header>

      {/* Hero Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(48, 14, 88, 0.08)',
          color: '#300E58',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.5rem',
        }}>
          💡 {isFr ? 'Guide Réseau & Restitution' : 'Network & Return Guide'}
        </span>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, color: '#111827', margin: '0 0 0.4rem 0' }}>
          {isFr ? 'Comment utiliser & restituer votre batterie' : 'How to use & return your power bank'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
          {isFr 
            ? 'Empruntez en 30 secondes, rechargez librement dans Paris, et restituez dans n\'importe quelle borne partenaire.'
            : 'Borrow in 30 seconds, charge on the go in Paris, and return at any partner kiosk.'}
        </p>
      </div>

      {/* 4 Illustrated Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
        
        {/* Step 1 */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid #ECEAF5',
          boxShadow: '0 4px 16px rgba(48, 14, 88, 0.04)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #300E58 0%, #4E188C 100%)',
            color: '#FFB800',
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
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111827' }}>
              {isFr ? 'Scannez & Déverrouillez en 1 clic' : 'Scan & Unlock in 1 Tap'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#4B5563', margin: 0, lineHeight: 1.4 }}>
              {isFr 
                ? 'Scannez le QR code de la borne avec votre appareil photo. Validez par Apple Pay, Google Pay ou Carte Bancaire. La batterie s\'éjecte automatiquement du slot.'
                : 'Scan the station QR code with your camera. Confirm with Apple Pay, Google Pay, or Card. A 6000 mAh battery pops out automatically.'}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid #ECEAF5',
          boxShadow: '0 4px 16px rgba(48, 14, 88, 0.04)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #300E58 0%, #4E188C 100%)',
            color: '#FFB800',
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
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111827' }}>
              {isFr ? '3 câbles intégrés • 6000 mAh' : '3 Built-In Fast Cables • 6000 mAh'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#4B5563', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
              {isFr 
                ? 'Inutile d\'avoir votre propre câble. Tirez simplement le connecteur adapté directement depuis la batterie :'
                : 'No cable needed. Pull the connector directly from the battery chassis:'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ background: '#FAF7FD', border: '1px solid rgba(48, 14, 88, 0.15)', color: '#300E58', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ Lightning (iPhone)
              </span>
              <span style={{ background: '#FAF7FD', border: '1px solid rgba(48, 14, 88, 0.15)', color: '#300E58', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ USB-C (Android / Mac)
              </span>
              <span style={{ background: '#FAF7FD', border: '1px solid rgba(48, 14, 88, 0.15)', color: '#300E58', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ Micro-USB
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: THE RETURN HIGHLIGHT */}
        <div style={{
          background: 'linear-gradient(145deg, #FAF7FD 0%, #F3EDFB 100%)',
          borderRadius: '20px',
          padding: '1.35rem',
          border: '2px solid rgba(48, 14, 88, 0.25)',
          boxShadow: '0 8px 24px rgba(48, 14, 88, 0.08)',
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
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}>
            📍
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#300E58' }}>
                {isFr ? 'Restitution dans N\'IMPORTE QUELLE borne' : 'Return to ANY Station'}
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#374151', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
              {isFr 
                ? 'Vous n\'avez pas besoin de revenir au point de départ ! Déposez la batterie dans n\'importe quelle borne IMỌLẸ à Paris.'
                : 'You do not have to return to the original spot! Simply drop it into any IMỌLẸ station across Paris.'}
            </p>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.78rem',
              color: '#065F46',
              fontWeight: 600,
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
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid #ECEAF5',
          boxShadow: '0 4px 16px rgba(48, 14, 88, 0.04)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #300E58 0%, #4E188C 100%)',
            color: '#FFB800',
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
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111827' }}>
              {isFr ? 'Tarification & Caution Débloquée' : 'Pricing & Deposit Released'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#4B5563', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
              {isFr 
                ? 'Vous ne payez que ce que vous consommez :'
                : 'You are only charged for actual usage:'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '0.75rem' }}>
              <div style={{ background: '#FAF7FD', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#300E58' }}>2,49 €</strong>
                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>{isFr ? '1ère heure' : '1st hour'}</span>
              </div>
              <div style={{ background: '#F9FAFB', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#111827' }}>1,99 €</strong>
                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>{isFr ? '/ h suppl.' : '/ add. hr'}</span>
              </div>
              <div style={{ background: '#F9FAFB', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#111827' }}>14,99 €</strong>
                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>{isFr ? 'Plafond 24h' : '24h Max Cap'}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0, lineHeight: 1.35 }}>
              🛡️ {isFr 
                ? 'L\'empreinte bancaire de 24,99 € est une simple retenue de garantie temporaire. Dès que la batterie est enclenchée dans une borne, le montant réel est débité et le reste est libéré immédiatement.'
                : 'The €24.99 security hold is a temporary pre-authorization. Once returned to any kiosk, only actual rental is charged and the remaining hold is released.'}
            </p>
          </div>
        </div>
      </div>

      {/* Return Flow Summary Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.25rem',
        border: '1px solid #ECEAF5',
        boxShadow: '0 4px 16px rgba(48, 14, 88, 0.04)',
        marginBottom: '1.75rem',
      }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 0.6rem 0', color: '#111827' }}>
          ❓ {isFr ? 'Questions fréquentes' : 'Frequently Asked Questions'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: '#4B5563' }}>
          <div>
            <strong style={{ color: '#111827' }}>{isFr ? 'Que faire si une borne est pleine ?' : 'What if a station is full?'}</strong>
            <p style={{ margin: '2px 0 0 0' }}>
              {isFr 
                ? 'Les bornes du réseau IMỌLẸ sont réparties à travers Paris. Vous pouvez déposer votre batterie dans n\'importe quelle borne avec un emplacement libre.'
                : 'IMỌLẸ stations are located throughout Paris. You can return your battery to any nearby partner station with an empty slot.'}
            </p>
          </div>

          <div>
            <strong style={{ color: '#111827' }}>{isFr ? 'Puis-je garder la batterie plus de 24h ?' : 'Can I keep it longer than 24 hours?'}</strong>
            <p style={{ margin: '2px 0 0 0' }}>
              {isFr 
                ? 'Oui, jusqu\'à 48 heures. Au-delà de 48 heures, la caution de 24,99 € est conservée et la batterie vous appartient définitivement.'
                : 'Yes, up to 48 hours. After 48 hours, the €24.99 deposit is captured and the battery is yours to keep.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div style={{
        position: 'sticky',
        bottom: '1rem',
        zIndex: 20,
      }}>
        <button
          onClick={() => router.push(returnUrl)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1A0430 0%, #300E58 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '1.1rem 1.5rem',
            fontSize: '1.05rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(48, 14, 88, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>⚡</span>
          <span>{isFr ? 'J\'ai compris • Payer maintenant' : 'Got it • Pay Now'}</span>
        </button>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>}>
      <HowItWorksContent />
    </Suspense>
  );
}
