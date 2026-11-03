import React from 'react';

interface TrustBadgesProps {
  variant?: 'light' | 'dark';
}

export default function TrustBadges({ variant = 'light' }: TrustBadgesProps) {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.75)' : '#6B7280';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#E5E7EB';
  const bgCard = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F9FAFB';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '1.25rem',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      background: bgCard,
      border: `1px solid ${borderColor}`,
      fontSize: '0.75rem',
      color: textColor,
    }}>
      {/* French Republic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '14px',
          borderRadius: '2px',
          overflow: 'hidden',
          boxShadow: '0 0 1px rgba(0,0,0,0.3)',
        }}>
          <span style={{ width: '6px', height: '100%', background: '#002654' }}></span>
          <span style={{ width: '6px', height: '100%', background: '#FFFFFF' }}></span>
          <span style={{ width: '6px', height: '100%', background: '#CE1126' }}></span>
        </span>
        <span style={{ fontWeight: 600, letterSpacing: '0.02em' }}>RÉPUBLIQUE FRANÇAISE</span>
      </div>

      <span style={{ opacity: 0.4 }}>•</span>

      {/* European Union */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '14px',
          borderRadius: '2px',
          background: '#003399',
          color: '#FFCC00',
          fontSize: '9px',
          fontWeight: 700,
        }}>
          ★
        </span>
        <span style={{ fontWeight: 600 }}>Cofinancé par l&apos;Union européenne</span>
      </div>

      <span style={{ opacity: 0.4 }}>•</span>

      {/* Security guarantee */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <span>🔒</span>
        <span>Norme CE • Certifié NF</span>
      </div>
    </div>
  );
}
