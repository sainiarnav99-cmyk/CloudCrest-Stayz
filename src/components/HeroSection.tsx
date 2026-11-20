import React, { useState } from 'react';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Compass, Users } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { GalleryPerspective, SceneVariant } from '../data/mussoorieStays';
import { GoogleMark } from './GoogleMark';
import { MussoorieArtwork } from './MussoorieArtwork';
import { MussoorieTextureCanvas } from './MussoorieTextureCanvas';

interface HeroSectionProps {
  user: User | null;
  authBusy: boolean;
  checkInDate: string;
  nights: number;
  guests: number;
  onChangeCheckInDate: (date: string) => void;
  onChangeNights: (nights: number) => void;
  onChangeGuests: (guests: number) => void;
  onSearchAvailability: () => void;
  onSignIn: () => void;
  onOpenPortal: () => void;
}

interface HeroSlide {
  id: string;
  variant: SceneVariant | 'hero';
  perspective?: GalleryPerspective;
  title: string;
  subtitle: string;
  coordinates: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'landour-crest',
    variant: 'hero',
    title: 'Landour Crest Pavilion',
    subtitle: 'Garhwal Himalaya Panorama · Blue Hour Study',
    coordinates: '30.4598° N · 78.0844° E',
  },
  {
    id: 'winterline-round-bed',
    variant: 'camels-back',
    perspective: 'interior-bedroom',
    title: 'Camel’s Back Winterline Suite',
    subtitle: 'Signature Round Bed · Doon Valley Bay Horizon',
    coordinates: '30.4561° N · 78.0672° E',
  },
  {
    id: 'benog-plunge-deck',
    variant: 'benog-plunge',
    perspective: 'scenic-terrace',
    title: 'Benog Mist Infinity Terrace',
    subtitle: 'Private Cliffside Sanctuary · Sunset Gorge Mist',
    coordinates: '30.4572° N · 78.0218° E',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  user,
  authBusy,
  checkInDate,
  nights,
  guests,
  onChangeCheckInDate,
  onChangeNights,
  onChangeGuests,
  onSearchAvailability,
  onSignIn,
  onOpenPortal,
}) => {
  const minDate = new Date().toISOString().split('T')[0];
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = HERO_SLIDES[slideIndex];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#04060A] text-[#F3F6FB] pt-12 pb-16 lg:pt-16 lg:pb-24"
    >
      <MussoorieTextureCanvas tone="dark" density="hero" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-10">
        {/* 12-Column Editorial Split */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Narrative Column */}
          <div className="flex flex-col justify-between lg:col-span-7 py-2">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-wide text-[#60A5FA]">
                <span>Mussoorie, Uttarakhand</span>
                <span aria-hidden="true" className="text-[#F3F6FB]/30">
                  ·
                </span>
                <span className="font-mono tabular-nums">2,180 m Ridge Elevation</span>
                <span aria-hidden="true" className="text-[#F3F6FB]/30">
                  ·
                </span>
                <span>Suites from ₹1,500 / night</span>
              </div>

              <h1
                className="font-display font-semibold tracking-tight text-[#F8FAFC] leading-[1.06]"
                style={{
                  fontSize: 'clamp(2.5rem, 4.4vw, 4.25rem)',
                  textWrap: 'balance',
                }}
              >
                Where Himalayan Mist Meets Nocturnal Mountain Stillness.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#CBD5E1] sm:text-lg">
                Perched along Mussoorie’s quiet deodar ridges above Landour and Benog, CloudCrest
                Stayz offers intimate obsidian-slate and sapphire-lit sanctuaries sculpted for
                sweeping Doon Valley views, winterline twilights, and restorative altitude.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#sanctuaries"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
              >
                <span>Explore Sanctuaries</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              {user ? (
                <button
                  type="button"
                  onClick={onOpenPortal}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-[#F8FAFC] border border-[#3B82F6]/35 bg-[#090F1C] rounded-md hover:border-[#60A5FA] hover:text-[#93C5FD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  <span>Member Concierge</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={onSignIn}
                  className="inline-flex items-center gap-2.5 px-5 py-3.5 text-sm font-medium text-[#F8FAFC] border border-[#3B82F6]/35 bg-[#090F1C] rounded-md hover:border-[#60A5FA] hover:text-[#93C5FD] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <GoogleMark className="h-3.5 w-3.5" />
                  </span>
                  <span>{authBusy ? 'Connecting Google...' : 'Sign in with Google'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Architectural Panoramic Showcase */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[340px] lg:min-h-[440px] overflow-hidden rounded-lg border border-[#3B82F6]/35 bg-[#090F1C]">
              <MussoorieArtwork
                variant={currentSlide.variant}
                perspective={currentSlide.perspective}
                title={currentSlide.title}
                className="h-full w-full"
              />

              {/* Slide Prev / Next Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous hero panorama"
                  onClick={() =>
                    setSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#F3F6FB]/20 bg-[#04060A]/75 text-[#F8FAFC] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next hero panorama"
                  onClick={() => setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#F3F6FB]/20 bg-[#04060A]/75 text-[#F8FAFC] backdrop-blur-md hover:border-[#60A5FA] transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Caption Scrim */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#04060A]/95 via-[#04060A]/60 to-transparent p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-xl font-semibold text-[#F8FAFC]">
                      {currentSlide.title}
                    </p>
                    <p className="text-xs text-[#CBD5E1]">{currentSlide.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <span className="block font-mono text-[11px] tabular-nums text-[#60A5FA]">
                      {String(slideIndex + 1).padStart(2, '0')} /{' '}
                      {String(HERO_SLIDES.length).padStart(2, '0')}
                    </span>
                    <span className="block font-mono text-[11px] tabular-nums text-[#93C5FD]/80">
                      {currentSlide.coordinates}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Availability & Filter Strip Below Hero Split */}
        <div className="mt-12 rounded-lg border border-[#3B82F6]/25 bg-[#090F1C]/95 p-4 sm:p-5 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <label className="block space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#CBD5E1]">
                <Calendar className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
                <span>Check-in Date</span>
              </span>
              <input
                type="date"
                min={minDate}
                value={checkInDate}
                onChange={(e) => onChangeCheckInDate(e.target.value)}
                className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3.5 py-2.5 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#CBD5E1]">
                <span>Length of Stay</span>
              </span>
              <select
                value={nights}
                onChange={(e) => onChangeNights(Number(e.target.value))}
                className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3.5 py-2.5 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Night' : 'Nights'}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#CBD5E1]">
                <Users className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
                <span>Party Size</span>
              </span>
              <select
                value={guests}
                onChange={(e) => onChangeGuests(Number(e.target.value))}
                className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3.5 py-2.5 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8].map((g) => (
                  <option key={g} value={g}>
                    {g} {g === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={onSearchAvailability}
              className="h-[42px] w-full rounded-md bg-[#2563EB] px-5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
            >
              Check Sanctuary Availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
