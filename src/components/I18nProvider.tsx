"use client";

import React, { createContext, useContext, useState } from 'react';

type Lang = 'fr' | 'en';

type Translations = {
  [key in Lang]: {
    scanToStart: string;
    lowBattery: string;
    pricingTerms: string;
    payNow: string;
    stationName: string;
    activeRental: string;
    howToReturn: string;
    returnInstructions: string;
    receipt: string;
    totalTime: string;
    finalCharge: string;
    amountReleased: string;
    termsWarning: string;
  }
};

const translations: Translations = {
  fr: {
    scanToStart: "Scannez ou tapez votre carte",
    lowBattery: "Batterie faible ?",
    pricingTerms: "2,49 € (Déverrouillage + 1h) • 1,99 € / h suppl. • Max 24,99 €",
    payNow: "Payer",
    stationName: "Station IMỌLẸ",
    activeRental: "Location en cours",
    howToReturn: "Comment retourner",
    returnInstructions: "Insérez la batterie dans n'importe quel emplacement vide de la station.",
    receipt: "Reçu",
    totalTime: "Temps total",
    finalCharge: "Montant final facturé",
    amountReleased: "Montant débloqué",
    termsWarning: "J'accepte les Conditions d'Utilisation et la Politique de Confidentialité.",
  },
  en: {
    scanToStart: "Scan or tap your card",
    lowBattery: "Low Battery?",
    pricingTerms: "€2.49 (Unlock + 1st hr) • €1.99 / add. hr • Max €24.99",
    payNow: "Pay Now",
    stationName: "IMỌLẸ Station",
    activeRental: "Active Rental",
    howToReturn: "How to Return",
    returnInstructions: "Insert the battery into any empty slot on the station.",
    receipt: "Receipt",
    totalTime: "Total Time",
    finalCharge: "Final Charge",
    amountReleased: "Amount Released",
    termsWarning: "I accept the Terms of Service and Privacy Policy.",
  }
};

type I18nContextType = {
  lang: Lang;
  t: (key: keyof Translations['fr']) => string;
  toggleLang: () => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  const toggleLang = () => {
    setLang(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key: keyof Translations['fr']) => {
    return translations[lang][key];
  };

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <button onClick={toggleLang} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', fontSize: '12px' }}>
          {lang === 'fr' ? 'EN' : 'FR'}
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
