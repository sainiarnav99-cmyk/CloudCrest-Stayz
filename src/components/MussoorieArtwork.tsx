import React, { useId } from 'react';
import type { GalleryPerspective, SceneVariant } from '../data/mussoorieStays';

interface MussoorieArtworkProps {
  variant: SceneVariant | 'hero';
  perspective?: GalleryPerspective;
  title: string;
  className?: string;
}

const PALETTES: Record<
  SceneVariant | 'hero',
  {
    skyTop: string;
    skyMid: string;
    skyBottom: string;
    farRidge: string;
    midRidge: string;
    nearRidge: string;
    glow: string;
    accent: string;
    wallDark: string;
    wallMid: string;
    timber: string;
    linen: string;
    throwBlue: string;
  }
> = {
  hero: {
    skyTop: '#030509',
    skyMid: '#09152B',
    skyBottom: '#173468',
    farRidge: '#1A3A70',
    midRidge: '#0D1E3D',
    nearRidge: '#050912',
    glow: '#93C5FD',
    accent: '#3B82F6',
    wallDark: '#060A13',
    wallMid: '#0D172B',
    timber: '#13203A',
    linen: '#F3F6FB',
    throwBlue: '#1D4ED8',
  },
  'landour-cedar': {
    skyTop: '#04070E',
    skyMid: '#0D1D3B',
    skyBottom: '#1C3B72',
    farRidge: '#21447E',
    midRidge: '#102244',
    nearRidge: '#050A14',
    glow: '#BFDBFE',
    accent: '#60A5FA',
    wallDark: '#070B15',
    wallMid: '#101A2F',
    timber: '#182644',
    linen: '#F8FAFC',
    throwBlue: '#1E40AF',
  },
  'benog-plunge': {
    skyTop: '#03060C',
    skyMid: '#0A1C3A',
    skyBottom: '#1B407A',
    farRidge: '#234C8E',
    midRidge: '#0F264C',
    nearRidge: '#050A15',
    glow: '#93C5FD',
    accent: '#3B82F6',
    wallDark: '#060A13',
    wallMid: '#0E1C36',
    timber: '#16294A',
    linen: '#F3F6FB',
    throwBlue: '#2563EB',
  },
  'lal-tibba-observatory': {
    skyTop: '#020409',
    skyMid: '#0A1936',
    skyBottom: '#1B3B73',
    farRidge: '#244A8A',
    midRidge: '#102347',
    nearRidge: '#040811',
    glow: '#DBEAFE',
    accent: '#60A5FA',
    wallDark: '#060A14',
    wallMid: '#0F1B33',
    timber: '#172747',
    linen: '#F8FAFC',
    throwBlue: '#1D4ED8',
  },
  'camels-back': {
    skyTop: '#04060D',
    skyMid: '#102145',
    skyBottom: '#234585',
    farRidge: '#294E94',
    midRidge: '#13274D',
    nearRidge: '#050914',
    glow: '#93C5FD',
    accent: '#60A5FA',
    wallDark: '#070B16',
    wallMid: '#121E38',
    timber: '#1A2B4D',
    linen: '#F8FAFC',
    throwBlue: '#2563EB',
  },
  'hathipaon-glasshouse': {
    skyTop: '#03060D',
    skyMid: '#0B1D3B',
    skyBottom: '#163569',
    farRidge: '#1C3F7A',
    midRidge: '#0C1E3D',
    nearRidge: '#040811',
    glow: '#BFDBFE',
    accent: '#60A5FA',
    wallDark: '#050912',
    wallMid: '#0D182E',
    timber: '#142340',
    linen: '#F3F6FB',
    throwBlue: '#1E40AF',
  },
  'barlowganj-manor': {
    skyTop: '#04060C',
    skyMid: '#0E1D3B',
    skyBottom: '#1C396E',
    farRidge: '#22437E',
    midRidge: '#102142',
    nearRidge: '#050912',
    glow: '#DBEAFE',
    accent: '#3B82F6',
    wallDark: '#070B14',
    wallMid: '#111C33',
    timber: '#192948',
    linen: '#F8FAFC',
    throwBlue: '#1D4ED8',
  },
};

