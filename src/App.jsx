import { useState, useEffect, useRef, Component } from 'react'
import { Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

/* ─── Icon helper ─────────────────────────────────────── */
const I = ({ n, className = '' }) => <i className={`ri-${n} ${className}`} aria-hidden="true" />

/* ─── Intersection-observer fade-in ───────────────────── */
function useFadeIn(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── Reveal wrapper ──────────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const [ref, visible] = useFadeIn()
  return (
    <div
      ref={ref}
      className={`oz-reveal oz-reveal--${direction}${visible ? ' oz-reveal--in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── Error Boundary ──────────────────────────────────── */
class ErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(e) { return { err: e } }
  render() {
    if (this.state.err) return (
      <div style={{ padding: '4rem 2rem', minHeight: '60vh', color: 'var(--text)' }}>
        <h2 style={{ color: 'var(--accent)' }}>Something went wrong</h2>
        <pre style={{ opacity: 0.5 }}>{String(this.state.err)}</pre>
      </div>
    )
    return this.props.children
  }
}

/* ═══════════════════════════════════════════════════════
   THEME MODES
═══════════════════════════════════════════════════════ */
const MODES = [
  { id: 'light',   icon: 'sun-line',       label: 'Light'   },
  { id: 'dark',    icon: 'moon-line',       label: 'Dark'    },
  { id: 'classic', icon: 'drop-line',       label: 'Classic' },
  { id: 'modern',  icon: 'flashlight-line', label: 'Modern'  },
]

/* ═══════════════════════════════════════════════════════
   DATA — STAYS
═══════════════════════════════════════════════════════ */
const STAYS = [
  {
    id: 'royal-riad',
    name: 'Royal Riad Suite',
    location: 'Marrakech Medina, Morocco',
    category: 'Riad Suite',
    badge: "Signature Stay",
    rating: 4.98, reviews: 342, price: 680,
    tagline: 'A 17th-century palace, reimagined for the modern era',
    description: 'Nestled within the ancient walls of the Marrakech Medina, the Royal Riad Suite is a masterwork of Andalusian architecture. Mosaic zellige floors, hand-carved cedarwood ceilings, and a private courtyard with a rose-water fountain surround you. In the evening, the candlelit terrace reveals the Koutoubia minaret gilded by the setting sun.',
    highlights: ['Private rose-water courtyard', 'Traditional hammam suite', 'Personal in-riad chef', 'Rooftop terrace & plunge pool', 'Guided medina exploration'],
    amenities: ['3 ensuite bedrooms', 'Private courtyard', 'Hammam & steam room', 'Roof plunge pool', '24/7 butler service'],
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?w=900&auto=format&fit=crop',
    ],
    atmosphere: 'Opulent · Historic · Enchanting',
  },
  {
    id: 'sahara-pavilion',
    name: 'Sahara Star Pavilion',
    location: 'Merzouga Dunes, Morocco',
    category: 'Desert Tent',
    badge: 'Most Unique',
    rating: 4.96, reviews: 218, price: 520,
    tagline: 'A billion stars above, infinity sands below',
    description: "Raised on hardwood platforms at the foot of the Erg Chebbi dunes, our Sahara Star Pavilions redefine desert luxury. Hand-loomed Berber wool rugs, copper lanterns, and a four-poster bed draped in indigo silk wait inside. Step onto your private deck to witness the most spectacular night sky in the northern hemisphere.",
    highlights: ['Astronomy guide & telescope', 'Dawn camel trek to the dune crest', 'Berber sunset drumming circle', 'Private fire pit terrace', 'Pre-sunrise breakfast basket'],
    amenities: ['King canopy bed', 'Copper soaking tub', 'Private desert deck', 'Heated Berber rug floors', 'In-tent sommelier'],
    cover: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop',
    ],
    atmosphere: 'Mystical · Silent · Starlit',
  },
  {
    id: 'atlas-lodge',
    name: 'Atlas Mountain Lodge',
    location: 'Imlil Valley, High Atlas',
    category: 'Mountain Lodge',
    badge: 'Nature Retreat',
    rating: 4.95, reviews: 173, price: 430,
    tagline: 'Snow-capped peaks at your window every morning',
    description: "Perched at 2,100 metres in the Imlil Valley, this secluded stone lodge commands views of Jbel Toubkal — North Africa's highest peak. A wood-burning fireplace, hand-woven blankets, and the sound of the Assif Aït Mizane river compose the soundtrack to a singular mountain escape.",
    highlights: ['Jbel Toubkal summit treks', 'Private wood-fire hot tub', 'Argan oil wellness rituals', 'Berber village morning walks', 'Traditional Amazigh cooking'],
    amenities: ['Panoramic mountain suite', 'Wood fireplace', 'Outdoor hot tub', 'Yoga deck at altitude', 'Private chef'],
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
    ],
    atmosphere: 'Alpine · Serene · Majestic',
  },
  {
    id: 'coastal-kasbah',
    name: 'Atlantic Kasbah',
    location: 'Essaouira Coast, Morocco',
    category: 'Coastal Kasbah',
    badge: 'Coastal Gem',
    rating: 4.93, reviews: 196, price: 560,
    tagline: 'Ocean winds, whitewashed ramparts, timeless blue',
    description: "Essaouira's fortified medina meets the Atlantic with a drama that inspired Jimi Hendrix and Orson Welles. Our Kasbah occupies a restored 18th-century Portuguese fortification, blending blue-washed walls, gnaoua music at sunset, and the freshest seafood imaginable.",
    highlights: ['Rooftop pool above the ramparts', 'Private kitesurf lessons', 'Fresh harbor seafood grill', 'Gnaoua sunset music ceremony', 'Historic medina walking tour'],
    amenities: ['Ocean-view suite', 'Rooftop infinity pool', 'Spa & hammam', 'Private pier access', 'Library & bar terrace'],
    cover: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop',
    ],
    atmosphere: 'Breezy · Artistic · Coastal',
  },
  {
    id: 'palmeraie-villa',
    name: 'Palmeraie Garden Villa',
    location: 'Palmeraie, Marrakech',
    category: 'Private Villa',
    badge: 'Family Favourite',
    rating: 4.97, reviews: 289, price: 890,
    tagline: 'A 5-acre oasis of palms, jasmine, and silence',
    description: "Sequestered within Marrakech's legendary Palmeraie — a grove of 150,000 date palms — this private villa combines Berber grandeur with contemporary design. Four suites open onto a 25-metre palm-fringed pool. A resident botanist tends the aromatic gardens.",
    highlights: ['25m private palm pool', 'Orchard-to-table dining', 'Hammam & holistic spa', 'Horse trekking through palms', 'Electric bike Palmeraie tour'],
    amenities: ['4 private suites', 'Palm pool', 'Private spa complex', 'Tennis court', 'Cinema room'],
    cover: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&auto=format&fit=crop',
    ],
    atmosphere: 'Lush · Private · Elegant',
  },
  {
    id: 'fes-palace',
    name: 'Fes Medina Palace',
    location: 'Fes el-Bali, Morocco',
    category: 'Heritage Palace',
    badge: 'UNESCO Heritage',
    rating: 4.99, reviews: 134, price: 760,
    tagline: "The world's oldest medina as your private sanctuary",
    description: "The Fes el-Bali medina has been continuously inhabited for over 1,200 years. Our restored 14th-century palace immerses you in this living museum — carved stucco galleries, a grand central courtyard with an 8-metre mosaic fountain, and hand-painted tiles that took six craftsmen two years to lay.",
    highlights: ['Tannery private viewing balcony', 'Medina artisan workshop tours', 'Quranic geometric tile masterclass', 'Roof terrace with medina panorama', 'Muqarnas ceiling restoration tour'],
    amenities: ['3 palace suites', 'Mosaic courtyard fountain', 'Hammam & argan rituals', 'Private rooftop terrace', 'Library of Moroccan manuscripts'],
    cover: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=900&auto=format&fit=crop',
    ],
    atmosphere: 'Ancient · Scholarly · Transcendent',
  },
]

/* ═══════════════════════════════════════════════════════
   DATA — ACTIVITIES
═══════════════════════════════════════════════════════ */
const ACTIVITIES = [
  {
    id: 'sunrise-camel-trek',
    name: 'Sunrise Sahara Camel Trek',
    category: 'Desert',
    duration: '3 hours', groupSize: 'Max 6', difficulty: 'Easy', price: 140,
    badge: 'Most Requested',
    tagline: 'Ascend the dune crest as the Sahara ignites at dawn',
    description: "Your Berber guide — whose family has navigated these dunes for five generations — leads your small group by camel to the high ridge of Erg Chebbi as the sun tears through the horizon. The silence, the colour, and the scale are unlike anything in the natural world. Mint tea and fresh msemen await at the summit camp.",
    includes: ['Private camel per guest', 'Berber guide (English/French)', 'Summit sunrise breakfast', 'Traditional blue robes provided', 'Photography assistance'],
    cover: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&auto=format&fit=crop',
    whatToExpect: ['4:45am departure from resort', 'Camel mount and trek briefing', '45-minute ascent to dune crest', 'Sunrise ceremony & photography', 'Hot breakfast at summit camp', 'Descent and return by 9am'],
  },
  {
    id: 'hammam-ritual',
    name: 'Royal Hammam Ritual',
    category: 'Wellness',
    duration: '2.5 hours', groupSize: 'Private', difficulty: 'Easy', price: 220,
    badge: 'Guest Favourite',
    tagline: 'A thousand years of Moroccan wellness in one ceremony',
    description: "The hammam is not a spa — it is a ritual. Beginning with a Savon Beldi black soap scrub that removes layers of the outside world, your therapist follows a sequence practiced in Moroccan hammams since the Almoravid era. Argan oil, rhassoul clay, and rose water complete a restoration that works from the skin inward.",
    includes: ['Full hammam circuit (steam, scrub, wrap)', 'Argan oil full-body massage', 'Rhassoul clay mask', 'Rose water & orange blossom rinse', 'Moroccan mint tea ceremony after'],
    cover: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format&fit=crop',
    whatToExpect: ['Arrival & robe fitting in marble vestibule', 'Steam chamber (20 min)', 'Black soap exfoliation', 'Rhassoul clay envelopment', 'Argan oil massage (45 min)', 'Mint tea ritual in cooling room'],
  },
  {
    id: 'tajine-masterclass',
    name: 'Private Tajine Masterclass',
    category: 'Culinary',
    duration: '4 hours', groupSize: 'Max 4', difficulty: 'Easy', price: 195,
    badge: 'Sell-Out',
    tagline: 'Unlock the geometry of Moroccan flavour',
    description: "Chef Fatima takes you through the architecture of a perfect tajine: the spice layering, the braising patience, the way steam and stone work together. You shop for ingredients in the medina souk at dawn, cook over charcoal, and eat what you created under the riad courtyard arches.",
    includes: ['Medina souk shopping tour', 'All ingredients provided', 'Private instruction with Chef Fatima', 'Three-course Moroccan lunch', 'Handwritten recipe cards'],
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop',
    whatToExpect: ['Meet at spice souk 8am', 'Select spices, vegetables & protein', 'Return to riad kitchen by 10am', 'Two-hour guided cooking session', 'Sit-down Moroccan lunch', 'Recipe booklet presentation'],
  },
  {
    id: 'stargazing-night',
    name: 'Ouzaft Stargazing Night',
    category: 'Astronomy',
    duration: '3 hours', groupSize: 'Max 8', difficulty: 'Easy', price: 165,
    badge: 'Unmissable',
    tagline: 'The Milky Way, undimmed, over 5,000 years of human history below',
    description: "Morocco's Sahara ranks among the world's top three dark-sky destinations. Our resident astrophysicist, Dr. Youssef Benali, guides your group through the night sky with a research-grade telescope, laser pointer narration, and thermal recliners positioned precisely for the optimal field of view.",
    includes: ['Research-grade telescope session', 'Astrophysicist guide Dr. Benali', 'Constellation laser-pointer tour', 'Thermal recliners & Berber blankets', 'Shooting star & ISS alerts'],
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop',
    whatToExpect: ['Sunset departure to observation platform', 'Desert silence acclimatisation', 'Telescope focus & calibration', 'Deep-sky object tour (90 min)', 'Astrophotography session', 'Return under the stars at midnight'],
  },
  {
    id: 'medina-craft-walk',
    name: 'Medina Artisan Walk',
    category: 'Cultural',
    duration: '4 hours', groupSize: 'Max 6', difficulty: 'Easy', price: 120,
    badge: 'Cultural Gem',
    tagline: 'Follow the sound of hammers into the oldest living craft city on Earth',
    description: "Fes el-Bali has changed little in 700 years. Your guide takes you through the tanneries where leather has been dyed the same way since the 11th century, into the fondouks where copper-smiths beat geometric patterns, and finally to a master calligrapher who inscribes your name in Kufic script.",
    includes: ['Expert medina guide (local historian)', 'Tannery private viewing balcony', 'Copper-smith & tile-maker workshops', 'Kufic calligraphy keepsake', 'Moroccan lunch in a fondouk courtyard'],
    cover: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&auto=format&fit=crop',
    whatToExpect: ['Meet at Bab Bou Jeloud gate 9am', 'Medina orientation & history', 'Tannery terrace visit', 'Artisan workshop tour (3 stops)', 'Calligraphy session', 'Lunch & debrief in fondouk'],
  },
  {
    id: 'dune-quad-adventure',
    name: 'Sahara Quad & Oasis Trail',
    category: 'Adventure',
    duration: '5 hours', groupSize: 'Max 10', difficulty: 'Moderate', price: 175,
    badge: 'Adrenaline',
    tagline: 'The Sahara at full throttle, then ancient oasis at full stillness',
    description: "Begin with a guided quad circuit across the dramatic Erg Chebbi dunes — descending crests and crossing dry river beds. The route climaxes at a hidden oasis fed by an ancient foggara irrigation channel, where you cool down in spring water and eat lunch under centuries-old palms.",
    includes: ['Full quad safety briefing & equipment', 'Guided dune circuit (2 hours)', 'Foggara oasis visit', 'Riverside Berber lunch', 'GoPro footage of your run'],
    cover: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&auto=format&fit=crop',
    whatToExpect: ['9am quad briefing at resort garage', 'Dune circuit departure (2h)', 'Ridge viewpoint stop (photos)', 'Descent to oasis valley', 'Spring swim & lunch', 'Return by 3pm'],
  },
]

/* ═══════════════════════════════════════════════════════
   DATA — PACKAGES
═══════════════════════════════════════════════════════ */
const PACKAGES = [
  {
    id: 'desert-romance',
    name: 'Sahara Romance Escape',
    location: 'Merzouga Desert, Morocco',
    duration: '4 nights', price: 3200, pricePer: 'per couple',
    badge: 'Bestseller',
    tagline: 'The most romantic desert on Earth, perfectly curated',
    description: 'Four nights in the Sahara Star Pavilion, combined with a private sunset camel trek, a rooftop hammam under the stars, and a chef-prepared candlelit dinner on your own private dune. Every detail — from arrival transfer to departure jasmine garland — has been considered.',
    cover: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&auto=format&fit=crop',
    includes: ['4 nights Sahara Star Pavilion', 'Private camel sunset & sunrise trek', 'Royal Hammam Ritual for two', 'Chef-prepared private dune dinner', 'Berber drumming ceremony access', 'All ground transfers from Errachidia', 'Dedicated concierge throughout'],
    itinerary: [
      { day: 1, title: 'Arrival & Welcome', desc: 'Private 4WD transfer. Champagne & rose petals on your pavilion deck. Sunset mint tea ceremony.' },
      { day: 2, title: 'Sunrise on the Dunes', desc: 'Pre-dawn camel ascent to the Erg Chebbi crest. Private sunrise breakfast. Return for spa morning.' },
      { day: 3, title: 'Hammam & Dune Dinner', desc: 'Morning at leisure. Afternoon Royal Hammam Ritual. Candlelit private dinner on your personal dune.' },
      { day: 4, title: 'Berber Culture Day', desc: 'Morning foggara oasis walk. Afternoon pottery workshop in a Berber village. Gnaoua music evening.' },
      { day: 5, title: 'Farewell Sahara', desc: 'Final sunrise from your deck. Transfer to airport with a jasmine garland send-off.' },
    ],
  },
  {
    id: 'imperial-grand-tour',
    name: 'Imperial Cities Grand Tour',
    location: 'Marrakech · Fes · Chefchaouen',
    duration: '8 nights', price: 7400, pricePer: 'per person',
    badge: 'Signature',
    tagline: "Morocco's three most extraordinary cities, one seamless journey",
    description: "Begin in Marrakech with 3 nights in the Royal Riad Suite. A private train journey takes you to Fes for 3 nights in the Palace. A scenic mountain drive delivers you to the blue city of Chefchaouen for 2 nights.",
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop',
    includes: ['3 nights Royal Riad Suite, Marrakech', '3 nights Fes Medina Palace', '2 nights Chefchaouen Blue Kasbah', 'Private guides in all three cities', 'Artisan workshop masterclass', 'All inter-city private transfers', 'Airport arrivals & departures'],
    itinerary: [
      { day: 1, title: 'Arrive Marrakech', desc: 'Private airport transfer. Check-in to Royal Riad. Rooftop welcome aperitivo.' },
      { day: 2, title: 'Marrakech Deep Dive', desc: 'Dawn souk market walk. Tajine masterclass with Chef Fatima.' },
      { day: 3, title: 'Hammam Day', desc: 'Morning hammam ritual. Afternoon Jardin Majorelle. Sunset on Jemaa el-Fna.' },
      { day: 4, title: 'Marrakech → Fes', desc: 'Private drive through the Middle Atlas — cedar forests, mountain passes.' },
      { day: 5, title: 'Fes Medina', desc: 'Full-day medina artisan walk. Tannery, copper souks, Koranic manuscripts.' },
      { day: 6, title: 'Fes at Your Pace', desc: 'Morning calligraphy masterclass. Rooftop dinner above the medina at dusk.' },
      { day: 7, title: 'Fes → Chefchaouen', desc: 'Scenic drive through the Rif mountains. Sunset cocktails on the kasbah terrace.' },
      { day: 8, title: 'Blue City Wander', desc: 'Guided Chefchaouen photography walk. Lunch in a blue-walled courtyard.' },
      { day: 9, title: 'Farewell', desc: 'Private transfer to Tangier or Fes airport.' },
    ],
  },
  {
    id: 'atlas-adventure',
    name: 'Atlas & Desert Adventure',
    location: 'Atlas Mountains · Merzouga',
    duration: '6 nights', price: 4900, pricePer: 'per person',
    badge: 'Adventure',
    tagline: 'Snow peaks at dawn, star dunes at dusk',
    description: "Three nights at the Atlas Mountain Lodge in the Imlil Valley — summit hiking, Berber villages, and waterfall walks. Then a dramatic desert road to 3 nights in a Sahara Star Pavilion. The elevation difference between your two beds is over 1,800 metres.",
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    includes: ['3 nights Atlas Mountain Lodge, Imlil', '3 nights Sahara Star Pavilion, Merzouga', 'Guided Jbel Toubkal day trek', 'Sunrise Sahara Camel Trek', 'Sahara Quad & Oasis Trail', 'Scenic desert road private transfer', 'All meals at both properties'],
    itinerary: [
      { day: 1, title: 'Arrive Atlas', desc: 'Transfer from Marrakech into the High Atlas. Arrive Imlil Lodge as the sun catches the snowfields.' },
      { day: 2, title: 'Toubkal Summit Trek', desc: 'Full-day guided ascent toward Jbel Toubkal. Berber refuge lunch. Panoramic descent.' },
      { day: 3, title: 'Valley & Village', desc: 'Morning Amazigh village walk. Argan oil wellness afternoon. Wood-fire dinner.' },
      { day: 4, title: 'Atlas → Sahara', desc: 'Scenic drive through Ait Benhaddou, Draa Valley oasis, into the Sahara.' },
      { day: 5, title: 'Desert Awakening', desc: 'Dawn camel trek up the Erg Chebbi dune crest. Stargazing night session.' },
      { day: 6, title: 'Quad & Oasis', desc: 'Morning Sahara quad & foggara oasis adventure. Afternoon hammam recovery.' },
      { day: 7, title: 'Departure', desc: 'Breakfast on your desert deck. Transfer to Errachidia airport.' },
    ],
  },
  {
    id: 'coastal-serenity',
    name: 'Atlantic Coastal Serenity',
    location: 'Essaouira · Agadir Coast',
    duration: '5 nights', price: 3800, pricePer: 'per couple',
    badge: 'Coastal',
    tagline: 'Salt air, Atlantic surf, and the art of doing nothing beautifully',
    description: "Five nights in the Atlantic Kasbah — days of kitesurf lessons, morning hammam rituals, fresh seafood at the harbor, and evenings on the roof terrace as gnaoua musicians play against the sound of the ocean.",
    cover: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&auto=format&fit=crop',
    includes: ['5 nights Atlantic Kasbah, Essaouira', 'Private kitesurf lessons (3 sessions)', 'Royal Hammam Ritual for two', 'Harbor seafood private dinner', 'Gnaoua sunset music ceremony', 'Argan grove & cooperative visit', 'Airport arrivals & departures'],
    itinerary: [
      { day: 1, title: 'Arrive by the Sea', desc: "Transfer to Essaouira. First dinner on the kasbah roof." },
      { day: 2, title: 'Kitesurf Introduction', desc: 'Morning kitesurf lesson. Afternoon medina wander. Gnaoua music at sunset.' },
      { day: 3, title: 'Hammam & Ramparts', desc: 'Morning hammam ritual. Afternoon historic ramparts walk.' },
      { day: 4, title: 'Argan Grove & Free Day', desc: 'Morning argan cooperative visit. Afternoon entirely free.' },
      { day: 5, title: 'Advanced Kitesurf', desc: 'Third kitesurf session. Afternoon harbor seafood lunch.' },
      { day: 6, title: 'Farewell Ocean', desc: 'Final breakfast with the Atlantic. Airport transfer.' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════
   DATA — TESTIMONIALS
═══════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name: 'Isabelle Fontaine', role: 'Travel Writer, Condé Nast', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop', rating: 5, text: "I have stayed in over 400 hotels across 90 countries. The Sahara Star Pavilion at Ouzaft is, without qualification, the most transcendent accommodation I have ever experienced. The silence alone is worth the journey." },
  { name: 'Raphael Svensson', role: 'Architect, Stockholm', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop', rating: 5, text: "As an architect I am deeply attentive to space and material. The Royal Riad Suite made me weep — genuinely weep — at the mastery of Moroccan craft. Every carved surface is a conversation with human ingenuity across centuries." },
  { name: 'Amara Diallo', role: 'Wellness Entrepreneur, Lagos', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop', rating: 5, text: "The Royal Hammam Ritual reset me in ways that three months of therapy had not. My therapist told me afterward that I carry less in my body. I return every year for this ritual alone." },
  { name: 'Ji-woo Park', role: 'Documentary Filmmaker, Seoul', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&auto=format&fit=crop', rating: 5, text: "I came to Ouzaft to film the Sahara. I left having filmed the best material of my career — and having decided to move my entire life closer to silence. Dr. Benali's stargazing session will stay with me forever." },
  { name: 'Dr. Emma Blackwell', role: 'Marine Biologist, Cambridge', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop', rating: 5, text: "Chef Fatima's tajine masterclass was a genuine act of cultural transmission. We shopped, cooked, ate, and talked for six hours. It was the best meal I've ever had — partly because I made it." },
  { name: 'Marco Vitale', role: 'Hotelier, Florence', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop', rating: 5, text: "As someone who runs luxury hotels, I came to Ouzaft as a critic. I left as a convert. The Atlas Mountain Lodge has flawless attention to detail — I couldn't find a single thing I would change." },
]

/* ═══════════════════════════════════════════════════════
   DATA — TEAM
═══════════════════════════════════════════════════════ */
const TEAM = [
  { name: 'Karim El Ouazzani', role: 'Founder & Host Director', bio: 'Born in the Draa Valley, Karim spent 20 years in hotel design before returning to build the Ouzaft he had always imagined.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' },
  { name: 'Fatima Benhassi', role: 'Head Chef & Culinary Guide', bio: 'Trained in Marrakech and Lyon, Fatima creates menus that honour the geometry of Moroccan spice with a contemporary sensibility.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop' },
  { name: 'Dr. Youssef Benali', role: 'Resident Astrophysicist', bio: 'A member of the International Astronomical Union, Youssef joins guests each night to turn the Sahara sky into a personal observatory.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop' },
  { name: 'Aicha Tijani', role: 'Wellness & Hammam Director', bio: 'Aicha has studied traditional Moroccan healing arts for 18 years, drawing from Andalusian, Sub-Saharan, and Ottoman wellness lineages.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop' },
]

/* ═══════════════════════════════════════════════════════
   DATA — STATS
═══════════════════════════════════════════════════════ */
const STATS = [
  { icon: 'building-line',               value: '6',    label: 'Iconic Properties'     },
  { icon: 'star-fill',                   value: '4.97', label: 'Average Guest Rating'  },
  { icon: 'award-line',                  value: '12',   label: 'International Awards'  },
  { icon: 'global-line',                 value: '48',   label: 'Countries Represented' },
  { icon: 'heart-line',                  value: '94%',  label: 'Guest Return Rate'     },
  { icon: 'leaf-line',                   value: '100%', label: 'Carbon Neutral'        },
]

/* ═══════════════════════════════════════════════════════
   DATA — BLOG POSTS
═══════════════════════════════════════════════════════ */
const BLOG_POSTS = [
  { id: 'art-of-the-tajine',   title: 'The Architecture of a Perfect Tajine',         excerpt: 'Chef Fatima explains why the tajine is not a dish but a philosophy — and why patience is its most essential ingredient.', category: 'Culinary',  date: 'April 12, 2026', readTime: '6 min',  author: 'Fatima Benhassi',     cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop' },
  { id: 'dark-sky-merzouga',   title: 'Why Merzouga Has the Darkest Sky in Africa',   excerpt: "Dr. Benali explains the atmospheric science behind the Sahara's extraordinary night sky and which months offer the best viewing.", category: 'Science',   date: 'March 28, 2026',  readTime: '8 min',  author: 'Dr. Youssef Benali',  cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop' },
  { id: 'zellige-craft',        title: 'Inside the Last Zellige Ateliers of Fes',      excerpt: 'A morning inside one of the six remaining workshops producing hand-cut zellige tiles in the ancient Fes el-Bali medina.',    category: 'Culture',   date: 'March 10, 2026',  readTime: '10 min', author: 'Karim El Ouazzani',   cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop' },
  { id: 'hammam-history',       title: 'A Thousand Years of the Moroccan Hammam',      excerpt: 'Aicha Tijani traces the hammam from its Andalusian-Maghrebi origins to the contemporary wellness ritual.',                  category: 'Wellness',  date: 'Feb 22, 2026',    readTime: '7 min',  author: 'Aicha Tijani',        cover: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop' },
  { id: 'atlas-spring',         title: 'The High Atlas in Spring: Everything Changes', excerpt: 'April through June, snow-melt rivers turn the Imlil Valley into a vertical garden.',                                          category: 'Nature',    date: 'Feb 5, 2026',     readTime: '5 min',  author: 'Karim El Ouazzani',   cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' },
  { id: 'essaouira-wind',       title: 'Why the Wind Made Essaouira Great',            excerpt: "The alizé winds that frustrated Portuguese sailors and thrilled Jimi Hendrix shaped every aspect of this coastal city.",       category: 'Culture',   date: 'Jan 18, 2026',    readTime: '9 min',  author: 'Karim El Ouazzani',   cover: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&auto=format&fit=crop' },
]

/* ═══════════════════════════════════════════════════════
   DATA — WHY OUZAFT
═══════════════════════════════════════════════════════ */
const WHY_ITEMS = [
  { icon: 'compass-3-line',              title: 'Expert Local Guides',    desc: 'Every guide is born from the land they navigate — carrying family knowledge, not tour scripts.' },
  { icon: 'leaf-line',                   title: 'Carbon-Neutral Promise', desc: 'Every stay offsets three times its carbon footprint through Atlas reforestation and solar projects.' },
  { icon: 'customer-service-2-line',     title: '24/7 Concierge',        desc: 'One dedicated person — not a call centre — manages every detail of your stay before and during.' },
  { icon: 'artboard-2-line',             title: 'Craft-First Design',     desc: 'Every property features exclusively Moroccan artisans: zellige, carved cedarwood, hand-loomed textiles.' },
  { icon: 'heart-pulse-line',            title: 'Wellness as Heritage',   desc: 'Our hammam rituals and argan wellness programmes draw from unbroken Moroccan traditions.' },
  { icon: 'shield-check-line',           title: 'Private & Secure',       desc: 'All our stays feature private access — no shared lobbies, no tour groups, no compromises.' },
]

/* ═══════════════════════════════════════════════════════
   DATA — HERO SLIDES
═══════════════════════════════════════════════════════ */
const HERO_SLIDES = [
  { id: 0, headline: ['Where the Sahara', 'Meets Splendour'], sub: "Morocco's most exceptional stays, curated by those who love it most", ctaLabel: 'Discover Stays', ctaTo: '/stay', img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1800&auto=format&fit=crop' },
  { id: 1, headline: ['Ancient Cities,', 'Living Craft'],     sub: 'Step inside the medinas of Marrakech and Fes — 1,200 years of unbroken beauty',    ctaLabel: 'View Packages',    ctaTo: '/packages',   img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1800&auto=format&fit=crop' },
  { id: 2, headline: ['Peaks, Palms', '& Open Sky'],          sub: 'Atlas mountains at dawn. Desert dunes at dusk. One seamless adventure.',              ctaLabel: 'All Activities',   ctaTo: '/activities', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&auto=format&fit=crop' },
]

/* ═══════════════════════════════════════════════════════
   DATA — FAQ
═══════════════════════════════════════════════════════ */
const FAQ = [
  { q: 'What is the best time to visit the Sahara?', a: 'October through April offers ideal temperatures — warm days (24–28°C) and cool nights perfect for stargazing. July and August are hot but offer extreme dune photography opportunities at dawn.' },
  { q: 'How do I reach Merzouga from Marrakech?', a: 'We arrange private 4WD transfers (8 hours scenic drive) or domestic flights to Errachidia followed by a 90-minute private desert road transfer. Both options are handled seamlessly by our team.' },
  { q: 'Are children welcome at Ouzaft properties?', a: 'Children are warmly welcomed at all properties. Age-appropriate activities — junior camel treks, cookie-decorating sessions, and stargazing — are available on request.' },
  { q: 'What should I pack for a desert stay?', a: 'We provide Berber robes and thermal blankets. Bring sunscreen, UV sunglasses, a warm layer for evenings, and comfortable closed-toe shoes.' },
  { q: 'What languages do your guides speak?', a: 'All guides are fluent in Arabic, French, and English. Darija and Tamazight guides are available on request. Private translation for other languages can be arranged.' },
  { q: 'Can I book a property exclusively?', a: 'Yes — all our riads, villas, and pavilions can be booked on an exclusive-use basis. Contact our concierge team for bespoke pricing and a private itinerary.' },
]

/* ═══════════════════════════════════════════════════════
   UTILITY COMPONENTS
═══════════════════════════════════════════════════════ */
function Stars({ n = 5 }) {
  return (
    <span className="oz-stars">
      {[1,2,3,4,5].map(i => <I key={i} n={i <= n ? 'star-fill' : i - 0.5 <= n ? 'star-half-line' : 'star-line'} />)}
    </span>
  )
}

function OrnamentDivider({ className = '' }) {
  return (
    <div className={`oz-ornament ${className}`} aria-hidden="true">
      <span className="oz-ornament__line" />
      <span className="oz-ornament__gem">◆</span>
      <span className="oz-ornament__dot">·</span>
      <span className="oz-ornament__gem">◆</span>
      <span className="oz-ornament__line" />
    </div>
  )
}

function SectionHead({ eyebrow, title, body, center = false, light = false }) {
  return (
    <div className={`oz-sec-head${center ? ' oz-sec-head--center' : ''}${light ? ' oz-sec-head--light' : ''}`}>
      {eyebrow && (
        <p className="oz-eyebrow">
          <OrnamentDivider /><span>{eyebrow}</span><OrnamentDivider />
        </p>
      )}
      <h2 className="oz-sec-title">{title}</h2>
      {body && <p className="oz-sec-body">{body}</p>}
    </div>
  )
}

function PageHero({ title, subtitle, image, breadcrumb }) {
  return (
    <section className="oz-page-hero" style={{ '--hero-bg': `url(${image})` }}>
      <div className="oz-page-hero__veil" />
      <div className="oz-page-hero__content contain">
        {breadcrumb && (
          <nav className="oz-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <I n="arrow-right-s-line" />
            <span>{breadcrumb}</span>
          </nav>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="oz-page-hero__arc" />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   THEME SWITCHER
═══════════════════════════════════════════════════════ */
function ThemeSwitcher({ mode, setMode }) {
  return (
    <div className="oz-theme-sw" role="group" aria-label="Color theme">
      {MODES.map(m => (
        <button
          key={m.id}
          className={`oz-theme-btn${mode === m.id ? ' oz-theme-btn--on' : ''}`}
          onClick={() => { setMode(m.id); localStorage.setItem('ouzaft-mode', m.id) }}
          title={m.label}
          aria-label={`${m.label} mode`}
          aria-pressed={mode === m.id}
        >
          <I n={m.icon} />
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   BRAND LOGO
═══════════════════════════════════════════════════════ */
function OuzaftLogo({ onClick }) {
  return (
    <Link to="/" className="oz-logo" onClick={onClick} aria-label="Ouzaft Home">
      <span className="oz-logo__mark" aria-hidden="true">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <polygon points="19,2 22,14 35,14 25,23 29,36 19,28 9,36 13,23 3,14 16,14"
            stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.55" />
          <polygon points="19,8 21,15 28,15 23,19 25,27 19,23 13,27 15,19 10,15 17,15"
            fill="currentColor" opacity="0.18" />
          <circle cx="19" cy="19" r="3.5" fill="currentColor" />
        </svg>
      </span>
      <span className="oz-logo__wordmark">
        <span className="oz-logo__name">OUZAFT</span>
        <span className="oz-logo__sub">Luxury Stays Morocco</span>
      </span>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════
   SITE HEADER
═══════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: 'Stay',       to: '/stay',       icon: 'hotel-line'      },
  { label: 'Packages',   to: '/packages',   icon: 'gift-2-line'     },
  { label: 'Activities', to: '/activities', icon: 'compass-3-line'  },
  { label: 'About',      to: '/about',      icon: 'team-line'       },
  { label: 'Contact',    to: '/contact',    icon: 'mail-send-line'  },
]

function SiteHeader({ mode, setMode }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <header className={`oz-header${scrolled ? ' oz-header--scrolled' : ''}${open ? ' oz-header--open' : ''}`}>
      <div className="oz-header__inner contain">
        <OuzaftLogo onClick={() => setOpen(false)} />

        <nav className="oz-nav" aria-label="Primary navigation">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `oz-nav__link${isActive ? ' oz-nav__link--on' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="oz-header__right">
          <ThemeSwitcher mode={mode} setMode={setMode} />
          <Link to="/packages" className="oz-btn oz-btn--reserve">
            <I n="calendar-check-line" /><span>Reserve</span>
          </Link>
          <button className={`oz-burger${open ? ' oz-burger--x' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && <button className="oz-overlay" onClick={() => setOpen(false)} aria-label="Close menu" />}

      <div className={`oz-drawer${open ? ' oz-drawer--open' : ''}`} aria-hidden={!open}>
        <div className="oz-drawer__head">
          <OuzaftLogo onClick={() => setOpen(false)} />
          <button onClick={() => setOpen(false)} className="oz-drawer__close" aria-label="Close">
            <I n="close-line" />
          </button>
        </div>
        <OrnamentDivider className="oz-drawer__divider" />
        <nav className="oz-drawer__nav">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className="oz-drawer__link" onClick={() => setOpen(false)}>
              <I n={l.icon} />
              <span>{l.label}</span>
              <I n="arrow-right-s-line" className="oz-drawer__arr" />
            </NavLink>
          ))}
        </nav>
        <div className="oz-drawer__foot">
          <ThemeSwitcher mode={mode} setMode={setMode} />
          <Link to="/packages" className="oz-btn oz-btn--reserve oz-btn--full" onClick={() => setOpen(false)}>
            <I n="calendar-check-line" /> Reserve Now
          </Link>
          <div className="oz-drawer__contacts">
            <a href="tel:+212522000000"><I n="phone-line" /> +212 522 00 00 00</a>
            <a href="mailto:stay@ouzaft.ma"><I n="mail-line" /> stay@ouzaft.ma</a>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════ */
function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const handleSub = (e) => { e.preventDefault(); if (email.trim()) { setDone(true); setEmail('') } }

  return (
    <footer className="oz-footer">
      <div className="oz-footer__body contain">
        <div className="oz-footer__brand">
          <OuzaftLogo />
          <p>Extraordinary stays across Morocco's most magnificent landscapes — designed for those who believe travel is an art form.</p>
          <div className="oz-footer__socials">
            {['instagram-line','facebook-circle-line','twitter-x-line','youtube-line'].map(ic => (
              <a key={ic} href="#" className="oz-footer__soc" aria-label={ic.split('-')[0]}><I n={ic} /></a>
            ))}
          </div>
        </div>

        <div className="oz-footer__col">
          <h4>Discover</h4>
          <ul>
            {[['Stay','/stay'],['Packages','/packages'],['Activities','/activities'],['About','/about'],['Contact','/contact']].map(([l,to]) => (
              <li key={to}><Link to={to}>{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="oz-footer__col">
          <h4>Destinations</h4>
          <ul>
            {['Marrakech Medina','Merzouga Sahara','Imlil High Atlas','Essaouira Coast','Fes el-Bali','Palmeraie'].map(d => (
              <li key={d}><a href="#">{d}</a></li>
            ))}
          </ul>
        </div>

        <div className="oz-footer__col oz-footer__col--news">
          <h4>The Ouzaft Letter</h4>
          <p>Stories from Morocco's edges, delivered monthly.</p>
          {done
            ? <p className="oz-footer__done"><I n="check-double-line" /> You're on the list — Shukran!</p>
            : (
              <form className="oz-footer__form" onSubmit={handleSub}>
                <input type="email" placeholder="Your email" value={email}
                  onChange={e => setEmail(e.target.value)} required aria-label="Email" />
                <button type="submit" aria-label="Subscribe"><I n="arrow-right-line" /></button>
              </form>
            )
          }
          <div className="oz-footer__meta">
            <span><I n="phone-line" /> +212 522 00 00 00</span>
            <span><I n="mail-line" /> stay@ouzaft.ma</span>
            <span><I n="map-pin-2-line" /> Merzouga, Morocco</span>
          </div>
        </div>
      </div>

      <OrnamentDivider className="oz-footer__orn" />

      <div className="oz-footer__bottom contain">
        <p>© 2026 Ouzaft Luxury Stays. All rights reserved.</p>
        <div className="oz-footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════
   CARD COMPONENTS
═══════════════════════════════════════════════════════ */
function StayCard({ item, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="oz-stay-card">
        <Link to={`/stay/${item.id}`} className="oz-stay-card__img">
          <img src={item.cover} alt={item.name} loading="lazy" />
          <div className="oz-stay-card__veil" />
          {item.badge && <span className="oz-badge">{item.badge}</span>}
          <div className="oz-stay-card__foot-overlay">
            <span className="oz-stay-card__atmo">{item.atmosphere}</span>
            <span className="oz-stay-card__price-tag">from <strong>${item.price.toLocaleString()}</strong>/night</span>
          </div>
        </Link>
        <div className="oz-stay-card__body">
          <div className="oz-stay-card__meta">
            <span className="oz-stay-card__cat"><I n="map-pin-line" />{item.category}</span>
            <span className="oz-stay-card__rat"><I n="star-fill" />{item.rating}<span className="oz-muted">({item.reviews})</span></span>
          </div>
          <h3><Link to={`/stay/${item.id}`}>{item.name}</Link></h3>
          <p className="oz-stay-card__loc"><I n="map-pin-2-line" />{item.location}</p>
          <p className="oz-stay-card__tagline">{item.tagline}</p>
          <div className="oz-stay-card__actions">
            <div className="oz-price"><strong>${item.price.toLocaleString()}</strong><span className="oz-muted">/night</span></div>
            <Link to={`/stay/${item.id}`} className="oz-btn oz-btn--ghost oz-btn--sm">View <I n="arrow-right-s-line" /></Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function ActivityCard({ item, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="oz-act-card">
        <Link to={`/activities/${item.id}`} className="oz-act-card__img">
          <img src={item.cover} alt={item.name} loading="lazy" />
          <div className="oz-act-card__veil" />
          <div className="oz-act-card__top">
            {item.badge && <span className="oz-badge">{item.badge}</span>}
            <span className="oz-diff" data-diff={item.difficulty.toLowerCase()}>{item.difficulty}</span>
          </div>
          <div className="oz-act-card__pills">
            <span><I n="time-line" />{item.duration}</span>
            <span><I n="group-line" />{item.groupSize}</span>
          </div>
        </Link>
        <div className="oz-act-card__body">
          <div className="oz-act-card__hd">
            <span className="oz-muted oz-act-card__cat"><I n="compass-3-line" />{item.category}</span>
            <span className="oz-act-card__price"><strong>${item.price}</strong><span className="oz-muted">/pp</span></span>
          </div>
          <h3><Link to={`/activities/${item.id}`}>{item.name}</Link></h3>
          <p>{item.tagline}</p>
          <Link to={`/activities/${item.id}`} className="oz-btn oz-btn--ghost oz-btn--sm oz-btn--full">
            Discover <I n="arrow-right-line" />
          </Link>
        </div>
      </article>
    </Reveal>
  )
}

function PackageCard({ item, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="oz-pkg-card">
        <Link to={`/packages/${item.id}`} className="oz-pkg-card__img">
          <img src={item.cover} alt={item.name} loading="lazy" />
          <div className="oz-pkg-card__veil" />
          {item.badge && <span className="oz-badge">{item.badge}</span>}
          <span className="oz-pkg-card__dur"><I n="calendar-2-line" />{item.duration}</span>
        </Link>
        <div className="oz-pkg-card__body">
          <p className="oz-pkg-card__loc"><I n="map-pin-line" />{item.location}</p>
          <h3><Link to={`/packages/${item.id}`}>{item.name}</Link></h3>
          <p className="oz-pkg-card__tagline">{item.tagline}</p>
          <ul className="oz-pkg-card__inc">
            {item.includes.slice(0,3).map(inc => <li key={inc}><I n="check-line" />{inc}</li>)}
            {item.includes.length > 3 && <li className="oz-muted"><I n="more-line" />+{item.includes.length - 3} more included</li>}
          </ul>
          <div className="oz-pkg-card__foot">
            <div className="oz-price">
              <span className="oz-muted">from </span><strong>${item.price.toLocaleString()}</strong>
              <span className="oz-muted"> /{item.pricePer}</span>
            </div>
            <Link to={`/packages/${item.id}`} className="oz-btn oz-btn--primary oz-btn--sm">View <I n="arrow-right-line" /></Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function BlogCard({ item, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="oz-blog-card">
        <Link to={`/blog/${item.id}`} className="oz-blog-card__img">
          <img src={item.cover} alt={item.title} loading="lazy" />
          <div className="oz-blog-card__veil" />
          <span className="oz-badge oz-badge--cat">{item.category}</span>
        </Link>
        <div className="oz-blog-card__body">
          <div className="oz-blog-card__meta">
            <span><I n="calendar-line" />{item.date}</span>
            <span><I n="time-line" />{item.readTime}</span>
          </div>
          <h3><Link to={`/blog/${item.id}`}>{item.title}</Link></h3>
          <p>{item.excerpt}</p>
          <div className="oz-blog-card__foot">
            <span className="oz-blog-card__author"><I n="quill-pen-line" />{item.author}</span>
            <Link to={`/blog/${item.id}`} className="oz-text-link">Read <I n="arrow-right-line" /></Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* ═══════════════════════════════════════════════════════
   HOME — HERO
═══════════════════════════════════════════════════════ */
function HeroSection() {
  const [cur, setCur] = useState(0)
  const [fading, setFading] = useState(false)
  const timer = useRef(null)

  const go = (i) => {
    if (fading) return
    setFading(true)
    setTimeout(() => { setCur(i); setFading(false) }, 180)
  }

  useEffect(() => {
    timer.current = setInterval(() => go((cur + 1) % HERO_SLIDES.length), 6500)
    return () => clearInterval(timer.current)
  }, [cur])

  const slide = HERO_SLIDES[cur]

  return (
    <section className={`oz-hero${fading ? ' oz-hero--fade' : ''}`}>
      {HERO_SLIDES.map((s, i) => (
        <div key={s.id}
          className={`oz-hero__bg${i === cur ? ' oz-hero__bg--on' : ''}`}
          style={{ backgroundImage: `url(${s.img})` }}
          aria-hidden="true" />
      ))}
      <div className="oz-hero__veil" />
      <div className="oz-hero__geo" aria-hidden="true" />

      <div className="oz-hero__body contain">
        <div className="oz-hero__text">
          <p className="oz-hero__eyebrow">
            <I n="map-pin-2-line" /> Ouzaft · Morocco's Finest
          </p>
          <h1 className="oz-hero__h1" key={cur}>
            {slide.headline.map((line, i) => (
              <span key={i} className="oz-hero__line" style={{ animationDelay: `${i * 90}ms` }}>
                {line}
              </span>
            ))}
          </h1>
          <p className="oz-hero__sub" key={`s${cur}`}>{slide.sub}</p>
          <div className="oz-hero__ctas">
            <Link to={slide.ctaTo} className="oz-btn oz-btn--hero">{slide.ctaLabel}</Link>
            <Link to="/packages" className="oz-btn oz-btn--hero-ghost">View Packages</Link>
          </div>
        </div>

        <div className="oz-hero__scroll" aria-hidden="true">
          <span className="oz-hero__scroll-label">Scroll</span>
          <span className="oz-hero__scroll-bar" />
        </div>
      </div>

      <div className="oz-hero__controls">
        <div className="oz-hero__dots" role="tablist">
          {HERO_SLIDES.map((s, i) => (
            <button key={s.id} role="tab"
              className={`oz-hero__dot${i === cur ? ' oz-hero__dot--on' : ''}`}
              onClick={() => go(i)} aria-selected={i === cur} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <div className="oz-hero__counter" aria-hidden="true">
          <span className="oz-hero__c-cur">{String(cur + 1).padStart(2,'0')}</span>
          <span className="oz-hero__c-sep">/</span>
          <span className="oz-hero__c-tot">{String(HERO_SLIDES.length).padStart(2,'0')}</span>
        </div>
      </div>

      <div className="oz-hero__arc" />
    </section>
  )
}

/* ─── Why Strip ────────────────────────────────────────── */
function WhyStrip() {
  return (
    <section className="oz-why-strip">
      <div className="contain oz-why-strip__grid">
        {WHY_ITEMS.map((w, i) => (
          <Reveal key={w.title} delay={i * 60}>
            <div className="oz-why-item">
              <span className="oz-why-item__ic"><I n={w.icon} /></span>
              <div>
                <strong>{w.title}</strong>
                <p>{w.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ─── Featured Stays ───────────────────────────────────── */
function FeaturedStays() {
  return (
    <section className="oz-section contain">
      <Reveal>
        <SectionHead eyebrow="Our Properties"
          title="Sanctuaries of Quiet Magnificence"
          body="Six properties across Morocco's most extraordinary landscapes — each one a private world."
          center />
      </Reveal>
      <div className="oz-stays-grid">
        {STAYS.slice(0,4).map((s,i) => <StayCard key={s.id} item={s} delay={i * 90} />)}
      </div>
      <Reveal>
        <div className="oz-cta-row">
          <Link to="/stay" className="oz-btn oz-btn--primary">View All Stays <I n="arrow-right-line" /></Link>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── Story Section ────────────────────────────────────── */
function StorySection() {
  const [ref, visible] = useFadeIn(0.12)
  return (
    <section className="oz-story contain">
      <div ref={ref} className={`oz-story__grid${visible ? ' oz-story__grid--in' : ''}`}>
        <div className="oz-story__imgs">
          <div className="oz-story__img-main">
            <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=700&auto=format&fit=crop" alt="Marrakech riad" loading="lazy" />
          </div>
          <div className="oz-story__img-float">
            <img src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&auto=format&fit=crop" alt="Sahara" loading="lazy" />
            <div className="oz-story__badge">
              <strong>Since</strong>
              <span>2009</span>
              <small>Building Ouzaft</small>
            </div>
          </div>
        </div>
        <div className="oz-story__text">
          <p className="oz-eyebrow-bare">Our Story</p>
          <h2>Born from the belief that luxury and authenticity are the same thing</h2>
          <OrnamentDivider />
          <p>Karim El Ouazzani grew up navigating the Draa Valley before becoming a hotel architect in Paris. He returned to Morocco in 2009 with a single conviction: that the world's greatest hospitality experience was already here, in the land's own materials, its people's inherited knowledge, and its landscapes' supernatural beauty.</p>
          <p>Ouzaft was built to reveal Morocco rather than package it. Every property is a collaboration with local craftspeople. Every guide is a keeper of knowledge that predates tourism by centuries.</p>
          <div className="oz-story__stats">
            {STATS.slice(0,3).map(s => (
              <div key={s.label} className="oz-story__stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <Link to="/about" className="oz-btn oz-btn--primary">Our Full Story <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Activities Teaser ────────────────────────────────── */
function ActivitiesTeaser() {
  return (
    <section className="oz-section oz-section--tinted">
      <div className="contain">
        <Reveal>
          <SectionHead eyebrow="Experiences" title="Moments That Remain Long After You Leave"
            body="Curated encounters with Morocco's most extraordinary natural and cultural wonders." center />
        </Reveal>
        <div className="oz-act-grid">
          {ACTIVITIES.slice(0,3).map((a,i) => <ActivityCard key={a.id} item={a} delay={i * 90} />)}
        </div>
        <Reveal>
          <div className="oz-cta-row">
            <Link to="/activities" className="oz-btn oz-btn--ghost">All Activities <I n="arrow-right-line" /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Packages Teaser ──────────────────────────────────── */
function PackagesTeaser() {
  return (
    <section className="oz-section contain">
      <Reveal>
        <SectionHead eyebrow="Curated Journeys" title="Complete Moroccan Immersions"
          body="Every detail — accommodation, experiences, transfers, and table reservations — designed as a single beautiful arc." center />
      </Reveal>
      <div className="oz-pkg-grid">
        {PACKAGES.slice(0,3).map((p,i) => <PackageCard key={p.id} item={p} delay={i * 90} />)}
      </div>
      <Reveal>
        <div className="oz-cta-row">
          <Link to="/packages" className="oz-btn oz-btn--primary">View All Packages <I n="arrow-right-line" /></Link>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── Full-Bleed Banner ────────────────────────────────── */
function FullBleedBanner() {
  return (
    <section className="oz-banner">
      <div className="oz-banner__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1800&auto=format&fit=crop')" }} />
      <div className="oz-banner__veil" />
      <div className="oz-banner__geo" aria-hidden="true" />
      <div className="oz-banner__body contain">
        <Reveal>
          <p className="oz-banner__eyebrow"><I n="star-line" /> Exclusively Yours</p>
          <h2>Reserve an Entire Property for Your Celebration</h2>
          <p>Weddings, anniversaries, family reunions — exclusively private, entirely Ouzaft.</p>
          <Link to="/contact" className="oz-btn oz-btn--hero">Enquire Now <I n="arrow-right-line" /></Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Testimonials ─────────────────────────────────────── */
function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const timer = useRef(null)

  const go = (i) => {
    setActive(i)
    clearInterval(timer.current)
    timer.current = setInterval(() => setActive(p => (p + 1) % TESTIMONIALS.length), 5500)
  }

  useEffect(() => {
    timer.current = setInterval(() => setActive(p => (p + 1) % TESTIMONIALS.length), 5500)
    return () => clearInterval(timer.current)
  }, [])

  const t = TESTIMONIALS[active]
  return (
    <section className="oz-section oz-section--tinted">
      <div className="contain">
        <Reveal><SectionHead eyebrow="Guest Voices" title="What Our Guests Say" center /></Reveal>
        <div className="oz-testimonials">
          <div className="oz-testimonials__main">
            <I n="double-quotes-l" className="oz-testimonials__ql" />
            <p className="oz-testimonials__text" key={active}>{t.text}</p>
            <div className="oz-testimonials__author">
              <img src={t.avatar} alt={t.name} loading="lazy" />
              <div>
                <strong>{t.name}</strong>
                <span className="oz-muted">{t.role}</span>
              </div>
              <Stars n={t.rating} />
            </div>
          </div>
          <div className="oz-testimonials__nav">
            {TESTIMONIALS.map((tb, i) => (
              <button key={i} onClick={() => go(i)}
                className={`oz-testimonials__thumb${i === active ? ' oz-testimonials__thumb--on' : ''}`}
                aria-label={`Testimonial by ${tb.name}`} aria-pressed={i === active}>
                <img src={tb.avatar} alt={tb.name} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Blog Teaser ──────────────────────────────────────── */
function BlogTeaser() {
  return (
    <section className="oz-section contain">
      <Reveal>
        <SectionHead eyebrow="The Ouzaft Journal" title="Stories from Morocco's Edges"
          body="Craft, landscape, people, and food — written by those who live and work inside these places." center />
      </Reveal>
      <div className="oz-blog-grid">
        {BLOG_POSTS.slice(0,3).map((b,i) => <BlogCard key={b.id} item={b} delay={i * 80} />)}
      </div>
      <Reveal>
        <div className="oz-cta-row">
          <Link to="/blog" className="oz-btn oz-btn--ghost">Read the Journal <I n="arrow-right-line" /></Link>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── Newsletter ───────────────────────────────────────── */
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const handleSub = (e) => { e.preventDefault(); if (email.trim()) { setDone(true); setEmail('') } }

  return (
    <section className="oz-newsletter">
      <div className="oz-newsletter__geo" aria-hidden="true" />
      <div className="contain oz-newsletter__body">
        <Reveal>
          <I n="send-plane-line" className="oz-newsletter__icon" />
          <h2>The Ouzaft Letter</h2>
          <p>Monthly dispatches from Morocco's rarest places — stories, seasonal specials, and private event invitations.</p>
          {done
            ? <p className="oz-newsletter__done"><I n="check-double-line" /> Wonderful. You're on the list — Shukran!</p>
            : (
              <form className="oz-newsletter__form" onSubmit={handleSub}>
                <input type="email" placeholder="Enter your email address" value={email}
                  onChange={e => setEmail(e.target.value)} required aria-label="Email" />
                <button type="submit" className="oz-btn oz-btn--primary">Subscribe <I n="arrow-right-line" /></button>
              </form>
            )
          }
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════ */
function HomePage() {
  return (
    <ErrorBoundary>
      <HeroSection />
      <WhyStrip />
      <FeaturedStays />
      <StorySection />
      <ActivitiesTeaser />
      <PackagesTeaser />
      <FullBleedBanner />
      <TestimonialsSection />
      <BlogTeaser />
      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   DETAIL PAGE SHELL (shared by Stay/Activity/Package)
═══════════════════════════════════════════════════════ */
function DetailLayout({ children, aside }) {
  return (
    <div className="oz-detail contain">
      <div className="oz-detail__main">{children}</div>
      <aside className="oz-detail__aside">{aside}</aside>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <section className="oz-detail__sec">
      <h2>{title}</h2>
      <OrnamentDivider />
      {children}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   STAY DETAIL PAGE
═══════════════════════════════════════════════════════ */
function StayDetailPage() {
  const loc = useLocation()
  const navigate = useNavigate()
  const id = loc.pathname.split('/').pop()
  const stay = STAYS.find(s => s.id === id)
  const [activeImg, setActiveImg] = useState(0)

  if (!stay) return (
    <div className="oz-section contain oz-404">
      <h2>Stay not found</h2>
      <button className="oz-btn oz-btn--primary" onClick={() => navigate('/stay')}>Back to Stays</button>
    </div>
  )

  return (
    <ErrorBoundary>
      <section className="oz-detail-hero">
        <div className="oz-detail-hero__gallery">
          <div className="oz-detail-hero__main-img">
            <img src={stay.images[activeImg] || stay.cover} alt={stay.name} />
          </div>
          <div className="oz-detail-hero__thumbs">
            {stay.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`oz-detail-hero__thumb${activeImg === i ? ' oz-detail-hero__thumb--on' : ''}`}>
                <img src={img} alt={`${stay.name} ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
        <div className="contain oz-detail-hero__info">
          <nav className="oz-breadcrumb">
            <Link to="/">Home</Link><I n="arrow-right-s-line" />
            <Link to="/stay">Stays</Link><I n="arrow-right-s-line" />
            <span>{stay.name}</span>
          </nav>
          <div className="oz-detail-hero__hd">
            <div>
              {stay.badge && <span className="oz-badge">{stay.badge}</span>}
              <h1>{stay.name}</h1>
              <p className="oz-detail-hero__loc"><I n="map-pin-2-line" />{stay.location}</p>
              <div className="oz-detail-hero__rat"><Stars n={Math.round(stay.rating)} /><strong>{stay.rating}</strong><span className="oz-muted">({stay.reviews} reviews)</span></div>
              <p className="oz-detail-hero__atmo">{stay.atmosphere}</p>
            </div>
            <div className="oz-detail-hero__cta-box">
              <div className="oz-price oz-price--lg"><strong>${stay.price.toLocaleString()}</strong><span className="oz-muted">/night</span></div>
              <Link to="/contact" className="oz-btn oz-btn--primary oz-btn--full"><I n="calendar-check-line" /> Reserve Now</Link>
              <Link to="/packages" className="oz-btn oz-btn--ghost oz-btn--full"><I n="gift-2-line" /> See Packages</Link>
            </div>
          </div>
        </div>
      </section>

      <DetailLayout
        aside={
          <>
            <div className="oz-detail__aside-card">
              <h3>Ready to stay?</h3>
              <p className="oz-muted">Our concierge builds a personalised itinerary around your dates.</p>
              <div className="oz-price oz-price--lg"><strong>${stay.price.toLocaleString()}</strong><span className="oz-muted">/night</span></div>
              <Link to="/contact" className="oz-btn oz-btn--primary oz-btn--full">Reserve This Stay</Link>
              <Link to="/packages" className="oz-btn oz-btn--ghost oz-btn--full">Include in a Package</Link>
            </div>
            <div className="oz-detail__aside-card oz-detail__aside-card--soft">
              <h4><I n="headphone-line" /> 24/7 Concierge</h4>
              <p className="oz-muted">One dedicated person, always available.</p>
              <a href="tel:+212522000000" className="oz-btn oz-btn--ghost oz-btn--full"><I n="phone-line" /> Call Us</a>
              <a href="mailto:stay@ouzaft.ma" className="oz-btn oz-btn--ghost oz-btn--full"><I n="mail-line" /> Email Us</a>
            </div>
          </>
        }
      >
        <DetailSection title="The Experience"><p>{stay.description}</p></DetailSection>
        <DetailSection title="Highlights">
          <ul className="oz-check-list">
            {stay.highlights.map(h => <li key={h}><I n="checkbox-circle-line" />{h}</li>)}
          </ul>
        </DetailSection>
        <DetailSection title="Amenities">
          <div className="oz-amenities">
            {stay.amenities.map(a => <span key={a} className="oz-amenity"><I n="check-double-line" />{a}</span>)}
          </div>
        </DetailSection>
      </DetailLayout>
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   STAYS PAGE
═══════════════════════════════════════════════════════ */
function StayPage() {
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...new Set(STAYS.map(s => s.category))]
  const filtered = filter === 'All' ? STAYS : STAYS.filter(s => s.category === filter)

  return (
    <ErrorBoundary>
      <PageHero title="Our Stays"
        subtitle="Six extraordinary properties across Morocco's most magnificent landscapes"
        image="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600&auto=format&fit=crop"
        breadcrumb="Stay" />
      <section className="oz-section contain">
        <Reveal>
          <div className="oz-filters">
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`oz-filter-btn${filter === c ? ' oz-filter-btn--on' : ''}`}>{c}</button>
            ))}
          </div>
        </Reveal>
        <div className="oz-stays-grid oz-stays-grid--full">
          {filtered.map((s,i) => <StayCard key={s.id} item={s} delay={i * 60} />)}
        </div>
      </section>
      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   ACTIVITY DETAIL PAGE
═══════════════════════════════════════════════════════ */
function ActivityDetailPage() {
  const loc = useLocation()
  const navigate = useNavigate()
  const id = loc.pathname.split('/').pop()
  const act = ACTIVITIES.find(a => a.id === id)

  if (!act) return (
    <div className="oz-section contain oz-404">
      <h2>Activity not found</h2>
      <button className="oz-btn oz-btn--primary" onClick={() => navigate('/activities')}>Back</button>
    </div>
  )

  return (
    <ErrorBoundary>
      <PageHero title={act.name} subtitle={act.tagline} image={act.cover} breadcrumb="Activities" />
      <DetailLayout
        aside={
          <div className="oz-detail__aside-card">
            <h3>Book This Activity</h3>
            <div className="oz-price oz-price--lg"><strong>${act.price}</strong><span className="oz-muted">/person</span></div>
            <p className="oz-muted">{act.groupSize} · {act.duration}</p>
            <Link to="/contact" className="oz-btn oz-btn--primary oz-btn--full"><I n="calendar-check-line" /> Book Now</Link>
          </div>
        }
      >
        <DetailSection title="About This Experience">
          <div className="oz-detail-meta-row">
            <span className="oz-diff" data-diff={act.difficulty.toLowerCase()}>{act.difficulty}</span>
            <span><I n="time-line" />{act.duration}</span>
            <span><I n="group-line" />{act.groupSize}</span>
            {act.badge && <span className="oz-badge">{act.badge}</span>}
          </div>
          <p>{act.description}</p>
        </DetailSection>
        <DetailSection title="What's Included">
          <ul className="oz-check-list">
            {act.includes.map(inc => <li key={inc}><I n="check-double-line" />{inc}</li>)}
          </ul>
        </DetailSection>
        <DetailSection title="What to Expect">
          <ol className="oz-timeline">
            {act.whatToExpect.map((step, i) => (
              <li key={i} className="oz-timeline__item">
                <span className="oz-timeline__n">{String(i+1).padStart(2,'0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </DetailSection>
      </DetailLayout>
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   ACTIVITIES PAGE
═══════════════════════════════════════════════════════ */
function ActivitiesPage() {
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...new Set(ACTIVITIES.map(a => a.category))]
  const filtered = filter === 'All' ? ACTIVITIES : ACTIVITIES.filter(a => a.category === filter)

  return (
    <ErrorBoundary>
      <PageHero title="Activities & Experiences"
        subtitle="From deep-Sahara stargazing to medina artisan walks — Morocco's most meaningful encounters"
        image="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600&auto=format&fit=crop"
        breadcrumb="Activities" />
      <section className="oz-section contain">
        <Reveal>
          <div className="oz-filters">
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`oz-filter-btn${filter === c ? ' oz-filter-btn--on' : ''}`}>{c}</button>
            ))}
          </div>
        </Reveal>
        <div className="oz-act-grid oz-act-grid--full">
          {filtered.map((a,i) => <ActivityCard key={a.id} item={a} delay={i * 70} />)}
        </div>
      </section>
      <FullBleedBanner />
      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   PACKAGE DETAIL PAGE
═══════════════════════════════════════════════════════ */
function PackageDetailPage() {
  const loc = useLocation()
  const navigate = useNavigate()
  const id = loc.pathname.split('/').pop()
  const pkg = PACKAGES.find(p => p.id === id)

  if (!pkg) return (
    <div className="oz-section contain oz-404">
      <h2>Package not found</h2>
      <button className="oz-btn oz-btn--primary" onClick={() => navigate('/packages')}>Back</button>
    </div>
  )

  return (
    <ErrorBoundary>
      <PageHero title={pkg.name} subtitle={pkg.tagline} image={pkg.cover} breadcrumb="Packages" />
      <DetailLayout
        aside={
          <>
            <div className="oz-detail__aside-card">
              <h3>Reserve This Package</h3>
              <div className="oz-price oz-price--lg">
                <strong>${pkg.price.toLocaleString()}</strong>
                <span className="oz-muted"> /{pkg.pricePer}</span>
              </div>
              <p className="oz-muted">{pkg.duration} · {pkg.location}</p>
              <Link to="/contact" className="oz-btn oz-btn--primary oz-btn--full"><I n="calendar-check-line" /> Enquire Now</Link>
              <Link to="/contact" className="oz-btn oz-btn--ghost oz-btn--full"><I n="chat-1-line" /> Speak to Concierge</Link>
            </div>
            <div className="oz-detail__aside-card oz-detail__aside-card--soft">
              <p className="oz-muted" style={{ fontSize:'0.85rem' }}>All packages include a dedicated concierge. Fully customisable itineraries available.</p>
            </div>
          </>
        }
      >
        <DetailSection title="The Journey">
          <div className="oz-detail-meta-row">
            {pkg.badge && <span className="oz-badge">{pkg.badge}</span>}
            <span><I n="calendar-2-line" />{pkg.duration}</span>
            <span><I n="map-pin-line" />{pkg.location}</span>
          </div>
          <p>{pkg.description}</p>
        </DetailSection>
        <DetailSection title="Everything Included">
          <ul className="oz-check-list">
            {pkg.includes.map(inc => <li key={inc}><I n="checkbox-circle-line" />{inc}</li>)}
          </ul>
        </DetailSection>
        <DetailSection title="Day by Day">
          <ol className="oz-itinerary">
            {pkg.itinerary.map(day => (
              <li key={day.day} className="oz-itinerary__day">
                <div className="oz-itinerary__n">
                  <span>Day</span>
                  <strong>{day.day}</strong>
                </div>
                <div className="oz-itinerary__body">
                  <h4>{day.title}</h4>
                  <p>{day.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </DetailSection>
      </DetailLayout>
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   PACKAGES PAGE
═══════════════════════════════════════════════════════ */
function PackagesPage() {
  return (
    <ErrorBoundary>
      <PageHero title="Curated Journeys"
        subtitle="Complete Morocco immersions — every detail designed as a single beautiful arc"
        image="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&auto=format&fit=crop"
        breadcrumb="Packages" />
      <section className="oz-section contain">
        <Reveal>
          <SectionHead eyebrow="All Packages" title="Choose Your Morocco"
            body="From four-night desert escapes to nine-night grand tours — each one fully managed by our team." center />
        </Reveal>
        <div className="oz-pkg-grid oz-pkg-grid--2col">
          {PACKAGES.map((p,i) => <PackageCard key={p.id} item={p} delay={i * 80} />)}
        </div>
      </section>
      <FullBleedBanner />
      <TestimonialsSection />
      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════ */
function AboutPage() {
  return (
    <ErrorBoundary>
      <PageHero title="About Ouzaft"
        subtitle="Built by those who love Morocco — for those who are ready to understand it"
        image="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&auto=format&fit=crop"
        breadcrumb="About" />

      <section className="oz-section contain">
        <div className="oz-about-intro">
          <Reveal direction="left" className="oz-about-intro__text">
            <p className="oz-eyebrow-bare">Our Philosophy</p>
            <h2>Luxury as a form of cultural respect</h2>
            <OrnamentDivider />
            <p>Most luxury travel imports comfort from elsewhere and layers it onto a destination. Ouzaft does the opposite: we extract the finest that Morocco already contains — its craftspeople, its landscapes, its flavours, its silence — and present it with the precision and care that an exceptional experience deserves.</p>
            <p>Our guests do not observe Morocco. They participate in it. They hunt truffles, scrub with century-old soap, cook on charcoal fires, and sleep under skies that have not changed since the Saharan trade routes were alive. The luxury is in the access. The depth is in the authenticity.</p>
          </Reveal>
          <Reveal direction="right" className="oz-about-intro__imgs">
            <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=700&auto=format&fit=crop" alt="Marrakech riad" loading="lazy" />
            <div className="oz-about-intro__accent">
              <img src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=350&auto=format&fit=crop" alt="Sahara dunes" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="oz-stats-bar">
        <div className="contain oz-stats-bar__grid">
          {STATS.map((s,i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="oz-stat">
                <I n={s.icon} className="oz-stat__ic" />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="oz-section contain">
        <Reveal><SectionHead eyebrow="Why Ouzaft" title="Six Reasons to Choose Differently" center /></Reveal>
        <div className="oz-why-grid">
          {WHY_ITEMS.map((w,i) => (
            <Reveal key={w.title} delay={i * 80}>
              <div className="oz-why-card">
                <span className="oz-why-card__ic"><I n={w.icon} /></span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="oz-section oz-section--tinted">
        <div className="contain">
          <Reveal>
            <SectionHead eyebrow="The People" title="Meet the Ouzaft Team"
              body="We are guides, chefs, astronomers, and healers — each one born from the place they bring to life." center />
          </Reveal>
          <div className="oz-team-grid">
            {TEAM.map((m,i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="oz-team-card">
                  <div className="oz-team-card__img"><img src={m.avatar} alt={m.name} loading="lazy" /></div>
                  <div className="oz-team-card__body">
                    <strong>{m.name}</strong>
                    <span className="oz-muted">{m.role}</span>
                    <p>{m.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="oz-section contain">
        <Reveal><SectionHead eyebrow="From the Journal" title="Recent Stories" center /></Reveal>
        <div className="oz-blog-grid">
          {BLOG_POSTS.slice(0,3).map((b,i) => <BlogCard key={b.id} item={b} delay={i * 80} />)}
        </div>
      </section>
      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'Reservation Enquiry', message:'' })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [expanded, setExpanded] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSent(true); setErrors({})
  }

  return (
    <ErrorBoundary>
      <PageHero title="Contact Us"
        subtitle="Our concierge team is available 24 hours a day, seven days a week"
        image="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&auto=format&fit=crop"
        breadcrumb="Contact" />

      <section className="oz-section contain">
        <div className="oz-contact-grid">
          <div className="oz-contact-form-wrap">
            <Reveal>
              <h2>Send a Message</h2>
              <p className="oz-muted">Whether planning a first visit or a tenth, we build every stay from scratch with you.</p>
            </Reveal>
            {sent
              ? (
                <Reveal>
                  <div className="oz-contact-success">
                    <I n="check-double-line" />
                    <h3>Message sent — Shukran!</h3>
                    <p>Your concierge will respond within 4 hours.</p>
                  </div>
                </Reveal>
              )
              : (
                <form className="oz-contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="oz-field-row">
                    <div className="oz-field">
                      <label htmlFor="cf-name">Full Name *</label>
                      <input id="cf-name" type="text" placeholder="Your full name"
                        value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                      {errors.name && <span className="oz-field-err">{errors.name}</span>}
                    </div>
                    <div className="oz-field">
                      <label htmlFor="cf-email">Email Address *</label>
                      <input id="cf-email" type="email" placeholder="you@example.com"
                        value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                      {errors.email && <span className="oz-field-err">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="oz-field-row">
                    <div className="oz-field">
                      <label htmlFor="cf-phone">Phone (optional)</label>
                      <input id="cf-phone" type="tel" placeholder="+212 xxx xxx xxx"
                        value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                    </div>
                    <div className="oz-field">
                      <label htmlFor="cf-subject">Subject</label>
                      <select id="cf-subject" value={form.subject}
                        onChange={e => setForm(f => ({...f, subject: e.target.value}))}>
                        <option>Reservation Enquiry</option>
                        <option>Package Information</option>
                        <option>Activity Booking</option>
                        <option>Private Event</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="oz-field">
                    <label htmlFor="cf-msg">Message *</label>
                    <textarea id="cf-msg" rows={5}
                      placeholder="Tell us about your ideal stay, dates, group size, and any special requirements..."
                      value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
                    {errors.message && <span className="oz-field-err">{errors.message}</span>}
                  </div>
                  <button type="submit" className="oz-btn oz-btn--primary">
                    <I n="send-plane-line" /> Send Message
                  </button>
                </form>
              )
            }
          </div>

          <div className="oz-contact-info">
            <Reveal><h2>Find Us</h2></Reveal>
            <div className="oz-contact-cards">
              {[
                { icon:'phone-line',     label:'Phone',   val:'+212 522 00 00 00',             sub:'Available 24/7' },
                { icon:'mail-line',      label:'Email',   val:'stay@ouzaft.ma',                sub:'Reply within 4 hours' },
                { icon:'map-pin-2-line', label:'Address', val:'Merzouga, Errachidia Province', sub:'Morocco' },
                { icon:'time-line',      label:'Hours',   val:'24 / 7 / 365',                  sub:'Concierge always available' },
              ].map(c => (
                <Reveal key={c.label} delay={80}>
                  <div className="oz-contact-card">
                    <I n={c.icon} className="oz-contact-card__ic" />
                    <div>
                      <strong>{c.label}</strong>
                      <p>{c.val}</p>
                      <span className="oz-muted">{c.sub}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="oz-section oz-section--tinted">
        <div className="contain">
          <Reveal><SectionHead eyebrow="Frequently Asked" title="Questions & Answers" center /></Reveal>
          <div className="oz-faq-grid">
            {FAQ.map((item, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className={`oz-faq-item${expanded === i ? ' oz-faq-item--open' : ''}`}>
                  <button className="oz-faq-item__q"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    aria-expanded={expanded === i}>
                    <span>{item.q}</span>
                    <I n={expanded === i ? 'subtract-line' : 'add-line'} />
                  </button>
                  {expanded === i && <p className="oz-faq-item__a">{item.a}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   BLOG PAGE
═══════════════════════════════════════════════════════ */
function BlogPage() {
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(BLOG_POSTS.map(b => b.category))]
  const filtered = cat === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(b => b.category === cat)

  return (
    <ErrorBoundary>
      <PageHero title="The Ouzaft Journal"
        subtitle="Stories from Morocco's most extraordinary places — written by those who live inside them"
        image="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&auto=format&fit=crop"
        breadcrumb="Journal" />
      <section className="oz-section contain">
        <Reveal>
          <div className="oz-filters">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`oz-filter-btn${cat === c ? ' oz-filter-btn--on' : ''}`}>{c}</button>
            ))}
          </div>
        </Reveal>
        <div className="oz-blog-grid">
          {filtered.map((b,i) => <BlogCard key={b.id} item={b} delay={i * 80} />)}
        </div>
      </section>
      <NewsletterSection />
    </ErrorBoundary>
  )
}

/* ═══════════════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════════════ */
function AppShell() {
  const location = useLocation()
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('ouzaft-mode')
    return MODES.map(m => m.id).includes(saved) ? saved : 'light'
  })

  useEffect(() => {
    document.body.dataset.mode = mode
    localStorage.setItem('ouzaft-mode', mode)
  }, [mode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="oz-app">
      <SiteHeader mode={mode} setMode={setMode} />
      <main className="oz-main">
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/stay"           element={<StayPage />} />
          <Route path="/stay/:id"       element={<StayDetailPage />} />
          <Route path="/activities"     element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetailPage />} />
          <Route path="/packages"       element={<PackagesPage />} />
          <Route path="/packages/:id"   element={<PackageDetailPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/blog"           element={<BlogPage />} />
          <Route path="*"               element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppShell
