"use client";

import { useI18n } from '@/components/I18nProvider';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Suspense } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import TrustBadges from '@/components/TrustBadges';
import LanguageToggle from '@/components/LanguageToggle';

function KioskContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const kioskParam = searchParams.get('kiosk');
  
  // If a kiosk parameter is present, encode it in the QR so user's phone knows which station to unlock;
  // otherwise default to standard imole.fr
  const rentalUrl = kioskParam ? `https://imole.fr/?kiosk=${kioskParam}` : 'https://imole.fr';

  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'radial-gradient(ellipse at top left, #3B0F6B 0%, #20083B 60%, #120324 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4rem 6rem',
      gap: '5rem',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 167, 81, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left side: Hero & Information */}
      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 1 }}>
        {/* Top Branding & Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ImoleLogo size="lg" light={true} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.85rem',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}>
              <span className="live-dot" />
              <span>{t('stationOnline')}</span>
            </div>

            {/* Kiosk Language Switcher */}
            <LanguageToggle variant="dark" />
          </div>
        </div>

        {/* Catchphrase & Subtitle */}
        <div>
          <div style={{
            display: 'inline-block',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255, 167, 81, 0.25) 0%, rgba(255, 215, 0, 0.1) 100%)',
            border: '1px solid rgba(255, 167, 81, 0.4)',
            color: '#FFA751',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            {t('portableEnergyTag')}
          </div>

          <h1 style={{ 
            fontSize: '4.2rem', 
            fontWeight: 800, 
            lineHeight: 1.08, 
            letterSpacing: '-0.02em',
            color: '#FFFFFF' 
          }}>
            {t('kioskTagline')}
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.75rem', fontWeight: 500 }}>
            {t('kioskSubtitle')}
          </p>
        </div>

        {/* Pricing & Compatibility Cards */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
              {t('kioskTarifTitle')}
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0.2rem 0' }}>
              {t('kioskTarifMain')}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('kioskTarifSub')}
            </span>
          </div>

          <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
              {t('kioskCompatTitle')}
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0.35rem 0' }}>
              3 câbles intégrés
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('kioskCompatSub')}
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ marginTop: '0.5rem' }}>
          <TrustBadges variant="dark" />
        </div>
      </div>

      {/* Right side: Large Crisp QR Code Card */}
      <div style={{ 
        flex: 0.9, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1 
      }}>
        <div style={{ 
          padding: '2.5rem', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(255, 167, 81, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <QRCodeSVG 
            value={rentalUrl} 
            size={340}
            level="H"
            fgColor="#2A084E"
          />

          <div style={{ textAlign: 'center' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '0.4rem 1rem', 
              borderRadius: '9999px', 
              backgroundColor: '#FAF5FF', 
              color: '#300E58', 
              fontWeight: 800, 
              fontSize: '0.95rem' 
            }}>
              {t('kioskScanPill')}
            </span>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.5rem' }}>
              {t('kioskPaymentPill')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function KioskAttractScreen() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <KioskContent />
    </Suspense>
  );
}
