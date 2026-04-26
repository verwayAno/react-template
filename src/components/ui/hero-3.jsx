import { motion as Motion } from 'framer-motion'

const FADE_UP = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 95, damping: 18 } },
}

export function AnimatedMarqueeHero({
  tagline,
  title,
  description,
  ctaText,
  onCtaClick,
  images = [],
}) {
  const doubled = [...images, ...images]

  return (
    <section className="azm-hero">
      {/* Centered text block */}
      <div className="azm-hero__content">
        <Motion.div
          className="azm-tagline"
          initial="hidden"
          animate="show"
          variants={FADE_UP}
        >
          {tagline}
        </Motion.div>

        <Motion.h1
          className="azm-hero__h1"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.12 }}
        >
          {title}
        </Motion.h1>

        <Motion.p
          className="azm-hero__p"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.28 }}
        >
          {description}
        </Motion.p>

        <Motion.button
          className="azm-hero__btn"
          onClick={onCtaClick}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.44 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          {ctaText}
        </Motion.button>
      </div>

      {/* Scrolling image marquee */}
      <div className="azm-marquee">
        <Motion.div
          className="azm-marquee__track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 35, repeat: Infinity }}
        >
          {doubled.map((src, i) => (
            <div
              key={i}
              className="azm-marquee__card"
              style={{
                transform: `rotate(${['-3deg', '2.5deg', '-1.5deg', '3.5deg', '-2deg'][i % 5]})`,
              }}
            >
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
