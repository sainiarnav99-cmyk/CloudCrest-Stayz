import React, { useEffect, useRef } from 'react';

interface MussoorieTextureCanvasProps {
  tone: 'dark' | 'light';
  density?: 'hero' | 'section';
  className?: string;
}

/**
 * Animated Mussoorie topographic contour + drifting Himalayan mist texture
 * tuned to the Black & Royal Blue palette.
 */
export const MussoorieTextureCanvas: React.FC<MussoorieTextureCanvasProps> = ({
  tone,
  density = 'section',
  className = '',
}) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || density !== 'hero') return;

    const handleMove = (e: PointerEvent) => {
      if (!layerRef.current) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * 10;
      layerRef.current.style.transform = `translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [density]);

  const strokePrimary =
    tone === 'dark' ? 'rgba(96, 165, 250, 0.24)' : 'rgba(29, 78, 216, 0.12)';
  const strokeSecondary =
    tone === 'dark' ? 'rgba(243, 246, 251, 0.11)' : 'rgba(5, 7, 11, 0.10)';
  const mistToneA =
    tone === 'dark'
      ? 'radial-gradient(ellipse 68% 42% at 22% 35%, rgba(15, 24, 43, 0.85) 0%, rgba(5, 7, 11, 0) 72%)'
      : 'radial-gradient(ellipse 68% 42% at 22% 35%, rgba(255, 255, 255, 0.88) 0%, rgba(243, 246, 251, 0) 72%)';
  const mistToneB =
    tone === 'dark'
      ? 'radial-gradient(ellipse 62% 45% at 78% 68%, rgba(37, 99, 235, 0.16) 0%, rgba(5, 7, 11, 0) 70%)'
      : 'radial-gradient(ellipse 62% 45% at 78% 68%, rgba(219, 234, 254, 0.55) 0%, rgba(243, 246, 251, 0) 70%)';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          tone === 'dark' ? 'mussoorie-mineral-grain opacity-55' : 'mussoorie-mineral-grain-light opacity-65'
        }`}
      />

      <div
        className="animate-mussoorie-mist-slow absolute -inset-12"
        style={{ backgroundImage: mistToneA }}
      />
      <div
        className="animate-mussoorie-mist-counter absolute -inset-12"
        style={{ backgroundImage: mistToneB }}
      />

      <div
        ref={layerRef}
        className="absolute inset-0 transition-transform duration-700 ease-out"
      >
        <svg
          viewBox="0 0 1440 760"
          preserveAspectRatio="xMidYMid slice"
          className="animate-mussoorie-contour h-full w-full"
        >
          <g fill="none" strokeWidth="1.15">
            <path
              d="M-60 190 C 160 110, 310 240, 520 155 C 740 70, 920 215, 1140 135 C 1290 80, 1390 120, 1510 95"
              stroke={strokePrimary}
            />
            <path
              d="M-80 235 C 140 155, 340 275, 550 195 C 770 110, 950 250, 1170 175 C 1320 120, 1410 155, 1520 135"
              stroke={strokeSecondary}
            />
            <path
              d="M-40 285 C 190 215, 380 315, 600 240 C 810 165, 980 295, 1210 220 C 1340 175, 1430 205, 1530 185"
              stroke={strokePrimary}
            />
            <path
              d="M-90 385 C 120 330, 320 430, 540 365 C 760 300, 940 415, 1160 345 C 1320 295, 1420 335, 1530 315"
              stroke={strokeSecondary}
            />
            <path
              d="M-60 440 C 165 385, 360 480, 580 418 C 805 352, 975 468, 1200 398 C 1340 355, 1435 390, 1520 370"
              stroke={strokePrimary}
            />
            <ellipse
              cx="1115"
              cy="195"
              rx="165"
              ry="48"
              transform="rotate(-8 1115 195)"
              stroke={strokePrimary}
              strokeDasharray="6 8"
            />
            <ellipse
              cx="1115"
              cy="195"
              rx="108"
              ry="29"
              transform="rotate(-8 1115 195)"
              stroke={strokeSecondary}
            />
            <ellipse
              cx="320"
              cy="525"
              rx="210"
              ry="58"
              transform="rotate(6 320 525)"
              stroke={strokeSecondary}
              strokeDasharray="4 10"
            />
            <path
              d="M-70 595 C 180 545, 410 645, 650 580 C 885 515, 1080 620, 1290 555 C 1390 525, 1470 545, 1540 530"
              stroke={strokePrimary}
            />
            <path
              d="M-50 655 C 210 610, 440 695, 690 635 C 920 578, 1110 675, 1330 610 C 1415 585, 1480 605, 1540 590"
              stroke={strokeSecondary}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
