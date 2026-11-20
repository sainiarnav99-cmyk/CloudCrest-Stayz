import React, { useState } from 'react';
import { Compass, Mountain, SunDim } from 'lucide-react';
import {
  MUSSOORIE_EXPERIENCES,
  MUSSOORIE_LANDMARKS,
} from '../data/mussoorieStays';
import { MussoorieTextureCanvas } from './MussoorieTextureCanvas';

export const MussoorieAtlasSection: React.FC = () => {
  const [activeLandmarkId, setActiveLandmarkId] = useState(MUSSOORIE_LANDMARKS[0].id);
  const activeLandmark =
    MUSSOORIE_LANDMARKS.find((l) => l.id === activeLandmarkId) || MUSSOORIE_LANDMARKS[0];

  return (
    <section
      id="mussoorie"
      className="relative overflow-hidden bg-[#04060A] text-[#F3F6FB] py-20 lg:py-28 border-t border-[#3B82F6]/20"
    >
      <MussoorieTextureCanvas tone="dark" density="section" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Intro & Landmark Selector */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#60A5FA]">
              The Mussoorie Terrain
            </p>
            <h2
              className="font-display text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Anchored Across Four Historic Himalayan Ridges
            </h2>
            <p className="text-sm leading-relaxed text-[#CBD5E1] sm:text-base">
              Select a Mussoorie spur below to inspect elevation, micro-climate, and private trail
              proximity from CloudCrest Stayz.
            </p>

            <div className="space-y-2 pt-2">
              {MUSSOORIE_LANDMARKS.map((landmark) => {
                const selected = landmark.id === activeLandmark.id;
                return (
                  <button
                    key={landmark.id}
                    type="button"
                    onClick={() => setActiveLandmarkId(landmark.id)}
                    className={`w-full flex items-center justify-between gap-4 rounded-md border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#3B82F6] bg-[#0F192E] text-[#F8FAFC]'
                        : 'border-[#3B82F6]/18 bg-[#090F1C]/85 text-[#CBD5E1] hover:border-[#60A5FA]/45 hover:text-[#F8FAFC]'
                    }`}
                  >
                    <span className="font-display text-xl font-medium">{landmark.name}</span>
                    <span className="font-mono text-xs tabular-nums text-[#60A5FA] whitespace-nowrap shrink-0">
                      {landmark.elevation}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Interactive Topographic Detail Panel */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-lg border border-[#3B82F6]/30 bg-[#090F1C]/95 p-7 sm:p-10 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F3F6FB]/12 pb-6">
                <div>
                  <p className="text-xs font-medium text-[#60A5FA]">{activeLandmark.distanceNote}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold text-[#F3F6FB]">
                    {activeLandmark.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-[#F3F6FB]/60">Ridge Altitude</span>
                  <span className="font-mono text-2xl font-medium tabular-nums text-[#60A5FA]">
                    {activeLandmark.elevation}
                  </span>
                </div>
              </div>

              {/* Live Animated Elevation Profile Visual */}
              <div className="relative h-44 overflow-hidden rounded-md border border-[#F3F6FB]/10 bg-[#05070B] p-4">
                <svg viewBox="0 0 640 160" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="atlasRidgeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#05070B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 135 Q90 95 170 112 T330 68 T495 88 T640 52 L640 160 L0 160 Z"
                    fill="url(#atlasRidgeGrad)"
                  />
                  <path
                    d="M0 135 Q90 95 170 112 T330 68 T495 88 T640 52"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="1.75"
                  />
                  <g className="animate-mussoorie-cloud">
                    <ellipse cx="220" cy="94" rx="135" ry="12" fill="#E2ECFF" opacity="0.14" />
                    <ellipse cx="470" cy="76" rx="120" ry="10" fill="#93C5FD" opacity="0.12" />
                  </g>
                  <circle cx="330" cy="68" r="4.5" fill="#60A5FA" />
                  <circle cx="330" cy="68" r="11" fill="none" stroke="#3B82F6" strokeOpacity="0.55" />
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#60A5FA]">
                    <SunDim className="h-4 w-4" aria-hidden="true" />
                    <span>Micro-Climate & Sightline</span>
                  </div>
                  <p className="text-sm font-medium text-[#F3F6FB]">{activeLandmark.microClimate}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#60A5FA]">
                    <Mountain className="h-4 w-4" aria-hidden="true" />
                    <span>Terrain Character</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#F3F6FB]/78">
                    {activeLandmark.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Mussoorie Experiences (#experiences) */}
        <div id="experiences" className="mt-24 pt-16 border-t border-[#F3F6FB]/12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#60A5FA]">
                Curated Rituals
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[#F3F6FB] sm:text-4xl">
                Seasonal Mussoorie Experiences
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#F3F6FB]/72 flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#60A5FA] shrink-0" aria-hidden="true" />
              <span>Private naturalist, culinary, and wellness rituals arranged by our ridge concierge.</span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {MUSSOORIE_EXPERIENCES.map((exp) => (
              <div key={exp.number} className="border-t border-[#F3F6FB]/15 pt-6 space-y-2.5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold text-[#F3F6FB]">
                    <span className="text-[#60A5FA] mr-2 font-mono text-base">{exp.number}</span>
                    {exp.title}
                  </h3>
                </div>
                <p className="text-xs font-medium text-[#60A5FA]">{exp.timing}</p>
                <p className="text-sm leading-relaxed text-[#F3F6FB]/75">{exp.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
