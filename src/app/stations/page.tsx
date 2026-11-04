"use client";

import { useI18n } from '@/components/I18nProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { LILLE_STATIONS, StationLocation } from '@/lib/stationsConfig';

function StationsContent() {
  const { lang } = useI18n();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentKiosk = searchParams.get('station') || searchParams.get('kiosk');
  const isFr = lang === 'fr';
  const isDark = theme === 'dark';

  const [filter, setFilter] = useState<'all' | 'returns' | 'open24'>('all');
  const [stations, setStations] = useState<StationLocation[]>(LILLE_STATIONS);

  useEffect(() => {
    async function loadLiveStations() {
      try {
        const res = await fetch('/api/stations');
        const data = await res.json();
        if (data.stations) {
          setStations(data.stations);
        }
      } catch {
        // Fallback to static Lille fleet
      }
    }
    loadLiveStations();
  }, []);

  const filteredStations = stations.filter(s => {
    if (filter === 'returns') return s.emptySlots > 0 && s.isOnline;
    if (filter === 'open24') return s.openingHours.includes('24h/24') || s.openingHoursEn.includes('24/7');
    return true;
  });

  // Color tokens
  const bgColor = isDark ? '#120224' : '#FAF9FE';
  const bgGradient = isDark
    ? `radial-gradient(circle at 15% 12%, rgba(255, 184, 0, 0.14) 0%, transparent 45%), linear-gradient(180deg, #120224 0%, #17032E 100%)`
    : `radial-gradient(circle at 15% 10%, rgba(255, 184, 0, 0.08) 0%, transparent 45%), linear-gradient(180deg, #FAF9FE 0%, #F3F1FA 100%)`;
  const textPrimary = isDark ? '#FFFFFF' : '#18042B';
  const textSecondary = isDark ? 'rgba(255, 255, 255, 0.72)' : '#6B7280';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#EAE6F3';
  const cardShadow = isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(24, 4, 43, 0.05)';
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
      position: 'relative',
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
      }}>
        <button
          onClick={() => router.push(currentKiosk ? `/?station=${currentKiosk}` : '/')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: accentGold,
            cursor: 'pointer',
          }}
        >
          <span>←</span>
          <span>{isFr ? 'Accueil' : 'Home'}</span>
        </button>

        <ImoleLogo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          <LanguageToggle variant="auto" />
        </div>
      </header>

      {/* Hero Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
          color: textPrimary,
        }}>
          {isFr ? 'Bornes à Lille' : 'Stations in Lille'}
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: textSecondary,
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981',
            display: 'inline-block',
          }} />
          <span>{isFr ? '2 bornes actives • 11 batteries prêtes' : '2 active stations • 11 batteries ready'}</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '1.75rem',
        overflowX: 'auto',
        paddingBottom: '2px',
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            background: filter === 'all' 
              ? (isDark ? '#FFB800' : '#18042B') 
              : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF'),
            color: filter === 'all' 
              ? (isDark ? '#120224' : '#FFFFFF') 
              : textSecondary,
            border: isDark ? 'none' : '1px solid #E5E7EB',
            borderRadius: '9999px',
            padding: '7px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isFr ? 'Toutes' : 'All'}
        </button>

        <button
          onClick={() => setFilter('returns')}
          style={{
            background: filter === 'returns' 
              ? (isDark ? '#FFB800' : '#18042B') 
              : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF'),
            color: filter === 'returns' 
              ? (isDark ? '#120224' : '#FFFFFF') 
              : textSecondary,
            border: isDark ? 'none' : '1px solid #E5E7EB',
            borderRadius: '9999px',
            padding: '7px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isFr ? 'Places de retour' : 'Return Slots'}
        </button>

        <button
          onClick={() => setFilter('open24')}
          style={{
            background: filter === 'open24' 
              ? (isDark ? '#FFB800' : '#18042B') 
              : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF'),
            color: filter === 'open24' 
              ? (isDark ? '#120224' : '#FFFFFF') 
              : textSecondary,
            border: isDark ? 'none' : '1px solid #E5E7EB',
            borderRadius: '9999px',
            padding: '7px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isFr ? '24h/24' : '24/7'}
        </button>
      </div>

      {/* Station Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {filteredStations.map((station) => {
          const isSelected = currentKiosk === station.id || currentKiosk === station.deviceSn;

          return (
            <div
              key={station.id}
              style={{
                background: isSelected 
                  ? (isDark ? 'linear-gradient(145deg, rgba(255, 184, 0, 0.12) 0%, rgba(48, 14, 88, 0.4) 100%)' : '#FFFDF8') 
                  : cardBg,
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '1.35rem',
                border: isSelected 
                  ? `1.5px solid ${accentGold}` 
                  : `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0', color: textPrimary }}>
                    {isFr ? station.name : station.nameEn}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: textSecondary, margin: 0 }}>
                    📍 {station.address}
                  </p>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: station.isOnline ? '#10B981' : '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: station.isOnline ? '#10B981' : '#F59E0B',
                  }} />
                  {station.isOnline ? (isFr ? 'En ligne' : 'Online') : (isFr ? 'Bientôt' : 'Soon')}
                </span>
              </div>

              {/* Slot Counters (Clean typography, no inner boxes!) */}
              {station.isOnline ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.85rem',
                  padding: '4px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: accentGold, fontWeight: 800 }}>⚡ {station.availableBatteries}</span>
                    <span style={{ color: textSecondary, fontSize: '0.78rem' }}>
                      {isFr ? 'prêtes' : 'ready'}
                    </span>
                  </div>

                  <span style={{ opacity: 0.3, color: textSecondary }}>•</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>🔄 {station.emptySlots}</span>
                    <span style={{ color: textSecondary, fontSize: '0.78rem' }}>
                      {isFr ? 'places de retour' : 'return slots'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#F59E0B', padding: '4px 0' }}>
                  {isFr ? station.statusText : station.statusTextEn}
                </div>
              )}

              {/* Opening Hours */}
              <div style={{ fontSize: '0.78rem', color: textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🕒</span>
                <span>{isFr ? station.openingHours : station.openingHoursEn}</span>
              </div>

              {/* Actions Row */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '0.35rem' }}>
                <a
                  href={station.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6',
                    border: isDark ? 'none' : '1px solid #E5E7EB',
                    borderRadius: '9999px',
                    padding: '8px 14px',
                    color: textPrimary,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📍</span>
                  <span>{isFr ? 'Itinéraire GPS' : 'Directions'}</span>
                </a>

                {station.isOnline && (
                  <button
                    onClick={() => router.push(`/?station=${station.id}`)}
                    style={{
                      flex: 1,
                      background: isDark 
                        ? 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)' 
                        : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '8px 14px',
                      color: isDark ? '#120224' : '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: isDark ? '#120224' : '#FFB800' }}>⚡</span>
                    <span>{isFr ? 'Louer ici' : 'Rent here'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Reassurance Line */}
      <div style={{
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 4, 43, 0.08)'}`,
        paddingTop: '1.25rem',
        fontSize: '0.82rem',
        color: textSecondary,
        lineHeight: 1.45,
      }}>
        🔄 {isFr
          ? 'Restitution libre : glissez votre batterie dans n\'importe quelle borne IMỌLẸ à Lille pour terminer votre location.'
          : 'Free return: slide your battery into any IMỌLẸ station in Lille to stop your rental.'}
      </div>

      <BottomNav activeTab="stations" />
    </div>
  );
}

export default function StationsPage() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <StationsContent />
    </Suspense>
  );
}
