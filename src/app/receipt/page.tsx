"use client";

import { useI18n } from '@/components/I18nProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import ImoleLogo from '@/components/ImoleLogo';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';

function ReceiptContent() {
  const { lang, t } = useI18n();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = theme === 'dark';
  const isFr = lang === 'fr';

  // Query params (if redirected from return or QR)
  const queryDuration = searchParams.get('duration');
  const queryCost = searchParams.get('cost');
  const queryBattery = searchParams.get('battery') || 'BAT-F20002DD6A';
  const queryDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  // Self-service lookup state for Tap & Pay customers
  const [hasSearched, setHasSearched] = useState(Boolean(queryCost));
  const [last4, setLast4] = useState('');
  const [rentalDate, setRentalDate] = useState(queryDate);
  const [isSearching, setIsSearching] = useState(false);

  // Active receipt data
  const [receiptData, setReceiptData] = useState({
    duration: queryDuration || '42',
    cost: queryCost || '2,49',
    batteryId: queryBattery,
    rentalDate: queryDate,
    cardMask: '•••• •••• •••• 4821',
    kioskName: 'Station Grand Place • Lille (01)',
    invoiceNumber: 'IMO-2026-0842',
  });

  // Calculate VAT (20% standard French VAT)
  const costFloat = parseFloat(receiptData.cost.replace(',', '.')) || 2.49;
  const netHT = (costFloat / 1.20).toFixed(2).replace('.', ',');
  const vatAmount = (costFloat - (costFloat / 1.20)).toFixed(2).replace('.', ',');
  const holdReleased = (24.99 - costFloat).toFixed(2).replace('.', ',');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setReceiptData(prev => ({
        ...prev,
        cardMask: `•••• •••• •••• ${last4 || '4821'}`,
        rentalDate: rentalDate,
      }));
      setIsSearching(false);
      setHasSearched(true);
    }, 400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Color tokens
  const bgColor = isDark ? '#120224' : '#FAF9FE';
  const textPrimary = isDark ? '#FFFFFF' : '#18042B';
  const textSecondary = isDark ? 'rgba(255, 255, 255, 0.72)' : '#6B7280';
  const accentGold = isDark ? '#FFB800' : '#B45309';

  return (
    <div className="receipt-page-container" style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: bgColor,
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: textPrimary,
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* Print Styles for official PDF invoice */}
      <style jsx global>{`
        @media print {
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          .receipt-page-container {
            max-width: 100% !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .invoice-card {
            border: 1px solid #E5E7EB !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Brand Header */}
      <header className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <ImoleLogo size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          <LanguageToggle variant="auto" />
        </div>
      </header>

      {/* STATE A: SELF-SERVICE LOOKUP FORM FOR TAP & PAY CUSTOMERS */}
      {!hasSearched ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 184, 0, 0.12)',
              border: '1.5px solid #FFB800',
              color: '#FFB800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 0.8rem auto',
            }}>
              🧾
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
              {isFr ? 'Retrouver votre facture' : 'Find your receipt'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: textSecondary, margin: 0, lineHeight: 1.4 }}>
              {isFr
                ? 'Paiement sans contact sur borne ? Retrouvez votre reçu officiel avec TVA grâce à votre carte.'
                : 'Tapped your card at the kiosk? Download your official VAT invoice using your card details.'}
            </p>
          </div>

          <form onSubmit={handleLookup} style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
            borderRadius: '1.2rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            boxShadow: isDark ? 'none' : '0 10px 25px rgba(0, 0, 0, 0.04)',
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: textSecondary, marginBottom: '0.4rem' }}>
                {isFr ? '4 derniers chiffres de votre carte bancaire' : 'Last 4 digits of your card'}
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="4821"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#D1D5DB'}`,
                  background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F9FAFB',
                  color: textPrimary,
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: textSecondary, marginBottom: '0.4rem' }}>
                {isFr ? 'Date de la location' : 'Rental date'}
              </label>
              <input
                type="date"
                value={rentalDate}
                onChange={(e) => setRentalDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#D1D5DB'}`,
                  background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F9FAFB',
                  color: textPrimary,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)'
                  : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
                color: isDark ? '#120224' : '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.95rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '0.4rem',
                boxShadow: isDark ? '0 8px 24px rgba(255, 184, 0, 0.3)' : '0 8px 24px rgba(24, 4, 43, 0.2)',
              }}
            >
              {isSearching ? (isFr ? 'Recherche en cours...' : 'Searching...') : (isFr ? 'Rechercher mon reçu' : 'Find My Receipt')}
            </button>
          </form>
        </div>
      ) : (
        /* STATE B: OFFICIAL VAT INVOICE & RECEIPT DISPLAY */
        <div>
          {/* Success Badge */}
          <div className="no-print" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10B981',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              margin: '0 auto 0.6rem auto',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: textPrimary, margin: '0 0 0.25rem 0' }}>
              {t('receiptSuccess')}
            </h1>
            <p style={{ fontSize: '0.85rem', color: textSecondary, margin: 0 }}>
              {t('receiptThanks')}
            </p>
          </div>

          {/* Official French Invoice Card */}
          <div className="invoice-card" style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
            borderRadius: '1.2rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: isDark ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.05)',
          }}>
            {/* Header with Legal Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(128, 128, 128, 0.2)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block', color: textPrimary }}>IMỌLẸ Power Network</strong>
                <span style={{ fontSize: '0.75rem', color: textSecondary, display: 'block' }}>Réseau d&apos;énergie partagée • Lille (59000)</span>
                <span style={{ fontSize: '0.72rem', color: textSecondary, display: 'block' }}>SIRET : En cours d&apos;immatriculation • TVA FR : Récupérable</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  {isFr ? 'FACTURE / REÇU' : 'INVOICE / RECEIPT'}
                </span>
                <strong style={{ fontSize: '0.85rem', color: accentGold }}>{receiptData.invoiceNumber}</strong>
                <span style={{ fontSize: '0.75rem', color: textSecondary, display: 'block' }}>{receiptData.rentalDate}</span>
              </div>
            </div>

            {/* Financial Highlight */}
            <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t('finalChargedLabel')} (TTC)
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: accentGold, margin: '0.2rem 0' }}>
                {receiptData.cost} €
              </div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10B981',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}>
                <span>✓</span> {t('holdReleasedBadge')} : {holdReleased} €
              </span>
            </div>

            {/* VAT Accounting Breakdown (Standard French Invoice spec) */}
            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB',
              borderRadius: '0.75rem',
              padding: '0.9rem',
              marginBottom: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.82rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: textSecondary }}>{isFr ? 'Montant Net (HT)' : 'Net Amount (excl. VAT)'} :</span>
                <strong style={{ color: textPrimary }}>{netHT} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: textSecondary }}>{isFr ? 'TVA (20%)' : 'VAT (20%)'} :</span>
                <strong style={{ color: textPrimary }}>{vatAmount} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(128, 128, 128, 0.15)', paddingTop: '0.4rem', fontWeight: 800 }}>
                <span style={{ color: textPrimary }}>{isFr ? 'Total Débité (TTC)' : 'Total Charged (incl. VAT)'} :</span>
                <span style={{ color: accentGold }}>{receiptData.cost} €</span>
              </div>
            </div>

            {/* Service & Operational Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: textSecondary }}>{t('durationLabel')}</span>
                <strong style={{ color: textPrimary }}>{receiptData.duration} minutes</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: textSecondary }}>{t('paymentMethodLabel')}</span>
                <span style={{ color: textPrimary, fontWeight: 600 }}>{receiptData.cardMask} (Sans contact)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: textSecondary }}>Borne de retrait :</span>
                <span style={{ color: textPrimary }}>{receiptData.kioskName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: textSecondary }}>Batterie ID :</span>
                <span style={{ color: textPrimary, fontFamily: 'monospace' }}>{receiptData.batteryId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px solid rgba(128, 128, 128, 0.15)' }}>
                <span>Empreinte 24,99 € libérée :</span>
                <span>+ {holdReleased} €</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button
              onClick={handlePrint}
              style={{
                width: '100%',
                background: isDark
                  ? 'linear-gradient(135deg, #FFB800 0%, #FFA000 100%)'
                  : 'linear-gradient(135deg, #18042B 0%, #300E58 100%)',
                color: isDark ? '#120224' : '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.95rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: isDark ? '0 8px 24px rgba(255, 184, 0, 0.3)' : '0 8px 24px rgba(24, 4, 43, 0.2)',
              }}
            >
              <span>📄</span>
              <span>{isFr ? 'Télécharger Facture PDF / Imprimer' : 'Download PDF Invoice / Print'}</span>
            </button>

            <button
              onClick={() => setHasSearched(false)}
              style={{
                width: '100%',
                background: 'transparent',
                color: textSecondary,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
                borderRadius: '9999px',
                padding: '0.8rem 1.5rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isFr ? '🔍 Rechercher un autre reçu' : '🔍 Lookup Another Receipt'}
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                background: 'transparent',
                color: textSecondary,
                border: 'none',
                padding: '0.6rem 1.5rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← {isFr ? 'Retour au site IMỌLẸ' : 'Back to IMỌLẸ'}
            </button>
          </div>
        </div>
      )}

      <div className="no-print">
        <BottomNav activeTab="history" />
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#120224', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>Chargement...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
