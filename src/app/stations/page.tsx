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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Optionally fetch dynamic telemetry from /api/stations
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
      maxWidth: '460px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 15% 15%, rgba(255, 184, 0, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(75, 0, 130, 0.25) 0%, transparent 50%)
      `,
      padding: '1.25rem 1.25rem 6.5rem 1.25rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: '#FFFFFF',
      position: 'relative',
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
      }}>
        <button
          onClick={() => router.push(currentKiosk ? `/?station=${currentKiosk}` : '/')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFB800',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span>←</span>
          <span>{isFr ? 'Accueil' : 'Home'}</span>
        </button>

        <ImoleLogo size="sm" light={true} />
        <LanguageToggle variant="dark" />
      </header>

      {/* Hero Badge & Title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'rgba(255, 184, 0, 0.12)',
          border: '1px solid rgba(255, 184, 0, 0.3)',
          color: '#FFB800',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.5rem',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          <span>{isFr ? 'Réseau Métropole Lilloise' : 'Lille Metro Network'}</span>
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.2, margin: '0 0 0.35rem 0', color: '#FFFFFF' }}>
          {isFr ? 'Trouver une Borne à Lille' : 'Find a Station in Lille'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', margin: 0, lineHeight: 1.4 }}>
          {isFr 
            ? 'Empruntez et restituez votre batterie dans n\'importe quelle borne de notre réseau à Lille.'
            : 'Borrow and return your battery at any IMỌLẸ station in Lille.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '1.25rem',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            background: filter === 'all' ? '#FFB800' : 'rgba(255, 255, 255, 0.08)',
            color: filter === 'all' ? '#120224' : 'rgba(255, 255, 255, 0.85)',
            border: filter === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isFr ? 'Toutes les bornes' : 'All Stations'}
        </button>

        <button
          onClick={() => setFilter('returns')}
          style={{
            background: filter === 'returns' ? '#FFB800' : 'rgba(255, 255, 255, 0.08)',
            color: filter === 'returns' ? '#120224' : 'rgba(255, 255, 255, 0.85)',
            border: filter === 'returns' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isFr ? 'Places de retour disponibles' : 'Return Slots Available'}
        </button>

        <button
          onClick={() => setFilter('open24')}
          style={{
            background: filter === 'open24' ? '#FFB800' : 'rgba(255, 255, 255, 0.08)',
            color: filter === 'open24' ? '#120224' : 'rgba(255, 255, 255, 0.85)',
            border: filter === 'open24' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isFr ? 'Ouvert 24h/24' : 'Open 24/7'}
        </button>
      </div>

      {/* Station Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {filteredStations.map((station) => {
          const isSelected = currentKiosk === station.id || currentKiosk === station.deviceSn;

          return (
            <div
              key={station.id}
              style={{
                background: isSelected 
                  ? 'linear-gradient(145deg, rgba(255, 184, 0, 0.12) 0%, rgba(48, 14, 88, 0.5) 100%)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '1.25rem',
                border: isSelected 
                  ? '1.5px solid #FFB800' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected 
                  ? '0 12px 36px rgba(255, 184, 0, 0.15)' 
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Station Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                      {isFr ? station.name : station.nameEn}
                    </h3>
                    {isSelected && (
                      <span style={{
                        background: '#FFB800',
                        color: '#120224',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}>
                        {isFr ? 'Votre Borne' : 'Your Kiosk'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)', margin: '4px 0 0 0' }}>
                    📍 {station.address}
                  </p>
                </div>

                {/* Status Dot */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: station.isOnline ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                  color: station.isOnline ? '#34D399' : '#FBBF24',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
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

              {/* Slot Counters Matrix */}
              {station.isOnline ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem', color: '#FFB800', fontWeight: 800 }}>
                        {station.availableBatteries} / {station.totalSlots}
                      </strong>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {isFr ? 'Batteries prêtes' : 'Ready to rent'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🔄</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem', color: '#34D399', fontWeight: 800 }}>
                        {station.emptySlots} {isFr ? 'libres' : 'free'}
                      </strong>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {isFr ? 'Places de retour' : 'Return slots'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  fontSize: '0.78rem',
                  color: '#FBBF24',
                }}>
                  {isFr ? station.statusText : station.statusTextEn}
                </div>
              )}

              {/* Hours */}
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🕒</span>
                <span>{isFr ? station.openingHours : station.openingHoursEn}</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '0.25rem' }}>
                <a
                  href={station.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px 12px',
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
                  <span>{isFr ? 'Itinéraire GPS' : 'Get Directions'}</span>
                </a>

                {station.isOnline && (
                  <button
                    onClick={() => router.push(`/?station=${station.id}`)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #FFA751 0%, #FFB800 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 12px',
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

      {/* Return Rule Reassurance */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: 1.4,
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '1.3rem' }}>🔄</span>
        <div>
          <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '2px' }}>
            {isFr ? 'Restitution libre dans toute borne' : 'Return to any station'}
          </strong>
          <span>
            {isFr 
              ? 'Peu importe la borne d\'emprunt : insérez la batterie dans n\'importe quelle station IMỌLẸ à Lille pour terminer la location.'
              : 'No matter where you rented: push the battery into any IMỌLẸ station in Lille to stop your rental.'}
          </span>
        </div>
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

