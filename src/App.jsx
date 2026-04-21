import { useState, useEffect, useRef, Component } from 'react'
import { Routes, Route, Link, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom'
import _DatePickerModule from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
const DatePicker = _DatePickerModule.default ?? _DatePickerModule
import './App.css'
import { AnimatedMarqueeHero } from './components/ui/hero-3'
import { CircularGallery } from './components/ui/circular-gallery'

/* ── Icon wrapper ── */
const I = ({ n, className }) => <i className={`ri-${n} ${className || ''}`} />

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0e0c09', color: '#f0ead8', minHeight: '100vh' }}>
          <h2 style={{ color: '#e08a45', marginBottom: '1rem' }}>Render Error � check console</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ff8a70', fontSize: '0.85rem' }}>{String(this.state.error)}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#a89880', fontSize: '0.75rem', marginTop: '1rem' }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

/* ══════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════ */

const ROOMS = [
  {
    id: 'oasis-suite',
    name: 'Oasis Suite',
    category: 'Suite',
    tagline: 'Your private sanctuary above the dunes',
    price: 420,
    originalPrice: 560,
    size: '78 m²',
    capacity: '2 Adults',
    bed: 'King Bed',
    view: 'Desert & Pool View',
    rating: 4.9,
    reviews: 214,
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&auto=format&fit=crop',
    ],
    amenities: ['Free WiFi', 'Private Plunge Pool', 'Butler Service', 'AC', 'Mini Bar', 'Rainfall Shower', 'Terrace', 'Room Service'],
    description: 'Perched above the terracotta dunes, the Oasis Suite blends raw earth textures with curated luxury. A private plunge pool, hand-carved furnishings, and panoramic desert views define this immersive retreat.',
    extras: 'Complimentary sunset camel ride · Daily breakfast · Turndown service',
  },
  {
    id: 'coral-villa',
    name: 'Coral Villa',
    category: 'Villa',
    tagline: 'Oceanfront living with barefoot elegance',
    price: 680,
    originalPrice: 820,
    size: '120 m²',
    capacity: '4 Adults',
    bed: '2 King Beds',
    view: 'Direct Ocean View',
    rating: 4.95,
    reviews: 189,
    badge: 'Top Pick',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop',
    ],
    amenities: ['Private Beach Access', 'Infinity Pool', 'Full Kitchen', 'Free WiFi', 'AC', 'Outdoor Shower', 'BBQ Deck', 'Concierge'],
    description: 'Steps from the tide line, the Coral Villa offers two king bedrooms, a fully equipped kitchen, and a sunset deck with built-in BBQ. Designed for families or groups craving space without sacrificing indulgence.',
    extras: 'Private speedboat transfer · Weekly housekeeping · Baby cot on request',
  },
  {
    id: 'forest-lodge',
    name: 'Forest Lodge',
    category: 'Lodge',
    tagline: 'Immersed in canopy, rooted in comfort',
    price: 290,
    originalPrice: null,
    size: '55 m²',
    capacity: '2 Adults',
    bed: 'Queen Bed',
    view: 'Rainforest View',
    rating: 4.8,
    reviews: 302,
    badge: null,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536625882659-8eecc4c19d91?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
    ],
    amenities: ['Free WiFi', 'Hammock Deck', 'Guided Hike', 'AC', 'Breakfast Included', 'Eco Toiletries', 'Library Corner'],
    description: 'Elevated on stilts within a living rainforest, the Forest Lodge is a study in sustainable luxury. Handwoven textiles, reclaimed timber floors, and a hammock deck open to birdsong at dawn.',
    extras: 'Daily breakfast · One guided forest hike · Yoga mat & gear',
  },
  {
    id: 'skyline-loft',
    name: 'Skyline Loft',
    category: 'Loft',
    tagline: 'Urban altitude, artisan soul',
    price: 230,
    originalPrice: 285,
    size: '48 m²',
    capacity: '2 Adults',
    bed: 'Double Bed',
    view: 'City Skyline View',
    rating: 4.75,
    reviews: 267,
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&auto=format&fit=crop',
    ],
    amenities: ['Free WiFi', 'Rooftop Terrace', 'Espresso Bar', 'AC', 'Gym Access', 'Vinyl Record Player', 'City Map Kit'],
    description: 'A raw-edge loft in the heart of the old medina quarter. Exposed brick, bespoke local art, and floor-to-ceiling windows frame the city at golden hour. Perfect for the culturally curious traveller.',
    extras: 'City walking tour · Daily rooftop breakfast · Airport transfer',
  },
  {
    id: 'cave-hideaway',
    name: 'Cave Hideaway',
    category: 'Cave',
    tagline: 'Ancient stone, modern wonder',
    price: 310,
    originalPrice: null,
    size: '60 m²',
    capacity: '2 Adults',
    bed: 'King Bed',
    view: 'Cliffside Sea View',
    rating: 4.88,
    reviews: 155,
    badge: 'Unique',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop',
    ],
    amenities: ['Free WiFi', 'Private Hot Tub', 'Sea View Terrace', 'AC', 'Wine Cellar', 'Stargazing Deck', 'Outdoor Firepit'],
    description: 'Carved into a volcanic cliff, the Cave Hideaway is Azura\'s most talked-about stay. Natural stone arches, a private hot tub at the cliff edge, and a wine cellar stocked with local labels await.',
    extras: 'Sunset cocktail hour · Cave art tour · Daily mineral water',
  },
  {
    id: 'lagoon-bungalow',
    name: 'Lagoon Bungalow',
    category: 'Bungalow',
    tagline: 'Overwater dreams, just within reach',
    price: 540,
    originalPrice: 650,
    size: '90 m²',
    capacity: '2–3 Adults',
    bed: 'King Bed + Daybed',
    view: 'Overwater Lagoon View',
    rating: 4.92,
    reviews: 178,
    badge: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&auto=format&fit=crop',
    ],
    amenities: ['Glass Floor Panel', 'Overwater Deck', 'Snorkel Kit', 'Free WiFi', 'AC', 'Outdoor Rain Shower', 'Kayak Access', 'Minibar'],
    description: 'Suspended above a turquoise lagoon, this bungalow features a glass floor panel revealing the marine life below. Wake to the sound of gentle waves and step directly onto your private overwater deck.',
    extras: 'Sunrise kayak tour · Couples massage · Snorkel guided tour',
  },
]

