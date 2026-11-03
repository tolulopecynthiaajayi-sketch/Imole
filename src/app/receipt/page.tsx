"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter } from 'next/navigation';

export default function ReceiptScreen() {
  const { t } = useI18n();
  const router = useRouter();

  // Hardcoded for demo purposes
  const totalTime = "00:45:12";
  const finalCharge = 2.49;
  const holdAmount = 24.99;
  const amountReleased = holdAmount - finalCharge;

  return (
    <main className="page-container" style={{ justifyContent: 'center' }}>
      <div className="logo-placeholder">IMỌLẸ Logo</div>
      
      <div className="card text-center mb-4">
        <h2 className="text-xl text-bold mb-4">{t('receipt')}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span className="text-muted">{t('totalTime')}</span>
          <span className="text-bold">{totalTime}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span className="text-muted">{t('finalCharge')}</span>
          <span className="text-bold text-brand">€{finalCharge.toFixed(2)}</span>
        </div>
        
        <hr style={{ borderTop: '1px solid #EBEBEB', margin: '1rem 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-muted">{t('amountReleased')}</span>
          <span className="text-bold text-green" style={{ color: '#28a745' }}>€{amountReleased.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn-primary" onClick={() => router.push('/')}>
        Done
      </button>
    </main>
  );
}
