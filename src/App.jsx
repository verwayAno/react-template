import { useEffect, useState } from 'react'
import './App.css'
import heroSuite from './assets/rivora/hero-suite.svg'
import roomStandard from './assets/rivora/room-standard.svg'
import roomSuperior from './assets/rivora/room-superior.svg'
import roomExecutive from './assets/rivora/room-executive.svg'
import featureLounge from './assets/rivora/feature-lounge.svg'
import facilitiesLounge from './assets/rivora/facilities-lounge.svg'
import conciergeImage from './assets/rivora/concierge.svg'
import offerRomantic from './assets/rivora/offer-romantic.svg'
import offerEarlybird from './assets/rivora/offer-earlybird.svg'
import offerFamily from './assets/rivora/offer-family.svg'
import videoSuite from './assets/rivora/video-suite.svg'
import articleCity from './assets/rivora/article-city.svg'
import articleDesign from './assets/rivora/article-design.svg'
import articlePool from './assets/rivora/article-pool.svg'
import articleLaptop from './assets/rivora/article-laptop.svg'

const heroSlides = [
  {
    title: 'Experience Comfort, Style, and Luxury in Every Stay',
    description:
      'Premium hospitality wrapped in warm interiors, curated services, and unforgettable moments.',
    image: heroSuite,
  },
  {
    title: 'A Rivora Escape Designed for Rest and Refined Living',
    description:
      'Wake up to elegant details, serene views, and spaces tailored for modern travelers.',
    image: facilitiesLounge,
  },
  {
    title: 'Elevated Stays for Couples, Families, and Weekend Retreats',
    description:
      'From immersive suites to signature offers, Rivora turns every booking into an experience.',
    image: videoSuite,
  },
]

const rooms = [
  {
    title: 'Standard Room',
    image: roomStandard,
    description:
      'Smartly designed comfort with warm timber finishes, ambient lighting, and thoughtful essentials.',
    guests: '2 Guests',
    beds: '1 King Bed',
    size: '35 m²',
    price: '$108',
  },
  {
    title: 'Superior Room',
    image: roomSuperior,
    description:
      'A sophisticated room featuring a spa-style bathroom, lounge corner, and airy contemporary styling.',
    guests: '3 Guests',
    beds: '1 Queen Bed',
    size: '42 m²',
    price: '$129',
  },
  {
    title: 'Executive Room',
    image: roomExecutive,
    description:
      'An elevated suite experience with generous space, layered textures, and premium in-room amenities.',
    guests: '2 Guests',
    beds: '1 King Bed',
    size: '52 m²',
    price: '$149',
  },
]

const offers = [
  {
    title: 'Romantic Stay',
    image: offerRomantic,
    description: '2 Night / Candlelight Dinner Package',
    badge: '25% OFF',
  },
  {
    title: 'Early Bird Deal',
    image: offerEarlybird,
    description: 'Reserve 15 Days Earlier',
    badge: 'BEST VALUE',
  },
  {
    title: 'Family Getaway',
    image: offerFamily,
    description: '3 Day Stay / Kids Free',
    badge: 'POPULAR',
  },
]

const articles = [
  {
    date: '29 Jan',
    title: 'Top Hotel Amenities That Guests Value in 2026',
    image: articleCity,
  },
  {
    date: '28 Jan',
    title: 'Design Trends Shaping Modern Hotel Interiors',
    image: articleDesign,
  },
  {
    date: '26 Jan',
    title: 'What Makes a Hotel Stay Truly Memorable?',
    image: articlePool,
  },
  {
    date: '28 Jan',
    title: '5 Tips to Get the Best Hotel Deals Online',
    image: articleLaptop,
  },
]

const faqs = [
  'What time is check-in and check-out?',
  'Do you offer airport pickup or shuttle service?',
  'Are pets allowed in the hotel?',
  'Do you have free Wi‑Fi?',
  'What facilities are available for guests?',
  'Do you offer breakfast?',
]

const stats = [
  { label: 'Luxury rooms', value: '180+' },
  { label: 'Happy guests', value: '8500+' },
  { label: 'Award wins', value: '65+' },
]