export const MussoorieArtwork: React.FC<MussoorieArtworkProps> = ({
  variant,
  perspective = 'interior-bedroom',
  title,
  className = '',
}) => {
  const p = PALETTES[variant];
  const rawId = useId();
  const uid = `cc-${variant}-${perspective}-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // Doon Valley shimmering lights helper coordinates
  const valleyLights = [
    [195, 314], [218, 318], [242, 315], [276, 322], [308, 316],
    [340, 320], [372, 317], [408, 321], [442, 315], [478, 319],
    [515, 314], [548, 321], [582, 316], [612, 319], [232, 327],
    [288, 329], [358, 328], [428, 329], [496, 327], [564, 328],
  ];

  // 1. Hero exterior or full valley-vista perspective
  if (variant === 'hero' || perspective === 'valley-vista') {
    return (
      <div
        role="img"
        aria-label={`${title} — Mussoorie Doon Valley panorama`}
        className={`relative overflow-hidden bg-[#04060A] ${className}`}
      >
        <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.skyTop} />
              <stop offset="56%" stopColor={p.skyMid} />
              <stop offset="100%" stopColor={p.skyBottom} />
            </linearGradient>
            <radialGradient id={`${uid}-winterline`} cx="50%" cy="58%" r="54%">
              <stop offset="0%" stopColor={p.glow} stopOpacity="0.45" />
              <stop offset="48%" stopColor={p.accent} stopOpacity="0.22" />
              <stop offset="100%" stopColor={p.skyBottom} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E2ECFF" stopOpacity="0" />
              <stop offset="35%" stopColor="#DBEAFE" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#93C5FD" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#E2ECFF" stopOpacity="0" />
            </linearGradient>
            <filter id={`${uid}-softblur`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter id={`${uid}-glowblur`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          <rect width="800" height="560" fill={`url(#${uid}-sky)`} />
          <rect width="800" height="560" fill={`url(#${uid}-winterline)`} />

          {/* Night Himalayan Stars */}
          <g fill="#E2ECFF" opacity="0.65">
            <circle cx="95" cy="64" r="1.2" />
            <circle cx="176" cy="92" r="0.9" />
            <circle cx="248" cy="48" r="1.3" />
            <circle cx="342" cy="74" r="0.9" />
            <circle cx="436" cy="56" r="1.4" />
            <circle cx="548" cy="82" r="1.0" />
            <circle cx="628" cy="44" r="1.2" />
            <circle cx="718" cy="88" r="1.1" />
          </g>

          {/* Far Snow-Capped Garhwal Peaks */}
          <path
            d="M0 315 L75 235 L150 272 L248 175 L330 240 L432 148 L534 232 L630 165 L728 242 L800 198 L800 560 L0 560 Z"
            fill={p.farRidge}
          />
          <path
            d="M248 175 L284 208 L244 212 Z M432 148 L475 188 L434 190 Z M630 165 L668 198 L630 202 Z"
            fill="#E0F2FE"
            opacity="0.34"
          />

          {/* Drifting Winterline Cloud Sea */}
          <g className="animate-mussoorie-cloud" filter={`url(#${uid}-softblur)`}>
            <ellipse cx="250" cy="298" rx="280" ry="26" fill={`url(#${uid}-mist)`} />
            <ellipse cx="580" cy="316" rx="260" ry="22" fill={`url(#${uid}-mist)`} />
          </g>

          {/* Mid Mussoorie Spur */}
          <path
            d="M0 360 Q145 302 295 344 T585 322 T800 350 L800 560 L0 560 Z"
            fill={p.midRidge}
          />

          {/* Shimmering Doon Valley Foothill Lights */}
          <g>
            {valleyLights.map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy + 36}
                r={idx % 3 === 0 ? 1.8 : 1.2}
                fill={idx % 2 === 0 ? '#93C5FD' : '#FDE68A'}
                opacity={0.55 + (idx % 4) * 0.1}
              />
            ))}
          </g>

          {/* Architectural CloudCrest Pavilion Exterior on Hero */}
          {variant === 'hero' && (
            <g>
              {/* Soft Pavilion Blue-Hour Glow */}
              <ellipse
                cx="400"
                cy="365"
                rx="230"
                ry="56"
                fill="#2563EB"
                opacity="0.28"
                filter={`url(#${uid}-glowblur)`}
              />
              {/* Cantilevered Roof Eaves */}
              <polygon
                points="146,315 400,256 654,315 636,323 164,323"
                fill="#0B1324"
                stroke="#60A5FA"
                strokeOpacity="0.65"
                strokeWidth="1.5"
              />
              {/* Stone & Slate Pavilion Core */}
              <rect x="184" y="322" width="432" height="92" fill="#060A13" />
              {/* Glowing Panoramic Suite Glass Windows */}
              <rect x="206" y="332" width="118" height="72" fill="#1E3A8A" opacity="0.55" />
              <rect x="210" y="336" width="110" height="64" fill="#93C5FD" opacity="0.38" />
              <rect x="338" y="332" width="124" height="72" fill="#1E3A8A" opacity="0.65" />
              <rect x="342" y="336" width="116" height="64" fill="#DBEAFE" opacity="0.46" />
              <rect x="476" y="332" width="118" height="72" fill="#1E3A8A" opacity="0.55" />
              <rect x="480" y="336" width="110" height="64" fill="#93C5FD" opacity="0.38" />
              {/* Warm Interior Silhouettes Inside Suite Glass */}
              <rect x="368" y="374" width="64" height="22" rx="3" fill="#060A13" opacity="0.65" />
              <circle cx="265" cy="355" r="9" fill="#FDE68A" opacity="0.55" filter={`url(#${uid}-softblur)`} />
              <circle cx="535" cy="355" r="9" fill="#FDE68A" opacity="0.55" filter={`url(#${uid}-softblur)`} />
              {/* Glass Mullions */}
              <line x1="265" y1="332" x2="265" y2="404" stroke="#05070B" strokeWidth="3" />
              <line x1="400" y1="332" x2="400" y2="404" stroke="#05070B" strokeWidth="3" />
              <line x1="535" y1="332" x2="535" y2="404" stroke="#05070B" strokeWidth="3" />
              {/* Cantilevered Slate Deck Edge */}
              <rect x="150" y="408" width="500" height="12" rx="2" fill="#0F1C36" stroke="#3B82F6" strokeOpacity="0.45" />
            </g>
          )}

          {/* Foreground Mussoorie Deodar Silhouettes */}
          <g fill={p.nearRidge}>
            <path d="M0 448 Q200 412 400 444 T800 432 L800 560 L0 560 Z" />
            <polygon points="36,520 72,330 108,520" />
            <polygon points="88,525 120,368 152,525" />
            <polygon points="650,525 684,358 718,525" />
            <polygon points="706,520 742,324 778,520" />
          </g>

          <g className="animate-mussoorie-mist-slow" filter={`url(#${uid}-softblur)`}>
            <ellipse cx="400" cy="462" rx="380" ry="30" fill={`url(#${uid}-mist)`} />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Cantilevered terrace / plunge deck perspective
  if (perspective === 'scenic-terrace') {
    return (
      <div
        role="img"
        aria-label={`${title} — Cantilevered Mussoorie terrace view`}
        className={`relative overflow-hidden bg-[#04060A] ${className}`}
      >
        <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.skyTop} />
              <stop offset="55%" stopColor={p.skyMid} />
              <stop offset="100%" stopColor={p.skyBottom} />
            </linearGradient>
            <radialGradient id={`${uid}-fire`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.72" />
              <stop offset="55%" stopColor={p.accent} stopOpacity="0.28" />
              <stop offset="100%" stopColor={p.wallDark} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${uid}-deck`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.wallMid} />
              <stop offset="100%" stopColor="#030508" />
            </linearGradient>
            <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E2ECFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#E2ECFF" stopOpacity="0" />
            </linearGradient>
            <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          <rect width="800" height="560" fill={`url(#${uid}-sky)`} />
          <path
            d="M0 245 L140 160 L260 202 L400 112 L540 188 L675 125 L800 172 L800 410 L0 410 Z"
            fill={p.farRidge}
          />
          <g className="animate-mussoorie-cloud" filter={`url(#${uid}-blur)`}>
            <ellipse cx="240" cy="272" rx="280" ry="22" fill={`url(#${uid}-mist)`} />
            <ellipse cx="590" cy="290" rx="250" ry="20" fill={`url(#${uid}-mist)`} />
          </g>
          <path d="M0 315 Q220 272 430 302 T800 292 L800 420 L0 420 Z" fill={p.midRidge} />

          {/* Doon Valley Lights Visible Beyond Glass Balustrade */}
          <g>
            {valleyLights.slice(0, 12).map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy + 20} r="1.4" fill="#93C5FD" opacity="0.65" />
            ))}
          </g>

          {/* Frameless Glass Balcony Railing */}
          <rect
            x="32"
            y="314"
            width="736"
            height="68"
            fill="#60A5FA"
            fillOpacity="0.09"
            stroke="#60A5FA"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <line x1="215" y1="314" x2="215" y2="382" stroke={p.timber} strokeWidth="4" />
          <line x1="400" y1="314" x2="400" y2="382" stroke={p.timber} strokeWidth="4" />
          <line x1="585" y1="314" x2="585" y2="382" stroke={p.timber} strokeWidth="4" />

          {/* Perspective Slate Deck */}
          <polygon points="0,382 800,382 800,560 0,560" fill={`url(#${uid}-deck)`} />
          <g stroke={p.accent} strokeOpacity="0.14" strokeWidth="1.2">
            <line x1="120" y1="382" x2="0" y2="560" />
            <line x1="300" y1="382" x2="220" y2="560" />
            <line x1="500" y1="382" x2="580" y2="560" />
            <line x1="680" y1="382" x2="800" y2="560" />
            <line x1="0" y1="435" x2="800" y2="435" />
            <line x1="0" y1="498" x2="800" y2="498" />
          </g>

          {/* Lounge Armchairs & Recessed Sapphire Brazier */}
          <rect x="128" y="388" width="142" height="72" rx="8" fill={p.wallDark} stroke={p.accent} strokeOpacity="0.28" />
          <rect x="140" y="376" width="118" height="28" rx="6" fill={p.linen} />
          <rect x="148" y="408" width="102" height="24" rx="4" fill={p.throwBlue} opacity="0.88" />

          <rect x="530" y="388" width="142" height="72" rx="8" fill={p.wallDark} stroke={p.accent} strokeOpacity="0.28" />
          <rect x="542" y="376" width="118" height="28" rx="6" fill={p.linen} />
          <rect x="550" y="408" width="102" height="24" rx="4" fill={p.throwBlue} opacity="0.88" />

          <circle cx="400" cy="438" r="88" fill={`url(#${uid}-fire)`} filter={`url(#${uid}-blur)`} />
          <ellipse cx="400" cy="458" rx="68" ry="18" fill={p.wallDark} stroke={p.accent} strokeOpacity="0.65" strokeWidth="1.5" />
          <ellipse cx="400" cy="454" rx="30" ry="8" fill="#93C5FD" opacity="0.9" />
        </svg>
      </div>
    );
  }

  // 3. Limestone / slate bath & spa sanctuary perspective
  if (perspective === 'bath-sanctuary') {
    return (
      <div
        role="img"
        aria-label={`${title} — Private Himalayan bath sanctuary`}
        className={`relative overflow-hidden bg-[#04060A] ${className}`}
      >
        <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.skyTop} />
              <stop offset="100%" stopColor={p.skyBottom} />
            </linearGradient>
            <radialGradient id={`${uid}-lantern`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.68" />
              <stop offset="60%" stopColor="#2563EB" stopOpacity="0.2" />
              <stop offset="100%" stopColor={p.wallDark} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <filter id={`${uid}-blur`} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <rect width="800" height="560" fill={p.wallDark} />
          {/* Tall Panoramic Forest Picture Window */}
          <rect
            x="84"
            y="44"
            width="632"
            height="308"
            fill={`url(#${uid}-sky)`}
            stroke={p.timber}
            strokeWidth="7"
          />
          <path d="M84 275 Q240 225 420 260 T716 240 L716 352 L84 352 Z" fill={p.midRidge} />
          <g fill={p.nearRidge}>
            <polygon points="145,352 182,165 219,352" />
            <polygon points="222,352 254,202 286,352" />
            <polygon points="554,352 590,175 626,352" />
            <polygon points="632,352 664,216 696,352" />
          </g>

          {/* Architectural Slate Floor */}
          <polygon points="0,352 800,352 800,560 0,560" fill={p.wallMid} />
          <line x1="0" y1="425" x2="800" y2="425" stroke="#04060A" strokeOpacity="0.55" strokeWidth="2" />
          <line x1="0" y1="495" x2="800" y2="495" stroke="#04060A" strokeOpacity="0.55" strokeWidth="2" />

          {/* Monolithic Carved Black Granite Soaking Tub */}
          <rect
            x="198"
            y="344"
            width="404"
            height="138"
            rx="38"
            fill="#070C17"
            stroke="#60A5FA"
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          <ellipse cx="400" cy="364" rx="176" ry="22" fill={`url(#${uid}-water)`} opacity="0.92" />
          <ellipse cx="400" cy="364" rx="142" ry="12" fill="#93C5FD" opacity="0.22" />
          {/* Gentle Steam Wisps */}
          <g className="animate-mussoorie-mist-slow" filter={`url(#${uid}-blur)`}>
            <ellipse cx="360" cy="336" rx="95" ry="16" fill="#DBEAFE" opacity="0.24" />
            <ellipse cx="445" cy="328" rx="85" ry="14" fill="#93C5FD" opacity="0.2" />
          </g>

          {/* Ambient Wall Sconces */}
          <circle cx="140" cy="340" r="68" fill={`url(#${uid}-lantern)`} filter={`url(#${uid}-blur)`} />
          <rect x="134" y="324" width="12" height="28" rx="2" fill="#DBEAFE" />
          <circle cx="660" cy="340" r="68" fill={`url(#${uid}-lantern)`} filter={`url(#${uid}-blur)`} />
          <rect x="654" y="324" width="12" height="28" rx="2" fill="#DBEAFE" />
        </svg>
      </div>
    );
  }

  // 4. Primary Suite Interior Bedroom Perspective (Distinct Architectural Compositions)
  return (
    <div
      role="img"
      aria-label={`${title} — Mussoorie sanctuary interior suite view`}
      className={`relative overflow-hidden bg-[#04060A] ${className}`}
    >
      <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.skyTop} />
            <stop offset="52%" stopColor={p.skyMid} />
            <stop offset="100%" stopColor={p.skyBottom} />
          </linearGradient>
          <radialGradient id={`${uid}-lamp`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.72" />
            <stop offset="45%" stopColor={p.accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={p.wallDark} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-warm-lamp`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.58" />
            <stop offset="45%" stopColor="#60A5FA" stopOpacity="0.24" />
            <stop offset="100%" stopColor={p.wallDark} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E2ECFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#93C5FD" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#E2ECFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.wallMid} />
            <stop offset="100%" stopColor="#030509" />
          </linearGradient>
          <linearGradient id={`${uid}-duvet`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <filter id={`${uid}-soft`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Panoramic Doon Valley & Mussoorie Ridge Picture Window */}
        <rect x="64" y="46" width="672" height="314" fill={`url(#${uid}-sky)`} />
        <path
          d="M64 252 L152 182 L232 214 L334 132 L422 188 L528 118 L628 184 L736 146 L736 360 L64 360 Z"
          fill={p.farRidge}
        />
        <g className="animate-mussoorie-cloud" filter={`url(#${uid}-soft)`}>
          <ellipse cx="290" cy="238" rx="220" ry="20" fill={`url(#${uid}-mist)`} />
          <ellipse cx="560" cy="252" rx="190" ry="18" fill={`url(#${uid}-mist)`} />
        </g>
        <path
          d="M64 295 Q210 250 385 282 T736 270 L736 360 L64 360 Z"
          fill={p.midRidge}
        />

        {/* Twinkling Doon Valley Foothill Lights Outside Suite Window */}
        <g>
          {valleyLights.map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={idx % 3 === 0 ? 1.5 : 1.0}
              fill={idx % 2 === 0 ? '#93C5FD' : '#FDE68A'}
              opacity={0.55 + (idx % 3) * 0.14}
            />
          ))}
        </g>

        {/* Architectural Ceiling & Side Framing */}
        <polygon points="0,0 800,0 736,46 64,46" fill={p.wallDark} />
        <rect x="0" y="0" width="64" height="560" fill={p.wallDark} />
        <rect x="736" y="0" width="64" height="560" fill={p.wallDark} />

        {/* Recessed Blue-Hour Cove Lighting Strips Along Ceiling */}
        <line x1="72" y1="45" x2="728" y2="45" stroke="#60A5FA" strokeOpacity="0.65" strokeWidth="2.5" />
        <line x1="160" y1="0" x2="195" y2="46" stroke={p.accent} strokeOpacity="0.34" strokeWidth="2.5" />
        <line x1="400" y1="0" x2="400" y2="46" stroke={p.accent} strokeOpacity="0.34" strokeWidth="2.5" />
        <line x1="640" y1="0" x2="605" y2="46" stroke={p.accent} strokeOpacity="0.34" strokeWidth="2.5" />

        {/* Slim Matte-Black Window Mullions */}
        <rect x="64" y="46" width="672" height="314" fill="none" stroke={p.timber} strokeWidth="6" />
        <line x1="288" y1="46" x2="288" y2="360" stroke="#050811" strokeWidth="5" />
        <line x1="512" y1="46" x2="512" y2="360" stroke="#050811" strokeWidth="5" />

        {/* Perspective Slate & Timber Flooring */}
        <polygon points="64,360 736,360 800,560 0,560" fill={`url(#${uid}-floor)`} />
        <g stroke="#3B82F6" strokeOpacity="0.1" strokeWidth="1">
          <line x1="160" y1="360" x2="70" y2="560" />
          <line x1="320" y1="360" x2="275" y2="560" />
          <line x1="480" y1="360" x2="525" y2="560" />
          <line x1="640" y1="360" x2="730" y2="560" />
        </g>

        {/* Suite-Specific Architectural Interiors */}
        {variant === 'benog-plunge' ? (
          /* Heated Indoor-Outdoor Slate Plunge Pool & Daybed */
          <g>
            <polygon
              points="102,374 498,374 538,480 70,480"
              fill="#0F2A56"
              stroke="#60A5FA"
              strokeOpacity="0.6"
              strokeWidth="2"
            />
            <polygon points="116,386 486,386 518,468 86,468" fill="#1D4ED8" opacity="0.48" />
            <line x1="145" y1="414" x2="395" y2="414" stroke="#93C5FD" strokeOpacity="0.65" strokeWidth="2" />
            <line x1="215" y1="444" x2="465" y2="444" stroke="#F8FAFC" strokeOpacity="0.28" strokeWidth="1.5" />
            {/* Cliffside Daybed */}
            <rect x="556" y="388" width="146" height="68" rx="6" fill={p.timber} />
            <rect x="566" y="376" width="126" height="24" rx="5" fill={p.linen} />
            <rect x="576" y="394" width="106" height="16" rx="3" fill={p.throwBlue} />
            <circle cx="536" cy="356" r="52" fill={`url(#${uid}-warm-lamp)`} filter={`url(#${uid}-soft)`} />
            <rect x="530" y="340" width="12" height="42" rx="2" fill="#93C5FD" />
          </g>
        ) : variant === 'camels-back' ? (
          /* Signature Honeymoon Round Bed + Canopy Illumination (Inspired by Honeymoon Inn Mussoorie) */
          <g>
            {/* Subtle Ceiling Canopy Ring Above Round Bed */}
            <ellipse
              cx="400"
              cy="195"
              rx="124"
              ry="14"
              fill="none"
              stroke="#60A5FA"
              strokeOpacity="0.48"
              strokeWidth="2"
            />
            <path
              d="M276 195 Q255 280 238 355 M524 195 Q545 280 562 355"
              fill="none"
              stroke="#DBEAFE"
              strokeOpacity="0.22"
              strokeWidth="12"
            />
            {/* Circular Plinth & Round Mattress */}
            <ellipse cx="400" cy="434" rx="188" ry="56" fill="#070D1B" stroke="#3B82F6" strokeOpacity="0.48" strokeWidth="2" />
            <ellipse cx="400" cy="414" rx="172" ry="48" fill={`url(#${uid}-duvet)`} />
            <path
              d="M242 426 Q400 470 558 426 Q530 456 400 462 Q270 456 242 426 Z"
              fill={p.throwBlue}
              opacity="0.92"
            />
            {/* Plush Round-Bed Pillows */}
            <rect x="292" y="366" width="96" height="28" rx="8" fill="#E2E8F0" />
            <rect x="412" y="366" width="96" height="28" rx="8" fill="#E2E8F0" />
            <rect x="364" y="376" width="72" height="20" rx="6" fill="#2563EB" opacity="0.85" />
            {/* Warm Sconces */}
            <circle cx="176" cy="320" r="60" fill={`url(#${uid}-warm-lamp)`} filter={`url(#${uid}-soft)`} />
            <rect x="170" y="306" width="12" height="24" rx="2" fill="#FDE68A" />
            <circle cx="624" cy="320" r="60" fill={`url(#${uid}-warm-lamp)`} filter={`url(#${uid}-soft)`} />
            <rect x="618" y="306" width="12" height="24" rx="2" fill="#FDE68A" />
          </g>
        ) : variant === 'lal-tibba-observatory' ? (
          /* Vaulted Observatory Suite with Refracting Telescope & Walnut King Bed */
          <g>
            {/* Fluted Walnut Headboard */}
            <rect x="134" y="274" width="336" height="86" rx="4" fill={p.wallDark} stroke="#60A5FA" strokeOpacity="0.42" />
            <rect x="144" y="352" width="316" height="118" rx="6" fill={p.timber} />
            <rect x="158" y="334" width="288" height="78" rx="6" fill={`url(#${uid}-duvet)`} />
            <rect x="172" y="316" width="116" height="32" rx="6" fill="#E2E8F0" />
            <rect x="308" y="316" width="116" height="32" rx="6" fill="#E2E8F0" />
            <rect x="158" y="392" width="288" height="44" fill={p.throwBlue} opacity="0.92" />
            {/* Brass & Obsidian Refracting Telescope */}
            <line x1="588" y1="274" x2="660" y2="238" stroke="#93C5FD" strokeWidth="7" strokeLinecap="round" />
            <line x1="624" y1="258" x2="590" y2="418" stroke="#60A5FA" strokeWidth="2.5" />
            <line x1="624" y1="258" x2="658" y2="418" stroke="#60A5FA" strokeWidth="2.5" />
            <circle cx="114" cy="310" r="64" fill={`url(#${uid}-warm-lamp)`} filter={`url(#${uid}-soft)`} />
            <rect x="107" y="294" width="14" height="22" rx="2" fill="#DBEAFE" />
          </g>
        ) : (
          /* Fluted Timber King / Heritage Manor Suite */
          <g>
            {/* Heritage Four-Poster Columns for Barlowganj Manor */}
            {variant === 'barlowganj-manor' && (
              <g stroke={p.timber} strokeWidth="7">
                <line x1="212" y1="158" x2="212" y2="470" />
                <line x1="588" y1="158" x2="588" y2="470" />
                <line x1="212" y1="158" x2="588" y2="158" stroke="#60A5FA" strokeOpacity="0.45" strokeWidth="4" />
              </g>
            )}

            {/* Backlit Fluted Cedar Headboard */}
            <rect
              x="212"
              y="280"
              width="376"
              height="94"
              rx="4"
              fill={p.wallDark}
              stroke="#60A5FA"
              strokeOpacity="0.45"
            />
            {[240, 272, 304, 336, 368, 400, 432, 464, 496, 528, 560].map((x) => (
              <line key={x} x1={x} y1="284" x2={x} y2="365" stroke="#1E3A8A" strokeOpacity="0.42" strokeWidth="1.5" />
            ))}

            {/* Plush King Bed & Midnight Sapphire Runner */}
            <rect x="196" y="365" width="408" height="114" rx="6" fill={p.timber} />
            <rect x="212" y="344" width="376" height="96" rx="5" fill={`url(#${uid}-duvet)`} />
            <rect x="234" y="320" width="146" height="36" rx="6" fill="#E2E8F0" />
            <rect x="420" y="320" width="146" height="36" rx="6" fill="#E2E8F0" />
            <rect x="212" y="406" width="376" height="46" fill={p.throwBlue} opacity="0.94" />
            <line x1="212" y1="406" x2="588" y2="406" stroke="#93C5FD" strokeOpacity="0.65" strokeWidth="1.5" />

            {/* Dual Architectural Bedside Tables & Warm Glowing Sconces */}
            <circle cx="152" cy="312" r="64" fill={`url(#${uid}-warm-lamp)`} filter={`url(#${uid}-soft)`} />
            <rect x="145" y="298" width="14" height="24" rx="2" fill="#FDE68A" />
            <rect x="128" y="375" width="52" height="58" rx="3" fill={p.wallDark} stroke="#3B82F6" strokeOpacity="0.25" />

            <circle cx="648" cy="312" r="64" fill={`url(#${uid}-warm-lamp)`} filter={`url(#${uid}-soft)`} />
            <rect x="641" y="298" width="14" height="24" rx="2" fill="#FDE68A" />
            <rect x="620" y="375" width="52" height="58" rx="3" fill={p.wallDark} stroke="#3B82F6" strokeOpacity="0.25" />
          </g>
        )}

        {/* Ambient Glass Sheen & Atmospheric Mist */}
        <g className="animate-mussoorie-mist-slow" opacity="0.48" filter={`url(#${uid}-soft)`}>
          <ellipse cx="400" cy="312" rx="290" ry="18" fill={`url(#${uid}-mist)`} />
        </g>
      </svg>
    </div>
  );
};
