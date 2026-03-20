'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CustomerNavbar.module.css'
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiHeart } from 'react-icons/fi'

const navLinks = ['New Arrivals', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Sale']

export default function CustomerNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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
              <Link key={link} href="#products" className={styles.navLink}>{link}</Link>
            ))}
          </div>

          {/* Center — brand */}
          <Link href="/" className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <span className={styles.brandName}>UKAY</span>
            <span className={styles.brandSub}>STUDIO</span>
          </Link>

          {/* Right — links + icons */}
          <div className={styles.navRight}>
            {navLinks.slice(3).map(link => (
              <Link key={link} href="#products" className={`${styles.navLink} ${link === 'Sale' ? styles.saleLink : ''}`}>
                {link}
              </Link>
            ))}
            <button className={styles.iconBtn} onClick={() => setSearchOpen(!searchOpen)}><FiSearch size={18} /></button>
            <button className={styles.iconBtn}><FiHeart size={18} /></button>
            <button className={styles.iconBtn}>
              <FiShoppingBag size={18} />
              <span className={styles.cartBadge}>0</span>
            </button>
            <button className={styles.hamburger} onClick={() => setMenuOpen(true)}><FiMenu size={22} /></button>
          </div>
        </div>

        {/* Search bar drop */}
        <div className={`${styles.searchBar} ${searchOpen ? styles.searchOpen : ''}`}>
          <div className={styles.searchInner}>
            <FiSearch size={16} />
            <input placeholder="Search for pieces…" autoFocus={searchOpen} />
            <button onClick={() => setSearchOpen(false)}><FiX size={16} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <button className={styles.drawerClose} onClick={() => setMenuOpen(false)}><FiX size={22} /></button>
        <Link href="/" className={styles.drawerBrand}>
          <span className={styles.brandIcon}>✦</span> UKAY STUDIO
        </Link>
        <div className={styles.drawerLinks}>
          {navLinks.map(link => (
            <Link key={link} href="#products" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
              {link}
            </Link>
          ))}
        </div>
      </div>
      {menuOpen && <div className={styles.drawerBackdrop} onClick={() => setMenuOpen(false)} />}
    </>
  )
}