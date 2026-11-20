import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { MussoorieSanctuary, SanctuaryGalleryFrame } from '../data/mussoorieStays';
import { MussoorieArtwork } from './MussoorieArtwork';

interface SanctuaryLightboxModalProps {
  stay: MussoorieSanctuary | null;
  initialIndex?: number;
  onClose: () => void;
  onReserveClick: (stay: MussoorieSanctuary) => void;
}

const FrameStageVisual: React.FC<{
  stay: MussoorieSanctuary;
  frame: SanctuaryGalleryFrame;
  className?: string;
}> = ({ stay, frame, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (frame.imageUrl && !imgFailed) {
    return (
      <img
        src={frame.imageUrl}
        alt={`${stay.name} — ${frame.title}`}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <MussoorieArtwork
      variant={stay.sceneVariant}
      perspective={frame.perspective}
      title={`${stay.name} — ${frame.title}`}
      className={`h-full w-full ${className}`}
    />
  );
};

export const SanctuaryLightboxModal: React.FC<SanctuaryLightboxModalProps> = ({
  stay,
  initialIndex = 0,
  onClose,
  onReserveClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [stay?.id, initialIndex]);

  useEffect(() => {
    if (!stay) return;
    const total = stay.gallery.length;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stay, onClose]);

  if (!stay || stay.gallery.length === 0) return null;

  const safeIndex = activeIndex % stay.gallery.length;
  const activeFrame = stay.gallery[safeIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070B]/92 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative my-auto w-full max-w-5xl overflow-hidden rounded-lg border border-[#3B82F6]/35 bg-[#0A0F1A] text-[#F3F6FB]">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F3F6FB]/12 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#60A5FA]">
              <span>{stay.wing}</span>
              <span aria-hidden="true">·</span>
              <span>{stay.location}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{stay.elevationMeters} m</span>
            </div>
            <h2 id="lightbox-title" className="truncate font-display text-2xl font-semibold text-[#F3F6FB]">
              {stay.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReserveClick(stay);
              }}
              className="rounded-md bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect & Reserve
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo gallery"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#F3F6FB]/20 text-[#F3F6FB] hover:border-[#60A5FA] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* High-Resolution Stage */}
        <div className="relative aspect-[16/9] w-full bg-[#05070B]">
          <FrameStageVisual key={`${stay.id}-${activeFrame.id}`} stay={stay} frame={activeFrame} />

          {/* Prev / Next Controls */}
          <button
            type="button"
            aria-label="Previous gallery image"
            onClick={() =>
              setActiveIndex((prev) => (prev - 1 + stay.gallery.length) % stay.gallery.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#F3F6FB]/25 bg-[#05070B]/75 text-[#F3F6FB] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next gallery image"
            onClick={() => setActiveIndex((prev) => (prev + 1) % stay.gallery.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#F3F6FB]/25 bg-[#05070B]/75 text-[#F3F6FB] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Measured Scrim Caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05070B]/92 via-[#05070B]/55 to-transparent p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3F6FB]">
                  {activeFrame.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F3F6FB]/80">{activeFrame.caption}</p>
              </div>
              <span className="font-mono text-xs tabular-nums text-[#60A5FA]">
                {String(safeIndex + 1).padStart(2, '0')} /{' '}
                {String(stay.gallery.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation Strip */}
        <div className="grid grid-cols-2 gap-3 border-t border-[#F3F6FB]/12 bg-[#05070B] p-4 sm:grid-cols-4 sm:px-7">
          {stay.gallery.map((frame, index) => {
            const isSelected = index === safeIndex;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group text-left overflow-hidden rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]'
                    : 'border-[#F3F6FB]/15 opacity-75 hover:opacity-100 hover:border-[#60A5FA]/50'
                }`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#0A0F1A]">
                  <FrameStageVisual stay={stay} frame={frame} />
                </div>
                <p className="truncate bg-[#0A0F1A] px-2.5 py-1.5 text-[11px] font-medium text-[#F3F6FB]">
                  {frame.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
