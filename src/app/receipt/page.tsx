"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import BottomNav from '@/components/BottomNav';
import LanguageToggle from '@/components/LanguageToggle';

function ReceiptContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const durationMinutes = searchParams.get('duration') || '42';
  const finalCost = searchParams.get('cost') || '2,49';

  // Calculate hold released
  const costFloat = parseFloat(finalCost.replace(',', '.')) || 2.49;
  const holdReleased = (24.99 - costFloat).toFixed(2).replace('.', ',');

  return (
    <div className="page-container animate-slide-up">
      {/* Brand Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <ImoleLogo size="md" />
        <LanguageToggle variant="light" />
      </header>

      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 1rem auto',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.15)',
        }}>
          ✓
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
          {t('receiptSuccess')}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {t('receiptThanks')}
        </p>
      </div>

      {/* Main Receipt Card */}
      <section className="fintech-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '1px dashed #E5E7EB', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {t('finalChargedLabel')}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-brand)', margin: '0.25rem 0' }}>
            {finalCost} €
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#ECFDF5',
            color: '#059669',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            <span>✓</span> {t('holdReleasedBadge')} : {holdReleased} €
          </span>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('durationLabel')}</span>
            <strong>{durationMinutes} minutes</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('paymentMethodLabel')}</span>
            <strong>Apple Pay / Carte</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('initialHoldLabel')}</span>
            <span>24,99 €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
            <span>{t('amountReleasedLabel')}</span>
            <span>+ {holdReleased} €</span>
          </div>
        </div>
      </section>

      {/* Primary Action Button */}
      <section style={{ marginBottom: '1.5rem' }}>
        <button 
          className="btn-primary-action"
          onClick={() => router.push('/')}
        >
          {t('backHomeBtn')}
        </button>
      </section>

      <BottomNav activeTab="history" />
    </div>
  );
}

export default function ReceiptScreen() {
  return (
    <Suspense fallback={<div className="page-container">Chargement...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
