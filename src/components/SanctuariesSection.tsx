import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bookmark, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { MussoorieSanctuary, SanctuaryWing } from '../data/mussoorieStays';
import { MussoorieArtwork } from './MussoorieArtwork';
import { MussoorieTextureCanvas } from './MussoorieTextureCanvas';
import { SanctuaryLightboxModal } from './SanctuaryLightboxModal';

interface SanctuariesSectionProps {
  sanctuaries: MussoorieSanctuary[];
  selectedWing: 'All' | SanctuaryWing;
  minGuests: number;
  favoriteIds: Set<string>;
  onSelectWing: (wing: 'All' | SanctuaryWing) => void;
  onResetGuests: () => void;
  onOpenSanctuary: (stay: MussoorieSanctuary) => void;
  onToggleFavorite: (stay: MussoorieSanctuary) => void;
}

const WINGS: Array<'All' | SanctuaryWing> = [
  'All',
  'Ridge Suites',
  'Private Villas',
  'Heritage Wing',
];

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ScrollRevealCardProps {
  index: number;
  children: React.ReactNode;
}

const ScrollRevealCard: React.FC<ScrollRevealCardProps> = ({ index, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    return typeof IntersectionObserver === 'undefined';
  });

  useEffect(() => {
    if (isVisible) return;
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -36px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  const staggerMs = (index % 2) * 90;

  return (
    <div
      ref={cardRef}
      style={{
        transitionDuration: '620ms',
        transitionDelay: `${staggerMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`lg:col-span-6 transition-[opacity,transform] will-change-[opacity,transform] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
};

interface CardVisualSliderProps {
  stay: MussoorieSanctuary;
  activeIndex: number;
  onStep: (delta: number) => void;
  onOpenLightbox: (index: number) => void;
}

const CardVisualSlider: React.FC<CardVisualSliderProps> = ({
  stay,
  activeIndex,
  onStep,
  onOpenLightbox,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const frames = stay.gallery;
  const safeIndex = frames.length > 0 ? activeIndex % frames.length : 0;
  const currentFrame = frames[safeIndex];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#04060A]">
      <button
        type="button"
        onClick={() => onOpenLightbox(safeIndex)}
        aria-label={`Open photo gallery for ${stay.name}`}
        className="block h-full w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#60A5FA]"
      >
        {currentFrame?.imageUrl && !imgFailed ? (
          <img
            key={currentFrame.id}
            src={currentFrame.imageUrl}
            alt={`${stay.name} — ${currentFrame.title}`}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <MussoorieArtwork
            variant={stay.sceneVariant}
            perspective={currentFrame?.perspective || 'interior-bedroom'}
            title={`${stay.name} — ${currentFrame?.title || ''}`}
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
      </button>

      {/* Inline Card Prev / Next Slide Controls (Hotel Room Showcase Pattern) */}
      {frames.length > 1 && (
        <>
          <button
            type="button"
            aria-label={`Previous view of ${stay.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#F3F6FB]/20 bg-[#04060A]/75 text-[#F8FAFC] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Next view of ${stay.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#F3F6FB]/20 bg-[#04060A]/75 text-[#F8FAFC] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Measured Scrim Bar with Active Angle & Location */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#04060A]/92 via-[#04060A]/45 to-transparent p-4">
        <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-[#F3F6FB]/92">
          <span className="truncate">
            {currentFrame?.title || stay.location}
          </span>
          <span className="shrink-0 tabular-nums text-[#60A5FA]">
            {String(safeIndex + 1).padStart(2, '0')}/{String(frames.length).padStart(2, '0')} ·{' '}
            {stay.elevationMeters} m
          </span>
        </div>
      </div>
    </div>
  );
};

export const SanctuariesSection: React.FC<SanctuariesSectionProps> = ({
  sanctuaries,
  selectedWing,
  minGuests,
  favoriteIds,
  onSelectWing,
  onResetGuests,
  onOpenSanctuary,
  onToggleFavorite,
}) => {
  const [lightboxStay, setLightboxStay] = useState<MussoorieSanctuary | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [cardFrameMap, setCardFrameMap] = useState<Record<string, number>>({});

  const filtered = sanctuaries.filter((stay) => {
    const wingMatch = selectedWing === 'All' || stay.wing === selectedWing;
    const guestMatch = stay.maxGuests >= minGuests;
    return wingMatch && guestMatch;
  });

  const openLightbox = (stay: MussoorieSanctuary, startIndex = 0) => {
    setLightboxStay(stay);
    setLightboxIndex(startIndex);
  };

  const stepCardFrame = (stay: MussoorieSanctuary, delta: number) => {
    const total = stay.gallery.length;
    if (total === 0) return;
    setCardFrameMap((prev) => {
      const current = prev[stay.id] ?? 0;
      return {
        ...prev,
        [stay.id]: (current + delta + total) % total,
      };
    });
  };

  return (
    <section
      id="sanctuaries"
      className="relative overflow-hidden bg-[#060A13] text-[#F3F6FB] py-20 lg:py-28 border-t border-[#3B82F6]/20"
    >
      <MussoorieTextureCanvas tone="dark" density="section" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-10">
        {/* Section Header + Segmented Wing Filters */}
        <div className="flex flex-col gap-8 border-b border-[#3B82F6]/20 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#60A5FA]">
              The Mussoorie Collection
            </p>
            <h2
              className="font-display text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-[2.75rem] leading-[1.1]"
              style={{ textWrap: 'balance' }}
            >
              Architectural Residences Carved Into the Ridge
            </h2>
            <p className="text-sm leading-relaxed text-[#CBD5E1] sm:text-base">
              Cycle through each sanctuary’s bedroom, veranda, bath, and Doon Valley views right
              from the suite card, or expand the full gallery in Obsidian & Royal Blue twilight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Sanctuary wing filter"
              className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-[#3B82F6]/25 bg-[#0A1120] p-1"
            >
              {WINGS.map((wing) => {
                const isActive = selectedWing === wing;
                return (
                  <button
                    key={wing}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onSelectWing(wing)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#CBD5E1] hover:text-white'
                    }`}
                  >
                    {wing === 'All' ? 'All Sanctuaries' : wing}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active guest capacity filter notice if guests > 1 */}
        {minGuests > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#3B82F6]/15 pb-4 text-xs text-[#CBD5E1]">
            <span>
              Showing{' '}
              <strong className="font-semibold text-[#F8FAFC] tabular-nums">{filtered.length}</strong>{' '}
              sanctuaries accommodating at least{' '}
              <strong className="font-semibold text-[#F8FAFC] tabular-nums">{minGuests}</strong> guests.
            </span>
            <button
              type="button"
              onClick={onResetGuests}
              className="font-semibold text-[#60A5FA] underline underline-offset-4 hover:text-[#93C5FD] cursor-pointer"
            >
              Show all capacities
            </button>
          </div>
        )}

        {/* Sanctuary Showcase Grid with IntersectionObserver Scroll Reveal */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-lg border border-[#3B82F6]/25 bg-[#090F1C] p-10 text-center space-y-4">
            <p className="font-display text-2xl font-semibold text-[#F8FAFC]">
              No residences match that combination in this wing
            </p>
            <p className="text-sm text-[#CBD5E1]">
              Try switching to All Sanctuaries or adjusting your party size for larger private villas.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectWing('All');
                onResetGuests();
              }}
              className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Reset Sanctuary Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
            {filtered.map((stay, idx) => {
              const isFavorite = favoriteIds.has(stay.id);
              const cardSlide = cardFrameMap[stay.id] ?? 0;

              return (
                <ScrollRevealCard key={`${selectedWing}-${stay.id}`} index={idx}>
                  <article className="group flex h-full flex-col justify-between overflow-hidden rounded-lg border border-[#3B82F6]/22 bg-[#090F1C] transition-colors hover:border-[#60A5FA]/60">
                    <div>
                      <div className="relative">
                        <CardVisualSlider
                          stay={stay}
                          activeIndex={cardSlide}
                          onStep={(delta) => stepCardFrame(stay, delta)}
                          onOpenLightbox={(frameIdx) => openLightbox(stay, frameIdx)}
                        />

                        {/* Gallery & Bookmark Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openLightbox(stay, cardSlide)}
                            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[#F3F6FB]/22 bg-[#04060A]/78 px-3 text-[11px] font-semibold text-[#F8FAFC] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
                          >
                            <Expand className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
                            <span className="tabular-nums">Gallery ({stay.gallery.length})</span>
                          </button>

                          <button
                            type="button"
                            aria-label={
                              isFavorite
                                ? `Remove ${stay.name} from saved stays`
                                : `Save ${stay.name}`
                            }
                            onClick={() => onToggleFavorite(stay)}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-md border backdrop-blur-md transition-colors cursor-pointer ${
                              isFavorite
                                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                : 'border-[#F3F6FB]/22 bg-[#04060A]/78 text-[#F8FAFC] hover:border-[#60A5FA]'
                            }`}
                          >
                            <Bookmark
                              className="h-4 w-4"
                              fill={isFavorite ? 'currentColor' : 'none'}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Zero-Pill Editorial Details */}
                      <div className="p-6 sm:p-7 space-y-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#60A5FA]">
                          <span>{stay.wing}</span>
                          <span aria-hidden="true" className="text-[#F3F6FB]/25">
                            ·
                          </span>
                          <span>{stay.bedConfiguration}</span>
                          <span aria-hidden="true" className="text-[#F3F6FB]/25">
                            ·
                          </span>
                          <span className="tabular-nums">
                            {stay.areaSqFt.toLocaleString('en-IN')} sq ft
                          </span>
                          <span aria-hidden="true" className="text-[#F3F6FB]/25">
                            ·
                          </span>
                          <span className="tabular-nums">Up to {stay.maxGuests} Guests</span>
                        </div>

                        <h3 className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-[1.75rem]">
                          {stay.name}
                        </h3>

                        <p className="text-sm leading-relaxed text-[#CBD5E1]">{stay.summary}</p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between gap-4 border-t border-[#3B82F6]/15 px-6 py-4 sm:px-7">
                      <div>
                        <span className="block text-[11px] font-medium text-[#94A3B8]">
                          Nightly Tariff
                        </span>
                        <span className="font-display text-2xl font-semibold tabular-nums text-[#F8FAFC]">
                          {formatInr(stay.ratePerNight)}
                        </span>
                        <span className="text-xs text-[#94A3B8]"> / night</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onOpenSanctuary(stay)}
                          className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
                        >
                          <span>Inspect & Reserve</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#DBEAFE]" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                </ScrollRevealCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Photo Gallery Modal */}
      <SanctuaryLightboxModal
        stay={lightboxStay}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxStay(null)}
        onReserveClick={onOpenSanctuary}
      />
    </section>
  );
};
