"use client";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CompanyHome from '@/components/CompanyHome';
import RentalCheckout from '@/components/RentalCheckout';

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const kioskParam = searchParams.get('station') || searchParams.get('kiosk');
  const modeParam = searchParams.get('mode');

  // If URL explicitly contains a kiosk ID (scanned from physical QR) or mode=rent, open rental checkout directly
  const [isRentalMode, setIsRentalMode] = useState(Boolean(kioskParam || modeParam === 'rent'));

  const handleStartRental = () => {
    setIsRentalMode(true);
    // Smooth scroll to top when switching
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCompany = () => {
    setIsRentalMode(false);
    // Remove query params cleanly without full page refresh
    router.replace('/');
  };

  if (isRentalMode) {
    return (
      <RentalCheckout
        kioskId={kioskParam || 'H00000147A'}
        onBackToHome={handleBackToCompany}
      />
    );
  }

  return <CompanyHome onStartRental={handleStartRental} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#120224',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        Chargement...
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
