'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './ProductDetail.module.css'
import {
  FiArrowLeft, FiHeart, FiShare2, FiCheck,
  FiPackage, FiUser, FiPhone, FiMessageSquare, FiChevronRight
} from 'react-icons/fi'

export default function ProductDetail({ product, related }) {
  const [activeImg, setActiveImg] = useState(0)
  const [wished, setWished] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [formState, setFormState] = useState('idle') // idle | submitting | success | error
  const [errors, setErrors] = useState({})

  const images = product.images?.length ? product.images : []
  const finalPrice = product.price - (product.discount || 0)
  const discountPct = product.discount > 0 ? Math.round((product.discount / product.price) * 100) : 0
  const isSoldOut = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Contact number is required'
    else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setFormState('submitting')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          ...form,
        }),
      })
      const result = await res.json()
      setFormState(result.success ? 'success' : 'error')
    } catch {
      setFormState('error')
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.inner}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadLink}>Home</Link>
          <FiChevronRight size={12} />
          <Link href="/#products" className={styles.breadLink}>{product.category || 'Shop'}</Link>
          <FiChevronRight size={12} />
          <span className={styles.breadCurrent}>{product.name}</span>
        </div>

        {/* Product layout */}
        <div className={styles.productLayout}>

          {/* ── Left: Images ── */}
          <div className={styles.imageSection}>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className={styles.mainImgWrap}>
              {images[activeImg]
                ? <img src={images[activeImg]} alt={product.name} className={styles.mainImg} />
                : <div className={styles.imgPlaceholder}><FiPackage size={48} /></div>
              }
              {discountPct > 0 && <span className={styles.discountRibbon}>−{discountPct}%</span>}
              {isSoldOut && (
                <div className={styles.soldOutOverlay}><span>Sold Out</span></div>
              )}

              {/* Floating actions */}
              <div className={styles.floatingActions}>
                <button
                  className={`${styles.floatBtn} ${wished ? styles.floatBtnWished : ''}`}
                  onClick={() => setWished(w => !w)}
                >
                  <FiHeart size={16} fill={wished ? '#f97316' : 'none'} />
                </button>
                <button className={styles.floatBtn} onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <FiShare2 size={16} />
                </button>
              </div>

              {/* Image dots */}
              {images.length > 1 && (
                <div className={styles.imgDots}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.imgDot} ${i === activeImg ? styles.imgDotActive : ''}`}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Info + Form ── */}
          <div className={styles.infoSection}>

            {/* Category + name */}
            <div className={styles.productMeta}>
              <span className={styles.categoryEyebrow}>{product.category || 'General'}</span>
              <h1 className={styles.productName}>{product.name}</h1>
            </div>

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.finalPrice}>₱{finalPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className={styles.originalPrice}>₱{product.price.toFixed(2)}</span>
                  <span className={styles.savingsBadge}>Save ₱{product.discount.toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className={styles.stockRow}>
              <span className={`${styles.stockDot} ${isSoldOut ? styles.dotSoldOut : isLowStock ? styles.dotLow : styles.dotIn}`} />
              <span className={styles.stockText}>
                {isSoldOut ? 'Sold Out' : isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
              </span>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Description bullets */}
            {product.description?.length > 0 && (
              <div className={styles.descSection}>
                <p className={styles.descTitle}>Details</p>
                <ul className={styles.bulletList}>
                  {product.description.map((line, i) => (
                    <li key={i} className={styles.bulletItem}>
                      <span className={styles.bulletDot} />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.divider} />

            {/* ── Interest Form ── */}
            <div className={styles.interestForm}>
              <div className={styles.formHeader}>
                <FiMessageSquare size={16} />
                <div>
                  <p className={styles.formTitle}>Interested in this item?</p>
                  <p className={styles.formSub}>Leave your details and we&apos;ll get back to you.</p>
                </div>
              </div>

              {formState === 'success' ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}><FiCheck size={22} /></div>
                  <div>
                    <p className={styles.successTitle}>We got your inquiry!</p>
                    <p className={styles.successSub}>We&apos;ll contact you at <strong>{form.phone}</strong> shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  {/* Name */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Full Name</label>
                    <div className={`${styles.fieldWrap} ${errors.name ? styles.fieldError : ''}`}>
                      <FiUser size={15} className={styles.fieldIcon} />
                      <input
                        type="text"
                        placeholder="Juan dela Cruz"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={styles.fieldInput}
                      />
                    </div>
                    {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                  </div>

                  {/* Phone */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Contact Number</label>
                    <div className={`${styles.fieldWrap} ${errors.phone ? styles.fieldError : ''}`}>
                      <FiPhone size={15} className={styles.fieldIcon} />
                      <input
                        type="tel"
                        placeholder="09XX XXX XXXX"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className={styles.fieldInput}
                      />
                    </div>
                    {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                  </div>

                  {/* Message */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Message <span className={styles.optional}>(optional)</span></label>
                    <textarea
                      placeholder="Any questions about size, condition, meet-up, etc."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={styles.fieldTextarea}
                      rows={3}
                    />
                  </div>

                  {formState === 'error' && (
                    <p className={styles.submitError}>Something went wrong. Please try again.</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={formState === 'submitting' || isSoldOut}
                  >
                    {formState === 'submitting' ? (
                      <><span className={styles.spinner} /> Sending...</>
                    ) : isSoldOut ? (
                      'Item Unavailable'
                    ) : (
                      "Send Inquiry"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>More from {product.category}</h2>
              <Link href="/#products" className={styles.relatedViewAll}>View All <FiChevronRight size={14} /></Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(item => {
                const fp = item.price - (item.discount || 0)
                const dp = item.discount > 0 ? Math.round((item.discount / item.price) * 100) : 0
                return (
                  <Link key={item.id} href={`/product/${item.id}`} className={styles.relatedCard}>
                    <div className={styles.relatedImg}>
                      {item.images?.[0]
                        ? <img src={item.images[0]} alt={item.name} />
                        : <div className={styles.relatedPlaceholder}><FiPackage size={24} /></div>
                      }
                      {dp > 0 && <span className={styles.relatedBadge}>−{dp}%</span>}
                    </div>
                    <div className={styles.relatedInfo}>
                      <p className={styles.relatedName}>{item.name}</p>
                      <span className={styles.relatedPrice}>₱{fp.toFixed(2)}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}