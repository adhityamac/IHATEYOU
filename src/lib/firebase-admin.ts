/**
 * Firebase Admin SDK — Server-Side Only
 * 
 * Used exclusively in API routes and middleware for:
 * - Verifying Firebase ID tokens (session management)
 * - Server-side user management
 * - Admin-level Firestore access
 * 
 * NEVER import this in client components.
 */

import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount: ServiceAccount | null =
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
        process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? {
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
        : null;

function initAdmin() {
    if (getApps().length > 0) return;

    if (!serviceAccount) {
        console.warn('⚠️ Firebase Admin credentials missing — server auth disabled');
        return;
    }

    initializeApp({ credential: cert(serviceAccount) });
}

initAdmin();

/** Firebase Admin Auth — for verifying ID tokens */
export const adminAuth = serviceAccount ? getAuth() : null;

/** Firebase Admin Firestore — for server-side DB access */
export const adminDb = serviceAccount ? getFirestore() : null;
