'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CustomerNavbar.module.css'
import { FiMenu, FiX, FiCpu } from 'react-icons/fi'

const navLinks = [
  { label: 'Laptops', href: '/#products' },
  { label: 'PC Components', href: '/#products' },
  { label: 'Peripherals', href: '/#products' },
  { label: 'Mobile Phones', href: '/#products' },
  { label: 'Software', href: '/#products' },
  { label: 'Sale', href: '/sale' },
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
          <div className={styles.navLeft}>
            {navLinks.slice(0, 3).map(link => (
              <Link key={link.label} href={link.href} className={styles.navLink}>{link.label}</Link>
            ))}
          </div>

          <Link href="/" className={styles.brand}>
            <span className={styles.brandIcon}><FiCpu /></span>
            <span className={styles.brandName}>Tech</span>
            <span className={styles.brandSub}>STUDIO</span>
          </Link>

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

      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <button className={styles.drawerClose} onClick={() => setMenuOpen(false)}>
          <FiX size={22} />
        </button>
        <Link href="/" className={styles.drawerBrand}>
          <span className={styles.brandIcon}><FiCpu /></span> Tech Catalog
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