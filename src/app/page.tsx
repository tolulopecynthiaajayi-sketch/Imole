"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LandingPageContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kioskId = searchParams.get('kiosk') || 'H00000147A';
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) {
      alert("Veuillez accepter les Conditions d'Utilisation.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kiosk_id: kioskId }),
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        // Fallback demo mode if Stripe keys are not yet configured
        console.warn("Stripe API failed or keys pending. Redirecting to active demo dashboard.");
        router.push(`/active?kiosk=${kioskId}`);
      }
    } catch (err) {
      console.error(err);
      router.push(`/active?kiosk=${kioskId}`);
    }
  };

  return (
    <main className="page-container" style={{ justifyContent: 'center' }}>
      <div className="logo-placeholder">IMỌLẸ Logo</div>
      
      <div className="card text-center mb-4">
        <h1 className="text-2xl text-bold mb-1">{t('stationName')}</h1>
        <p className="text-sm text-muted mb-2">Station #{kioskId}</p>
        <p className="text-lg text-brand font-bold mb-2">{t('pricingTerms')}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '10px' }}>
        <input 
          type="checkbox" 
          id="terms" 
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
        <label htmlFor="terms" className="text-sm text-muted" style={{ cursor: 'pointer' }}>
          {t('termsWarning')}
        </label>
      </div>

      <button className="btn-primary" onClick={handlePay} disabled={isLoading}>
        {isLoading ? 'Chargement...' : t('payNow')}
      </button>
    </main>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ justifyContent: 'center' }}>Chargement...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
