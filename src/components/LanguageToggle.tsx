"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/components/I18nProvider';

interface LanguageToggleProps {
  variant?: 'light' | 'dark';
}

export default function LanguageToggle({ variant = 'light' }: LanguageToggleProps) {
  const { lang, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDark = variant === 'dark';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const currentLanguage = languages.find(l => l.code === lang) || languages[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', userSelect: 'none', zIndex: 50 }}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
          backdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E5E7EB',
          borderRadius: '9999px',
          padding: '6px 14px',
          color: isDark ? '#FFFFFF' : '#1F2937',
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{currentLanguage.flag}</span>
        <span style={{ letterSpacing: '0.04em' }}>{currentLanguage.code.toUpperCase()}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.7,
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: '150px',
          background: isDark ? '#1C0530' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid #E5E7EB',
          borderRadius: '16px',
          padding: '6px',
          boxShadow: isDark 
            ? '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(75, 0, 130, 0.3)' 
            : '0 12px 32px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 100,
          animation: 'dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected 
                    ? (isDark ? 'rgba(255, 184, 0, 0.15)' : '#F3F0FA') 
                    : 'transparent',
                  color: isSelected 
                    ? (isDark ? '#FFB800' : '#300E58') 
                    : (isDark ? 'rgba(255, 255, 255, 0.85)' : '#374151'),
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.15rem' }}>{item.flag}</span>
                  <span>{item.label}</span>
                </div>
                {isSelected && (
                  <span style={{ fontSize: '0.85rem', color: isDark ? '#FFB800' : '#300E58', fontWeight: 800 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
