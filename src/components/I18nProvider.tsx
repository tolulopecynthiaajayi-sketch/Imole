"use client";

import React, { createContext, useContext, useState } from 'react';

type Lang = 'fr' | 'en';

export type TranslationKey =
  // Common & Header
  | 'welcome'
  | 'stationOnline'
  | 'cablesIncluded'
  | 'portableEnergyTag'
  
  // Kiosk Attract Screen
  | 'kioskTagline'
  | 'kioskSubtitle'
  | 'kioskTarifTitle'
  | 'kioskTarifMain'
  | 'kioskTarifSub'
  | 'kioskCompatTitle'
  | 'kioskCompatSub'
  | 'kioskScanPill'
  | 'kioskPaymentPill'
  | 'kioskInstruction'
  
  // Mobile Rental Landing Page
  | 'heroTitle'
  | 'kioskCardTitle'
  | 'kioskCardSubtitle'
  | 'pricingHeader'
  | 'pricing1stHour'
  | 'pricing1stHourLabel'
  | 'pricingSubsequent'
  | 'pricingSubsequentLabel'
  | 'pricingDayCap'
  | 'pricingDayCapLabel'
  | 'depositNoticeTitle'
  | 'depositNoticeText'
  | 'termsConsent'
  | 'unlockBtn'
  | 'unlocking'
  
  // Active Rental Screen
  | 'activeRentalTitle'
  | 'activeStatus'
  | 'liveTimerLabel'
  | 'chargingStatus'
  | 'currentCostLabel'
  | 'costExplain'
  | 'howToReturnTitle'
  | 'returnStep1'
  | 'returnStep2'
  | 'returnStep3'
  | 'testReturnBtn'
  
  // Receipt Screen
  | 'receiptTitle'
  | 'receiptSuccess'
  | 'receiptThanks'
  | 'finalChargedLabel'
  | 'holdReleasedBadge'
  | 'durationLabel'
  | 'paymentMethodLabel'
  | 'initialHoldLabel'
  | 'amountReleasedLabel'
  | 'backHomeBtn'
  
  // Trust Badges
  | 'trustSecurity'
  | 'trustBattery'
  | 'trustDeposit';

