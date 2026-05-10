'use client'
import { useState, useEffect, useCallback } from 'react'
import styles from './HeroCarousel.module.css'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80',
    eyebrow: 'System Infrastructure',
    headline: 'Quantum\nComputing\nInterface.',
    sub: 'High-performance neural networks designed for next-generation scalability.',
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
    eyebrow: 'Global Network',
    headline: 'Deploy\nEdge\nNodes.',
    sub: 'Decentralized server architecture with sub-10ms latency worldwide.',
    align: 'center',
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
    eyebrow: 'Hardware Engineering',
    headline: 'Architect\nThe\nFuture.',
    sub: 'Precision-engineered components meeting the demands of modern developers.',
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80',
    eyebrow: 'Security Protocol',
    headline: 'Zero\nTrust\nSecurity.',
    sub: 'End-to-end encrypted tunnels protecting your most sensitive data assets.',
    align: 'right',
    sale: true,
  }
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 800)
  }, [animating])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 7000)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section className={styles.hero}>
      {slides.map((s, i) => (
        <div key={i} className={`${styles.slide} ${i === current ? styles.active : ''}`}>
          <img src={s.image} alt={s.headline} className={styles.slideImg} />
          <div className={styles.slideOverlay} />
        </div>
      ))}

      <div className={`${styles.content} ${styles[`align_${slide.align}`]}`}>
        <div className={styles.contentInner} key={current}>
          <span className={styles.eyebrow}>
            {(slide.sale || slide.online) && <span className={styles.saleDot} />}
            {slide.eyebrow}
          </span>
          <h1 className={styles.headline}>
            {slide.headline.split('\n').map((line, i) => (
              <span key={i} className={styles.headlineRow} style={{ animationDelay: `${i * 0.15}s` }}>
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.sub} style={{ animationDelay: '0.45s' }}>{slide.sub}</p>
        </div>
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
        <FiChevronLeft size={24} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>
        <FiChevronRight size={24} />
      </button>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className={styles.counter}>
        <span className={styles.counterCurrent}>{String(current + 1).padStart(2, '0')}</span>
        <span className={styles.counterSep} />
        <span className={styles.counterTotal}>{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}