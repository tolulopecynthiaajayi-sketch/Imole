"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import BottomNav from '@/components/BottomNav';
import { LILLE_STATIONS, StationLocation } from '@/lib/stationsConfig';

function StationsContent() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentKiosk = searchParams.get('station') || searchParams.get('kiosk');
  const isFr = lang === 'fr';

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

  return (
    <div style={{
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 15% 12%, rgba(255, 184, 0, 0.15) 0%, transparent 45%),
        radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.18) 0%, transparent 50%),
        linear-gradient(180deg, #120224 0%, #17032E 100%)
      `,
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: '#FFFFFF',
      position: 'relative',
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
            color: '#FFB800',
            cursor: 'pointer',
          }}
        >
          <span>←</span>
          <span>{isFr ? 'Accueil' : 'Home'}</span>
        </button>

        <ImoleLogo size="sm" light={true} />
        <LanguageToggle variant="dark" />
      </header>

      {/* Hero Header (Open, no box!) */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
          color: '#FFFFFF',
        }}>
          {isFr ? 'Bornes à Lille' : 'Stations in Lille'}
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.72)',
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

      {/* Filter Chips (Minimalist, no heavy borders) */}
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
            background: filter === 'all' ? '#FFB800' : 'rgba(255, 255, 255, 0.08)',
            color: filter === 'all' ? '#120224' : 'rgba(255, 255, 255, 0.8)',
            border: 'none',
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
            background: filter === 'returns' ? '#FFB800' : 'rgba(255, 255, 255, 0.08)',
            color: filter === 'returns' ? '#120224' : 'rgba(255, 255, 255, 0.8)',
            border: 'none',
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
            background: filter === 'open24' ? '#FFB800' : 'rgba(255, 255, 255, 0.08)',
            color: filter === 'open24' ? '#120224' : 'rgba(255, 255, 255, 0.8)',
            border: 'none',
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

      {/* Station Cards (Single fluid card, NO nested boxes!) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {filteredStations.map((station) => {
          const isSelected = currentKiosk === station.id || currentKiosk === station.deviceSn;

          return (
            <div
              key={station.id}
              style={{
                background: isSelected 
                  ? 'linear-gradient(145deg, rgba(255, 184, 0, 0.12) 0%, rgba(48, 14, 88, 0.4) 100%)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '1.35rem',
                border: isSelected 
                  ? '1.5px solid #FFB800' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected 
                  ? '0 12px 36px rgba(255, 184, 0, 0.15)' 
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px 0', color: '#FFFFFF' }}>
                    {isFr ? station.name : station.nameEn}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
                    📍 {station.address}
                  </p>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: station.isOnline ? '#34D399' : '#FBBF24',
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

              {/* Slot Counters (Open clean typography, NO inner boxes!) */}
              {station.isOnline ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.85rem',
                  padding: '6px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#FFB800', fontWeight: 800 }}>⚡ {station.availableBatteries}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.78rem' }}>
                      {isFr ? 'prêtes' : 'ready'}
                    </span>
                  </div>

                  <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>•</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#34D399', fontWeight: 800 }}>🔄 {station.emptySlots}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.78rem' }}>
                      {isFr ? 'places de retour' : 'return slots'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#FBBF24', padding: '4px 0' }}>
                  {isFr ? station.statusText : station.statusTextEn}
                </div>
              )}

              {/* Opening Hours */}
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '9999px',
                    padding: '8px 14px',
                    color: '#FFFFFF',
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
                      background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '8px 14px',
                      color: '#120224',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>⚡</span>
                    <span>{isFr ? 'Louer ici' : 'Rent here'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Reassurance Line (No box!) */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1.25rem',
        fontSize: '0.82rem',
        color: 'rgba(255, 255, 255, 0.65)',
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
