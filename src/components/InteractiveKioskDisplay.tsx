"use client";

import { useI18n } from '@/components/I18nProvider';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Suspense, useState, useEffect } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';

function KioskDisplay({ defaultKiosk }: { defaultKiosk?: string }) {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const kioskParam = searchParams.get('kiosk') || defaultKiosk || 'H00000147A';
  const initialStatus = searchParams.get('status') as 'idle' | 'confirmation' | 'dispense' | 'return' | null;
  const showSimulator = searchParams.get('sim') === '1';
  const isLight = searchParams.get('theme') === 'light';
  
  const rentalUrl = `https://imole.fr/?kiosk=${kioskParam}`;
  const isFr = lang === 'fr';

  // Kiosk state: 'idle' | 'confirmation' | 'dispensing' | 'returned'
  const [kioskState, setKioskState] = useState<'idle' | 'confirmation' | 'dispensing' | 'returned'>(
    initialStatus === 'confirmation' ? 'confirmation' :
    initialStatus === 'dispense' ? 'dispensing' :
    initialStatus === 'return' ? 'returned' : 'idle'
  );
  const [activeSlot, setActiveSlot] = useState(3);
  const [batteryId] = useState('BAT-F20002DD6A');

  // Animated Battery Cycle (loops from 5% red to 100% green)
  const [chargeLevel, setChargeLevel] = useState(5);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if (kioskState !== 'idle') return;
    const cycle = setInterval(() => {
      setIsCharging(true);
      setChargeLevel(prev => {
        if (prev >= 100) {
          setIsCharging(false);
          return 5;
        }
        return Math.min(100, prev + 25);
      });
    }, 1200);

    return () => clearInterval(cycle);
  }, [kioskState]);

  // Auto-reset from confirmation screen if abandoned after 45 seconds
  useEffect(() => {
    if (kioskState !== 'confirmation') return;
    const timer = setTimeout(() => {
      setKioskState('idle');
    }, 45000);
    return () => clearTimeout(timer);
  }, [kioskState]);

  // Auto-reset from dispensing or returned after 20 seconds
  useEffect(() => {
    if (kioskState === 'idle' || kioskState === 'confirmation') return;
    const timer = setTimeout(() => {
      setKioskState('idle');
    }, 20000);
    return () => clearTimeout(timer);
  }, [kioskState]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: isLight ? '#FFFFFF' : '#0F021F',
      backgroundImage: isLight
        ? `
          radial-gradient(circle at 15% 25%, rgba(255, 184, 0, 0.22) 0%, transparent 55%),
          radial-gradient(circle at 85% 85%, rgba(138, 43, 226, 0.12) 0%, transparent 55%),
          linear-gradient(180deg, #FFFFFF 0%, #F9F7FE 100%)
        `
        : `
          radial-gradient(circle at 25% 30%, rgba(138, 43, 226, 0.55) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(255, 184, 0, 0.25) 0%, transparent 55%),
          radial-gradient(circle at 50% 50%, rgba(65, 12, 105, 0.75) 0%, transparent 75%),
          linear-gradient(180deg, #0F021F 0%, #17042E 100%)
        `,
      color: isLight ? '#110222' : '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.4vw 4.2vw 2vw 4.2vw',
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes laserSweep {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes auraGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes floatLevitate {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); }
          50% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        @keyframes slotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px #10B981; }
          50% { transform: scale(1.06); box-shadow: 0 0 30px #10B981, inset 0 0 15px #10B981; }
        }

        .laser-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #FFB800 50%, transparent 100%);
          box-shadow: 0 0 14px #FFB800, 0 0 24px rgba(255, 184, 0, 0.8);
          animation: laserSweep 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 20;
        }

        .ambient-aura {
          animation: auraGlow 6s ease-in-out infinite;
        }

        .floating-element {
          animation: floatLevitate 4s ease-in-out infinite;
        }

        .live-pulse-dot {
          animation: pulseDot 2s infinite ease-in-out;
        }

        .slot-active-pulse {
          animation: slotPulse 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Floating Ambient Glow Orbs */}
      <div 
        className="ambient-aura"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 184, 0, 0.16) 0%, transparent 60%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} 
      />
      <div 
        className="ambient-aura"
        style={{
          position: 'absolute',
          bottom: '-25%',
          right: '15%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animationDelay: '-3s',
        }} 
      />

      {/* 1. TOP HEADER: Clean Minimal Luxury Brand Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        height: '48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
          <ImoleLogo size="lg" light={!isLight} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
          <span style={{
            fontSize: '0.9vw',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: isLight ? '#4B5563' : '#FFFFFF',
            fontWeight: 800,
          }}>
            Lille • Réseau de recharge
          </span>
          {showSimulator && <LanguageToggle variant={isLight ? 'light' : 'dark'} />}
        </div>
      </header>

      {/* 2. DYNAMIC CENTER CONTENT BASED ON STATE */}

      {/* STATE A: IDLE / ATTRACT SCREEN (HIGH-END MINIMALIST LUXURY DESIGN) */}
      {kioskState === 'idle' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          gap: '5vw',
          zIndex: 5,
          margin: '0.8vw 0',
        }}>
          {/* Left Column: Pure Editorial Typography, Pricing & Nayax Direction */}
          <div style={{
            flex: 1.3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            {/* Elegant Sub-Hook */}
            <div style={{
              fontSize: '0.95vw',
              fontWeight: 900,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: isLight ? '#D97706' : '#FFB800',
              marginBottom: '0.8vw',
            }}>
              ⚡ Batteries universelles 6000 mAh
            </div>

            {/* Hero Headline */}
            <h1 style={{
              fontSize: '4.8vw',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              margin: '0 0 1vw 0',
              color: isLight ? '#110222' : '#FFFFFF',
            }}>
              Batterie à 5% ?<br />
              Repartez à <span style={{
                background: isLight 
                  ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                  : 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isLight ? 'none' : 'drop-shadow(0 0 25px rgba(255, 184, 0, 0.45))',
              }}>100%</span>.
            </h1>

            {/* Single Elegant Description */}
            <p style={{
              fontSize: '1.25vw',
              color: isLight ? '#374151' : '#FFFFFF',
              lineHeight: 1.45,
              margin: '0 0 2vw 0',
              maxWidth: '94%',
              fontWeight: 600,
            }}>
              3 câbles intégrés (Lightning • USB-C • Micro-USB).<br />
              Empruntez ici, déposez dans n&apos;importe quelle borne à Lille.
            </p>

            {/* Pure Typographic Pricing */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.9vw',
              marginBottom: '2.2vw',
            }}>
              <span style={{
                fontSize: '3.6vw',
                fontWeight: 900,
                color: isLight ? '#D97706' : '#FFB800',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                2,49 €
              </span>
              <span style={{
                fontSize: '1.25vw',
                fontWeight: 800,
                color: isLight ? '#110222' : '#FFFFFF',
              }}>
                1ère heure incluse
              </span>
              <span style={{ color: isLight ? '#9CA3AF' : 'rgba(255, 255, 255, 0.4)', fontSize: '1.2vw' }}>•</span>
              <span style={{
                fontSize: '1.1vw',
                color: isLight ? '#4B5563' : '#FFFFFF',
                fontWeight: 600,
              }}>
                puis 1,99 € / h
              </span>
            </div>

            {/* Nayax Contactless Guidance with Downward Arrow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.1vw',
            }}>
              <div style={{
                width: '3.4vw',
                height: '3.4vw',
                borderRadius: '50%',
                background: isLight ? '#FFFBEB' : 'rgba(255, 184, 0, 0.2)',
                border: isLight ? '2px solid #FCD34D' : '2px solid #FFB800',
                color: isLight ? '#B45309' : '#FFB800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6vw',
                flexShrink: 0,
                boxShadow: isLight ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 0 20px rgba(255, 184, 0, 0.4)',
              }}>
                💳
              </div>
              <div>
                <div style={{
                  fontSize: '1.3vw',
                  fontWeight: 900,
                  color: isLight ? '#110222' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5vw',
                }}>
                  <span>Paiement sans contact</span>
                  <span style={{ color: isLight ? '#D97706' : '#FFB800', fontSize: '1.5vw' }}>↓</span>
                </div>
                <div style={{
                  fontSize: '0.92vw',
                  color: isLight ? '#4B5563' : '#FFFFFF',
                  fontWeight: 600,
                  marginTop: '0.15vw',
                }}>
                  Approchez votre carte ou smartphone sur le lecteur sous l&apos;écran
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sculptural Luxury QR Card */}
          <div style={{
            flex: 0.75,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '2.2vw',
              borderRadius: '2.6vw',
              boxShadow: isLight
                ? '0 25px 70px rgba(17, 2, 34, 0.14), 0 0 50px rgba(255, 184, 0, 0.18)'
                : '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 60px rgba(255, 184, 0, 0.35)',
              border: isLight ? '2px solid rgba(17, 2, 34, 0.08)' : '3px solid rgba(255, 184, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.1vw',
              textAlign: 'center',
            }}>
              <QRCodeSVG 
                value={rentalUrl} 
                size={235}
                level="H"
                fgColor="#0E021B"
              />

              <div>
                <div style={{
                  fontSize: '1vw',
                  fontWeight: 900,
                  color: '#0E021B',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  Flashez pour débloquer
                </div>
                <div style={{
                  fontSize: '0.8vw',
                  fontWeight: 700,
                  color: '#4B5563',
                  marginTop: '0.25vw',
                }}>
                  imole.fr • Aucun téléchargement requis
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE B: CONFIRMATION SCREEN (TOUCHED ON SCREEN, READY FOR CONTACTLESS TAP) */}
      {kioskState === 'confirmation' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          zIndex: 5,
          maxWidth: '960px',
          margin: '0 auto',
          width: '100%',
          padding: '0 1vw',
        }}>
          {/* Top navigation with Back button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.6vw' }}>
            <button
              type="button"
              onClick={() => setKioskState('idle')}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1vw',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5vw',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
            >
              <span style={{ fontSize: '1.2vw' }}>←</span>
              <span>{isFr ? 'Retour à l\'accueil' : 'Back to home'}</span>
            </button>

            <span style={{
              fontSize: '0.82vw',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {isFr ? 'Tarifs & Conditions' : 'Pricing & Terms'}
            </span>
          </div>

          {/* Title & Natural Subtitle */}
          <div>
            <h1 style={{
              fontSize: '3.6vw',
              fontWeight: 800,
              margin: '0 0 0.5vw 0',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}>
              {isFr ? 'Location en toute transparence.' : 'Transparent, simple pricing.'}
            </h1>

            <p style={{
              fontSize: '1.2vw',
              color: 'rgba(255, 255, 255, 0.72)',
              margin: '0 0 2.2vw 0',
              lineHeight: 1.35,
              fontWeight: 500,
            }}>
              {isFr
                ? 'Sans abonnement. Sans mauvaise surprise. Déposez dans n\'importe quelle borne à Lille.'
                : 'No subscription required. No hidden fees. Return to any station across Lille.'}
            </p>
          </div>

          {/* OPEN MINIMALIST LEDGER (ZERO AI BOXES, ONLY SUBTLE HAIRLINES) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '1.8vw 0',
            marginBottom: '2.4vw',
          }}>
            {/* Column 1: 1st Hour */}
            <div style={{
              paddingRight: '1.5vw',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <span style={{
                fontSize: '0.8vw',
                color: '#FFB800',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {isFr ? '1ère heure' : '1st hour'}
              </span>
              <div style={{
                fontSize: '2.5vw',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginTop: '0.3vw',
                letterSpacing: '-0.02em',
              }}>
                2,49 €
              </div>
              <span style={{
                fontSize: '0.82vw',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '0.4vw',
                display: 'block',
              }}>
                {isFr ? 'Déverrouillage inclus' : 'Unlock included'}
              </span>
            </div>

            {/* Column 2: Next Hours */}
            <div style={{
              padding: '0 1.5vw',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <span style={{
                fontSize: '0.8vw',
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {isFr ? 'Heures suivantes' : 'Next hours'}
              </span>
              <div style={{
                fontSize: '2.5vw',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginTop: '0.3vw',
                letterSpacing: '-0.02em',
              }}>
                1,99 €
              </div>
              <span style={{
                fontSize: '0.82vw',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '0.4vw',
                display: 'block',
              }}>
                {isFr ? 'Par heure entamée' : 'Per started hour'}
              </span>
            </div>

            {/* Column 3: 24h Cap */}
            <div style={{
              padding: '0 1.5vw',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <span style={{
                fontSize: '0.8vw',
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {isFr ? 'Plafond 24h' : '24h maximum'}
              </span>
              <div style={{
                fontSize: '2.5vw',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginTop: '0.3vw',
                letterSpacing: '-0.02em',
              }}>
                14,99 €
              </div>
              <span style={{
                fontSize: '0.82vw',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '0.4vw',
                display: 'block',
              }}>
                {isFr ? 'Tarif max par 24h' : 'Max cap per 24h'}
              </span>
            </div>

            {/* Column 4: Temporary Hold */}
            <div style={{
              paddingLeft: '1.5vw',
            }}>
              <span style={{
                fontSize: '0.8vw',
                color: '#34D399',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {isFr ? 'Caution temporaire' : 'Security hold'}
              </span>
              <div style={{
                fontSize: '2.5vw',
                fontWeight: 800,
                color: '#34D399',
                lineHeight: 1.1,
                marginTop: '0.3vw',
                letterSpacing: '-0.02em',
              }}>
                24,99 €
              </div>
              <span style={{
                fontSize: '0.82vw',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '0.4vw',
                display: 'block',
              }}>
                {isFr ? 'Non débitée • Libérée au retour' : 'Not charged • Released on return'}
              </span>
            </div>
          </div>

          {/* CONTACTLESS UNLOCK PROMPT (NO BOX, FLUID ROW WITH REFINED PHRASING) */}
          <div
            onClick={() => setKioskState('dispensing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '0.8vw 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.4vw' }}>
              <div style={{
                width: '3.4vw',
                height: '3.4vw',
                borderRadius: '50%',
                background: 'rgba(255, 184, 0, 0.14)',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                color: '#FFB800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5vw',
                flexShrink: 0,
              }}>
                💳
              </div>
              <div>
                <div style={{
                  fontSize: '1.5vw',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}>
                  {isFr ? 'Approchez pour déverrouiller' : 'Hold near reader to unlock'}
                </div>
                <div style={{
                  fontSize: '0.92vw',
                  color: 'rgba(255, 255, 255, 0.68)',
                  marginTop: '0.25vw',
                  fontWeight: 500,
                }}>
                  {isFr
                    ? 'Paiement sans contact sur le lecteur situé juste sous l’écran • Carte ou smartphone'
                    : 'Contactless payment on the reader right below the screen • Card or smartphone'}
                </div>
              </div>
            </div>

            {/* Elegant pulse beacon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7vw',
              padding: '0.5vw 1.2vw',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <span className="live-pulse-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block',
              }} />
              <span style={{
                fontSize: '0.92vw',
                color: '#34D399',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {isFr ? 'Lecteur prêt' : 'Reader ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STATE C: DISPENSING / HARDWARE UNLOCK FEEDBACK */}
      {kioskState === 'dispensing' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          gap: '3vw',
          zIndex: 5,
          margin: '1vw 0',
        }}>
          {/* Left Side: Physical Ejection Guidance */}
          <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '1.2vw' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5vw',
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1.5px solid #10B981',
              borderRadius: '9999px',
              padding: '0.4vw 1.2vw',
              color: '#10B981',
              fontWeight: 800,
              fontSize: '0.9vw',
              width: 'fit-content',
            }}>
              <span style={{ fontSize: '1.2vw' }}>🎉</span>
              <span>{isFr ? 'DÉVERROUILLAGE EFFECTUÉ' : 'POWER BANK UNLOCKED'}</span>
            </div>

            <h1 style={{ fontSize: '3.6vw', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              {isFr ? (
                <>
                  Retirez votre batterie en <span style={{ color: '#10B981' }}>Fente {activeSlot}</span>
                </>
              ) : (
                <>
                  Take your power bank from <span style={{ color: '#10B981' }}>Slot {activeSlot}</span>
                </>
              )}
            </h1>

            <p style={{ fontSize: '1.2vw', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              {isFr
                ? 'La batterie est éjectée vers l\'avant avec voyant clignotant. Tirez doucement pour la libérer.'
                : 'The power bank has ejected forward with a flashing LED. Pull gently to release.'}
            </p>

            {/* Animated 8-Slot Visual Grid */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '1.2vw',
              padding: '1.2vw 1.6vw',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8vw',
              width: 'fit-content',
            }}>
              <span style={{ fontSize: '0.78vw', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
                {isFr ? 'Guide des 8 emplacements de cette borne :' : '8-slot station guide:'}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8vw' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
                  <div
                    key={slot}
                    className={slot === activeSlot ? 'slot-active-pulse' : ''}
                    style={{
                      width: '4.5vw',
                      height: '2.4vw',
                      borderRadius: '0.6vw',
                      background: slot === activeSlot ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                      border: slot === activeSlot ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9vw',
                      fontWeight: 800,
                      color: slot === activeSlot ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    Fente {slot}
                  </div>
                ))}
              </div>
            </div>

            {/* Built-in cables reminder */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw',
              fontSize: '0.95vw',
              color: '#FFB800',
              fontWeight: 700,
            }}>
              <span>⚡ Lightning (iPhone)</span>
              <span>•</span>
              <span>⚡ USB Type-C</span>
              <span>•</span>
              <span>⚡ Micro-USB</span>
            </div>
          </div>

          {/* Right Side: Optional Phone Tracking QR (Clean, zero heavy boxes) */}
          <div style={{
            flex: 0.85,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1vw',
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '1.2vw',
              borderRadius: '1.6vw',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            }}>
              <QRCodeSVG value={`https://imole.fr/active?battery=${batteryId}&kiosk=${kioskParam}`} size={160} level="H" fgColor="#18042B" />
            </div>

            <div>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>
                {isFr ? 'Suivre sur votre smartphone (Optionnel)' : 'Track on your phone (Optional)'}
              </span>
              <p style={{ fontSize: '0.78vw', color: 'rgba(255, 255, 255, 0.7)', margin: '0.4vw 0 0 0', lineHeight: 1.35 }}>
                {isFr
                  ? 'Scannez pour voir votre temps en direct et les bornes de retour. Ou partez directement !'
                  : 'Scan to view live timer & return stations. Or take it and go!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STATE D: RETURN SUCCESS FEEDBACK */}
      {kioskState === 'returned' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          gap: '3vw',
          zIndex: 5,
          margin: '1vw 0',
        }}>
          {/* Left Side: Summary of charges & hold released */}
          <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '1.4vw' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5vw',
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1.5px solid #10B981',
              borderRadius: '9999px',
              padding: '0.4vw 1.2vw',
              color: '#10B981',
              fontWeight: 800,
              fontSize: '0.9vw',
              width: 'fit-content',
            }}>
              <span style={{ fontSize: '1.2vw' }}>✓</span>
              <span>{isFr ? 'BATTERIE BIEN REÇUE — VERROUILLAGE EFFECTUÉ' : 'POWER BANK RETURNED SAFELY'}</span>
            </div>

            <h1 style={{ fontSize: '3.6vw', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              {isFr ? 'Merci d\'avoir utilisé IMỌLẸ !' : 'Thank you for using IMỌLẸ!'}
            </h1>

            <p style={{ fontSize: '1.1vw', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              {isFr
                ? 'Votre location est clôturée. La caution temporaire de 24,99 € est automatiquement débloquée sur votre carte.'
                : 'Your rental is closed. The €24.99 temporary hold has been automatically released on your card.'}
            </p>

            {/* Financial Summary (Zero AI boxes, sleek hairline ledger) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '1.2vw 0',
              marginTop: '0.6vw',
            }}>
              <div style={{ paddingRight: '1.5vw', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.78vw', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {isFr ? 'Durée de location' : 'Duration'}
                </span>
                <div style={{ fontSize: '2.2vw', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2vw' }}>
                  42 min
                </div>
              </div>

              <div style={{ padding: '0 1.5vw', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.78vw', color: '#FFB800', textTransform: 'uppercase', fontWeight: 700 }}>
                  {isFr ? 'Montant débité' : 'Final Charge'}
                </span>
                <div style={{ fontSize: '2.2vw', fontWeight: 800, color: '#FFB800', marginTop: '0.2vw' }}>
                  2,49 €
                </div>
              </div>

              <div style={{ paddingLeft: '1.5vw' }}>
                <span style={{ fontSize: '0.78vw', color: '#34D399', textTransform: 'uppercase', fontWeight: 700 }}>
                  {isFr ? 'Caution débloquée' : 'Hold Released'}
                </span>
                <div style={{ fontSize: '2.2vw', fontWeight: 800, color: '#34D399', marginTop: '0.2vw' }}>
                  22,50 €
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: e-Receipt QR (Clean, zero heavy boxes) */}
          <div style={{
            flex: 0.85,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1vw',
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '1.2vw',
              borderRadius: '1.6vw',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            }}>
              <QRCodeSVG value={`https://imole.fr/receipt?duration=42&cost=2,49&kiosk=${kioskParam}`} size={160} level="H" fgColor="#18042B" />
            </div>

            <div>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>
                {isFr ? 'Télécharger votre reçu (TVA)' : 'Download Receipt (VAT)'}
              </span>
              <p style={{ fontSize: '0.78vw', color: 'rgba(255, 255, 255, 0.7)', margin: '0.4vw 0 0 0', lineHeight: 1.35 }}>
                {isFr
                  ? 'Scannez avec votre téléphone pour obtenir votre facture officielle PDF.'
                  : 'Scan with your phone to save your official PDF invoice.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. LUXURY MINIMALIST FOOTER */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: isLight ? '1px solid rgba(17, 2, 34, 0.1)' : '1px solid rgba(255, 255, 255, 0.15)',
        paddingTop: '1vw',
        zIndex: 10,
        fontSize: '0.88vw',
        fontWeight: 600,
        color: isLight ? '#4B5563' : '#E2E8F0',
      }}>
        <span>📍 Borne #{kioskParam} • Déposez dans toute la métropole lilloise</span>
        <span>🔒 Caution restituée instantanément au retour</span>
      </footer>
    </div>
  );
}

export default function InteractiveKioskDisplay({ kioskParam }: { kioskParam?: string }) {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <KioskDisplay defaultKiosk={kioskParam} />
    </Suspense>
  );
}
