"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/I18nProvider';
import { useTheme } from '@/components/ThemeProvider';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';

interface CompanyHomeProps {
  onStartRental: () => void;
}

export default function CompanyHome({ onStartRental }: CompanyHomeProps) {
  const { lang } = useI18n();
  const { theme } = useTheme();
  const router = useRouter();
  const isFr = lang === 'fr';
  const isDark = theme === 'dark';

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    venueName: '',
    venueType: 'bar',
    address: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color tokens
  const bgColor = isDark ? '#120224' : '#FAF9FE';
  const textPrimary = isDark ? '#FFFFFF' : '#18042B';
  const textSecondary = isDark ? 'rgba(255, 255, 255, 0.75)' : '#4B5563';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.45)' : '#9CA3AF';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(24, 4, 43, 0.08)';
  const accentGold = isDark ? '#FFB800' : '#B45309';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      backgroundImage: isDark
        ? `
          radial-gradient(circle at 10% 0%, rgba(255, 184, 0, 0.12) 0%, transparent 40%),
          radial-gradient(circle at 90% 40%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 90%, rgba(255, 184, 0, 0.08) 0%, transparent 40%),
          linear-gradient(180deg, #120224 0%, #17032E 100%)
        `
        : `
          radial-gradient(circle at 10% 0%, rgba(255, 184, 0, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 40%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
          linear-gradient(180deg, #FAF9FE 0%, #F4F1FA 100%)
        `,
      color: textPrimary,
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* 1. TOP GLOBAL NAVIGATION */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: isDark ? 'rgba(18, 2, 36, 0.85)' : 'rgba(250, 249, 254, 0.85)',
        borderBottom: `1px solid ${borderColor}`,
        padding: '0.9rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo & City Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ImoleLogo size="md" />
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: accentGold,
              background: isDark ? 'rgba(255, 184, 0, 0.12)' : 'rgba(180, 83, 9, 0.08)',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              Lille
            </span>
          </div>

          {/* Center Navigation Links (Hidden on small mobile, visible on tablet/desktop) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}>
            <a href="#how-it-works" style={{ color: textSecondary, textDecoration: 'none', transition: 'color 0.15s' }}>
              {isFr ? 'Comment ça marche' : 'How it works'}
            </a>
            <a href="#tarifs" style={{ color: textSecondary, textDecoration: 'none', transition: 'color 0.15s' }}>
              {isFr ? 'Tarifs' : 'Pricing'}
            </a>
            <button
              onClick={() => router.push('/stations')}
              style={{
                background: 'transparent',
                border: 'none',
                color: textSecondary,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {isFr ? 'Carte des bornes' : 'Stations map'}
            </button>
            <a href="#partner-section" style={{ color: textSecondary, textDecoration: 'none', transition: 'color 0.15s' }}>
              {isFr ? 'Devenir Partenaire' : 'Host a Station'}
            </a>
          </div>

          {/* Right Action Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle />
            <LanguageToggle variant="auto" />
            
            <button
              type="button"
              onClick={onStartRental}
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)'
                  : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
                color: isDark ? '#120224' : '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.55rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isDark
                  ? '0 6px 20px rgba(255, 184, 0, 0.3)'
                  : '0 6px 18px rgba(24, 4, 43, 0.2)',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>⚡</span>
              <span>{isFr ? 'Louer une batterie' : 'Rent a battery'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem 4rem 1.5rem',
        textAlign: 'center',
      }}>
        {/* Eyebrow Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(255, 184, 0, 0.12)' : 'rgba(180, 83, 9, 0.08)',
          border: `1px solid ${isDark ? 'rgba(255, 184, 0, 0.3)' : 'rgba(180, 83, 9, 0.2)'}`,
          padding: '0.4rem 1.2rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: accentGold,
          marginBottom: '1.8rem',
        }}>
          <span>📍</span>
          <span>
            {isFr 
              ? 'Réseau d\'énergie partagée • Métropole Européenne de Lille'
              : 'Power Bank Sharing Network • European Metropolis of Lille'}
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          margin: '0 auto 1.5rem auto',
          maxWidth: '920px',
        }}>
          {isFr ? (
            <>
              L’énergie mobile en libre-service.<br />
              <span style={{
                background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Ne tombez plus jamais à 0%.
              </span>
            </>
          ) : (
            <>
              Instant power bank sharing.<br />
              <span style={{
                background: 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Never run out of battery.
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
          color: textSecondary,
          lineHeight: 1.55,
          maxWidth: '740px',
          margin: '0 auto 2.8rem auto',
          fontWeight: 500,
        }}>
          {isFr
            ? 'Emportez une batterie universelle 6000 mAh avec câbles intégrés dans n\'importe quel lieu de vie à Lille. Utilisez-la en toute liberté et déposez-la dans la borne de votre choix.'
            : 'Pick up a 6000 mAh universal power bank with built-in cables across Lille. Stay powered on the move and return to any station across the city.'}
        </p>

        {/* Hero Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem',
        }}>
          <button
            type="button"
            onClick={onStartRental}
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)'
                : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
              color: isDark ? '#120224' : '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '1.1rem 2.4rem',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isDark
                ? '0 12px 36px rgba(255, 184, 0, 0.35)'
                : '0 12px 32px rgba(24, 4, 43, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>⚡</span>
            <span>{isFr ? 'Déverrouiller une batterie' : 'Unlock a power bank'}</span>
          </button>

          <a
            href="#partner-section"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(24, 4, 43, 0.05)',
              border: `1px solid ${borderColor}`,
              color: textPrimary,
              borderRadius: '9999px',
              padding: '1.1rem 2.2rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🏢</span>
            <span>{isFr ? 'Installer une borne (Gratuit)' : 'Host a station (Free)'}</span>
          </a>
        </div>

        {/* Minimalist 4-Pillar Ledger (Zero AI boxes, pure hairlines) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          padding: '2rem 0',
          gap: '1.5rem',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: accentGold }}>3 Câbles</div>
            <div style={{ fontSize: '0.85rem', color: textSecondary, marginTop: '4px' }}>
              Lightning • USB-C • Micro-USB
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: textPrimary }}>6 000 mAh</div>
            <div style={{ fontSize: '0.85rem', color: textSecondary, marginTop: '4px' }}>
              {isFr ? 'Charge rapide jusqu\'à 2 charges' : 'Fast charge up to 2 full recharges'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: textPrimary }}>2,49 €</div>
            <div style={{ fontSize: '0.85rem', color: textSecondary, marginTop: '4px' }}>
              {isFr ? '1ère heure incluse • sans abonnement' : '1st hour included • no subscription'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>Norme CE</div>
            <div style={{ fontSize: '0.85rem', color: textSecondary, marginTop: '4px' }}>
              {isFr ? 'Protection thermique certifiée' : 'Certified thermal overheat protection'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.85rem',
            color: accentGold,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {isFr ? 'Simplicité absolue' : 'Effortless power'}
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0.6rem 0 0.8rem 0',
          }}>
            {isFr ? 'Comment ça fonctionne ?' : 'How does it work?'}
          </h2>
          <p style={{ fontSize: '1.05rem', color: textSecondary, maxWidth: '600px', margin: '0 auto' }}>
            {isFr 
              ? 'Pas d\'application lourde à télécharger. Emportez votre batterie en 2 secondes.'
              : 'No app download needed. Walk away with energy in 2 seconds.'}
          </p>
        </div>

        {/* 3-Step Open Flow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
        }}>
          {/* Step 1 */}
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: accentGold,
              lineHeight: 1,
              marginBottom: '1rem',
              opacity: 0.9,
            }}>
              01
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.6rem 0' }}>
              {isFr ? 'Approchez ou scannez' : 'Tap or scan'}
            </h3>
            <p style={{ fontSize: '0.95rem', color: textSecondary, lineHeight: 1.55, margin: 0 }}>
              {isFr
                ? 'Approchez directement votre carte bancaire ou Apple Pay sur le lecteur de la borne, ou scannez le QR code avec votre téléphone.'
                : 'Tap your contactless bank card or Apple Pay directly on the station reader, or scan the QR code with your smartphone camera.'}
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: accentGold,
              lineHeight: 1,
              marginBottom: '1rem',
              opacity: 0.9,
            }}>
              02
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.6rem 0' }}>
              {isFr ? 'Emportez votre énergie' : 'Take power with you'}
            </h3>
            <p style={{ fontSize: '0.95rem', color: textSecondary, lineHeight: 1.55, margin: 0 }}>
              {isFr
                ? 'La batterie s\'éjecte automatiquement. Compacte et légère, elle dispose déjà de tous les câbles (Lightning, USB-C, Micro-USB) intégrés.'
                : 'The power bank ejects automatically with flashing LEDs. Ultra-portable with all 3 cables already integrated.'}
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: accentGold,
              lineHeight: 1,
              marginBottom: '1rem',
              opacity: 0.9,
            }}>
              03
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.6rem 0' }}>
              {isFr ? 'Déposez où vous voulez' : 'Return anywhere'}
            </h3>
            <p style={{ fontSize: '0.95rem', color: textSecondary, lineHeight: 1.55, margin: 0 }}>
              {isFr
                ? 'Insérez simplement la batterie dans un emplacement libre de n\'importe quelle borne IMỌLẸ à Lille. La caution est immédiatement débloquée.'
                : 'Push the power bank into any empty slot across the IMỌLẸ network in Lille. The temporary hold is instantly released.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. TRANSPARENT PRICING LEDGER SECTION */}
      <section id="tarifs" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1.5rem',
      }}>
        <div style={{
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          padding: '3rem 0',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: accentGold, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isFr ? 'Tarification claire' : 'Transparent Rates'}
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0.5rem 0' }}>
              {isFr ? 'Zéro abonnement. Zéro engagement.' : 'No subscriptions. No surprises.'}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: accentGold, fontWeight: 700, textTransform: 'uppercase' }}>
                {isFr ? '1ère heure' : '1st hour'}
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.3rem 0' }}>2,49 €</div>
              <span style={{ fontSize: '0.82rem', color: textMuted }}>
                {isFr ? 'Déverrouillage inclus' : 'Unlock included'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                {isFr ? 'Heures suivantes' : 'Next hours'}
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.3rem 0' }}>1,99 €</div>
              <span style={{ fontSize: '0.82rem', color: textMuted }}>
                {isFr ? 'Par heure entamée' : 'Per started hour'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                {isFr ? 'Plafond 24h' : '24h Max Cap'}
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.3rem 0' }}>14,99 €</div>
              <span style={{ fontSize: '0.82rem', color: textMuted }}>
                {isFr ? 'Plafond maximum journalier' : 'Strict daily maximum'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>
                {isFr ? 'Caution temporaire' : 'Security hold'}
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981', margin: '0.3rem 0' }}>24,99 €</div>
              <span style={{ fontSize: '0.82rem', color: textMuted }}>
                {isFr ? 'Non débitée • Libérée au retour' : 'Not charged • Released on return'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. B2B VENUE PARTNERSHIP SECTION ("DEVENIR LIEU PARTENAIRE") */}
      <section id="partner-section" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left Column: The B2B Pitch */}
          <div>
            <span style={{
              fontSize: '0.85rem',
              color: accentGold,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {isFr ? 'Pour les commerces & lieux de vie' : 'For business & venue hosts'}
            </span>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0.6rem 0 1.2rem 0',
            }}>
              {isFr ? (
                <>
                  Installez une borne IMỌLẸ dans votre établissement.<br />
                  <span style={{ color: accentGold }}>100% Gratuit.</span>
                </>
              ) : (
                <>
                  Host an IMỌLẸ station in your venue.<br />
                  <span style={{ color: accentGold }}>100% Free of charge.</span>
                </>
              )}
            </h2>

            <p style={{ fontSize: '1.05rem', color: textSecondary, lineHeight: 1.6, marginBottom: '2rem' }}>
              {isFr
                ? 'Bars, restaurants, cafés, brasseries, hôtels, salles de sport et espaces de travail à Lille : offrez à vos clients un service premium indispensable sans jamais encombrer vos prises ni prendre la responsabilité de smartphones derrière votre comptoir.'
                : 'Bars, restaurants, hotels, cafes, gyms and coworking hubs in Lille: delight your guests with instant charging without tangling cords or holding phones behind the counter.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📈</span>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
                    {isFr ? 'Attirez de nouveaux clients' : 'Drive more foot traffic'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: textSecondary, margin: 0, lineHeight: 1.45 }}>
                    {isFr
                      ? 'Votre établissement apparaît sur la carte des bornes IMỌLẸ. Les utilisateurs viennent chez vous spécifiquement pour recharger.'
                      : 'Your venue is featured on the live IMỌLẸ network map, bringing low-battery customers straight to your door.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
                    {isFr ? 'Allongez le temps de consommation' : 'Increase dwell time & spend'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: textSecondary, margin: 0, lineHeight: 1.45 }}>
                    {isFr
                      ? 'Un client qui recharge son téléphone reste en moyenne 25 minutes de plus et consomme un verre ou un plat supplémentaire.'
                      : 'Customers who recharge stay 25 minutes longer on average and spend more on food and drinks.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💰</span>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
                    {isFr ? '0€ d’investissement • Revenus passifs' : 'Zero investment • Passive revenue'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: textSecondary, margin: 0, lineHeight: 1.45 }}>
                    {isFr
                      ? 'Borne 8 fentes livrée, branchée et connectée en 4G sans aucun frais. Vous touchez une commission sur chaque recharge effectuée.'
                      : 'Station delivered, installed, and 4G-connected free of charge. Earn commission on every rental made in your venue.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Partner Request Form */}
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.75)',
            border: `1px solid ${borderColor}`,
            borderRadius: '24px',
            padding: '2.5rem',
            backdropFilter: 'blur(15px)',
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              {isFr ? 'Demander votre borne gratuite' : 'Request your free station'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: textSecondary, margin: '0 0 1.8rem 0' }}>
              {isFr
                ? 'Installation sous 48h à Lille. Sans engagement, résiliable à tout moment.'
                : 'Installed within 48h in Lille. No commitment, cancel anytime.'}
            </p>

            {submitted ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10B981',
                borderRadius: '16px',
              }}>
                <span style={{ fontSize: '2.5rem' }}>🎉</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.8rem 0 0.4rem 0', color: '#10B981' }}>
                  {isFr ? 'Demande bien reçue !' : 'Request received!'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: textSecondary, margin: 0 }}>
                  {isFr
                    ? 'Notre équipe lilloise prendra contact avec vous dans les 24h pour planifier l\'installation.'
                    : 'Our Lille team will contact you within 24 hours to schedule installation.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: textSecondary, display: 'block', marginBottom: '4px' }}>
                    {isFr ? 'Nom du gérant / responsable' : 'Manager name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.name}
                    onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                    placeholder="Ex: Alexandre Dubois"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      border: `1px solid ${borderColor}`,
                      background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: textSecondary, display: 'block', marginBottom: '4px' }}>
                      {isFr ? 'Nom de l\'établissement' : 'Venue name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerForm.venueName}
                      onChange={(e) => setPartnerForm({ ...partnerForm, venueName: e.target.value })}
                      placeholder="Ex: Le Dandy Bar"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: `1px solid ${borderColor}`,
                        background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                        color: textPrimary,
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: textSecondary, display: 'block', marginBottom: '4px' }}>
                      {isFr ? 'Type d\'activité' : 'Venue type'}
                    </label>
                    <select
                      value={partnerForm.venueType}
                      onChange={(e) => setPartnerForm({ ...partnerForm, venueType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: `1px solid ${borderColor}`,
                        background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                        color: textPrimary,
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="bar">Bar / Pub</option>
                      <option value="restaurant">Restaurant / Brasserie</option>
                      <option value="cafe">Café / Coffee Shop</option>
                      <option value="hotel">Hôtel / Auberge</option>
                      <option value="coworking">Coworking / Bureau</option>
                      <option value="gym">Salle de sport</option>
                      <option value="other">Autre lieu de vie</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: textSecondary, display: 'block', marginBottom: '4px' }}>
                    {isFr ? 'Adresse à Lille' : 'Lille address'}
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.address}
                    onChange={(e) => setPartnerForm({ ...partnerForm, address: e.target.value })}
                    placeholder="Ex: 14 Rue de Gand, 59000 Lille"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      border: `1px solid ${borderColor}`,
                      background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: textSecondary, display: 'block', marginBottom: '4px' }}>
                      {isFr ? 'Numéro de téléphone' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={partnerForm.phone}
                      onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: `1px solid ${borderColor}`,
                        background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                        color: textPrimary,
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: textSecondary, display: 'block', marginBottom: '4px' }}>
                      {isFr ? 'Email professionnel' : 'Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                      placeholder="contact@ledandy.fr"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: `1px solid ${borderColor}`,
                        background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                        color: textPrimary,
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '0.8rem',
                    background: isDark
                      ? 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)'
                      : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
                    color: isDark ? '#120224' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: isDark
                      ? '0 8px 25px rgba(255, 184, 0, 0.3)'
                      : '0 8px 25px rgba(24, 4, 43, 0.2)',
                  }}
                >
                  {isSubmitting 
                    ? (isFr ? 'Envoi en cours...' : 'Submitting...')
                    : (isFr ? 'Demander l\'installation gratuite →' : 'Request free installation →')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL TRUST & CO-FINANCING FOOTER BAR */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        borderTop: `1px solid ${borderColor}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.82rem',
          color: textMuted,
        }}>
          <div>
            <span style={{ fontWeight: 700, color: textSecondary }}>IMỌLẸ SAS</span> • Réseau d'énergie partagée déployé dans la Métropole Lilloise.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>🇫🇷 République Française • Création</span>
            <span>🇪🇺 Cofinancé par l'Union Européenne</span>
            <span>⚡ BGE Pro</span>
          </div>
        </div>
      </section>

      {/* 7. GLOBAL FOOTER */}
      <footer style={{
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(24, 4, 43, 0.03)',
        borderTop: `1px solid ${borderColor}`,
        padding: '3rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.85rem',
          color: textSecondary,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ImoleLogo size="sm" />
            <span>© {new Date().getFullYear()} IMỌLẸ. Tous droits réservés.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="/how-it-works" style={{ color: textSecondary, textDecoration: 'none' }}>
              {isFr ? 'Comment ça marche' : 'How it works'}
            </a>
            <a href="/stations" style={{ color: textSecondary, textDecoration: 'none' }}>
              {isFr ? 'Carte des bornes' : 'Stations'}
            </a>
            <a href="/receipt" style={{ color: textSecondary, textDecoration: 'none' }}>
              {isFr ? 'Télécharger un reçu (TVA)' : 'VAT Receipt'}
            </a>
            <span style={{ opacity: 0.3 }}>•</span>
            <span style={{ color: textMuted }}>
              Lille • contact@imole.fr
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