const ACTIVITIES = [
  {
    id: 'desert-safari',
    name: 'Desert Safari Expedition',
    category: 'Adventure',
    tagline: 'Chase the horizon across golden dunes',
    duration: '8 hrs',
    groupSize: 'Max 8',
    difficulty: 'Moderate',
    price: 145,
    rating: 4.9,
    reviews: 312,
    badge: 'Most Booked',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop',
    ],
    includes: ['4×4 Transport', 'Camel Ride', 'Sunset BBQ Dinner', 'Guide', 'Water'],
    description: 'Board a vintage 4×4 at dawn and venture deep into the ochre desert. Traverse sculpted dunes, meet Bedouin nomads, mount camels at the golden hour, then feast under a blanket of stars.',
    itinerary: ['05:30 Pickup from property', '07:00 First dune belt', '09:30 Bedouin camp breakfast', '12:00 Camel trek', '17:30 Sunset viewpoint', '19:00 BBQ dinner under stars', '22:00 Return'],
  },
  {
    id: 'reef-dive',
    name: 'Coral Reef Diving',
    category: 'Water',
    tagline: 'Descend into a living kaleidoscope',
    duration: '5 hrs',
    groupSize: 'Max 6',
    difficulty: 'Beginner friendly',
    price: 110,
    rating: 4.95,
    reviews: 264,
    badge: 'Top Rated',
    images: [
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&auto=format&fit=crop',
    ],
    includes: ['Full Dive Gear', 'Certified Guide', 'Boat Transfer', 'Underwater Photos', 'Snack Box'],
    description: 'Plunge into crystal waters above a protected coral reef teeming with colour. Whether you\'re a first-timer or certified diver, our PADI-certified guides ensure a safe and awe-inspiring descent.',
    itinerary: ['08:00 Briefing & gear up', '09:00 Boat departs', '10:00 First dive site', '11:30 Surface break & snacks', '12:30 Second dive site', '14:00 Return to shore'],
  },
  {
    id: 'forest-trek',
    name: 'Rainforest Canopy Trek',
    category: 'Nature',
    tagline: 'Walk among giants in a living cathedral',
    duration: '6 hrs',
    groupSize: 'Max 10',
    difficulty: 'Easy–Moderate',
    price: 85,
    rating: 4.85,
    reviews: 198,
    badge: null,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop',
    ],
    includes: ['Naturalist Guide', 'Packed Lunch', 'Insect Repellent', 'Binoculars', 'Certificate'],
    description: 'A naturalist-led walk through ancient rainforest reveals medicinal plants, exotic wildlife, and hidden waterfalls. Treetop rope bridges provide canopy-level views that defy gravity.',
    itinerary: ['07:00 Pickup', '08:30 Trailhead briefing', '10:00 Waterfall stop', '12:00 Canopy bridge walk', '13:00 Packed lunch', '15:00 Return trail', '16:30 Drop-off'],
  },
  {
    id: 'sunrise-yoga',
    name: 'Sunrise Cliff Yoga',
    category: 'Wellness',
    tagline: 'Breathe with the earth as your mat',
    duration: '2 hrs',
    groupSize: 'Max 12',
    difficulty: 'All levels',
    price: 55,
    rating: 4.9,
    reviews: 421,
    badge: 'Fan Favourite',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&auto=format&fit=crop',
    ],
    includes: ['Mat & Props', 'Herbal Tea', 'Certified Instructor', 'Meditation session'],
    description: 'As the sun rises over the horizon, join our resident instructor for a 90-minute flow on a sea-facing cliff terrace. Pranayama breathing and meditation follow. A ritual that resets your entire day.',
    itinerary: ['05:45 Meet at cliff terrace', '06:00 Gentle warm-up', '06:30 Vinyasa flow', '07:15 Meditation & breathwork', '07:45 Herbal tea ceremony', '08:00 Close'],
  },
  {
    id: 'local-food-tour',
    name: 'Village Food & Market Tour',
    category: 'Culture',
    tagline: 'Taste your way through living traditions',
    duration: '4 hrs',
    groupSize: 'Max 14',
    difficulty: 'Easy',
    price: 75,
    rating: 4.88,
    reviews: 335,
    badge: null,
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop',
    ],
    includes: ['Local Guide', 'All Tastings', 'Recipe Card', 'Market Token', 'Transport'],
    description: 'Wind through the spice-scented alleyways of the old village market. Sample 12+ local dishes, watch artisans at work, and learn recipes passed down across generations. The soul of the destination on a plate.',
    itinerary: ['09:00 Meet at village gate', '09:20 Spice quarter', '10:00 First tasting stop', '10:45 Artisan workshop', '11:30 Main market tasting', '12:30 Cooking demo', '13:00 End'],
  },
  {
    id: 'stargazing',
    name: 'Astrophotography & Stargazing',
    category: 'Night',
    tagline: 'The universe on a cloudless night',
    duration: '3 hrs',
    groupSize: 'Max 10',
    difficulty: 'Easy',
    price: 90,
    rating: 4.93,
    reviews: 289,
    badge: 'Exclusive',
    images: [
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=900&auto=format&fit=crop',
    ],
    includes: ['Telescope Time', 'Astrophotography Guide', 'Hot Drinks', 'Digital Star Map', 'Photo USB'],
    description: 'Far from light pollution, in a designated dark-sky zone, our astrophotographer guides you through constellations, deep-sky objects, and captures the Milky Way with your camera. A perspective-shifting experience.',
    itinerary: ['20:30 Transport departs', '21:15 Dark sky site', '21:30 Constellation tour', '22:00 Telescope session', '22:45 Astrophotography', '23:30 Return'],
  },
]

const PACKAGES = [
  {
    id: 'essence-escape',
    name: 'Essence Escape',
    tagline: 'Three nights, pure immersion, zero compromise',
    nights: 3,
    price: 1290,
    originalPrice: 1650,
    badge: 'Most Popular',
    highlight: 'Perfect for couples',
    coverImg: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop',
    ],
    room: 'Oasis Suite',
    includes: ['3 Nights Accommodation', 'Daily Breakfast', 'Desert Safari Expedition', 'Sunrise Cliff Yoga (2×)', 'Airport Transfers', 'Welcome Cocktails'],
    description: 'The Essence Escape is our signature couples package — three unhurried nights in the Oasis Suite, wrapped around the moments that matter. Safari at dawn, yoga on the cliff, and dinners that last until the stars arrive.',
    highlights: ['Private dune dinner setup', 'Couples spa session (60 min)', 'Custom activity concierge', 'Late checkout (2pm)'],
  },
  {
    id: 'explorer-week',
    name: 'Explorer Week',
    tagline: 'Seven days of curated discovery',
    nights: 7,
    price: 3490,
    originalPrice: 4400,
    badge: 'Best Value',
    highlight: 'For adventurers',
    coverImg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
    ],
    room: 'Forest Lodge',
    includes: ['7 Nights Accommodation', 'All Meals', 'Desert Safari', 'Reef Diving', 'Forest Trek', 'Food & Market Tour', 'Stargazing Night', 'All Transfers'],
    description: 'Seven days that unfold like chapters in a great travel novel. Every activity in our repertoire, all meals curated to reflect local ingredients, and a lodge nestled in the canopy for total immersion.',
    highlights: ['Private guide for 2 days', 'Waterfall picnic setup', 'Souvenir artisan workshop', 'Printed photo album on departure'],
  },
  {
    id: 'family-odyssey',
    name: 'Family Odyssey',
    tagline: 'Adventures the whole family will never forget',
    nights: 5,
    price: 2680,
    originalPrice: 3100,
    badge: 'Family Favourite',
    highlight: 'Up to 4 guests',
    coverImg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&auto=format&fit=crop',
    ],
    room: 'Coral Villa',
    includes: ['5 Nights in Coral Villa', 'All Breakfasts', 'Desert Safari (child-friendly)', 'Village Food Tour', 'Beach Day with Equipment', 'Kids Activity Program', 'Airport Transfers'],
    description: 'Designed for families with children of all ages, the Family Odyssey pairs spacious villa living with age-appropriate adventures. Kids\' treasure hunts, sandcastle afternoons, and cooking sessions build lifelong memories.',
    highlights: ['Kids welcome pack & activity kit', 'Family portrait session', 'Child-friendly guides throughout', 'Babysitting available (on request)'],
  },
  {
    id: 'wellness-reset',
    name: 'Wellness Reset',
    tagline: 'Return to stillness in five transformative days',
    nights: 5,
    price: 2150,
    originalPrice: null,
    badge: 'Wellness',
    highlight: 'Solo or couple',
    coverImg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=900&auto=format&fit=crop',
    ],
    room: 'Cave Hideaway',
    includes: ['5 Nights in Cave Hideaway', 'Plant-based Meal Plan', 'Daily Sunrise Yoga', 'Sound Bath Session', 'Forest Trek', 'Massage (2×)', 'Digital Detox Toolkit'],
    description: 'Five days designed to untangle the mind and restore the body. A plant-based meal plan, daily yoga at cliff\'s edge, sound bath ceremonies, and guided forest meditation. No screens. No rush. Just you.',
    highlights: ['Personal wellness consultant', 'Guided breathwork at sunrise', 'Herbal remedy workshop', 'Departure wellness journal'],
  },
]

