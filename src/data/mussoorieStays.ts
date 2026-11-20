export type SanctuaryWing = 'Ridge Suites' | 'Private Villas' | 'Heritage Wing';

export type SceneVariant =
  | 'landour-cedar'
  | 'camels-back'
  | 'benog-plunge'
  | 'lal-tibba-observatory'
  | 'hathipaon-glasshouse'
  | 'barlowganj-manor';

export type GalleryPerspective =
  | 'interior-bedroom'
  | 'scenic-terrace'
  | 'bath-sanctuary'
  | 'valley-vista';

export interface SanctuaryGalleryFrame {
  id: string;
  title: string;
  caption: string;
  perspective: GalleryPerspective;
  imageUrl?: string;
}

export interface MussoorieSanctuary {
  id: string;
  name: string;
  wing: SanctuaryWing;
  bedConfiguration: string;
  location: string;
  elevationMeters: number;
  coordinates: string;
  ratePerNight: number;
  maxGuests: number;
  bedrooms: number;
  areaSqFt: number;
  orientation: string;
  summary: string;
  architecturalNote: string;
  amenities: string[];
  sceneVariant: SceneVariant;
  imageUrl?: string;
  gallery: SanctuaryGalleryFrame[];
  featured?: boolean;
}

export const MUSSOORIE_SANCTUARIES: MussoorieSanctuary[] = [
  {
    id: 'landour-cedar-pavilion',
    name: 'The Landour Cedar Pavilion',
    wing: 'Ridge Suites',
    bedConfiguration: 'King Canopy · Doon Valley View',
    location: 'Landour Cantt Spur',
    elevationMeters: 2180,
    coordinates: '30.4598° N, 78.0844° E',
    ratePerNight: 1850,
    maxGuests: 4,
    bedrooms: 2,
    areaSqFt: 1620,
    orientation: 'North-East Himalayan Crest',
    featured: true,
    summary:
      'Hand-hewn deodar cedar paneling, floor-to-ceiling Doon Valley picture windows, and triple-glazed mist balconies above quiet Landour pine slopes.',
    architecturalNote:
      'Constructed with dry-stacked Garhwal slate, warm convector climate control, and reclaimed Burmese teak joinery framing drifting monsoon and winterline clouds.',
    amenities: [
      'Panoramic Doon Valley Bay Windows',
      'Heated Cantilevered Mist Veranda',
      '24-Hour In-Room Ridge Service & Tea Bar',
      'Deep Stone Soaking Tub with Cedar Infusion',
      'Convector Heating & Stargazing Deck',
    ],
    sceneVariant: 'landour-cedar',
    gallery: [
      {
        id: 'lcp-1',
        title: 'Master Cedar Bedroom',
        caption: 'Floor-to-ceiling ridge windows framing upper Landour deodars and soft morning mist.',
        perspective: 'interior-bedroom',
      },
      {
        id: 'lcp-2',
        title: 'Cantilevered Mist Veranda',
        caption: 'Heated slate balcony suspended above drifting Garhwal valley clouds.',
        perspective: 'scenic-terrace',
      },
      {
        id: 'lcp-3',
        title: 'Cedar-Infused Stone Bath',
        caption: 'Hand-carved black granite soaking tub overlooking private forest canopy.',
        perspective: 'bath-sanctuary',
      },
      {
        id: 'lcp-4',
        title: 'North-East Snowline Vista',
        caption: 'Unobstructed 2,180 m sightline toward Bandarpoonch and Swargarohini.',
        perspective: 'valley-vista',
      },
    ],
  },
  {
    id: 'benog-mist-pool-villa',
    name: 'Benog Mist Infinity Villa',
    wing: 'Private Villas',
    bedConfiguration: '3 King Suites · Heated Plunge Deck',
    location: 'Benog Sanctuary Edge',
    elevationMeters: 2120,
    coordinates: '30.4572° N, 78.0218° E',
    ratePerNight: 3000,
    maxGuests: 6,
    bedrooms: 3,
    areaSqFt: 2850,
    orientation: 'West Sunset & Valley Gorge',
    featured: true,
    summary:
      'An isolated cliffside residence featuring a heated dark-slate plunge pool suspended above the undulating clouds of the Benog wildlife valley.',
    architecturalNote:
      'Anchored into natural quartzite bedrock with recessed blue-hour architectural lighting so dusk gatherings preserve the nocturnal stillness of the sanctuary.',
    amenities: [
      'Temperature-Controlled Slate Plunge Pool',
      'Private Cedar Sauna & Rain Pavilion',
      'Dedicated Chef-on-Call & Mini Refrigerator',
      'Acoustic Lounge & High-Speed Ridge Wi-Fi',
      'Chauffeured Land Rover Ridge Transfers',
    ],
    sceneVariant: 'benog-plunge',
    gallery: [
      {
        id: 'bmp-1',
        title: 'Heated Slate Plunge Deck',
        caption: 'Private cliffside pool warmed to 34°C above the Benog valley mist.',
        perspective: 'interior-bedroom',
      },
      {
        id: 'bmp-2',
        title: 'Blue-Hour Cliffside Lounge',
        caption: 'Open-air stone terrace with recessed fire brazier facing the gorge.',
        perspective: 'scenic-terrace',
      },
      {
        id: 'bmp-3',
        title: 'Rain Pavilion & Cedar Bath',
        caption: 'Indoor-outdoor limestone soaking sanctuary beside mountain pines.',
        perspective: 'bath-sanctuary',
      },
      {
        id: 'bmp-4',
        title: 'Benog Wildlife Valley Panorama',
        caption: 'Protected sanctuary ridge stretching west toward Aglar River valley.',
        perspective: 'valley-vista',
      },
    ],
  },
  {
    id: 'lal-tibba-observatory-penthouse',
    name: 'Lal Tibba Observatory Penthouse',
    wing: 'Ridge Suites',
    bedConfiguration: '2 King Suites · Skylight Crown',
    location: 'Lal Tibba Crown',
    elevationMeters: 2275,
    coordinates: '30.4649° N, 78.0936° E',
    ratePerNight: 2500,
    maxGuests: 4,
    bedrooms: 2,
    areaSqFt: 1940,
    orientation: '270° Snowline Panorama',
    summary:
      'Perched at Mussoorie’s highest vantage point, offering unobstructed morning sightlines toward Bandarpoonch, Kedarnath, and Gangotri peaks.',
    architecturalNote:
      'Double-height vaulted timber ceiling paired with a motorized skylight above the primary bed for clear Himalayan winter skies.',
    amenities: [
      'Refracting Observatory Telescope Terrace',
      'Private Library of Himalayan First Editions',
      'Radiant Heated Limestone Flooring',
      'Artisanal Garhwali Tea & Espresso Bar',
      'Private Yoga & Breathwork Conservatory',
    ],
    sceneVariant: 'lal-tibba-observatory',
    gallery: [
      {
        id: 'lto-1',
        title: 'Observatory Primary Suite',
        caption: 'Refracting telescope alcove framed by vaulted walnut timber beams.',
        perspective: 'interior-bedroom',
      },
      {
        id: 'lto-2',
        title: 'Stargazing Crown Terrace',
        caption: '2,275 m private sky deck built for winterline dusk and astrophotography.',
        perspective: 'scenic-terrace',
      },
      {
        id: 'lto-3',
        title: 'Radiant Limestone Bath',
        caption: 'Heated stone floors and panoramic frosted ridge glazing.',
        perspective: 'bath-sanctuary',
      },
      {
        id: 'lto-4',
        title: '270° Garhwal Snowline',
        caption: 'Crystal dawn horizon spanning Kedarnath, Gangotri, and Badrinath.',
        perspective: 'valley-vista',
      },
    ],
  },
  {
    id: 'camels-back-ridge-suite',
    name: 'Camel’s Back Winterline Suite',
    wing: 'Ridge Suites',
    bedConfiguration: 'Signature Round Bed · Couple Sanctuary',
    location: 'Camel’s Back Promenade',
    elevationMeters: 2045,
    coordinates: '30.4561° N, 78.0672° E',
    ratePerNight: 1500,
    maxGuests: 2,
    bedrooms: 1,
    areaSqFt: 1120,
    orientation: 'North-West Winterline Horizon',
    summary:
      'A romantic couples chamber featuring a signature round bed and sweeping curved bay windows oriented toward the Doon Valley and Mussoorie winterline glow.',
    architecturalNote:
      'Intimate midnight-slate alcove proportions with curved acoustic walls, warm ambient sconces, and direct access to Camel’s Back promenade.',
    amenities: [
      'Signature Round Bed & Valley Bay Lounge',
      'Deep Limestone Immersion Bath',
      'Evening Hearth Turndown & Convector Heat',
      'Direct Access to Camel’s Back Trail',
      'In-Room Espresso, Tea Bar & Electronic Safe',
    ],
    sceneVariant: 'camels-back',
    gallery: [
      {
        id: 'cbr-1',
        title: 'Winterline Round-Bed Chamber',
        caption: 'Signature circular platform bed wrapped in midnight-blue drapery facing the west valley.',
        perspective: 'interior-bedroom',
      },
      {
        id: 'cbr-2',
        title: 'Twilight Bay Veranda',
        caption: 'Private two-seat balcony positioned directly above Camel’s Back trail.',
        perspective: 'scenic-terrace',
      },
      {
        id: 'cbr-3',
        title: 'Limestone Immersion Alcove',
        caption: 'Deep soaking bath with botanical mountain apothecary infusions.',
        perspective: 'bath-sanctuary',
      },
      {
        id: 'cbr-4',
        title: 'Camel’s Back Sunset Line',
        caption: 'Mussoorie’s rare false-horizon glow illuminating lower cloud banks and Doon Valley.',
        perspective: 'valley-vista',
      },
    ],
  },
  {
    id: 'hathipaon-pine-glasshouse',
    name: 'Hathipaon Deodar Glasshouse',
    wing: 'Private Villas',
    bedConfiguration: '3 Double Suites · 360° Forest Glass',
    location: 'Hathipaon Forest Reserve',
    elevationMeters: 2150,
    coordinates: '30.4535° N, 78.0341° E',
    ratePerNight: 2750,
    maxGuests: 6,
    bedrooms: 3,
    areaSqFt: 2480,
    orientation: '360° Old-Growth Cedar Canopy',
    summary:
      'A serene architectural pavilion enveloped on all sides by century-old deodar and Himalayan oak groves near George Everest Estate.',
    architecturalNote:
      'Slender matte-black steel columns support hovering timber eaves, allowing mist to drift effortlessly beneath the veranda deck.',
    amenities: [
      'Wrap-Around Canopy Forest Deck',
      'Outdoor Slate Firepit Courtyard',
      'Private Botanical Apothecary Bath',
      'Guided Dawn Birding Naturalist Walk',
      'In-Villa Sommelier Cellar & Mini Bar',
    ],
    sceneVariant: 'hathipaon-glasshouse',
    gallery: [
      {
        id: 'hpg-1',
        title: 'Glasshouse Forest Suite',
        caption: 'Matte-black steel mullions surrounded 360° by century-old deodars.',
        perspective: 'interior-bedroom',
      },
      {
        id: 'hpg-2',
        title: 'Canopy Wrap-Around Deck',
        caption: 'Elevated timber walkway hovering directly inside the pine mist line.',
        perspective: 'scenic-terrace',
      },
      {
        id: 'hpg-3',
        title: 'Botanical Forest Bath',
        caption: 'Floor-to-ceiling woodland glass beside a sunken basalt soaking basin.',
        perspective: 'bath-sanctuary',
      },
      {
        id: 'hpg-4',
        title: 'Hathipaon & George Everest Ridge',
        caption: 'Sweeping cloud formations rolling past Sir George Everest’s spur.',
        perspective: 'valley-vista',
      },
    ],
  },
  {
    id: 'barlowganj-heritage-manor',
    name: 'Barlowganj 1924 Heritage Manor',
    wing: 'Heritage Wing',
    bedConfiguration: '2 Queen + 2 King · Family Estate',
    location: 'Barlowganj Crest',
    elevationMeters: 1960,
    coordinates: '30.4392° N, 78.0819° E',
    ratePerNight: 2200,
    maxGuests: 8,
    bedrooms: 4,
    areaSqFt: 3200,
    orientation: 'Doon Valley & Foothill Lights',
    summary:
      'A faithfully restored 1924 colonial stone manor tailored for families, overlooking terraced slopes and the evening lights of the Doon Valley below.',
    architecturalNote:
      'Original lime-mortar stone masonry, tall French casements, and restored cast-iron fireplaces harmonized with silent modern climate control.',
    amenities: [
      '4 En-Suite Family Heritage Chambers',
      'Private Conservatory Dining Hall',
      'Manicured Rhododendron Lawn',
      'Dedicated Estate Host & Chauffeur',
      'Bespoke Tasting Menu by Executive Chef',
    ],
    sceneVariant: 'barlowganj-manor',
    gallery: [
      {
        id: 'bhm-1',
        title: '1924 Manor Principal Suite',
        caption: 'Restored lime-mortar stonework, tall casements, and bespoke teak four-poster framing.',
        perspective: 'interior-bedroom',
      },
      {
        id: 'bhm-2',
        title: 'Rhododendron Stone Veranda',
        caption: 'Evening tea terrace looking down across terraced Mussoorie foothills.',
        perspective: 'scenic-terrace',
      },
      {
        id: 'bhm-3',
        title: 'Heritage Cast-Iron & Slate Bath',
        caption: 'Deep freestanding tub beneath arched colonial skylight windows.',
        perspective: 'bath-sanctuary',
      },
      {
        id: 'bhm-4',
        title: 'Doon Valley Nocturnal Lights',
        caption: 'Panoramic evening vista from Barlowganj Crest over the shimmering valley.',
        perspective: 'valley-vista',
      },
    ],
  },
];

