import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function AnimatedNavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex overflow-hidden items-center text-sm"
      style={{ height: '1.25rem' }}
    >
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-400">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </Link>
  )
}

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [shapeClass, setShapeClass] = useState('rounded-full')
  const timerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isOpen) {
      setShapeClass('rounded-xl')
    } else {
      timerRef.current = setTimeout(() => setShapeClass('rounded-full'), 300)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isOpen])

  const navLinks = [
    { label: 'Rooms', to: '/accommodations' },
    { label: 'Activities', to: '/activities' },
    { label: 'Packages', to: '/packages' },
  ]

  if (!visible) return null

  return (
    <header
      className={`fixed top-6 left-1/2 z-50 flex flex-col items-center px-5 py-3 backdrop-blur-sm border border-[#ffffff20] bg-[rgba(10,8,6,0.80)] w-[calc(100%-2rem)] sm:w-auto transition-[border-radius] duration-300 ${shapeClass}`}
      style={{ transform: 'translateX(-50%)', maxWidth: '520px' }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between w-full gap-5 sm:gap-7">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
          <span style={{ color: 'var(--accent)', fontSize: '1.1rem', lineHeight: 1 }}>◈</span>
          <span
            className="text-white font-bold text-sm tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            azura
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-5">
          {navLinks.map(link => (
            <AnimatedNavLink key={link.to} to={link.to}>{link.label}</AnimatedNavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/packages"
          className="hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white rounded-full no-underline transition-opacity hover:opacity-85"
          style={{ background: 'var(--accent)' }}
        >
          Book Now
        </Link>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none flex-shrink-0"
          onClick={() => setIsOpen(v => !v)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden flex flex-col items-center w-full transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-3 w-full">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-300 hover:text-white text-sm transition-colors w-full text-center py-1 no-underline"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/packages"
          className="mt-4 w-full text-center px-4 py-2 text-sm font-semibold text-white rounded-full no-underline"
          style={{ background: 'var(--accent)' }}
          onClick={() => setIsOpen(false)}
        >
          Book Now
        </Link>
      </div>
    </header>
  )
}
