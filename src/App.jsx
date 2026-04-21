import { useState, useEffect, useRef, Component } from 'react'
import { Routes, Route, Link, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom'
import './App.css'

const I = ({ n, className }) => <i className={`ri-${n} ${className || ''}`} />

/* ── Intersection-observer fade-in hook ── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

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
   DATA
═══════════════════════════════ */
const STAYS = [
  {
    id: 'cliff-villa', name: 'Cliff Edge Villa', location: 'Santorini, Greece',
    category: 'Villa', rating: 4.97, reviews: 238, price: 820,
    tagline: 'Infinity pool suspended above the caldera',
    description: 'Perched on the volcanic rim of Santorini, this private villa offers uninterrupted caldera views from every room. The 18m infinity pool appears to dissolve into the Aegean Sea at sunrise. White-washed minimalism meets locally sourced stone and hand-carved furniture by Cycladic artisans.',
    highlights: ['Private infinity pool', 'Personal chef on request', 'Direct caldera access', 'Butler service 24/7', 'Helipad access'],
    amenities: ['3 bedrooms', 'Sea-view terrace', 'Outdoor shower', 'Private wine cellar', 'In-villa spa'],
    cover: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2', badge: "Editor's Pick", region: 'Europe',
    atmosphere: 'Intimate · Romantic · Views',
  },
  {
    id: 'forest-lodge', name: 'Canopy Forest Lodge', location: 'Monteverde, Costa Rica',
    category: 'Lodge', rating: 4.94, reviews: 312, price: 390,
    tagline: 'Wake up inside a cloud forest',
    description: 'Elevated on stilts among century-old trees, Canopy Lodge blends sustainability with raw luxury. Floor-to-ceiling glass walls dissolve the boundary between room and rainforest. Solar-powered, water-positive, and carbon-neutral — without sacrificing a single comfort.',
    highlights: ['Private tree-line deck', 'Cloud forest canopy walks', 'On-site naturalist guide', 'Farm-to-table dining', 'Zero-carbon operation'],
    amenities: ['King jungle-view bed', 'Rain shower', 'Fire pit terrace', 'Yoga deck', 'Wildlife observation tower'],
    cover: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop',
    ],
    color: '#059669', badge: 'Eco Certified', region: 'Americas',
    atmosphere: 'Wild · Sustainable · Immersive',
  },
  {
    id: 'desert-retreat', name: 'Red Dune Retreat', location: 'Wadi Rum, Jordan',
    category: 'Desert Camp', rating: 4.96, reviews: 187, price: 610,
    tagline: 'Luxury tented camp under a billion stars',
    description: "Wadi Rum's silence is unlike anywhere else on Earth. This tented retreat offers opulent canvas suites with hand-knotted rugs, copper bathtubs, and a private viewing deck for the most extraordinary night skies you will ever witness. Bedouin guides lead dawn camel treks through rose-red canyons.",
    highlights: ['Private stargazing deck', 'Bedouin-hosted dinners', 'Dawn camel trek included', 'Desert yoga at sunrise', 'Hot air balloon option'],
    amenities: ['King brass bed', 'Copper soaking tub', 'Heated floors', 'Private fire pit', 'Telescope & star map'],
    cover: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop',
    ],
    color: '#d97706', badge: 'Most Unique', region: 'Middle East',
    atmosphere: 'Mystical · Silent · Starlit',
  },
  {
    id: 'ryokan', name: 'Hinoki Ryokan', location: 'Hakone, Japan',
    category: 'Ryokan', rating: 4.99, reviews: 156, price: 740,
    tagline: 'Centuries of ritual, reimagined for today',
    description: 'A 200-year-old ryokan tradition meets considered modern luxury. Hinoki (cypress) wood interiors fill the rooms with a clean, meditative scent. Private onsen with Mt Fuji views, kaiseki dinner prepared tableside, and yukata-clad service that anticipates every need before it arises.',
    highlights: ['Private onsen with Fuji view', 'Kaiseki multi-course dinner', 'Tea ceremony session', 'Bamboo meditation garden', 'Traditional ikebana workshop'],
    amenities: ['Futon beds on tatami', 'Hinoki wood bath', 'Shoji screen interiors', 'Kimono lending', 'Sake & matcha bar'],
    cover: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&auto=format&fit=crop',
    ],
    color: '#db2777', badge: 'Culturally Immersive', region: 'Asia',
    atmosphere: 'Meditative · Cultural · Refined',
  },
  {
    id: 'overwater-bungalow', name: 'Lagoon Bungalow', location: 'Bora Bora, French Polynesia',
    category: 'Overwater Bungalow', rating: 4.98, reviews: 203, price: 1100,
    tagline: 'Your floor is the Pacific Ocean',
    description: 'The most iconic accommodation on Earth, perfected. Glass floor panels reveal the living coral reef below while your private deck extends over turquoise water you can dive directly into. Sunrise from your sun lounger, snorkelling before breakfast, and the kind of quiet that resets a nervous system.',
    highlights: ['Glass floor panel over reef', 'Direct ocean entry ladder', 'Coral garden snorkelling', 'Sunset cocktail service', 'Overwater breakfast by request'],
    amenities: ['Overwater deck with loungers', 'Glass floor panels', 'Hammam shower', 'Snorkel equipment', 'Kayak & paddleboard'],
    cover: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&auto=format&fit=crop',
    ],
    color: '#0284c7', badge: 'Iconic', region: 'Pacific',
    atmosphere: 'Tropical · Secluded · Crystalline',
  },
  {
    id: 'alpine-chalet', name: 'Altitude Chalet', location: 'Verbier, Switzerland',
    category: 'Chalet', rating: 4.95, reviews: 94, price: 960,
    tagline: 'Ski-in ski-out, fireplace, and Michelin-level food',
    description: "Verbier's highest private chalet sits directly on the ski run at 2,200m. Stone and reclaimed timber interiors hold a library, wine cellar, and a cinema room. The resident chef holds a Michelin star. Heated floors, a private sauna, and a hot tub carved into the south-facing balcony complete the picture.",
    highlights: ['Ski-in / ski-out access', 'Michelin-starred in-house chef', 'Private wine cellar (300 labels)', 'Hot tub on ski run balcony', 'Snowcat tours on request'],
    amenities: ['6 ensuite bedrooms', 'Cinema room', 'Ski boot room', 'Finnish sauna', 'Library & billiards'],
    cover: 'https://images.unsplash.com/photo-1548703818-f7ceaaac4e28?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548703818-f7ceaaac4e28?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533923156502-be31530547c4?w=900&auto=format&fit=crop',
    ],
    color: '#7c3aed', badge: 'Winter Favourite', region: 'Europe',
    atmosphere: 'Alpine · Cozy · Exclusive',
  },
]

