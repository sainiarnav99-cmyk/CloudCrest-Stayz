import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GuestChroniclesSection } from './components/GuestChroniclesSection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MemberPortalDrawer } from './components/MemberPortalDrawer';
import { MussoorieAtlasSection } from './components/MussoorieAtlasSection';
import { SanctuariesSection } from './components/SanctuariesSection';
import { StayDetailModal } from './components/StayDetailModal';
import {
  EDITORIAL_CHRONICLES,
  MUSSOORIE_SANCTUARIES,
  type MussoorieSanctuary,
  type SanctuaryWing,
} from './data/mussoorieStays';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogle,
  syncMemberProfile,
  toggleFavoriteStay,
  type FavoriteStayRecord,
  type StayBookingRecord,
  type StayReviewRecord,
} from './lib/firebase';

function getTomorrowIso(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

function CloudCrestApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  // Availability & filter state
  const [checkInDate, setCheckInDate] = useState<string>(getTomorrowIso);
  const [nights, setNights] = useState<number>(3);
  const [guests, setGuests] = useState<number>(2);
  const [selectedWing, setSelectedWing] = useState<'All' | SanctuaryWing>('All');
  const [activeGuestFilter, setActiveGuestFilter] = useState<number>(1);

  // Modals / Drawers / Toast
  const [activeSanctuary, setActiveSanctuary] = useState<MussoorieSanctuary | null>(null);
  const [portalOpen, setPortalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Live Firestore collections (attached strictly after authReady && user)
  const [bookings, setBookings] = useState<StayBookingRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteStayRecord[]>([]);
  const [liveReviews, setLiveReviews] = useState<StayReviewRecord[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(''), 4200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
      if (firebaseUser) {
        void syncMemberProfile(firebaseUser).catch((err) => {
          console.error('Member profile sync warning:', err);
        });
      } else {
        setBookings([]);
        setFavorites([]);
        setLiveReviews([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    const bookingsPath = 'bookings';
    const bookingsQuery = query(collection(db, bookingsPath), where('userId', '==', user.uid));
    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const list: StayBookingRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: String(data.userId || ''),
            stayId: String(data.stayId || ''),
            stayName: String(data.stayName || ''),
            stayLocation: String(data.stayLocation || ''),
            checkInDate: String(data.checkInDate || ''),
            nights: Number(data.nights || 1),
            guests: Number(data.guests || 1),
            totalAmount: Number(data.totalAmount || 0),
            status: data.status === 'cancelled' ? 'cancelled' : 'confirmed',
            createdAt: data.createdAt || null,
            updatedAt: data.updatedAt || null,
          };
        });
        list.sort((a, b) => {
          const aSec = a.createdAt?.seconds ?? 0;
          const bSec = b.createdAt?.seconds ?? 0;
          return bSec - aSec;
        });
        setBookings(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, bookingsPath);
      }
    );

    const favPath = `users/${user.uid}/favorites`;
    const unsubFavorites = onSnapshot(
      collection(db, 'users', user.uid, 'favorites'),
      (snapshot) => {
        const list: FavoriteStayRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: String(data.userId || ''),
            stayId: String(data.stayId || ''),
            stayName: String(data.stayName || ''),
          };
        });
        setFavorites(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, favPath);
      }
    );

    const reviewsPath = 'stayReviews';
    const reviewsQuery = query(collection(db, reviewsPath), where('isPublished', '==', true));
    const unsubReviews = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const list: StayReviewRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            stayId: String(data.stayId || ''),
            authorUid: String(data.authorUid || ''),
            guestName: String(data.guestName || ''),
            guestInitials: String(data.guestInitials || 'CG'),
            guestRole: String(data.guestRole || ''),
            guestCity: String(data.guestCity || ''),
            stayDate: String(data.stayDate || ''),
            nightsStayed: Number(data.nightsStayed || 1),
            rating: Number(data.rating || 5),
            highlight: String(data.highlight || ''),
            quote: String(data.quote || ''),
            isPublished: Boolean(data.isPublished),
          };
        });
        setLiveReviews(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, reviewsPath);
      }
    );

    return () => {
      unsubBookings();
      unsubFavorites();
      unsubReviews();
    };
  }, [authReady, user]);

  const handleGoogleSignIn = async (): Promise<User | null> => {
    setAuthBusy(true);
    try {
      const signedIn = await signInWithGoogle();
      showToast(`Signed in with Google as ${signedIn.displayName || signedIn.email}.`);
      return signedIn;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Google Sign-In could not be completed.';
      if (!message.includes('popup-closed-by-user')) {
        showToast(message);
      }
      return null;
    } finally {
      setAuthBusy(false);
    }
  };

  const favoriteIds = new Set(favorites.map((f) => f.stayId));

  const handleToggleFavorite = async (stay: MussoorieSanctuary) => {
    let activeUser = user;
    if (!activeUser) {
      activeUser = await handleGoogleSignIn();
      if (!activeUser) return;
    }
    const currentlyFav = favoriteIds.has(stay.id);
    await toggleFavoriteStay(activeUser.uid, stay.id, stay.name, currentlyFav);
    showToast(
      currentlyFav
        ? `${stay.name} removed from saved sanctuaries.`
        : `${stay.name} saved to your Member Portal.`
    );
  };

  const handleSearchAvailability = () => {
    setActiveGuestFilter(guests);
    const el = document.getElementById('sanctuaries');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const combinedReviews: StayReviewRecord[] = [...liveReviews, ...EDITORIAL_CHRONICLES];
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-[#04060A] text-[#F3F6FB] flex flex-col">
      <Header
        user={user}
        bookingsCount={confirmedCount}
        authBusy={authBusy}
        onSignIn={() => void handleGoogleSignIn()}
        onOpenPortal={() => setPortalOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          user={user}
          authBusy={authBusy}
          checkInDate={checkInDate}
          nights={nights}
          guests={guests}
          onChangeCheckInDate={setCheckInDate}
          onChangeNights={setNights}
          onChangeGuests={setGuests}
          onSearchAvailability={handleSearchAvailability}
          onSignIn={() => void handleGoogleSignIn()}
          onOpenPortal={() => setPortalOpen(true)}
        />

        <SanctuariesSection
          sanctuaries={MUSSOORIE_SANCTUARIES}
          selectedWing={selectedWing}
          minGuests={activeGuestFilter}
          favoriteIds={favoriteIds}
          onSelectWing={setSelectedWing}
          onResetGuests={() => setActiveGuestFilter(1)}
          onOpenSanctuary={(stay) => setActiveSanctuary(stay)}
          onToggleFavorite={(stay) => void handleToggleFavorite(stay)}
        />

        <MussoorieAtlasSection />

        <GuestChroniclesSection
          user={user}
          reviews={combinedReviews}
          onRequireSignIn={() => void handleGoogleSignIn()}
          onNotify={showToast}
        />
      </main>

      {/* Quiet Editorial Black & Blue Footer */}
      <footer className="border-t border-[#3B82F6]/20 bg-[#04060A] text-[#F3F6FB] py-14">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5 space-y-2.5">
              <p className="font-display text-2xl font-semibold text-[#F3F6FB]">CloudCrest Stayz</p>
              <p className="text-xs leading-relaxed text-[#F3F6FB]/68 max-w-sm">
                Landour Cantt & Camel’s Back Ridge, Mussoorie, Uttarakhand 248179, India.
              </p>
              <p className="font-mono text-[11px] tabular-nums text-[#60A5FA]">
                30.4598° N · 78.0844° E · 2,180 m
              </p>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs text-[#F3F6FB]/72">
              <p className="font-semibold text-[#F3F6FB]">Explore Mussoorie</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a href="#sanctuaries" className="hover:text-[#60A5FA] transition-colors">
                  Sanctuaries
                </a>
                <a href="#mussoorie" className="hover:text-[#60A5FA] transition-colors">
                  Ridge Atlas
                </a>
                <a href="#experiences" className="hover:text-[#60A5FA] transition-colors">
                  Experiences
                </a>
                <a href="#chronicles" className="hover:text-[#60A5FA] transition-colors">
                  Guest Chronicles
                </a>
              </div>
            </div>

            <div className="md:col-span-3 md:text-right space-y-2 text-xs text-[#F3F6FB]/65">
              <p className="font-semibold text-[#F3F6FB]">Direct Concierge</p>
              <button
                type="button"
                onClick={() => setPortalOpen(true)}
                className="text-[#60A5FA] hover:underline cursor-pointer"
              >
                Open Member Reservations
              </button>
              <p className="pt-2 text-[11px] text-[#F3F6FB]/48">
                © {new Date().getFullYear()} CloudCrest Stayz Mussoorie
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Sanctuary Modal */}
      {activeSanctuary && (
        <StayDetailModal
          stay={activeSanctuary}
          user={user}
          isFavorite={favoriteIds.has(activeSanctuary.id)}
          defaultCheckInDate={checkInDate}
          defaultNights={nights}
          defaultGuests={guests}
          stayReviews={combinedReviews.filter((r) => r.stayId === activeSanctuary.id)}
          onClose={() => setActiveSanctuary(null)}
          onRequireSignIn={handleGoogleSignIn}
          onToggleFavorite={(stay) => void handleToggleFavorite(stay)}
          onBookingConfirmed={(stayName) => {
            setActiveSanctuary(null);
            setPortalOpen(true);
            showToast(`Reservation confirmed for ${stayName}.`);
          }}
        />
      )}

      {/* Member Concierge Slide-Over Drawer */}
      <MemberPortalDrawer
        open={portalOpen}
        user={user}
        bookings={bookings}
        favorites={favorites}
        onClose={() => setPortalOpen(false)}
        onSignIn={handleGoogleSignIn}
        onOpenSanctuary={(stay) => setActiveSanctuary(stay)}
        onNotify={showToast}
      />

      {/* Non-intrusive Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-md border border-[#3B82F6]/45 bg-[#0A0F1A] px-4 py-3 text-xs font-medium text-[#F3F6FB] shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CloudCrestApp />
    </ErrorBoundary>
  );
}
