"use client";

import { useI18n } from '@/components/I18nProvider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) {
      alert("Please accept the Terms of Service.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url; // Redirect to actual Stripe Checkout
      } else {
        // Fallback for demo if Stripe API key is not configured yet
        console.warn("Stripe API failed (likely missing secret key). Falling back to demo mode.");
        router.push('/active');
      }
    } catch (err) {
      console.error(err);
      // Fallback for demo
      router.push('/active');
    }
  };

  return (
    <main className="page-container" style={{ justifyContent: 'center' }}>
      <div className="logo-placeholder">IMỌLẸ Logo</div>
      
      <div className="card text-center mb-4">
        <h1 className="text-2xl text-bold mb-2">{t('stationName')}</h1>
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
        {isLoading ? 'Loading...' : t('payNow')}
      </button>
    </main>
  );
}