const EXPERIENCES = [
  {
    id: 'deep-sea-dive', name: 'Deep Sea Photography Dive', location: 'Great Barrier Reef, Australia',
    category: 'Underwater', duration: '6 hours', groupSize: 'Max 4', price: 280, difficulty: 'Intermediate',
    tagline: 'Photograph coral gardens untouched by tourism',
    description: 'Led by a National Geographic underwater photographer, this private dive explores a section of the Great Barrier Reef accessible only by private charter. You will photograph manta rays, humphead wrasse, and coral formations that have taken 500 years to grow. All images edited and delivered within 48 hours.',
    includes: ['Private boat charter', 'Full equipment rental', 'NatGeo photographer guide', 'Underwater camera loan', 'Edited photo gallery delivered in 48h'],
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?w=900&auto=format&fit=crop',
    ],
    color: '#0284c7', badge: 'Exclusive',
    whatToExpect: ['Private boat departure at 6am', 'Two dives totalling approx. 100 min', 'Surface lunch on the water', 'Image selection & editing session', 'Transfer back to resort'],
  },
  {
    id: 'aurora-trek', name: 'Northern Lights Trek', location: 'Tromsø, Norway',
    category: 'Adventure', duration: '8 hours', groupSize: 'Max 6', price: 340, difficulty: 'Easy',
    tagline: 'Chase the aurora into the Norwegian wilderness',
    description: 'An expert guide with 15 years of aurora forecasting takes your group by snowmobile into terrain no tour bus will ever reach. A wilderness camp awaits with a roaring fire, reindeer stew, and a clear sky horizon. When the lights appear — and they will — a professional astrophotographer captures the moment.',
    includes: ['Snowmobile & full kit', 'Aurora photography session', 'Wilderness camp dinner', 'Expert guide & forecasting', 'Printed photograph'],
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
    ],
    color: '#7c3aed', badge: 'Bucket List',
    whatToExpect: ['Hotel pick-up at 7pm', 'Snowmobile briefing & practice', 'Drive 45km into wilderness', 'Camp dinner by fire', 'Aurora window 10pm–2am', 'Return by midnight'],
  },
  {
    id: 'truffle-hunt', name: 'Private Truffle Hunt & Feast', location: 'Périgord, France',
    category: 'Culinary', duration: '5 hours', groupSize: 'Max 8', price: 420, difficulty: 'Easy',
    tagline: 'Hunt truffles at dawn, eat them for lunch',
    description: "Join a third-generation trufficulteur and their trained Lagotto dog in the misty Périgord oak forests at dawn. You will unearth black truffles from the earth yourself, then carry them directly to a Michelin-starred chef's kitchen for a 5-course dégustation built entirely around your morning's harvest.",
    includes: ['Expert trufficulteur guide', 'Truffle dog session', 'Michelin-starred lunch (5 courses)', 'Wine pairing by sommelier', 'Truffle souvenir jar'],
    cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop',
    ],
    color: '#92400e', badge: 'Sensory',
    whatToExpect: ['Meet at 6am in forest clearing', 'Hunt with trufficulteur & dog (2h)', 'Market visit with your harvest', 'Michelin kitchen tour', '5-course lunch with pairings', 'Gift jar of preserved truffles'],
  },
  {
    id: 'helicopter-summit', name: 'Helicopter Summit Heli-Ski', location: 'Chamonix, France',
    category: 'Adventure', duration: '7 hours', groupSize: 'Max 4', price: 890, difficulty: 'Expert',
    tagline: 'First tracks on a glacier only helicopters can reach',
    description: 'A certified guide and private helicopter take your group to untouched powder fields in the Mont Blanc massif. The runs you ski today have never been skied before. An alpine lunch is prepared at a hut accessible only on foot or by air. Return to Chamonix with thighs burning and stories no resort skier will ever have.',
    includes: ['Private helicopter transfer', 'IFMGA-certified mountain guide', 'Avalanche safety equipment', 'Alpine hut lunch', 'GoPro footage'],
    cover: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573607217032-18299406d100?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2', badge: 'Adrenaline',
    whatToExpect: ['Safety briefing at helipad 8am', 'Helicopter ascent to 3800m', 'Multiple descent runs (4–6)', 'Alpine hut lunch', 'Snowfall dependent rebooking policy', 'GoPro footage sent same evening'],
  },
  {
    id: 'hot-air-balloon', name: 'Dawn Balloon Over Cappadocia', location: 'Göreme, Turkey',
    category: 'Sky', duration: '3 hours', groupSize: 'Max 16', price: 195, difficulty: 'Easy',
    tagline: 'Drift over fairy chimneys as the sun rises',
    description: "Cappadocia from above is a sight that makes grown adults go silent. Your balloon lifts off before sunrise, reaching elevation just as the first light turns the tuff formations gold. A champagne breakfast is served on landing, and your pilot — with 2,000 hours over these valleys — narrates every moment.",
    includes: ['Sunrise flight (60–90 min)', 'Champagne landing breakfast', 'Certificate of flight', 'Hotel pick-up & drop-off', 'In-flight photography'],
    cover: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&auto=format&fit=crop',
    ],
    color: '#f59e0b', badge: 'Most Popular',
    whatToExpect: ['4:30am hotel pick-up', 'Inflate & briefing (45 min)', 'Flight at first light (75 min)', 'Champagne toast on landing', 'Transfer back to hotel', 'Certificate & photo package'],
  },
  {
    id: 'whale-sail', name: 'Whale Migration Sail', location: 'Azores, Portugal',
    category: 'Wildlife', duration: '9 hours', groupSize: 'Max 10', price: 310, difficulty: 'Easy',
    tagline: 'Sail alongside blue whales in the Atlantic migration route',
    description: 'The Azores sit directly in the Atlantic migration corridor for blue, sperm, and fin whales. Your private yacht follows a marine biologist guide who monitors cetacean radio tags in real time, placing you exactly where the whales will surface. This is not a tour — it is a scientific expedition you get to join.',
    includes: ['Private yacht charter', 'Marine biologist guide', 'Whale radio-tag tracking', 'Underwater hydrophone listening', 'Gourmet picnic lunch'],
    cover: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2', badge: 'Conservation',
    whatToExpect: ['Marina departure 7am', 'Biologist briefing & sonar setup', 'First whale sightings (avg 2h)', 'Hydrophone listening session', 'Picnic lunch at sea', 'Return to marina by 4pm'],
  },
]

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
    itinerary: [
      { day: 1, title: 'Arrival in Santorini', desc: 'Private transfer from airport. Welcome aperitivo at the villa overlooking the caldera.' },
      { day: 2, title: 'Caldera Day', desc: 'Morning cooking class with local chef. Afternoon at leisure. Sunset dinner on the terrace.' },
      { day: 3, title: 'Oia & Fira Exploration', desc: 'Private guided walk through Oia village. Wine tasting at Santo Winery with caldera views.' },
      { day: 4, title: 'Catamaran Cruise', desc: 'Full-day sunset catamaran cruise around the island. Swimming, snorkelling, champagne.' },
      { day: 5, title: 'Yacht to Mykonos', desc: 'Private luxury yacht transfer (3.5 hours). Afternoon arrival and villa welcome.' },
      { day: 6, title: 'Mykonos Day', desc: 'Private beach club access. Mykonos Town exploration. Sunset cocktails at Little Venice.' },
      { day: 7, title: 'Final Morning', desc: 'Farewell breakfast. Airport transfer for departure.' },
    ],
    cover: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&auto=format&fit=crop',
    ],
    color: '#0891b2',
  },
  {
    id: 'japan-ritual', name: 'Japan Ritual Circuit', location: 'Tokyo + Kyoto + Hakone, Japan',
    duration: '10 nights', price: 9400, pricePer: 'per person',
    tagline: 'Urban energy, ancient ceremony, volcanic stillness',
    badge: "Editor's Choice",
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
    itinerary: [
      { day: 1, title: 'Arrive Tokyo', desc: 'Private airport transfer. Evening rooftop dinner in Shinjuku.' },
      { day: 2, title: 'Tokyo Deep Dive', desc: 'Private Tsukiji market tour. Shibuya & Harajuku with a local guide. Izakaya dinner.' },
      { day: 3, title: 'Tokyo to Kyoto', desc: 'Morning shinkansen. Afternoon in Fushimi Inari shrine at closing time.' },
      { day: 4, title: 'Kyoto Ceremonies', desc: 'Private tea ceremony at dawn. Bamboo forest sunrise photography session.' },
      { day: 5, title: 'Geisha Evening', desc: 'Nishiki Market private tour. Exclusive geisha dinner performance in Gion.' },
      { day: 6, title: 'Arashiyama & Nijo', desc: 'Boat ride on Oi River. Nijo Castle private tour after closing.' },
      { day: 7, title: 'Sake Master Day', desc: 'Morning sake brewery tour with master. Afternoon free. Train to Hakone.' },
      { day: 8, title: 'Hakone Arrival', desc: 'Check in to Hinoki Ryokan. Private onsen at sunset with Fuji views.' },
      { day: 9, title: 'Fuji & Stillness', desc: 'Morning Fuji lake boat. Kaiseki dinner prepared at the table.' },
      { day: 10, title: 'Departure', desc: 'Final onsen breakfast. Shinkansen back to Tokyo for departure.' },
    ],
    cover: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&auto=format&fit=crop',
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
    itinerary: [
      { day: 1, title: 'Arrive Tromsø', desc: 'Arctic glass cabin check-in. First aurora forecast briefing.' },
      { day: 2, title: 'Aurora Trek Night 1', desc: 'Snowmobile trek into wilderness. First aurora hunt begins.' },
      { day: 3, title: 'Dog Sled Day', desc: 'Half-day dog sledding through fjord valley. Sauna & recovery evening.' },
      { day: 4, title: 'Aurora Night 2', desc: 'Second aurora window. Astrophotographer session.' },
      { day: 5, title: 'Fly to Svalbard', desc: 'Private aircraft to Longyearbyen. Expedition lodge arrival.' },
      { day: 6, title: 'Polar Wildlife', desc: 'Zodiac excursion: polar bear tracking at glacier edge.' },
      { day: 7, title: 'Sea Ice Day', desc: 'Guided sea ice walk. Arctic fox observation. Michelin dinner.' },
      { day: 8, title: 'Departure', desc: 'Final morning at the lodge. Flight south.' },
    ],
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop',
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
    itinerary: [
      { day: 1, title: 'Arrive Wadi Rum', desc: '4WD desert pick-up. Sunset camel trek. Bedouin star-gazing feast.' },
      { day: 2, title: 'Wadi Rum Depths', desc: 'Morning jeep safari in red canyons. Afternoon at camp under the sun.' },
      { day: 3, title: 'Petra Arrival', desc: 'Drive to Petra. Cave hotel check-in. Evening walk through the Siq.' },
      { day: 4, title: 'Petra at Dawn', desc: 'Private archaeologist tour before gates open (5am). Full day exploring.' },
      { day: 5, title: 'Dead Sea Transfer', desc: 'Morning drive to Dead Sea. Resort arrival. Float therapy session.' },
      { day: 6, title: 'Departure', desc: 'Final float, mineral spa, and transfer to Amman airport.' },
    ],
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop',
    ],
    color: '#d97706',
  },
]

