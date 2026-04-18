import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'

const DatePicker = ReactDatePicker.default || ReactDatePicker

const I = ({ name, className }) => <i className={`ri-${name} ${className || ''}`} />
const MODES = ['light', 'dark', 'classic', 'modern']

/* ── Data ── */
const heroSlides = [
  { title: 'Refined Stays Crafted for Modern Travelers', subtitle: 'Luxury hotel experience', description: 'Rivora combines architectural calm, intuitive service, and destination-led experiences in every stay.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2200&q=80' },
  { title: 'Designed Rooms, Better Sleep, Elevated Comfort', subtitle: 'Award-winning hospitality', description: 'From signature suites to family-ready layouts, every room is designed with thoughtful spatial flow.', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2200&q=80' },
  { title: 'City Access with Resort-Level Hospitality', subtitle: 'Urban retreat collection', description: 'Stay steps away from key districts while enjoying concierge-led curation and premium amenities.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=80' },
]

const allRoomListings = [
  { name: 'Eclipse Haven Lodge', type: 'Sea View', bed: 'Semi Double', bedDetail: '1 king bed', capacity: '2 Adults', nights: '1 Night', size: '58 m²', price: 126, originalPrice: 160, rating: 5, reviews: 0, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=80', address: 'House 168/170, Road 02, Avenue 01, Brooklyn, NY', distance: '2 km to city center', amenities: ['tv-line', 'temp-cold-line', 'safe-2-line', 'wifi-line', 'phone-line'], amenityLabels: ['TV', 'Heater', 'Saving Safe', 'Free Wifi', 'Phone'], badge: 'Breakfast Included', cancellation: 'Free cancellation before 48 hours' },
  { name: 'Twilight Serenity Manor', type: 'Family Room', bed: 'Quin Modern Room', bedDetail: '1 king bed', capacity: '2 Adults', nights: '1 Night', size: '74 m²', price: 46, originalPrice: null, rating: 4.5, reviews: 1, image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1400&q=80', address: 'House 168/170, Road 02, Avenue 01, Brooklyn, NY', distance: '2 km to city center', amenities: ['tv-line', 'temp-cold-line', 'safe-2-line', 'wifi-line', 'phone-line'], amenityLabels: ['TV', 'Heater', 'Saving Safe', 'Free Wifi', 'Phone'], badge: 'Breakfast Included', cancellation: 'Free cancellation before 48 hours' },
  { name: 'Garden Pavilion Suite', type: 'Garden View', bed: 'Deluxe Suite', bedDetail: '2 queen beds', capacity: '4 Adults', nights: '1 Night', size: '86 m²', price: 279, originalPrice: 320, rating: 5, reviews: 12, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80', address: '450 Park Avenue, Manhattan, NY', distance: '0.5 km to city center', amenities: ['tv-line', 'temp-cold-line', 'safe-2-line', 'wifi-line', 'phone-line', 'restaurant-line'], amenityLabels: ['TV', 'Heater', 'Saving Safe', 'Free Wifi', 'Phone', 'Dining'], badge: 'Best Seller', cancellation: 'Free cancellation before 72 hours' },
  { name: 'Horizon Sky Penthouse', type: 'Skyline View', bed: 'Premium King', bedDetail: '1 king bed + sofa', capacity: '3 Adults', nights: '1 Night', size: '102 m²', price: 389, originalPrice: 450, rating: 5, reviews: 8, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=80', address: '789 5th Avenue, Manhattan, NY', distance: '0.3 km to city center', amenities: ['tv-line', 'temp-cold-line', 'safe-2-line', 'wifi-line', 'phone-line', 'goblet-line'], amenityLabels: ['TV', 'Heater', 'Saving Safe', 'Free Wifi', 'Phone', 'Mini Bar'], badge: 'Premium Choice', cancellation: 'Free cancellation before 48 hours' },
  { name: 'Coastal Breeze Retreat', type: 'Ocean Front', bed: 'Twin Comfort', bedDetail: '2 twin beds', capacity: '2 Adults', nights: '1 Night', size: '44 m²', price: 98, originalPrice: null, rating: 4, reviews: 3, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80', address: '12 Harbor Drive, Brooklyn, NY', distance: '3 km to city center', amenities: ['tv-line', 'wifi-line', 'phone-line'], amenityLabels: ['TV', 'Free Wifi', 'Phone'], badge: null, cancellation: 'Free cancellation before 24 hours' },
]

const featuredRooms = allRoomListings.slice(0, 3)

const tourPackages = [
  { title: 'Old City Architecture Walk', duration: '3 hours', spots: '7 landmarks', guide: 'Licensed local curator', price: '$49', image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', difficulty: 'Easy', groupSize: 'Max 12', rating: 4.9, reviews: 214, highlights: ['Roman Forum ruins', 'Gothic Cathedral', 'Hidden courtyards'], includes: ['map-pin-line', 'drink-line', 'camera-line'] },
  { title: 'Sunset Bay Sailing Tour', duration: '2.5 hours', spots: 'Private marina route', guide: 'On-board host included', price: '$89', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', difficulty: 'Moderate', groupSize: 'Max 8', rating: 4.8, reviews: 156, highlights: ['Open-bar cocktails', 'Sunset photography', 'Coastal cliff views'], includes: ['goblet-line', 'camera-line', 'music-2-line'] },
  { title: 'Culinary Market Trail', duration: '4 hours', spots: '5 chef-selected stops', guide: 'Food specialist host', price: '$65', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', difficulty: 'Easy', groupSize: 'Max 10', rating: 5.0, reviews: 98, highlights: ['Artisan cheese tasting', 'Seafood market tour', 'Wine pairing session'], includes: ['restaurant-line', 'goblet-line', 'shopping-bag-line'] },
]

const amenities = [
  { icon: 'customer-service-2-line', title: '24/7 Concierge Desk', description: 'Personal itineraries, transport, and table reservations managed at any hour.' },
  { icon: 'water-flash-line', title: 'Rooftop Infinity Pool', description: 'Temperature-controlled pool with skyline deck seating and sunset bar service.' },
  { icon: 'taxi-line', title: 'Airport Transfer', description: 'Door-to-door transfer with premium vehicles and real-time flight tracking.' },
  { icon: 'heart-pulse-line', title: 'Wellness & Spa', description: 'Thermal rituals, massage suites, and recovery treatments by certified experts.' },
  { icon: 'macbook-line', title: 'Work Lounge', description: 'Private pods, fast internet, and boardroom-ready areas for business travelers.' },
  { icon: 'restaurant-line', title: 'All-day Dining', description: 'Seasonal menus, chef tables, and curated tasting routes across local cuisines.' },
]

const testimonials = [
  { name: 'Sophia Lee', role: 'Frequent Traveler', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80', review: 'A rare blend of design and service precision. The concierge team handled every detail before we asked.', rating: 5 },
  { name: 'Daniel Cruz', role: 'Family Vacation', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80', review: 'Rooms were spacious, tours were excellent, and the staff made the entire week easy for our family.', rating: 5 },
  { name: 'Mia Thompson', role: 'Business Traveler', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=320&q=80', review: 'Efficient check-in, quiet work areas, and premium sleep quality. Perfect for a productive city trip.', rating: 4 },
]

const blogPosts = [
  { title: 'Top Hotel Amenities Guests Prioritize in 2026', excerpt: 'How hospitality teams are shifting from generic perks to curated, guest-specific experiences that build loyalty and drive direct bookings.', image: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=1200&q=80', date: 'Apr 09, 2026', category: 'Hospitality', readTime: '6 min read', author: 'Ava Hart' },
  { title: 'Interior Trends Defining Next-Gen Boutique Hotels', excerpt: 'A practical look at lighting layers, tactile materials, and biophilic layouts redefining the modern hotel room.', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', date: 'Mar 26, 2026', category: 'Design', readTime: '5 min read', author: 'Luna Sato' },
  { title: 'Planning the Perfect Two-Night Urban Retreat', excerpt: 'A destination planner built around culinary stops, wellness blocks, and flexible downtime for busy professionals.', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', date: 'Mar 11, 2026', category: 'Travel', readTime: '7 min read', author: 'Mateo Rivera' },
  { title: 'Sustainable Luxury: How Hotels Are Going Green Without Losing Elegance', excerpt: 'From solar-powered suites to zero-waste dining — the practices reshaping five-star sustainability standards.', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', date: 'Feb 28, 2026', category: 'Sustainability', readTime: '8 min read', author: 'Ava Hart' },
  { title: 'The Rise of Bleisure Travel: Work Meets Wanderlust', excerpt: 'Business travelers are extending trips for leisure. Here is how hotels are adapting with co-working lounges and weekend packages.', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80', date: 'Feb 14, 2026', category: 'Trends', readTime: '5 min read', author: 'Noah Bennet' },
  { title: 'Hidden Gem Destinations for 2026: Off the Beaten Path', excerpt: 'From coastal villages in Portugal to mountain retreats in Georgia — undiscovered places ready for discerning travelers.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', date: 'Jan 30, 2026', category: 'Travel', readTime: '9 min read', author: 'Mateo Rivera' },
  { title: 'Wellness Tourism: Beyond the Spa Day', excerpt: 'How immersive wellness retreats with breathwork, cold plunge, and forest bathing are becoming mainstream hotel offerings.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?auto=format&fit=crop&w=1200&q=80', date: 'Jan 15, 2026', category: 'Wellness', readTime: '6 min read', author: 'Luna Sato' },
  { title: 'Food & Wine Pairings: A Hotel Chef\'s Guide', excerpt: 'Our in-house sommelier shares the principles behind the perfect pairing for every season and palate.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', date: 'Jan 02, 2026', category: 'Dining', readTime: '4 min read', author: 'Luna Sato' },
]

const team = [
  { name: 'Ava Hart', role: 'General Manager', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80' },
  { name: 'Noah Bennet', role: 'Guest Experience Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Luna Sato', role: 'Creative Chef', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mateo Rivera', role: 'Tour Guide Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
]

const whyUsFeatures = [
  { icon: 'earth-line', title: 'Worldwide Coverage', desc: 'Properties curated across scenic urban and coastal destinations on 4 continents.' },
  { icon: 'money-dollar-circle-line', title: 'Competitive Pricing', desc: 'Guaranteed best rates on direct bookings with flexible date management.' },
  { icon: 'flashlight-line', title: 'Fast Booking', desc: 'Streamlined three-step reservation process takes under two minutes.' },
  { icon: 'compass-3-line', title: 'Guided Tours', desc: 'Professional on-ground experts run premium walking, sailing, and culinary excursions.' },
  { icon: 'headphone-line', title: 'Best Support 24/7', desc: 'Live concierge available around the clock with average response under 4 minutes.' },
  { icon: 'calendar-check-line', title: 'Ultimate Flexibility', desc: 'Free cancellation and last-minute swaps ensure zero stress for travel changes.' },
]

const stats = [
  { icon: 'group-line', value: '0.5k+', label: 'Happy Travelers' },
  { icon: 'thumb-up-line', value: '0.4k+', label: 'Tour Success' },
  { icon: 'star-smile-line', value: '31%', label: 'Positive Reviews' },
  { icon: 'guide-line', value: '7', label: 'Travel Guides' },
]

const activityItems = [
  { icon: 'landscape-line', label: 'Zip Lining', title: 'Thrill Above Ground: The Zip Line Adventure', desc: 'Embark on an adrenaline-fueled journey, zipping through lush landscapes, feeling the wind rush past you, and experiencing nature from breathtaking heights. Unleash your inner adventurer today.', tags: ['Treetop Views', 'Adrenaline Rush', 'Safety Measures', 'Nature Immersion'] },
  { icon: 'run-line', label: 'Bungee Jumping', title: 'Take the Leap: Bungee Jumping Thrill', desc: 'Experience the ultimate free-fall rush from towering platforms above gorges and rivers. Professional safety systems and expert guides ensure a heart-pounding yet secure experience.', tags: ['Free Fall', 'Canyon Views', 'Safety Harness', 'Group Packages'] },
  { icon: 'sailboat-line', label: 'Rafting', title: 'Navigate the Rapids: White Water Rafting', desc: 'Join a team of fellow adventurers as you conquer rapids ranging from gentle class I to intense class IV. Expert river guides and premium equipment provided.', tags: ['River Rapids', 'Team Building', 'Scenic Routes', 'All Levels'] },
  { icon: 'flight-takeoff-line', label: 'Paragliding', title: 'Soar the Skies: Paragliding Experience', desc: 'Glide over majestic valleys and coastlines with a tandem paragliding flight. Certified pilots and premium gear make this unforgettable aerial experience safe for all.', tags: ['Aerial Views', 'Tandem Flight', 'Certified Pilots', 'Photo Package'] },
  { icon: 'bike-line', label: 'Ski Touring', title: 'Alpine Discovery: Backcountry Ski Touring', desc: 'Explore untouched powder and pristine alpine terrain with experienced mountain guides. All equipment and safety briefing included in this premium winter excursion.', tags: ['Fresh Powder', 'Mountain Guides', 'Gear Included', 'Winter Package'] },
]

const megaMenus = {
  rooms: {
    heading: 'Rooms & Suites',
    columns: [
      { title: 'Room Types', links: [{ label: 'Signature Suites', to: '/rooms', icon: 'vip-crown-line' }, { label: 'Premium Collection', to: '/rooms', icon: 'star-line' }, { label: 'Family Collection', to: '/rooms', icon: 'parent-line' }] },
      { title: 'Room Features', links: [{ label: 'Sea & Skyline Views', to: '/rooms', icon: 'building-2-line' }, { label: 'In-room Dining', to: '/rooms', icon: 'restaurant-line' }, { label: 'Private Lounge Access', to: '/rooms', icon: 'sofa-line' }] },
    ],
    promo: { title: 'Suite Upgrade Program', text: 'Stay 3 nights and get complimentary room-category upgrade.', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80' },
  },
  pages: {
    heading: 'Inner Pages',
    columns: [
      { title: 'About & Contact', links: [{ label: 'About Us', to: '/about', icon: 'team-line' }, { label: 'Contact', to: '/contact', icon: 'mail-send-line' }, { label: 'FAQ', to: '/contact', icon: 'question-line' }] },
      { title: 'Insights', links: [{ label: 'Blog', to: '/blog', icon: 'article-line' }, { label: 'News', to: '/blog', icon: 'newspaper-line' }, { label: 'Press Kit', to: '/blog', icon: 'folder-download-line' }] },
    ],
    promo: { title: 'Guest Storytelling Journal', text: 'Explore destination notes, chef picks, and curated travel routes.', image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80' },
  },
}

/* ── Utility Components ── */
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

/* ── TopBar ── */
function TopBar({ mode, setMode }) {
  return (
    <div className="topbar-wrap">
      <div className="topbar contain">
        <p className="topbar-slogan"><I name="leaf-line" /> Boutique Luxury Hotel & Resort Collection</p>
        <a className="topbar-hotline" href="tel:+12125550147"><I name="phone-line" /> (+1) 212 555 0147</a>
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

/* ── Mega Menu ── */
function MegaMenu({ menuKey, openMenu, setOpenMenu }) {
  const menu = megaMenus[menuKey]
  const isOpen = openMenu === menuKey
  return (
    <div className="nav-mega" onMouseEnter={() => setOpenMenu(menuKey)} onMouseLeave={() => setOpenMenu(null)}>
      <button type="button" className={isOpen ? 'nav-link active nav-trigger' : 'nav-link nav-trigger'} onClick={() => setOpenMenu(isOpen ? null : menuKey)}>
        {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)} <I name="arrow-down-s-line" />
      </button>
      {isOpen && (
        <div className="mega-panel" role="menu">
          <p className="mega-heading">{menu.heading}</p>
          <div className="mega-content">
            {menu.columns.map((col) => (
              <div key={col.title} className="mega-column">
                <h4>{col.title}</h4>
                {col.links.map((lnk) => <Link key={lnk.label} to={lnk.to} onClick={() => setOpenMenu(null)}><I name={lnk.icon} /> {lnk.label}</Link>)}
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

/* ── Site Header ── */
function SiteHeader() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="header-wrap">
      <header className="site-header contain" onMouseLeave={() => setOpenMenu(null)}>
        <Link className="brand" to="/">Rivora</Link>
        <nav className={mobileOpen ? 'site-nav open' : 'site-nav'} aria-label="main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}><I name="home-4-line" /> Home</NavLink>
          <MegaMenu menuKey="rooms" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <MegaMenu menuKey="pages" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <NavLink to="/rooms" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}><I name="hotel-bed-line" /> Rooms</NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}><I name="article-line" /> Blog</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}><I name="mail-line" /> Contact</NavLink>
        </nav>
        <button type="button" className="mobile-menu-btn" aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)}>
          <I name={mobileOpen ? 'close-line' : 'menu-line'} />
        </button>
        <Link to="/contact" className="reservation-button"><I name="calendar-check-line" /> Book Now</Link>
      </header>
    </div>
  )
}

/* ── Breadcrumb Hero ── */
function BreadcrumbHero({ title, current, image }) {
  return (
    <section className="breadcrumb-hero reveal" style={{ backgroundImage: `url(${image})` }}>
      <div className="breadcrumb-overlay" />
      <div className="breadcrumb-content">
        <p className="eyebrow">Rivora Hotel</p>
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
  const [bookingTab, setBookingTab] = useState('rooms')
  const [bookingStatus, setBookingStatus] = useState('')
  const [bookingErrors, setBookingErrors] = useState({})
  const [formData, setFormData] = useState({
    checkIn: null, checkOut: null, roomAdults: 2, roomChildren: 0,
    tourDate: null, tourGuests: 2, tourType: 'old-city-architecture', tourEmail: '',
    diningDate: null, diningTime: '19:30', diningGuests: 2, diningArea: 'chef-table', diningName: '',
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
  const adjustCounter = (f, mn, mx, d) => { setFormData(p => ({ ...p, [f]: Math.min(mx, Math.max(mn, p[f] + d)) })); setBookingErrors(p => ({ ...p, [f]: '' })) }

  const validateBooking = () => {
    const e = {}
    if (bookingTab === 'rooms') {
      if (!formData.checkIn) e.checkIn = 'Check-in date is required.'
      if (!formData.checkOut) e.checkOut = 'Check-out date is required.'
      if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) e.checkOut = 'Check-out must be after check-in.'
      if (formData.roomAdults < 1) e.roomAdults = 'At least 1 adult required.'
    }
    if (bookingTab === 'tours') {
      if (!formData.tourDate) e.tourDate = 'Tour date is required.'
      if (!formData.tourEmail.trim()) e.tourEmail = 'Email is required.'
      else if (!formData.tourEmail.includes('@')) e.tourEmail = 'Valid email required.'
      if (formData.tourGuests < 1) e.tourGuests = 'At least 1 guest required.'
    }
    if (bookingTab === 'dining') {
      if (!formData.diningDate) e.diningDate = 'Date is required.'
      if (!formData.diningTime) e.diningTime = 'Time is required.'
      if (!formData.diningName.trim()) e.diningName = 'Name is required.'
      if (formData.diningGuests < 1) e.diningGuests = 'At least 1 guest required.'
    }
    setBookingErrors(e)
    return Object.keys(e).length === 0
  }

  const handleBookingSubmit = (ev) => {
    ev.preventDefault()
    setBookingStatus('')
    if (!validateBooking()) return
    setBookingStatus(bookingTab === 'rooms' ? 'Room availability request submitted!' : bookingTab === 'tours' ? 'Tour inquiry submitted!' : 'Dining reservation submitted!')
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
      {/* ── Hero Slider with padding + rounded ── */}
      <section className="slider-section reveal" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
        <div className="home-slider">
          <img className="home-slide-image" src={slide.image} alt="Rivora hotel" loading="eager" />
          <div className="home-slide-overlay" />
          <div className="home-slide-content">
            <p className="eyebrow hero-layer hero-layer-eyebrow"><I name="shining-line" /> {slide.subtitle}</p>
            <h1 className="hero-layer hero-layer-title">{slide.title}</h1>
            <p className="hero-layer hero-layer-desc">{slide.description}</p>
            <div className="hero-actions hero-layer hero-layer-actions">
              <Link to="/contact" className="btn-primary"><I name="calendar-check-line" /> Reservation</Link>
              <Link to="/rooms" className="btn-ghost"><I name="eye-line" /> Explore Rooms</Link>
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

      {/* ── Booking Engine (separated, not affected by slider) ── */}
      <section className="booking-engine contain reveal">
        <div className="booking-tabs" role="tablist">
          {[{ key: 'rooms', icon: 'hotel-bed-line', label: 'Rooms' }, { key: 'tours', icon: 'compass-3-line', label: 'Tours' }, { key: 'dining', icon: 'restaurant-line', label: 'Dining' }].map(t => (
            <button key={t.key} type="button" role="tab" aria-selected={bookingTab === t.key} className={bookingTab === t.key ? 'booking-tab active' : 'booking-tab'} onClick={() => { setBookingTab(t.key); setBookingStatus(''); setBookingErrors({}) }}>
              <I name={t.icon} /> {t.label}
            </button>
          ))}
        </div>
        <form className="booking-form" onSubmit={handleBookingSubmit}>
          {bookingTab === 'rooms' && (
            <>
              <div className={bookingErrors.checkIn ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-event-line" /> Check In</label>
                <DatePicker selected={formData.checkIn} onChange={d => setField('checkIn', d)} selectsStart startDate={formData.checkIn} endDate={formData.checkOut} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" />
                {bookingErrors.checkIn && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.checkIn}</span>}
              </div>
              <div className={bookingErrors.checkOut ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-check-line" /> Check Out</label>
                <DatePicker selected={formData.checkOut} onChange={d => setField('checkOut', d)} selectsEnd startDate={formData.checkIn} endDate={formData.checkOut} minDate={formData.checkIn} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" />
                {bookingErrors.checkOut && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.checkOut}</span>}
              </div>
              <div className={bookingErrors.roomAdults ? 'form-field counter-field has-error' : 'form-field counter-field'}>
                <label><I name="user-line" /> Adults</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('roomAdults', 1, 8, -1)}><I name="subtract-line" /></button>
                  <span>{formData.roomAdults}</span>
                  <button type="button" onClick={() => adjustCounter('roomAdults', 1, 8, 1)}><I name="add-line" /></button>
                </div>
                {bookingErrors.roomAdults && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.roomAdults}</span>}
              </div>
              <div className="form-field counter-field">
                <label><I name="user-heart-line" /> Children</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('roomChildren', 0, 6, -1)}><I name="subtract-line" /></button>
                  <span>{formData.roomChildren}</span>
                  <button type="button" onClick={() => adjustCounter('roomChildren', 0, 6, 1)}><I name="add-line" /></button>
                </div>
              </div>
              <button type="submit" className="btn-primary booking-submit"><I name="search-line" /> Check Availability</button>
            </>
          )}
          {bookingTab === 'tours' && (
            <>
              <div className={bookingErrors.tourDate ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-line" /> Tour Date</label>
                <DatePicker selected={formData.tourDate} onChange={d => setField('tourDate', d)} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" minDate={new Date()} />
                {bookingErrors.tourDate && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.tourDate}</span>}
              </div>
              <div className="form-field">
                <label><I name="compass-3-line" /> Tour Type</label>
                <select value={formData.tourType} onChange={e => setField('tourType', e.target.value)}>
                  <option value="old-city-architecture">Old City Architecture</option>
                  <option value="sunset-sailing">Sunset Sailing</option>
                  <option value="culinary-market">Culinary Market Trail</option>
                </select>
              </div>
              <div className={bookingErrors.tourGuests ? 'form-field counter-field has-error' : 'form-field counter-field'}>
                <label><I name="group-line" /> Guests</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('tourGuests', 1, 12, -1)}><I name="subtract-line" /></button>
                  <span>{formData.tourGuests}</span>
                  <button type="button" onClick={() => adjustCounter('tourGuests', 1, 12, 1)}><I name="add-line" /></button>
                </div>
                {bookingErrors.tourGuests && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.tourGuests}</span>}
              </div>
              <div className={bookingErrors.tourEmail ? 'form-field has-error' : 'form-field'}>
                <label><I name="mail-line" /> Email</label>
                <input type="email" placeholder="you@example.com" value={formData.tourEmail} onChange={e => setField('tourEmail', e.target.value)} />
                {bookingErrors.tourEmail && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.tourEmail}</span>}
              </div>
              <button type="submit" className="btn-primary booking-submit"><I name="compass-3-line" /> Find Tours</button>
            </>
          )}
          {bookingTab === 'dining' && (
            <>
              <div className={bookingErrors.diningDate ? 'form-field has-error' : 'form-field'}>
                <label><I name="calendar-line" /> Date</label>
                <DatePicker selected={formData.diningDate} onChange={d => setField('diningDate', d)} placeholderText="Select date" dateFormat="MMM dd, yyyy" className="dp-input" minDate={new Date()} />
                {bookingErrors.diningDate && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.diningDate}</span>}
              </div>
              <div className={bookingErrors.diningTime ? 'form-field has-error' : 'form-field'}>
                <label><I name="time-line" /> Time</label>
                <input type="time" value={formData.diningTime} onChange={e => setField('diningTime', e.target.value)} />
                {bookingErrors.diningTime && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.diningTime}</span>}
              </div>
              <div className={bookingErrors.diningGuests ? 'form-field counter-field has-error' : 'form-field counter-field'}>
                <label><I name="group-line" /> Guests</label>
                <div className="counter-row">
                  <button type="button" onClick={() => adjustCounter('diningGuests', 1, 10, -1)}><I name="subtract-line" /></button>
                  <span>{formData.diningGuests}</span>
                  <button type="button" onClick={() => adjustCounter('diningGuests', 1, 10, 1)}><I name="add-line" /></button>
                </div>
                {bookingErrors.diningGuests && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.diningGuests}</span>}
              </div>
              <div className="form-field">
                <label><I name="store-2-line" /> Area</label>
                <select value={formData.diningArea} onChange={e => setField('diningArea', e.target.value)}>
                  <option value="chef-table">Chef Table</option>
                  <option value="rooftop">Rooftop Terrace</option>
                  <option value="private-lounge">Private Lounge</option>
                </select>
              </div>
              <div className={bookingErrors.diningName ? 'form-field span-full has-error' : 'form-field span-full'}>
                <label><I name="user-3-line" /> Guest Name</label>
                <input type="text" placeholder="Full name" value={formData.diningName} onChange={e => setField('diningName', e.target.value)} />
                {bookingErrors.diningName && <span className="field-error"><I name="error-warning-line" /> {bookingErrors.diningName}</span>}
              </div>
              <button type="submit" className="btn-primary booking-submit"><I name="restaurant-line" /> Reserve Table</button>
            </>
          )}
        </form>
        {bookingStatus && <p className="booking-status"><I name="checkbox-circle-line" /> {bookingStatus}</p>}
      </section>

      {/* ── Featured Rooms ── */}
      <section className="section contain reveal section-spaced" id="rooms">
        <div className="section-heading">
          <p className="eyebrow"><I name="hotel-bed-line" /> Featured Rooms</p>
          <h2>Stay categories engineered for comfort, privacy, and style</h2>
        </div>
        <div className="cards-grid rooms-grid">
          {featuredRooms.map(room => (
            <article className="card room-card" key={room.name}>
              <div className="card-img-wrap">
                {room.badge && <span className="card-badge"><I name="checkbox-circle-fill" /> {room.badge}</span>}
                <img src={room.image} alt={room.name} loading="lazy" />
              </div>
              <div className="card-copy">
                <div className="card-top-row"><Stars rating={room.rating} size="0.85rem" /><span className="review-count">({room.reviews})</span></div>
                <h3>{room.name}</h3>
                <p className="room-meta"><I name="ruler-line" /> {room.size} · <I name="user-line" /> {room.capacity} · <I name="hotel-bed-line" /> {room.bedDetail}</p>
                <div className="room-footer">
                  <strong className="room-price">${room.price}<span>/night</span></strong>
                  {room.originalPrice && <span className="original-price">${room.originalPrice}</span>}
                </div>
                <Link to="/rooms" className="text-button"><I name="eye-line" /> View Details</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="section-cta"><Link to="/rooms" className="btn-primary"><I name="arrow-right-line" /> View All Rooms</Link></div>
      </section>

      {/* ── Mini About ── */}
      <section className="section contain reveal mini-about section-spaced">
        <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=80" alt="Rivora entrance" loading="lazy" />
        <div>
          <p className="eyebrow"><I name="information-line" /> About Rivora</p>
          <h2>Where timeless hospitality meets modern design</h2>
          <p>Rivora creates spaces that balance warmth and refinement, with attentive service and curated local experiences built around each guest. Every stay is crafted to feel personal, from the carefully selected room amenities to the locally inspired dining menus.</p>
          <Link to="/about" className="btn-primary link-btn"><I name="arrow-right-line" /> Learn More</Link>
        </div>
      </section>

      {/* ── Tours ── */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="compass-3-line" /> Tours & Experiences</p>
          <h2>Curated routes designed with local experts</h2>
        </div>
        <div className="cards-grid tours-grid">
          {tourPackages.map(tour => (
            <article className="card tour-card" key={tour.title}>
              <div className="card-img-wrap">
                <span className="card-badge top-badge"><I name="flashlight-line" /> {tour.difficulty}</span>
                <img src={tour.image} alt={tour.title} loading="lazy" />
              </div>
              <div className="card-copy">
                <div className="card-top-row"><Stars rating={tour.rating} size="0.85rem" /><span className="review-count">({tour.reviews})</span></div>
                <h3>{tour.title}</h3>
                <div className="tour-meta-row">
                  <span><I name="time-line" /> {tour.duration}</span>
                  <span><I name="map-pin-line" /> {tour.spots}</span>
                  <span><I name="group-line" /> {tour.groupSize}</span>
                </div>
                <div className="tour-highlights">
                  {tour.highlights.map(h => <span key={h}><I name="check-line" /> {h}</span>)}
                </div>
                <div className="tour-includes">
                  {tour.includes.map(ic => <span key={ic} className="tour-include-icon"><I name={ic} /></span>)}
                </div>
                <div className="room-footer">
                  <strong className="room-price">{tour.price}<span>/person</span></strong>
                  <button type="button" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.55rem 0.9rem' }}><I name="calendar-check-line" /> Book Now</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Banner ── */}
      <section className="full-banner full-bleed reveal section-spaced" style={{ backgroundImage: 'linear-gradient(rgba(14,17,22,0.4),rgba(14,17,22,0.5)), url(https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2200&q=80)' }}>
        <p className="eyebrow"><I name="vip-crown-line" /> Luxury Reimagined</p>
        <h2>Book direct to unlock breakfast, flexible check-in, and premium transfer credits.</h2>
        <Link to="/contact" className="btn-primary banner-cta"><I name="calendar-check-line" /> Book Direct Now</Link>
      </section>

      {/* ── Amenities ── */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="service-line" /> Amenities</p>
          <h2>What we provide</h2>
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
          <p className="eyebrow"><I name="chat-quote-line" /> Testimonials</p>
          <h2>Guests consistently rate Rivora exceptional</h2>
        </div>
        <div className="testimonial-carousel">
          <div className="testimonial-track" style={{ transform: `translateX(-${activeReview * 100}%)` }}>
            {testimonials.map(item => (
              <article className="testimonial-slide" key={item.name}>
                <img className="review-avatar" src={item.avatar} alt={item.name} loading="lazy" />
                <div className="testimonial-card">
                  <Stars rating={item.rating} size="1rem" />
                  <p className="review-text">"{item.review}"</p>
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
            {testimonials.map((_, i) => <button key={i} type="button" className={i === activeReview ? 'dot active' : 'dot'} onClick={() => setActiveReview(i)} aria-label={`Testimonial ${i + 1}`} />)}
          </div>
          <button type="button" onClick={() => setActiveReview(v => (v + 1) % testimonials.length)} aria-label="Next"><I name="arrow-right-s-line" /></button>
        </div>
      </section>

      {/* ── Blog ── */}
      <section className="section contain reveal section-spaced" id="blog">
        <div className="section-heading">
          <p className="eyebrow"><I name="article-line" /> Blog</p>
          <h2>Latest stories & hospitality insights</h2>
          <p>Curated articles from our team on design, travel, wellness, and the future of boutique hospitality.</p>
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
          <h2>Get offers, destination guides, and insider updates</h2>
          <p>Receive one curated email per month. No spam, ever.</p>
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
   ROOMS LISTING PAGE
   ══════════════════════════════════════════════════════ */
function RoomsPage() {
  return (
    <>
      <BreadcrumbHero title="Rooms & Suites" current="Rooms" image="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2200&q=80" />

      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="hotel-bed-line" /> Our Accommodations</p>
          <h2>Find your perfect room</h2>
          <p>Browse our full collection of rooms and suites. Each room is equipped with premium amenities, high-speed WiFi, and 24/7 room service. Use the filters or just scroll to find the perfect match for your stay.</p>
        </div>

        <div className="room-listings">
          {allRoomListings.map(room => (
            <article className="rl-card" key={room.name}>
              <div className="rl-image-col">
                {room.badge && <span className="rl-badge"><I name="checkbox-circle-fill" /> {room.badge}</span>}
                <img src={room.image} alt={room.name} loading="lazy" />
                <div className="rl-image-dots">
                  <span className="dot active" /><span className="dot" /><span className="dot" />
                </div>
              </div>
              <div className="rl-details">
                <div className="rl-top">
                  <Stars rating={room.rating} size="0.88rem" />
                  <span className="review-count">({room.reviews})</span>
                </div>
                <h3>{room.name}</h3>
                <p className="rl-address"><I name="map-pin-line" /> {room.address} · <a href="#map">See Map</a> {room.distance}</p>
                <div className="rl-amenities">
                  {room.amenities.map((a, i) => (
                    <span key={a + i}><I name={a} /> {room.amenityLabels[i]}</span>
                  ))}
                </div>
                <div className="rl-bottom">
                  <div className="rl-type-info">
                    <p><strong>{room.type}</strong></p>
                    <p>{room.bed}</p>
                    <p className="rl-bed-detail"><I name="hotel-bed-line" /> {room.bedDetail}</p>
                    <p className="rl-cancellation"><I name="checkbox-circle-line" /> {room.cancellation}</p>
                  </div>
                  <div className="rl-pricing">
                    <p className="rl-nights">{room.nights}, {room.capacity}</p>
                    <p className="rl-price">
                      <strong>${room.price}</strong>
                      {room.originalPrice && <span className="original-price">${room.originalPrice}</span>}
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
   ABOUT PAGE (TripRex-inspired)
   ══════════════════════════════════════════════════════ */
function AboutPage() {
  const [activeActivity, setActiveActivity] = useState(0)
  const act = activityItems[activeActivity]

  return (
    <>
      <BreadcrumbHero title="About" current="About" image="https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=2200&q=80" />

      {/* About Intro */}
      <section className="about-intro contain reveal section-spaced">
        <div className="about-text">
          <p className="eyebrow"><I name="information-line" /> About Us</p>
          <h2>We provide the best tour facilities.</h2>
          <p>Dolor sit amet, consectetur adipiscing elit. Sed natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi. Curabitur at lacus vel velit ornare lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.</p>
          <p>Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh vitae porta imperdiet.</p>
          <div className="about-badges-row">
            <span className="about-badge"><I name="award-fill" /> Expertise And Experience</span>
            <span className="about-badge"><I name="time-line" /> Time And Stress Savings</span>
          </div>
          <div className="about-ctas">
            <Link to="/contact" className="btn-primary"><I name="search-line" /> Find Out More</Link>
            <button type="button" className="btn-play"><I name="play-circle-line" /> Watch Tour</button>
          </div>
        </div>
        <div className="about-image-wrap">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80" alt="Tour facilities" loading="lazy" />
          <div className="experience-badge">
            <strong>05</strong>
            <span>Years of<br />Experience</span>
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
          <p className="tp-text">Rating of 4.8 based on 143,241 reviews</p>
          <p className="tp-brand"><I name="star-fill" /> Trustpilot</p>
        </div>
      </section>

      {/* Why Us */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading center">
          <p className="eyebrow"><I name="shield-check-line" /> Why Choose Us</p>
          <h2>Why Rivora Is Best</h2>
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
          <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80" alt="Activities" className="activities-image" loading="lazy" />
          <div className="activities-content">
            <p className="eyebrow"><I name="compass-3-line" /> What We Do</p>
            <h2>Our Particular Activities</h2>
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
                <button type="button" className="btn-play"><I name="play-circle-line" /> Watch Culture</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Guides */}
      <section className="section contain reveal section-spaced">
        <div className="section-heading center">
          <p className="eyebrow"><I name="guide-line" /> Tour Guide</p>
          <h2>Our Travel Guide</h2>
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
          <p className="eyebrow"><I name="article-line" /> Articles</p>
          <h2>Travel Article Enthusiast</h2>
        </div>
        <div className="cards-grid blog-grid-2col">
          {blogPosts.slice(0, 2).map(post => (
            <article className="card blog-card" key={post.title}>
              <div className="card-img-wrap">
                <span className="card-badge top-badge"><I name="bookmark-line" /> {post.category}</span>
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="card-copy">
                <p className="meta"><I name="user-line" /> By Admin · <I name="calendar-line" /> {post.date}</p>
                <h3>{post.title}</h3>
                <Link to="/blog" className="text-button accent"><I name="arrow-right-up-line" /> View Post</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Full-width */}
      <section className="newsletter-full full-bleed reveal section-spaced" style={{ backgroundImage: 'linear-gradient(rgba(14,17,22,0.88),rgba(14,17,22,0.85)), url(https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=2200&q=80)' }}>
        <div className="newsletter-inner contain">
          <h2>Join The Newsletter</h2>
          <p>To receive our best monthly deals</p>
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
      <BreadcrumbHero title="Blog" current="Blog" image="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=2200&q=80" />
      <section className="section contain reveal section-spaced">
        <div className="section-heading">
          <p className="eyebrow"><I name="article-line" /> Latest Articles</p>
          <h2>News, trends, and travel ideas</h2>
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
              <input type="text" placeholder="Search articles..." className="sidebar-search" />
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
              <p>Get travel tips and exclusive deals monthly.</p>
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
    { q: 'What are your check-in and check-out times?', a: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability.' },
    { q: 'Do you offer airport transportation?', a: 'Yes, we provide complimentary airport shuttle service for guests. Please contact us at least 24 hours in advance to arrange pickup.' },
    { q: 'Are pets allowed at Rivora?', a: 'We welcome well-behaved pets up to 25 lbs. A $75 pet fee per stay applies. Please inform us in advance if you plan to bring a pet.' },
    { q: 'What amenities are included in the room rate?', a: 'All rooms include complimentary Wi-Fi, daily breakfast, access to fitness center and pool, parking, and premium toiletries.' },
    { q: 'What is your cancellation policy?', a: 'Free cancellation up to 48 hours before arrival. Cancellations within 48 hours are subject to a one-night charge.' },
    { q: 'Do you have meeting and event spaces?', a: 'Yes, we offer versatile meeting rooms and event spaces with full AV equipment. Contact our events team for availability and pricing.' }
  ]

  return (
    <>
      <BreadcrumbHero title="Contact" current="Contact" image="https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&fit=crop&w=2200&q=80" />
      <section className="section contain reveal contact-grid section-spaced">
        <div>
          <p className="eyebrow"><I name="mail-send-line" /> Contact Us</p>
          <h2>Plan your next stay with Rivora</h2>
          <p>Share your dates and preferences. Our team typically responds within 24 hours.</p>
          <div className="contact-cards">
            <article><div className="contact-icon"><I name="map-pin-2-fill" /></div><div><h3>Address</h3><p>2464 Royal Lane, Brooklyn, NY 11206</p></div></article>
            <article><div className="contact-icon"><I name="phone-fill" /></div><div><h3>Phone</h3><p>(+1) 212 555 0147</p></div></article>
            <article><div className="contact-icon"><I name="mail-fill" /></div><div><h3>Email</h3><p>booking@rivora.com</p></div></article>
            <article><div className="contact-icon"><I name="time-fill" /></div><div><h3>Hours</h3><p>24/7 — Front desk always open</p></div></article>
          </div>
        </div>
        <form className="contact-form" onSubmit={e => e.preventDefault()}>
          <label><I name="user-line" /> Full name <input type="text" placeholder="Jane Cooper" required /></label>
          <label><I name="mail-line" /> Email <input type="email" placeholder="jane@example.com" required /></label>
          <label><I name="bookmark-line" /> Subject <input type="text" placeholder="Suite booking inquiry" required /></label>
          <label><I name="chat-1-line" /> Message <textarea rows="5" placeholder="Tell us your dates and preferences" required /></label>
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
          <p>2464 Royal Lane, Brooklyn, NY 11206</p>
        </div>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368428698!3d40.71312937933174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598db8000001%3A0xfc5d1a8b87e8a0d8!2sBrooklyn%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647000000000!5m2!1sen!2s"
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '16px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Rivora Hotel Location"
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
            <h3>Rivora</h3>
            <p>Signature hospitality for design-conscious travelers across urban and coastal destinations.</p>
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
            <Link to="/rooms"><I name="arrow-right-s-line" /> Rooms</Link>
            <Link to="/about"><I name="arrow-right-s-line" /> About</Link>
            <Link to="/blog"><I name="arrow-right-s-line" /> Blog</Link>
            <Link to="/contact"><I name="arrow-right-s-line" /> Contact</Link>
          </section>
          <section>
            <h4><I name="phone-line" /> More Inquiry</h4>
            <a href="tel:+12125550147"><I name="phone-fill" /> (+1) 212 555 0147</a>
            <h4><I name="mail-line" /> Send Mail</h4>
            <a href="mailto:booking@rivora.com"><I name="mail-fill" /> booking@rivora.com</a>
            <h4><I name="map-pin-line" /> Address</h4>
            <p>2464 Royal Lane, Brooklyn, NY 11206</p>
          </section>
          <section>
            <h4>We Are Here</h4>
            <p>Discover prime locations, facilities, and curated routes across Rivora destinations worldwide.</p>
            <h4>Payment Partners</h4>
            <div className="payment-icons">
              <I name="visa-line" /><I name="mastercard-line" /><I name="paypal-line" /><I name="bank-card-line" />
            </div>
          </section>
        </div>
        <div className="footer-bottom">
          <p>© Copyright 2026 Rivora. Design by <strong>Rivora Team</strong></p>
          <p><a href="#">Privacy Policy</a> · <a href="#">Terms & Condition</a></p>
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
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('rivora-mode') : null
    return MODES.includes(saved) ? saved : 'light'
  })

  useEffect(() => {
    document.body.dataset.mode = mode
    window.localStorage.setItem('rivora-mode', mode)
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
          <Route path="/rooms" element={<RoomsPage />} />
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
