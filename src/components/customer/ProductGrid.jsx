'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './ProductGrid.module.css'
import { FiHeart, FiShoppingBag, FiPackage, FiCpu } from 'react-icons/fi'

const categories = ['All', 'Laptops', 'PC Components', 'Peripherals', 'Mobile Phones', 'Software', 'Sale']

export default function ProductGrid({ products = [], hideFilters = false }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [wishlist, setWishlist] = useState([])

  const toggleWishlist = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase())

  const inStock = products.filter(p => p.stock > 0).length
  const onSale = products.filter(p => p.discount > 0).length

  return (
    <section id="products" className={styles.section}>
      <div className={styles.inner}>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionLeft}>
            <span className={styles.sectionEyebrow}>— Premium Inventory</span>
            <h2 className={styles.sectionTitle}>High-Performance<br />Tech Gear</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.sectionDesc}>
              Engineered for excellence. We source only the highest grade <br />
              components and hardware for your next build.
            </p>
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{products.length}</span>
                <span className={styles.statLabel}>SKUs Total</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>{inStock}</span>
                <span className={styles.statLabel}>Ready to Ship</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={`${styles.statNum} ${styles.statBlue}`}>{onSale}</span>
                <span className={styles.statLabel}>Deals Active</span>
              </div>
            </div>
          </div>
        </div>

        {!hideFilters && <div className={styles.filterBar}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className={styles.filterCount}>
                  {products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>}

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <FiCpu size={48} />
            <p>Hardware catalog currently offline.</p>
            <span>Our technicians are restocking these categories. Check back soon.</span>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item, i) => {
              const finalPrice = item.price - (item.discount || 0)
              const discountPct = item.discount > 0 ? Math.round((item.discount / item.price) * 100) : 0
              const isWished = wishlist.includes(item.id)
              const isLowStock = item.stock > 0 && item.stock <= 5
              const isSoldOut = item.stock === 0

              return (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className={`${styles.card} ${isSoldOut ? styles.cardSoldOut : ''}`}
                  style={{ animationDelay: `${(i % 8) * 0.07}s` }}
                >
                  <div className={styles.cardImg}>
                    {item.images?.[0]
                      ? <img src={item.images[0]} alt={item.name} className={styles.img} />
                      : (
                        <div className={styles.imgPlaceholder}>
                          <FiCpu size={32} />
                        </div>
                      )
                    }

                    <div className={styles.badges}>
                      {discountPct > 0 && <span className={styles.badgeSale}>−{discountPct}%</span>}
                      {isLowStock && !isSoldOut && <span className={styles.badgeLow}>Only {item.stock} units left</span>}
                    </div>

                    {isSoldOut && (
                      <div className={styles.soldOutOverlay}>
                        <span>Out of Stock</span>
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      <button
                        className={`${styles.wishBtn} ${isWished ? styles.wished : ''}`}
                        onClick={(e) => toggleWishlist(e, item.id)}
                        title="Save to Wishlist"
                      >
                        <FiHeart size={16} fill={isWished ? '#3b82f6' : 'none'} />
                      </button>
                      {!isSoldOut && (
                        <button className={styles.bagBtn}>
                          <FiShoppingBag size={15} />
                          <span>Buy Now</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardInfo}>
                    <span className={styles.cardCategory}>{item.category || 'Hardware'}</span>
                    <p className={styles.cardName}>{item.name}</p>

                    {item.description?.length > 0 && (
                      <p className={styles.cardDesc}>{item.description[0]}</p>
                    )}

                    <div className={styles.cardPriceRow}>
                      <span className={styles.cardPrice}>₱{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      {item.discount > 0 && (
                        <span className={styles.cardOldPrice}>₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}