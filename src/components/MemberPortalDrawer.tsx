import React, { useState } from 'react';
import { Bookmark, Calendar, LogOut, ShieldCheck, Trash2, X } from 'lucide-react';
import type { User } from 'firebase/auth';
import { MUSSOORIE_SANCTUARIES, type MussoorieSanctuary } from '../data/mussoorieStays';
import {
  cancelStayBooking,
  signOutMember,
  toggleFavoriteStay,
  type FavoriteStayRecord,
  type StayBookingRecord,
} from '../lib/firebase';
import { GoogleMark } from './GoogleMark';

interface MemberPortalDrawerProps {
  open: boolean;
  user: User | null;
  bookings: StayBookingRecord[];
  favorites: FavoriteStayRecord[];
  onClose: () => void;
  onSignIn: () => Promise<User | null>;
  onOpenSanctuary: (stay: MussoorieSanctuary) => void;
  onNotify: (msg: string) => void;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const MemberPortalDrawer: React.FC<MemberPortalDrawerProps> = ({
  open,
  user,
  bookings,
  favorites,
  onClose,
  onSignIn,
  onOpenSanctuary,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  if (!open) return null;

  const stayMap = new Map(MUSSOORIE_SANCTUARIES.map((s) => [s.id, s]));

  const handleSignInClick = async () => {
    setAuthLoading(true);
    try {
      const signedInUser = await onSignIn();
      if (signedInUser) {
        onNotify(`Welcome to CloudCrest Stayz, ${signedInUser.displayName || 'Guest'}.`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setBusyId(bookingId);
    try {
      await cancelStayBooking(bookingId);
      onNotify('Reservation cancelled.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemoveFavorite = async (fav: FavoriteStayRecord) => {
    if (!user) return;
    setBusyId(fav.stayId);
    try {
      await toggleFavoriteStay(user.uid, fav.stayId, fav.stayName, true);
      onNotify(`${fav.stayName} removed from saved sanctuaries.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CloudCrest Stayz Member Concierge"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-[#04060A]/82 backdrop-blur-sm"
    >
      <div className="flex h-full w-full max-w-md flex-col border-l border-[#3B82F6]/25 bg-[#04060A] text-[#F3F6FB]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3B82F6]/18 px-6 py-5">
          <div>
            <p className="text-xs font-medium text-[#60A5FA]">CloudCrest Concierge</p>
            <h2 className="font-display text-2xl font-semibold text-[#F8FAFC]">
              {user ? 'Member Portal' : 'Guest Access'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close portal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3B82F6]/30 text-[#F8FAFC] hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!user ? (
            <div className="rounded-lg border border-[#3B82F6]/25 bg-[#090F1C] p-6 space-y-5">
              <h3 className="font-display text-2xl font-semibold text-[#F8FAFC]">
                Sign in with Google for Instant Reservations
              </h3>
              <p className="text-sm leading-relaxed text-[#CBD5E1]">
                Authenticate with your verified Google account to confirm Mussoorie sanctuary
                bookings, save favorite suites, and publish verified guest chronicles.
              </p>
              <button
                type="button"
                disabled={authLoading}
                onClick={handleSignInClick}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-md bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors cursor-pointer"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                  <GoogleMark className="h-3.5 w-3.5" />
                </span>
                <span>{authLoading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
              </button>

              <div className="border-t border-[#3B82F6]/15 pt-4 flex items-start gap-2.5 text-xs text-[#94A3B8]">
                <ShieldCheck className="h-4 w-4 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Protected by Firebase Authentication and owner-isolated Firestore security rules.
                  Only your verified Google account can read or manage your reservations.
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Member Identity & Security Strip */}
              <div className="rounded-lg border border-[#3B82F6]/22 bg-[#090F1C] p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.photoURL && !avatarFailed ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Member'}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarFailed(true)}
                        className="h-10 w-10 rounded-full object-cover border border-[#60A5FA]/40 shrink-0"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#60A5FA]/40 bg-[#1E3A8A]/60 text-xs font-bold text-[#DBEAFE] shrink-0">
                        {(user.displayName || 'CG').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#F8FAFC]">
                        {user.displayName || 'CloudCrest Member'}
                      </p>
                      <p className="truncate text-xs text-[#94A3B8]">{user.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await signOutMember();
                      onNotify('Signed out safely.');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#3B82F6]/25 px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#F8FAFC] shrink-0 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 border-t border-[#3B82F6]/15 pt-2.5 text-[11px] text-[#60A5FA]">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Verified Google Session · Owner-Protected Firestore Data</span>
                </div>
              </div>

              {/* Segmented Tabs */}
              <div className="grid grid-cols-2 gap-1 rounded-md border border-[#3B82F6]/22 bg-[#090F1C] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#F3F6FB]/75 hover:text-[#F3F6FB]'
                  }`}
                >
                  Reservations ({bookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('favorites')}
                  className={`py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    activeTab === 'favorites'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#F3F6FB]/75 hover:text-[#F3F6FB]'
                  }`}
                >
                  Saved ({favorites.length})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'bookings' ? (
                bookings.length === 0 ? (
                  <div className="rounded-lg border border-[#F3F6FB]/12 bg-[#0A0F1A]/70 p-6 text-center space-y-2">
                    <Calendar className="mx-auto h-6 w-6 text-[#60A5FA]" />
                    <p className="text-sm font-medium text-[#F3F6FB]">No reservations yet</p>
                    <p className="text-xs text-[#F3F6FB]/65">
                      Select any Mussoorie sanctuary to place an instant booking.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-lg border border-[#F3F6FB]/14 bg-[#0A0F1A] p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-xl font-semibold text-[#F3F6FB]">
                              {b.stayName}
                            </h3>
                            <p className="text-xs text-[#F3F6FB]/65">{b.stayLocation}</p>
                          </div>
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider ${
                              b.status === 'confirmed' ? 'text-[#60A5FA]' : 'text-[#F3F6FB]/45'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#F3F6FB]/78 tabular-nums">
                          <span>Check-in {b.checkInDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {b.nights} {b.nights === 1 ? 'night' : 'nights'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#F3F6FB]/10 pt-3">
                          <span className="font-mono text-sm font-medium tabular-nums text-[#F3F6FB]">
                            {formatInr(b.totalAmount)}
                          </span>

                          {b.status === 'confirmed' && (
                            <button
                              type="button"
                              disabled={busyId === b.id}
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-xs font-semibold text-[#FCA5A5] hover:underline disabled:opacity-50 cursor-pointer"
                            >
                              {busyId === b.id ? 'Cancelling...' : 'Cancel Reservation'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : favorites.length === 0 ? (
                <div className="rounded-lg border border-[#F3F6FB]/12 bg-[#0A0F1A]/70 p-6 text-center space-y-2">
                  <Bookmark className="mx-auto h-6 w-6 text-[#60A5FA]" />
                  <p className="text-sm font-medium text-[#F3F6FB]">No saved sanctuaries</p>
                  <p className="text-xs text-[#F3F6FB]/65">
                    Use the bookmark button on any residence to shortlist your favorite stays.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav) => {
                    const matchedStay = stayMap.get(fav.stayId);
                    return (
                      <div
                        key={fav.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-[#F3F6FB]/14 bg-[#0A0F1A] p-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-semibold text-[#F3F6FB]">
                            {fav.stayName}
                          </p>
                          {matchedStay && (
                            <p className="text-xs text-[#60A5FA] tabular-nums">
                              {matchedStay.location} · {formatInr(matchedStay.ratePerNight)}/night
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {matchedStay && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenSanctuary(matchedStay);
                              }}
                              className="rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
                            >
                              View
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busyId === fav.stayId}
                            aria-label={`Remove ${fav.stayName}`}
                            onClick={() => handleRemoveFavorite(fav)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#F3F6FB]/15 text-[#F3F6FB]/70 hover:text-[#FCA5A5] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
