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

  // Query params passed from active rental return
  const duration = searchParams.get('duration') || '42';
  const cost = searchParams.get('cost') || '2,49';
  const batteryId = searchParams.get('battery') || 'BAT-F20002DD6A';
  const kioskName = searchParams.get('kiosk') || 'Station Grand Place • Lille';
  const invoiceNumber = 'IMO-2026-0842';
  const todayDate = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB');

  // Email receipt state
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Calculate VAT breakdown (20% French TVA)
  const costFloat = parseFloat(cost.replace(',', '.')) || 2.49;
  const netHT = (costFloat / 1.20).toFixed(2).replace('.', ',');
  const vatAmount = (costFloat - (costFloat / 1.20)).toFixed(2).replace('.', ',');
  const holdReleased = (24.99 - costFloat).toFixed(2).replace('.', ',');

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailSent(true);
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
      maxWidth: '460px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: bgColor,
      padding: '1.5rem 1.5rem 6.5rem 1.5rem',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      color: textPrimary,
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* Print-only CSS rules */}
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

      {/* Success Badge */}
      <div className="no-print" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid #10B981',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.65rem',
          margin: '0 auto 0.6rem auto',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
        }}>
          ✓
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: textPrimary, margin: '0 0 0.25rem 0' }}>
          {t('receiptSuccess')}
        </h1>
        <p style={{ fontSize: '0.85rem', color: textSecondary, margin: 0 }}>
          {t('receiptThanks')}
        </p>
      </div>

      {/* Official French VAT Invoice Card */}
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
            <strong style={{ fontSize: '1rem', display: 'block', color: textPrimary }}>IMỌLẸ Power Network</strong>
            <span style={{ fontSize: '0.75rem', color: textSecondary, display: 'block' }}>Réseau d&apos;énergie partagée • Lille (59000)</span>
            <span style={{ fontSize: '0.72rem', color: textSecondary, display: 'block' }}>SIRET : En cours d&apos;immatriculation • TVA FR 20%</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              {isFr ? 'REÇU / FACTURE' : 'INVOICE / RECEIPT'}
            </span>
            <strong style={{ fontSize: '0.85rem', color: accentGold }}>{invoiceNumber}</strong>
            <span style={{ fontSize: '0.75rem', color: textSecondary, display: 'block' }}>{todayDate}</span>
          </div>
        </div>

        {/* Financial Highlight */}
        <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('finalChargedLabel')} (TTC)
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: accentGold, margin: '0.2rem 0' }}>
            {cost} €
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
            fontSize: '0.78rem',
            fontWeight: 800,
          }}>
            <span>✓</span> {t('holdReleasedBadge')} : {holdReleased} €
          </span>
        </div>

        {/* VAT Breakdown */}
        <div style={{
          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB',
          borderRadius: '0.75rem',
          padding: '0.85rem 1rem',
          marginBottom: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
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
            <span style={{ color: accentGold }}>{cost} €</span>
          </div>
        </div>

        {/* Operational Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>{t('durationLabel')}</span>
            <strong style={{ color: textPrimary }}>{duration} minutes</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>{t('paymentMethodLabel')}</span>
            <span style={{ color: textPrimary, fontWeight: 600 }}>Apple Pay / Carte</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>Borne de retour :</span>
            <span style={{ color: textPrimary }}>{kioskName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>Batterie ID :</span>
            <span style={{ color: textPrimary, fontFamily: 'monospace' }}>{batteryId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px solid rgba(128, 128, 128, 0.15)' }}>
            <span>Caution 24,99 € libérée :</span>
            <span>+ {holdReleased} €</span>
          </div>
        </div>
      </div>

      {/* Optional Email Delivery for QR Customer */}
      <div className="no-print" style={{
        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: '1rem',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textPrimary, marginBottom: '0.35rem' }}>
          ✉️ {isFr ? 'Recevoir ce reçu par email' : 'Receive this receipt by email'}
        </div>
        {emailSent ? (
          <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, padding: '0.4rem 0' }}>
            ✓ {isFr ? 'Reçu envoyé à votre adresse !' : 'Receipt sent to your email!'}
          </div>
        ) : (
          <form onSubmit={handleSendEmail} style={{ display: 'flex', gap: '8px', marginTop: '0.4rem' }}>
            <input
              type="email"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '0.6rem',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#D1D5DB'}`,
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F9FAFB',
                color: textPrimary,
                fontSize: '0.85rem',
              }}
            />
            <button
              type="submit"
              style={{
                background: isDark ? '#FFB800' : '#18042B',
                color: isDark ? '#120224' : '#FFFFFF',
                border: 'none',
                borderRadius: '0.6rem',
                padding: '0 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isFr ? 'Envoyer' : 'Send'}
            </button>
          </form>
        )}
      </div>

      {/* Action Buttons */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            background: 'transparent',
            color: textSecondary,
            border: 'none',
            padding: '0.6rem 1.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← {isFr ? 'Retour à l\'accueil IMỌLẸ' : 'Back to IMỌLẸ Home'}
        </button>
      </div>

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
