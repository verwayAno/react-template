import { useState, useEffect, useRef, Component } from 'react'
import { Routes, Route, Link, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom'
import './App.css'

const I = ({ n, className }) => <i className={`ri-${n} ${className || ''}`} />

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) return (
      <div style={{ padding: '3rem', minHeight: '100vh', fontFamily: 'monospace', background: 'var(--bg)', color: 'var(--text)' }}>
        <h2 style={{ color: 'var(--accent)' }}>Error — check console</h2>
        <pre style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
      </div>
    )
    return this.props.children
  }
}

/* ═══════════════════════════════
   DATA — ACCOMMODATIONS
═══════════════════════════════ */
const STAYS = [
  {
    id: 'cliff-villa', name: 'Cliff Edge Villa', location: 'Santorini, Greece',
    category: 'Villa', rating: 4.97, reviews: 238, price: 820, currency: 'USD',
    tagline: 'Infinity pool suspended above the caldera',
    description: 'Perched on the volcanic rim of Santorini, this private villa offers uninterrupted caldera views from every room. The 18m infinity pool appears to dissolve into the Aegean Sea at sunrise. White-washed minimalism meets locally sourced stone and hand-carved furniture by Cycladic artisans.',
    highlights: ['Private infinity pool', 'Personal chef on request', 'Direct caldera access', 'Butler service 24/7', 'Helipad access'],
    amenities: ['3 bedrooms', 'Sea-view terrace', 'Outdoor shower', 'Private wine cellar', 'In-villa spa'],
    cover: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2', badge: 'Editor\'s Pick',
  },
  {
    id: 'forest-lodge', name: 'Canopy Forest Lodge', location: 'Monteverde, Costa Rica',
    category: 'Lodge', rating: 4.94, reviews: 312, price: 390, currency: 'USD',
    tagline: 'Wake up inside a cloud forest',
    description: 'Elevated on stilts among century-old trees, Canopy Lodge blends sustainability with raw luxury. Floor-to-ceiling glass walls dissolve the boundary between room and rainforest. Solar-powered, water-positive, and carbon-neutral — without sacrificing a single comfort.',
    highlights: ['Private tree-line deck', 'Cloud forest canopy walks', 'On-site naturalist guide', 'Farm-to-table dining', 'Zero-carbon operation'],
    amenities: ['King jungle-view bed', 'Rain shower', 'Fire pit terrace', 'Yoga deck', 'Wildlife observation tower'],
    cover: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop',
    ],
    color: '#059669', badge: 'Eco Certified',
  },
  {
    id: 'desert-retreat', name: 'Red Dune Retreat', location: 'Wadi Rum, Jordan',
    category: 'Desert Camp', rating: 4.96, reviews: 187, price: 610, currency: 'USD',
    tagline: 'Luxury tented camp under a billion stars',
    description: 'Wadi Rum\'s silence is unlike anywhere else on Earth. This tented retreat offers opulent canvas suites with hand-knotted rugs, copper bathtubs, and a private viewing deck for the most extraordinary night skies you will ever witness. Bedouin guides lead dawn camel treks through rose-red canyons.',
    highlights: ['Private stargazing deck', 'Bedouin-hosted dinners', 'Dawn camel trek included', 'Desert yoga at sunrise', 'Hot air balloon option'],
    amenities: ['King brass bed', 'Copper soaking tub', 'Heated floors', 'Private fire pit', 'Telescope & star map'],
    cover: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop',
    ],
    color: '#d97706', badge: 'Most Unique',
  },
  {
    id: 'ryokan', name: 'Hinoki Ryokan', location: 'Hakone, Japan',
    category: 'Ryokan', rating: 4.99, reviews: 156, price: 740, currency: 'USD',
    tagline: 'Centuries of ritual, reimagined for today',
    description: 'A 200-year-old ryokan tradition meets considered modern luxury. Hinoki (cypress) wood interiors fill the rooms with a clean, meditative scent. Private onsen with Mt Fuji views, kaiseki dinner prepared tableside, and yukata-clad service that anticipates every need before it arises.',
    highlights: ['Private onsen with Fuji view', 'Kaiseki multi-course dinner', 'Tea ceremony session', 'Bamboo meditation garden', 'Traditional ikebana workshop'],
    amenities: ['Futon beds on tatami', 'Hinoki wood bath', 'Shoji screen interiors', 'Kimono lending', 'Sake & matcha bar'],
    cover: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&auto=format&fit=crop',
    ],
    color: '#db2777', badge: 'Culturally Immersive',
  },
  {
    id: 'overwater-bungalow', name: 'Lagoon Bungalow', location: 'Bora Bora, French Polynesia',
    category: 'Overwater Bungalow', rating: 4.98, reviews: 203, price: 1100, currency: 'USD',
    tagline: 'Your floor is the Pacific Ocean',
    description: 'The most iconic accommodation on Earth, perfected. Glass floor panels reveal the living coral reef below while your private deck extends over turquoise water you can dive directly into. Sunrise from your sun lounger, snorkelling before breakfast, and the kind of quiet that resets a nervous system.',
    highlights: ['Glass floor panel over reef', 'Direct ocean entry ladder', 'Coral garden snorkelling', 'Sunset cocktail service', 'Overwater breakfast by request'],
    amenities: ['Overwater deck with loungers', 'Glass floor panels', 'Hammam shower', 'Snorkel equipment', 'Kayak & paddleboard'],
    cover: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&auto=format&fit=crop',
    ],
    color: '#0284c7', badge: 'Iconic',
  },
  {
    id: 'alpine-chalet', name: 'Altitude Chalet', location: 'Verbier, Switzerland',
    category: 'Chalet', rating: 4.95, reviews: 94, price: 960, currency: 'USD',
    tagline: 'Ski-in ski-out, fireplace, and Michelin-level food',
    description: 'Verbier\'s highest private chalet sits directly on the ski run at 2,200m. Stone and reclaimed timber interiors hold a library, wine cellar, and a cinema room. The resident chef holds a Michelin star. Heated floors, a private sauna, and a hot tub carved into the south-facing balcony complete the picture.',
    highlights: ['Ski-in / ski-out access', 'Michelin-starred in-house chef', 'Private wine cellar (300 labels)', 'Hot tub on ski run balcony', 'Snowcat tours on request'],
    amenities: ['6 ensuite bedrooms', 'Cinema room', 'Ski boot room', 'Finnish sauna', 'Library & billiards'],
    cover: 'https://images.unsplash.com/photo-1548703818-f7ceaaac4e28?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548703818-f7ceaaac4e28?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533923156502-be31530547c4?w=900&auto=format&fit=crop',
    ],
    color: '#7c3aed', badge: 'Winter Favourite',
  },
]