const translations: Record<Lang, Record<TranslationKey, string>> = {
  fr: {
    welcome: "BIENVENUE !",
    stationOnline: "Borne Active • Prête à l'emploi",
    cablesIncluded: "3 câbles intégrés : Lightning (iPhone) • USB-C • Micro-USB",
    portableEnergyTag: "Énergie Nomade & Écoresponsable",

    // Kiosk Screen
    kioskTagline: "Scannez | Payez | Chargez",
    kioskSubtitle: "Batterie faible ? Emportez une batterie universelle en 30 secondes.",
    kioskTarifTitle: "Tarif sans engagement",
    kioskTarifMain: "2,49 € (1ère heure incluse)",
    kioskTarifSub: "puis 1,99 € / h • Plafond 24h : 12,99 €",
    kioskCompatTitle: "Compatibilité Universelle",
    kioskCompatSub: "iPhone (Lightning) • USB-C • Micro-USB",
    kioskScanPill: "Scannez pour déverrouiller",
    kioskPaymentPill: "Apple Pay • Google Pay • Carte Bancaire",
    kioskInstruction: "Scannez avec l'appareil photo de votre smartphone",

    // Mobile Landing
    heroTitle: "Rechargez en toute liberté",
    kioskCardTitle: "Borne IMỌLẸ",
    kioskCardSubtitle: "Batteries disponibles",
    pricingHeader: "TARIFICATION TRANSPARENTE",
    pricing1stHour: "2,49 €",
    pricing1stHourLabel: "Déverrouillage + 1h",
    pricingSubsequent: "1,99 €",
    pricingSubsequentLabel: "Par heure suppl.",
    pricingDayCap: "12,99 €",
    pricingDayCapLabel: "Plafond 24h",
    depositNoticeTitle: "Empreinte bancaire de 24,99 €",
    depositNoticeText: "Garantie temporaire non débitée. Seul le temps réel consommé sera prélevé lors de la restitution.",
    termsConsent: "J'accepte les Conditions Générales d'Utilisation et l'empreinte temporaire.",
    unlockBtn: "Déverrouiller avec Apple Pay / CB",
    unlocking: "Connexion à la borne...",

    // Active Screen
    activeRentalTitle: "Location en cours",
    activeStatus: "Location Active",
    liveTimerLabel: "Temps écoulé",
    chargingStatus: "● Batterie en cours d'utilisation",
    currentCostLabel: "Coût estimé actuel :",
    costExplain: "1ère heure incluse • Plafond 24h bloqué à 12,99 €",
    howToReturnTitle: "Comment restituer votre batterie ?",
    returnStep1: "Présentez-vous devant n'importe quelle borne IMỌLẸ.",
    returnStep2: "Insérez la batterie dans n'importe quel slot libre jusqu'au clic.",
    returnStep3: "La caution est immédiatement débloquée sur votre carte.",
    testReturnBtn: "Tester la restitution de batterie (Simulation)",

    // Receipt Screen
    receiptTitle: "Reçu de Location",
    receiptSuccess: "Batterie restituée !",
    receiptThanks: "Merci d'avoir utilisé le réseau IMỌLẸ.",
    finalChargedLabel: "Montant final débité",
    holdReleasedBadge: "Caution restante libérée",
    durationLabel: "Durée de location :",
    paymentMethodLabel: "Moyen de paiement :",
    initialHoldLabel: "Empreinte initiale :",
    amountReleasedLabel: "Reste débloqué sur votre compte :",
    backHomeBtn: "Retour à l'accueil",

    // Trust
    trustSecurity: "Paiement Sécurisé SSL",
    trustBattery: "Batteries Certifiées CE",
    trustDeposit: "Caution Débloquée au Retour",
  },
  en: {
    welcome: "WELCOME!",
    stationOnline: "Station Active • Ready to Use",
    cablesIncluded: "3 built-in cables: Lightning (iPhone) • USB-C • Micro-USB",
    portableEnergyTag: "Portable & Sustainable Energy",

    // Kiosk Screen
    kioskTagline: "Scan | Pay | Charge",
    kioskSubtitle: "Low battery? Take a universal power bank in 30 seconds.",
    kioskTarifTitle: "No Commitment Pricing",
    kioskTarifMain: "€2.49 (1st hour included)",
    kioskTarifSub: "then €1.99 / hr • 24h Cap: €12.99",
    kioskCompatTitle: "Universal Compatibility",
    kioskCompatSub: "iPhone (Lightning) • USB-C • Micro-USB",
    kioskScanPill: "Scan to Unlock",
    kioskPaymentPill: "Apple Pay • Google Pay • Credit Card",
    kioskInstruction: "Scan with your smartphone camera",

    // Mobile Landing
    heroTitle: "Charge On The Go",
    kioskCardTitle: "IMỌLẸ Station",
    kioskCardSubtitle: "Batteries available",
    pricingHeader: "TRANSPARENT PRICING",
    pricing1stHour: "€2.49",
    pricing1stHourLabel: "Unlock + 1st hour",
    pricingSubsequent: "€1.99",
    pricingSubsequentLabel: "Per add. hour",
    pricingDayCap: "€12.99",
    pricingDayCapLabel: "24h Max Cap",
    depositNoticeTitle: "Temporary €24.99 hold",
    depositNoticeText: "A security hold placed on your card. You are only charged for actual rental time when you return.",
    termsConsent: "I accept the Terms of Service and temporary pre-authorization hold.",
    unlockBtn: "Unlock with Apple Pay / Card",
    unlocking: "Connecting to station...",

    // Active Screen
    activeRentalTitle: "Active Rental",
    activeStatus: "Active Rental",
    liveTimerLabel: "Elapsed Time",
    chargingStatus: "● Battery currently in use",
    currentCostLabel: "Current Estimated Cost:",
    costExplain: "1st hour included • 24h max cost capped at €12.99",
    howToReturnTitle: "How to return your power bank?",
    returnStep1: "Walk up to any IMỌLẸ station in the network.",
    returnStep2: "Push the battery into any empty slot until it clicks.",
    returnStep3: "Your deposit hold is immediately released back to your card.",
    testReturnBtn: "Simulate Return (Demo)",

    // Receipt Screen
    receiptTitle: "Rental Receipt",
    receiptSuccess: "Battery Returned!",
    receiptThanks: "Thank you for using IMỌLẸ Power Network.",
    finalChargedLabel: "Final Amount Charged",
    holdReleasedBadge: "Remaining Deposit Released",
    durationLabel: "Rental Duration:",
    paymentMethodLabel: "Payment Method:",
    initialHoldLabel: "Initial Hold:",
    amountReleasedLabel: "Released back to your account:",
    backHomeBtn: "Back to Home",

    // Trust
    trustSecurity: "SSL 256-bit Encrypted",
    trustBattery: "CE Certified Batteries",
    trustDeposit: "Hold Released on Return",
  }
};

type I18nContextType = {
  lang: Lang;
  setLanguage: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  const toggleLang = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'));
  };

  const setLanguage = (newLang: Lang) => {
    setLang(newLang);
  };

  const t = (key: TranslationKey) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLanguage, toggleLang, t }}>
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
