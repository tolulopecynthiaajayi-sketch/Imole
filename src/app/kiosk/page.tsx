"use client";

import { useI18n } from '@/components/I18nProvider';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';

function KioskDisplay() {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const kioskParam = searchParams.get('kiosk');
  
  // Dynamic or static URL
  const rentalUrl = kioskParam ? `https://imole.fr/?kiosk=${kioskParam}` : 'https://imole.fr';
  const isFr = lang === 'fr';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 20% 30%, #350A5E 0%, #1A0430 55%, #0D021A 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.4vw 3.8vw',
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '25%',
        width: '45vw',
        height: '45vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 170, 0, 0.12) 0%, transparent 65%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      {/* TOP BAR: Logo + Live Pulse + Touch Language Toggle */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        height: '48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
          <ImoleLogo size="lg" light={true} />
          <div style={{
            height: '24px',
            width: '1px',
            background: 'rgba(255, 255, 255, 0.2)',
          }} />
          <span style={{
            fontSize: '0.85vw',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.65)',
            fontWeight: 700,
          }}>
            {isFr ? 'Réseau d\'énergie partagée' : 'Power Bank Sharing Network'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
          {/* Live Online Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5vw',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '0.4vw 1vw',
            borderRadius: '9999px',
            fontSize: '0.85vw',
            fontWeight: 700,
            color: '#34D399',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
            }} />
            <span>{isFr ? 'Borne Prête • 100% Chargée' : 'Station Ready • 100% Charged'}</span>
          </div>

          {/* Touch-Friendly FR/EN Toggle */}
          <LanguageToggle variant="dark" />
        </div>
      </header>

      {/* CENTER CONTENT GRID (16:10 Landscape Ratio - 60% Left / 40% Right) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        gap: '4vw',
        zIndex: 5,
        margin: '1.5vw 0',
      }}>
        {/* LEFT COLUMN: The Hook & Value Proposition */}
        <div style={{
          flex: 1.35,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.6vw',
        }}>
          {/* Catchphrase Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
            <span style={{
              background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.2) 0%, rgba(255, 115, 0, 0.25) 100%)',
              border: '1px solid rgba(255, 184, 0, 0.5)',
              color: '#FFB800',
              padding: '0.35vw 0.9vw',
              borderRadius: '9999px',
              fontSize: '0.8vw',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              ⚡ 5000 mAh Fast Charge
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.85)',
              padding: '0.35vw 0.9vw',
              borderRadius: '9999px',
              fontSize: '0.8vw',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}>
              {isFr ? 'Tous câbles intégrés' : 'All cables built-in'}
            </span>
          </div>

          {/* Main Magnet Headline */}
          <div>
            <h1 style={{
              fontSize: '3.6vw',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              {isFr ? (
                <>
                  Batterie à <span style={{ color: '#F87171' }}>5%</span> ?<br />
                  Repartez à <span style={{
                    background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>100%</span> en 1 clic.
                </>
              ) : (
                <>
                  Battery at <span style={{ color: '#F87171' }}>5%</span> ?<br />
                  Get back to <span style={{
                    background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>100%</span> in 1 click.
                </>
              )}
            </h1>

            <p style={{
              fontSize: '1.25vw',
              color: 'rgba(255, 255, 255, 0.75)',
              marginTop: '0.8vw',
              fontWeight: 500,
              lineHeight: 1.3,
            }}>
              {isFr 
                ? 'Emportez une batterie universelle et déposez-la dans n\'importe quelle borne.'
                : 'Take a universal power bank and return it to any station in the city.'}
            </p>
          </div>

          {/* 3 Steps Action Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1vw',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.2vw',
            padding: '1vw 1.2vw',
            backdropFilter: 'blur(15px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <span style={{
                width: '2vw',
                height: '2vw',
                borderRadius: '50%',
                background: 'rgba(255, 184, 0, 0.2)',
                color: '#FFB800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9vw',
                flexShrink: 0,
              }}>
                1
              </span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9vw', color: '#FFFFFF' }}>
                  {isFr ? 'Scannez le QR' : 'Scan the QR'}
                </strong>
                <span style={{ fontSize: '0.72vw', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {isFr ? 'Appareil photo' : 'Phone camera'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <span style={{
                width: '2vw',
                height: '2vw',
                borderRadius: '50%',
                background: 'rgba(255, 184, 0, 0.2)',
                color: '#FFB800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9vw',
                flexShrink: 0,
              }}>
                2
              </span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9vw', color: '#FFFFFF' }}>
                  {isFr ? 'Validez en 1 clic' : '1-Click Pay'}
                </strong>
                <span style={{ fontSize: '0.72vw', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Apple Pay / CB
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <span style={{
                width: '2vw',
                height: '2vw',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.2)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9vw',
                flexShrink: 0,
              }}>
                3
              </span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9vw', color: '#34D399' }}>
                  {isFr ? 'Emportez & Chargez' : 'Take & Charge'}
                </strong>
                <span style={{ fontSize: '0.72vw', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {isFr ? 'Éjection immédiate' : 'Automatic unlock'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1.2vw',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.6vw 1.2vw',
            borderRadius: '9999px',
            width: 'fit-content',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3vw' }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#FFB800' }}>2,49 €</span>
              <span style={{ fontSize: '0.8vw', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                {isFr ? '(1ère heure incluse)' : '(1st hour included)'}
              </span>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            <span style={{ fontSize: '0.8vw', color: 'rgba(255, 255, 255, 0.7)' }}>
              {isFr ? '1,99 € / h suppl. • Plafond 24h bloqué à 12,99 €' : 'then €1.99 / hr • 24h Cap €12.99'}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: The Magnetic QR Code Target Box */}
        <div style={{
          flex: 0.85,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Outer Ambient Glow Effect */}
          <div style={{
            background: '#FFFFFF',
            padding: '1.6vw',
            borderRadius: '2.4vw',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 70px rgba(255, 184, 0, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1vw',
            position: 'relative',
          }}>
            {/* Scannable Vector QR Code */}
            <div style={{
              background: '#FFFFFF',
              padding: '0.5vw',
              borderRadius: '1.2vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <QRCodeSVG 
                value={rentalUrl} 
                size={230}
                level="H"
                fgColor="#240540"
              />
            </div>

            {/* Instruction Callout */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#FAF5FF',
                color: '#300E58',
                padding: '0.4vw 1.2vw',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.95vw',
                letterSpacing: '-0.01em',
                display: 'inline-block',
                marginBottom: '0.3vw',
              }}>
                {isFr ? '📱 Pointez votre appareil photo' : '📱 Point your phone camera'}
              </div>
              <p style={{
                fontSize: '0.75vw',
                fontWeight: 600,
                color: '#6B7280',
                margin: 0,
              }}>
                Apple Pay • Google Pay • Carte Bancaire
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: Cable Types + Consumer Guarantees */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1vw',
        zIndex: 10,
        fontSize: '0.8vw',
        color: 'rgba(255, 255, 255, 0.7)',
      }}>
        {/* Built-in Cable Compatibility */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
            {isFr ? 'Câbles intégrés sur chaque batterie :' : 'Integrated cables on every battery:'}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2vw 0.6vw', borderRadius: '6px', color: '#FFB800', fontWeight: 600 }}>Lightning (iPhone)</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2vw 0.6vw', borderRadius: '6px', color: '#FFB800', fontWeight: 600 }}>USB Type-C</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2vw 0.6vw', borderRadius: '6px', color: '#FFB800', fontWeight: 600 }}>Micro-USB</span>
        </div>

        {/* Consumer Trust points */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
          <span>🔒 {isFr ? 'Paiement sécurisé par Stripe' : 'Secure Stripe Payment'}</span>
          <span>•</span>
          <span>⚡ {isFr ? 'Batteries certifiées CE anti-surchauffe' : 'CE Certified Overheat Protection'}</span>
          <span>•</span>
          <span>✓ {isFr ? 'Caution débloquée immédiatement' : 'Instant Deposit Release'}</span>
        </div>
      </footer>
    </div>
  );
}

export default function KioskAttractScreen() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#1E0438', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <KioskDisplay />
    </Suspense>
  );
}