/* ═══════════════════════════════
   DATA — ACTIVITIES / EXPERIENCES
═══════════════════════════════ */
const EXPERIENCES = [
  {
    id: 'deep-sea-dive', name: 'Deep Sea Photography Dive', location: 'Great Barrier Reef, Australia',
    category: 'Underwater', duration: '6 hours', groupSize: 'Max 4', price: 280, difficulty: 'Intermediate',
    tagline: 'Photograph coral gardens untouched by tourism',
    description: 'Led by a National Geographic underwater photographer, this private dive explores a section of the Great Barrier Reef accessible only by private charter. You will photograph manta rays, humphead wrasse, and coral formations that have taken 500 years to grow. All images edited and delivered within 48 hours.',
    includes: ['Private boat charter', 'Full equipment rental', 'NatGeo photographer guide', 'Underwater camera loan', 'Edited photo gallery delivered in 48h'],
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?w=900&auto=format&fit=crop',
    ],
    color: '#0284c7', badge: 'Exclusive',
  },
  {
    id: 'aurora-trek', name: 'Northern Lights Trek', location: 'Tromsø, Norway',
    category: 'Adventure', duration: '8 hours', groupSize: 'Max 6', price: 340, difficulty: 'Easy',
    tagline: 'Chase the aurora into the Norwegian wilderness',
    description: 'An expert guide with 15 years of aurora forecasting takes your group by snowmobile into terrain no tour bus will ever reach. A wilderness camp awaits with a roaring fire, reindeer stew, and a clear sky horizon. When the lights appear — and they will — a professional astrophotographer captures the moment.',
    includes: ['Snowmobile & full kit', 'Aurora photography session', 'Wilderness camp dinner', 'Expert guide & forecasting', 'Printed photograph'],
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
    ],
    color: '#7c3aed', badge: 'Bucket List',
  },
  {
    id: 'truffle-hunt', name: 'Private Truffle Hunt & Feast', location: 'Périgord, France',
    category: 'Culinary', duration: '5 hours', groupSize: 'Max 8', price: 420, difficulty: 'Easy',
    tagline: 'Hunt truffles at dawn, eat them for lunch',
    description: 'Join a third-generation trufficulteur and their trained Lagotto dog in the misty Périgord oak forests at dawn. You will unearth black truffles from the earth yourself, then carry them directly to a Michelin-starred chef\'s kitchen for a 5-course dégustation built entirely around your morning\'s harvest.',
    includes: ['Expert trufficulteur guide', 'Truffle dog session', 'Michelin-starred lunch (5 courses)', 'Wine pairing by sommelier', 'Truffle souvenir jar'],
    cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop',
    ],
    color: '#92400e', badge: 'Sensory',
  },
  {
    id: 'helicopter-summit', name: 'Helicopter Summit Heli-Ski', location: 'Chamonix, France',
    category: 'Adventure', duration: '7 hours', groupSize: 'Max 4', price: 890, difficulty: 'Expert',
    tagline: 'First tracks on a glacier only helicopters can reach',
    description: 'A certified guide and private helicopter take your group to untouched powder fields in the Mont Blanc massif. The runs you ski today have never been skied before. An alpine lunch is prepared at a hut accessible only on foot or by air. Return to Chamonix with thighs burning and stories no resort skier will ever have.',
    includes: ['Private helicopter transfer', 'IFMGA-certified mountain guide', 'Avalanche safety equipment', 'Alpine hut lunch', 'GoPro footage'],
    cover: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573607217032-18299406d100?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2', badge: 'Adrenaline',
  },
  {
    id: 'hot-air-balloon', name: 'Dawn Balloon Over Cappadocia', location: 'Göreme, Turkey',
    category: 'Sky', duration: '3 hours', groupSize: 'Max 16', price: 195, difficulty: 'Easy',
    tagline: 'Drift over fairy chimneys as the sun rises',
    description: 'Cappadocia from above is a sight that makes grown adults go silent. Your balloon lifts off before sunrise, reaching elevation just as the first light turns the tuff formations gold. A champagne breakfast is served on landing, and your pilot — with 2,000 hours over these valleys — narrates every moment.',
    includes: ['Sunrise flight (60–90 min)', 'Champagne landing breakfast', 'Certificate of flight', 'Hotel pick-up & drop-off', 'In-flight photography'],
    cover: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&auto=format&fit=crop',
    ],
    color: '#f59e0b', badge: 'Most Popular',
  },
  {
    id: 'whale-sail', name: 'Whale Migration Sail', location: 'Azores, Portugal',
    category: 'Wildlife', duration: '9 hours', groupSize: 'Max 10', price: 310, difficulty: 'Easy',
    tagline: 'Sail alongside blue whales in the Atlantic migration route',
    description: 'The Azores sit directly in the Atlantic migration corridor for blue, sperm, and fin whales. Your private yacht follows a marine biologist guide who monitors cetacean radio tags in real time, placing you exactly where the whales will surface. This is not a tour — it is a scientific expedition you get to join.',
    includes: ['Private yacht charter', 'Marine biologist guide', 'Whale radio-tag tracking', 'Underwater hydrophone listening', 'Gourmet picnic lunch'],
    cover: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2', badge: 'Conservation',
  },
]

