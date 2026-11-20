import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot as required by Firestore integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: client is offline.');
    }
  }
}
void testConnection();

// Blueprint-synchronized validation helpers
const ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STAY_IDS = new Set([
  'landour-cedar-pavilion',
  'benog-mist-pool-villa',
  'lal-tibba-observatory-penthouse',
  'camels-back-ridge-suite',
  'hathipaon-pine-glasshouse',
  'barlowganj-heritage-manor',
]);

function sanitizeBoundedText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export async function syncMemberProfile(user: User): Promise<void> {
  if (!user.email || !user.emailVerified) {
    throw new Error('A verified Google email account is required for CloudCrest Stayz membership.');
  }
  if (!ID_REGEX.test(user.uid)) {
    throw new Error('Invalid member identifier.');
  }

  const userRef = doc(db, 'users', user.uid);
  const displayName = sanitizeBoundedText(user.displayName || user.email.split('@')[0] || 'CloudCrest Guest', 100);
  const email = sanitizeBoundedText(user.email, 254);
  const photoURL = user.photoURL ? sanitizeBoundedText(user.photoURL, 500) : undefined;

  try {
    const existingSnap = await getDocFromServer(userRef);
    if (existingSnap.exists()) {
      const updatePayload: Record<string, unknown> = {
        displayName,
        email,
        updatedAt: serverTimestamp(),
      };
      if (photoURL) {
        updatePayload.photoURL = photoURL;
      }
      await updateDoc(userRef, updatePayload);
    } else {
      const createPayload: Record<string, unknown> = {
        uid: user.uid,
        displayName,
        email,
        role: 'member',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (photoURL) {
        createPayload.photoURL = photoURL;
      }
      await setDoc(userRef, createPayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    await syncMemberProfile(credential.user);
    return credential.user;
  } catch (error: unknown) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : '';
    if (code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups to sign in with Google.');
    }
    if (code === 'auth/unauthorized-domain') {
      throw new Error('This preview domain is not yet authorized in Firebase Authentication.');
    }
    throw error;
  }
}

export async function signOutMember(): Promise<void> {
  await signOut(auth);
}

export async function toggleFavoriteStay(
  userId: string,
  stayId: string,
  stayName: string,
  isCurrentlyFavorite: boolean
): Promise<void> {
  if (!ID_REGEX.test(userId) || !VALID_STAY_IDS.has(stayId)) {
    throw new Error('Invalid identifier for saved sanctuary.');
  }
  const path = `users/${userId}/favorites/${stayId}`;
  const favRef = doc(db, 'users', userId, 'favorites', stayId);
  try {
    if (isCurrentlyFavorite) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        userId,
        stayId: sanitizeBoundedText(stayId, 64),
        stayName: sanitizeBoundedText(stayName, 140),
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      isCurrentlyFavorite ? OperationType.DELETE : OperationType.CREATE,
      path
    );
  }
}

export interface CreateBookingInput {
  userId: string;
  stayId: string;
  stayName: string;
  stayLocation: string;
  checkInDate: string;
  nights: number;
  guests: number;
  totalAmount: number;
}

export async function createStayBooking(input: CreateBookingInput): Promise<string> {
  if (!ID_REGEX.test(input.userId) || !VALID_STAY_IDS.has(input.stayId)) {
    throw new Error('Invalid booking identifier.');
  }
  const nights = Math.min(14, Math.max(1, Math.round(input.nights)));
  const guests = Math.min(8, Math.max(1, Math.round(input.guests)));
  const totalAmount = Math.min(100000, Math.max(1500, Math.round(input.totalAmount)));
  const checkInDate = sanitizeBoundedText(input.checkInDate, 20);

  if (!DATE_REGEX.test(checkInDate)) {
    throw new Error('Please choose a valid check-in date (YYYY-MM-DD).');
  }

  const bookingsCol = collection(db, 'bookings');
  try {
    const docRef = await addDoc(bookingsCol, {
      userId: input.userId,
      stayId: sanitizeBoundedText(input.stayId, 64),
      stayName: sanitizeBoundedText(input.stayName, 140),
      stayLocation: sanitizeBoundedText(input.stayLocation, 140),
      checkInDate,
      nights,
      guests,
      totalAmount,
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bookings');
  }
}

export async function cancelStayBooking(bookingId: string): Promise<void> {
  if (!ID_REGEX.test(bookingId)) {
    throw new Error('Invalid reservation ID.');
  }
  const bookingRef = doc(db, 'bookings', bookingId);
  try {
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
  }
}

export interface CreateReviewInput {
  stayId: string;
  authorUid: string;
  guestName: string;
  guestRole: string;
  guestCity: string;
  stayDate: string;
  nightsStayed: number;
  rating: number;
  highlight: string;
  quote: string;
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CG';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export async function createStayReview(input: CreateReviewInput): Promise<string> {
  if (!ID_REGEX.test(input.authorUid) || !ID_REGEX.test(input.stayId)) {
    throw new Error('Invalid review metadata.');
  }
  const guestName = sanitizeBoundedText(input.guestName, 80);
  const guestRole = sanitizeBoundedText(input.guestRole, 80);
  const guestCity = sanitizeBoundedText(input.guestCity, 80);
  const stayDate = sanitizeBoundedText(input.stayDate, 40);
  const highlight = sanitizeBoundedText(input.highlight, 120);
  const quote = sanitizeBoundedText(input.quote, 1000);
  const nightsStayed = Math.min(30, Math.max(1, Math.round(input.nightsStayed)));
  const rating = Math.min(5, Math.max(1, Number(input.rating)));

  if (guestName.length < 2 || highlight.length < 3 || quote.length < 12) {
    throw new Error('Please complete your review headline and reflection (at least 12 characters).');
  }

  const reviewsCol = collection(db, 'stayReviews');
  try {
    const ref = await addDoc(reviewsCol, {
      stayId: sanitizeBoundedText(input.stayId, 64),
      authorUid: input.authorUid,
      guestName,
      guestInitials: buildInitials(guestName),
      guestRole: guestRole.length >= 2 ? guestRole : 'CloudCrest Guest',
      guestCity: guestCity.length >= 2 ? guestCity : 'New Delhi',
      stayDate: stayDate.length >= 4 ? stayDate : 'November 2026',
      nightsStayed,
      rating,
      highlight,
      quote,
      isPublished: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'stayReviews');
  }
}

export async function updateStayReview(
  reviewId: string,
  updates: { rating: number; highlight: string; quote: string }
): Promise<void> {
  if (!ID_REGEX.test(reviewId)) {
    throw new Error('Invalid review ID.');
  }
  const highlight = sanitizeBoundedText(updates.highlight, 120);
  const quote = sanitizeBoundedText(updates.quote, 1000);
  const rating = Math.min(5, Math.max(1, Number(updates.rating)));
  if (highlight.length < 3 || quote.length < 12) {
    throw new Error('Highlight (min 3 chars) and reflection (min 12 chars) are required.');
  }
  const reviewRef = doc(db, 'stayReviews', reviewId);
  try {
    await updateDoc(reviewRef, {
      rating,
      highlight,
      quote,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stayReviews/${reviewId}`);
  }
}

export async function deleteStayReview(reviewId: string): Promise<void> {
  if (!ID_REGEX.test(reviewId)) {
    throw new Error('Invalid review ID.');
  }
  const reviewRef = doc(db, 'stayReviews', reviewId);
  try {
    await deleteDoc(reviewRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `stayReviews/${reviewId}`);
  }
}

export interface StayBookingRecord {
  id: string;
  userId: string;
  stayId: string;
  stayName: string;
  stayLocation: string;
  checkInDate: string;
  nights: number;
  guests: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface FavoriteStayRecord {
  id: string;
  userId: string;
  stayId: string;
  stayName: string;
}

export interface StayReviewRecord {
  id: string;
  stayId: string;
  authorUid: string;
  guestName: string;
  guestInitials: string;
  guestRole: string;
  guestCity: string;
  stayDate: string;
  nightsStayed: number;
  rating: number;
  highlight: string;
  quote: string;
  isPublished: boolean;
  isEditorial?: boolean;
}
