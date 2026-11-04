"use client";

import { useI18n } from '@/components/I18nProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';

function ReceiptContent() {
  const { lang, t } = useI18n();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = theme === 'dark';
  
  const durationMinutes = searchParams.get('duration') || '42';
  const finalCost = searchParams.get('cost') || '2,49';

  // Calculate hold released
  const costFloat = parseFloat(finalCost.replace(',', '.')) || 2.49;
  const holdReleased = (24.99 - costFloat).toFixed(2).replace('.', ',');

  // Color tokens
  const bgColor = isDark ? '#120224' : '#FAF9FE';
  const bgGradient = isDark
    ? `radial-gradient(circle at 10% 15%, rgba(255, 184, 0, 0.12) 0%, transparent 40%), linear-gradient(180deg, #120224 0%, #1A0430 100%)`
    : `radial-gradient(circle at 10% 15%, rgba(255, 184, 0, 0.08) 0%, transparent 40%), linear-gradient(180deg, #FAF9FE 0%, #F3F1FA 100%)`;
  const textPrimary = isDark ? '#FFFFFF' : '#18042B';
  const textSecondary = isDark ? 'rgba(255, 255, 255, 0.72)' : '#6B7280';
  const accentGold = isDark ? '#FFB800' : '#B45309';

  return (
    <div style={{
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: bgColor,
      backgroundImage: bgGradient,
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: textPrimary,
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* Brand Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <ImoleLogo size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          <LanguageToggle variant="auto" />
        </div>
      </header>

      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid #10B981',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 1rem auto',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)',
        }}>
          ✓
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: textPrimary, margin: '0 0 0.35rem 0' }}>
          {t('receiptSuccess')}
        </h1>
        <p style={{ fontSize: '0.88rem', color: textSecondary, margin: 0 }}>
          {t('receiptThanks')}
        </p>
      </div>

      {/* Single Transparent Receipt Summary (No heavy box) */}
      <section style={{
        padding: '1.5rem 0',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 4, 43, 0.08)'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 4, 43, 0.08)'}`,
        marginBottom: '2rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('finalChargedLabel')}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: accentGold, margin: '0.25rem 0' }}>
            {finalCost} €
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10B981',
            fontSize: '0.78rem',
            fontWeight: 800,
          }}>
            <span>✓</span> {t('holdReleasedBadge')} : {holdReleased} €
          </span>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>{t('durationLabel')}</span>
            <strong style={{ color: textPrimary }}>{durationMinutes} minutes</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>{t('paymentMethodLabel')}</span>
            <strong style={{ color: textPrimary }}>Apple Pay / Carte</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>{t('initialHoldLabel')}</span>
            <span style={{ color: textPrimary }}>24,99 €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 800 }}>
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
            background: isDark 
              ? 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)' 
              : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
            color: isDark ? '#120224' : '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '1.1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: isDark ? '0 8px 24px rgba(255, 184, 0, 0.3)' : '0 8px 24px rgba(24, 4, 43, 0.2)',
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
