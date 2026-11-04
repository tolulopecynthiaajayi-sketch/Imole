"use client";

import { useI18n } from '@/components/I18nProvider';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Suspense, useState, useEffect } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';

function KioskDisplay() {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const kioskParam = searchParams.get('kiosk') || 'H00000147A';
  const initialStatus = searchParams.get('status') as 'idle' | 'dispense' | 'return' | null;
  
  const rentalUrl = `https://imole.fr/?kiosk=${kioskParam}`;
  const isFr = lang === 'fr';

  // Kiosk state: 'idle' | 'dispensing' | 'returned'
  const [kioskState, setKioskState] = useState<'idle' | 'dispensing' | 'returned'>(
    initialStatus === 'dispense' ? 'dispensing' : initialStatus === 'return' ? 'returned' : 'idle'
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

  // Auto-reset from dispensing or returned after 20 seconds
  useEffect(() => {
    if (kioskState === 'idle') return;
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
      backgroundColor: '#120224',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(75, 0, 130, 0.45) 0%, transparent 55%),
        radial-gradient(circle at 85% 80%, rgba(255, 170, 0, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(48, 14, 88, 0.6) 0%, transparent 70%)
      `,
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.2vw 3.8vw',
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

      {/* 1. TOP HEADER: Brand, Status, Mode Simulator, Language */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        height: '48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
          <ImoleLogo size="lg" light={true} />
          <div style={{ height: '22px', width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <span style={{
            fontSize: '0.82vw',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 700,
          }}>
            {isFr ? 'Réseau d\'énergie partagée • Lille' : 'Power Bank Sharing Network • Lille'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
          {/* Hardware Demo State Simulator (Useful for testing & presentations) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '2px 4px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}>
            <button
              onClick={() => setKioskState('idle')}
              style={{
                background: kioskState === 'idle' ? '#FFB800' : 'transparent',
                color: kioskState === 'idle' ? '#120224' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72vw',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isFr ? 'Accueil' : 'Attract'}
            </button>
            <button
              onClick={() => {
                setActiveSlot(3);
                setKioskState('dispensing');
              }}
              style={{
                background: kioskState === 'dispensing' ? '#10B981' : 'transparent',
                color: kioskState === 'dispensing' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72vw',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isFr ? '⚡ Test Éjection' : '⚡ Test Dispense'}
            </button>
            <button
              onClick={() => setKioskState('returned')}
              style={{
                background: kioskState === 'returned' ? '#6366F1' : 'transparent',
                color: kioskState === 'returned' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72vw',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isFr ? '✓ Test Retour' : '✓ Test Return'}
            </button>
          </div>

          {/* Language Flag Selector */}
          <LanguageToggle variant="dark" />
        </div>
      </header>

      {/* 2. DYNAMIC CENTER CONTENT BASED ON STATE */}

      {/* STATE A: IDLE / ATTRACT SCREEN (DUAL CHOICE: TAPEZ CI-DESSOUS OU SCANNEZ) */}
      {kioskState === 'idle' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          gap: '4vw',
          zIndex: 5,
          margin: '0.8vw 0',
        }}>
          {/* Left Column: Emotion + Battery Meter + Dual Choice Cards */}
          <div style={{
            flex: 1.35,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.4vw',
          }}>
            {/* Battery Indicator Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{
                width: '64px',
                height: '28px',
                borderRadius: '8px',
                border: '2.5px solid rgba(255, 255, 255, 0.85)',
                padding: '3px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}>
                <div style={{
                  position: 'absolute',
                  right: '-6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '12px',
                  borderRadius: '0 3px 3px 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                }} />
                <div style={{
                  height: '100%',
                  width: `${chargeLevel}%`,
                  borderRadius: '3px',
                  background: chargeLevel < 30
                    ? 'linear-gradient(90deg, #EF4444, #F87171)'
                    : 'linear-gradient(90deg, #10B981, #34D399)',
                  boxShadow: chargeLevel < 30
                    ? '0 0 12px rgba(239, 68, 68, 0.7)'
                    : '0 0 14px rgba(52, 211, 153, 0.8)',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4vw' }}>
                <span style={{
                  fontSize: '1.45vw',
                  fontWeight: 800,
                  color: chargeLevel < 30 ? '#F87171' : '#34D399',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {chargeLevel}%
                </span>
                <span style={{
                  fontSize: '0.8vw',
                  fontWeight: 700,
                  color: '#FFB800',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  {isCharging ? '⚡ Charge Ultra-Rapide' : '⚡ 6000 mAh'}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{
                fontSize: '3.8vw',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                margin: 0,
              }}>
                {isFr ? (
                  <>
                    Batterie à <span style={{ color: '#F87171' }}>5%</span> ?<br />
                    Repartez à <span style={{
                      background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>100%</span> en 2 secondes.
                  </>
                ) : (
                  <>
                    Battery at <span style={{ color: '#F87171' }}>5%</span> ?<br />
                    Get back to <span style={{
                      background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>100%</span> in 2 seconds.
                  </>
                )}
              </h1>

              {/* Pricing Line */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5vw', marginTop: '0.7vw' }}>
                <span style={{ fontSize: '1.75vw', fontWeight: 800, color: '#FFB800' }}>
                  2,49 €
                </span>
                <span style={{ fontSize: '0.9vw', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                  {isFr ? '(1ère heure incluse)' : '(1st hour included)'}
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                <span style={{ fontSize: '0.85vw', color: 'rgba(255, 255, 255, 0.65)' }}>
                  {isFr ? 'puis 1,99 € / h • Plafond 24h : 14,99 €' : 'then €1.99 / hr • 24h Cap: €14.99'}
                </span>
              </div>
            </div>

            {/* DUAL PAYMENT METHOD CARDS (PHYSICAL TAP OR QR SCAN) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 1fr',
              gap: '0.9vw',
              marginTop: '0.2vw',
            }}>
              {/* Option A: Direct Contactless Tap on Nayax Reader */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.14) 0%, rgba(255, 184, 0, 0.04) 100%)',
                border: '1.5px solid rgba(255, 184, 0, 0.5)',
                borderRadius: '1.1vw',
                padding: '0.9vw 1.1vw',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3vw',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.75vw',
                    fontWeight: 800,
                    color: '#FFB800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    💳 {isFr ? 'Option 1 : Sans Contact' : 'Option 1: Tap to Pay'}
                  </span>
                  <span style={{
                    fontSize: '0.65vw',
                    background: 'rgba(255, 184, 0, 0.2)',
                    color: '#FFB800',
                    padding: '0.15vw 0.45vw',
                    borderRadius: '9999px',
                    fontWeight: 800,
                  }}>
                    {isFr ? 'Instantané' : 'Instant'}
                  </span>
                </div>

                <div style={{ fontSize: '1.05vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15 }}>
                  {isFr ? 'Tapez votre carte ci-dessous' : 'Tap your card below'}
                </div>

                <p style={{ fontSize: '0.75vw', color: 'rgba(255, 255, 255, 0.72)', margin: 0, lineHeight: 1.3 }}>
                  {isFr 
                    ? 'Lecteur Nayax • CB, Apple Pay, Visa, Mastercard (Caution temporaire 24,99 €)'
                    : 'Nayax reader • Debit, Apple Pay, Visa, Mastercard (Temp hold €24.99)'}
                </p>

                {/* Pulsing Down Arrow towards physical Nayax Reader */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35vw',
                  fontSize: '0.75vw',
                  color: '#FFB800',
                  fontWeight: 700,
                  marginTop: '0.2vw',
                }}>
                  <span style={{ animation: 'bounceDown 1.4s infinite', display: 'inline-block', fontSize: '0.9vw' }}>↓</span>
                  <span>{isFr ? 'Lecteur situé juste sous cet écran' : 'Reader right below this screen'}</span>
                </div>
              </div>

              {/* Option B: Mobile Smartphone QR Scan */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '1.1vw',
                padding: '0.9vw 1.1vw',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3vw',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.75vw',
                    fontWeight: 800,
                    color: 'rgba(255, 255, 255, 0.85)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    📱 {isFr ? 'Option 2 : Smartphone' : 'Option 2: Phone'}
                  </span>
                  <span style={{
                    fontSize: '0.65vw',
                    background: 'rgba(52, 211, 153, 0.18)',
                    color: '#34D399',
                    padding: '0.15vw 0.45vw',
                    borderRadius: '9999px',
                    fontWeight: 800,
                  }}>
                    {isFr ? 'Sans appli' : 'No App'}
                  </span>
                </div>

                <div style={{ fontSize: '1.05vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15 }}>
                  {isFr ? 'Scannez le QR à droite' : 'Scan the QR on right'}
                </div>

                <p style={{ fontSize: '0.75vw', color: 'rgba(255, 255, 255, 0.72)', margin: 0, lineHeight: 1.3 }}>
                  {isFr
                    ? 'Ouvrez votre appareil photo • Suivi du temps en direct sur votre téléphone'
                    : 'Open camera • Live timer tracking on your mobile'}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35vw',
                  fontSize: '0.75vw',
                  color: '#34D399',
                  fontWeight: 700,
                  marginTop: '0.2vw',
                }}>
                  <span>→</span>
                  <span>{isFr ? 'Visez le socle blanc avec votre téléphone' : 'Point camera at the pedestal'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Contrast QR Code Pedestal with Active Laser */}
          <div 
            className="floating-element"
            style={{
              flex: 0.82,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{
              background: '#FFFFFF',
              padding: '1.6vw',
              borderRadius: '2.2vw',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.65), 0 0 60px rgba(255, 184, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div className="laser-line" />

              <div style={{
                background: '#FFFFFF',
                borderRadius: '0.8vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <QRCodeSVG 
                  value={rentalUrl} 
                  size={220}
                  level="H"
                  fgColor="#18042B"
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
                  color: '#FFFFFF',
                  padding: '0.4vw 1.2vw',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.85vw',
                  letterSpacing: '-0.01em',
                }}>
                  {isFr ? '📱 Pointez votre appareil photo' : '📱 Point your phone camera'}
                </span>
                <p style={{
                  fontSize: '0.72vw',
                  fontWeight: 600,
                  color: '#6B7280',
                  marginTop: '0.35vw',
                  marginBottom: 0,
                }}>
                  Apple Pay • Google Pay • Carte Bancaire
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE B: DISPENSING / HARDWARE UNLOCK FEEDBACK */}
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
              <span>{isFr ? 'PAIEMENT APPROUVÉ — DÉVERROUILLAGE EN COURS' : 'PAYMENT APPROVED — DISPENSING'}</span>
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

          {/* Right Side: Optional Phone Tracking QR */}
          <div style={{
            flex: 0.85,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '2vw',
            padding: '1.8vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1vw',
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '0.8vw',
              borderRadius: '1vw',
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

      {/* STATE C: RETURN SUCCESS FEEDBACK */}
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

            {/* Financial Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1vw',
              marginTop: '0.5vw',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '1vw',
                padding: '1vw',
              }}>
                <span style={{ fontSize: '0.75vw', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {isFr ? 'Durée de location' : 'Duration'}
                </span>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2vw' }}>
                  42 min
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 184, 0, 0.1)',
                border: '1.5px solid rgba(255, 184, 0, 0.4)',
                borderRadius: '1vw',
                padding: '1vw',
              }}>
                <span style={{ fontSize: '0.75vw', color: '#FFB800', textTransform: 'uppercase', fontWeight: 700 }}>
                  {isFr ? 'Montant débité' : 'Final Charge'}
                </span>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#FFB800', marginTop: '0.2vw' }}>
                  2,49 €
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '1vw',
                padding: '1vw',
              }}>
                <span style={{ fontSize: '0.75vw', color: '#10B981', textTransform: 'uppercase', fontWeight: 700 }}>
                  {isFr ? 'Caution débloquée' : 'Hold Released'}
                </span>
                <div style={{ fontSize: '1.8vw', fontWeight: 800, color: '#10B981', marginTop: '0.2vw' }}>
                  22,50 €
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: e-Receipt QR */}
          <div style={{
            flex: 0.85,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '2vw',
            padding: '1.8vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1vw',
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '0.8vw',
              borderRadius: '1vw',
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

      {/* 3. MINIMALIST FOOTER: Built-in Cables & Dual Security Guarantees */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        paddingTop: '0.8vw',
        zIndex: 10,
        fontSize: '0.82vw',
      }}>
        {/* Built-in Cables Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
            {isFr ? 'Câbles inclus sur chaque batterie :' : 'Cables included on each power bank:'}
          </span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ Lightning (iPhone)</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ USB Type-C</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ Micro-USB</span>
        </div>

        {/* Dual Nayax & Stripe Trust Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', color: 'rgba(255, 255, 255, 0.65)' }}>
          <span>🔒 {isFr ? 'Paiement certifié Nayax & Stripe' : 'Certified Nayax & Stripe Payments'}</span>
          <span>•</span>
          <span>⚡ {isFr ? 'Protection anti-surchauffe certifiée CE' : 'CE-Certified Overheat Protection'}</span>
        </div>
      </footer>
    </div>
  );
}

export default function KioskAttractScreen() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <KioskDisplay />
    </Suspense>
  );
}
