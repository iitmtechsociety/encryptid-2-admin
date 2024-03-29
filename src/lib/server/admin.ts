import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FB_CLIENT_EMAIL, FB_PRIVATE_KEY, FB_PROJECT_ID } from '$env/static/private'
import pkg from 'firebase-admin';
import { getStorage , } from 'firebase-admin/storage';

try {
  pkg.initializeApp({
    storageBucket: "encryptid-2-c0c54.appspot.com",
    credential: pkg.credential.cert({
      projectId: FB_PROJECT_ID,
      clientEmail: FB_CLIENT_EMAIL,
      privateKey: FB_PRIVATE_KEY,
    }),
  });
} catch (err) {
  if (!/already exists/u.test(err.message)) {
    console.error('Firebase Admin Error: ', err.stack)
  }
}


export const adminDB = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();

export const isCookieValid = async (cookie) => {
    try {
        const user = await adminAuth.verifySessionCookie(cookie, true);
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}