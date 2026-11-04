export interface StationLocation {
  id: string; // e.g. "H00000147A" (QR Code / public ID)
  deviceSn: string; // e.g. "F0F5BD76AFC8" (Vendor hardware serial number)
  name: string;
  nameEn: string;
  city: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  totalSlots: number;
  availableBatteries: number;
  emptySlots: number;
  openingHours: string;
  openingHoursEn: string;
  simIccid: string;
  isOnline: boolean;
  statusText: string;
  statusTextEn: string;
  directionsUrl: string;
}

export const LILLE_STATIONS: StationLocation[] = [
  {
    id: "H00000147A",
    deviceSn: "F0F5BD76AFC8",
    name: "IMỌLẸ - Grand Place Lille",
    nameEn: "IMỌLẸ - Lille Grand Place",
    city: "Lille",
    address: "Place du Général-de-Gaulle, 59000 Lille",
    postalCode: "59000",
    lat: 50.6369,
    lng: 3.0634,
    totalSlots: 8,
    availableBatteries: 6,
    emptySlots: 2,
    openingHours: "7j/7 • 08h00 - 02h00",
    openingHoursEn: "7 days/week • 08:00 AM - 02:00 AM",
    simIccid: "89852240400040464919",
    isOnline: true,
    statusText: "En service • Borne Principale",
    statusTextEn: "Active • Main Kiosk",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Place+du+General+de+Gaulle+59000+Lille",
  },
  {
    id: "H00000146A",
    deviceSn: "F0F5BD74CE4C",
    name: "IMỌLẸ - Gare Lille Flandres",
    nameEn: "IMỌLẸ - Lille Flandres Station",
    city: "Lille",
    address: "Place des Buisses, 59000 Lille",
    postalCode: "59000",
    lat: 50.6363,
    lng: 3.0707,
    totalSlots: 8,
    availableBatteries: 5,
    emptySlots: 3,
    openingHours: "7j/7 • 24h/24",
    openingHoursEn: "7 days/week • 24/7",
    simIccid: "89852240400040464893",
    isOnline: true,
    statusText: "En service • Proche Métro & Gare",
    statusTextEn: "Active • Near Metro & Station",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Place+des+Buisses+59000+Lille",
  },
  {
    id: "H00000148A",
    deviceSn: "SOON-LILLE-03",
    name: "IMỌLẸ - Vieux-Lille",
    nameEn: "IMỌLẸ - Old Town Lille",
    city: "Lille",
    address: "Rue de la Monnaie, 59800 Lille",
    postalCode: "59800",
    lat: 50.6405,
    lng: 3.0628,
    totalSlots: 8,
    availableBatteries: 0,
    emptySlots: 8,
    openingHours: "7j/7 • 10h00 - 00h00",
    openingHoursEn: "7 days/week • 10:00 AM - 12:00 AM",
    simIccid: "PENDING",
    isOnline: false,
    statusText: "Bientôt disponible • Déploiement en cours",
    statusTextEn: "Coming Soon • Deployment in progress",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rue+de+la+Monnaie+59800+Lille",
  },
];

export function findStationByQrOrSn(identifier: string): StationLocation | undefined {
  const clean = identifier.trim().toUpperCase();
  return LILLE_STATIONS.find(
    s => s.id.toUpperCase() === clean || s.deviceSn.toUpperCase() === clean
  );
}