export interface MussoorieLandmark {
  id: string;
  name: string;
  elevation: string;
  distanceNote: string;
  microClimate: string;
  description: string;
}

export const MUSSOORIE_LANDMARKS: MussoorieLandmark[] = [
  {
    id: 'lal-tibba',
    name: 'Lal Tibba Ridge',
    elevation: '2,275 m',
    distanceNote: '6 min ridge drive',
    microClimate: 'Crisp Alpine · Clear Dawn Sightlines',
    description:
      'The crown of Landour where early-morning clouds part to reveal a 300-kilometer arc of snow-laden Garhwal peaks.',
  },
  {
    id: 'camels-back',
    name: 'Camel’s Back Promenade',
    elevation: '2,045 m',
    distanceNote: '4 min forest walk',
    microClimate: 'Twilight Mist · Winterline Horizon',
    description:
      'A serene 3-kilometer heritage bridle path skirting ancient limestone outcrops and rhododendron thickets.',
  },
  {
    id: 'george-everest',
    name: 'George Everest Observatory',
    elevation: '2,105 m',
    distanceNote: '14 min estate trail',
    microClimate: 'High Winds · Dramatic Cloud Sea',
    description:
      'Sir George Everest’s 1832 survey laboratory overlooking the Aglar River valley and uninterrupted Himalayan ridges.',
  },
  {
    id: 'benog-sanctuary',
    name: 'Benog Wildlife Sanctuary',
    elevation: '2,120 m',
    distanceNote: '11 min private trailhead',
    microClimate: 'Deodar Canopy · Deep Acoustic Stillness',
    description:
      'Protected cedar and pine reserve home to Himalayan whistling thrushes, mountain quail, and mist-shrouded trails.',
  },
];

