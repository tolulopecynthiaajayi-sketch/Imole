"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import BottomNav from '@/components/BottomNav';
import LanguageToggle from '@/components/LanguageToggle';

function ReceiptContent() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const durationMinutes = searchParams.get('duration') || '42';
  const finalCost = searchParams.get('cost') || '2,49';

  // Calculate hold released
  const costFloat = parseFloat(finalCost.replace(',', '.')) || 2.49;
  const holdReleased = (24.99 - costFloat).toFixed(2).replace('.', ',');

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
      {/* Brand Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <ImoleLogo size="md" light={true} />
        <LanguageToggle variant="dark" />
      </header>

      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.18)',
          border: '2px solid #10B981',
          color: '#34D399',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 1rem auto',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
        }}>
          ✓
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>
          {t('receiptSuccess')}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', margin: 0 }}>
          {t('receiptThanks')}
        </p>
      </div>

      {/* Main Receipt Card */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 184, 0, 0.25)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('finalChargedLabel')}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFB800', margin: '0.25rem 0' }}>
            {finalCost} €
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34D399',
            fontSize: '0.75rem',
            fontWeight: 800,
          }}>
            <span>✓</span> {t('holdReleasedBadge')} : {holdReleased} €
          </span>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>{t('durationLabel')}</span>
            <strong style={{ color: '#FFFFFF' }}>{durationMinutes} minutes</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>{t('paymentMethodLabel')}</span>
            <strong style={{ color: '#FFFFFF' }}>Apple Pay / Carte</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>{t('initialHoldLabel')}</span>
            <span style={{ color: '#FFFFFF' }}>24,99 €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 800 }}>
            <span>{t('amountReleasedLabel')}</span>
            <span>+ {holdReleased} €</span>
          </div>
        </div>
      </section>

      {/* Primary Action Button */}
      <section style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => router.push('/')}
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
            boxShadow: '0 8px 24px rgba(255, 184, 0, 0.3)',
          }}
        >
          {t('backHomeBtn')}
        </button>
      </section>

      <BottomNav activeTab="history" />
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
