"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';

interface BottomNavProps {
  activeTab?: 'home' | 'stations' | 'history' | 'account';
}

export default function BottomNav({ activeTab = 'home' }: BottomNavProps) {
  const router = useRouter();
  let isDark = true;
  try {
    const { theme } = useTheme();
    isDark = theme === 'dark';
  } catch {
    isDark = true;
  }

  const tabs = [
    {
      id: 'home',
      label: 'Accueil',
      path: '/',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      id: 'stations',
      label: 'Bornes',
      path: '/stations',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Guide & FAQ',
      path: '/how-it-works',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '460px',
      backgroundColor: isDark ? 'rgba(18, 2, 36, 0.94)' : 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(20px)',
      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.6rem 0.5rem 1.4rem 0.5rem',
      zIndex: 50,
      boxShadow: isDark ? '0 -10px 30px rgba(0, 0, 0, 0.5)' : '0 -4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeColor = isDark ? '#FFB800' : '#18042B';
        const inactiveColor = isDark ? 'rgba(255, 255, 255, 0.45)' : '#9CA3AF';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => router.push(tab.path)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? activeColor : inactiveColor,
              transition: 'all 0.2s ease',
              padding: '4px 16px',
              cursor: 'pointer',
            }}
          >
            <div style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease',
              filter: isActive && isDark ? 'drop-shadow(0 0 8px rgba(255, 184, 0, 0.5))' : 'none',
            }}>
              {tab.icon}
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: isActive ? 800 : 500,
              letterSpacing: '-0.01em',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
