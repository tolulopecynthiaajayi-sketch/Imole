"use client";

import React from 'react';
import { useI18n } from '@/components/I18nProvider';

interface TrustBadgesProps {
  variant?: 'light' | 'dark';
}

export default function TrustBadges({ variant = 'light' }: TrustBadgesProps) {
  const { t } = useI18n();
  const isDark = variant === 'dark';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.8)' : '#4B5563';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB';
  const bgCard = isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '0.75rem 1rem',
      borderRadius: '14px',
      background: bgCard,
      border: `1px solid ${borderColor}`,
      fontSize: '0.78rem',
      color: textColor,
      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)',
    }}>
      {/* SSL / Stripe */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
        <span>🔒</span>
        <span>{t('trustSecurity')}</span>
      </div>

      <span style={{ opacity: 0.3 }}>•</span>

      {/* CE Certification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
        <span>⚡</span>
        <span>{t('trustBattery')}</span>
      </div>

      <span style={{ opacity: 0.3 }}>•</span>

      {/* Auto Deposit Release */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
        <span>✓</span>
        <span>{t('trustDeposit')}</span>
      </div>
    </div>
  );
}
