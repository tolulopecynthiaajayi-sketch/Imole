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
  const kioskParam = searchParams.get('kiosk');
  
  const rentalUrl = kioskParam ? `https://imole.fr/?kiosk=${kioskParam}` : 'https://imole.fr';
  const isFr = lang === 'fr';

  // Animated Battery Cycle (loops from 5% red to 100% green)
  const [chargeLevel, setChargeLevel] = useState(5);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
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
  }, []);

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
      padding: '2.5vw 4.2vw',
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* Dynamic Keyframe Styles */}
      <style jsx>{`
        @keyframes laserSweep {
          0% {
            top: 0%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @keyframes auraGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.08);
          }
        }

        @keyframes floatLevitate {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseDot {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
          }
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
      `}</style>

      {/* Floating Background Ambient Lighting Orbs */}
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

      {/* 1. TOP BAR: Editorial Logo + Status Indicator + Language Toggle */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        height: '52px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
          <ImoleLogo size="lg" light={true} />
          <div style={{ height: '22px', width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <span style={{
            fontSize: '0.85vw',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 700,
          }}>
            {isFr ? 'Réseau d\'énergie partagée' : 'Power Bank Sharing Network'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.4vw' }}>
          {/* Subtle Live Beacon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55vw',
            fontSize: '0.85vw',
            fontWeight: 700,
            color: '#34D399',
          }}>
            <span 
              className="live-pulse-dot"
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block',
              }} 
            />
            <span>{isFr ? 'Borne Prête • Batteries 100%' : 'Station Ready • 100% Charged'}</span>
          </div>

          {/* Smooth Touch Language Toggle */}
          <LanguageToggle variant="dark" />
        </div>
      </header>

      {/* 2. MAIN CENTER HERO: Pure Visual Magnetism (No Nested Boxes) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        gap: '4.5vw',
        zIndex: 5,
        margin: '1.2vw 0',
      }}>
        
        {/* LEFT COLUMN: Emotional Hook & Dynamic Energy Loop */}
        <div style={{
          flex: 1.35,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.8vw',
        }}>
          
          {/* Animated Battery Surging Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
            {/* The Live Battery Capsule */}
            <div style={{
              width: '68px',
              height: '32px',
              borderRadius: '9px',
              border: '2.5px solid rgba(255, 255, 255, 0.85)',
              padding: '3px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              {/* Positive Battery Terminal Tip */}
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '14px',
                borderRadius: '0 3px 3px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
              }} />

              {/* Dynamic Fill Meter */}
              <div style={{
                height: '100%',
                width: `${chargeLevel}%`,
                borderRadius: '4px',
                background: chargeLevel < 30
                  ? 'linear-gradient(90deg, #EF4444, #F87171)'
                  : 'linear-gradient(90deg, #10B981, #34D399)',
                boxShadow: chargeLevel < 30
                  ? '0 0 12px rgba(239, 68, 68, 0.7)'
                  : '0 0 14px rgba(52, 211, 153, 0.8)',
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease',
              }} />
            </div>

            {/* Percentage & Surge Text */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4vw' }}>
              <span style={{
                fontSize: '1.6vw',
                fontWeight: 800,
                color: chargeLevel < 30 ? '#F87171' : '#34D399',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 0.4s ease',
              }}>
                {chargeLevel}%
              </span>
              <span style={{
                fontSize: '0.85vw',
                fontWeight: 700,
                color: '#FFB800',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {isCharging ? '⚡ Charge Ultra-Rapide' : '⚡ 5000 mAh'}
              </span>
            </div>
          </div>

          {/* Main Cinematic Headline */}
          <div>
            <h1 style={{
              fontSize: '4.2vw',
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
                    textShadow: '0 0 35px rgba(255, 184, 0, 0.35)',
                  }}>100%</span> en 1 clic.
                </>
              ) : (
                <>
                  Battery at <span style={{ color: '#F87171' }}>5%</span> ?<br />
                  Get back to <span style={{
                    background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 35px rgba(255, 184, 0, 0.35)',
                  }}>100%</span> in 1 click.
                </>
              )}
            </h1>

            <p style={{
              fontSize: '1.35vw',
              color: 'rgba(255, 255, 255, 0.75)',
              marginTop: '0.9vw',
              fontWeight: 500,
              lineHeight: 1.35,
              maxWidth: '92%',
            }}>
              {isFr 
                ? 'Emportez une batterie universelle. Déposez-la dans n\'importe quelle borne en France.'
                : 'Take a universal power bank with you. Return it to any station across France.'}
            </p>
          </div>

          {/* Connected Flow Timeline (Fluid, No Boxes) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2vw',
            paddingTop: '0.4vw',
          }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
              <span style={{
                width: '1.8vw',
                height: '1.8vw',
                borderRadius: '50%',
                background: 'rgba(255, 184, 0, 0.25)',
                color: '#FFB800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85vw',
              }}>
                1
              </span>
              <span style={{ fontSize: '1vw', fontWeight: 700, color: '#FFFFFF' }}>
                {isFr ? 'Scannez le QR' : 'Scan the QR'}
              </span>
            </div>

            <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '1vw' }}>—</span>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
              <span style={{
                width: '1.8vw',
                height: '1.8vw',
                borderRadius: '50%',
                background: 'rgba(255, 184, 0, 0.25)',
                color: '#FFB800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85vw',
              }}>
                2
              </span>
              <span style={{ fontSize: '1vw', fontWeight: 700, color: '#FFFFFF' }}>
                {isFr ? 'Payez en 1 clic' : '1-Click Pay'}
              </span>
            </div>

            <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '1vw' }}>—</span>

            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
              <span style={{
                width: '1.8vw',
                height: '1.8vw',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.25)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85vw',
              }}>
                3
              </span>
              <span style={{ fontSize: '1vw', fontWeight: 700, color: '#34D399' }}>
                {isFr ? 'La batterie s\'éjecte' : 'Battery unlocks'}
              </span>
            </div>
          </div>

          {/* Pricing Headline Statement */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6vw' }}>
            <span style={{
              fontSize: '2vw',
              fontWeight: 800,
              color: '#FFB800',
              letterSpacing: '-0.02em',
            }}>
              2,49 €
            </span>
            <span style={{ fontSize: '0.95vw', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
              {isFr ? '(1ère heure incluse)' : '(1st hour included)'}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.35)', margin: '0 0.3vw' }}>•</span>
            <span style={{ fontSize: '0.95vw', color: 'rgba(255, 255, 255, 0.65)' }}>
              {isFr ? 'puis 1,99 € / h • Sans abonnement' : 'then €1.99 / hr • No subscription'}
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: The High-Contrast Floating QR Target with Laser Sweep */}
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
          {/* Pure White Minimal Pedestal */}
          <div style={{
            background: '#FFFFFF',
            padding: '1.8vw',
            borderRadius: '2.4vw',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.65), 0 0 60px rgba(255, 184, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.1vw',
            position: 'relative',
            overflow: 'hidden',
          }}>
            
            {/* The Active Laser Sweep Line */}
            <div className="laser-line" />

            {/* Crisp Vector QR Code */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '1vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <QRCodeSVG 
                value={rentalUrl} 
                size={240}
                level="H"
                fgColor="#240540"
              />
            </div>

            {/* Direct Call to Action */}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #240540 0%, #3B0F6B 100%)',
                color: '#FFFFFF',
                padding: '0.45vw 1.3vw',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.9vw',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 15px rgba(36, 5, 64, 0.3)',
              }}>
                {isFr ? '📱 Pointez votre appareil photo' : '📱 Point your phone camera'}
              </span>

              <p style={{
                fontSize: '0.75vw',
                fontWeight: 600,
                color: '#6B7280',
                marginTop: '0.4vw',
                marginBottom: 0,
              }}>
                Apple Pay • Google Pay • Carte Bancaire
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 3. MINIMALIST FOOTER: Built-in Cables & Security Guarantees */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        paddingTop: '0.9vw',
        zIndex: 10,
        fontSize: '0.85vw',
      }}>
        {/* Built-in Cables Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
            {isFr ? 'Câbles inclus sur chaque batterie :' : 'Cables included on each battery:'}
          </span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ Lightning (iPhone)</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ USB Type-C</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span style={{ color: '#FFB800', fontWeight: 700 }}>⚡ Micro-USB</span>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', color: 'rgba(255, 255, 255, 0.65)' }}>
          <span>🔒 {isFr ? 'Paiement sécurisé par Stripe' : 'Secure Stripe Payment'}</span>
          <span>•</span>
          <span>⚡ {isFr ? 'Protection anti-surchauffe certifiée' : 'Certified Overheat Protection'}</span>
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
