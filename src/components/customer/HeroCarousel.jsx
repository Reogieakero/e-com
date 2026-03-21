'use client'
import { useState, useEffect, useCallback } from 'react'
import styles from './HeroCarousel.module.css'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    eyebrow: 'New Arrivals',
    headline: 'Find Your\nSignature\nPiece.',
    sub: 'Curated pre-loved fashion — handpicked for quality and style.',
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    eyebrow: 'Summer Edit',
    headline: 'Effortless\nStyle,\nEvery Day.',
    sub: 'Light fabrics, bold looks. Refresh your wardrobe this season.',
    align: 'center',
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
    eyebrow: 'Trending Now',
    headline: 'Pre-Loved\nNever Looked\nThis Good.',
    sub: 'Sustainable fashion that tells a story. Shop consciously.',
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
    eyebrow: 'Up to 70% Off',
    headline: 'Sale\nSeason\nIs Here.',
    sub: 'Major markdowns on top picks. Limited pieces available.',
    align: 'right',
    sale: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80',
    eyebrow: 'The Essentials',
    headline: 'Build a\nWardrobe\nThat Lasts.',
    sub: 'Timeless pieces at accessible prices. Quality over quantity.',
    align: 'left',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section className={styles.hero}>
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
        >
          <img src={s.image} alt={s.headline} className={styles.slideImg} />
          <div className={styles.slideOverlay} />
        </div>
      ))}

      {/* Content */}
      <div className={`${styles.content} ${styles[`align_${slide.align}`]}`}>
        <div className={styles.contentInner} key={current}>
          <span className={styles.eyebrow}>
            {slide.sale && <span className={styles.saleDot} />}
            {slide.eyebrow}
          </span>
          <h1 className={styles.headline}>
            {slide.headline.split('\n').map((line, i) => (
              <span key={i} className={styles.headlineRow} style={{ animationDelay: `${i * 0.1}s` }}>
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.sub} style={{ animationDelay: '0.35s' }}>{slide.sub}</p>        </div>
      </div>

      {/* Arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
        <FiChevronLeft size={22} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>
        <FiChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className={styles.counter}>
        <span className={styles.counterCurrent}>{String(current + 1).padStart(2, '0')}</span>
        <span className={styles.counterSep} />
        <span className={styles.counterTotal}>{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}