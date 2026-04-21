import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'

const DatePicker = ReactDatePicker.default || ReactDatePicker

const I = ({ name, className }) => <i className={`ri-${name} ${className || ''}`} />

const MODES = ['light', 'dark', 'classic', 'modern']

/* ══════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════ */
const heroSlides = [
  {
    title: "Discover the World's Last Wild Places",
    subtitle: 'Adventure travel awaits',
    description: 'Terranova guides you into untouched landscapes, remote eco-lodges, and life-defining expeditions crafted by local experts.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2200&q=80',
  },
  {
    title: 'Sleep Under the Stars, Deep in Nature',
    subtitle: 'Eco-lodge collection',
    description: 'From rainforest treehouses to arctic glamping domes — every Terranova lodge puts you inside the destination.',
    image: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=2200&q=80',
  },
  {
    title: 'Expert-Led Expeditions on Every Continent',
    subtitle: 'Guided adventure tours',
    description: 'Join small-group treks, safaris, and dive expeditions led by certified naturalists and seasoned trail experts.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80',
  },
]

const allLodgeListings = [
  {
    name: 'Canopy Rainforest Treehouse',
    type: 'Forest Immersion',
    bed: 'Suspended Platform Lodge',
    bedDetail: '1 queen bed + hammock',
    capacity: '2 Guests',
    nights: '1 Night',
    size: '28 m²',
    price: 189,
    originalPrice: 220,
    rating: 5,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=1400&q=80',
    address: 'Monteverde Cloud Forest Reserve, Costa Rica',
    distance: '3 km to main trails',
    amenities: ['wifi-line', 'leaf-line', 'water-flash-line', 'sun-line', 'camera-line'],
    amenityLabels: ['WiFi', 'Eco-Certified', 'Waterfall', 'Solar Power', 'Photography'],
    badge: 'Top Rated',
    cancellation: 'Free cancellation before 72 hours',
  },
  {
    name: 'Arctic Glamping Dome',
    type: 'Polar Experience',
    bed: 'Sky View Suite',
    bedDetail: '1 king bed + stargazing window',
    capacity: '2 Guests',
    nights: '1 Night',
    size: '18 m²',
    price: 295,
    originalPrice: 340,
    rating: 5,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
    address: 'Tromsø, Norway, Arctic Circle',
    distance: '12 km to Northern Lights zone',
    amenities: ['wifi-line', 'temp-cold-line', 'sun-line', 'star-fill', 'camera-line'],
    amenityLabels: ['WiFi', 'Heated', 'Solar', 'Aurora View', 'Photography'],
    badge: 'Aurora Season',
    cancellation: 'Free cancellation before 48 hours',
  },
  {
    name: 'Desert Mesa Safari Tent',
    type: 'Wilderness Camp',
    bed: 'Luxury Safari Tent',
    bedDetail: '1 king bed + outdoor shower',
    capacity: '2 Guests',
    nights: '1 Night',
    size: '32 m²',
    price: 165,
    originalPrice: null,
    rating: 4.8,
    reviews: 63,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80',
    address: 'Atacama Desert, Chile',
    distance: '8 km to salt flats',
    amenities: ['wifi-line', 'sun-line', 'restaurant-line', 'leaf-line'],
    amenityLabels: ['WiFi', 'Solar', 'Meals Included', 'Zero-Waste'],
    badge: 'All-Inclusive',
    cancellation: 'Free cancellation before 48 hours',
  },
  {
    name: 'Alpine Refuge Hut',
    type: 'Mountain Base Camp',
    bed: 'Expedition Dormitory',
    bedDetail: '4 bunk beds (shared)',
    capacity: '8 Guests',
    nights: '1 Night',
    size: '45 m²',
    price: 59,
    originalPrice: null,
    rating: 4.5,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
    address: 'Mont Blanc Massif, Chamonix, France',
    distance: '1.2 km to summit trailhead',
    amenities: ['restaurant-line', 'temp-cold-line', 'wifi-line'],
    amenityLabels: ['Meals', 'Heated', 'WiFi'],
    badge: null,
    cancellation: 'Free cancellation before 24 hours',
  },
  {
    name: 'Overwater Glass Bungalow',
    type: 'Ocean Immersion',
    bed: 'Maldives Retreat',
    bedDetail: '1 king bed + ocean floor view',
    capacity: '2 Guests',
    nights: '1 Night',
    size: '22 m²',
    price: 450,
    originalPrice: 520,
    rating: 5,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80',
    address: 'North Malé Atoll, Maldives',
    distance: '200 m to reef',
    amenities: ['wifi-line', 'water-flash-line', 'restaurant-line', 'leaf-line', 'camera-line'],
    amenityLabels: ['WiFi', 'Reef Access', 'Dining', 'Eco', 'Snorkel Kit'],
    badge: 'Bucket List',
    cancellation: 'Free cancellation before 72 hours',
  },
]

const featuredLodges = allLodgeListings.slice(0, 3)

const expeditions = [
  {
    title: 'Patagonia Torres del Paine Trek',
    duration: '8 days',
    spots: '5 base camps',
    price: '$1,290',
    image: 'https://images.unsplash.com/photo-1536332880611-b2c3fc8cccac?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Challenging',
    groupSize: 'Max 10',
    rating: 5.0,
    reviews: 87,
    highlights: ['W-Trek full circuit', 'Los Cuernos ridge', 'Glacier Grey crossing'],
    includes: ['map-pin-line', 'restaurant-line', 'camera-line'],
  },
  {
    title: 'Borneo Rainforest Canopy Safari',
    duration: '5 days',
    spots: 'Private jungle reserve',
    price: '$820',
    image: 'https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Moderate',
    groupSize: 'Max 8',
    rating: 4.9,
    reviews: 64,
    highlights: ['Orangutan sanctuary', 'Night canopy walk', 'River boat tour'],
    includes: ['leaf-line', 'camera-line', 'water-flash-line'],
  },
  {
    title: 'Maldives Deep Dive Expedition',
    duration: '3 days',
    spots: '7 dive sites',
    price: '$580',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Easy',
    groupSize: 'Max 6',
    rating: 4.8,
    reviews: 143,
    highlights: ['Manta ray encounter', 'Shark Point dive', 'Coral nursery snorkel'],
    includes: ['water-flash-line', 'goblet-line', 'camera-line'],
  },
]

const amenities = [
  { icon: 'shield-check-line', title: 'Safety & Certification', description: 'All guides are WEMS-certified with current first-aid training and local wilderness rescue permits.' },
  { icon: 'leaf-line', title: 'Zero-Impact Ethos', description: 'Leave No Trace certified operations across every camp, trek route, and dive site.' },
  { icon: 'restaurant-line', title: 'Camp & Trail Meals', description: 'Chef-prepared meals at base camps and portable nutrition packs for full trail days.' },
  { icon: 'briefcase-2-line', title: 'Gear & Equipment', description: 'Full technical gear provided: tents, ropes, helmets, dry bags, navigation tools, and safety devices.' },
  { icon: 'map-pin-line', title: 'Private Transport', description: 'Dedicated 4WD transfer from nearest airport or hub to your trailhead or lodge.' },
  { icon: 'camera-line', title: 'Expedition Photography', description: 'In-field coaching plus a full digital album delivered within 72 hours of your return.' },
]

const testimonials = [
  {
    name: 'Elena Vasquez',
    role: 'Solo Adventurer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80',
    review: 'The Patagonia trek changed how I see travel. Terranova handled every logistical detail so I could be fully present in that incredible landscape.',
    rating: 5,
  },
  {
    name: 'James Okafor',
    role: 'Wildlife Photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80',
    review: 'Three continents in one year with Terranova. The Borneo safari and their naturalist guides are simply world-class.',
    rating: 5,
  },
  {
    name: 'Sara Nilsson',
    role: 'Family Expedition',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80',
    review: 'We completed the family-grade Costa Rica trek with our two kids. The safety standards and guide responsiveness were exceptional.',
    rating: 4,
  },
]

const blogPosts = [
  { title: 'The 10 Most Remote Trekking Routes Reopening in 2026', excerpt: 'From the Wakhan Corridor to the Darién Gap — trails closed for decades are now welcoming guided expeditions again.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', date: 'Apr 15, 2026', category: 'Trekking', readTime: '8 min read', author: 'Mara Whitfield' },
  { title: 'How to Choose the Right Sleeping Bag for Altitude', excerpt: 'Temperature ratings, fill power, and shell fabrics explained — stay warm on high-altitude nights without overpacking.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80', date: 'Apr 02, 2026', category: 'Gear', readTime: '6 min read', author: 'Kai Bergmann' },
  { title: 'Responsible Wildlife Encounters: What You Need to Know', excerpt: "A naturalist's guide to ethical wildlife photography, proximity guidelines, and the operators who get it right.", image: 'https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=1200&q=80', date: 'Mar 20, 2026', category: 'Wildlife', readTime: '7 min read', author: 'Priya Nair' },
  { title: 'Solo Female Trekking: Safety, Community & Freedom', excerpt: 'Practical advice from five solo female trekkers on routes, guides, communication devices, and building trail community.', image: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&w=1200&q=80', date: 'Mar 08, 2026', category: 'Safety', readTime: '9 min read', author: 'Mara Whitfield' },
  { title: 'Scuba Diving Destinations for 2026: Beyond the Classics', excerpt: 'Move past Bali and Belize — emerging dive destinations with pristine reefs, less crowds, and incredible biodiversity.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', date: 'Feb 22, 2026', category: 'Diving', readTime: '5 min read', author: 'Kai Bergmann' },
  { title: "Eco-Lodge vs. Hotel: What's Right for Your Adventure Trip?", excerpt: 'Comparing carbon footprint, comfort, immersion, and price between eco-lodges and conventional accommodation in remote destinations.', image: 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=1200&q=80', date: 'Feb 10, 2026', category: 'Lodging', readTime: '6 min read', author: 'Priya Nair' },
  { title: 'Altitude Sickness: Prevention, Recognition and Recovery', excerpt: 'Everything you need to know about acclimatization schedules, medication options, and what to do when altitude hits hard.', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80', date: 'Jan 28, 2026', category: 'Safety', readTime: '7 min read', author: 'Kai Bergmann' },
  { title: "Wildlife Photography on Safari: A Beginner's Field Guide", excerpt: "Lens choices, golden hour timing, vehicle positioning, and ethical distance rules from our Masai Mara photography guide.", image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80', date: 'Jan 12, 2026', category: 'Wildlife', readTime: '8 min read', author: 'Mara Whitfield' },
]

const team = [
  { name: 'Mara Whitfield', role: 'Lead Trekking Guide', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kai Bergmann', role: 'Alpine & Mountaineering Expert', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Priya Nair', role: 'Marine Biologist & Dive Guide', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tomás Reyes', role: 'Wildlife Safari Specialist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
]

const whyUsFeatures = [
  { icon: 'earth-line', title: 'All 7 Continents', desc: 'Expeditions available on every continent, including Antarctica departures in polar season.' },
  { icon: 'shield-check-line', title: 'Safety First Always', desc: 'WEMS-certified guides, satellite communication on every remote trip, and full emergency protocols.' },
  { icon: 'leaf-line', title: 'Carbon Offset Trips', desc: 'Every booking includes a carbon offset contribution and direct trail maintenance funding.' },
  { icon: 'group-line', title: 'Small Groups Only', desc: 'Maximum 12 people per expedition for a genuine wilderness experience and personalised guidance.' },
  { icon: 'headphone-line', title: '24/7 Trail Support', desc: 'Satellite-linked support team available at any hour during active expeditions worldwide.' },
  { icon: 'calendar-check-line', title: 'Flexible Booking', desc: 'Free rebooking up to 30 days out, weather-event guarantee, and partial refund policy.' },
]

const stats = [
  { icon: 'group-line', value: '4.2k+', label: 'Adventurers Guided' },
  { icon: 'thumb-up-line', value: '840+', label: 'Expeditions Run' },
  { icon: 'star-smile-line', value: '98%', label: 'Would Return' },
  { icon: 'guide-line', value: '42', label: 'Expert Guides' },
]

const activityItems = [
  { icon: 'landscape-line', label: 'Trekking', title: 'Multi-Day Mountain Treks', desc: 'Conquer iconic routes on six continents. From day hikes to 14-day circuits, every route is graded and staffed by summit-certified local guides.', tags: ['Route Grading', 'Porters Available', 'Gear Provided', 'Safety Protocol'] },
  { icon: 'water-flash-line', label: 'Diving', title: 'Deep Dive Expeditions', desc: 'PADI-certified dive masters lead groups through pristine reefs, shipwrecks, and pelagic corridors that few divers ever reach.', tags: ['PADI Certified', 'Equipment Included', 'Night Dives', 'Conservation Focus'] },
  { icon: 'sailboat-line', label: 'Rafting', title: 'White Water River Runs', desc: 'Class I to Class V rapids matched to your experience level. Expert swiftwater rescuers in safety kayaks accompany every trip.', tags: ['All Skill Levels', 'Safety Kayakers', 'Wetsuit Provided', 'Scenic Routes'] },
  { icon: 'flight-takeoff-line', label: 'Paragliding', title: 'Tandem Paraglide Flights', desc: 'Soar over alpine ridges and coastal cliffs with certified paraglide pilots and breathtaking aerial photography packages included.', tags: ['Certified Pilots', 'Photo Package', 'Tandem Safe', 'Scenic Routes'] },
  { icon: 'bike-line', label: 'Cycling', title: 'Wilderness Cycling Routes', desc: 'Gravel and mountain bike routes through national parks, volcanic crater rims, and desert plateaus with support vehicle escort.', tags: ['Gravel & MTB', 'Support Vehicle', 'Bike Rental', 'Park Access'] },
]

const megaMenus = {
  lodges: {
    heading: 'Lodges & Camps',
    columns: [
      {
        title: 'Lodge Types',
        links: [
          { label: 'Rainforest Treehouses', to: '/lodges', icon: 'tree-line' },
          { label: 'Arctic Glamping Domes', to: '/lodges', icon: 'temp-cold-line' },
          { label: 'Desert Safari Camps', to: '/lodges', icon: 'sun-line' },
        ],
      },
      {
        title: 'Features',
        links: [
          { label: 'Eco-Certified Properties', to: '/lodges', icon: 'leaf-line' },
          { label: 'All-Inclusive Packages', to: '/lodges', icon: 'restaurant-line' },
          { label: 'Remote & Off-Grid', to: '/lodges', icon: 'wifi-off-line' },
        ],
      },
    ],
    promo: {
      title: 'Zero-Waste Lodge Program',
      text: 'Stay at a certified zero-waste lodge and offset your full trip carbon footprint automatically.',
      image: 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=900&q=80',
    },
  },
  pages: {
    heading: 'More Pages',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About Us', to: '/about', icon: 'team-line' },
          { label: 'Contact', to: '/contact', icon: 'mail-send-line' },
          { label: 'FAQ', to: '/contact', icon: 'question-line' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Field Notes', to: '/blog', icon: 'article-line' },
          { label: 'Trip Reports', to: '/blog', icon: 'file-list-2-line' },
          { label: 'Safety Guides', to: '/blog', icon: 'shield-check-line' },
        ],
      },
    ],
    promo: {
      title: 'Expedition Field Notes',
      text: 'First-hand accounts, trail conditions, and wildlife logs from our recent departures.',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    },
  },
}

/* ══════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ══════════════════════════════════════════════════════ */
function Stars({ rating, size }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="stars" style={{ fontSize: size || '1rem' }}>
      {Array.from({ length: full }).map((_, i) => <I key={`f${i}`} name="star-fill" />)}
      {half && <I name="star-half-fill" />}
      {Array.from({ length: empty }).map((_, i) => <I key={`e${i}`} name="star-line" />)}
    </span>
  )
}

function runModernAnimations(selector, mode) {
  if (mode !== 'modern' || typeof window === 'undefined' || !window.gsap) return
  const els = document.querySelectorAll(selector)
  if (!els.length) return
  window.gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out' })
}

/* ══════════════════════════════════════════════════════
   TOP BAR
   ══════════════════════════════════════════════════════ */
function TopBar({ mode, setMode }) {
  return (
    <div className="topbar-wrap">
      <div className="topbar contain">
        <p className="topbar-slogan"><I name="compass-3-line" /> Adventure Travel &amp; Eco-Lodge Collection</p>
        <a className="topbar-hotline" href="tel:+18005550293"><I name="phone-line" /> (+1) 800 555 0293</a>
        <div className="topbar-right">
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><I name="facebook-fill" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><I name="instagram-line" /></a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><I name="twitter-x-line" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><I name="youtube-line" /></a>
          </div>
          <div className="mode-switcher" role="group" aria-label="view mode switch">
            {MODES.map((o) => (
              <button key={o} type="button" className={mode === o ? 'mode-pill active' : 'mode-pill'} onClick={() => setMode(o)} aria-label={o}>
                <I name={o === 'light' ? 'sun-line' : o === 'dark' ? 'moon-line' : o === 'classic' ? 'quill-pen-line' : 'rocket-line'} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MEGA MENU
   ══════════════════════════════════════════════════════ */
function MegaMenu({ menuKey, openMenu, setOpenMenu }) {
  const menu = megaMenus[menuKey]
  const isOpen = openMenu === menuKey
  return (
    <div className="nav-mega" onMouseEnter={() => setOpenMenu(menuKey)} onMouseLeave={() => setOpenMenu(null)}>
      <button
        type="button"
        className={isOpen ? 'nav-link active nav-trigger' : 'nav-link nav-trigger'}
        onClick={() => setOpenMenu(isOpen ? null : menuKey)}
      >
        {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)} <I name="arrow-down-s-line" />
      </button>
      {isOpen && (
        <div className="mega-panel" role="menu">
          <p className="mega-heading">{menu.heading}</p>
          <div className="mega-content">
            {menu.columns.map((col) => (
              <div key={col.title} className="mega-column">
                <h4>{col.title}</h4>
                {col.links.map((lnk) => (
                  <Link key={lnk.label} to={lnk.to} onClick={() => setOpenMenu(null)}>
                    <I name={lnk.icon} /> {lnk.label}
                  </Link>
                ))}
              </div>
            ))}
            <article className="mega-promo">
              <img src={menu.promo.image} alt={menu.promo.title} loading="lazy" />
              <div><h4>{menu.promo.title}</h4><p>{menu.promo.text}</p></div>
            </article>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SITE HEADER
   ══════════════════════════════════════════════════════ */
function SiteHeader() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="header-wrap">
      <header className="site-header contain" onMouseLeave={() => setOpenMenu(null)}>
        <Link className="brand" to="/">Terranova</Link>
        <nav className={mobileOpen ? 'site-nav open' : 'site-nav'} aria-label="main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}>
            <I name="home-4-line" /> Home
          </NavLink>
          <MegaMenu menuKey="lodges" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <MegaMenu menuKey="pages" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <NavLink to="/lodges" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}>
            <I name="tent-line" /> Lodges
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}>
            <I name="article-line" /> Blog
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}>
            <I name="mail-line" /> Contact
          </NavLink>
        </nav>
        <button type="button" className="mobile-menu-btn" aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)}>
          <I name={mobileOpen ? 'close-line' : 'menu-line'} />
        </button>
        <Link to="/contact" className="reservation-button"><I name="map-pin-line" /> Plan Trip</Link>
      </header>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   BREADCRUMB HERO
   ══════════════════════════════════════════════════════ */
function BreadcrumbHero({ title, current, image }) {
  return (
    <section className="breadcrumb-hero reveal" style={{ backgroundImage: `url(${image})` }}>
      <div className="breadcrumb-overlay" />
      <div className="breadcrumb-content">
        <p className="eyebrow">Terranova Adventures</p>
        <h1>{title}</h1>
        <p><Link to="/">Home</Link> / {current}</p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════ */
function HomePage({ mode }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeReview, setActiveReview] = useState(0)
  const [bookingTab, setBookingTab] = useState('lodges')
  const [bookingStatus, setBookingStatus] = useState('')
  const [bookingErrors, setBookingErrors] = useState({})
  const [formData, setFormData] = useState({
    checkIn: null, checkOut: null, lodgeGuests: 2,
    expDate: null, expGuests: 2, expType: 'patagonia-trek', expEmail: '',
    dayDate: null, dayActivity: 'trekking', dayGuests: 2, dayName: '',
  })

  useEffect(() => {
    const t = setInterval(() => setActiveSlide(v => (v + 1) % heroSlides.length), 5500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveReview(v => (v + 1) % testimonials.length), 5200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (mode !== 'modern' || !window.gsap) return
    const tl = window.gsap.timeline()
    tl.fromTo('.hero-layer-eyebrow', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 })
      .fromTo('.hero-layer-title', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, '-=0.1')
      .fromTo('.hero-layer-desc', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.18')
      .fromTo('.hero-layer-actions', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 }, '-=0.17')
    window.gsap.fromTo('.home-slide-image', { opacity: 0.6, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.66, ease: 'power2.out' })
  }, [activeSlide, mode])

  const slide = heroSlides[activeSlide]

  const setField = (f, v) => { setFormData(p => ({ ...p, [f]: v })); setBookingErrors(p => ({ ...p, [f]: '' })) }
  const adjustCounter = (f, mn, mx, d) => {
    setFormData(p => ({ ...p, [f]: Math.min(mx, Math.max(mn, p[f] + d)) }))
    setBookingErrors(p => ({ ...p, [f]: '' }))
  }

  const validateBooking = () => {
    const e = {}
    if (bookingTab === 'lodges') {
      if (!formData.checkIn) e.checkIn = 'Arrival date is required.'
      if (!formData.checkOut) e.checkOut = 'Departure date is required.'
      if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) e.checkOut = 'Departure must be after arrival.'
      if (formData.lodgeGuests < 1) e.lodgeGuests = 'At least 1 guest required.'
    }
    if (bookingTab === 'expeditions') {
      if (!formData.expDate) e.expDate = 'Departure date is required.'
      if (!formData.expEmail.trim()) e.expEmail = 'Email is required.'
      else if (!formData.expEmail.includes('@')) e.expEmail = 'Valid email required.'
      if (formData.expGuests < 1) e.expGuests = 'At least 1 guest required.'
    }
    if (bookingTab === 'daytrips') {
      if (!formData.dayDate) e.dayDate = 'Date is required.'
      if (!formData.dayName.trim()) e.dayName = 'Name is required.'
      if (formData.dayGuests < 1) e.dayGuests = 'At least 1 guest required.'
    }
    setBookingErrors(e)
    return Object.keys(e).length === 0
  }

  const handleBookingSubmit = (ev) => {
    ev.preventDefault()
    setBookingStatus('')
    if (!validateBooking()) return
    setBookingStatus(
      bookingTab === 'lodges' ? 'Lodge availability request submitted!' :
      bookingTab === 'expeditions' ? 'Expedition inquiry submitted!' :
      'Day trip booking submitted!'
    )
  }

  const handleHeroMouseMove = (ev) => {
    if (mode !== 'modern' || !window.gsap) return
    const r = ev.currentTarget.getBoundingClientRect()
    const x = (ev.clientX - r.left - r.width / 2) / r.width
    const y = (ev.clientY - r.top - r.height / 2) / r.height
    window.gsap.to('.home-slide-image', { x: x * 18, y: y * 14, duration: 0.45, ease: 'power2.out', overwrite: true })
    window.gsap.to('.hero-layer', { x: x * 10, y: y * 8, duration: 0.45, ease: 'power2.out', overwrite: true })
  }

  const handleHeroMouseLeave = () => {
    if (mode !== 'modern' || !window.gsap) return
    window.gsap.to(['.home-slide-image', '.hero-layer'], { x: 0, y: 0, duration: 0.55, ease: 'power2.out', overwrite: true })
  }

  return (
    <>
      {/* ── Hero Slider ── */}
      <section className="slider-section reveal" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
        <div className="home-slider">
          <img className="home-slide-image" src={slide.image} alt="Terranova adventure" loading="eager" />
          <div className="home-slide-overlay" />
          <div className="home-slide-content">
            <p className="eyebrow hero-layer hero-layer-eyebrow"><I name="compass-3-line" /> {slide.subtitle}</p>
            <h1 className="hero-layer hero-layer-title">{slide.title}</h1>
            <p className="hero-layer hero-layer-desc">{slide.description}</p>
            <div className="hero-actions hero-layer hero-layer-actions">
              <Link to="/contact" className="btn-primary"><I name="map-pin-line" /> Plan Your Trip</Link>
              <Link to="/lodges" className="btn-ghost"><I name="eye-line" /> View Lodges</Link>
            </div>
          </div>
          <button className="slider-arrow left" type="button" onClick={() => setActiveSlide(v => (v - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide"><I name="arrow-left-s-line" /></button>
          <button className="slider-arrow right" type="button" onClick={() => setActiveSlide(v => (v + 1) % heroSlides.length)} aria-label="Next slide"><I name="arrow-right-s-line" /></button>
          <div className="slider-dots-hero">
            {heroSlides.map((_, i) => (
              <button key={i} type="button" className={i === activeSlide ? 'dot active' : 'dot'} onClick={() => setActiveSlide(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Engine ── */}
      <section className="booking-engine contain reveal">
        <div className="booking-tabs" role="tablist">
          {[{ key: 'lodges', icon: 'tent-line', label: 'Lodges' }, { key: 'expeditions', icon: 'compass-3-line', label: 'Expeditions' }, { key: 'daytrips', icon: 'run-line', label: 'Day Trips' }].map(t => (
            <button key={t.key} type="button" role="tab" aria-selected={bookingTab === t.key} className={bookingTab === t.key ? 'booking-tab active' : 'booking-tab'} onClick={() => { setBookingTab(t.key); setBookingStatus(''); setBookingErrors({}) }}>
              <I name={t.icon} /> {t.label}
            </button>
          ))}
        </div>
        <form className="booking-form" onSubmit={handleBookingSubmit}>
          {bookingTab === 'lodges' && (
            <>
              <div className={bookingErrors.checkIn ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-event-line" /> Arrival</label>
                <DatePicker selected={formData.checkIn} onChange={d => setField('checkIn', d)} selectsStart startDate={formData.checkIn} endDate={formData.checkOut} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" />
                {bookingErrors.checkIn && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.checkIn}</span>}
              </div>
              <div className={bookingErrors.checkOut ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-check-line" /> Departure</label>
                <DatePicker selected={formData.checkOut} onChange={d => setField('checkOut', d)} selectsEnd startDate={formData.checkIn} endDate={formData.checkOut} minDate={formData.checkIn} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" />
                {bookingErrors.checkOut && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.checkOut}</span>}
              </div>
              <div className={bookingErrors.lodgeGuests ? 'form-field counter-field has-error' : 'form-field counter-field'}>
                <label><I name="user-line" /> Guests</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('lodgeGuests', 1, 12, -1)}><I name="subtract-line" /></button>
                  <span>{formData.lodgeGuests}</span>
                  <button type="button" onClick={() => adjustCounter('lodgeGuests', 1, 12, 1)}><I name="add-line" /></button>
                </div>
                {bookingErrors.lodgeGuests && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.lodgeGuests}</span>}
              </div>
              <button type="submit" className="btn-primary booking-submit"><I name="search-line" /> Find Lodges</button>
            </>
          )}
          {bookingTab === 'expeditions' && (
            <>
              <div className={bookingErrors.expDate ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-line" /> Departure Date</label>
                <DatePicker selected={formData.expDate} onChange={d => setField('expDate', d)} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" minDate={new Date()} />
                {bookingErrors.expDate && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.expDate}</span>}
              </div>
              <div className="form-field">
                <label><I name="compass-3-line" /> Expedition</label>
                <select value={formData.expType} onChange={e => setField('expType', e.target.value)}>
                  <option value="patagonia-trek">Patagonia Torres del Paine</option>
                  <option value="borneo-safari">Borneo Rainforest Safari</option>
                  <option value="maldives-dive">Maldives Deep Dive</option>
                </select>
              </div>
              <div className={bookingErrors.expGuests ? 'form-field counter-field has-error' : 'form-field counter-field'}>
                <label><I name="group-line" /> Group Size</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('expGuests', 1, 12, -1)}><I name="subtract-line" /></button>
                  <span>{formData.expGuests}</span>
                  <button type="button" onClick={() => adjustCounter('expGuests', 1, 12, 1)}><I name="add-line" /></button>
                </div>
                {bookingErrors.expGuests && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.expGuests}</span>}
              </div>
              <div className={bookingErrors.expEmail ? 'form-field has-error' : 'form-field'}>
                <label><I name="mail-line" /> Email</label>
                <input type="email" placeholder="you@example.com" value={formData.expEmail} onChange={e => setField('expEmail', e.target.value)} />
                {bookingErrors.expEmail && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.expEmail}</span>}
              </div>
              <button type="submit" className="btn-primary booking-submit"><I name="compass-3-line" /> Find Expeditions</button>
            </>
          )}
          {bookingTab === 'daytrips' && (
            <>
              <div className={bookingErrors.dayDate ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-line" /> Date</label>
                <DatePicker selected={formData.dayDate} onChange={d => setField('dayDate', d)} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" minDate={new Date()} />
                {bookingErrors.dayDate && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.dayDate}</span>}
              </div>
              <div className="form-field">
                <label><I name="run-line" /> Activity</label>
                <select value={formData.dayActivity} onChange={e => setField('dayActivity', e.target.value)}>
                  <option value="trekking">Mountain Trekking</option>
                  <option value="rafting">White Water Rafting</option>
                  <option value="paragliding">Tandem Paragliding</option>
                  <option value="cycling">Wilderness Cycling</option>
                </select>
              </div>
              <div className={bookingErrors.dayGuests ? 'form-field counter-field has-error' : 'form-field counter-field'}>
                <label><I name="group-line" /> Guests</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('dayGuests', 1, 10, -1)}><I name="subtract-line" /></button>
                  <span>{formData.dayGuests}</span>
                  <button type="button" onClick={() => adjustCounter('dayGuests', 1, 10, 1)}><I name="add-line" /></button>
                </div>
                {bookingErrors.dayGuests && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.dayGuests}</span>}
              </div>
              <div className={bookingErrors.dayName ? 'form-field span-full has-error' : 'form-field span-full'}>
                <label><I name="user-3-line" /> Your Name</label>
                <input type="text" placeholder="Full name" value={formData.dayName} onChange={e => setField('dayName', e.target.value)} />
                {bookingErrors.dayName && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.dayName}</span>}
              </div>
              <button type="submit" className="btn-primary booking-submit"><I name="run-line" /> Book Day Trip</button>
            </>
          )}
        </form>
        {bookingStatus && <p className="booking-status"><I name="checkbox-circle-line" /> {bookingStatus}</p>}
      </section>

      {/* ── Featured Lodges ── */}
      <section className="section contain reveal section-spaced" id="lodges">
        <div className="section-heading">
          <p className="eyebrow"><I name="tent-line" /> Featured Lodges</p>
          <h2>Extraordinary stays in the world's most remote wilderness</h2>
        </div>
        <div className="cards-grid rooms-grid">
          {featuredLodges.map(lodge => (
            <article className="card room-card" key={lodge.name}>
              <div className="card-img-wrap">
                {lodge.badge && <span className="card-badge"><I name="checkbox-circle-fill" /> {lodge.badge}</span>}
                <img src={lodge.image} alt={lodge.name} loading="lazy" />
              </div>
              <div className="card-copy">
                <div className="card-top-row"><Stars rating={lodge.rating} size="0.85rem" /><span className="review-count">({lodge.reviews})</span></div>
                <h3>{lodge.name}</h3>
                <p className="room-meta"><I name="ruler-line" /> {lodge.size} · <I name="user-line" /> {lodge.capacity} · <I name="tent-line" /> {lodge.bedDetail}</p>
                <div className="room-footer">
                  <strong className="room-price">${lodge.price}<span>/night</span></strong>
                  {lodge.originalPrice && <span className="original-price">${lodge.originalPrice}</span>}
                </div>
                <Link to="/lodges" className="text-button"><I name="eye-line" /> View Details</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="section-cta"><Link to="/lodges" className="btn-primary"><I name="arrow-right-line" /> View All Lodges</Link></div>
      </section>

      {/* ── Mini About ── */}
      <section className="section contain reveal mini-about section-spaced">
        <img src="https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=1400&q=80" alt="Terranova guides on trail" loading="lazy" />
        <div>
          <p className="eyebrow"><I name="information-line" /> About Terranova</p>
          <h2>Where wild places become life-defining journeys</h2>
          <p>Terranova was built by expedition guides who believed the planet's remote corners deserved better storytelling. We connect adventurers with expert-led expeditions, zero-impact lodges, and the kind of wilderness immersion that changes perspectives permanently.</p>
          <Link to="/about" className="btn-primary link-btn"><I name="arrow-right-line" /> Our Story</Link>
        </div>
      </section>

      {/* ── Expeditions ── */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="compass-3-line" /> Expeditions & Tours</p>
          <h2>Expert-led journeys into the world's finest wilderness</h2>
        </div>
        <div className="cards-grid tours-grid">
          {expeditions.map(exp => (
            <article className="card tour-card" key={exp.title}>
              <div className="card-img-wrap">
                <span className="card-badge top-badge"><I name="flashlight-line" /> {exp.difficulty}</span>
                <img src={exp.image} alt={exp.title} loading="lazy" />
              </div>
              <div className="card-copy">
                <div className="card-top-row"><Stars rating={exp.rating} size="0.85rem" /><span className="review-count">({exp.reviews})</span></div>
                <h3>{exp.title}</h3>
                <div className="tour-meta-row">
                  <span><I name="time-line" /> {exp.duration}</span>
                  <span><I name="map-pin-line" /> {exp.spots}</span>
                  <span><I name="group-line" /> {exp.groupSize}</span>
                </div>
                <div className="tour-highlights">
                  {exp.highlights.map(h => <span key={h}><I name="check-line" /> {h}</span>)}
                </div>
                <div className="tour-includes">
                  {exp.includes.map(ic => <span key={ic} className="tour-include-icon"><I name={ic} /></span>)}
                </div>
                <div className="room-footer">
                  <strong className="room-price">{exp.price}<span>/person</span></strong>
                  <button type="button" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.55rem 0.9rem' }}><I name="calendar-check-line" /> Book Now</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Banner ── */}
      <section className="full-banner full-bleed reveal section-spaced" style={{ backgroundImage: 'linear-gradient(rgba(14,17,22,0.4),rgba(14,17,22,0.5)), url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80)' }}>
        <p className="eyebrow"><I name="leaf-line" /> Sustainable Adventure</p>
        <h2>Book direct to unlock a complimentary gear kit, carbon offset certificate, and priority guide assignment.</h2>
        <Link to="/contact" className="btn-primary banner-cta"><I name="map-pin-line" /> Plan Your Expedition</Link>
      </section>

      {/* ── What's Included ── */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="service-line" /> What's Included</p>
          <h2>Everything you need for the wild</h2>
        </div>
        <div className="amenities-grid">
          {amenities.map(item => (
            <article key={item.title} className="amenity-card">
              <div className="amenity-icon"><I name={item.icon} /></div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section contain reveal reviews-wrap section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="chat-quote-line" /> Adventurer Reviews</p>
          <h2>Explorers consistently rate Terranova exceptional</h2>
        </div>
        <div className="testimonial-carousel">
          <div className="testimonial-track" style={{ transform: `translateX(-${activeReview * 100}%)` }}>
            {testimonials.map(item => (
              <article className="testimonial-slide" key={item.name}>
                <img className="review-avatar" src={item.avatar} alt={item.name} loading="lazy" />
                <div className="testimonial-card">
                  <Stars rating={item.rating} size="1rem" />
                  <p className="review-text">&ldquo;{item.review}&rdquo;</p>
                  <h3>{item.name}</h3>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="testimonial-controls">
          <button type="button" onClick={() => setActiveReview(v => (v - 1 + testimonials.length) % testimonials.length)} aria-label="Previous"><I name="arrow-left-s-line" /></button>
          <div className="slider-dots">
            {testimonials.map((_, i) => <button key={i} type="button" className={i === activeReview ? 'dot active' : 'dot'} onClick={() => setActiveReview(i)} aria-label={`Review ${i + 1}`} />)}
          </div>
          <button type="button" onClick={() => setActiveReview(v => (v + 1) % testimonials.length)} aria-label="Next"><I name="arrow-right-s-line" /></button>
        </div>
      </section>

      {/* ── Blog ── */}
      <section className="section contain reveal section-spaced" id="blog">
        <div className="section-heading">
          <p className="eyebrow"><I name="article-line" /> Field Notes</p>
          <h2>Stories, guides &amp; expedition insights</h2>
          <p>First-hand reports, gear reviews, destination guides, and safety tips from our team of expedition leaders.</p>
        </div>
        <div className="cards-grid blog-grid">
          {blogPosts.slice(0, 3).map(post => (
            <article className="card blog-card" key={post.title}>
              <div className="card-img-wrap">
                <span className="card-badge top-badge"><I name="bookmark-line" /> {post.category}</span>
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="card-copy">
                <p className="meta"><I name="user-line" /> {post.author} · <I name="calendar-line" /> {post.date} · <I name="time-line" /> {post.readTime}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to="/blog" className="text-button"><I name="arrow-right-line" /> Read More</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="section-cta"><Link to="/blog" className="btn-primary"><I name="arrow-right-line" /> View All Articles</Link></div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter contain reveal section-spaced">
        <div>
          <p className="eyebrow"><I name="mail-send-line" /> Newsletter</p>
          <h2>Get expedition alerts, route updates &amp; early access</h2>
          <p>One curated email per month — trip reports, destination openers, and subscriber-only booking slots.</p>
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="btn-primary"><I name="send-plane-line" /> Subscribe</button>
        </form>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   LODGES LISTING PAGE
   ══════════════════════════════════════════════════════ */
function LodgesPage() {
  return (
    <>
      <BreadcrumbHero title="Lodges & Camps" current="Lodges" image="https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=2200&q=80" />

      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="tent-line" /> Our Accommodations</p>
          <h2>Find your perfect wilderness stay</h2>
          <p>Browse our complete collection of eco-lodges and adventure camps. Every property is independently verified for sustainability standards, safety protocols, and immersive location quality. Use the listings or scroll to find the ideal base for your expedition.</p>
        </div>

        <div className="room-listings">
          {allLodgeListings.map(lodge => (
            <article className="rl-card" key={lodge.name}>
              <div className="rl-image-col">
                {lodge.badge && <span className="rl-badge"><I name="checkbox-circle-fill" /> {lodge.badge}</span>}
                <img src={lodge.image} alt={lodge.name} loading="lazy" />
                <div className="rl-image-dots">
                  <span className="dot active" /><span className="dot" /><span className="dot" />
                </div>
              </div>
              <div className="rl-details">
                <div className="rl-top">
                  <Stars rating={lodge.rating} size="0.88rem" />
                  <span className="review-count">({lodge.reviews})</span>
                </div>
                <h3>{lodge.name}</h3>
                <p className="rl-address"><I name="map-pin-line" /> {lodge.address} · <a href="#map">See Map</a> {lodge.distance}</p>
                <div className="rl-amenities">
                  {lodge.amenities.map((a, i) => (
                    <span key={a + i}><I name={a} /> {lodge.amenityLabels[i]}</span>
                  ))}
                </div>
                <div className="rl-bottom">
                  <div className="rl-type-info">
                    <p><strong>{lodge.type}</strong></p>
                    <p>{lodge.bed}</p>
                    <p className="rl-bed-detail"><I name="tent-line" /> {lodge.bedDetail}</p>
                    <p className="rl-cancellation"><I name="checkbox-circle-line" /> {lodge.cancellation}</p>
                  </div>
                  <div className="rl-pricing">
                    <p className="rl-nights">{lodge.nights}, {lodge.capacity}</p>
                    <p className="rl-price">
                      <strong>${lodge.price}</strong>
                      {lodge.originalPrice && <span className="original-price">${lodge.originalPrice}</span>}
                    </p>
                    <button className="btn-primary rl-cta"><I name="arrow-right-line" /> Check Availability</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   ABOUT PAGE
   ══════════════════════════════════════════════════════ */
function AboutPage() {
  const [activeActivity, setActiveActivity] = useState(0)
  const act = activityItems[activeActivity]

  return (
    <>
      <BreadcrumbHero title="About" current="About" image="https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=2200&q=80" />

      {/* About Intro */}
      <section className="about-intro contain reveal section-spaced">
        <div className="about-text">
          <p className="eyebrow"><I name="information-line" /> About Us</p>
          <h2>We make wilderness truly accessible.</h2>
          <p>Founded by expedition leaders who believed the world's wildest places deserve better guides, Terranova has grown into a multi-continent operation with a strict zero-harm ethos. We measure success by how unchanged a landscape looks after we leave.</p>
          <p>Our team of 42 certified guides covers every major biome — from polar ice fields to equatorial rainforests. Every expedition is capped at 12 guests, ensuring personalised attention and minimal ecological footprint.</p>
          <div className="about-badges-row">
            <span className="about-badge"><I name="award-fill" /> WEMS-Certified Guides</span>
            <span className="about-badge"><I name="leaf-line" /> Leave No Trace Partner</span>
          </div>
          <div className="about-ctas">
            <Link to="/contact" className="btn-primary"><I name="search-line" /> Plan an Expedition</Link>
            <button type="button" className="btn-play"><I name="play-circle-line" /> Watch Our Story</button>
          </div>
        </div>
        <div className="about-image-wrap">
          <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80" alt="Terranova expedition team" loading="lazy" />
          <div className="experience-badge">
            <strong>12</strong>
            <span>Years of<br />Expeditions</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar contain reveal section-spaced">
        {stats.map(s => (
          <article key={s.label} className="stat-item">
            <I name={s.icon} className="stat-icon" />
            <div>
              <strong>{s.value}</strong>
              <p>{s.label}</p>
            </div>
          </article>
        ))}
        <div className="trustpilot-bar">
          <p className="tp-label">Excellent</p>
          <Stars rating={4.5} size="0.85rem" />
          <p className="tp-text">Rating of 4.9 based on 6,214 reviews</p>
          <p className="tp-brand"><I name="star-fill" /> Trustpilot</p>
        </div>
      </section>

      {/* Why Us */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading center">
          <p className="eyebrow"><I name="shield-check-line" /> Why Choose Us</p>
          <h2>Why Terranova Is Different</h2>
        </div>
        <div className="why-us-grid">
          {whyUsFeatures.map(f => (
            <article key={f.title} className="why-card">
              <div className="why-icon"><I name={f.icon} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Activities */}
      <section className="activities-section full-bleed reveal section-spaced">
        <div className="activities-inner contain">
          <img src="https://images.unsplash.com/photo-1536332880611-b2c3fc8cccac?auto=format&fit=crop&w=1400&q=80" alt="Terranova adventure activities" className="activities-image" loading="lazy" />
          <div className="activities-content">
            <p className="eyebrow"><I name="compass-3-line" /> What We Do</p>
            <h2>Our Adventure Activities</h2>
            <div className="activities-tabs">
              {activityItems.map((a, i) => (
                <button key={a.label} type="button" className={i === activeActivity ? 'activity-tab active' : 'activity-tab'} onClick={() => setActiveActivity(i)}>
                  <I name={a.icon} /> {a.label}
                </button>
              ))}
            </div>
            <div className="activity-detail">
              <h3>{act.title}</h3>
              <p>{act.desc}</p>
              <div className="activity-tags">
                {act.tags.map(tag => <span key={tag}>+ {tag}</span>)}
              </div>
              <div className="activity-ctas">
                <Link to="/contact" className="btn-primary"><I name="calendar-check-line" /> Check Availability</Link>
                <button type="button" className="btn-play"><I name="play-circle-line" /> Watch in Action</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Guides */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading center">
          <p className="eyebrow"><I name="guide-line" /> Our Guides</p>
          <h2>Expert Expedition Leaders</h2>
        </div>
        <div className="guides-grid">
          {team.map(m => (
            <article key={m.name} className="guide-card">
              <img src={m.image} alt={m.name} loading="lazy" />
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading center">
          <p className="eyebrow"><I name="article-line" /> Field Notes</p>
          <h2>From the Trail &amp; Beyond</h2>
        </div>
        <div className="cards-grid blog-grid-2col">
          {blogPosts.slice(0, 2).map(post => (
            <article className="card blog-card" key={post.title}>
              <div className="card-img-wrap">
                <span className="card-badge top-badge"><I name="bookmark-line" /> {post.category}</span>
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="card-copy">
                <p className="meta"><I name="user-line" /> By {post.author} · <I name="calendar-line" /> {post.date}</p>
                <h3>{post.title}</h3>
                <Link to="/blog" className="text-button accent"><I name="arrow-right-up-line" /> View Post</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Full-width */}
      <section className="newsletter-full full-bleed reveal section-spaced" style={{ backgroundImage: 'linear-gradient(rgba(14,17,22,0.88),rgba(14,17,22,0.85)), url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80)' }}>
        <div className="newsletter-inner contain">
          <h2>Join the Expedition Newsletter</h2>
          <p>Monthly dispatch: new routes, trip openings, gear picks, and first-hand field stories.</p>
          <form onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary"><I name="send-plane-line" /> Subscribe</button>
          </form>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   BLOG PAGE
   ══════════════════════════════════════════════════════ */
function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...new Set(blogPosts.map(p => p.category))]
  const filtered = activeCategory === 'All' ? blogPosts : blogPosts.filter(p => p.category === activeCategory)

  return (
    <>
      <BreadcrumbHero title="Field Notes" current="Blog" image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80" />
      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="article-line" /> Latest Articles</p>
          <h2>Expedition reports, guides &amp; adventure insights</h2>
        </div>

        <div className="blog-layout">
          <div className="blog-main">
            <div className="blog-listing-grid">
              {filtered.map(post => (
                <article className="card blog-card" key={post.title}>
                  <div className="card-img-wrap">
                    <span className="card-badge top-badge"><I name="bookmark-line" /> {post.category}</span>
                    <img src={post.image} alt={post.title} loading="lazy" />
                  </div>
                  <div className="card-copy">
                    <p className="meta"><I name="user-line" /> {post.author} · <I name="calendar-line" /> {post.date} · <I name="time-line" /> {post.readTime}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <button type="button" className="text-button"><I name="arrow-right-line" /> Read More</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="blog-sidebar">
            <div className="sidebar-card">
              <h4><I name="search-line" /> Search</h4>
              <input type="text" placeholder="Search field notes..." className="sidebar-search" />
            </div>

            <div className="sidebar-card">
              <h4><I name="folder-line" /> Categories</h4>
              <div className="sidebar-categories">
                {categories.map(c => (
                  <button key={c} type="button" className={activeCategory === c ? 'sidebar-cat active' : 'sidebar-cat'} onClick={() => setActiveCategory(c)}>
                    {c} {c === 'All' ? `(${blogPosts.length})` : `(${blogPosts.filter(p => p.category === c).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-card">
              <h4><I name="fire-line" /> Popular Posts</h4>
              {blogPosts.slice(0, 3).map((post, i) => (
                <div key={post.title} className="sidebar-post">
                  <span className="sidebar-post-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="sidebar-post-title">{post.title}</p>
                    <p className="meta">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-card sidebar-cta-card">
              <I name="mail-send-line" className="sidebar-cta-icon" />
              <h4>Newsletter</h4>
              <p>Monthly expedition alerts and exclusive route previews.</p>
              <form onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your email" />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}><I name="send-plane-line" /> Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   CONTACT PAGE
   ══════════════════════════════════════════════════════ */
function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const faqs = [
    { q: 'What fitness level is required for expeditions?', a: 'All expeditions are clearly graded from Easy to Challenging. We provide detailed fitness guidelines for each trip so you can self-assess before booking. Our team is also happy to discuss requirements in a pre-booking call.' },
    { q: 'Is gear included or do I need to bring my own?', a: 'All technical gear is provided — tents, sleeping bags, ropes, harnesses, and navigation tools. You bring personal clothing, hiking boots, and any specialist equipment you prefer. A full packing list is sent after booking.' },
    { q: 'What safety measures are in place on remote trips?', a: 'Every expedition carries a satellite communicator, first-aid trained guide, and comprehensive emergency evacuation plan. For trips above 4,000m or Class IV+ whitewater, a dedicated safety officer joins the group.' },
    { q: 'How small are the expedition groups?', a: 'Maximum 12 guests per expedition. Most groups run 6–10 people for the best balance of safety, logistics, and personal guide attention.' },
    { q: 'What is the cancellation and rebooking policy?', a: 'Free cancellation or rebooking up to 30 days before departure. Our weather-event guarantee allows free rescheduling within 12 months if a trip is cancelled due to severe weather.' },
    { q: 'Do you cater for dietary requirements?', a: 'Yes, all dietary requirements — vegetarian, vegan, gluten-free, halal — are fully accommodated. Please specify requirements when booking so our camp team can prepare appropriately.' },
  ]

  return (
    <>
      <BreadcrumbHero title="Contact" current="Contact" image="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=2200&q=80" />
      <section className="section contain reveal contact-grid section-spaced">
        <div>
          <p className="eyebrow"><I name="mail-send-line" /> Contact Us</p>
          <h2>Plan your next expedition with Terranova</h2>
          <p>Tell us where you want to go and when. Our expedition team responds within 24 hours with a personalised itinerary and availability check.</p>
          <div className="contact-cards">
            <article><div className="contact-icon"><I name="map-pin-2-fill" /></div><div><h3>Headquarters</h3><p>48 Alpine Street, Queenstown, New Zealand</p></div></article>
            <article><div className="contact-icon"><I name="phone-fill" /></div><div><h3>Phone</h3><p>(+1) 800 555 0293</p></div></article>
            <article><div className="contact-icon"><I name="mail-fill" /></div><div><h3>Email</h3><p>expeditions@terranova.com</p></div></article>
            <article><div className="contact-icon"><I name="time-fill" /></div><div><h3>Hours</h3><p>Mon–Fri 08:00–20:00 UTC</p></div></article>
          </div>
        </div>
        <form className="contact-form" onSubmit={e => e.preventDefault()}>
          <label><I name="user-line" /> Full name <input type="text" placeholder="Alex Rivera" required /></label>
          <label><I name="mail-line" /> Email <input type="email" placeholder="alex@example.com" required /></label>
          <label><I name="compass-3-line" /> Destination <input type="text" placeholder="e.g. Patagonia, Borneo, Maldives" required /></label>
          <label><I name="chat-1-line" /> Message <textarea rows="5" placeholder="Tell us your group size, fitness level, and preferred dates" required /></label>
          <button type="submit" className="btn-primary"><I name="send-plane-line" /> Send Message</button>
        </form>
      </section>

      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="question-line" /> Frequently Asked</p>
          <h2>Common Questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={openFaq === i ? 'faq-item open' : 'faq-item'}>
              <button type="button" className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <I name={openFaq === i ? 'subtract-line' : 'add-line'} />
              </button>
              {openFaq === i && <div className="faq-answer"><p>{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </section>

      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="map-pin-line" /> Find Us</p>
          <h2>Our Location</h2>
          <p>48 Alpine Street, Queenstown, New Zealand</p>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49218.72726878649!2d168.63656831230967!3d-45.03102229108513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa9d51df1d7a8de5f%3A0x500ef8684799945!2sQueenstown%2C%20New%20Zealand!5e0!3m2!1sen!2s!4v1647000000001!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Terranova Queenstown Headquarters"
          />
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <div className="footer-wrap">
      <footer className="site-footer contain">
        <div className="footer-grid">
          <section>
            <h3>Terranova</h3>
            <p>Expert-led expeditions and eco-lodge stays across every continent, crafted for the discerning adventurer.</p>
            <div className="socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><I name="facebook-fill" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><I name="instagram-line" /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><I name="twitter-x-line" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><I name="youtube-line" /></a>
            </div>
          </section>
          <section>
            <h4>Quick Links</h4>
            <Link to="/"><I name="arrow-right-s-line" /> Home</Link>
            <Link to="/lodges"><I name="arrow-right-s-line" /> Lodges</Link>
            <Link to="/about"><I name="arrow-right-s-line" /> About</Link>
            <Link to="/blog"><I name="arrow-right-s-line" /> Blog</Link>
            <Link to="/contact"><I name="arrow-right-s-line" /> Contact</Link>
          </section>
          <section>
            <h4><I name="phone-line" /> Enquiries</h4>
            <a href="tel:+18005550293"><I name="phone-fill" /> (+1) 800 555 0293</a>
            <h4><I name="mail-line" /> Email Us</h4>
            <a href="mailto:expeditions@terranova.com"><I name="mail-fill" /> expeditions@terranova.com</a>
            <h4><I name="map-pin-line" /> Headquarters</h4>
            <p>48 Alpine Street, Queenstown, NZ</p>
          </section>
          <section>
            <h4>We&apos;re Here</h4>
            <p>Expeditions run year-round across 7 continents. Booking team available Mon–Fri 08:00–20:00 UTC.</p>
            <h4>Payment Partners</h4>
            <div className="payment-icons">
              <I name="visa-line" /><I name="mastercard-line" /><I name="paypal-line" /><I name="bank-card-line" />
            </div>
          </section>
        </div>
        <div className="footer-bottom">
          <p>© Copyright 2026 Terranova. Design by <strong>Terranova Team</strong></p>
          <p><a href="#">Privacy Policy</a> · <a href="#">Terms &amp; Conditions</a></p>
        </div>
      </footer>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   APP SHELL
   ══════════════════════════════════════════════════════ */
function AppShell() {
  const location = useLocation()
  const [mode, setMode] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('terranova-mode') : null
    return MODES.includes(saved) ? saved : 'light'
  })

  useEffect(() => {
    document.body.dataset.mode = mode
    window.localStorage.setItem('terranova-mode', mode)
  }, [mode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    runModernAnimations('.reveal', mode)
  }, [mode, location.pathname])

  return (
    <div className="app-shell">
      <TopBar mode={mode} setMode={setMode} />
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage mode={mode} />} />
          <Route path="/lodges" element={<LodgesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage mode={mode} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppShell
