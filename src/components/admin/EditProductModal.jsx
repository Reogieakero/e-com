'use client'
import React, { useState, useEffect, useMemo } from 'react'
import styles from './AddProductModal.module.css'
import editStyles from './EditProductModal.module.css'
import { FiX, FiUploadCloud, FiPlus, FiTrash2 } from 'react-icons/fi'

const EditProductModal = ({ isOpen, onClose, product }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [bullets, setBullets] = useState([''])
  const [price, setPrice] = useState('')
  const [discountPct, setDiscountPct] = useState('')

  // Populate fields when product changes
  useEffect(() => {
    if (product) {
      setPrice(String(product.price || ''))
      setExistingImages(product.images || [])
      setBullets(product.description?.length ? product.description : [''])
      setError(null)
      setSelectedImages([])

      // Convert stored peso discount back to percentage for the input
      const pct = product.price > 0 && product.discount > 0
        ? ((product.discount / product.price) * 100).toFixed(2)
        : ''
      setDiscountPct(pct)
    }
  }, [product])

  const priceNum = parseFloat(price) || 0
  const discountPctNum = Math.min(parseFloat(discountPct) || 0, 100)
  const discountAmount = useMemo(() => (priceNum * discountPctNum) / 100, [priceNum, discountPctNum])
  const finalPrice = useMemo(() => priceNum - discountAmount, [priceNum, discountAmount])
  const hasDiscount = priceNum > 0 && discountPctNum > 0

  if (!isOpen || !product) return null

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const total = existingImages.length + files.length
    if (total > 4) { alert('Maximum 4 photos total.'); return }
    setSelectedImages(files)
  }

  const removeExistingImage = (url) => {
    setExistingImages(existingImages.filter(img => img !== url))
  }

  const handleBulletChange = (index, value) => {
    const updated = [...bullets]
    updated[index] = value
    setBullets(updated)
  }

  const addBullet = () => { if (bullets.length < 8) setBullets([...bullets, '']) }

  const removeBullet = (index) => {
    if (bullets.length === 1) return
    setBullets(bullets.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') { e.preventDefault(); if (index === bullets.length - 1) addBullet() }
    if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault(); removeBullet(index)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.target)
      formData.set('discount', discountAmount.toFixed(2))

      // Attach existing image URLs to keep
      existingImages.forEach(url => formData.append('existingImages', url))

      // Attach new image files
      selectedImages.forEach(file => formData.append('images', file))

      const filledBullets = bullets.filter(b => b.trim() !== '')
      filledBullets.forEach(b => formData.append('description[]', b.trim()))

      const res = await fetch(`/api/products/${product.id}`, { method: 'PATCH', body: formData })
      const result = await res.json()

      if (!result.success) { setError(result.error || 'Something went wrong.'); return }

      onClose(true)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={() => onClose(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Product</h2>
          <button className={styles.closeBtn} onClick={() => onClose(false)}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Existing images */}
          <div className={styles.formGroup}>
            <label>Product Photos <span className={styles.labelHint}>(Max 4 total)</span></label>

            {existingImages.length > 0 && (
              <div className={editStyles.imageGrid}>
                {existingImages.map((url, i) => (
                  <div key={i} className={editStyles.imageThumb}>
                    <img src={url} alt={`product-${i}`} />
                    <button type="button" className={editStyles.removeImg} onClick={() => removeExistingImage(url)}>
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {existingImages.length < 4 && (
              <div className={styles.fileUploadArea} style={{ marginTop: existingImages.length ? '0.5rem' : 0 }}>
                <FiUploadCloud size={20} />
                <span>{selectedImages.length > 0 ? `${selectedImages.length} new image(s) selected` : 'Upload more photos'}</span>
                <input name="newImages" type="file" accept="image/*" multiple onChange={handleFileChange} className={styles.fileInput} />
              </div>
            )}
          </div>

          {/* Name */}
          <div className={styles.formGroup}>
            <label>Item Name</label>
            <input name="name" placeholder="Enter product name" defaultValue={product.name} required />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label>Category</label>
            <input name="category" placeholder="e.g. Tops, Pants, Dresses" defaultValue={product.category} />
          </div>

          {/* Price / Discount / Stock */}
          <div className={styles.formRow3}>
            <div className={styles.formGroup}>
              <label>Price (₱)</label>
              <input
                name="price" type="number" step="0.01" min="0" placeholder="0.00"
                value={price} onChange={e => setPrice(e.target.value)} required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Discount (%)</label>
              <div className={styles.inputWithSuffix}>
                <input
                  name="discountPct" type="number" step="0.01" min="0" max="100" placeholder="0"
                  value={discountPct} onChange={e => setDiscountPct(e.target.value)}
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Stock</label>
              <input name="stock" type="number" min="0" placeholder="0" defaultValue={product.stock} required />
            </div>
          </div>

          {/* Discount preview */}
          {hasDiscount && (
            <div className={styles.discountPreview}>
              <div className={styles.discountPreviewLeft}>
                <span className={styles.discountBadge}>−{discountPctNum}%</span>
                <span className={styles.discountSaving}>You save ₱{discountAmount.toFixed(2)}</span>
              </div>
              <div className={styles.discountPreviewRight}>
                <span className={styles.discountOriginal}>₱{priceNum.toFixed(2)}</span>
                <span className={styles.discountFinal}>₱{finalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Description bullets */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Description <span className={styles.labelHint}>(bullet points)</span></label>
              <button type="button" className={styles.addBulletBtn} onClick={addBullet} disabled={bullets.length >= 8}>
                <FiPlus size={12} /> Add
              </button>
            </div>
            <div className={styles.bulletList}>
              {bullets.map((bullet, index) => (
                <div key={index} className={styles.bulletRow}>
                  <span className={styles.bulletDot} />
                  <input
                    type="text" value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={`Feature or detail ${index + 1}`}
                    className={styles.bulletInput}
                  />
                  <button type="button" className={styles.removeBulletBtn} onClick={() => removeBullet(index)} disabled={bullets.length === 1}>
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <p className={styles.bulletHint}>Press Enter to add • Backspace on empty line to remove</p>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => onClose(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductModal