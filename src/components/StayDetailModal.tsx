import React, { useEffect, useState } from 'react';
import { Bookmark, Check, X } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { MussoorieSanctuary } from '../data/mussoorieStays';
import { createStayBooking, type StayReviewRecord } from '../lib/firebase';
import { GoogleMark } from './GoogleMark';
import { MussoorieArtwork } from './MussoorieArtwork';

interface StayDetailModalProps {
  stay: MussoorieSanctuary | null;
  user: User | null;
  isFavorite: boolean;
  defaultCheckInDate: string;
  defaultNights: number;
  defaultGuests: number;
  stayReviews: StayReviewRecord[];
  onClose: () => void;
  onRequireSignIn: () => Promise<User | null>;
  onToggleFavorite: (stay: MussoorieSanctuary) => void;
  onBookingConfirmed: (stayName: string) => void;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const StayDetailModal: React.FC<StayDetailModalProps> = ({
  stay,
  user,
  isFavorite,
  defaultCheckInDate,
  defaultNights,
  defaultGuests,
  stayReviews,
  onClose,
  onRequireSignIn,
  onToggleFavorite,
  onBookingConfirmed,
}) => {
  const [checkInDate, setCheckInDate] = useState(defaultCheckInDate);
  const [nights, setNights] = useState(Math.min(14, Math.max(1, defaultNights)));
  const [guests, setGuests] = useState(
    stay ? Math.min(stay.maxGuests, Math.max(1, defaultGuests)) : 2
  );
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setActiveFrameIdx(0);
    setImgFailed(false);
  }, [stay?.id]);

  if (!stay) return null;

  const frames = stay.gallery;
  const activeFrame = frames[activeFrameIdx % frames.length];
  const minDate = new Date().toISOString().split('T')[0];
  const baseTariff = stay.ratePerNight * nights;
  const taxesAndLevy = Math.round(baseTariff * 0.12);
  const totalAmount = baseTariff + taxesAndLevy;

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      let activeUser = user;
      if (!activeUser) {
        activeUser = await onRequireSignIn();
        if (!activeUser) {
          setSubmitting(false);
          return;
        }
      }
      await createStayBooking({
        userId: activeUser.uid,
        stayId: stay.id,
        stayName: stay.name,
        stayLocation: `${stay.location}, Mussoorie`,
        checkInDate,
        nights,
        guests,
        totalAmount,
      });
      onBookingConfirmed(stay.name);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to complete your reservation right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sanctuary-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#04060A]/88 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative my-auto w-full max-w-4xl overflow-hidden rounded-lg border border-[#3B82F6]/35 bg-[#04060A] text-[#F3F6FB]">
        {/* Modal Top Strip */}
        <div className="flex items-center justify-between gap-4 border-b border-[#3B82F6]/18 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#60A5FA]">
            <span>{stay.wing}</span>
            <span aria-hidden="true">·</span>
            <span>{stay.location}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{stay.elevationMeters} m</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(stay)}
              aria-label={isFavorite ? 'Remove bookmark' : 'Save sanctuary'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-[#3B82F6]/30 text-[#F8FAFC] hover:border-[#60A5FA]'
              }`}
            >
              <Bookmark className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sanctuary details"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3B82F6]/30 text-[#F8FAFC] hover:border-[#60A5FA] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Architecture & Amenities */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-[#3B82F6]/18 max-h-[75vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#3B82F6]/25">
                {activeFrame?.imageUrl && !imgFailed ? (
                  <img
                    key={activeFrame.id}
                    src={activeFrame.imageUrl}
                    alt={`${stay.name} — ${activeFrame.title}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MussoorieArtwork
                    variant={stay.sceneVariant}
                    perspective={activeFrame?.perspective || 'interior-bedroom'}
                    title={`${stay.name} — ${activeFrame?.title || ''}`}
                    className="h-full w-full"
                  />
                )}
              </div>

              {frames.length > 1 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {frames.map((frame, index) => {
                    const selected = index === activeFrameIdx;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => {
                          setActiveFrameIdx(index);
                          setImgFailed(false);
                        }}
                        className={`rounded-md border px-2.5 py-2 text-left text-[11px] font-medium transition-colors truncate cursor-pointer ${
                          selected
                            ? 'border-[#3B82F6] bg-[#0F192E] text-[#F8FAFC]'
                            : 'border-[#3B82F6]/18 bg-[#090F1C] text-[#94A3B8] hover:border-[#60A5FA]/50 hover:text-[#F8FAFC]'
                        }`}
                      >
                        {frame.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 id="sanctuary-modal-title" className="font-display text-3xl font-semibold text-[#F8FAFC]">
                {stay.name}
              </h2>
              <p className="text-xs font-mono text-[#60A5FA]">
                {stay.bedConfiguration} · {stay.coordinates}
              </p>
              <p className="text-sm leading-relaxed text-[#CBD5E1]">{stay.summary}</p>
              <p className="text-xs leading-relaxed text-[#94A3B8]">{stay.architecturalNote}</p>
            </div>

            <div className="space-y-3 border-t border-[#3B82F6]/18 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#60A5FA]">
                Included Sanctuary Amenities
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {stay.amenities.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#E2E8F0]">
                    <Check className="h-3.5 w-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {stayReviews.length > 0 && (
              <div className="space-y-3 border-t border-[#3B82F6]/18 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#60A5FA]">
                  Recent Guest Note
                </h3>
                <p className="font-display text-lg italic text-[#F3F6FB]/90">
                  “{stayReviews[0].quote}”
                </p>
                <p className="text-xs text-[#94A3B8]">
                  — {stayReviews[0].guestName}, {stayReviews[0].guestCity} ({stayReviews[0].stayDate})
                </p>
              </div>
            )}
          </div>

          {/* Right Direct Reservation Form */}
          <form onSubmit={handleReserve} className="lg:col-span-5 bg-[#090F1C] p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <span className="text-xs text-[#94A3B8]">Nightly Rate</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-semibold tabular-nums text-[#F8FAFC]">
                    {formatInr(stay.ratePerNight)}
                  </span>
                  <span className="text-xs text-[#94A3B8]">/ night</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block space-y-1.5 text-xs font-medium text-[#CBD5E1]">
                  <span>Check-in Date</span>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3.5 py-2.5 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5 text-xs font-medium text-[#CBD5E1]">
                    <span>Nights (1–14)</span>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={nights}
                      onChange={(e) =>
                        setNights(Math.min(14, Math.max(1, Number(e.target.value) || 1)))
                      }
                      className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3.5 py-2.5 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
                    />
                  </label>

                  <label className="block space-y-1.5 text-xs font-medium text-[#CBD5E1]">
                    <span>Guests (Max {stay.maxGuests})</span>
                    <input
                      type="number"
                      min={1}
                      max={stay.maxGuests}
                      value={guests}
                      onChange={(e) =>
                        setGuests(
                          Math.min(stay.maxGuests, Math.max(1, Number(e.target.value) || 1))
                        )
                      }
                      className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3.5 py-2.5 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              {/* Transparent Tariff Summary */}
              <div className="space-y-2.5 border-t border-[#3B82F6]/18 pt-4 text-xs">
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>
                    {formatInr(stay.ratePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="tabular-nums font-medium text-[#F8FAFC]">
                    {formatInr(baseTariff)}
                  </span>
                </div>
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>GST & Ridge Conservation Levy (12%)</span>
                  <span className="tabular-nums font-medium text-[#F8FAFC]">
                    {formatInr(taxesAndLevy)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#3B82F6]/18 pt-3 text-sm font-semibold text-[#F8FAFC]">
                  <span>Total Reservation Estimate</span>
                  <span className="tabular-nums text-[#60A5FA]">{formatInr(totalAmount)}</span>
                </div>
              </div>

              {errorMsg && (
                <p role="alert" className="text-xs font-medium text-[#FCA5A5]">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {!user && !submitting && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <GoogleMark className="h-3.5 w-3.5" />
                  </span>
                )}
                <span>
                  {submitting
                    ? 'Confirming Sanctuary...'
                    : user
                      ? 'Confirm Sanctuary Reservation'
                      : 'Sign In with Google & Reserve'}
                </span>
              </button>
              <p className="text-center text-[11px] text-[#94A3B8]">
                Instant confirmation recorded to your CloudCrest Stayz member account.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