const TEAM = [
  { name: 'Sofia Almeria', role: 'Founder & Head Curator', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop', bio: "Former Condé Nast Traveller editor. 20 years sourcing the world's most exceptional hidden stays." },
  { name: 'Kenji Watanabe', role: 'Asia & Pacific Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop', bio: 'Based between Tokyo and Bali. Specialises in slow travel itineraries across Japan, Indonesia and Sri Lanka.' },
  { name: 'Amara Diallo', role: 'Africa & Middle East', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop', bio: 'Safari specialist and wilderness guide with 15 years across East Africa, Morocco and Jordan.' },
  { name: 'Lars Eriksson', role: 'Arctic & Alpine Specialist', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop', bio: 'Expedition mountaineer turned luxury travel curator. Knows every heli-ski corridor in the Alps and Scandinavia.' },
]

const TESTIMONIALS = [
  {
    name: 'Charlotte & Marcus Webb', role: 'Anniversary trip, Bora Bora',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&auto=format&fit=crop',
    text: 'VELYR knew our anniversary was approaching before we did. The overwater bungalow had rose petals on the deck, a private chef, and a bottle of wine from the year we met. We cried. Twice.',
    rating: 5, location: 'Bora Bora, French Polynesia',
  },
  {
    name: 'Takeshi Mori', role: 'Japan Ritual Circuit',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
    text: "I have been to Japan four times. VELYR's Japan circuit showed me a country I had never seen before. Private geisha dinner, bamboo forest at dawn with no one else — it felt like having Japan as a private estate.",
    rating: 5, location: 'Hakone, Japan',
  },
  {
    name: 'Priya Nair', role: 'Arctic Wonder Week',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
    text: 'Seeing polar bears from a zodiac ten metres away, then eating an eight-course dinner in a heated glass lodge under the northern lights the same evening. I still don\'t believe it happened.',
    rating: 5, location: 'Svalbard, Norway',
  },
]

const STATS = [
  { value: '140+', label: 'Curated Destinations', icon: 'map-pin-2-fill' },
  { value: '98%',  label: 'Guest Return Rate',    icon: 'heart-fill'          },
  { value: '18yrs',label: 'Curating Experiences', icon: 'calendar-check-fill' },
  { value: '52',   label: 'Countries',            icon: 'earth-line'          },
]

const THEME_MODES = [
  { id: 'dark',  icon: 'moon-fill',       label: 'Night' },
  { id: 'light', icon: 'sun-fill',        label: 'Day'   },
  { id: 'neon',  icon: 'flashlight-fill', label: 'Neon'  },
  { id: 'ember', icon: 'fire-fill',       label: 'Dusk'  },
]

const DEST_CATEGORIES = [
  { label: 'Beach & Ocean', icon: 'sun-line', img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&auto=format&fit=crop', count: 24 },
  { label: 'Mountain & Snow', icon: 'landscape-line', img: 'https://images.unsplash.com/photo-1548703818-f7ceaaac4e28?w=600&auto=format&fit=crop', count: 18 },
  { label: 'Desert & Dunes', icon: 'ancient-pavilion-line', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&auto=format&fit=crop', count: 12 },
  { label: 'Jungle & Forest', icon: 'plant-line', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop', count: 16 },
  { label: 'Cultural Cities', icon: 'building-2-line', img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&auto=format&fit=crop', count: 30 },
  { label: 'Arctic & Polar', icon: 'snowy-line', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop', count: 8 },
]

const WHY_US = [
  { icon: 'shield-check-line', title: 'No paid placements', desc: 'Every stay, experience and package is listed on merit alone. No commercial relationships influence our selection.' },
  { icon: 'user-star-line',    title: 'In-country curators', desc: 'Each region is managed by a specialist who lives there and visits every property in person, every year.' },
  { icon: 'service-line',      title: 'One point of contact', desc: 'A single concierge handles your entire journey — from first enquiry to post-trip follow-up.' },
  { icon: 'award-line',        title: 'Guaranteed as described', desc: 'If a property or experience falls short of our description, we make it right at our own cost.' },
]

/* ═══════════════════════════════
   THEME SWITCHER
═══════════════════════════════ */
function ThemeSwitcher({ mode, setMode }) {
  return (
    <div className="vl-theme-sw">
      {THEME_MODES.map(({ id, icon, label }) => (
        <button key={id}
          className={`vl-theme-btn${mode === id ? ' vl-theme-btn--on' : ''}`}
          onClick={() => { setMode(id); localStorage.setItem('velyr-mode', id) }}
          title={label} aria-label={`${label} mode`}>
          <I n={icon} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════
   VELYR LOGO MARK
═══════════════════════════════ */
function VelyrLogo({ size = 'md' }) {
  return (
    <Link to="/" className={`vl-logo vl-logo--${size}`}>
      <span className="vl-logo__mark" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M14 7L21 11V17L14 21L7 17V11L14 7Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
          <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        </svg>
      </span>
      <span className="vl-logo__text">
        <span className="vl-logo__name">VELYR</span>
        <span className="vl-logo__tagline">Rare Journeys</span>
      </span>
    </Link>
  )
}

/* ═══════════════════════════════
   SITE HEADER
═══════════════════════════════ */
function SiteHeader({ mode, setMode }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const navLinks = [
    { label: 'Stays',       to: '/stay',        icon: 'hotel-line'     },
    { label: 'Activities',  to: '/experiences', icon: 'compass-3-line' },
    { label: 'Packages',    to: '/packages',    icon: 'gift-2-line'    },
    { label: 'About',       to: '/about',       icon: 'team-line'      },
  ]

  return (
    <header className={`vl-header${scrolled ? ' vl-header--scrolled' : ''}`}>
      <div className="vl-header__inner contain">
        <VelyrLogo />
        <nav className="vl-nav" aria-label="Primary">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `vl-nav__link${isActive ? ' vl-nav__link--on' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="vl-header__right">
          <ThemeSwitcher mode={mode} setMode={setMode} />
          <Link to="/packages" className="vl-book-btn">
            <I n="sparkling-2-line" /> Plan a Journey
          </Link>
          <button className="vl-burger" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Menu">
            <span className={`vl-burger__bar${open ? ' vl-burger__bar--x' : ''}`}><span/><span/><span/></span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && <button className="vl-overlay" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <div className={`vl-drawer${open ? ' vl-drawer--open' : ''}`}>
        <div className="vl-drawer__head">
          <VelyrLogo />
          <button onClick={() => setOpen(false)} className="vl-drawer__close" aria-label="Close"><I n="close-line" /></button>
        </div>
        <nav className="vl-drawer__nav">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} className="vl-drawer__link" onClick={() => setOpen(false)}>
              <I n={l.icon} />
              <span>{l.label}</span>
              <I n="arrow-right-s-line" className="vl-drawer__arrow" />
            </NavLink>
          ))}
        </nav>
        <div className="vl-drawer__foot">
          <ThemeSwitcher mode={mode} setMode={setMode} />
          <Link to="/packages" className="vl-book-btn vl-book-btn--full" onClick={() => setOpen(false)}>
            <I n="sparkling-2-line" /> Plan a Journey
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ═══════════════════════════════
   FADE-IN WRAPPER
═══════════════════════════════ */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useFadeIn()
  return (
    <div ref={ref} className={`vl-reveal${visible ? ' vl-reveal--on' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════
   CARD COMPONENTS
═══════════════════════════════ */
function StayCard({ item, featured }) {
  return (
    <article className={`vl-stay-card${featured ? ' vl-stay-card--feat' : ''}`} style={{ '--c': item.color }}>
      <Link to={`/stay/${item.id}`} className="vl-stay-card__img">
        <img src={item.cover} alt={item.name} loading="lazy" />
        <div className="vl-stay-card__veil" />
        {item.badge && <span className="vl-badge">{item.badge}</span>}
        <div className="vl-stay-card__region"><I n="map-pin-2-line" /> {item.region}</div>
        <div className="vl-stay-card__hover">Explore <I n="arrow-right-up-line" /></div>
      </Link>
      <div className="vl-stay-card__body">
        <div className="vl-stay-card__row">
          <span className="vl-stay-card__loc"><I n="map-pin-line" />{item.location}</span>
          <span className="vl-stay-card__rat"><I n="star-fill" />{item.rating}</span>
        </div>
        <h3><Link to={`/stay/${item.id}`}>{item.name}</Link></h3>
        <p className="vl-stay-card__atmo">{item.atmosphere}</p>
        <div className="vl-stay-card__foot">
          <div className="vl-stay-card__price">
            <strong>${item.price.toLocaleString()}</strong>
            <span> /night</span>
          </div>
          <Link to={`/stay/${item.id}`} className="vl-pill-btn">View <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </article>
  )
}

function ExpCard({ item }) {
  const diffClass = `vl-diff--${item.difficulty.toLowerCase()}`
  return (
    <article className="vl-exp-card" style={{ '--c': item.color }}>
      <Link to={`/experiences/${item.id}`} className="vl-exp-card__img">
        <img src={item.cover} alt={item.name} loading="lazy" />
        <div className="vl-exp-card__veil" />
        {item.badge && <span className="vl-badge">{item.badge}</span>}
        <div className="vl-exp-card__meta">
          <span><I n="time-line" />{item.duration}</span>
          <span><I n="group-line" />{item.groupSize}</span>
          <span className={`vl-diff ${diffClass}`}>{item.difficulty}</span>
        </div>
      </Link>
      <div className="vl-exp-card__body">
        <span className="vl-exp-card__cat"><I n="map-pin-line" />{item.location}</span>
        <h3><Link to={`/experiences/${item.id}`}>{item.name}</Link></h3>
        <p>{item.tagline}</p>
        <div className="vl-exp-card__foot">
          <span className="vl-stay-card__price"><strong>${item.price}</strong><span> /person</span></span>
          <Link to={`/experiences/${item.id}`} className="vl-pill-btn">Book <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </article>
  )
}

function PkgCard({ item }) {
  return (
    <article className="vl-pkg-card" style={{ '--c': item.color }}>
      <Link to={`/packages/${item.id}`} className="vl-pkg-card__img">
        <img src={item.cover} alt={item.name} loading="lazy" />
        <div className="vl-pkg-card__veil" />
        {item.badge && <span className="vl-badge">{item.badge}</span>}
        <div className="vl-pkg-card__dur"><I n="calendar-2-line" />{item.duration}</div>
      </Link>
      <div className="vl-pkg-card__body">
        <span className="vl-exp-card__cat"><I n="map-pin-line" />{item.location}</span>
        <h3><Link to={`/packages/${item.id}`}>{item.name}</Link></h3>
        <p>{item.tagline}</p>
        <div className="vl-exp-card__foot">
          <span className="vl-stay-card__price"><strong>${item.price.toLocaleString()}</strong><span> /{item.pricePer}</span></span>
          <Link to={`/packages/${item.id}`} className="vl-pill-btn">View <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </article>
  )
}

function Stars({ n }) {
  return <span className="vl-stars">{'★'.repeat(n)}</span>
}

/* ═══════════════════════════════
   HOME PAGE
═══════════════════════════════ */
function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [testIdx, setTestIdx] = useState(0)
  const heroItems = STAYS.slice(0, 4)

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroItems.length), 5500)
    return () => clearInterval(t)
  }, [heroItems.length])

  const active = heroItems[heroIdx]

  return (
    <>
      {/* ── HERO (unchanged) ── */}
      <section className="rv-hero" style={{ '--hero-color': active.color }}>
        <div className="rv-hero__slides">
          {heroItems.map((item, i) => (
            <div key={item.id} className={`rv-hero__slide${i === heroIdx ? ' rv-hero__slide--active' : ''}`}>
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
          <p className="rv-hero__sub">Curated stays, rare experiences and seamlessly crafted journeys — for those who travel to feel, not just to see.</p>
          <div className="rv-hero__actions">
            <Link to="/packages" className="rv-hero__cta"><I n="sparkling-2-line" /> Discover Packages</Link>
            <Link to="/stay" className="rv-hero__ghost">Browse Stays <I n="arrow-right-line" /></Link>
          </div>
        </div>
        <div className="rv-hero__thumbs">
          {heroItems.map((item, i) => (
            <button key={item.id} className={`rv-hero__thumb${i === heroIdx ? ' rv-hero__thumb--active' : ''}`} onClick={() => setHeroIdx(i)}>
              <img src={item.cover} alt={item.name} />
              <div className="rv-hero__thumb-info"><strong>{item.name}</strong><span>{item.location}</span></div>
              <div className="rv-hero__thumb-progress" style={{ '--dur': '5.5s' }} />
            </button>
          ))}
        </div>
        <div className="rv-hero__scroll-hint" aria-hidden="true"><span>Scroll</span><I n="arrow-down-line" /></div>
      </section>

      {/* ── ANIMATED STATS STRIP ── */}
      <div className="vl-stats-strip">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="vl-stats-strip__item">
            <I n={s.icon} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>

      {/* ── DESTINATION CATEGORIES ── */}
      <section className="vl-section">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head">
              <div>
                <span className="vl-eyebrow"><I n="compass-discover-line" /> Explore by Type</span>
                <h2>Where Does Your Story Begin?</h2>
              </div>
            </div>
          </Reveal>
          <div className="vl-dest-grid">
            {DEST_CATEGORIES.map((d, i) => (
              <Reveal key={d.label} delay={i * 60}>
                <Link to="/stay" className="vl-dest-card">
                  <img src={d.img} alt={d.label} loading="lazy" />
                  <div className="vl-dest-card__veil" />
                  <div className="vl-dest-card__body">
                    <I n={d.icon} />
                    <strong>{d.label}</strong>
                    <span>{d.count} destinations</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STAYS ── */}
      <section className="vl-section vl-section--alt">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head">
              <div>
                <span className="vl-eyebrow"><I n="hotel-line" /> Accommodations</span>
                <h2>Where You'll Rest</h2>
              </div>
              <Link to="/stay" className="vl-see-all">All Stays <I n="arrow-right-line" /></Link>
            </div>
          </Reveal>
          <div className="vl-stays-grid">
            {STAYS.slice(0, 3).map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <StayCard item={s} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="vl-marq" aria-hidden="true">
        <div className="vl-marq__track">
          {[...EXPERIENCES, ...EXPERIENCES].map((e, i) => (
            <span key={i} className="vl-marq__pill"><I n="sparkling-2-line" />{e.name}</span>
          ))}
        </div>
      </div>

      {/* ── EDITORIAL SPOTLIGHT ── */}
      <section className="vl-section">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head vl-sec-head--center">
              <span className="vl-eyebrow"><I n="newspaper-line" /> Curator's Pick</span>
              <h2>Journey of the Season</h2>
              <p className="vl-sec-sub">Our head curator selects one extraordinary journey each season — chosen for uniqueness, timing, and the memories it creates.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="vl-spotlight">
              <div className="vl-spotlight__img">
                <img src={PACKAGES[1].cover} alt={PACKAGES[1].name} />
                <div className="vl-spotlight__veil" />
                <div className="vl-spotlight__label">
                  <span className="vl-badge">Season Pick</span>
                  <span><I n="calendar-2-line" /> {PACKAGES[1].duration}</span>
                </div>
              </div>
              <div className="vl-spotlight__body">
                <span className="vl-eyebrow"><I n="map-pin-2-line" />{PACKAGES[1].location}</span>
                <h3>{PACKAGES[1].name}</h3>
                <p className="vl-spotlight__tagline">"{PACKAGES[1].tagline}"</p>
                <p className="vl-spotlight__desc">{PACKAGES[1].description}</p>
                <div className="vl-spotlight__includes">
                  {PACKAGES[1].includes.slice(0, 4).map(inc => (
                    <span key={inc}><I n="check-line" />{inc}</span>
                  ))}
                </div>
                <div className="vl-spotlight__foot">
                  <div>
                    <span className="vl-spotlight__from">From</span>
                    <strong className="vl-spotlight__price">${PACKAGES[1].price.toLocaleString()}</strong>
                    <span className="vl-spotlight__per"> /{PACKAGES[1].pricePer}</span>
                  </div>
                  <Link to={`/packages/${PACKAGES[1].id}`} className="vl-btn-primary">
                    View Full Itinerary <I n="arrow-right-line" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED ACTIVITIES ── */}
      <section className="vl-section vl-section--alt">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head">
              <div>
                <span className="vl-eyebrow"><I n="compass-3-line" /> Activities</span>
                <h2>Moments Worth Having</h2>
              </div>
              <Link to="/experiences" className="vl-see-all">All Activities <I n="arrow-right-line" /></Link>
            </div>
          </Reveal>
          <div className="vl-exp-grid">
            {EXPERIENCES.slice(0, 4).map((e, i) => (
              <Reveal key={e.id} delay={i * 70}>
                <ExpCard item={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY VELYR ── */}
      <section className="vl-section vl-why">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head vl-sec-head--center">
              <span className="vl-eyebrow"><I n="award-line" /> Why VELYR</span>
              <h2>Curation Over Commission</h2>
              <p className="vl-sec-sub">Every choice we make serves only one person: you.</p>
            </div>
          </Reveal>
          <div className="vl-why__grid">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="vl-why__card">
                  <div className="vl-why__icon"><I n={w.icon} /></div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="vl-section vl-section--alt">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head vl-sec-head--center">
              <span className="vl-eyebrow"><I n="gift-2-line" /> Packages</span>
              <h2>Complete Journeys</h2>
              <p className="vl-sec-sub">Every detail handled. Every moment considered. Just arrive.</p>
            </div>
          </Reveal>
          <div className="vl-pkg-grid">
            {PACKAGES.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <PkgCard item={p} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="vl-sec-cta">
              <Link to="/packages" className="vl-btn-primary">All Packages <I n="arrow-right-line" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="vl-section vl-testimonials-sec">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head vl-sec-head--center">
              <span className="vl-eyebrow"><I n="double-quotes-l" /> Guest Stories</span>
              <h2>Why Travellers Return</h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="vl-test-wrap">
              <div className="vl-test-track" style={{ transform: `translateX(-${testIdx * 100}%)` }}>
                {TESTIMONIALS.map((t, i) => (
                  <article className="vl-testimonial" key={i}>
                    <Stars n={t.rating} />
                    <blockquote>"{t.text}"</blockquote>
                    <div className="vl-test-loc"><I n="map-pin-line" />{t.location}</div>
                    <cite>
                      <img src={t.img} alt={t.name} />
                      <div><strong>{t.name}</strong><span>{t.role}</span></div>
                    </cite>
                  </article>
                ))}
              </div>
            </div>
            <div className="vl-test-nav">
              <button onClick={() => setTestIdx(i => Math.max(0, i - 1))} className="vl-test-arrow" disabled={testIdx === 0}><I n="arrow-left-line" /></button>
              <div className="vl-test-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} className={`vl-dot${testIdx === i ? ' vl-dot--on' : ''}`} onClick={() => setTestIdx(i)} />
                ))}
              </div>
              <button onClick={() => setTestIdx(i => Math.min(TESTIMONIALS.length - 1, i + 1))} className="vl-test-arrow" disabled={testIdx === TESTIMONIALS.length - 1}><I n="arrow-right-line" /></button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FULL-BLEED CTA ── */}
      <section className="vl-cta-band">
        <div className="vl-cta-band__bg" aria-hidden="true" />
        <div className="contain vl-cta-band__inner">
          <Reveal>
            <span className="vl-eyebrow vl-eyebrow--light"><I n="sparkling-2-line" /> Let's Begin</span>
            <h2>Where Do You Want to<br /><span className="vl-gradient-text">Feel Alive?</span></h2>
            <p>Tell us what moves you. We'll craft an itinerary you'll describe for the rest of your life.</p>
            <div className="vl-cta-band__actions">
              <Link to="/packages" className="vl-btn-primary">Start Planning <I n="arrow-right-line" /></Link>
              <Link to="/about" className="vl-btn-ghost">Meet Our Curators</Link>
            </div>
          </Reveal>
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
    <main className="vl-about">
      <section className="vl-page-hero vl-page-hero--about">
        <div className="vl-page-hero__veil" />
        <div className="contain">
          <Reveal>
            <span className="vl-eyebrow vl-eyebrow--light">Our Story</span>
            <h1>Travel That Changes You</h1>
            <p>VELYR was founded on a single belief: extraordinary travel should be accessible to those who seek it, not just those who stumble upon it.</p>
          </Reveal>
        </div>
      </section>

      <section className="vl-section">
        <div className="contain vl-about__intro">
          <Reveal>
            <div className="vl-about__text">
              <h2>Why We Exist</h2>
              <p>Most travel platforms are built around paid placements and algorithmic recommendations. We're different — every destination, stay, and experience on VELYR has been visited by a member of our team. If we wouldn't go back, we won't list it.</p>
              <p>Our curators live in the places you dream of visiting. They know the hidden valley restaurant, the guide who'll take you off the beaten path, and the best season to witness something unforgettable.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="vl-about__stats">
              {STATS.map(s => (
                <div key={s.label} className="vl-about__stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="vl-section vl-section--alt">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head vl-sec-head--center">
              <span className="vl-eyebrow">The Team</span>
              <h2>Meet Our Curators</h2>
              <p className="vl-sec-sub">Travel obsessives, former guides, and local insiders who live the journeys they create.</p>
            </div>
          </Reveal>
          <div className="vl-team-grid">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <div className="vl-team-card">
                  <div className="vl-team-card__img"><img src={m.img} alt={m.name} /></div>
                  <h4>{m.name}</h4>
                  <span>{m.role}</span>
                  <p>{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="vl-section">
        <div className="contain">
          <Reveal>
            <div className="vl-sec-head vl-sec-head--center">
              <span className="vl-eyebrow">Our Promise</span>
              <h2>The VELYR Standard</h2>
            </div>
          </Reveal>
          <div className="vl-why__grid">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="vl-why__card">
                  <div className="vl-why__icon"><I n={w.icon} /></div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

/* ═══════════════════════════════
   STAYS LIST PAGE
═══════════════════════════════ */
function StaysPage() {
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...new Set(STAYS.map(s => s.category))]
  const shown = filter === 'All' ? STAYS : STAYS.filter(s => s.category === filter)

  return (
    <main className="vl-list-page">
      <section className="vl-page-hero vl-page-hero--stays">
        <div className="vl-page-hero__veil" />
        <div className="contain">
          <Reveal>
            <span className="vl-eyebrow vl-eyebrow--light">Accommodations</span>
            <h1>Where You'll Rest</h1>
            <p>From overwater villas to mountain retreats — each stay hand-selected for the story it tells.</p>
          </Reveal>
        </div>
      </section>
      <div className="contain">
        <div className="vl-filter-bar">
          {cats.map(c => (
            <button key={c} className={`vl-filter-btn${filter === c ? ' vl-filter-btn--on' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="vl-cards-grid">
          {shown.map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <StayCard item={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  )
}

/* ═══════════════════════════════
   STAY DETAIL PAGE — Immersive
═══════════════════════════════ */
function StayDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const item = STAYS.find(s => s.id === id)
  const [imgIdx, setImgIdx] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `scale(1.08) translateY(${y * 0.25}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!item) return <NotFound />

  const related = STAYS.filter(s => s.id !== item.id && s.category === item.category).slice(0, 3)

  return (
    <main className="vl-stay-detail">
      {/* HERO */}
      <div className="vl-stay-detail__hero-wrap" style={{ '--ac': item.color }}>
        <div className="vl-stay-detail__hero-img">
          <img ref={heroRef} src={item.cover} alt={item.name} />
          <div className="vl-stay-detail__hero-veil" />
        </div>
        <div className="vl-stay-detail__hero-content contain">
          <Reveal>
            <button className="vl-back-btn" onClick={() => nav(-1)}><I n="arrow-left-line" /> All Stays</button>
            <div className="vl-stay-detail__meta">
              <span className="vl-badge">{item.badge}</span>
              <span className="vl-stay-detail__cat">{item.category}</span>
            </div>
            <h1>{item.name}</h1>
            <div className="vl-stay-detail__loc"><I n="map-pin-2-fill" />{item.location}</div>
            <div className="vl-stay-detail__rating">
              <Stars n={item.rating} /><span>{item.rating}</span><span className="vl-rev-count">({item.reviews} reviews)</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* GALLERY STRIP */}
      <div className="vl-gallery-strip contain">
        {item.images.map((img, i) => (
          <button key={i} className={`vl-gallery-strip__item${imgIdx === i ? ' vl-gallery-strip__item--on' : ''}`} onClick={() => setImgIdx(i)}>
            <img src={img} alt={`View ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {/* BODY */}
      <div className="vl-stay-detail__body contain">
        <div className="vl-stay-detail__main">
          {/* ATMOSPHERE TAGS */}
          <Reveal>
            <div className="vl-atmosphere">
              {item.atmosphere.map(a => <span key={a} className="vl-atmo-tag">{a}</span>)}
            </div>
          </Reveal>

          <Reveal delay={60}>
            <p className="vl-stay-detail__tagline">"{item.tagline}"</p>
            <p className="vl-stay-detail__desc">{item.description}</p>
          </Reveal>

          {/* HIGHLIGHTS */}
          <Reveal delay={80}>
            <h3>Highlights</h3>
            <ul className="vl-highlights-list">
              {item.highlights.map(h => <li key={h}><I n="check-double-line" />{h}</li>)}
            </ul>
          </Reveal>

          {/* AMENITIES */}
          <Reveal delay={100}>
            <h3>Amenities</h3>
            <div className="vl-amenities-grid">
              {item.amenities.map(a => (
                <span key={a} className="vl-amenity"><I n="check-line" />{a}</span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* BOOKING PANEL */}
        <aside className="vl-stay-detail__book-panel">
          <div className="vl-book-panel">
            <div className="vl-book-panel__price">
              <span>From</span>
              <strong>${item.price.toLocaleString()}</strong>
              <span>/night</span>
            </div>
            <div className="vl-book-panel__region"><I n="globe-line" />{item.region}</div>
            <div className="vl-book-panel__rating"><Stars n={item.rating} /> {item.rating} · {item.reviews} reviews</div>
            <hr />
            <ul className="vl-book-panel__features">
              {item.highlights.slice(0, 3).map(h => <li key={h}><I n="check-line" />{h}</li>)}
            </ul>
            <button className="vl-btn-primary vl-btn-primary--full">
              <I n="calendar-check-line" /> Book This Stay
            </button>
            <p className="vl-book-panel__note">Free cancellation within 48 hours</p>
          </div>
        </aside>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="vl-section vl-section--alt">
          <div className="contain">
            <Reveal>
              <div className="vl-sec-head">
                <h3>You Might Also Love</h3>
              </div>
            </Reveal>
            <div className="vl-cards-grid">
              {related.map((s, i) => (
                <Reveal key={s.id} delay={i * 70}>
                  <StayCard item={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

/* ═══════════════════════════════
   EXPERIENCES LIST PAGE
═══════════════════════════════ */
function ExperiencesPage() {
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...new Set(EXPERIENCES.map(e => e.category))]
  const shown = filter === 'All' ? EXPERIENCES : EXPERIENCES.filter(e => e.category === filter)

  return (
    <main className="vl-list-page">
      <section className="vl-page-hero vl-page-hero--exp">
        <div className="vl-page-hero__veil" />
        <div className="contain">
          <Reveal>
            <span className="vl-eyebrow vl-eyebrow--light">Activities</span>
            <h1>Moments Worth Having</h1>
            <p>Guided experiences curated by those who know the land, sea, and sky better than anyone.</p>
          </Reveal>
        </div>
      </section>
      <div className="contain">
        <div className="vl-filter-bar">
          {cats.map(c => (
            <button key={c} className={`vl-filter-btn${filter === c ? ' vl-filter-btn--on' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="vl-cards-grid vl-cards-grid--exp">
          {shown.map((e, i) => (
            <Reveal key={e.id} delay={i * 60}>
              <ExpCard item={e} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  )
}

/* ═══════════════════════════════
   EXPERIENCE DETAIL — Event Poster Style
═══════════════════════════════ */
function ExperienceDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const item = EXPERIENCES.find(e => e.id === id)

  if (!item) return <NotFound />

  return (
    <main className="vl-exp-detail" style={{ '--ac': item.color }}>
      {/* DARK DRAMATIC HERO */}
      <div className="vl-exp-detail__hero">
        <img src={item.cover} alt={item.name} />
        <div className="vl-exp-detail__hero-veil" />
        <div className="contain vl-exp-detail__hero-content">
          <Reveal>
            <button className="vl-back-btn" onClick={() => nav(-1)}><I n="arrow-left-line" /> All Activities</button>
          </Reveal>
          <Reveal delay={80}>
            <span className={`vl-diff vl-diff--${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
            <span className="vl-badge" style={{ marginLeft: '0.5rem' }}>{item.badge}</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="vl-exp-detail__title">{item.name}</h1>
            <div className="vl-exp-detail__loc"><I n="map-pin-2-fill" />{item.location}</div>
          </Reveal>
        </div>
        <div className="vl-exp-detail__infobar">
          <div className="vl-exp-detail__chip"><I n="time-line" /><span>{item.duration}</span></div>
          <div className="vl-exp-detail__chip"><I n="group-line" /><span>{item.groupSize}</span></div>
          <div className="vl-exp-detail__chip"><I n="map-pin-line" /><span>{item.location}</span></div>
          <div className="vl-exp-detail__chip vl-exp-detail__chip--price"><I n="price-tag-3-line" /><strong>${item.price.toLocaleString()}</strong><span>/person</span></div>
        </div>
      </div>

      {/* BODY */}
      <div className="vl-exp-detail__body contain">
        <div className="vl-exp-detail__col-main">
          <Reveal>
            <p className="vl-exp-detail__tagline">"{item.tagline}"</p>
            <p className="vl-exp-detail__desc">{item.description}</p>
          </Reveal>

          {/* WHAT TO EXPECT TIMELINE */}
          <Reveal delay={80}>
            <h3>What to Expect</h3>
          </Reveal>
          <div className="vl-timeline">
            {item.whatToExpect.map((step, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="vl-timeline__item">
                  <div className="vl-timeline__marker">{i + 1}</div>
                  <div className="vl-timeline__content">{step}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* SECOND IMAGE */}
          <Reveal delay={100}>
            <div className="vl-exp-detail__mid-img">
              <img src={item.images[1] || item.cover} alt={item.name} loading="lazy" />
            </div>
          </Reveal>
        </div>

        <aside className="vl-exp-detail__col-side">
          {/* INCLUDES */}
          <Reveal>
            <div className="vl-exp-detail__includes-box">
              <h4>What's Included</h4>
              <ul>
                {item.includes.map(inc => <li key={inc}><I n="check-double-line" />{inc}</li>)}
              </ul>
            </div>
          </Reveal>

          {/* BOOK */}
          <Reveal delay={80}>
            <div className="vl-exp-detail__book-box">
              <div className="vl-exp-detail__book-price">
                <strong>${item.price.toLocaleString()}</strong>
                <span>/person</span>
              </div>
              <button className="vl-btn-primary vl-btn-primary--full">
                <I n="calendar-check-line" /> Reserve Spot
              </button>
              <p className="vl-book-panel__note">Small group — spots fill fast</p>
            </div>
          </Reveal>
        </aside>
      </div>
    </main>
  )
}

/* ═══════════════════════════════
   PACKAGES LIST PAGE
═══════════════════════════════ */
function PackagesPage() {
  return (
    <main className="vl-list-page">
      <section className="vl-page-hero vl-page-hero--pkg">
        <div className="vl-page-hero__veil" />
        <div className="contain">
          <Reveal>
            <span className="vl-eyebrow vl-eyebrow--light">Curated Journeys</span>
            <h1>Complete Packages</h1>
            <p>Every detail handled. Every moment considered. You just have to show up.</p>
          </Reveal>
        </div>
      </section>
      <div className="contain">
        <div className="vl-pkg-list-grid">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <PkgCard item={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  )
}

/* ═══════════════════════════════
   PACKAGE DETAIL — Luxury Itinerary
═══════════════════════════════ */
function PackageDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const item = PACKAGES.find(p => p.id === id)

  if (!item) return <NotFound />

  const stayData = STAYS.find(s => s.name === item.stay)

  return (
    <main className="vl-pkg-detail" style={{ '--ac': item.color }}>
      {/* HERO */}
      <div className="vl-pkg-detail__hero">
        <img src={item.cover} alt={item.name} />
        <div className="vl-pkg-detail__hero-veil" />
        <div className="contain vl-pkg-detail__hero-content">
          <Reveal>
            <button className="vl-back-btn" onClick={() => nav(-1)}><I n="arrow-left-line" /> All Packages</button>
          </Reveal>
          <Reveal delay={80}>
            <span className="vl-badge">{item.badge}</span>
            <span className="vl-pkg-detail__dur"><I n="calendar-2-line" />{item.duration}</span>
          </Reveal>
          <Reveal delay={140}>
            <h1>{item.name}</h1>
            <div className="vl-pkg-detail__loc"><I n="map-pin-2-fill" />{item.location}</div>
          </Reveal>
        </div>
      </div>

      {/* BODY */}
      <div className="vl-pkg-detail__body contain">
        <div className="vl-pkg-detail__main">
          <Reveal>
            <p className="vl-pkg-detail__tagline">"{item.tagline}"</p>
            <p className="vl-pkg-detail__desc">{item.description}</p>
          </Reveal>

          {/* ITINERARY */}
          <Reveal delay={60}>
            <h3>Day-by-Day Itinerary</h3>
          </Reveal>
          <div className="vl-itinerary">
            {item.itinerary.map((day, i) => (
              <Reveal key={day.day} delay={i * 55}>
                <div className="vl-itinerary__item">
                  <div className="vl-itinerary__num">Day {day.day}</div>
                  <div className="vl-itinerary__content">
                    <h4>{day.title}</h4>
                    <p>{day.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* EXPERIENCES IN PACKAGE */}
          {item.experiences.length > 0 && (
            <>
              <Reveal delay={80}>
                <h3>Activities Included</h3>
              </Reveal>
              <div className="vl-pkg-exp-list">
                {item.experiences.map(expName => {
                  const e = EXPERIENCES.find(x => x.name === expName)
                  return e ? (
                    <Reveal key={expName} delay={60}>
                      <div className="vl-pkg-exp-chip">
                        <I n="compass-3-line" />
                        <Link to={`/experiences/${e.id}`}>{expName}</Link>
                      </div>
                    </Reveal>
                  ) : null
                })}
              </div>
            </>
          )}
        </div>

        <aside className="vl-pkg-detail__side">
          {/* PRICE BOX */}
          <Reveal>
            <div className="vl-pkg-price-box">
              <span>From</span>
              <strong>${item.price.toLocaleString()}</strong>
              <span>/ {item.pricePer}</span>
              <hr />
              <h4>What's Included</h4>
              <ul>
                {item.includes.map(inc => <li key={inc}><I n="check-double-line" />{inc}</li>)}
              </ul>
              <button className="vl-btn-primary vl-btn-primary--full">
                <I n="send-plane-line" /> Request This Journey
              </button>
              <p className="vl-book-panel__note">Personalised quote within 24 hours</p>
            </div>
          </Reveal>

          {/* FEATURED STAY CARD */}
          {stayData && (
            <Reveal delay={80}>
              <div className="vl-pkg-stay-pullout">
                <h4>Your Stay</h4>
                <StayCard item={stayData} />
              </div>
            </Reveal>
          )}
        </aside>
      </div>
    </main>
  )
}

/* ═══════════════════════════════
   FOOTER
═══════════════════════════════ */
function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSub = e => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer className="vl-footer">
      <svg className="vl-footer__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
      <div className="contain vl-footer__inner">
        <div className="vl-footer__brand">
          <VelyrLogo />
          <p>Curated travel for those who seek the extraordinary — not the expected.</p>
          <div className="vl-footer__social">
            <a href="#" aria-label="Instagram"><I n="instagram-line" /></a>
            <a href="#" aria-label="Pinterest"><I n="pinterest-line" /></a>
            <a href="#" aria-label="Twitter"><I n="twitter-x-line" /></a>
            <a href="#" aria-label="YouTube"><I n="youtube-line" /></a>
          </div>
        </div>
        <div className="vl-footer__nav">
          <div className="vl-footer__col">
            <h5>Explore</h5>
            <Link to="/stay">Stays</Link>
            <Link to="/experiences">Activities</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="vl-footer__col">
            <h5>Destinations</h5>
            {DEST_CATEGORIES.slice(0, 4).map(d => (
              <Link key={d.label} to="/stay">{d.label}</Link>
            ))}
          </div>
          <div className="vl-footer__col">
            <h5>Company</h5>
            <a href="#">Press</a>
            <a href="#">Careers</a>
            <a href="#">Partnerships</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="vl-footer__newsletter">
          <h5>The VELYR Journal</h5>
          <p>Rare destinations, travel wisdom, and curator notes — delivered when it matters.</p>
          {subscribed ? (
            <p className="vl-footer__subbed"><I n="check-double-line" /> You're on the list.</p>
          ) : (
            <form className="vl-footer__form" onSubmit={handleSub}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required aria-label="Email" />
              <button type="submit"><I n="send-plane-fill" /></button>
            </form>
          )}
        </div>
      </div>
      <div className="vl-footer__bottom">
        <span>© {new Date().getFullYear()} VELYR. All rights reserved.</span>
        <span><a href="#">Privacy</a> · <a href="#">Terms</a></span>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════
   NOT FOUND
═══════════════════════════════ */
function NotFound() {
  return (
    <main className="vl-404">
      <Reveal>
        <div className="vl-404__inner">
          <span className="vl-404__code">404</span>
          <h1>You've Wandered Off the Map</h1>
          <p>Even the best explorers take a wrong turn. Let's get you somewhere beautiful.</p>
          <Link to="/" className="vl-btn-primary"><I n="home-4-line" /> Back to Home</Link>
        </div>
      </Reveal>
    </main>
  )
}

/* ═══════════════════════════════
   APP SHELL (default export)
═══════════════════════════════ */
function AppShell() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('velyr-mode') || 'dark' } catch { return 'dark' }
  })
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    try { localStorage.setItem('velyr-mode', mode) } catch {}
  }, [mode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <ErrorBoundary>
      <SiteHeader mode={mode} setMode={setMode} />
      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stay" element={<StaysPage />} />
          <Route path="/stay/:id" element={<StayDetailPage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </ErrorBoundary>
  )
}

export default AppShell