export interface MussoorieExperience {
  number: string;
  title: string;
  timing: string;
  summary: string;
}

export const MUSSOORIE_EXPERIENCES: MussoorieExperience[] = [
  {
    number: '01.',
    title: 'Winterline Twilight Aperitif',
    timing: '17:15 – 18:45 · Ridge Terrace',
    summary:
      'Witness Mussoorie’s rare atmospheric false horizon over cedar-smoked infusions and roasted Pahadi small plates beside sapphire-lit stone braziers.',
  },
  {
    number: '02.',
    title: 'Landour Dawn Forest Immersion',
    timing: '06:30 – 08:30 · Jabarkhet & Benog',
    summary:
      'Guided by our resident Himalayan naturalist through moss-draped oaks, concluding with single-estate Kangra tea served outdoors.',
  },
  {
    number: '03.',
    title: 'Garhwali Hearth Chef’s Table',
    timing: '20:00 – 22:30 · Stone Conservatory',
    summary:
      'Six-course seasonal menu celebrating heirloom mountain grains, wild fiddlehead ferns, and slow-braised heritage ingredients.',
  },
  {
    number: '04.',
    title: 'Himalayan Cedar & Warm Stone Spa',
    timing: 'By Private Appointment · Suite or Villa',
    summary:
      'Heated river-basalt stone therapy using cold-pressed wild apricot kernel oil and steamed Mussoorie deodar botanicals.',
  },
];

