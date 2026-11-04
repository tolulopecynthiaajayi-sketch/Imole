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
  const initialStatus = searchParams.get('status') as 'idle' | 'confirmation' | 'dispense' | 'return' | null;
  
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
          {/* Hardware Demo State Simulator */}
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
              onClick={() => setKioskState('confirmation')}
              style={{
                background: kioskState === 'confirmation' ? '#FFB800' : 'transparent',
                color: kioskState === 'confirmation' ? '#120224' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72vw',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isFr ? '💳 Test Tap' : '💳 Test Tap'}
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

          <LanguageToggle variant="dark" />
        </div>
      </header>

      {/* 2. DYNAMIC CENTER CONTENT BASED ON STATE */}

      {/* STATE A: IDLE / ATTRACT SCREEN (CLEAN, NO AI BOXES, NO 24H/48H CAP, NO POINT CAMERA TEXT) */}
      {kioskState === 'idle' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          gap: '4.5vw',
          zIndex: 5,
          margin: '0.8vw 0',
        }}>
          {/* Left Column: Emotion + Battery Meter + Clean Fluid Options (Zero Boxes) */}
          <div style={{
            flex: 1.35,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.6vw',
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
                fontSize: '3.9vw',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                {isFr ? (
                  <>
                    <span>Batterie à <span style={{ color: '#F87171' }}>5%</span> ?</span><br />
                    <span style={{ whiteSpace: 'nowrap' }}>
                      Repartez à <span style={{
                        background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 35px rgba(255, 184, 0, 0.35)',
                      }}>100%</span> en 1 clic.
                    </span>
                  </>
                ) : (
                  <>
                    <span>Battery at <span style={{ color: '#F87171' }}>5%</span> ?</span><br />
                    <span style={{ whiteSpace: 'nowrap' }}>
                      Get back to <span style={{
                        background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 35px rgba(255, 184, 0, 0.35)',
                      }}>100%</span> in 1 click.
                    </span>
                  </>
                )}
              </h1>

              <p style={{
                fontSize: '1.2vw',
                color: 'rgba(255, 255, 255, 0.72)',
                marginTop: '0.7vw',
                marginBottom: 0,
                fontWeight: 500,
                lineHeight: 1.35,
                maxWidth: '92%',
              }}>
                {isFr 
                  ? 'Emportez une batterie universelle. Déposez-la dans n\'importe quelle borne à Lille.'
                  : 'Take a universal power bank with you. Return it to any station in Lille.'}
              </p>

              {/* Clean Pricing Line */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6vw', marginTop: '0.85vw' }}>
                <span style={{ fontSize: '1.85vw', fontWeight: 800, color: '#FFB800', letterSpacing: '-0.02em' }}>
                  2,49 €
                </span>
                <span style={{ fontSize: '0.95vw', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                  {isFr ? '(1ère heure incluse)' : '(1st hour included)'}
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.3)', margin: '0 0.2vw' }}>•</span>
                <span style={{ fontSize: '0.95vw', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {isFr ? 'puis 1,99 € / h' : 'then €1.99 / hr'}
                </span>
              </div>
            </div>

            {/* DUAL PAYMENT OPTIONS ON THE SAME HORIZONTAL LINE (ZERO AI BOXES) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2vw',
              marginTop: '0.8vw',
              flexWrap: 'nowrap',
            }}>
              {/* Option 1: Touch Screen to Start Contactless Rental */}
              <div 
                onClick={() => setKioskState('confirmation')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8vw',
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                <div style={{
                  width: '2.5vw',
                  height: '2.5vw',
                  borderRadius: '50%',
                  background: 'rgba(255, 184, 0, 0.16)',
                  color: '#FFB800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2vw',
                  flexShrink: 0,
                }}>
                  💳
                </div>
                <div>
                  <div style={{
                    fontSize: '1.15vw',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4vw',
                  }}>
                    <span>{isFr ? 'Paiement sans contact' : 'Contactless payment'}</span>
                    <span style={{ color: '#FFB800' }}>→</span>
                  </div>
                  <div style={{
                    fontSize: '0.78vw',
                    color: '#FFB800',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    marginTop: '0.1vw',
                  }}>
                    {isFr ? 'Toucher pour voir les tarifs' : 'Touch to view rates'}
                  </div>
                </div>
              </div>

              {/* Elegant separator */}
              <span style={{
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '0.95vw',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}>
                {isFr ? 'ou' : 'or'}
              </span>

              {/* Option 2: Mobile QR Scan */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{
                  width: '2.5vw',
                  height: '2.5vw',
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2vw',
                  flexShrink: 0,
                }}>
                  📱
                </div>
                <div>
                  <div style={{ fontSize: '1.15vw', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                    {isFr ? 'Scannez le QR code' : 'Scan the QR code'}
                  </div>
                  <div style={{ fontSize: '0.78vw', color: 'rgba(255, 255, 255, 0.65)', whiteSpace: 'nowrap', marginTop: '0.1vw' }}>
                    {isFr ? 'Sur votre smartphone' : 'On your smartphone'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pure Minimal White QR Pedestal (NO CAMERA INSTRUCTIONS, NO CARD BRAND LIST) */}
          <div 
            className="floating-element"
            style={{
              flex: 0.8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{
              background: '#FFFFFF',
              padding: '1.8vw',
              borderRadius: '2.4vw',
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
                  size={230}
                  level="H"
                  fgColor="#18042B"
                />
              </div>

              <span style={{
                fontSize: '0.85vw',
                fontWeight: 800,
                color: '#18042B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                imole.fr
              </span>
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

      {/* 3. MINIMALIST FOOTER: Built-in Cables & Clean Security Line */}
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
            {isFr ? 'Câbles inclus :' : 'Cables included:'}
          </span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ Lightning</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ USB Type-C</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ Micro-USB</span>
        </div>

        {/* Security Assurance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', color: 'rgba(255, 255, 255, 0.65)' }}>
          <span>🔒 {isFr ? 'Paiement sécurisé' : 'Secure Payments'}</span>
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
