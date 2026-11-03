import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

function getServiceAccount() {
  // 1. Direct environment variable (as JSON string)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch {
      // ignore
    }
  }

  // 2. Discrete environment variables (standard for Vercel)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  // 3. Local serviceAccountKey.json file fallback for local development
  const localKeyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    try {
      return JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
    } catch {
      // ignore
    }
  }

  return undefined;
}

if (!getApps().length) {
  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: 'imole-energy-pilot',
    });
  } else {
    // Default initialization (e.g. Google Cloud Run or App Engine environment)
    initializeApp({ projectId: 'imole-energy-pilot' });
  }
}

export const db = getFirestore();

