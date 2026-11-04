export interface ActiveRentalSession {
  rentalId: string;
  batteryId: string;
  startTime: number; // Unix timestamp ms
  kioskId: string;
  status: 'ACTIVE' | 'COMPLETED';
  preAuthAmount?: number;
}

const RENTAL_STORAGE_KEY = 'imole_active_rental';
const LAST_RECEIPT_KEY = 'imole_last_receipt';

export function getStoredRental(): ActiveRentalSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RENTAL_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ActiveRentalSession;
    if (data && data.status === 'ACTIVE') {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredRental(session: ActiveRentalSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RENTAL_STORAGE_KEY, JSON.stringify(session));
    // Set 30-day cookie for server-side recognition & PWA support
    document.cookie = `imole_rental_id=${session.rentalId}; path=/; max-age=2592000; SameSite=Lax`;
  } catch (e) {
    console.error('Error saving rental session:', e);
  }
}

export function completeStoredRental(receiptData?: { durationMinutes: number; cost: string; kioskId?: string }): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredRental();
    if (current) {
      current.status = 'COMPLETED';
    }
    localStorage.removeItem(RENTAL_STORAGE_KEY);
    if (receiptData) {
      localStorage.setItem(LAST_RECEIPT_KEY, JSON.stringify({
        ...receiptData,
        completedAt: Date.now(),
      }));
    }
    // Expire session cookie
    document.cookie = `imole_rental_id=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {
    console.error('Error completing rental session:', e);
  }
}

export function getLastReceipt(): { durationMinutes: number; cost: string; kioskId?: string; completedAt: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_RECEIPT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

