"use client";

import React, { createContext, useContext, useState } from 'react';

type Lang = 'fr' | 'en';

type TranslationKeys = 
  | 'welcome'
  | 'nearestStation'
  | 'stationOnline'
  | 'cablesIncluded'
  | 'pricingHeader'
  | 'pricing1stHour'
  | 'pricingSubsequent'
  | 'pricingDayCap'
  | 'pricingDeposit'
  | 'depositNotice'
  | 'termsConsent'
  | 'rentNow'
  | 'activeRental'
  | 'liveTimer'
  | 'currentCharge'
  | 'howToReturnTitle'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'returnKioskBtn'
  | 'receiptTitle'
  | 'rentalCompleted'
  | 'totalDuration'
  | 'totalPaid'
  | 'holdReleased'
  | 'downloadReceipt';

const translations: Record<Lang, Record<TranslationKeys, string>> = {
  fr: {
    welcome: "BIENVENUE !",
    nearestStation: "Station IMỌLẸ sélectionnée",
    stationOnline: "Station en ligne • Batteries prêtes à l'emploi",
    cablesIncluded: "3 câbles intégrés : Lightning (iPhone) • USB-C • Micro-USB",
    pricingHeader: "TARIFICATION TRANSPARENTE",
    pricing1stHour: "2,49 €",
    pricingSubsequent: "1,99 € / h",
    pricingDayCap: "12,99 € / 24h",
    pricingDeposit: "24,99 €",
    depositNotice: "Empreinte bancaire de 24,99 € bloquée temporairement, ajustée automatiquement lors du retour.",
    termsConsent: "J'accepte les Conditions Générales d'Utilisation et la retenue temporaire.",
    rentNow: "Déverrouiller une batterie",
    activeRental: "Location en cours",
    liveTimer: "Temps écoulé",
    currentCharge: "Montant estimé",
    howToReturnTitle: "Comment restituer votre batterie ?",
    step1: "1. Repérez n'importe quelle borne IMỌLẸ en France",
    step2: "2. Glissez fermement la batterie dans un slot libre",
    step3: "3. Attendez le clic : votre caution est instantanément libérée",
    returnKioskBtn: "Trouver une borne de retour",
    receiptTitle: "Reçu de Location",
    rentalCompleted: "Batterie restituée avec succès !",
    totalDuration: "Durée totale",
    totalPaid: "Montant débité",
    holdReleased: "Reste de caution libéré",
    downloadReceipt: "Télécharger la facture PDF",
  },
  en: {
    welcome: "WELCOME!",
    nearestStation: "Selected IMỌLẸ Station",
    stationOnline: "Station Online • Batteries fully charged",
    cablesIncluded: "3 built-in cables: Lightning (iPhone) • USB-C • Micro-USB",
    pricingHeader: "TRANSPARENT PRICING",
    pricing1stHour: "€2.49",
    pricingSubsequent: "€1.99 / hr",
    pricingDayCap: "€12.99 / 24hrs",
    pricingDeposit: "€24.99",
    depositNotice: "A temporary €24.99 pre-authorization hold is placed on your card and automatically released upon return.",
    termsConsent: "I accept the Terms of Service and temporary pre-authorization hold.",
    rentNow: "Unlock a Power Bank",
    activeRental: "Active Rental",
    liveTimer: "Elapsed Time",
    currentCharge: "Current Charge",
    howToReturnTitle: "How to return your power bank?",
    step1: "1. Find any IMỌLẸ station in France",
    step2: "2. Push the battery into an empty slot",
    step3: "3. Wait for the click: your hold is instantly released",
    returnKioskBtn: "Find return station",
    receiptTitle: "Rental Receipt",
    rentalCompleted: "Battery successfully returned!",
    totalDuration: "Total Duration",
    totalPaid: "Amount Charged",
    holdReleased: "Remaining Hold Released",
    downloadReceipt: "Download PDF Invoice",
  }
};

type I18nContextType = {
  lang: Lang;
  t: (key: TranslationKeys) => string;
  toggleLang: () => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  const toggleLang = () => {
    setLang(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key: TranslationKeys) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
        <button 
          onClick={toggleLang} 
          style={{ 
            padding: '6px 12px', 
            borderRadius: '9999px', 
            border: '1px solid rgba(48, 14, 88, 0.15)', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            color: '#300E58',
            fontWeight: 700,
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>🌐</span>
          <span>{lang === 'fr' ? 'English' : 'Français'}</span>
        </button>
      </div>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
