"use client";

import { useI18n } from '@/components/I18nProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActiveRentalDashboard() {
  const { t } = useI18n();
  const router = useRouter();
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    // In a real app, you'd fetch the transaction start time from the backend
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateCost = (ms: number) => {
    const hours = Math.ceil(ms / (1000 * 60 * 60));
    
    if (hours <= 1) return 2.49;
    
    const extraHours = hours - 1;
    const totalCharge = 2.49 + (extraHours * 1.99);

    if (hours <= 24) {
      return Math.min(totalCharge, 12.99);
    } else {
      const day2Hours = hours - 24;
      const day2Charge = day2Hours * 1.99;
      return Math.min(12.99 + day2Charge, 24.99);
    }
  };

  // Temporary function to simulate a return for demonstration
  const simulateReturn = () => {
    router.push('/receipt');
  };

  return (
    <main className="page-container" style={{ justifyContent: 'center' }}>
      <div className="logo-placeholder">IMỌLẸ Logo</div>
      
      <div className="card text-center mb-4">
        <h2 className="text-xl text-bold mb-2 text-brand">{t('activeRental')}</h2>
        
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '2rem 0', fontFamily: 'monospace' }}>
          {formatTime(elapsedMs)}
        </div>
        
        <div className="text-lg text-muted mb-4">
          Cost Accumulator: €{calculateCost(elapsedMs).toFixed(2)}
        </div>
      </div>

      <div className="card mb-4" style={{ backgroundColor: 'var(--surface-color)', border: 'none' }}>
        <h3 className="text-lg text-bold mb-2">{t('howToReturn')}</h3>
        <p className="text-muted">{t('returnInstructions')}</p>
      </div>

      <button className="btn-primary" onClick={simulateReturn} style={{ backgroundColor: '#28a745' }}>
        Simulate Return (Demo)
      </button>
    </main>
  );
}