/* ═══════════════════════════════
   DATA — PACKAGES
═══════════════════════════════ */
const PACKAGES = [
  {
    id: 'aegean-immersion', name: 'Aegean Immersion', location: 'Santorini + Mykonos, Greece',
    duration: '7 nights', price: 6800, pricePer: 'per person',
    tagline: 'The definitive Greek island experience',
    badge: 'Bestseller',
    description: 'Begin with 4 nights in the Cliff Edge Villa overlooking the Santorini caldera, then transfer by private yacht to 3 nights in a secluded Mykonos villa. Includes a private cooking class with a Cycladic chef, a sunset catamaran cruise, and every transfer handled seamlessly.',
    stay: 'cliff-villa',
    experiences: ['hot-air-balloon', 'whale-sail'],
    includes: [
      '4 nights Cliff Edge Villa, Santorini',
      '3 nights Private Mykonos Villa',
      'Private yacht island transfer',
      'Cycladic cooking class',
      'Sunset catamaran cruise',
      'All airport & inter-island transfers',
      'Personal concierge throughout',
    ],
    cover: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2',
  },
  {
    id: 'japan-ritual', name: 'Japan Ritual Circuit', location: 'Tokyo + Kyoto + Hakone, Japan',
    duration: '10 nights', price: 9400, pricePer: 'per person',
    tagline: 'Urban energy, ancient ceremony, volcanic stillness',
    badge: 'Editor\'s Choice',
    description: '3 nights in a design hotel in Tokyo, 4 nights in a Kyoto machiya townhouse, and 3 nights at Hinoki Ryokan in Hakone with private onsen and Mount Fuji views. Includes a private geisha performance, Arashiyama bamboo forest sunrise photography, and a Nishiki Market private tour with a sake master.',
    stay: 'ryokan',
    experiences: ['truffle-hunt'],
    includes: [
      '3 nights boutique hotel, Tokyo',
      '4 nights private machiya, Kyoto',
      '3 nights Hinoki Ryokan, Hakone',
      'Private tea ceremony',
      'Geisha dinner performance',
      'Sunrise bamboo forest session',
      'Sake master private tour',
      'All shinkansen & transfers',
    ],
    cover: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=900&auto=format&fit=crop',
    ],
    color: '#db2777',
  },
  {
    id: 'arctic-wonder', name: 'Arctic Wonder Week', location: 'Tromsø + Svalbard, Norway',
    duration: '8 nights', price: 11200, pricePer: 'per person',
    tagline: 'Aurora, polar bears, and absolute silence',
    badge: 'Extreme Luxury',
    description: '4 nights aurora hunting in Tromsø — including our Northern Lights Trek — then a private small aircraft to Svalbard for 4 nights in a luxury expedition lodge. A wildlife guide takes you in search of polar bears, arctic foxes, and reindeer on the sea ice, with zodiac excursions to glacier faces.',
    stay: 'forest-lodge',
    experiences: ['aurora-trek'],
    includes: [
      '4 nights Tromsø glass-cabin lodge',
      '4 nights Svalbard expedition lodge',
      'Northern Lights Trek',
      'Private Svalbard flight',
      'Polar bear zodiac excursion',
      'Dog sled half-day',
      'Arctic cuisine by Michelin chef',
    ],
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
    ],
    color: '#7c3aed',
  },
  {
    id: 'desert-soul', name: 'Desert Soul Journey', location: 'Wadi Rum + Petra + Dead Sea, Jordan',
    duration: '6 nights', price: 5600, pricePer: 'per person',
    tagline: 'From rose-red canyons to the lowest point on Earth',
    badge: 'Off-beaten Path',
    description: '2 nights at Red Dune Retreat in Wadi Rum, 2 nights in a boutique cave hotel in Petra, and 2 nights at a luxury Dead Sea resort. Private archaeologist-guided Petra tour at dawn before any tourists arrive, a Bedouin feast under the stars, and a mineral float therapy session at the Dead Sea.',
    stay: 'desert-retreat',
    experiences: ['hot-air-balloon'],
    includes: [
      '2 nights Red Dune Retreat, Wadi Rum',
      '2 nights cave hotel, Petra',
      '2 nights Dead Sea resort',
      'Private dawn Petra tour with archaeologist',
      'Bedouin feast with live music',
      'Dead Sea float therapy',
      'All 4WD transfers',
    ],
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop',
    ],
    color: '#d97706',
  },
]

