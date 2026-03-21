'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CustomerNavbar.module.css'
import { FiMenu, FiX } from 'react-icons/fi'

const navLinks = [
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Tops',         href: '/#products' },
  { label: 'Bottoms',      href: '/#products' },
  { label: 'Dresses',      href: '/#products' },
  { label: 'Outerwear',    href: '/#products' },
  { label: 'Sale',         href: '/sale' },
]

export default function CustomerNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>

          {/* Left — links */}
          <div className={styles.navLeft}>
            {navLinks.slice(0, 3).map(link => (
              <Link key={link.label} href={link.href} className={styles.navLink}>{link.label}</Link>
            ))}
          </div>

          {/* Center — brand */}
          <Link href="/" className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <span className={styles.brandName}>UKAY</span>
            <span className={styles.brandSub}>STUDIO</span>
          </Link>

          {/* Right — links + hamburger */}
          <div className={styles.navRight}>
            {navLinks.slice(3).map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.navLink} ${link.label === 'Sale' ? styles.saleLink : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <button className={styles.drawerClose} onClick={() => setMenuOpen(false)}>
          <FiX size={22} />
        </button>
        <Link href="/" className={styles.drawerBrand}>
          <span className={styles.brandIcon}>✦</span> UKAY STUDIO
        </Link>
        <div className={styles.drawerLinks}>
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className={`${styles.drawerLink} ${link.label === 'Sale' ? styles.drawerSaleLink : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className={styles.drawerBackdrop} onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}