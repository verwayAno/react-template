import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

export function CircularGallery({
  images,
  badge,
  backContent,
  autoPlayInterval = 5000,
}) {
  const [opened, setOpened]     = useState(0)
  const [inPlace, setInPlace]   = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [gsapReady, setGsapReady] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [lbIdx, setLbIdx]       = useState(0)
  const autoplayTimer = useRef(null)

  useEffect(() => {
    if (window.gsap && window.MotionPathPlugin) {
      window.gsap.registerPlugin(window.MotionPathPlugin)
      setGsapReady(true)
      return
    }
    const gsapScript = document.createElement('script')
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'
    gsapScript.onload = () => {
      const mpScript = document.createElement('script')
      mpScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js'
      mpScript.onload = () => {
        if (window.gsap && window.MotionPathPlugin) {
          window.gsap.registerPlugin(window.MotionPathPlugin)
          setGsapReady(true)
        }
      }
      document.body.appendChild(mpScript)
    }
    document.body.appendChild(gsapScript)
  }, [])

  const handleTabClick = (index) => { if (!disabled) setOpened(index) }
  const onInPlace = (index) => setInPlace(index)

  const next = useCallback(() => {
    setOpened((cur) => (cur + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setOpened((cur) => (cur - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => { setDisabled(true) }, [opened])
  useEffect(() => { setDisabled(false) }, [inPlace])

  useEffect(() => {
    if (!gsapReady) return
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = window.setInterval(next, autoPlayInterval)
    return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current) }
  }, [opened, gsapReady, next, autoPlayInterval])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft')  setLbIdx(cur => (cur - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setLbIdx(cur => (cur + 1) % images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, images.length])

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const openLightbox = () => { setLbIdx(inPlace); setLightbox(true) }

  return (
    <>
      <div className="cg-section">
        <div className="cg-container">
          {!gsapReady && images.length > 0 && (
            <img src={images[0].url} alt="" className="cg-fallback" />
          )}
          {gsapReady && images.map((image, i) => (
            <div key={i} className="cg-slide"
              style={{ zIndex: inPlace === i ? i : images.length + 1 }}>
              <CGImage total={images.length} id={i} url={image.url}
                title={image.title || ''} open={opened === i}
                inPlace={inPlace === i} onInPlace={onInPlace} />
            </div>
          ))}
          <div className="cg-tabs">
            <CGTabs images={images} onSelect={handleTabClick} />
          </div>
        </div>

        <button className="cg-nav cg-nav--prev" onClick={prev} disabled={disabled} aria-label="Previous image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="cg-nav cg-nav--next" onClick={next} disabled={disabled} aria-label="Next image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {badge && <div className="rd-gallery__badge">{badge}</div>}
        {backContent && <div className="rd-gallery__back">{backContent}</div>}

        <div className="cg-bottom-bar">
          <span className="cg-counter">{opened + 1} / {images.length}</span>
          <button className="cg-expand-btn" onClick={openLightbox} aria-label="View full screen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          </button>
        </div>
      </div>

      {lightbox && createPortal(
        <div className="cg-lb" onClick={() => setLightbox(false)}>
          <div className="cg-lb__inner" onClick={e => e.stopPropagation()}>
            <button className="cg-lb__close" onClick={() => setLightbox(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="cg-lb__main">
              <img key={lbIdx} src={images[lbIdx]?.url} alt={images[lbIdx]?.title || ''} className="cg-lb__img" />
            </div>
            <button className="cg-lb__nav cg-lb__nav--prev"
              onClick={() => setLbIdx(cur => (cur - 1 + images.length) % images.length)} aria-label="Previous">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="cg-lb__nav cg-lb__nav--next"
              onClick={() => setLbIdx(cur => (cur + 1) % images.length)} aria-label="Next">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <div className="cg-lb__footer">
              <span className="cg-lb__count">{lbIdx + 1} / {images.length}</span>
              <div className="cg-lb__thumbs">
                {images.map((img, i) => (
                  <button key={i} className={"cg-lb__thumb" + (i === lbIdx ? " cg-lb__thumb--active" : "")} onClick={() => setLbIdx(i)}>
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function CGImage({ url, open, inPlace, id, onInPlace, total }) {
  const [firstLoad, setFirstLoad] = useState(true)
  const clip = useRef(null)

  const gap = 10
  const r   = 7
  const dur = 0.4
  const W   = 1200
  const H   = 675
  const bigSize = r * 700

  const dotX = (i) => W / 2 - (total * (r * 2 + gap) - gap) / 2 + i * (r * 2 + gap)

  const posSmall      = () => ({ cx: dotX(id),        cy: H - 30,  r })
  const posSmallAbove = () => ({ cx: dotX(id),        cy: H / 2,   r: r * 2 })
  const posCenter     = () => ({ cx: W / 2,           cy: H / 2,   r: r * 7 })
  const posEnd        = () => ({ cx: W / 2 - bigSize, cy: H / 2,   r: bigSize })
  const posStart      = () => ({ cx: W / 2 + bigSize, cy: H / 2,   r: bigSize })

  useEffect(() => {
    const gsap = window.gsap
    if (!gsap || !clip.current) return
    const fl = firstLoad
    setFirstLoad(false)
    const flipDur   = fl ? 0 : dur
    const upDur     = fl ? 0 : 0.2
    const bounceDur = fl ? 0.01 : 1
    const delay     = fl ? 0 : flipDur + upDur
    const to        = { transformOrigin: 'center center' }
    if (open) {
      gsap.timeline()
        .set(clip.current, { ...to, ...posSmall() })
        .to(clip.current,  { ...to, ...posCenter(), duration: upDur, ease: 'power3.inOut' })
        .to(clip.current,  { ...to, ...posEnd(), duration: flipDur, ease: 'power4.in',
            onComplete: () => onInPlace(id) })
    } else {
      gsap.timeline({ overwrite: true })
        .set(clip.current, { ...to, ...posStart() })
        .to(clip.current,  { ...to, ...posCenter(), delay, duration: flipDur, ease: 'power4.out' })
        .to(clip.current,  { ...to,
            motionPath: { path: [posSmallAbove(), posSmall()], curviness: 1 },
            duration: bounceDur, ease: 'bounce.out' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={"0 0 " + W + " " + H} preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={"cg_" + id + "_cc"}><circle cx="0" cy="0" r={r} ref={clip} /></clipPath>
        <clipPath id={"cg_" + id + "_sc"}><rect width={W} height={H} /></clipPath>
      </defs>
      <g clipPath={"url(#cg_" + id + (inPlace ? "_sc" : "_cc") + ")"}>
        <image width={W} height={H} href={url} preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: 'none' }} />
      </g>
    </svg>
  )
}

function CGTabs({ images, onSelect }) {
  const gap = 10
  const r   = 7
  const W   = 1200
  const H   = 675

  const dotX = (i) => W / 2 - (images.length * (r * 2 + gap) - gap) / 2 + i * (r * 2 + gap)

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={"0 0 " + W + " " + H} preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}>
      {images.map((image, i) => (
        <g key={i} style={{ pointerEvents: 'auto' }}>
          <defs>
            <clipPath id={"cg_tab_" + i}><circle cx={dotX(i)} cy={H - 30} r={r} /></clipPath>
          </defs>
          <image x={dotX(i) - r} y={H - 30 - r} width={r * 2} height={r * 2}
            href={image.url} clipPath={"url(#cg_tab_" + i + ")"} style={{ pointerEvents: 'none' }}
            preserveAspectRatio="xMidYMid slice" />
          <circle onClick={() => onSelect(i)}
            style={{ cursor: 'pointer', fill: 'rgba(255,255,255,0)', stroke: 'rgba(255,255,255,0.7)' }}
            strokeWidth="2" cx={dotX(i)} cy={H - 30} r={r + 2} />
        </g>
      ))}
    </svg>
  )
}