export const EDITORIAL_CHRONICLES = [
  {
    id: 'editorial-1',
    stayId: 'landour-cedar-pavilion',
    authorUid: 'editorial',
    guestName: 'Meera & Vikramaditya Sen',
    guestInitials: 'MS',
    guestRole: 'Architectural Historians',
    guestCity: 'Mumbai',
    stayDate: 'October 2026',
    nightsStayed: 4,
    rating: 5,
    highlight: 'Morning clouds drifting straight across the cedar veranda',
    quote:
      'We have stayed across Himachal and Uttarakhand for twenty years, yet nothing matches waking at CloudCrest Stayz as mist weaves silently through the Landour pines overlooking Doon Valley.',
    isPublished: true,
    isEditorial: true,
  },
  {
    id: 'editorial-2',
    stayId: 'benog-mist-pool-villa',
    authorUid: 'editorial',
    guestName: 'Dr. Rohan Kapoor',
    guestInitials: 'RK',
    guestRole: 'Cardiothoracic Surgeon',
    guestCity: 'New Delhi',
    stayDate: 'September 2026',
    nightsStayed: 3,
    rating: 5,
    highlight: 'Complete acoustic stillness overlooking Benog Valley',
    quote:
      'From the heated slate plunge pool at dawn to the thoughtful Garhwali tasting dinner in our villa, every transition felt unhurried and deeply grounded in Mussoorie’s natural terrain.',
    isPublished: true,
    isEditorial: true,
  },
  {
    id: 'editorial-3',
    stayId: 'lal-tibba-observatory-penthouse',
    authorUid: 'editorial',
    guestName: 'Ananya Deshmukh',
    guestInitials: 'AD',
    guestRole: 'Fine Art Curator',
    guestCity: 'Bengaluru',
    stayDate: 'November 2026',
    nightsStayed: 5,
    rating: 5,
    highlight: 'Crystal-clear winterline sunsets and stargazing',
    quote:
      'The obsidian slate and midnight-blue timber palette inside the Lal Tibba Penthouse frames the Himalayas like a living gallery. Watching the winterline ignite at dusk was unforgettable.',
    isPublished: true,
    isEditorial: true,
  },
];