const TEAM = [
  { name: 'Layla Hassan', role: 'Head Guide & Co-founder', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop' },
  { name: 'Marco Ferrini', role: 'Marine Activities Director', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' },
  { name: 'Amara Diallo', role: 'Cultural Experience Lead', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop' },
  { name: 'Yuki Tanaka', role: 'Wellness & Yoga Director', img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop' },
]

const TESTIMONIALS = [
  { name: 'Charlotte B.', origin: 'London, UK', text: 'Azura is unlike anything I\'ve experienced. The Cave Hideaway felt like time had stopped — in the best possible way. The Explorer Week itinerary was flawlessly curated.', rating: 5, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop' },
  { name: 'Rafi Mourad', origin: 'Casablanca, Morocco', text: 'We did the Family Odyssey with two kids (ages 6 and 9) and they still talk about the desert safari and cooking class six months later. The team thought of everything.', rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
  { name: 'Sofia Rinaldi', origin: 'Milan, Italy', text: 'The Wellness Reset gave me back something I didn\'t know I\'d lost. The cliff yoga at 6am, the cave hot tub at midnight — a complete reset. Already planning to return.', rating: 5, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop' },
  { name: 'James Okafor', origin: 'Lagos, Nigeria', text: 'Booked for our honeymoon. Azura delivered on every level — the Lagoon Bungalow is pure magic, the reef diving was otherworldly, and the staff anticipate every need.', rating: 5, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop' },
]

const STATS = [
  { value: '18+', label: 'Years Operating', icon: 'calendar-check-line' },
  { value: '42K+', label: 'Guests Hosted', icon: 'user-heart-line' },
  { value: '98%', label: 'Satisfaction Rate', icon: 'star-smile-line' },
  { value: '60+', label: 'Curated Experiences', icon: 'compass-3-line' },
]

const AMENITIES = [
  { icon: 'droplet-line', label: 'Infinity Pool', desc: 'Suspended above the landscape with panoramic views' },
  { icon: 'restaurant-line', label: 'Fine Dining', desc: 'Farm-to-table cuisine with regional ingredients' },
  { icon: 'heart-pulse-line', label: 'Holistic Spa', desc: 'Treatments drawing from ancient wellness traditions' },
  { icon: 'sun-line', label: 'Beach Club', desc: 'Private coves, sun loungers and watersports' },
  { icon: 'wifi-line', label: 'High-Speed WiFi', desc: 'Seamless connectivity throughout the property' },
  { icon: 'car-line', label: 'Private Transfers', desc: 'Airport pickups and curated day trips' },
  { icon: 'customer-service-2-line', label: '24h Concierge', desc: 'Your dedicated team, always available' },
  { icon: 'goblet-line', label: 'Sunset Bar', desc: 'Craft cocktails and local spirits at golden hour' },
]

/* ══════════════════════════════════════════════════════
   TOP ANNOUNCEMENT BAR
   ══════════════════════════════════════════════════════ */
function AnnouncementBar() {
  const items = [
    '✦ Free airport transfer on stays of 3+ nights',
    '✦ New: Astrophotography Stargazing experience — book now',
    '✦ Explorer Week — 20% off until May 31',
    '✦ Coral Reef Diving now available year-round',
    '✦ Family Odyssey package — kids under 12 stay free',
  ]
  const track = [...items, ...items, ...items].join('   ·   ')
  return (
    <div className="ann-bar">
      <div className="ann-track-wrap">
        <span className="ann-track">{track}</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SITE HEADER
   ══════════════════════════════════════════════════════ */
/* ──────────────────────────────────────────────────────
   THEME SWITCHER — reusable pill with icon buttons
   ────────────────────────────────────────────────────── */
const THEME_MODES = [
  { id: 'light',  icon: 'sun-line',    label: 'Light'  },
  { id: 'dark',   icon: 'moon-line',   label: 'Dark'   },
  { id: 'nature', icon: 'leaf-line',   label: 'Nature' },
  { id: 'sand',   icon: 'goblet-line', label: 'Sand'   },
]

function ThemeSwitcher({ mode, setMode, onDark = false }) {
  return (
    <div className={`theme-switcher${onDark ? ' theme-switcher--dark' : ''}`}>
      {THEME_MODES.map(({ id, icon, label }) => (
        <button
          key={id}
          className={`theme-btn${mode === id ? ' theme-btn--active' : ''}`}
          onClick={() => { setMode(id); localStorage.setItem('azura-mode', id) }}
          title={label}
          aria-label={`${label} theme`}
        >
          <I n={icon} />
        </button>
      ))}
    </div>
  )
}

function SiteHeader({ mode, setMode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Accommodations', to: '/accommodations' },
    { label: 'Activities', to: '/activities' },
    { label: 'Packages', to: '/packages' },
    { label: 'Contact Us', to: '/contact' },
  ]

  return (
    <header className={`az-header${scrolled ? ' az-header--scrolled' : ''}`}>
      <div className="az-header__inner contain">
        <Link to="/" className="az-logo" onClick={() => setMenuOpen(false)}>
          <span className="az-logo__mark">◈</span>
          <span className="az-logo__text">azura</span>
          <span className="az-logo__sup">tourism</span>
        </Link>

        <nav className={`az-nav${menuOpen ? ' az-nav--open' : ''}`} id="site-navigation" aria-label="Primary navigation">
          <button
            type="button"
            className="az-nav__backdrop"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />

          <div className="az-nav__panel">
            <div className="az-nav__top">
              <div className="az-nav__panel-brand">
                <span className="az-nav__panel-mark">◈</span>
                <div className="az-nav__panel-copy">
                  <strong>azura</strong>
                  <span>tourism</span>
                </div>
              </div>

              <button
                type="button"
                className="az-nav__close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <I n="close-line" />
              </button>
            </div>

            <div className="az-nav__links">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `az-nav__link${isActive ? ' az-nav__link--active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {item.label}
                  {hoveredNav === item.label && <span className="nav-dot" />}
                </NavLink>
              ))}
            </div>

            <div className="az-nav__actions">
              <ThemeSwitcher mode={mode} setMode={setMode} />
              <Link to="/packages" className="az-cta-btn" onClick={() => setMenuOpen(false)}>
                <I n="compass-3-line" /> Book Now
              </Link>
            </div>
          </div>
        </nav>

        <button
          type="button"
          className="az-burger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════ */
function HomePage() {
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(2)
  const [bookingDone, setBookingDone] = useState(false)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const navigate = useNavigate()

  const handleBook = () => {
    if (!checkIn || !checkOut) return
    setBookingDone(true)
    setTimeout(() => setBookingDone(false), 3500)
  }

  const heroImages = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop',
  ]

  return (
    <>
      {/* -- Hero (Animated Marquee) -- */}
      <AnimatedMarqueeHero
        tagline="Over 42,000 guests hosted worldwide"
        title={<>Discover Places<br />That Change You</>}
        description="Handpicked destinations, immersive experiences and luxury stays crafted for the traveller who wants more than a holiday."
        ctaText="Explore Packages"
        onCtaClick={() => navigate('/packages')}
        images={heroImages}
      />

      {/* -- Booking Bar -- */}
      {/* ── Booking Bar ── */}
      <section className="booking-bar-wrap">
        <div className="booking-bar contain">
          <div className="bb-field">
            <label><I n="map-pin-2-line" /> Destination</label>
            <select><option>Any Destination</option><option>Desert</option><option>Ocean</option><option>Forest</option><option>City</option></select>
          </div>
          <div className="bb-sep" />
          <div className="bb-field">
            <label><I n="calendar-line" /> Check-in</label>
            <DatePicker selected={checkIn} onChange={setCheckIn} placeholderText="Select date" minDate={new Date()} className="bb-dp" />
          </div>
          <div className="bb-sep" />
          <div className="bb-field">
            <label><I n="calendar-check-line" /> Check-out</label>
            <DatePicker selected={checkOut} onChange={setCheckOut} placeholderText="Select date" minDate={checkIn || new Date()} className="bb-dp" />
          </div>
          <div className="bb-sep" />
          <div className="bb-field">
            <label><I n="group-2-line" /> Guests</label>
            <div className="bb-counter">
              <button onClick={() => setGuests(g => Math.max(1, g - 1))}><I n="subtract-line" /></button>
              <span>{guests}</span>
              <button onClick={() => setGuests(g => Math.min(12, g + 1))}><I n="add-line" /></button>
            </div>
          </div>
          <button className="bb-submit" onClick={handleBook}>
            {bookingDone ? <><I n="check-line" /> Done!</> : <><I n="search-2-line" /> Search</>}
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section stats-section">
        <div className="contain">
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div className="stat-item" key={i}>
                <I n={s.icon} className="stat-icon" />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ── */}
      <section className="section section--alt">
        <div className="contain">
          <div className="section-head">
            <span className="eyebrow-tag">Where You'll Stay</span>
            <h2>Handpicked Accommodations</h2>
            <p>From overwater bungalows to carved-cliff cave suites — spaces as unique as your journey.</p>
          </div>
          <div className="rooms-grid-home">
            {ROOMS.slice(0, 4).map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/accommodations" className="btn-outline">View All Accommodations <I n="arrow-right-line" /></Link>
          </div>
        </div>
      </section>

      {/* -- Amenities -- */}
      <section className="section amenities-section">
        <div className="contain">
          <div className="section-head center-head">
            <span className="eyebrow-tag">World-Class Facilities</span>
            <h2>Everything You Need, Nothing You Don&#39;t</h2>
            <p>Every Azura property is designed so your only decision is where to go next.</p>
          </div>
          <div className="amenities-grid">
            {AMENITIES.map(a => (
              <div className="amenity-card" key={a.label}>
                <div className="amenity-icon"><I n={a.icon} /></div>
                <h4>{a.label}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Azura ── */}
      <section className="section why-section">
        <div className="contain why-layout">
          <div className="why-left">
            <span className="eyebrow-tag">Our Philosophy</span>
            <h2>Crafted for the Curious Traveller</h2>
            <p>Azura was founded on a single belief: travel should do more than move you geographically. Every detail — from the architecture of your room to the silence between activities — is intentional.</p>
            <ul className="why-list">
              {['Locally guided, globally inspired', 'Sustainable practices at every level', 'Personalised itineraries from day one', '18 years of destination expertise'].map(item => (
                <li key={item}><I n="check-double-line" />{item}</li>
              ))}
            </ul>
            <Link to="/about" className="btn-terra">Meet the Team <I n="arrow-right-line" /></Link>
          </div>
          <div className="why-right">
            <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop" alt="Why Azura" />
            <div className="why-float-card">
              <I n="award-line" className="why-float-icon" />
              <strong>Condé Nast Traveller</strong>
              <span>Top 50 Eco-Tourism Operators — 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Activities Strip ── */}
      <section className="section section--alt">
        <div className="contain">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow-tag">Experiences</span>
              <h2>Activities &amp; Adventures</h2>
            </div>
            <Link to="/activities" className="btn-outline">All Experiences <I n="arrow-right-line" /></Link>
          </div>
          <div className="activities-strip">
            {ACTIVITIES.slice(0, 4).map(act => (
              <ActivityCard key={act.id} activity={act} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── Full Banner ── */}
      <section
        className="banner-section"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&auto=format&fit=crop)' }}
      >
        <div className="banner-overlay" />
        <div className="banner-content contain">
          <span className="eyebrow-tag eyebrow-tag--white">Curated Packages</span>
          <h2>Don't Just Travel.<br />Experience.</h2>
          <p>Our packages combine best-in-class accommodation, guided activities, and immersive cultural encounters into seamlessly curated journeys.</p>
          <Link to="/packages" className="btn-terra">Explore Packages <I n="arrow-right-line" /></Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section testimonials-section">
        <div className="contain">
          <div className="section-head center-head">
            <span className="eyebrow-tag">Guest Stories</span>
            <h2>Words From Our Travellers</h2>
          </div>
          <div className="testimonial-carousel">
            <div className="testimonial-track" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
              {TESTIMONIALS.map((t, i) => (
                <div className="testimonial-slide" key={i}>
                  <img src={t.img} alt={t.name} className="t-avatar" />
                  <div className="t-body">
                    <div className="t-stars">{'★'.repeat(t.rating)}</div>
                    <blockquote>"{t.text}"</blockquote>
                    <cite><strong>{t.name}</strong> · {t.origin}</cite>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="testimonial-nav">
            <button onClick={() => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}><I n="arrow-left-s-line" /></button>
            <div className="t-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`t-dot${testimonialIdx === i ? ' t-dot--active' : ''}`} onClick={() => setTestimonialIdx(i)} />
              ))}
            </div>
            <button onClick={() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)}><I n="arrow-right-s-line" /></button>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterBar />
    </>
  )
}

/* ══════════════════════════════════════════════════════
   ABOUT PAGE
   ══════════════════════════════════════════════════════ */
function AboutPage() {
  const [activeTab, setActiveTab] = useState('story')
  const tabs = [
    { id: 'story', label: 'Our Story', icon: 'book-open-line' },
    { id: 'values', label: 'Values', icon: 'heart-2-line' },
    { id: 'sustainability', label: 'Sustainability', icon: 'leaf-line' },
  ]
  const tabContent = {
    story: {
      heading: 'Born From a Love of Discovery',
      body: 'Azura was founded in 2007 by Layla Hassan and Marco Ferrini, two guides who met on opposite sides of a desert expedition. What began as a small trekking operation has grown into a multi-destination tourism organism trusted by over 42,000 guests. The name "Azura" — a variation of "azure" — reflects our belief that every horizon holds a story worth chasing, whether it\'s sky, sea, or the blue distance between mountain peaks.\n\nWe operate across five ecosystems — desert, ocean, forest, cliff, and city — with local guides, sustainable partners, and an obsessive attention to detail. We don\'t do mass tourism. We do meaningful travel.',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop',
    },
    values: {
      heading: 'The Principles Behind the Journey',
      body: 'Every decision at Azura passes through three filters: Is it authentic? Does it respect the land and its people? Does it leave the traveller genuinely changed?\n\nAuthenticity means working with local families, eating regional food, and designing experiences that couldn\'t happen anywhere else. Respect means paying fair wages, sourcing locally, and ensuring tourism strengthens rather than erodes the communities we visit. Transformation means going beyond "nice trip" into something that shifts perspective and opens the traveller to new ways of seeing the world.',
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
    },
    sustainability: {
      heading: 'Travelling Well, Leaving Lightly',
      body: 'Azura holds a Gold-level certification from the Global Sustainable Tourism Council. All accommodations run on renewable energy. We offset 100% of transport emissions. Food waste from properties is composted through a local farm partnership. 8% of all package revenue goes directly to the Azura Conservation Fund, which has planted over 200,000 trees across our operating regions.\n\nWe monitor the carrying capacity of every natural site we visit and limit group sizes accordingly. You\'ll never see Azura groups of 30+ people at a waterfall. That\'s a policy, not a preference.',
      img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
    },
  }

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&auto=format&fit=crop"
        eyebrow="About Azura"
        title="We Turn Destinations\nInto Memories"
        sub="Eighteen years. Five ecosystems. One unwavering commitment to travel done right."
      />

      {/* Stats */}
      <section className="section stats-section stats-section--raised">
        <div className="contain">
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div className="stat-item stat-item--large" key={i}>
                <I n={s.icon} className="stat-icon" />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Tabs */}
      <section className="section">
        <div className="contain">
          <div className="tab-row">
            {tabs.map(t => (
              <button key={t.id} className={`tab-pill${activeTab === t.id ? ' tab-pill--active' : ''}`} onClick={() => setActiveTab(t.id)}>
                <I n={t.icon} />{t.label}
              </button>
            ))}
          </div>
          <div className="tab-panel">
            <div className="tab-text">
              <h3>{tabContent[activeTab].heading}</h3>
              {tabContent[activeTab].body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <img src={tabContent[activeTab].img} alt={tabContent[activeTab].heading} className="tab-img" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--alt">
        <div className="contain">
          <div className="section-head center-head">
            <span className="eyebrow-tag">The People</span>
            <h2>Your Guides & Hosts</h2>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div className="team-card" key={m.name}>
                <img src={m.img} alt={m.name} />
                <div className="team-card__body">
                  <h4>{m.name}</h4>
                  <span>{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section awards-section">
        <div className="contain">
          <div className="section-head center-head">
            <span className="eyebrow-tag">Recognition</span>
            <h2>Industry Awards</h2>
          </div>
          <div className="awards-row">
            {[
              { icon: 'award-fill', label: "Condé Nast Traveller", sub: 'Top 50 Eco-Tourism — 2025' },
              { icon: 'medal-2-fill', label: 'GSTC Gold', sub: 'Sustainable Tourism — 2024' },
              { icon: 'trophy-fill', label: 'Travel + Leisure', sub: 'World\'s Best — 2023' },
              { icon: 'star-fill', label: 'TripAdvisor', sub: 'Travellers\' Choice — 2022–25' },
            ].map(a => (
              <div className="award-card" key={a.label}>
                <I n={a.icon} className="award-icon" />
                <strong>{a.label}</strong>
                <span>{a.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterBar />
    </>
  )
}

/* ══════════════════════════════════════════════════════
   ACCOMMODATIONS PAGE
   ══════════════════════════════════════════════════════ */
function AccommodationsPage() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(ROOMS.map(r => r.category))]
  const filtered = filter === 'All' ? ROOMS : ROOMS.filter(r => r.category === filter)

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&auto=format&fit=crop"
        eyebrow="Where You'll Stay"
        title="Spaces Shaped by\nTheir Landscapes"
        sub="Six unique accommodation types — each designed to disappear into its natural setting."
      />
      <section className="section">
        <div className="contain">
          <div className="filter-bar">
            {categories.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' filter-btn--active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="rooms-listing">
            {filtered.map(room => <RoomListCard key={room.id} room={room} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   ROOM DETAIL PAGE
   ══════════════════════════════════════════════════════ */
function RoomDetailPage() {
  const { id } = useParams()
  const room = ROOMS.find(r => r.id === id)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(2)
  const [booked, setBooked] = useState(false)

  if (!room) return <NotFound />

  const nights = checkIn && checkOut ? Math.max(1, Math.round((checkOut - checkIn) / 86400000)) : 1
  const total = nights * room.price

  const handleBook = () => {
    if (!checkIn || !checkOut) return
    setBooked(true)
    setTimeout(() => setBooked(false), 3500)
  }

  return (
    <>
      {/* Gallery */}
      <CircularGallery
        key={room.id}
        images={room.images.map(url => ({ url }))}
        badge={room.category}
        backContent={<Link to="/accommodations"><I n="arrow-left-line" /> All Rooms</Link>}
      />
      {/* Content */}
      <div className="rd-body contain">
        <div className="rd-main">
          <span className="eyebrow-tag">{room.tagline}</span>
          <h1>{room.name}</h1>
          <div className="rd-meta-row">
            <span><I n="star-fill" className="star-c" /> {room.rating} <em>({room.reviews} reviews)</em></span>
            <span><I n="ruler-2-line" /> {room.size}</span>
            <span><I n="group-2-line" /> {room.capacity}</span>
            <span><I n="hotel-bed-line" /> {room.bed}</span>
            <span><I n="eye-line" /> {room.view}</span>
          </div>
          <p className="rd-description">{room.description}</p>

          <h3 className="rd-section-label">Amenities</h3>
          <div className="rd-amenities">
            {room.amenities.map(a => (
              <span key={a} className="rd-amenity"><I n="check-line" /> {a}</span>
            ))}
          </div>

          <h3 className="rd-section-label">What's Included</h3>
          <p className="rd-extras">{room.extras}</p>

          <h3 className="rd-section-label">You May Also Like</h3>
          <div className="rd-related">
            {ROOMS.filter(r => r.id !== room.id).slice(0, 3).map(r => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </div>

        <aside className="rd-booking-card">
          <div className="rdb-card-header">
            <div className="rdb-price">
              <strong>${room.price}</strong> <span>/ night</span>
              {room.originalPrice && <del>${room.originalPrice}</del>}
            </div>
            <div className="rdb-card-header-stars">
              <span className="t-stars">{"?".repeat(5)}</span>
              {room.rating} � {room.reviews}
            </div>
          </div>
          <div className="rdb-card-body">
            <div className="rdb-fields">
              <div className="rdb-field">
                <label><I n="calendar-line" /> Check-in</label>
                <DatePicker selected={checkIn} onChange={setCheckIn} placeholderText="Date" minDate={new Date()} className="rdb-dp" />
              </div>
              <div className="rdb-field">
                <label><I n="calendar-check-line" /> Check-out</label>
                <DatePicker selected={checkOut} onChange={setCheckOut} placeholderText="Date" minDate={checkIn || new Date()} className="rdb-dp" />
              </div>
              <div className="rdb-field">
                <label><I n="group-2-line" /> Guests</label>
                <div className="bb-counter">
                  <button onClick={() => setGuests(g => Math.max(1, g - 1))}><I n="subtract-line" /></button>
                  <span>{guests}</span>
                  <button onClick={() => setGuests(g => Math.min(10, g + 1))}><I n="add-line" /></button>
                </div>
              </div>
            </div>
            {checkIn && checkOut && (
              <div className="rdb-summary">
                <span>${room.price} � {nights} nights</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
            )}
            <button className="btn-terra rdb-submit" onClick={handleBook}>
              {booked ? <><I n="check-line" /> Reserved!</> : <><I n="compass-3-line" /> Reserve Now</>}
            </button>
            <p className="rdb-note"><I n="shield-check-line" /> Free cancellation within 48 hrs of booking</p>
          </div>
        </aside>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   ACTIVITIES PAGE
   ══════════════════════════════════════════════════════ */
function ActivitiesPage() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(ACTIVITIES.map(a => a.category))]
  const filtered = filter === 'All' ? ACTIVITIES : ACTIVITIES.filter(a => a.category === filter)

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&auto=format&fit=crop"
        eyebrow="Get Out There"
        title="Experiences That\nStay With You"
        sub="From desert expeditions to cliff-top yoga — sixty curated adventures across five landscapes."
      />
      <section className="section">
        <div className="contain">
          <div className="filter-bar">
            {categories.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' filter-btn--active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="activities-grid">
            {filtered.map(act => <ActivityCard key={act.id} activity={act} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   ACTIVITY DETAIL PAGE
   ══════════════════════════════════════════════════════ */
function ActivityDetailPage() {
  const { id } = useParams()
  const activity = ACTIVITIES.find(a => a.id === id)
  const [tourDate, setTourDate] = useState(null)
  const [tourGuests, setTourGuests] = useState(2)
  const [booked, setBooked] = useState(false)

  if (!activity) return <NotFound />

  return (
    <>
      <CircularGallery
        key={activity.id}
        images={activity.images.map(url => ({ url }))}
        badge={activity.category}
        backContent={<Link to="/activities"><I n="arrow-left-line" /> All Activities</Link>}
      />

      <div className="rd-body contain">
        <div className="rd-main">
          <span className="eyebrow-tag">{activity.tagline}</span>
          <h1>{activity.name}</h1>
          <div className="act-stats-bar">
            <div className="act-stat"><I n="star-fill" /><strong>{activity.rating}</strong><span>Rating</span></div>
            <div className="act-stat"><I n="time-line" /><strong>{activity.duration}</strong><span>Duration</span></div>
            <div className="act-stat"><I n="group-2-line" /><strong>{activity.groupSize}</strong><span>Group Size</span></div>
            <div className="act-stat"><I n="signal-wifi-2-line" /><strong>{activity.difficulty}</strong><span>Difficulty</span></div>
          </div>
          <div className="rd-meta-row">
            <span><I n="star-fill" className="star-c" /> {activity.rating} <em>({activity.reviews})</em></span>
            <span><I n="time-line" /> {activity.duration}</span>
            <span><I n="group-2-line" /> {activity.groupSize}</span>
            <span><I n="signal-wifi-2-line" /> {activity.difficulty}</span>
          </div>
          <p className="rd-description">{activity.description}</p>

          <h3 className="rd-section-label">What's Included</h3>
          <div className="act-includes-grid">
            {activity.includes.map((inc, idx) => {
              const icons = ['restaurant-line','car-line','camera-line','first-aid-kit-line','shield-check-line','user-line','compass-3-line','map-pin-2-line']
              return (
                <div key={inc} className="act-include-tile">
                  <I n={icons[idx % icons.length]} />
                  {inc}
                </div>
              )
            })}
          </div>

          <h3 className="rd-section-label">Itinerary</h3>
          <ol className="activity-itinerary">
            {activity.itinerary.map((step, i) => {
              const timeMatch = step.match(/^(\d{1,2}[:\.]\d{2})\s*(.*)/)
              const timeLabel = timeMatch ? timeMatch[1] : null
              const stepText = timeMatch ? timeMatch[2] : step
              return (
                <li key={i}>
                  <span className="it-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="it-content">
                    {timeLabel && <span className="it-time">{timeLabel}</span>}
                    <span className="it-step">{stepText}</span>
                  </div>
                </li>
              )
            })}
          </ol>

          <h3 className="rd-section-label">Other Experiences</h3>
          <div className="rd-related">
            {ACTIVITIES.filter(a => a.id !== activity.id).slice(0, 3).map(a => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </div>

        <aside className="rd-booking-card">
          <div className="rdb-card-header">
            <div className="rdb-price">
              <strong>${activity.price}</strong> <span>/ person</span>
            </div>
            <div className="rdb-card-header-stars">
              <span className="t-stars">{"?".repeat(5)}</span>
              {activity.rating} � {activity.reviews}
            </div>
          </div>
          <div className="rdb-card-body">
            <div className="rdb-fields">
              <div className="rdb-field">
                <label><I n="calendar-line" /> Date</label>
                <DatePicker selected={tourDate} onChange={setTourDate} placeholderText="Select date" minDate={new Date()} className="rdb-dp" />
              </div>
              <div className="rdb-field">
                <label><I n="group-2-line" /> Guests</label>
                <div className="bb-counter">
                  <button onClick={() => setTourGuests(g => Math.max(1, g - 1))}><I n="subtract-line" /></button>
                  <span>{tourGuests}</span>
                  <button onClick={() => setTourGuests(g => Math.min(8, g + 1))}><I n="add-line" /></button>
                </div>
              </div>
            </div>
            <div className="rdb-summary">
              <span>${activity.price} � {tourGuests} guests</span>
              <strong>${(activity.price * tourGuests).toLocaleString()}</strong>
            </div>
            <button className="btn-terra rdb-submit" onClick={() => { setBooked(true); setTimeout(() => setBooked(false), 3000) }}>
              {booked ? <><I n="check-line" /> Booked!</> : <><I n="compass-3-line" /> Book Activity</>}
            </button>
            <p className="rdb-note"><I n="shield-check-line" /> Full refund if cancelled 72hrs before</p>
          </div>
        </aside>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   PACKAGES PAGE
   ══════════════════════════════════════════════════════ */
function PackagesPage() {
  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&auto=format&fit=crop"
        eyebrow="Curated Journeys"
        title="Complete Travel\nExperiences"
        sub="All the decisions made. All the details handled. Just pure, immersive travel."
      />
      <section className="section">
        <div className="contain">
          <div className="packages-grid">
            {PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   PACKAGE DETAIL PAGE
   ══════════════════════════════════════════════════════ */
function PackageDetailPage() {
  const { id } = useParams()
  const pkg = PACKAGES.find(p => p.id === id)
  const [startDate, setStartDate] = useState(null)
  const [guests, setGuests] = useState(2)
  const [booked, setBooked] = useState(false)

  if (!pkg) return <NotFound />

  const highlightIcons = ['magic-line', 'heart-2-line', 'sparkling-line', 'compass-3-line']

  return (
    <>
      <CircularGallery
        key={pkg.id}
        images={pkg.images.map(url => ({ url }))}
        badge={pkg.badge}
        backContent={<Link to="/packages"><I n="arrow-left-line" /> All Packages</Link>}
      />

      <div className="rd-body contain">
        <div className="rd-main">
          <span className="eyebrow-tag">{pkg.tagline}</span>
          <h1>{pkg.name}</h1>

          {/* Quick stats strip */}
          <div className="pkd-stats-bar">
            <div className="pkd-stat">
              <I n="moon-line" />
              <strong>{pkg.nights}</strong>
              <span>Nights</span>
            </div>
            <div className="pkd-stat">
              <I n="group-2-line" />
              <strong>{pkg.highlight}</strong>
              <span>Ideal For</span>
            </div>
            <div className="pkd-stat">
              <I n="checkbox-circle-line" />
              <strong>{pkg.includes.length}</strong>
              <span>Inclusions</span>
            </div>
            <div className="pkd-stat">
              <I n="award-line" />
              <strong>{pkg.badge || 'Curated'}</strong>
              <span>Category</span>
            </div>
          </div>

          <p className="rd-description">{pkg.description}</p>

          <h3 className="rd-section-label">Package Includes</h3>
          <div className="rd-amenities">
            {pkg.includes.map(inc => (
              <span key={inc} className="rd-amenity"><I n="check-line" /> {inc}</span>
            ))}
          </div>

          <h3 className="rd-section-label">Highlights</h3>
          <div className="pkd-highlights-grid">
            {pkg.highlights.map((h, i) => (
              <div key={h} className="pkd-highlight-card">
                <I n={highlightIcons[i % highlightIcons.length]} />
                <p>{h}</p>
              </div>
            ))}
          </div>

          <h3 className="rd-section-label">Included Accommodation</h3>
          {(() => {
            const room = ROOMS.find(r => r.name === pkg.room)
            if (!room) return <p className="rd-extras">{pkg.room}</p>
            return (
              <Link to={`/accommodations/${room.id}`} className="pkd-room-ref">
                <img src={room.images[0]} alt={room.name} className="pkd-room-ref__img" />
                <div className="pkd-room-ref__body">
                  <span className="eyebrow-tag">{room.category}</span>
                  <strong>{room.name}</strong>
                  <p>{room.tagline}</p>
                  <p className="pkd-room-ref__meta">
                    <I n="ruler-2-line" /> {room.size}
                    &nbsp;&middot;&nbsp;
                    <I n="hotel-bed-line" /> {room.bed}
                    &nbsp;&middot;&nbsp;
                    <I n="eye-line" /> {room.view}
                  </p>
                </div>
                <div className="pkd-room-ref__arrow"><I n="arrow-right-line" /></div>
              </Link>
            )
          })()}

          <h3 className="rd-section-label">More Packages</h3>
          <div className="pkd-related">
            {PACKAGES.filter(p => p.id !== pkg.id).slice(0, 3).map(p => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </div>

        <aside className="rd-booking-card">
          <div className="rdb-card-header">
            <div className="rdb-price">
              <strong>${pkg.price.toLocaleString()}</strong>
              {pkg.originalPrice && <del>${pkg.originalPrice.toLocaleString()}</del>}
            </div>
            <div className="rdb-card-header-stars">
              <span>{pkg.nights} nights</span>
            </div>
          </div>
          <div className="rdb-card-body">
            <p className="rdb-sub" style={{ marginBottom: '1.25rem' }}>{pkg.highlight} &middot; {pkg.badge}</p>
            <div className="rdb-fields">
              <div className="rdb-field">
                <label><I n="calendar-line" /> Start Date</label>
                <DatePicker selected={startDate} onChange={setStartDate} placeholderText="Select date" minDate={new Date()} className="rdb-dp" />
              </div>
              <div className="rdb-field">
                <label><I n="group-2-line" /> Guests</label>
                <div className="bb-counter">
                  <button onClick={() => setGuests(g => Math.max(1, g - 1))}><I n="subtract-line" /></button>
                  <span>{guests}</span>
                  <button onClick={() => setGuests(g => Math.min(12, g + 1))}><I n="add-line" /></button>
                </div>
              </div>
            </div>
            <div className="rdb-summary">
              <span>Total for {guests} guest{guests > 1 ? 's' : ''}</span>
              <strong>${(pkg.price * Math.ceil(guests / 2)).toLocaleString()}</strong>
            </div>
            <button className="btn-terra rdb-submit" onClick={() => { setBooked(true); setTimeout(() => setBooked(false), 3000) }}>
              {booked ? <><I n="check-line" /> Enquiry Sent!</> : <><I n="compass-3-line" /> Book This Package</>}
            </button>
            <p className="rdb-note"><I n="shield-check-line" /> Free cancellation &middot; 10% early-bird discount</p>
          </div>
        </aside>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   CONTACT PAGE
   ══════════════════════════════════════════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'What\'s the best time to book?', a: 'We recommend booking at least 6 weeks in advance for peak season (Nov–Mar) and 2–3 weeks for shoulder season. Some unique accommodations like the Cave Hideaway book 3+ months ahead.' },
    { q: 'Are your activities suitable for children?', a: 'Yes — the Desert Safari, Village Food Tour, and Forest Trek are all child-friendly. The Reef Diving and Astrophotography experiences have minimum age requirements of 10 and 8 respectively.' },
    { q: 'What is your cancellation policy?', a: 'Free cancellation up to 14 days before arrival for accommodations, 72 hours for activities. Package cancellations carry a 10% processing fee after initial deposit.' },
    { q: 'Do you offer private guiding?', a: 'Yes — all activities can be arranged as private tours at a 40–60% supplement. Contact our concierge team to arrange bespoke itineraries.' },
    { q: 'How do you ensure sustainability?', a: 'We hold GSTC Gold certification. All properties run on renewable energy, groups are limited to protect ecosystems, and 8% of package revenue funds our reforestation programme.' },
    { q: 'Are airport transfers included?', a: 'Airport transfers are included in all packages. For standalone room bookings, transfers can be added at checkout for $45–$90 depending on distance.' },
  ]

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }, 4000)
  }

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1400&auto=format&fit=crop"
        eyebrow="Get In Touch"
        title="Let's Plan Your\nPerfect Journey"
        sub="Our team is available every day of the year. We respond within 4 hours during business hours."
      />

      <section className="section">
        <div className="contain">
          <div className="contact-layout">
            {/* Contact Info */}
            <div className="contact-info">
              <h3>Reach Us Directly</h3>
              <div className="contact-cards">
                {[
                  { icon: 'map-pin-2-line', label: 'Visit Us', value: '14 Oasis Road, Marrakech Medina, Morocco' },
                  { icon: 'mail-send-line', label: 'Email Us', value: 'hello@azuratourism.com' },
                  { icon: 'phone-line', label: 'Call Us', value: '+212 600 123 456' },
                  { icon: 'time-line', label: 'Office Hours', value: 'Daily 08:00 – 20:00 (GMT+1)' },
                ].map(card => (
                  <div className="contact-card" key={card.label}>
                    <div className="contact-card__icon"><I n={card.icon} /></div>
                    <div>
                      <label>{card.label}</label>
                      <p>{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="contact-map">
                <iframe
                  title="Azura Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-7.9999%2C31.6295%2C-7.9799%2C31.6395&layer=mapnik"
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: '8px' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send a Message</h3>
              <div className="cf-row">
                <div className="cf-field">
                  <label>Full Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div className="cf-field">
                  <label>Email Address</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
                </div>
              </div>
              <div className="cf-field">
                <label>Subject</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  <option value="">Select a topic</option>
                  <option>Package Inquiry</option>
                  <option>Accommodation Booking</option>
                  <option>Activity Booking</option>
                  <option>Custom Itinerary</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="cf-field">
                <label>Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your dream trip..." />
              </div>
              <button type="submit" className="btn-terra">
                {sent ? <><I n="check-double-line" /> Message Sent!</> : <><I n="send-plane-line" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--alt">
        <div className="contain">
          <div className="section-head center-head">
            <span className="eyebrow-tag">Quick Answers</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div className={`faq-item${openFaq === i ? ' faq-item--open' : ''}`} key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <I n={openFaq === i ? 'subtract-line' : 'add-line'} />
                </button>
                {openFaq === i && <div className="faq-a"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════════════════ */
function PageHero({ img, eyebrow, title, sub }) {
  return (
    <section className="page-hero">
      <img src={img} alt={eyebrow} className="page-hero__img" />
      <div className="page-hero__overlay" />
      <div className="page-hero__content contain">
        <span className="eyebrow-tag eyebrow-tag--white">{eyebrow}</span>
        <h1>{title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  )
}

function RoomCard({ room }) {
  return (
    <Link to={`/accommodations/${room.id}`} className="room-card">
      <div className="room-card__img-wrap">
        <img src={room.images[0]} alt={room.name} />
        {room.badge && <span className="room-card__badge">{room.badge}</span>}
        <span className="room-card__cat">{room.category}</span>
      </div>
      <div className="room-card__body">
        <div className="room-card__meta"><I n="star-fill" className="star-c" /> {room.rating} · {room.size} · {room.bed}</div>
        <h3>{room.name}</h3>
        <p>{room.tagline}</p>
        <div className="room-card__footer">
          <span className="room-card__price"><strong>${room.price}</strong>/night</span>
          <span className="room-card__cta">View Room <I n="arrow-right-line" /></span>
        </div>
      </div>
    </Link>
  )
}

function RoomListCard({ room }) {
  return (
    <div className="rl-card">
      <div className="rl-card__img">
        <img src={room.images[0]} alt={room.name} />
        {room.badge && <span className="rl-badge">{room.badge}</span>}
      </div>
      <div className="rl-card__body">
        <span className="eyebrow-tag">{room.category}</span>
        <h3>{room.name}</h3>
        <p className="rl-tagline">{room.tagline}</p>
        <div className="rl-specs">
          <span><I n="star-fill" className="star-c" /> {room.rating} ({room.reviews})</span>
          <span><I n="ruler-2-line" /> {room.size}</span>
          <span><I n="group-2-line" /> {room.capacity}</span>
          <span><I n="hotel-bed-line" /> {room.bed}</span>
        </div>
        <div className="rl-amenity-tags">
          {room.amenities.slice(0, 5).map(a => <span key={a}>{a}</span>)}
        </div>
        <div className="rl-footer">
          <div className="rl-price">
            <strong>${room.price}</strong><span>/night</span>
            {room.originalPrice && <del>${room.originalPrice}</del>}
          </div>
          <Link to={`/accommodations/${room.id}`} className="btn-terra">View Details <I n="arrow-right-line" /></Link>
        </div>
      </div>
    </div>
  )
}

function ActivityCard({ activity, compact }) {
  return (
    <Link to={`/activities/${activity.id}`} className={`act-card${compact ? ' act-card--compact' : ''}`}>
      <div className="act-card__img">
        <img src={activity.images[0]} alt={activity.name} />
        {activity.badge && <span className="act-badge">{activity.badge}</span>}
        <span className="act-cat">{activity.category}</span>
      </div>
      <div className="act-card__body">
        <div className="act-meta"><I n="time-line" /> {activity.duration} · <I n="group-2-line" /> {activity.groupSize}</div>
        <h3>{activity.name}</h3>
        {!compact && <p>{activity.tagline}</p>}
        <div className="act-footer">
          <span className="act-price"><strong>${activity.price}</strong>/person</span>
          <span className="act-rating"><I n="star-fill" className="star-c" /> {activity.rating}</span>
        </div>
      </div>
    </Link>
  )
}

function PackageCard({ pkg }) {
  return (
    <Link to={`/packages/${pkg.id}`} className="pkg-card">
      <div className="pkg-card__img">
        <img src={pkg.coverImg} alt={pkg.name} />
        {pkg.badge && <span className="pkg-card__badge">{pkg.badge}</span>}
        <div className="pkg-card__nights">{pkg.nights} nights</div>
      </div>
      <div className="pkg-card__body">
        <span className="eyebrow-tag">{pkg.highlight}</span>
        <h3>{pkg.name}</h3>
        <p>{pkg.tagline}</p>
        <ul className="pkg-card__includes">
          {pkg.includes.slice(0, 4).map(inc => <li key={inc}><I n="check-line" /> {inc}</li>)}
          {pkg.includes.length > 4 && <li className="pkg-more">+{pkg.includes.length - 4} more</li>}
        </ul>
        <div className="pkg-card__footer">
          <div>
            <strong className="pkg-price">${pkg.price.toLocaleString()}</strong>
            {pkg.originalPrice && <del>${pkg.originalPrice.toLocaleString()}</del>}
          </div>
          <span className="pkg-cta">View Package <I n="arrow-right-line" /></span>
        </div>
      </div>
    </Link>
  )
}

function NewsletterBar() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = e => { e.preventDefault(); setDone(true); setEmail(''); setTimeout(() => setDone(false), 3500) }
  return (
    <section className="newsletter-section">
      <div className="contain newsletter-inner">
        <div className="nl-text">
          <span className="eyebrow-tag">Stay Inspired</span>
          <h3>Get Travel Ideas &amp; Exclusive Offers</h3>
          <p>Join 18,000+ travellers receiving curated destination guides, early-bird deals, and seasonal offers.</p>
        </div>
        <form className="nl-form" onSubmit={submit}>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" />
          <button type="submit" className="btn-terra">
            {done ? <><I n="check-line" /> Subscribed!</> : <>Subscribe <I n="send-plane-line" /></>}
          </button>
        </form>
      </div>
    </section>
  )
}

const FOOTER_DESTS = [
  { label: 'Marrakech', icon: 'sun-line' },
  { label: 'Maldives', icon: 'anchor-line' },
  { label: 'Bali', icon: 'plant-line' },
  { label: 'Patagonia', icon: 'mountain-line' },
  { label: 'Amalfi', icon: 'sailboat-line' },
  { label: 'Petra', icon: 'ancient-gate-line' },
  { label: 'Kyoto', icon: 'flower-line' },
  { label: 'Serengeti', icon: 'landscape-line' },
]

function SiteFooter({ mode, setMode }) {
  return (
    <footer className="az-footer">
      {/* Destinations ticker */}
      <div className="az-footer__destinations">
        <div className="az-footer__dest-inner contain">
          {FOOTER_DESTS.map(d => (
            <a key={d.label} href="#" className="az-footer__dest-item">
              <I n={d.icon} />{d.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="az-footer__main contain">
        {/* Brand */}
        <div className="az-footer__brand">
          <div className="az-footer__brand-logo">
            <span className="az-footer__brand-mark">&#x25C8;</span>
            <span className="az-footer__brand-name">azura</span>
            <span className="az-footer__brand-tag">tourism</span>
          </div>
          <p>Crafting extraordinary journeys across deserts, oceans, forests and cities since 2007. Your story begins here.</p>
          <div className="az-footer__cert"><I n="leaf-line" /> GSTC Gold Certified</div>
        </div>

        {/* Explore */}
        <div className="az-footer__col">
          <div className="az-footer__col-head">Explore</div>
          <Link to="/"><I n="arrow-right-s-line" />Home</Link>
          <Link to="/about"><I n="arrow-right-s-line" />About Us</Link>
          <Link to="/accommodations"><I n="arrow-right-s-line" />Accommodations</Link>
          <Link to="/activities"><I n="arrow-right-s-line" />Activities</Link>
          <Link to="/packages"><I n="arrow-right-s-line" />Packages</Link>
          <Link to="/contact"><I n="arrow-right-s-line" />Contact</Link>
        </div>

        {/* Experiences */}
        <div className="az-footer__col">
          <div className="az-footer__col-head">Experiences</div>
          <Link to="/activities/desert-safari"><I n="arrow-right-s-line" />Desert Safari</Link>
          <Link to="/activities/reef-dive"><I n="arrow-right-s-line" />Coral Reef Diving</Link>
          <Link to="/activities/forest-trek"><I n="arrow-right-s-line" />Forest Trek</Link>
          <Link to="/activities/sunrise-yoga"><I n="arrow-right-s-line" />Sunrise Yoga</Link>
          <Link to="/activities/local-food-tour"><I n="arrow-right-s-line" />Food &amp; Market</Link>
          <Link to="/activities/stargazing"><I n="arrow-right-s-line" />Stargazing</Link>
        </div>

        {/* Contact */}
        <div className="az-footer__col">
          <div className="az-footer__col-head">Get In Touch</div>
          <div className="az-footer__contact-item">
            <div className="az-footer__contact-icon"><I n="map-pin-2-line" /></div>
            <div>
              <span className="az-footer__contact-label">Address</span>
              <span className="az-footer__contact-val">14 Oasis Road, Marrakech, Morocco</span>
            </div>
          </div>
          <div className="az-footer__contact-item">
            <div className="az-footer__contact-icon"><I n="mail-line" /></div>
            <div>
              <span className="az-footer__contact-label">Email</span>
              <span className="az-footer__contact-val">hello@azuratourism.com</span>
            </div>
          </div>
          <div className="az-footer__contact-item">
            <div className="az-footer__contact-icon"><I n="phone-line" /></div>
            <div>
              <span className="az-footer__contact-label">Phone</span>
              <span className="az-footer__contact-val">+212 600 123 456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social + theme row */}
      <div className="az-footer__social-row contain">
        <div className="az-footer__socials">
          {[
            { icon: 'instagram-line', href: '#' },
            { icon: 'facebook-box-line', href: '#' },
            { icon: 'twitter-x-line', href: '#' },
            { icon: 'youtube-line', href: '#' },
            { icon: 'tiktok-line', href: '#' },
          ].map(s => (
            <a key={s.icon} href={s.href} aria-label={s.icon} className="az-footer__social-btn">
              <I n={s.icon} />
            </a>
          ))}
        </div>

        <div className="az-footer__bottom-center">
          <p className="az-footer__copy">&#169; 2026 Azura Tourism &mdash; All rights reserved.</p>
          <div className="az-footer__links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>

        <div className="az-footer__controls">
          <ThemeSwitcher mode={mode} setMode={setMode} onDark={true} />
          <button
            className="az-footer__scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            <I n="arrow-up-line" />
          </button>
        </div>
      </div>

      <div className="footer-watermark">AZURA</div>
    </footer>
  )
}

function NotFound() {
  return (
    <div className="not-found contain">
      <I n="compass-3-line" className="nf-icon" />
      <h2>Page Not Found</h2>
      <p>This destination doesn't exist on our map.</p>
      <Link to="/" className="btn-terra">Return Home</Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   APP SHELL
   ══════════════════════════════════════════════════════ */
function AppShell() {
  const [mode, setMode] = useState(() => localStorage.getItem('azura-mode') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="az-shell">
      <AnnouncementBar />
      <SiteHeader mode={mode} setMode={setMode} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/accommodations" element={<AccommodationsPage />} />
          <Route path="/accommodations/:id" element={<RoomDetailPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter mode={mode} setMode={setMode} />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  )
}

