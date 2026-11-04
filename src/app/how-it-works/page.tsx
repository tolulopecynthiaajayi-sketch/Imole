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
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 10% 10%, rgba(255, 184, 0, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        linear-gradient(180deg, #120224 0%, #17032E 100%)
      `,
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: '#FFFFFF',
    }}>
      {/* Top Bar with Back Button */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
      }}>
        <button
          onClick={() => router.push(returnUrl)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#FFB800',
            cursor: 'pointer',
          }}
        >
          <span>←</span>
          <span>{isFr ? 'Retour' : 'Back'}</span>
        </button>

        <ImoleLogo size="sm" light={true} />
        <LanguageToggle variant="dark" />
      </header>

      {/* Hero Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '-0.02em',
          margin: '0 0 0.6rem 0',
          color: '#FFFFFF',
        }}>
          {isFr ? 'Guide & Restitution' : 'How It Works & Returns'}
        </h1>
        <p style={{
          fontSize: '0.92rem',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {isFr 
            ? 'Empruntez en 30 secondes, rechargez librement à Lille, et restituez dans n\'importe quelle borne partenaire.'
            : 'Borrow in 30 seconds, charge on the go in Lille, and return at any partner kiosk.'}
        </p>
      </div>

      {/* Continuous Editorial Timeline (No chunky stacked AI boxes) */}
      <div style={{
        position: 'relative',
        paddingLeft: '2rem',
        borderLeft: '2px solid rgba(255, 184, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.25rem',
        marginBottom: '3rem',
      }}>
        {/* Step 1 */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '-2.7rem',
            top: '0',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#FFB800',
            color: '#120224',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.78rem',
            boxShadow: '0 0 12px rgba(255, 184, 0, 0.5)',
          }}>
            1
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#FFFFFF' }}>
            {isFr ? 'Paiement en 1 clic' : '1-Tap Instant Checkout'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.5, margin: 0 }}>
            {isFr 
              ? 'Scannez le QR code de la borne. Validez avec Apple Pay, Google Pay ou CB. La batterie 6000 mAh s\'éjecte immédiatement.'
              : 'Scan the station QR code. Confirm with Apple Pay, Google Pay, or Card. The 6000 mAh battery pops out immediately.'}
          </p>
        </div>

        {/* Step 2 */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '-2.7rem',
            top: '0',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#FFB800',
            color: '#120224',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.78rem',
            boxShadow: '0 0 12px rgba(255, 184, 0, 0.5)',
          }}>
            2
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#FFFFFF' }}>
            {isFr ? '3 câbles rapides intégrés' : '3 Built-In Fast Cables'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
            {isFr 
              ? 'Aucun câble personnel à emporter. Tirez le connecteur directement depuis la batterie :'
              : 'No personal cable needed. Pull the connector directly from the battery:'}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem', fontWeight: 700, color: '#FFD700' }}>
            <span>⚡ Lightning (iPhone)</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>•</span>
            <span>⚡ USB-C</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>•</span>
            <span>⚡ Micro-USB</span>
          </div>
        </div>

        {/* Step 3: RETURN HIGHLIGHT */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '-2.7rem',
            top: '0',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#10B981',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.78rem',
            boxShadow: '0 0 14px #10B981',
          }}>
            ✓
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#34D399' }}>
            {isFr ? 'Restitution dans TOUTE borne du réseau' : 'Return to ANY Station'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, margin: 0 }}>
            {isFr 
              ? 'Pas besoin de revenir au point d\'emprunt. Glissez simplement la batterie dans n\'importe quel emplacement libre à Lille jusqu\'au clic audible : la location s\'arrête et votre caution est débloquée automatiquement.'
              : 'No need to return to where you started. Slide the battery into any empty slot in Lille until the click: your rental ends and your hold is released.'}
          </p>
        </div>

        {/* Step 4 */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '-2.7rem',
            top: '0',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#FFB800',
            color: '#120224',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.78rem',
            boxShadow: '0 0 12px rgba(255, 184, 0, 0.5)',
          }}>
            4
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#FFFFFF' }}>
            {isFr ? 'Tarif transparent & Plafond garanti' : 'Transparent Pricing & Cap'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.5, margin: 0 }}>
            {isFr 
              ? '2,49 € pour la 1ère heure, puis 1,99 € / h. Plafond garanti bloqué à 14,99 € par tranche de 24h. Caution temporaire de 24,99 € ajustée dès le retour.'
              : '€2.49 for 1st hour, then €1.99 / hr. 24h cap strictly at €14.99. Temporary €24.99 pre-auth hold released immediately upon return.'}
          </p>
        </div>
      </div>

      {/* Direct Station Finder Link */}
      <div style={{
        padding: '1.5rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
          📍 {isFr ? 'Bornes disponibles à Lille' : 'Available Stations in Lille'}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
          {isFr 
            ? 'Grand Place Lille • Gare Lille Flandres • Vieux-Lille'
            : 'Lille Grand Place • Lille Flandres Station • Old Town'}
        </p>

        <button
          onClick={() => router.push(`/stations${kioskId ? `?station=${kioskId}` : ''}`)}
          style={{
            background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
            color: '#120224',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 20px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🗺️</span>
          <span>{isFr ? 'Voir la carte des bornes' : 'View Station Map'}</span>
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