const answers = {
  'What time is check-in and check-out?':
    'Check-in begins at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out are available on request.',
  'Do you offer airport pickup or shuttle service?':
    'Yes. Rivora offers private airport pickup and city transfer services that can be arranged during booking or through the concierge.',
  'Are pets allowed in the hotel?':
    'Selected suites are pet-friendly. Please contact the hotel before arrival so we can prepare the room accordingly.',
  'Do you have free Wi‑Fi?':
    'Complimentary high-speed Wi‑Fi is available throughout guest rooms, lounges, and public spaces.',
  'What facilities are available for guests?':
    'Guests enjoy access to the wellness spa, fitness studio, all-day dining, curated lounge spaces, meeting rooms, and concierge support.',
  'Do you offer breakfast?':
    'Yes. A signature breakfast experience is included in selected packages and can also be added to any stay.',
}

function App() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  const currentSlide = heroSlides[activeSlide]

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Rivora home">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span>rivora</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#top">Home</a>
          <a href="#rooms">Rooms</a>
          <a href="#facilities">Pages</a>
          <a href="#offers">Blog</a>
          <a href="#footer">Contact</a>
        </nav>

        <a className="pill-button" href="#booking">
          Reservation
        </a>
      </header>

      <main>
        <section className="hero-section" id="top">
          <div
            className="hero-card"
            style={{ backgroundImage: `linear-gradient(rgba(44, 29, 19, 0.33), rgba(44, 29, 19, 0.45)), url(${currentSlide.image})` }}
          >
            <button
              className="hero-arrow hero-arrow-left"
              type="button"
              aria-label="Previous slide"
              onClick={() =>
                setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)
              }
            >
              ‹
            </button>

            <div className="hero-copy">
              <p className="eyebrow">Luxury Hotel Experience</p>
              <h1>{currentSlide.title}</h1>
              <p className="hero-description">{currentSlide.description}</p>
            </div>

            <div className="hero-dots" aria-label="Slide pagination">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={index === activeSlide ? 'hero-dot active' : 'hero-dot'}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>

            <button
              className="hero-arrow hero-arrow-right"
              type="button"
              aria-label="Next slide"
              onClick={() => setActiveSlide((current) => (current + 1) % heroSlides.length)}
            >
              ›
            </button>
          </div>

          <form className="booking-card" id="booking">
            <div className="booking-field">
              <label htmlFor="checkin">Check in</label>
              <input id="checkin" type="date" defaultValue="2026-04-23" />
            </div>
            <div className="booking-field">
              <label htmlFor="checkout">Check out</label>
              <input id="checkout" type="date" defaultValue="2026-04-26" />
            </div>
            <div className="booking-field booking-counter">
              <label htmlFor="adults">Adults</label>
              <select id="adults" defaultValue="2">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="booking-field booking-counter">
              <label htmlFor="children">Children</label>
              <select id="children" defaultValue="0">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <button className="booking-submit" type="submit">
              Check Availability
            </button>
          </form>
        </section>

        <section className="section intro-section" id="rooms">
          <p className="section-tag">Stay With Rivora</p>
          <h2>Explore Room</h2>
          <p className="section-description">
            Discover a collection of serene suites crafted for comfort, privacy, and memorable stays.
          </p>

          <div className="room-list">
            {rooms.map((room) => (
              <article className="room-card" key={room.title}>
                <img className="room-image" src={room.image} alt={room.title} loading="lazy" />
                <div className="room-content">
                  <div className="room-main">
                    <div className="rating">★★★★★</div>
                    <h3>{room.title}</h3>
                    <p>{room.description}</p>
                  </div>
                  <ul className="room-meta" aria-label={`${room.title} highlights`}>
                    <li>{room.guests}</li>
                    <li>{room.beds}</li>
                    <li>{room.size}</li>
                  </ul>
                  <div className="room-action">
                    <strong>
                      {room.price}
                      <span>/night</span>
                    </strong>
                    <a href="#booking">Book now</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section feature-banner">
          <div className="feature-overlay" style={{ backgroundImage: `linear-gradient(rgba(61, 38, 18, 0.6), rgba(61, 38, 18, 0.48)), url(${featureLounge})` }}>
            <div className="score-block">
              <span>4.9</span>
              <p>2200+ Reviews</p>
            </div>
            <div className="feature-copy">
              <p className="section-tag light">Awarded</p>
              <h2>Exceptional hospitality and comfort. The perfect choice for relaxing and refreshing getaways.</h2>
              <p>Crafted for guests who appreciate elegant spaces and attentive service.</p>
            </div>
          </div>
        </section>

        <section className="section facilities-section" id="facilities">
          <p className="section-tag">Welcome to Grand Stay</p>
          <h2>Hotel Facilities</h2>
          <p className="section-description">
            Rivora combines refined interiors with warm service and curated experiences in every corner.
          </p>

          <div className="facilities-grid">
            <div className="facilities-visual">
              <img
                src={facilitiesLounge}
                alt="Rivora lounge"
                loading="lazy"
              />
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <p>{stat.label}</p>
                  <strong>{stat.value}</strong>
                </article>
              ))}
              <article className="stat-card image-card">
                <img
                  src={conciergeImage}
                  alt="Guest support"
                  loading="lazy"
                />
              </article>
            </div>
          </div>
        </section>

        <section className="section offers-section" id="offers">
          <p className="section-tag">Exclusive Deals</p>
          <h2>Latest Hotel Offers</h2>

          <div className="offers-grid">
            {offers.map((offer) => (
              <article className="offer-card" key={offer.title}>
                <img src={offer.image} alt={offer.title} loading="lazy" />
                <span className="offer-badge">{offer.badge}</span>
                <div className="offer-copy">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <a href="#booking">Book now</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-section">
          <div className="faq-intro">
            <p className="section-tag">FAQ</p>
            <h2>Everything You Need to Know About Staying With Us</h2>
          </div>

          <div className="faq-list">
            {faqs.map((question, index) => {
              const isOpen = openFaq === index

              return (
                <article className={isOpen ? 'faq-item open' : 'faq-item'} key={question}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    <span>{question}</span>
                    <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p>{answers[question]}</p>}
                </article>
              )
            })}
          </div>
        </section>

        <section className="section video-section">
          <div className="video-frame">
            <img
              src={videoSuite}
              alt="Luxury Rivora suite"
            />
            <button className="play-button" type="button" aria-label="Play Rivora introduction video">
              ▶
            </button>
          </div>
        </section>

        <section className="section blog-section">
          <p className="section-tag">Our Blog</p>
          <h2>News &amp; Articles</h2>

          <div className="articles-grid">
            {articles.map((article) => (
              <article className="article-card" key={article.title}>
                <div className="article-image-wrap">
                  <img src={article.image} alt={article.title} loading="lazy" />
                  <span className="article-date">{article.date}</span>
                </div>
                <h3>{article.title}</h3>
                <p>
                  Discover hospitality insights, thoughtful travel ideas, and curated inspiration from Rivora.
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div>
          <p className="footer-label">Address</p>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">
            2464 Royal Lane
          </a>
          <p>Brooklyn, NY 11206</p>
        </div>
        <div className="footer-brand">
          <a className="brand brand-light" href="#top">
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            <span>rivora</span>
          </a>
          <div className="footer-socials" aria-label="Social links">
            <a href="https://facebook.com" aria-label="Facebook">
              f
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              i
            </a>
            <a href="https://x.com" aria-label="X">
              x
            </a>
            <a href="https://pinterest.com" aria-label="Pinterest">
              p
            </a>
          </div>
          <p>Copyright © 2026 — Rivora by React Vite</p>
        </div>
        <div>
          <p className="footer-label">Contact Us</p>
          <a href="tel:+12125550147">(+1) 212 555 0147</a>
          <a href="mailto:booking@rivora.com">booking@rivora.com</a>
        </div>
      </footer>
    </div>
  )
}

export default App
