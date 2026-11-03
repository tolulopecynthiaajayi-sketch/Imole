import React from 'react';
import Link from 'next/navigation';

interface BottomNavProps {
  activeTab?: 'home' | 'stations' | 'history' | 'account';
}

export default function BottomNav({ activeTab = 'home' }: BottomNavProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Accueil',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      id: 'stations',
      label: 'Stations',
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
      label: 'Historique',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      id: 'account',
      label: 'Compte',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
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
      maxWidth: '480px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.6rem 0.5rem 1.4rem 0.5rem',
      zIndex: 50,
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04)',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? '#300E58' : '#9CA3AF',
              transition: 'color 0.2s ease',
              padding: '4px 12px',
              cursor: 'pointer',
            }}
          >
            <div style={{
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.2s ease',
            }}>
              {tab.icon}
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: isActive ? 700 : 500,
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
