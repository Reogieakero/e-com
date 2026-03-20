'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './ProductGrid.module.css'
import { FiHeart, FiShoppingBag, FiPackage } from 'react-icons/fi'

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'General']

export default function ProductGrid({ products = [] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [wishlist, setWishlist] = useState([])

  const toggleWishlist = (id) => {
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

        {/* Section header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLeft}>
            <span className={styles.sectionEyebrow}>— The Collection</span>
            <h2 className={styles.sectionTitle}>Shop the<br />Latest Finds</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.sectionDesc}>
              Every piece is personally inspected and curated.<br />
              Authentic quality at unbeatable prices.
            </p>
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{products.length}</span>
                <span className={styles.statLabel}>Total Pieces</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>{inStock}</span>
                <span className={styles.statLabel}>In Stock</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={`${styles.statNum} ${styles.statOrange}`}>{onSale}</span>
                <span className={styles.statLabel}>On Sale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className={styles.filterBar}>
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
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <FiPackage size={48} />
            <p>No products in this category yet.</p>
            <span>Check back soon — new pieces drop regularly.</span>
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
                  {/* Image */}
                  <div className={styles.cardImg}>
                    {item.images?.[0]
                      ? <img src={item.images[0]} alt={item.name} className={styles.img} />
                      : (
                        <div className={styles.imgPlaceholder}>
                          <FiPackage size={32} />
                        </div>
                      )
                    }

                    {/* Badges */}
                    <div className={styles.badges}>
                      {discountPct > 0 && <span className={styles.badgeSale}>−{discountPct}%</span>}
                      {isLowStock && !isSoldOut && <span className={styles.badgeLow}>Only {item.stock} left</span>}
                    </div>

                    {isSoldOut && (
                      <div className={styles.soldOutOverlay}>
                        <span>Sold Out</span>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className={styles.cardActions}>
                      <button
                        className={`${styles.wishBtn} ${isWished ? styles.wished : ''}`}
                        onClick={() => toggleWishlist(item.id)}
                        title="Wishlist"
                      >
                        <FiHeart size={16} fill={isWished ? '#f97316' : 'none'} />
                      </button>
                      {!isSoldOut && (
                        <button className={styles.bagBtn}>
                          <FiShoppingBag size={15} />
                          <span>Add to Bag</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className={styles.cardInfo}>
                    <span className={styles.cardCategory}>{item.category || 'General'}</span>
                    <p className={styles.cardName}>{item.name}</p>

                    {item.description?.length > 0 && (
                      <p className={styles.cardDesc}>{item.description[0]}</p>
                    )}

                    <div className={styles.cardPriceRow}>
                      <span className={styles.cardPrice}>₱{finalPrice.toFixed(2)}</span>
                      {item.discount > 0 && (
                        <span className={styles.cardOldPrice}>₱{item.price.toFixed(2)}</span>
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