const TEAM = [
  { name: 'Sofia Almeria', role: 'Founder & Head Curator', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop', bio: 'Former Condé Nast Traveller editor. 20 years sourcing the world\'s most exceptional hidden stays.' },
  { name: 'Kenji Watanabe', role: 'Asia & Pacific Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop', bio: 'Based between Tokyo and Bali. Specialises in slow travel itineraries across Japan, Indonesia and Sri Lanka.' },
  { name: 'Amara Diallo', role: 'Africa & Middle East', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop', bio: 'Safari specialist and wilderness guide with 15 years across East Africa, Morocco and Jordan.' },
  { name: 'Lars Eriksson', role: 'Arctic & Alpine Specialist', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop', bio: 'Expedition mountaineer turned luxury travel curator. Knows every heli-ski corridor in the Alps and Scandinavia.' },
]

const TESTIMONIALS = [
  {
    name: 'Charlotte & Marcus Webb', role: 'Anniversary trip, Bora Bora',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&auto=format&fit=crop',
    text: 'RIVORA knew our anniversary was approaching before we did. The overwater bungalow had rose petals on the deck, a private chef, and a bottle of wine from the year we met. We cried. Twice.',
    rating: 5,
  },
  {
    name: 'Takeshi Mori', role: 'Japan Ritual Circuit',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
    text: 'I have been to Japan four times. RIVORA\'s Japan circuit showed me a country I had never seen before. Private geisha dinner, bamboo forest at dawn with no one else — it felt like having Japan as a private estate.',
    rating: 5,
  },
  {
    name: 'Priya Nair', role: 'Arctic Wonder Week',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
    text: 'Seeing polar bears from a zodiac ten metres away, then eating an eight-course dinner in a heated glass lodge under the northern lights the same evening. I still don\'t believe it happened.',
    rating: 5,
  },
]

const STATS = [
  { value: '140+', label: 'Curated Destinations', icon: 'map-pin-2-fill' },
  { value: '98%', label: 'Guest Return Rate', icon: 'heart-fill' },
  { value: '18yrs', label: 'Curating Experiences', icon: 'calendar-check-fill' },
  { value: '52', label: 'Countries', icon: 'earth-line' },
]

const THEME_MODES = [
  { id: 'dark',  icon: 'moon-fill',       label: 'Night' },
  { id: 'light', icon: 'sun-fill',        label: 'Day'   },
  { id: 'neon',  icon: 'flashlight-fill', label: 'Neon'  },
  { id: 'ember', icon: 'fire-fill',       label: 'Dusk'  },
]

/* ═══════════════════════════════
   THEME SWITCHER
═══════════════════════════════ */
function ThemeSwitcher({ mode, setMode }) {
  return (
    <div className="rv-theme-sw">
      {THEME_MODES.map(({ id, icon, label }) => (
        <button key={id}
          className={`rv-theme-btn${mode === id ? ' rv-theme-btn--on' : ''}`}
          onClick={() => { setMode(id); localStorage.setItem('rivora-mode', id) }}
          title={label} aria-label={`${label} mode`}>
          <I n={icon} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════
   SITE HEADER / NAV
═══════════════════════════════ */
function SiteHeader({ mode, setMode }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setOpen(false); setActiveMenu(null) }, [location.pathname])

  const navLinks = [
    { label: 'Stay',        to: '/stay',        icon: 'hotel-line'       },
    { label: 'Experiences', to: '/experiences', icon: 'compass-3-line'   },
    { label: 'Packages',    to: '/packages',    icon: 'gift-2-line'      },
    { label: 'About',       to: '/about',       icon: 'team-line'        },
  ]

  return (
    <header className={`rv-header${scrolled ? ' rv-header--scrolled' : ''}${open ? ' rv-header--open' : ''}`}>
      <div className="rv-header__bar contain">

        {/* Logo */}
        <Link to="/" className="rv-logo">
          <span className="rv-logo__gem">◈</span>
          <span className="rv-logo__wordmark">
            <span className="rv-logo__main">RIVORA</span>
            <span className="rv-logo__sub">Curated Travel</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="rv-nav" aria-label="Primary">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) => `rv-nav__link${isActive ? ' rv-nav__link--active' : ''}`}>
              <I n={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="rv-header__right">
          <ThemeSwitcher mode={mode} setMode={setMode} />
          <Link to="/packages" className="rv-book-btn">
            <I n="sparkling-2-line" />
            Book a Journey
          </Link>
          <button className="rv-burger" onClick={() => setOpen(v => !v)}
            aria-expanded={open} aria-label="Menu">
            <span className={`rv-burger__icon${open ? ' rv-burger__icon--x' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`rv-drawer${open ? ' rv-drawer--open' : ''}`} aria-hidden={!open}>
        <div className="rv-drawer__inner">
          <div className="rv-drawer__links">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) => `rv-drawer__link${isActive ? ' rv-drawer__link--active' : ''}`}
                onClick={() => setOpen(false)}>
                <I n={link.icon} />
                <span>{link.label}</span>
                <I n="arrow-right-s-line" className="rv-drawer__arrow" />
              </NavLink>
            ))}
          </div>
          <div className="rv-drawer__footer">
            <ThemeSwitcher mode={mode} setMode={setMode} />
            <Link to="/packages" className="rv-book-btn rv-book-btn--full" onClick={() => setOpen(false)}>
              <I n="sparkling-2-line" /> Book a Journey
            </Link>
          </div>
        </div>
      </div>
      {open && <button className="rv-drawer__backdrop" aria-label="Close" onClick={() => setOpen(false)} />}
    </header>
  )
}

/* ═══════════════════════════════
   CARD COMPONENTS
═══════════════════════════════ */
function StayCard({ item, featured }) {
  return (
    <article className={`rv-card${featured ? ' rv-card--featured' : ''}`} style={{ '--card-accent': item.color }}>
      <Link to={`/stay/${item.id}`} className="rv-card__img-wrap">
        <img src={item.cover} alt={item.name} loading="lazy" />
        <div className="rv-card__img-overlay" />
        {item.badge && <span className="rv-card__badge">{item.badge}</span>}
        <div className="rv-card__hover-cta"><I n="arrow-right-up-line" /> View Details</div>
      </Link>
      <div className="rv-card__body">
        <div className="rv-card__meta">
          <span className="rv-card__cat"><I n="map-pin-2-line" /> {item.location}</span>
          <span className="rv-card__rating"><I n="star-fill" /> {item.rating}</span>
        </div>
        <h3 className="rv-card__title"><Link to={`/stay/${item.id}`}>{item.name}</Link></h3>
        <p className="rv-card__tagline">{item.tagline}</p>
        <div className="rv-card__foot">
          <span className="rv-card__price">
            <strong>${item.price.toLocaleString()}</strong>
            <span>/night</span>
          </span>
          <Link to={`/stay/${item.id}`} className="rv-link-pill">
            Explore <I n="arrow-right-line" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function ExpCard({ item }) {
  return (
    <article className="rv-exp-card" style={{ '--card-accent': item.color }}>
      <Link to={`/experiences/${item.id}`} className="rv-exp-card__img">
        <img src={item.cover} alt={item.name} loading="lazy" />
        <div className="rv-exp-card__img-overlay" />
        {item.badge && <span className="rv-card__badge">{item.badge}</span>}
        <div className="rv-exp-card__chips">
          <span><I n="time-line" /> {item.duration}</span>
          <span><I n="user-line" /> {item.groupSize}</span>
          <span className={`rv-diff rv-diff--${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
        </div>
      </Link>
      <div className="rv-card__body">
        <span className="rv-card__cat"><I n="map-pin-2-line" /> {item.location}</span>
        <h3 className="rv-card__title"><Link to={`/experiences/${item.id}`}>{item.name}</Link></h3>
        <p className="rv-card__tagline">{item.tagline}</p>
        <div className="rv-card__foot">
          <span className="rv-card__price"><strong>${item.price}</strong><span>/person</span></span>
          <Link to={`/experiences/${item.id}`} className="rv-link-pill">Book <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </article>
  )
}

function PkgCard({ item }) {
  return (
    <article className="rv-pkg-card" style={{ '--card-accent': item.color }}>
      <Link to={`/packages/${item.id}`} className="rv-pkg-card__img">
        <img src={item.cover} alt={item.name} loading="lazy" />
        <div className="rv-card__img-overlay" />
        {item.badge && <span className="rv-card__badge">{item.badge}</span>}
        <div className="rv-pkg-card__duration">
          <I n="calendar-2-line" /> {item.duration}
        </div>
      </Link>
      <div className="rv-card__body">
        <span className="rv-card__cat"><I n="map-pin-2-line" /> {item.location}</span>
        <h3 className="rv-card__title"><Link to={`/packages/${item.id}`}>{item.name}</Link></h3>
        <p className="rv-card__tagline">{item.tagline}</p>
        <div className="rv-card__foot">
          <span className="rv-card__price"><strong>${item.price.toLocaleString()}</strong><span>/{item.pricePer}</span></span>
          <Link to={`/packages/${item.id}`} className="rv-link-pill">View <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </article>
  )
}

/* ═══════════════════════════════
   STAR RATING
═══════════════════════════════ */
function Stars({ n }) {
  return <span className="rv-stars">{'★'.repeat(n)}</span>
}

/* ═══════════════════════════════
   HOME PAGE
═══════════════════════════════ */
function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [testIdx, setTestIdx] = useState(0)
  const heroItems = STAYS.slice(0, 4)

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroItems.length), 5000)
    return () => clearInterval(t)
  }, [heroItems.length])

  const active = heroItems[heroIdx]

  return (
    <>
      {/* ── CINEMATIC HERO ── */}
      <section className="rv-hero" style={{ '--hero-color': active.color }}>
        <div className="rv-hero__slides">
          {heroItems.map((item, i) => (
            <div key={item.id}
              className={`rv-hero__slide${i === heroIdx ? ' rv-hero__slide--active' : ''}`}>
              <img src={item.cover} alt={item.name} />
              <div className="rv-hero__slide-veil" />
            </div>
          ))}
        </div>

        <div className="rv-hero__content contain">
          <div className="rv-hero__eyebrow">
            <span className="rv-hero__dot" />
            {active.category} · {active.location}
          </div>
          <h1 className="rv-hero__h1">
            <span className="rv-hero__h1-pre">The World's Most</span>
            <span className="rv-hero__h1-main">Extraordinary Places</span>
          </h1>
          <p className="rv-hero__sub">
            Curated stays, rare experiences and seamlessly crafted journeys — for those who travel to feel, not just to see.
          </p>
          <div className="rv-hero__actions">
            <Link to="/packages" className="rv-hero__cta">
              <I n="sparkling-2-line" /> Discover Packages
            </Link>
            <Link to="/stay" className="rv-hero__ghost">
              Browse All Stays <I n="arrow-right-line" />
            </Link>
          </div>
        </div>

        {/* Slide picker */}
        <div className="rv-hero__thumbs">
          {heroItems.map((item, i) => (
            <button key={item.id}
              className={`rv-hero__thumb${i === heroIdx ? ' rv-hero__thumb--active' : ''}`}
              onClick={() => setHeroIdx(i)}>
              <img src={item.cover} alt={item.name} />
              <div className="rv-hero__thumb-info">
                <strong>{item.name}</strong>
                <span>{item.location}</span>
              </div>
              <div className="rv-hero__thumb-progress" style={{ '--dur': '5s' }} />
            </button>
          ))}
        </div>

        <div className="rv-hero__scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <I n="arrow-down-line" />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="rv-strip">
        {STATS.map(s => (
          <div className="rv-strip__item" key={s.label}>
            <I n={s.icon} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── FEATURED STAYS ── */}
      <section className="rv-section">
        <div className="contain">
          <div className="rv-section__head">
            <div>
              <span className="rv-eyebrow"><I n="hotel-line" /> Accommodations</span>
              <h2>Where You'll Rest</h2>
            </div>
            <Link to="/stay" className="rv-see-all">All Stays <I n="arrow-right-line" /></Link>
          </div>
          <div className="rv-stays-grid">
            {STAYS.slice(0, 3).map((s, i) => <StayCard key={s.id} item={s} featured={i === 0} />)}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE MARQUEE ── */}
      <div className="rv-marq" aria-hidden="true">
        <div className="rv-marq__track">
          {[...EXPERIENCES, ...EXPERIENCES].map((e, i) => (
            <span key={i} className="rv-marq__pill">
              <I n="sparkling-2-line" /> {e.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED EXPERIENCES ── */}
      <section className="rv-section rv-section--alt">
        <div className="contain">
          <div className="rv-section__head">
            <div>
              <span className="rv-eyebrow"><I n="compass-3-line" /> Experiences</span>
              <h2>Things Worth Doing</h2>
            </div>
            <Link to="/experiences" className="rv-see-all">All Experiences <I n="arrow-right-line" /></Link>
          </div>
          <div className="rv-exp-grid">
            {EXPERIENCES.slice(0, 4).map(e => <ExpCard key={e.id} item={e} />)}
          </div>
        </div>
      </section>

      {/* ── PACKAGES FEATURE ── */}
      <section className="rv-section">
        <div className="contain">
          <div className="rv-section__head rv-section__head--center">
            <span className="rv-eyebrow"><I n="gift-2-line" /> Packages</span>
            <h2>Complete Journeys</h2>
            <p className="rv-section__sub">Everything taken care of — accommodation, experiences, transfers. Just arrive.</p>
          </div>
          <div className="rv-pkg-grid">
            {PACKAGES.slice(0, 3).map(p => <PkgCard key={p.id} item={p} />)}
          </div>
          <div className="rv-section__cta">
            <Link to="/packages" className="rv-btn-primary">
              All Packages <I n="arrow-right-line" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="rv-section rv-section--alt">
        <div className="contain">
          <div className="rv-section__head rv-section__head--center">
            <span className="rv-eyebrow"><I n="double-quotes-l" /> Guest Stories</span>
            <h2>Why Travellers Return</h2>
          </div>
          <div className="rv-testimonials">
            <div className="rv-test-track" style={{ transform: `translateX(-${testIdx * 100}%)` }}>
              {TESTIMONIALS.map((t, i) => (
                <article className="rv-testimonial" key={i}>
                  <Stars n={t.rating} />
                  <blockquote>"{t.text}"</blockquote>
                  <cite>
                    <img src={t.img} alt={t.name} />
                    <div><strong>{t.name}</strong><span>{t.role}</span></div>
                  </cite>
                </article>
              ))}
            </div>
          </div>
          <div className="rv-test-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`rv-dot${testIdx === i ? ' rv-dot--on' : ''}`}
                onClick={() => setTestIdx(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rv-cta-section">
        <div className="rv-cta-section__bg" aria-hidden="true" />
        <div className="contain rv-cta-section__inner">
          <span className="rv-eyebrow rv-eyebrow--light"><I n="sparkling-2-line" /> Let's Plan Your Journey</span>
          <h2>Where Do You Want to<br /><span className="rv-gradient-text">Feel Alive?</span></h2>
          <p>Tell us what moves you. We'll build an itinerary you will retell for the rest of your life.</p>
          <Link to="/packages" className="rv-hero__cta">
            Start Planning <I n="arrow-right-line" />
          </Link>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   ABOUT PAGE
═══════════════════════════════ */
function AboutPage() {
  return (
    <>
      <div className="rv-page-hero">
        <div className="contain">
          <span className="rv-eyebrow"><I n="team-line" /> About Us</span>
          <h1>We Find the Places<br />That Change You</h1>
          <p className="rv-page-hero__sub">RIVORA began with a single conviction: the best travel experiences are not found in a brochure. They are curated over years of obsessive exploration.</p>
        </div>
      </div>

      <section className="rv-section">
        <div className="contain rv-about-layout">
          <div className="rv-about-img">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop" alt="RIVORA team" />
            <div className="rv-about-badge">
              <strong>Since 2006</strong>
              <span>18 years of curation</span>
            </div>
          </div>
          <div className="rv-about-text">
            <span className="rv-eyebrow"><I n="book-open-line" /> Our Story</span>
            <h2>Born from Wanderlust,<br />Built on Standards</h2>
            <p>RIVORA was founded in 2006 by Sofia Almeria after a decade as an editor for Condé Nast Traveller. She had seen every luxury hotel claim to be transformative, and most disappoint. She left to build something she could stand behind.</p>
            <p>Today, our team of eight specialists — each living in their respective region — personally vets every property and experience we list. Nothing is added because of a commercial relationship. Everything is here because one of us would genuinely book it for their own family.</p>
            <p>That is not a marketing statement. It is the only principle we have never negotiated.</p>
            <div className="rv-about-vals">
              {[
                { icon: 'award-line', title: 'No paid placements', desc: 'Properties are listed on merit alone. No listing fees. No sponsorships.' },
                { icon: 'map-pin-2-line', title: 'In-country curators', desc: 'Every region is managed by someone who actually lives there.' },
                { icon: 'shield-check-line', title: 'Guaranteed satisfaction', desc: 'If an experience falls short of our description, we make it right.' },
              ].map(v => (
                <div key={v.title} className="rv-about-val">
                  <I n={v.icon} />
                  <div><strong>{v.title}</strong><p>{v.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="rv-strip">
        {STATS.map(s => (
          <div className="rv-strip__item" key={s.label}>
            <I n={s.icon} /><strong>{s.value}</strong><span>{s.label}</span>
          </div>
        ))}
      </div>

      <section className="rv-section rv-section--alt">
        <div className="contain">
          <div className="rv-section__head rv-section__head--center">
            <span className="rv-eyebrow"><I n="user-star-line" /> The Curators</span>
            <h2>The People Behind the List</h2>
          </div>
          <div className="rv-team-grid">
            {TEAM.map(m => (
              <div className="rv-team-card" key={m.name}>
                <img src={m.img} alt={m.name} />
                <div className="rv-team-card__body">
                  <h4>{m.name}</h4>
                  <span>{m.role}</span>
                  <p>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rv-section">
        <div className="contain rv-press-section">
          <div className="rv-section__head rv-section__head--center">
            <span className="rv-eyebrow"><I n="newspaper-line" /> Press & Recognition</span>
            <h2>What Others Say</h2>
          </div>
          <div className="rv-press-grid">
            {[
              { pub: 'Condé Nast Traveller', quote: '"The travel curator we trust most"', year: '2025' },
              { pub: 'The Times', quote: '"RIVORA is in a category of one"', year: '2024' },
              { pub: 'Forbes Travel', quote: '"Quietly essential for discerning travellers"', year: '2024' },
              { pub: 'Wallpaper*', quote: '"Their taste is simply impeccable"', year: '2025' },
            ].map(p => (
              <div key={p.pub} className="rv-press-item">
                <blockquote>{p.quote}</blockquote>
                <cite>{p.pub} · {p.year}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   STAYS LIST PAGE
═══════════════════════════════ */
function StaysPage() {
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(STAYS.map(s => s.category))]
  const filtered = cat === 'All' ? STAYS : STAYS.filter(s => s.category === cat)

  return (
    <>
      <div className="rv-page-hero">
        <div className="contain">
          <span className="rv-eyebrow"><I n="hotel-line" /> Accommodations</span>
          <h1>Extraordinary Places to Stay</h1>
          <p className="rv-page-hero__sub">Every property personally visited by our curators. Nothing listed we wouldn't stay in ourselves.</p>
        </div>
      </div>
      <section className="rv-section">
        <div className="contain">
          <div className="rv-filter-bar">
            {cats.map(c => (
              <button key={c} className={`rv-filter-btn${cat === c ? ' rv-filter-btn--on' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="rv-stays-grid rv-stays-grid--full">
            {filtered.map(s => <StayCard key={s.id} item={s} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   STAY DETAIL PAGE
═══════════════════════════════ */
function StayDetailPage() {
  const { id } = useParams()
  const item = STAYS.find(s => s.id === id)
  const [imgIdx, setImgIdx] = useState(0)
  if (!item) return <NotFound />

  return (
    <>
      {/* Gallery */}
      <div className="rv-detail-gallery">
        <div className="rv-detail-gallery__main">
          <img src={item.images[imgIdx]} alt={item.name} />
          {item.badge && <span className="rv-card__badge rv-card__badge--lg">{item.badge}</span>}
          <button className="rv-detail-gallery__back" onClick={() => window.history.back()}>
            <I n="arrow-left-line" /> All Stays
          </button>
        </div>
        <div className="rv-detail-gallery__thumbs">
          {item.images.map((img, i) => (
            <button key={i} className={`rv-detail-gallery__thumb${imgIdx === i ? ' rv-detail-gallery__thumb--on' : ''}`}
              onClick={() => setImgIdx(i)}>
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="rv-detail-body contain">
        <div className="rv-detail-main">
          <div className="rv-detail-header">
            <div>
              <span className="rv-eyebrow"><I n="map-pin-2-line" /> {item.location} · {item.category}</span>
              <h1>{item.name}</h1>
              <p className="rv-detail-tagline">{item.tagline}</p>
            </div>
            <div className="rv-detail-price-box">
              <span className="rv-detail-price-box__label">From</span>
              <strong className="rv-detail-price-box__price">${item.price.toLocaleString()}</strong>
              <span className="rv-detail-price-box__per">per night</span>
              <div className="rv-detail-price-box__rating"><I n="star-fill" /> {item.rating} · {item.reviews} reviews</div>
              <Link to="/packages" className="rv-btn-primary rv-btn-primary--full">Enquire Now</Link>
            </div>
          </div>

          <p className="rv-detail-desc">{item.description}</p>

          <div className="rv-detail-cols">
            <div>
              <h3><I n="check-double-line" /> Highlights</h3>
              <ul className="rv-detail-list">
                {item.highlights.map(h => <li key={h}><I n="sparkling-2-line" /> {h}</li>)}
              </ul>
            </div>
            <div>
              <h3><I n="home-5-line" /> Amenities</h3>
              <ul className="rv-detail-list">
                {item.amenities.map(a => <li key={a}><I n="checkbox-circle-line" /> {a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="rv-section rv-section--alt">
        <div className="contain">
          <div className="rv-section__head">
            <div><span className="rv-eyebrow">You Might Also Love</span><h2>Similar Stays</h2></div>
          </div>
          <div className="rv-stays-grid">
            {STAYS.filter(s => s.id !== id).slice(0, 3).map(s => <StayCard key={s.id} item={s} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   EXPERIENCES LIST PAGE
═══════════════════════════════ */
function ExperiencesPage() {
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(EXPERIENCES.map(e => e.category))]
  const filtered = cat === 'All' ? EXPERIENCES : EXPERIENCES.filter(e => e.category === cat)

  return (
    <>
      <div className="rv-page-hero">
        <div className="contain">
          <span className="rv-eyebrow"><I n="compass-3-line" /> Experiences</span>
          <h1>Encounters That Stay With You</h1>
          <p className="rv-page-hero__sub">Private, rare, and impossible to replicate. These are not activities — they are moments you will describe for the rest of your life.</p>
        </div>
      </div>
      <section className="rv-section">
        <div className="contain">
          <div className="rv-filter-bar">
            {cats.map(c => (
              <button key={c} className={`rv-filter-btn${cat === c ? ' rv-filter-btn--on' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="rv-exp-grid rv-exp-grid--full">
            {filtered.map(e => <ExpCard key={e.id} item={e} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   EXPERIENCE DETAIL PAGE
═══════════════════════════════ */
function ExperienceDetailPage() {
  const { id } = useParams()
  const item = EXPERIENCES.find(e => e.id === id)
  const [imgIdx, setImgIdx] = useState(0)
  if (!item) return <NotFound />

  return (
    <>
      <div className="rv-detail-gallery">
        <div className="rv-detail-gallery__main">
          <img src={item.images[imgIdx]} alt={item.name} />
          {item.badge && <span className="rv-card__badge rv-card__badge--lg">{item.badge}</span>}
          <button className="rv-detail-gallery__back" onClick={() => window.history.back()}>
            <I n="arrow-left-line" /> All Experiences
          </button>
          <div className="rv-detail-gallery__chips">
            <span><I n="time-line" /> {item.duration}</span>
            <span><I n="user-line" /> {item.groupSize}</span>
            <span><I n="map-pin-2-line" /> {item.location}</span>
          </div>
        </div>
        <div className="rv-detail-gallery__thumbs">
          {item.images.map((img, i) => (
            <button key={i} className={`rv-detail-gallery__thumb${imgIdx === i ? ' rv-detail-gallery__thumb--on' : ''}`}
              onClick={() => setImgIdx(i)}><img src={img} alt="" /></button>
          ))}
        </div>
      </div>

      <div className="rv-detail-body contain">
        <div className="rv-detail-main">
          <div className="rv-detail-header">
            <div>
              <span className="rv-eyebrow"><I n="compass-3-line" /> {item.category}</span>
              <h1>{item.name}</h1>
              <p className="rv-detail-tagline">{item.tagline}</p>
            </div>
            <div className="rv-detail-price-box">
              <span className="rv-detail-price-box__label">From</span>
              <strong className="rv-detail-price-box__price">${item.price}</strong>
              <span className="rv-detail-price-box__per">per person</span>
              <span className={`rv-diff rv-diff--${item.difficulty.toLowerCase()} rv-diff--lg`}>{item.difficulty}</span>
              <Link to="/packages" className="rv-btn-primary rv-btn-primary--full">Book Experience</Link>
            </div>
          </div>
          <p className="rv-detail-desc">{item.description}</p>
          <h3><I n="gift-2-line" /> What's Included</h3>
          <ul className="rv-detail-list">
            {item.includes.map(inc => <li key={inc}><I n="check-line" /> {inc}</li>)}
          </ul>
        </div>
      </div>

      <section className="rv-section rv-section--alt">
        <div className="contain">
          <div className="rv-section__head">
            <div><span className="rv-eyebrow">More to Explore</span><h2>Similar Experiences</h2></div>
          </div>
          <div className="rv-exp-grid">
            {EXPERIENCES.filter(e => e.id !== id).slice(0, 4).map(e => <ExpCard key={e.id} item={e} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   PACKAGES LIST PAGE
═══════════════════════════════ */
function PackagesPage() {
  return (
    <>
      <div className="rv-page-hero">
        <div className="contain">
          <span className="rv-eyebrow"><I n="gift-2-line" /> Packages</span>
          <h1>Complete Journeys,<br />Seamlessly Crafted</h1>
          <p className="rv-page-hero__sub">Accommodation, experiences, and every transfer woven into a single, effortless itinerary. Nothing to plan. Everything to feel.</p>
        </div>
      </div>
      <section className="rv-section">
        <div className="contain">
          <div className="rv-pkg-grid rv-pkg-grid--full">
            {PACKAGES.map(p => <PkgCard key={p.id} item={p} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   PACKAGE DETAIL PAGE
═══════════════════════════════ */
function PackageDetailPage() {
  const { id } = useParams()
  const item = PACKAGES.find(p => p.id === id)
  const [imgIdx, setImgIdx] = useState(0)
  const stay = STAYS.find(s => s.id === item?.stay)
  if (!item) return <NotFound />

  return (
    <>
      <div className="rv-detail-gallery">
        <div className="rv-detail-gallery__main">
          <img src={item.images[imgIdx]} alt={item.name} />
          {item.badge && <span className="rv-card__badge rv-card__badge--lg">{item.badge}</span>}
          <button className="rv-detail-gallery__back" onClick={() => window.history.back()}>
            <I n="arrow-left-line" /> All Packages
          </button>
        </div>
        <div className="rv-detail-gallery__thumbs">
          {item.images.map((img, i) => (
            <button key={i} className={`rv-detail-gallery__thumb${imgIdx === i ? ' rv-detail-gallery__thumb--on' : ''}`}
              onClick={() => setImgIdx(i)}><img src={img} alt="" /></button>
          ))}
        </div>
      </div>

      <div className="rv-detail-body contain">
        <div className="rv-detail-main">
          <div className="rv-detail-header">
            <div>
              <span className="rv-eyebrow"><I n="map-pin-2-line" /> {item.location} · <I n="calendar-2-line" /> {item.duration}</span>
              <h1>{item.name}</h1>
              <p className="rv-detail-tagline">{item.tagline}</p>
            </div>
            <div className="rv-detail-price-box">
              <span className="rv-detail-price-box__label">From</span>
              <strong className="rv-detail-price-box__price">${item.price.toLocaleString()}</strong>
              <span className="rv-detail-price-box__per">{item.pricePer}</span>
              <Link to="/packages" className="rv-btn-primary rv-btn-primary--full">Request This Journey</Link>
            </div>
          </div>

          <p className="rv-detail-desc">{item.description}</p>

          <h3><I n="list-check" /> Package Includes</h3>
          <ul className="rv-detail-list rv-detail-list--grid">
            {item.includes.map(inc => <li key={inc}><I n="sparkling-2-line" /> {inc}</li>)}
          </ul>

          {stay && (
            <div className="rv-detail-linked">
              <h3><I n="hotel-line" /> Featured Stay</h3>
              <StayCard item={stay} />
            </div>
          )}
        </div>
      </div>

      <section className="rv-section rv-section--alt">
        <div className="contain">
          <div className="rv-section__head">
            <div><span className="rv-eyebrow">Explore More</span><h2>Other Packages</h2></div>
          </div>
          <div className="rv-pkg-grid">
            {PACKAGES.filter(p => p.id !== id).slice(0, 3).map(p => <PkgCard key={p.id} item={p} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════
   SITE FOOTER
═══════════════════════════════ */
function SiteFooter() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const handleNewsletter = e => {
    e.preventDefault()
    if (email.includes('@')) { setJoined(true) }
  }

  return (
    <footer className="rv-footer">
      {/* Wave divider */}
      <div className="rv-footer__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg-alt)" />
        </svg>
      </div>

      <div className="rv-footer__body">
        {/* Top row */}
        <div className="rv-footer__top contain">
          <div className="rv-footer__brand">
            <Link to="/" className="rv-logo rv-logo--footer">
              <span className="rv-logo__gem">◈</span>
              <span className="rv-logo__wordmark">
                <span className="rv-logo__main">RIVORA</span>
                <span className="rv-logo__sub">Curated Travel</span>
              </span>
            </Link>
            <p>Curating the world's most extraordinary stays, experiences, and journeys since 2006. Nothing listed we wouldn't book ourselves.</p>
            <div className="rv-footer__socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><I n="instagram-line" /></a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest"><I n="pinterest-line" /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><I n="twitter-x-line" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><I n="youtube-line" /></a>
            </div>
          </div>

          <div className="rv-footer__nav">
            <div className="rv-footer__col">
              <h5>Explore</h5>
              <Link to="/stay">Accommodations</Link>
              <Link to="/experiences">Experiences</Link>
              <Link to="/packages">Packages</Link>
            </div>
            <div className="rv-footer__col">
              <h5>Company</h5>
              <Link to="/about">About RIVORA</Link>
              <Link to="/about">Our Curators</Link>
              <a href="mailto:hello@rivora.travel">hello@rivora.travel</a>
            </div>
            <div className="rv-footer__col">
              <h5>Stay Inspired</h5>
              {!joined ? (
                <form className="rv-footer__newsletter" onSubmit={handleNewsletter}>
                  <p>Monthly dispatches from places most people never find.</p>
                  <div className="rv-footer__nl-row">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" aria-label="Email address" />
                    <button type="submit" aria-label="Subscribe"><I n="arrow-right-line" /></button>
                  </div>
                </form>
              ) : (
                <p className="rv-footer__nl-thanks"><I n="check-line" /> You're on the list. Expect something beautiful.</p>
              )}
            </div>
          </div>
        </div>

        {/* Destination strip */}
        <div className="rv-footer__dest-strip contain">
          <span className="rv-footer__dest-label">Destinations:</span>
          {['Greece', 'Japan', 'Norway', 'Jordan', 'Costa Rica', 'France', 'Switzerland', 'French Polynesia', 'Australia', 'Turkey', 'Azores'].map(d => (
            <Link key={d} to="/stay" className="rv-footer__dest-pill">{d}</Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="rv-footer__bottom contain">
          <p>© {new Date().getFullYear()} RIVORA Curated Travel. All rights reserved.</p>
          <div className="rv-footer__legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════
   NOT FOUND
═══════════════════════════════ */
function NotFound() {
  return (
    <div className="rv-404">
      <span className="rv-404__num">404</span>
      <h2>Lost in Transit</h2>
      <p>This page does not exist — but dozens of extraordinary ones do.</p>
      <Link to="/" className="rv-btn-primary">Back to Home</Link>
    </div>
  )
}

/* ═══════════════════════════════
   APP SHELL
═══════════════════════════════ */
function AppShell() {
  const location = useLocation()
  const [mode, setMode] = useState(() => {
    const s = localStorage.getItem('rivora-mode')
    return ['dark','light','neon','ember'].includes(s) ? s : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <ErrorBoundary>
      <SiteHeader mode={mode} setMode={setMode} />
      <main className="rv-main">
        <Routes>
          <Route path="/"                    element={<HomePage />} />
          <Route path="/about"               element={<AboutPage />} />
          <Route path="/stay"                element={<StaysPage />} />
          <Route path="/stay/:id"            element={<StayDetailPage />} />
          <Route path="/experiences"         element={<ExperiencesPage />} />
          <Route path="/experiences/:id"     element={<ExperienceDetailPage />} />
          <Route path="/packages"            element={<PackagesPage />} />
          <Route path="/packages/:id"        element={<PackageDetailPage />} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </ErrorBoundary>
  )
}

export default AppShell
