import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import './App.css'

const I = ({ name, className = '' }) => <i className={`ri-${name} ${className}`} aria-hidden="true" />
const MODES = ['light', 'dark', 'classic', 'modern']
const STORAGE_KEY = 'riad-mode'
const MODE_ICONS = { light: 'sun-line', dark: 'moon-clear-line', classic: 'ancient-pavilion-line', modern: 'leaf-line' }

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DATA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const heroSlides = [
  { id: 'courtyard', eyebrow: 'Courtyard Collection', title: 'An inner courtyard,', titleEm: 'an outer silence.', subtitle: 'Step through a carved cedar door and the medina falls away. Dar Zellige is a collection of eleven restored riads across Marrakech, Fes, and Chefchaouen.', ctaLabel: 'Browse riads', ctaHref: '/rooms', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80' },
  { id: 'zellige', eyebrow: 'Hand-set Zellige', title: 'Ten thousand tiles,', titleEm: 'cut by hand.', subtitle: 'Every mosaic floor and fountain basin is laid in the traditional way â€” tesserae chipped to shape, set in plaster, grouted by masters.', ctaLabel: 'Meet the craftsmen', ctaHref: '/about', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c64e3a?auto=format&fit=crop&w=2000&q=80' },
  { id: 'hammam', eyebrow: 'Hammam Ritual', title: 'Steam, savon beldi,', titleEm: 'mint tea.', subtitle: 'Each riad keeps a private hammam warmed with cedar embers. Book the Royal Ritual for a ninety-minute ceremony.', ctaLabel: 'Book a ritual', ctaHref: '/booking', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=80' },
]

const allRiads = [
  { id: 'riad-zellige', featured: true, name: 'Riad Zellige', category: 'Signature Riad', city: 'Marrakech Medina', address: 'Derb Bouhsain, Marrakech Medina', beds: 4, capacity: 8, size: 180, price: 320, originalPrice: 420, rating: 4.97, reviews: 214, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80', amenities: ['water-flash-line', 'restaurant-line', 'hotel-bed-line', 'leaf-line', 'moon-line'], amenityLabels: ['Courtyard pool', 'In-riad chef', '4 en-suites', 'Orange grove', 'Rooftop terrace'], badge: 'Signature Stay', cancellation: 'Free cancellation until 48h before check-in', description: 'Nestled within the ancient walls of the Marrakech Medina, Riad Zellige is a masterwork of Andalusian architecture with mosaic zellige floors, hand-carved cedarwood ceilings, and a private courtyard with a rose-water fountain.', highlights: ['Private rose-water courtyard', 'Traditional hammam suite', 'Personal in-riad chef', 'Rooftop terrace & plunge pool'] },
  { id: 'dar-andalusi', featured: true, name: 'Dar Andalusi', category: 'Heritage Palace', city: 'Fes el-Bali', address: 'Talaa Kebira, Fes el-Bali', beds: 5, capacity: 10, size: 240, price: 380, originalPrice: null, rating: 4.99, reviews: 158, image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1400&q=80', amenities: ['ancient-gate-line', 'book-open-line', 'goblet-line', 'cake-3-line', 'service-line'], amenityLabels: ['14th-century arches', 'Medina library', 'Andalusian bar', 'Traditional breakfast', 'House concierge'], badge: 'UNESCO district', cancellation: 'Free cancellation until 72h before check-in', description: 'A restored 14th-century palace in the heart of Fes el-Bali with carved stucco galleries, a grand central courtyard with an 8-metre mosaic fountain, and hand-painted tiles.', highlights: ['Tannery private viewing balcony', 'Medina artisan workshop tours', 'Roof terrace with medina panorama', 'Library of Moroccan manuscripts'] },
  { id: 'riad-zaitoune', featured: true, name: 'Riad Zaitoune', category: 'Courtyard House', city: 'Marrakech Medina', address: 'Derb el-Ferrane, Marrakech', beds: 3, capacity: 6, size: 140, price: 240, originalPrice: 290, rating: 4.92, reviews: 96, image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=1400&q=80', amenities: ['water-flash-line', 'fire-line', 'restaurant-line', 'plant-line'], amenityLabels: ['Reflecting pool', 'Fireplace salon', 'Tajine kitchen', 'Mint garden'], badge: 'New opening', cancellation: 'Free cancellation until 24h before check-in', description: 'A newly restored courtyard house with a reflecting pool, fireplace salon, and a mint garden where breakfast is served each morning.', highlights: ['Reflecting pool courtyard', 'Fireplace salon', 'Tajine kitchen', 'Mint garden breakfast'] },
  { id: 'dar-zaouia', featured: false, name: 'Dar Zaouia', category: 'Artist Residence', city: 'Chefchaouen', address: 'Plaza Uta el-Hammam, Chefchaouen', beds: 3, capacity: 6, size: 120, price: 180, originalPrice: null, rating: 4.88, reviews: 87, image: 'https://images.unsplash.com/photo-1553025934-296397db4010?auto=format&fit=crop&w=1400&q=80', amenities: ['palette-line', 'sun-foggy-line', 'moon-line', 'cup-line'], amenityLabels: ['Atelier studio', 'Rif-valley view', 'Rooftop suite', 'Mint-tea service'], badge: 'Blue City', cancellation: 'Free cancellation until 48h before check-in', description: 'An artist residence in the blue city of Chefchaouen with an atelier studio, Rif-valley views, and a rooftop suite.', highlights: ['Atelier studio', 'Rif-valley panorama', 'Rooftop suite', 'Daily mint-tea service'] },
  { id: 'riad-noor', featured: false, name: 'Riad Noor', category: 'Boutique Riad', city: 'Essaouira', address: 'Rue de la Skala, Essaouira', beds: 4, capacity: 8, size: 160, price: 260, originalPrice: 310, rating: 4.85, reviews: 142, image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=80', amenities: ['ship-line', 'music-2-line', 'restaurant-line', 'water-flash-line'], amenityLabels: ['Atlantic terrace', 'Gnaoua evenings', 'Seafood table', 'Plunge pool'], badge: 'Ocean views', cancellation: 'Free cancellation until 48h before check-in', description: 'A boutique riad on the Essaouira coast with an Atlantic terrace, gnaoua music evenings, and a seafood table.', highlights: ['Atlantic terrace', 'Gnaoua music evenings', 'Fresh seafood table', 'Plunge pool'] },
  { id: 'dar-tadelakt', featured: false, name: 'Dar Tadelakt', category: 'Private Palace', city: 'Palmeraie, Marrakech', address: 'Route de Fes, Palmeraie', beds: 6, capacity: 12, size: 360, price: 540, originalPrice: 680, rating: 4.98, reviews: 189, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80', amenities: ['water-flash-line', 'leaf-line', 'service-line', 'heart-pulse-line', 'car-line', 'restaurant-line'], amenityLabels: ['25m palm pool', 'Olive orchard', 'Full staff', 'Private hammam', 'Airport transfer', 'Chef kitchen'], badge: 'Family favourite', cancellation: 'Free cancellation until 96h before check-in', description: 'A private palace in the Palmeraie with a 25-metre palm pool, olive orchard, full staff, and private hammam.', highlights: ['25m private palm pool', 'Olive orchard', 'Full live-in staff', 'Private hammam & spa'] },
]

const experiences = [
  { id: 'medina-walk', title: 'Medina Artisan Walk', category: 'Culture', duration: '4 hours', groupSize: 'Max 6', price: 75, difficulty: 'Easy', rating: 4.9, reviews: 204, image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80', highlights: ['Copper souk visit', 'Tannery balcony', 'Calligraphy workshop'], excerpt: 'Follow a local historian through the oldest working medina on Earth.' },
  { id: 'tajine-class', title: 'Courtyard Tajine Class', category: 'Culinary', duration: '3 hours', groupSize: 'Max 4', price: 95, difficulty: 'Easy', rating: 5.0, reviews: 128, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', highlights: ['Spice souk shopping', 'Charcoal braising', 'Shared courtyard lunch'], excerpt: 'Shop the spice souk at dawn, return to a riad courtyard, and learn the architecture of a perfect tajine.' },
  { id: 'dune-dawn', title: 'Erg Chebbi Dawn Ride', category: 'Adventure', duration: '6 hours', groupSize: 'Max 8', price: 180, difficulty: 'Moderate', rating: 4.95, reviews: 173, image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80', highlights: ['Camel ascent at 5am', 'Summit sunrise breakfast', 'Berber drumming circle'], excerpt: 'Ride a camel to the crest of Erg Chebbi before dawn.' },
  { id: 'hammam-ritual', title: 'Royal Hammam Ritual', category: 'Wellness', duration: '2.5 hours', groupSize: 'Private', price: 140, difficulty: 'Easy', rating: 4.98, reviews: 341, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80', highlights: ['Savon beldi scrub', 'Rhassoul clay wrap', 'Rose-water rinse'], excerpt: 'The oldest ceremony in Moroccan wellness â€” steam, black soap, argan oil, and mint tea.' },
  { id: 'atlas-trek', title: 'Atlas Mountain Day Trek', category: 'Adventure', duration: '8 hours', groupSize: 'Max 10', price: 120, difficulty: 'Moderate', rating: 4.87, reviews: 98, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', highlights: ['Berber village visit', 'Waterfall swim', 'Mountain lunch'], excerpt: 'A full-day guided trek through the High Atlas with Berber village stops.' },
  { id: 'stargazing', title: 'Sahara Stargazing Night', category: 'Astronomy', duration: '3 hours', groupSize: 'Max 8', price: 95, difficulty: 'Easy', rating: 4.92, reviews: 156, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80', highlights: ['Research telescope', 'Constellation tour', 'Thermal recliners'], excerpt: 'Morocco\u2019s Sahara ranks among the world\u2019s top dark-sky destinations.' },
]

const packages = [
  { id: 'desert-romance', name: 'Sahara Romance Escape', location: 'Merzouga Desert', duration: '4 nights', price: 3200, pricePer: 'per couple', badge: 'Bestseller', tagline: 'The most romantic desert on Earth, perfectly curated', description: 'Four nights in the Sahara Star Pavilion with private sunset camel trek, rooftop hammam, and candlelit dinner on your own private dune.', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1400&q=80', includes: ['4 nights luxury tent', 'Private camel trek', 'Hammam for two', 'Dune dinner', 'All transfers'] },
  { id: 'imperial-tour', name: 'Imperial Cities Grand Tour', location: 'Marrakech Â· Fes Â· Chefchaouen', duration: '8 nights', price: 7400, pricePer: 'per person', badge: 'Signature', tagline: 'Three extraordinary cities, one seamless journey', description: 'Begin in Marrakech, train to Fes, drive to Chefchaouen. Private guides, artisan workshops, and the finest riads in each city.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80', includes: ['8 nights in 3 cities', 'Private guides', 'Artisan workshops', 'All transfers', 'Daily breakfast'] },
  { id: 'atlas-adventure', name: 'Atlas & Desert Adventure', location: 'Atlas Mountains Â· Merzouga', duration: '6 nights', price: 4900, pricePer: 'per person', badge: 'Adventure', tagline: 'Snow peaks at dawn, star dunes at dusk', description: 'Three nights in the Atlas Mountain Lodge followed by three nights in the Sahara. Summit hiking, Berber villages, and desert silence.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80', includes: ['3 nights Atlas lodge', '3 nights desert camp', 'Guided treks', 'Camel trek', 'All meals'] },
  { id: 'coastal-serenity', name: 'Atlantic Coastal Serenity', location: 'Essaouira Coast', duration: '5 nights', price: 3800, pricePer: 'per couple', badge: 'Coastal', tagline: 'Salt air, Atlantic surf, and the art of doing nothing', description: 'Five nights in the Atlantic Kasbah with kitesurf lessons, hammam rituals, and fresh seafood at the harbor.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=80', includes: ['5 nights ocean riad', 'Kitesurf lessons', 'Hammam ritual', 'Seafood dinner', 'Argan grove visit'] },
]

const amenities = [
  { icon: 'hotel-bed-line', title: 'Private Courtyards', description: 'Every riad is organised around its own open-air inner courtyard â€” a room without a roof.' },
  { icon: 'water-flash-line', title: 'Zellige Hammam', description: 'A hammam warmed with cedar embers, with hand-cut tile, savon beldi, and argan oil rituals.' },
  { icon: 'restaurant-line', title: 'In-riad Kitchens', description: 'A house chef cooks tajines, msemen, and seasonal salads in traditional clay vessels.' },
  { icon: 'sparkling-2-line', title: 'Rooftop Terraces', description: 'Each riad opens onto a rooftop with cushions, lanterns, and shade for mint tea.' },
  { icon: 'plant-line', title: 'Orange & Olive Gardens', description: 'Sour orange, jasmine, pomegranate, and olive â€” the four classical courtyard plants.' },
  { icon: 'service-line', title: '24-hour House Staff', description: 'Every riad is staffed day and night by a resident team dedicated to your stay.' },
]

const testimonials = [
  { name: 'Isabelle Fontaine', role: 'Travel Editor, Paris', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80', review: 'Riad Zellige is the quietest place I have ever slept. The courtyard absorbs sound the way a Cistercian cloister does.', rating: 5 },
  { name: 'Daniel Okafor', role: 'Architect, Lagos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', review: 'Dar Andalusi is the finest restoration I have seen in the Maghreb. Every arch is honest, every tile is correct.', rating: 5 },
  { name: 'Yuki Tanaka', role: 'Ceramicist, Kyoto', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&q=80', review: 'The zellige workshop they arranged with a master tiler in Fes was the most moving afternoon of our trip.', rating: 5 },
  { name: 'Marco Vitale', role: 'Hotelier, Florence', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80', review: 'I own hotels and so I arrive as a critic. I left Riad Noor as a guest, properly humbled.', rating: 5 },
]

const blogPosts = [
  { id: 'zellige-craft', title: 'The geometry of zellige: why each tile is chipped by hand', excerpt: 'A master tiler in Fes explains why the hand-chipped edge catches light in a way no machine-cut tile can.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', date: 'April 14, 2026', category: 'Craft', readTime: 8, author: 'Salima Benhima' },
  { id: 'mint-tea', title: 'Mint tea is not a drink, it is an argument', excerpt: 'The pour, the height, the three glasses â€” every step of the ceremony has meaning.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', date: 'March 28, 2026', category: 'Culture', readTime: 5, author: 'Omar Tazi' },
  { id: 'riad-history', title: 'How the riad was invented: Moorish architecture after 711', excerpt: 'The Moroccan courtyard house is a direct descendant of Andalusian patio design.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', date: 'March 10, 2026', category: 'History', readTime: 12, author: 'Mehdi Laraki' },
  { id: 'hammam-guide', title: 'A first-timer\u2019s guide to the traditional hammam', excerpt: 'Two hours, black soap, a warm marble slab, and a complete stranger.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', date: 'February 22, 2026', category: 'Wellness', readTime: 6, author: 'Aicha Benhassi' },
  { id: 'medina-markets', title: 'Buying saffron in the Fes souk without getting cheated', excerpt: 'A short field guide to spice-market pricing and the five words of Darija that change everything.', image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=800&q=80', date: 'February 08, 2026', category: 'Travel', readTime: 7, author: 'Yassine El Idrissi' },
  { id: 'atlas-hike', title: 'The three-day trek to Jbel Toubkal from an Imlil riad', excerpt: 'North Africa\u2019s highest peak is closer than you think.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', date: 'January 19, 2026', category: 'Adventure', readTime: 10, author: 'Hakim Alaoui' },
]

const team = [
  { name: 'Salima Benhima', role: 'Founder & Curator', bio: 'A Fes-born architect who spent fifteen years restoring riads before founding Dar Zellige.', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80' },
  { name: 'Omar Tazi', role: 'Head of Hospitality', bio: 'Formerly of La Mamounia, Omar trains every riad team in the art of the slow welcome.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
  { name: 'Aicha Benhassi', role: 'Chef de Cuisine', bio: 'A seventh-generation Marrakshi cook who still grinds her spices on her grandmother\u2019s basalt slab.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80' },
  { name: 'Hakim Alaoui', role: 'Experiences Director', bio: 'A licensed mountain and medina guide who designs every cultural walk and trek.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
]

const whyUsFeatures = [
  { icon: 'award-line', title: 'Eleven restored riads', desc: 'Each with its own architect, its own history, and its own head of house.' },
  { icon: 'heart-line', title: 'Craft-led restoration', desc: 'Traditional tadelakt plaster, cedarwood carving, and hand-cut zellige. Never faked.' },
  { icon: 'service-line', title: 'Live-in staff', desc: 'Your butler, chef, and hammam attendant live on-site â€” not at a hotel across town.' },
  { icon: 'global-line', title: 'In three cities', desc: 'Marrakech, Fes, and Chefchaouen â€” move between them with our private drivers.' },
]

const stats = [
  { icon: 'hotel-line', value: '11', label: 'Restored Riads' },
  { icon: 'star-fill', value: '4.94', label: 'Guest Rating' },
  { icon: 'time-line', value: '7yrs', label: 'Avg. Restoration' },
  { icon: 'heart-3-line', value: '96%', label: 'Guest Return' },
]

const activityItems = [
  { id: 'hammam', icon: 'drop-line', label: 'Hammam', title: 'The Royal Hammam Ritual', desc: 'A ninety-minute ceremony: steam room, black-soap exfoliation, rhassoul clay, argan oil massage, and rose-water rinse.', tags: ['Savon beldi', 'Rhassoul', 'Argan', 'Mint tea'], image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80' },
  { id: 'cuisine', icon: 'restaurant-line', label: 'Cuisine', title: 'Courtyard Tajine Class', desc: 'Shop the spice souk at dawn with Chef Aicha, return to a riad courtyard, and spend three hours learning the architecture of a perfect tajine.', tags: ['Souk walk', 'Charcoal', 'Spice blending', 'Lunch'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80' },
  { id: 'craft', icon: 'hammer-line', label: 'Craft', title: 'Zellige & Calligraphy', desc: 'Spend an afternoon with a master tiler in Fes, then move to a Koranic calligraphy workshop.', tags: ['Tile-making', 'Kufic', 'Master guild', 'Keepsake'], image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' },
  { id: 'desert', icon: 'landscape-line', label: 'Desert', title: 'Erg Chebbi Dawn Ride', desc: 'A private camel trek from the dune base to the crest of Erg Chebbi before dawn.', tags: ['Camel trek', 'Sunrise', 'Berber camp', 'Silence'], image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1000&q=80' },
]

const faqs = [
  { q: 'Where exactly are the Dar Zellige riads located?', a: 'We operate eleven riads across three Moroccan cities: six in the Marrakech Medina and Palmeraie, three in Fes el-Bali, and two in Chefchaouen.' },
  { q: 'Can we book the whole riad for our group?', a: 'Yes. Every riad can be booked exclusively. Pricing is per riad per night, and a private chef, housekeeper, and butler are included.' },
  { q: 'Are children welcome?', a: 'Children are welcome at all properties except Dar Andalusi (adults-only due to steep 14th-century staircases).' },
  { q: 'Do you arrange airport transfers?', a: 'Private airport transfers are included in every booking of 3 nights or more.' },
  { q: 'Is the hammam ritual co-ed?', a: 'No. All hammam rituals are single-sex, in keeping with traditional Moroccan hammam practice.' },
  { q: 'How do I cancel or change my booking?', a: 'Free cancellation is available up to 48 hours before check-in for individual bookings, and 7 days for full-riad bookings.' },
]

const _MegaMenus = {
  stays: { heading: 'Riads by City', columns: [
    { title: 'Marrakech', links: [{ label: 'Riad Zellige', href: '/rooms' }, { label: 'Riad Zaitoune', href: '/rooms' }, { label: 'Dar Tadelakt', href: '/rooms' }] },
    { title: 'Fes', links: [{ label: 'Dar Andalusi', href: '/rooms' }, { label: 'Riad Talaa', href: '/rooms' }] },
    { title: 'Coast & North', links: [{ label: 'Riad Noor', href: '/rooms' }, { label: 'Dar Zaouia', href: '/rooms' }] },
  ], promo: { title: 'Private Buy-outs', desc: 'Book an entire palace for your family or retreat.', href: '/contact', cta: 'Request a quote', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c64e3a?auto=format&fit=crop&w=600&q=80' } },
}

const featuredRiads = (() => { const f = allRiads.filter(r => r.featured).slice(0, 3); return f.length === 3 ? f : allRiads.slice(0, 3) })()


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UTILITIES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Reveal({ children, className = '', as = 'div', delay = 0, ...rest }) {
  const [ref, visible] = useReveal(0.1)
  const Comp = as
  return (<Comp ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Comp>)
}

function BreadcrumbHero({ title, titleEm, crumbs, image }) {
  return (
    <section className="rd-breadhero">
      <div className="rd-breadhero__bg" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
      <div className="contain rd-breadhero__inner">
        <nav className="rd-breadhero__crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (<span key={c.label}>{i > 0 && <I name="arrow-right-s-line" />}{c.href ? <Link to={c.href}>{c.label}</Link> : <span>{c.label}</span>}</span>))}
        </nav>
        <h1>{title} {titleEm && <em>{titleEm}</em>}</h1>
      </div>
    </section>
  )
}

function HexBrandMark({ showText = true }) {
  return (
    <span className="rd-brand-2">
      <span className="rd-brand-2__hex" aria-hidden="true">
        <svg viewBox="0 0 44 44" fill="none"><path d="M22 2 L39 12 L39 32 L22 42 L5 32 L5 12 Z" fill="currentColor" /><path d="M22 7 L35 14.5 L35 29.5 L22 37 L9 29.5 L9 14.5 Z" stroke="rgba(255,255,255,.3)" strokeWidth="1" fill="none" /></svg>
        <span className="rd-brand-2__initials">DZ</span>
      </span>
      {showText && <span className="rd-brand-2__text"><span className="rd-brand-2__name">Dar Zellige</span><span className="rd-brand-2__tag">Restored Riads</span></span>}
    </span>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HEADER (floating island â€” kept from v2)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PRIMARY_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/rooms', label: 'Riads' },
  { to: '/packages', label: 'Packages' },
  { to: '/activities', label: 'Activities' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

function SiteHeader({ mode, setMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoverIdx, setHoverIdx] = useState(-1)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })
  const navRef = useRef(null)
  const linkRefs = useRef([])
  const toggleBtnRef = useRef(null)
  const location = useLocation()
  const prevPath = useRef(location.pathname)
  const [scrollPct, setScrollPct] = useState(0)

  const activeIdx = useMemo(() => {
    const exact = PRIMARY_NAV.findIndex(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))
    return exact
  }, [location.pathname])

  useEffect(() => { if (prevPath.current !== location.pathname) { prevPath.current = location.pathname; setMobileOpen(false) } }, [location.pathname])
  useEffect(() => { if (!mobileOpen) return; const h = (e) => { if (e.key === 'Escape') { setMobileOpen(false); toggleBtnRef.current?.focus() } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [mobileOpen])
  useEffect(() => { const h = () => { const d = document.documentElement; const t = d.scrollHeight - d.clientHeight; setScrollPct(t > 0 ? Math.min(100, (d.scrollTop / t) * 100) : 0) }; h(); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h) }, [])

  useEffect(() => {
    const targetIdx = hoverIdx !== -1 ? hoverIdx : activeIdx
    if (targetIdx < 0 || !linkRefs.current[targetIdx] || !navRef.current) { setIndicator(s => ({ ...s, visible: false })); return }
    const navRect = navRef.current.getBoundingClientRect()
    const linkRect = linkRefs.current[targetIdx].getBoundingClientRect()
    setIndicator({ left: linkRect.left - navRect.left, width: linkRect.width, visible: true })
  }, [hoverIdx, activeIdx])

  const cities = ['Marrakech', 'Fes', 'Chefchaouen', 'Essaouira', 'Rabat', 'Tangier', 'Meknes', 'TÃ©touan']

  return (
    <header className="rd-hdr-wrap">
      <div className="rd-hdr-strip">
        <div className="contain rd-hdr-strip__inner">
          <div className="rd-hdr-strip__left">
            <span className="rd-hdr-strip__badge"><I name="moon-clear-line" /> Eleven restored riads Â· est. 2019</span>
          </div>
          <div className="rd-hdr-strip__marquee" aria-hidden="true">
            <div className="rd-hdr-strip__marquee-track">{[...cities, ...cities].map((c, i) => <span key={`${c}-${i}`}>{c}</span>)}</div>
          </div>
          <div className="rd-hdr-strip__right">
            <a href="tel:+212524388812"><I name="phone-line" /> +212 524 388 812</a>
            <div className="rd-ms-mini" role="group" aria-label="Theme mode">
              {MODES.map(m => (<button key={m} type="button" className="rd-ms-mini__btn" aria-label={`${m} mode`} aria-pressed={mode === m} onClick={() => setMode(m)}><I name={MODE_ICONS[m]} /></button>))}
            </div>
          </div>
        </div>
      </div>

      <div className="rd-island">
        <div className="rd-island__inner">
          <Link to="/" aria-label="Dar Zellige home"><HexBrandMark /></Link>
          <nav ref={navRef} className="rd-nav-2" aria-label="Primary" onMouseLeave={() => setHoverIdx(-1)}>
            <span className={`rd-nav-2__pill-bg ${indicator.visible ? 'is-visible' : ''}`} style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} aria-hidden="true" />
            {PRIMARY_NAV.map((n, i) => (
              <NavLink key={n.to} to={n.to} end={n.end} ref={el => { linkRefs.current[i] = el }} className={({ isActive }) => `rd-nav-2__link ${isActive ? 'is-active' : ''}`} onMouseEnter={() => setHoverIdx(i)} onFocus={() => setHoverIdx(i)} onBlur={() => setHoverIdx(-1)}>{n.label}</NavLink>
            ))}
            <span className={`rd-nav-2__indicator ${indicator.visible ? 'is-visible' : ''}`} style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} aria-hidden="true" />
          </nav>
          <div className="rd-island__cta">
            <Link to="/booking" className="rd-btn rd-btn-primary rd-btn-sm"><I name="calendar-line" /> Book Now</Link>
            <button ref={toggleBtnRef} type="button" className="rd-mt-2" aria-expanded={mobileOpen} aria-label="Toggle navigation" onClick={() => setMobileOpen(v => !v)}><I name={mobileOpen ? 'close-line' : 'menu-3-line'} /></button>
          </div>
        </div>
      </div>

      <div className="rd-scroll-progress" aria-hidden="true"><div className="rd-scroll-progress__fill" style={{ '--rd-scroll': `${scrollPct}%` }} /></div>

      <div className={`rd-mobile-drawer ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="rd-mobile-drawer__head">
          <Link to="/"><HexBrandMark /></Link>
          <button type="button" className="rd-mobile-drawer__close" aria-label="Close menu" onClick={() => { setMobileOpen(false); toggleBtnRef.current?.focus() }}><I name="close-line" /></button>
        </div>
        <nav>{PRIMARY_NAV.map(n => <Link key={n.to} to={n.to}>{n.label}</Link>)}</nav>
        <Link to="/booking" className="rd-btn rd-btn-primary rd-btn-full"><I name="calendar-line" /> Book Your Stay</Link>
      </div>
    </header>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FOOTER (theatrical walnut â€” kept from v2)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Footer() {
  const year = new Date().getFullYear()
  const cities = ['Marrakech', 'Fes', 'Chefchaouen', 'Essaouira', 'Tangier', 'Meknes']
  return (
    <footer className="rd-ftr">
      <div className="rd-ftr__tess" aria-hidden="true" />
      <div className="rd-ftr__mq" aria-hidden="true"><div className="rd-ftr__mq-track">{[...cities, ...cities, ...cities].map((c, i) => <span key={`f-${c}-${i}`}>{c}</span>)}</div></div>
      <div className="contain rd-ftr__body">
        <div className="rd-ftr__head">
          <div>
            <span className="rd-ftr__head-eyebrow">Begin your journey</span>
            <p className="rd-ftr__tagline">Eleven restored Moroccan riads, each with its own <em>courtyard</em>, its own chef, and its own <em>seven-year story</em>.</p>
          </div>
          <div className="rd-ftr__news">
            <span className="rd-ftr__news-label">Letters from the medina</span>
            <h5>One careful <em>email</em> a month.<br />Nothing else.</h5>
            <form className="rd-ftr__news-form" onSubmit={e => e.preventDefault()}><input type="email" placeholder="your@email.com" aria-label="Email" /><button type="submit">Subscribe <I name="arrow-right-line" /></button></form>
          </div>
        </div>
        <div className="rd-ftr__cols">
          <div className="rd-ftr__col">
            <Link to="/" className="rd-ftr__brand-2"><HexBrandMark showText={false} /><strong>Dar Zellige</strong></Link>
            <p>A curated collection of restored Moroccan riads. Architecture, silence, and the slow ceremony of the courtyard.</p>
            <div className="rd-ftr__socials">
              <a href="#" aria-label="Instagram"><I name="instagram-line" /></a>
              <a href="#" aria-label="Facebook"><I name="facebook-line" /></a>
              <a href="#" aria-label="Pinterest"><I name="pinterest-line" /></a>
              <a href="#" aria-label="YouTube"><I name="youtube-line" /></a>
            </div>
          </div>
          <div className="rd-ftr__col"><span className="rd-ftr__col-head">Explore</span><ul><li><Link to="/rooms">Our Riads</Link></li><li><Link to="/packages">Packages</Link></li><li><Link to="/activities">Activities</Link></li><li><Link to="/about">Our Story</Link></li><li><Link to="/blog">The Journal</Link></li><li><Link to="/booking">Book a Stay</Link></li></ul></div>
          <div className="rd-ftr__col"><span className="rd-ftr__col-head">Cities</span><ul><li><Link to="/rooms"><i className="ri-map-pin-line" />Marrakech</Link></li><li><Link to="/rooms"><i className="ri-map-pin-line" />Fes el-Bali</Link></li><li><Link to="/rooms"><i className="ri-map-pin-line" />Chefchaouen</Link></li><li><Link to="/rooms"><i className="ri-map-pin-line" />Essaouira</Link></li></ul></div>
          <div className="rd-ftr__col"><span className="rd-ftr__col-head">Visit</span><ul><li><i className="ri-map-pin-line" />Derb Bouhsain 24, Marrakech</li><li><i className="ri-phone-line" /><a href="tel:+212524388812">+212 524 388 812</a></li><li><i className="ri-mail-line" /><a href="mailto:hello@darzellige.ma">hello@darzellige.ma</a></li><li><i className="ri-time-line" />Reception Â· 24h</li></ul></div>
        </div>
        <div className="rd-ftr__wordmark" aria-hidden="true"><span>Dar&nbsp;Zellige</span></div>
        <div className="rd-ftr__bottom">
          <span>Â© {year} Dar Zellige â€” A Collection of Restored Riads.</span>
          <div className="rd-ftr__crest"><I name="award-line" /> Preserving Moroccan craft</div>
          <nav className="rd-ftr__bottom-legal" aria-label="Legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></nav>
        </div>
      </div>
    </footer>
  )
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HOME PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const pauseRef = useRef(null)
  const [testIdx, setTestIdx] = useState(0)

  useEffect(() => { if (paused) return; const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 7000); return () => clearInterval(t) }, [paused])
  useEffect(() => { const t = setInterval(() => setTestIdx(i => (i + 1) % testimonials.length), 7000); return () => clearInterval(t) }, [])

  const pauseFor = () => { setPaused(true); clearTimeout(pauseRef.current); pauseRef.current = setTimeout(() => setPaused(false), 7000) }
  const gotoSlide = (n) => { setHeroIdx(((n % heroSlides.length) + heroSlides.length) % heroSlides.length); pauseFor() }
  const slide = heroSlides[heroIdx]

  return (
    <>
      {/* HERO */}
      <section className="rd-hero">
        <div className="rd-hero__bg">{heroSlides.map((s, i) => <img key={s.id} src={s.image} alt={`${s.title} ${s.titleEm}`} className={i === heroIdx ? '' : 'is-prev'} loading={i === 0 ? 'eager' : 'lazy'} />)}</div>
        <div className="rd-hero__overlay" />
        <div className="contain rd-hero__content">
          <p className="rd-hero__eyebrow">{slide.eyebrow}</p>
          <h1 className="rd-hero__title">{slide.title} <em>{slide.titleEm}</em></h1>
          <p className="rd-hero__sub">{slide.subtitle}</p>
          <div className="rd-hero__actions">
            <Link to={slide.ctaHref} className="rd-btn rd-btn-primary">{slide.ctaLabel} <I name="arrow-right-line" /></Link>
            <Link to="/about" className="rd-btn rd-btn-ghost" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>Our story</Link>
          </div>
        </div>
        <div className="rd-hero__controls contain">
          <div className="rd-hero__dots">{heroSlides.map((_, i) => <button key={i} type="button" className={`rd-hero__dot ${i === heroIdx ? 'is-active' : ''}`} onClick={() => gotoSlide(i)} aria-label={`Slide ${i + 1}`} />)}</div>
          <span className="rd-hero__counter"><strong>{String(heroIdx + 1).padStart(2, '0')}</strong> / {String(heroSlides.length).padStart(2, '0')}</span>
        </div>
        <div className="rd-hero__scroll"><span className="rd-hero__scroll-label">Scroll</span><span className="rd-hero__scroll-bar" /></div>
      </section>

      {/* FEATURED RIADS */}
      <section className="section contain">
        <Reveal className="section-heading"><p className="eyebrow">Featured Riads</p><h2>Three courtyards, three cities, three different mornings.</h2></Reveal>
        <Reveal className="rd-grid rd-grid--3">
          {featuredRiads.map(r => (
            <article key={r.id} className="rd-card">
              <Link to={`/rooms/${r.id}`} className="rd-card__img rd-card__img--arch"><img src={r.image} alt={`${r.name}, ${r.city}`} loading="lazy" /><span className="rd-card__badge">{r.badge}</span></Link>
              <div className="rd-card__body">
                <div className="rd-card__meta"><span>{r.category}</span><span className="rd-card__rating"><I name="star-fill" /> {r.rating}</span></div>
                <h3 className="rd-card__title"><Link to={`/rooms/${r.id}`}>{r.name}</Link></h3>
                <span className="rd-card__loc"><I name="map-pin-line" /> {r.city}</span>
                <div className="rd-card__footer"><div className="rd-card__price">{r.originalPrice && <span className="rd-card__price-was">${r.originalPrice}</span>}<strong>${r.price}</strong><small>/ night</small></div><Link to={`/rooms/${r.id}`} className="rd-btn rd-btn-ghost rd-btn-sm">Explore</Link></div>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      {/* BRAND STORY */}
      <section className="section contain">
        <Reveal className="rd-story">
          <div className="rd-story__imgwrap"><img src="https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=1000&q=80" alt="Courtyard fountain" loading="lazy" /><div className="rd-story__badge"><strong>07</strong><span>Years restoring</span></div></div>
          <div><p className="eyebrow">Our story</p><h2>Every riad we restore takes seven years.</h2><p style={{ marginTop: '1rem', lineHeight: 1.7 }}>Dar Zellige was founded by an architect from Fes who wanted to bring the slow, honest restoration practice to a small collection of riads. Real tadelakt, hand-cut zellige, carved cedar â€” everything patient, everything right.</p><div style={{ marginTop: '1.5rem' }}><Link to="/about" className="rd-btn rd-btn-primary">Read our story <I name="arrow-right-line" /></Link></div></div>
        </Reveal>
      </section>

      {/* EXPERIENCES PREVIEW */}
      <section className="section contain">
        <Reveal className="section-heading"><p className="eyebrow">Experiences</p><h2>Four ways to spend a Moroccan afternoon.</h2></Reveal>
        <Reveal className="rd-grid rd-grid--4">
          {experiences.slice(0, 4).map(e => (
            <article key={e.id} className="rd-act-card">
              <div className="rd-act-card__img"><img src={e.image} alt={e.title} loading="lazy" /><div className="rd-act-card__overlay"><span className="rd-act-card__pill"><I name="time-line" /> {e.duration}</span><span className="rd-act-card__pill"><I name="group-line" /> {e.groupSize}</span></div></div>
              <div className="rd-act-card__body"><span className="rd-act-card__cat">{e.category}</span><h3 className="rd-act-card__title">{e.title}</h3><p className="rd-act-card__desc">{e.excerpt}</p><div className="rd-act-card__footer"><span className="rd-act-card__price"><strong>${e.price}</strong> <small>/ person</small></span><Link to="/activities" className="rd-btn rd-btn-ghost rd-btn-sm">Details</Link></div></div>
            </article>
          ))}
        </Reveal>
      </section>

      {/* CTA BANNER */}
      <section className="rd-banner full-bleed">
        <div className="contain rd-banner__inner">
          <div><p className="eyebrow" style={{ color: 'rgba(255,255,255,.85)' }}>Private riad buy-outs</p><h2>Book an entire palace for your family, wedding, or retreat.</h2><p>Exclusive use from four nights. Dedicated chef, butler, and hammam attendant included.</p></div>
          <Link to="/contact" className="rd-btn rd-btn-white">Request a quote <I name="arrow-right-line" /></Link>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="section contain">
        <Reveal className="section-heading section-heading--center"><p className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>What you&apos;ll find inside</p><h2>Six things every Dar Zellige riad has.</h2></Reveal>
        <Reveal className="rd-amenities-grid">{amenities.map(a => (<div key={a.title} className="rd-amenity"><div className="rd-amenity__icon"><I name={a.icon} /></div><h4>{a.title}</h4><p>{a.description}</p></div>))}</Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="rd-testimonials full-bleed">
        <div className="contain"><div className="rd-testimonial-wrap">
          <p className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>In our guests&apos; words</p>
          <p className="rd-testimonial__text">{testimonials[testIdx].review}</p>
          <div className="rd-testimonial__person"><img src={testimonials[testIdx].avatar} alt={testimonials[testIdx].name} className="rd-testimonial__avatar" /><div style={{ textAlign: 'left' }}><div className="rd-testimonial__name">{testimonials[testIdx].name}</div><div className="rd-testimonial__role">{testimonials[testIdx].role}</div></div></div>
          <div className="rd-testimonial-dots">{testimonials.map((_, i) => <button key={i} type="button" aria-current={i === testIdx} aria-label={`Testimonial ${i + 1}`} onClick={() => setTestIdx(i)} />)}</div>
        </div></div>
      </section>

      {/* LATEST BLOG */}
      <section className="section contain">
        <Reveal className="section-heading"><p className="eyebrow">Latest from the journal</p><h2>Letters from the medina.</h2></Reveal>
        <Reveal className="rd-grid rd-grid--3">{blogPosts.slice(0, 3).map(p => (<article key={p.id} className="rd-card"><div className="rd-card__img rd-card__img--arch"><img src={p.image} alt={p.title} loading="lazy" /><span className="rd-card__badge">{p.category}</span></div><div className="rd-card__body"><div className="rd-card__meta"><span>{p.date}</span><span>{p.readTime} min</span></div><h3 className="rd-card__title"><Link to="/blog">{p.title}</Link></h3><p className="rd-card__excerpt">{p.excerpt}</p></div></article>))}</Reveal>
      </section>

      {/* NEWSLETTER */}
      <section className="section contain">
        <Reveal className="rd-newsletter"><p className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>Stay in touch</p><h2>Mint tea, once a month.</h2><p style={{ maxWidth: 520, marginInline: 'auto', marginTop: '.6rem' }}>One carefully-written letter from the medina each month.</p><form className="rd-newsletter__form" onSubmit={e => e.preventDefault()}><input type="email" placeholder="your@email.com" aria-label="Email" /><button type="submit" className="rd-btn rd-btn-primary">Subscribe</button></form></Reveal>
      </section>
    </>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RIADS PAGE (listings)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function RiadsPage() {
  const [sort, setSort] = useState('featured')
  const sorted = useMemo(() => { const a = [...allRiads]; if (sort === 'price-asc') a.sort((x, y) => x.price - y.price); else if (sort === 'price-desc') a.sort((x, y) => y.price - x.price); return a }, [sort])

  return (
    <>
      <BreadcrumbHero title="The" titleEm="Collection" crumbs={[{ label: 'Home', href: '/' }, { label: 'Riads' }]} image="https://images.unsplash.com/photo-1539020140153-e479b8c64e3a?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <div className="rd-sort-bar">
          <div className="rd-sort-bar__count"><strong>{sorted.length}</strong> riads across three cities</div>
          <div className="rd-sort-bar__options">{[{ id: 'featured', label: 'Curated' }, { id: 'price-asc', label: 'Price â†‘' }, { id: 'price-desc', label: 'Price â†“' }].map(o => <button key={o.id} type="button" className={sort === o.id ? 'is-active' : ''} onClick={() => setSort(o.id)}>{o.label}</button>)}</div>
        </div>
        <div className="rd-riad-row">
          {sorted.map(r => (
            <Reveal as="article" key={r.id} className="rd-riad-card">
              <Link to={`/rooms/${r.id}`} className="rd-riad-card__img"><img src={r.image} alt={`${r.name}, ${r.city}`} loading="lazy" />{r.badge && <span className="rd-riad-card__badge">{r.badge}</span>}</Link>
              <div className="rd-riad-card__body">
                <div className="rd-riad-card__meta"><span>{r.category}</span><span>Â·</span><span>{r.city}</span></div>
                <h3 className="rd-riad-card__title"><Link to={`/rooms/${r.id}`}>{r.name}</Link></h3>
                <span className="rd-riad-card__loc"><I name="map-pin-line" /> {r.address}</span>
                <div className="rd-riad-card__facts"><span><I name="hotel-bed-line" /> {r.beds} bedrooms</span><span><I name="group-line" /> Sleeps {r.capacity}</span><span><I name="ruler-line" /> {r.size} mÂ²</span></div>
                <div className="rd-riad-card__amens">{r.amenities.slice(0, 4).map((a, i) => <span key={a}><I name={a} /> {r.amenityLabels[i]}</span>)}</div>
                <span className="rd-riad-card__cancel"><I name="shield-check-line" /> {r.cancellation}</span>
              </div>
              <div className="rd-riad-card__side">
                <div className="rd-riad-card__rating"><I name="star-fill" /> {r.rating} <small>({r.reviews})</small></div>
                <div className="rd-riad-card__price">{r.originalPrice && <span className="rd-riad-card__was">${r.originalPrice}</span>}<strong>${r.price}</strong><small>per night</small></div>
                <Link to={`/rooms/${r.id}`} className="rd-btn rd-btn-primary">View details <I name="arrow-right-line" /></Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STAY DETAIL PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function StayDetailPage() {
  const { id } = useParams()
  const riad = allRiads.find(r => r.id === id) || allRiads[0]
  return (
    <>
      <section className="rd-stay-hero">
        <div className="rd-stay-hero__bg"><img src={riad.image} alt={riad.name} /></div>
        <div className="rd-stay-hero__overlay" />
        <div className="contain rd-stay-hero__content">
          <span className="rd-stay-hero__badge">{riad.badge}</span>
          <h1>{riad.name}</h1>
          <span className="rd-stay-hero__loc"><I name="map-pin-line" /> {riad.address}</span>
        </div>
      </section>
      <section className="section contain">
        <div className="rd-stay-detail">
          <div className="rd-stay-detail__main">
            <div><p className="eyebrow">{riad.category}</p><h2>{riad.name}</h2><p style={{ marginTop: '1rem', lineHeight: 1.7 }}>{riad.description}</p></div>
            <div className="rd-stay-detail__facts"><span className="rd-stay-detail__fact"><I name="hotel-bed-line" /> {riad.beds} bedrooms</span><span className="rd-stay-detail__fact"><I name="group-line" /> Sleeps {riad.capacity}</span><span className="rd-stay-detail__fact"><I name="ruler-line" /> {riad.size} mÂ²</span><span className="rd-stay-detail__fact"><I name="map-pin-line" /> {riad.city}</span></div>
            <div><h3>Highlights</h3><ul style={{ marginTop: '.8rem', display: 'grid', gap: '.5rem' }}>{riad.highlights.map(h => <li key={h} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'var(--text)' }}><I name="check-line" className="rd-card__rating" /> {h}</li>)}</ul></div>
            <div><h3>Amenities</h3><div className="rd-stay-detail__amenities" style={{ marginTop: '.8rem' }}>{riad.amenities.map((a, i) => <div key={a} className="rd-stay-detail__amenity"><I name={a} /> {riad.amenityLabels[i]}</div>)}</div></div>
            <div style={{ padding: '1.2rem', background: 'color-mix(in srgb, var(--accent), transparent 92%)', borderRadius: 'var(--rd-r-md)', display: 'flex', alignItems: 'center', gap: '.6rem' }}><I name="shield-check-line" className="rd-card__rating" /> <span style={{ fontSize: '.9rem' }}>{riad.cancellation}</span></div>
          </div>
          <aside className="rd-stay-sidebar">
            <div className="rd-stay-sidebar__card">
              <div className="rd-stay-sidebar__price">{riad.originalPrice && <del>${riad.originalPrice}</del>}<strong>${riad.price}</strong> <small>/ night</small></div>
              <div className="rd-stay-sidebar__rating"><I name="star-fill" /> {riad.rating} <small>Â· {riad.reviews} reviews</small></div>
              <Link to="/booking" className="rd-btn rd-btn-primary rd-btn-full" style={{ marginBottom: '1rem' }}>Book this riad <I name="arrow-right-line" /></Link>
              <Link to="/contact" className="rd-btn rd-btn-ghost rd-btn-full">Ask a question</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PACKAGES PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function PackagesPage() {
  return (
    <>
      <BreadcrumbHero title="Curated" titleEm="Packages" crumbs={[{ label: 'Home', href: '/' }, { label: 'Packages' }]} image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <Reveal className="section-heading"><p className="eyebrow">Multi-night journeys</p><h2>Packages designed for the unhurried traveller.</h2><p className="lede" style={{ marginTop: '1rem' }}>Each package combines our finest riads with curated experiences, private transfers, and a dedicated concierge.</p></Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {packages.map(pkg => (
            <Reveal key={pkg.id} className="rd-pkg-card">
              <div className="rd-pkg-card__img"><img src={pkg.image} alt={pkg.name} loading="lazy" /><span className="rd-pkg-card__badge">{pkg.badge}</span></div>
              <div className="rd-pkg-card__body">
                <div className="rd-pkg-card__meta"><span><I name="map-pin-line" /> {pkg.location}</span><span><I name="time-line" /> {pkg.duration}</span></div>
                <h3 className="rd-pkg-card__title">{pkg.name}</h3>
                <p className="rd-pkg-card__tagline">{pkg.tagline}</p>
                <p className="rd-pkg-card__desc">{pkg.description}</p>
                <div className="rd-pkg-card__includes">{pkg.includes.map(inc => <span key={inc}><I name="check-line" /> {inc}</span>)}</div>
                <div className="rd-pkg-card__footer"><div className="rd-pkg-card__price"><strong>${pkg.price.toLocaleString()}</strong><small>{pkg.pricePer}</small></div><Link to="/booking" className="rd-btn rd-btn-primary">Book package <I name="arrow-right-line" /></Link></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

function ActivitiesPage() {
  return (
    <>
      <BreadcrumbHero title="Moroccan" titleEm="Experiences" crumbs={[{ label: 'Home', href: '/' }, { label: 'Activities' }]} image="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <Reveal className="section-heading"><p className="eyebrow">Curated by locals</p><h2>Experiences that go beyond the guidebook.</h2></Reveal>
        <Reveal className="rd-grid rd-grid--3">
          {experiences.map(e => (
            <article key={e.id} className="rd-act-card">
              <div className="rd-act-card__img"><img src={e.image} alt={e.title} loading="lazy" /><div className="rd-act-card__overlay"><span className="rd-act-card__pill"><I name="time-line" /> {e.duration}</span><span className="rd-act-card__pill">{e.difficulty}</span></div></div>
              <div className="rd-act-card__body">
                <span className="rd-act-card__cat">{e.category}</span>
                <h3 className="rd-act-card__title">{e.title}</h3>
                <p className="rd-act-card__desc">{e.excerpt}</p>
                <div className="rd-act-card__footer"><span className="rd-act-card__price"><strong>${e.price}</strong> <small>/ person</small></span><Link to="/booking" className="rd-btn rd-btn-primary rd-btn-sm">Book <I name="arrow-right-line" /></Link></div>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
    </>
  )
}

function AboutPage() {
  const [tab, setTab] = useState(activityItems[0].id)
  const active = activityItems.find(a => a.id === tab) || activityItems[0]
  return (
    <>
      <BreadcrumbHero title="Our" titleEm="Story" crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <Reveal className="rd-about-intro">
          <div className="rd-story__imgwrap"><img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80" alt="Riad courtyard" loading="lazy" /><div className="rd-story__badge"><strong>07</strong><span>Year restorations</span></div></div>
          <div><p className="eyebrow">Craft first, always</p><h2>A small collection of Moroccan riads, restored the way they were built.</h2><p style={{ marginTop: '1rem', lineHeight: 1.7 }}>We believe a riad is a living building. Our restorations average seven years. Every property is restored in partnership with a local master-tiler, plasterer, and carpenter.</p></div>
        </Reveal>
      </section>
      <section className="section contain"><Reveal className="rd-stats-bar">{stats.map(s => <div key={s.label} className="rd-stat"><I name={s.icon} /><strong>{s.value}</strong><span>{s.label}</span></div>)}</Reveal></section>
      <section className="section contain">
        <Reveal className="section-heading section-heading--center"><p className="eyebrow" style={{ justifyContent:'center',display:'inline-flex' }}>Why our guests return</p><h2>Four commitments we never break.</h2></Reveal>
        <Reveal className="rd-why-grid">{whyUsFeatures.map(f => <div key={f.title} className="rd-why"><div className="rd-why__ic"><I name={f.icon} /></div><h4>{f.title}</h4><p>{f.desc}</p></div>)}</Reveal>
      </section>
      <section className="section contain">
        <Reveal className="section-heading section-heading--center"><p className="eyebrow" style={{ justifyContent:'center',display:'inline-flex' }}>What you can do</p><h2>Four Moroccan afternoons.</h2></Reveal>
        <Reveal>
          <div className="rd-tabs" role="tablist">{activityItems.map(a => <button key={a.id} role="tab" aria-selected={tab===a.id} className="rd-tab" type="button" onClick={() => setTab(a.id)}><I name={a.icon} /> {a.label}</button>)}</div>
          <div className="rd-tab-panel" role="tabpanel"><img src={active.image} alt={active.title} className="rd-tab-panel__img" /><div><p className="eyebrow">{active.label}</p><h3 style={{ fontSize:'clamp(1.4rem,3vw,2rem)',marginBottom:'.8rem' }}>{active.title}</h3><p style={{ lineHeight:1.7 }}>{active.desc}</p><div className="rd-tab-panel__tags">{active.tags.map(t => <span key={t}>{t}</span>)}</div></div></div>
        </Reveal>
      </section>
      <section className="section contain">
        <Reveal className="section-heading"><p className="eyebrow">The hosts</p><h2>The team who lives where you stay.</h2></Reveal>
        <Reveal className="rd-team-grid">{team.map(m => <div key={m.name} className="rd-team"><div className="rd-team__img-wrap"><img src={m.image} alt={m.name} loading="lazy" /></div><h4>{m.name}</h4><span>{m.role}</span><p>{m.bio}</p></div>)}</Reveal>
      </section>
    </>
  )
}

function BlogPage() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const categories = useMemo(() => ['All', ...new Set(blogPosts.map(p => p.category))], [])
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return blogPosts.filter(p => { const catOk = category === 'All' || p.category.toLowerCase() === category.toLowerCase(); const qOk = !q || (p.title + ' ' + p.excerpt).toLowerCase().includes(q); return catOk && qOk }) }, [category, query])
  return (
    <>
      <BreadcrumbHero title="The" titleEm="Journal" crumbs={[{ label: 'Home', href: '/' }, { label: 'Journal' }]} image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <div className="rd-blog-layout">
          <div>{filtered.length === 0 ? <div className="rd-empty"><I name="search-eye-line" />No posts match your filters.</div> : <Reveal className="rd-blog-grid">{filtered.map(p => <article key={p.id} className="rd-card"><div className="rd-card__img rd-card__img--arch"><img src={p.image} alt={p.title} loading="lazy" /><span className="rd-card__badge">{p.category}</span></div><div className="rd-card__body"><div className="rd-card__meta"><span>{p.date}</span><span>{p.readTime} min</span></div><h3 className="rd-card__title">{p.title}</h3><p className="rd-card__excerpt">{p.excerpt}</p><span className="rd-card__loc"><I name="user-line" /> {p.author}</span></div></article>)}</Reveal>}</div>
          <aside className="rd-blog-sidebar">
            <div className="rd-sidebar-card"><h5><I name="search-line" /> Search</h5><div className="rd-sidebar-search"><I name="search-2-line" /><input type="search" placeholder="Search articles..." maxLength={100} value={query} onChange={e => setQuery(e.target.value)} /></div></div>
            <div className="rd-sidebar-card"><h5><I name="folder-line" /> Categories</h5><div className="rd-cat-list">{categories.map(c => <button key={c} type="button" className={category===c?'is-active':''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
            <div className="rd-sidebar-card"><h5><I name="fire-line" /> Popular</h5><div className="rd-pop-list">{blogPosts.slice(0,4).map(p => <button key={p.id} className="rd-pop-item" type="button"><img src={p.image} alt={p.title} /><div><h6>{p.title.slice(0,50)}</h6><small>{p.date}</small></div></button>)}</div></div>
          </aside>
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const onChange = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = e => { e.preventDefault(); const errs = {}; Object.keys(form).forEach(k => { if (!form[k].trim()) errs[k] = 'Required.' }); if (!errs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email.'; setErrors(errs); if (Object.keys(errs).length) return; setSuccess(true); setForm({ name:'',email:'',subject:'',message:'' }); setTimeout(() => setSuccess(false), 6000) }
  return (
    <>
      <BreadcrumbHero title="Let us" titleEm="welcome you" crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <Reveal className="rd-contact-grid">
          <div className="rd-contact-info">
            <p className="eyebrow">Reach us directly</p><h2>Talk to the house.</h2>
            <div className="rd-contact-item"><div className="rd-contact-item__ic"><I name="map-pin-line" /></div><div><h5>Address</h5><p>Derb Bouhsain 24, Marrakech Medina 40000</p></div></div>
            <div className="rd-contact-item"><div className="rd-contact-item__ic"><I name="phone-line" /></div><div><h5>Hotline</h5><a href="tel:+212524388812">+212 524 388 812</a></div></div>
            <div className="rd-contact-item"><div className="rd-contact-item__ic"><I name="mail-line" /></div><div><h5>Email</h5><a href="mailto:hello@darzellige.ma">hello@darzellige.ma</a></div></div>
            <div className="rd-contact-item"><div className="rd-contact-item__ic"><I name="time-line" /></div><div><h5>Hours</h5><ul className="rd-contact-hours"><li><strong>Mon-Fri</strong><span>09:00-19:00</span></li><li><strong>Sat</strong><span>10:00-17:00</span></li><li><strong>Sun</strong><span>Reception only</span></li></ul></div></div>
          </div>
          <form className="rd-form" onSubmit={submit} noValidate>
            {success && <div className="rd-form__success"><I name="check-line" /> Thank you! We will reply within one working day.</div>}
            <div className="rd-form__row"><div><label>Name</label><input type="text" value={form.name} onChange={onChange('name')} placeholder="Full name" />{errors.name && <span className="rd-form__error">{errors.name}</span>}</div><div><label>Email</label><input type="email" value={form.email} onChange={onChange('email')} placeholder="your@email.com" />{errors.email && <span className="rd-form__error">{errors.email}</span>}</div></div>
            <div><label>Subject</label><input type="text" value={form.subject} onChange={onChange('subject')} placeholder="Stay enquiry" />{errors.subject && <span className="rd-form__error">{errors.subject}</span>}</div>
            <div><label>Message</label><textarea value={form.message} onChange={onChange('message')} placeholder="Tell us about your plans..." />{errors.message && <span className="rd-form__error">{errors.message}</span>}</div>
            <button type="submit" className="rd-btn rd-btn-primary">Send <I name="arrow-right-line" /></button>
          </form>
        </Reveal>
      </section>
      <section className="section contain">
        <Reveal className="section-heading section-heading--center"><p className="eyebrow" style={{ justifyContent:'center',display:'inline-flex' }}>Before you write</p><h2>Questions guests often ask.</h2></Reveal>
        <Reveal className="rd-faq-list">{faqs.map((f,i) => <div key={f.q} className={`rd-faq ${openFaq===i?'is-open':''}`}><button type="button" className="rd-faq__q" aria-expanded={openFaq===i} onClick={() => setOpenFaq(openFaq===i?null:i)}>{f.q}<I name="add-line" /></button><div className="rd-faq__a">{f.a}</div></div>)}</Reveal>
      </section>
      <section className="section contain"><Reveal className="rd-map"><iframe title="Dar Zellige location" src="https://www.openstreetmap.org/export/embed.html?bbox=-7.999%2C31.623%2C-7.975%2C31.635&layer=mapnik&marker=31.629%2C-7.987" loading="lazy" /></Reveal></section>
    </>
  )
}

function BookingPage() {
  const [step, setStep] = useState(0)
  const steps = ['Dates', 'Guests', 'Accommodation', 'Extras', 'Your Details', 'Confirm']
  return (
    <>
      <BreadcrumbHero title="Book Your" titleEm="Stay" crumbs={[{ label: 'Home', href: '/' }, { label: 'Booking' }]} image="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1800&q=80" />
      <section className="section contain">
        <div className="rd-booking-wizard">
          <div className="rd-booking-wizard__stepper">
            {steps.map((s, i) => (<><button key={s} type="button" className={`rd-booking-wizard__step ${i===step?'is-active':''} ${i<step?'is-done':''}`} onClick={() => i<=step && setStep(i)}><span className="rd-booking-wizard__step-num">{i+1}</span> {s}</button>{i<steps.length-1 && <span key={`l-${i}`} className="rd-booking-wizard__step-line" />}</>))}
          </div>
          <div className="rd-booking-wizard__body">
            <div className="rd-booking-wizard__main">
              {step===0 && <div><h3><I name="calendar-2-line" /> When are you visiting?</h3><p className="rd-wiz-desc">Select your dates and tell us about your group.</p><p style={{color:'var(--text-soft)',textAlign:'center',padding:'3rem 0'}}>Select check-in and check-out dates using the calendar.</p></div>}
              {step===1 && <div><h3><I name="group-line" /> Travellers</h3><p className="rd-wiz-desc">How many guests will be staying?</p><div className="rd-guest-row"><div className="rd-guest-row__info"><strong>Adults</strong><span>Ages 13+</span></div><div className="rd-guest-stepper"><button type="button">-</button><span className="rd-guest-stepper__val">2</span><button type="button">+</button></div></div><div className="rd-guest-row"><div className="rd-guest-row__info"><strong>Children</strong><span>Ages 2-12</span></div><div className="rd-guest-stepper"><button type="button">-</button><span className="rd-guest-stepper__val">0</span><button type="button">+</button></div></div></div>}
              {step===2 && <div><h3><I name="hotel-bed-line" /> Accommodation</h3><p className="rd-wiz-desc">Choose your riad or room.</p><div className="rd-room-options">{allRiads.slice(0,3).map(r => <div key={r.id} className="rd-room-opt"><img src={r.image} alt={r.name} className="rd-room-opt__img" /><h5>{r.name}</h5><p>{r.category} · {r.city}</p><div className="rd-room-opt__price">${r.price}/night</div></div>)}</div></div>}
              {step===3 && <div><h3><I name="sparkling-2-line" /> Extras & Services</h3><p className="rd-wiz-desc">Enhance your stay with optional add-ons.</p><div className="rd-extras-grid"><div className="rd-extra"><div className="rd-extra__check"><I name="check-line" /></div><div className="rd-extra__info"><h5>Airport Transfer</h5><p>Private car from Marrakech airport</p></div><span className="rd-extra__price">$45</span></div><div className="rd-extra"><div className="rd-extra__check"><I name="check-line" /></div><div className="rd-extra__info"><h5>Hammam Ritual</h5><p>90-minute traditional ceremony</p></div><span className="rd-extra__price">$140</span></div><div className="rd-extra"><div className="rd-extra__check"><I name="check-line" /></div><div className="rd-extra__info"><h5>Private Chef Dinner</h5><p>5-course Moroccan feast</p></div><span className="rd-extra__price">$95</span></div></div></div>}
              {step===4 && <div><h3><I name="user-line" /> Your Details</h3><p className="rd-wiz-desc">Tell us who is travelling.</p><div className="rd-wiz-form"><div className="rd-wiz-form__row"><div className="rd-wiz-field"><label>First Name</label><input type="text" placeholder="First name" /></div><div className="rd-wiz-field"><label>Last Name</label><input type="text" placeholder="Last name" /></div></div><div className="rd-wiz-field"><label>Email</label><input type="email" placeholder="your@email.com" /></div><div className="rd-wiz-field"><label>Phone</label><input type="tel" placeholder="+212..." /></div><div className="rd-wiz-field"><label>Special Requests</label><textarea placeholder="Dietary needs, celebrations, accessibility..." /></div></div></div>}
              {step===5 && <div><h3><I name="check-double-line" /> Confirm Booking</h3><p className="rd-wiz-desc">Review your selections and confirm.</p><div style={{padding:'2rem',textAlign:'center',color:'var(--text-soft)'}}><I name="checkbox-circle-line" className="rd-card__rating" style={{fontSize:'3rem',display:'block',marginBottom:'1rem'}} /><p>Your booking summary is ready. Click confirm to complete your reservation.</p></div></div>}
              <div className="rd-wiz-nav">
                {step > 0 && <button type="button" className="rd-btn rd-btn-ghost" onClick={() => setStep(s => s-1)}><I name="arrow-left-line" /> Back</button>}
                {step < steps.length-1 ? <button type="button" className="rd-btn rd-btn-primary" onClick={() => setStep(s => s+1)}>Continue <I name="arrow-right-line" /></button> : <button type="button" className="rd-btn rd-btn-primary">Confirm Booking <I name="check-line" /></button>}
              </div>
            </div>
            <div className="rd-booking-wizard__sidebar">
              <div className="rd-summary-card">
                <h4><I name="file-list-3-line" /> Booking Summary</h4>
                <div className="rd-summary-item"><span className="rd-summary-item__label"><I name="calendar-2-line" /> Stay Period</span><span className="rd-summary-item__value">Select dates</span></div>
                <div className="rd-summary-item"><span className="rd-summary-item__label"><I name="group-line" /> Guests</span><span className="rd-summary-item__value">2 adults</span></div>
                <div className="rd-summary-item"><span className="rd-summary-item__label"><I name="hotel-bed-line" /> Accommodation</span><span className="rd-summary-item__value" style={{color:'var(--text-soft)',fontStyle:'italic'}}>Not selected</span></div>
                <div className="rd-summary-total"><span><I name="information-line" /> Add items to see pricing</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function readStoredMode() { try { const v = window.localStorage.getItem(STORAGE_KEY); if (MODES.indexOf(v) === -1) { try { window.localStorage.setItem(STORAGE_KEY, 'light') } catch { /* */ } return 'light' } return v } catch { return 'light' } }

function AppShell() {
  const location = useLocation()
  const [mode, setMode] = useState(readStoredMode)
  useEffect(() => { document.body.dataset.mode = mode; document.documentElement.setAttribute('data-mode', mode); try { window.localStorage.setItem(STORAGE_KEY, mode) } catch { /* */ } }, [mode])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [location.pathname])
  const setModeSafe = useCallback(m => { if (MODES.indexOf(m) !== -1) setMode(m) }, [])
  return (
    <div className="rd-app-shell">
      <SiteHeader mode={mode} setMode={setModeSafe} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RiadsPage />} />
          <Route path="/rooms/:id" element={<StayDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppShell