"use client";

import React from 'react';
import { useI18n } from '@/components/I18nProvider';

interface LanguageToggleProps {
  variant?: 'light' | 'dark';
}

export default function LanguageToggle({ variant = 'light' }: LanguageToggleProps) {
  const { lang, setLanguage } = useI18n();
  const isDark = variant === 'dark';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E5E7EB',
      borderRadius: '9999px',
      padding: '3px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      gap: '2px',
      userSelect: 'none',
    }}>
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        style={{
          border: 'none',
          outline: 'none',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: lang === 'fr' 
            ? (isDark ? '#FFA751' : '#300E58') 
            : 'transparent',
          color: lang === 'fr' 
            ? (isDark ? '#1F0638' : '#FFFFFF') 
            : (isDark ? 'rgba(255, 255, 255, 0.7)' : '#6B7280'),
          boxShadow: lang === 'fr' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        FR
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        style={{
          border: 'none',
          outline: 'none',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: lang === 'en' 
            ? (isDark ? '#FFA751' : '#300E58') 
            : 'transparent',
          color: lang === 'en' 
            ? (isDark ? '#1F0638' : '#FFFFFF') 
            : (isDark ? 'rgba(255, 255, 255, 0.7)' : '#6B7280'),
          boxShadow: lang === 'en' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        EN
      </button>
    </div>
  );
}

