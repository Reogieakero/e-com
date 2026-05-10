'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import styles from './AddProductModal.module.css'
import { FiX, FiUploadCloud, FiPlus, FiTrash2, FiCheck, FiChevronDown } from 'react-icons/fi'

const AddProductModal = ({ isOpen, onClose }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [bullets, setBullets] = useState([''])
  const [price, setPrice] = useState('')
  const [discountPct, setDiscountPct] = useState('')
  const [category, setCategory] = useState('')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const categoryRef = useRef(null)

  const techCategories = [
    'Laptops',
    'PC Components',
    'Peripherals',
    'Mobile Phones',
    'Audio',
    'Storage',
    'Networking',
    'Software',
    'Sale'
  ]

  const priceNum = parseFloat(price) || 0
  const discountPctNum = Math.min(parseFloat(discountPct) || 0, 100)
  const discountAmount = useMemo(() => (priceNum * discountPctNum) / 100, [priceNum, discountPctNum])
  const finalPrice = useMemo(() => priceNum - discountAmount, [priceNum, discountAmount])
  const hasDiscount = priceNum > 0 && discountPctNum > 0

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 4) { alert('Maximum 4 photos allowed.'); return }
    setSelectedImages(files)
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
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index === bullets.length - 1) addBullet()
    }
    if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault()
      removeBullet(index)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.target)
      formData.set('discount', discountAmount.toFixed(2))
      const filledBullets = bullets.filter(b => b.trim() !== '')
      filledBullets.forEach(b => formData.append('description[]', b.trim()))

      const res = await fetch('/api/products', { method: 'POST', body: formData })
      const result = await res.json()

      if (!result.success) {
        setError(result.error || 'Something went wrong.')
        return
      }

      setSelectedImages([])
      setBullets([''])
      setPrice('')
      setDiscountPct('')
      setCategory('')
      onClose(true)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add New Tech Product</h2>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Product Photos <span className={styles.labelHint}>(Max 4)</span></label>
            <div className={styles.fileUploadArea}>
              <FiUploadCloud size={22} />
              <span>{selectedImages.length > 0 ? `${selectedImages.length} image(s) selected` : 'Click to upload hardware photos'}</span>
              <input name="images" type="file" accept="image/*" multiple onChange={handleFileChange} className={styles.fileInput} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Product Name</label>
            <input name="name" placeholder="e.g., Ryzen 9 7950X or MacBook Pro M3" required />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <input type="hidden" name="category" value={category} />
            <div className={styles.customSelect} ref={categoryRef}>
              <button
                type="button"
                className={`${styles.customSelectTrigger} ${categoryOpen ? styles.customSelectOpen : ''} ${category ? styles.customSelectFilled : ''}`}
                onClick={() => setCategoryOpen(o => !o)}
              >
                <span>{category || 'Select tech category'}</span>
                <FiChevronDown size={14} className={`${styles.customSelectChevron} ${categoryOpen ? styles.chevronUp : ''}`} />
              </button>

              {categoryOpen && (
                <div className={styles.customSelectDropdown}>
                  {techCategories.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={`${styles.customSelectOption} ${category === opt ? styles.customSelectOptionActive : ''}`}
                      onClick={() => { setCategory(opt); setCategoryOpen(false) }}
                    >
                      <span>{opt}</span>
                      {category === opt && <FiCheck size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formRow3}>
            <div className={styles.formGroup}>
              <label>MSRP (₱)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Discount (%)</label>
              <div className={styles.inputWithSuffix}>
                <input
                  name="discountPct"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={discountPct}
                  onChange={e => setDiscountPct(e.target.value)}
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Units in Stock</label>
              <input name="stock" type="number" min="0" placeholder="0" required />
            </div>
          </div>

          {hasDiscount && (
            <div className={styles.discountPreview}>
              <div className={styles.discountPreviewLeft}>
                <span className={styles.discountBadge}>−{discountPctNum}% OFF</span>
                <span className={styles.discountSaving}>Savings: ₱{discountAmount.toFixed(2)}</span>
              </div>
              <div className={styles.discountPreviewRight}>
                <span className={styles.discountOriginal}>₱{priceNum.toFixed(2)}</span>
                <span className={styles.discountFinal}>₱{finalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Technical Specifications <span className={styles.labelHint}>(Bullets)</span></label>
              <button type="button" className={styles.addBulletBtn} onClick={addBullet} disabled={bullets.length >= 8}>
                <FiPlus size={12} /> Add Spec
              </button>
            </div>
            <div className={styles.bulletList}>
              {bullets.map((bullet, index) => (
                <div key={index} className={styles.bulletRow}>
                  <span className={styles.bulletDot} />
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={index === 0 ? "e.g., 32GB DDR5 6000MHz" : `Spec ${index + 1}`}
                    className={styles.bulletInput}
                    autoFocus={index === bullets.length - 1 && bullets.length > 1}
                  />
                  <button
                    type="button"
                    className={styles.removeBulletBtn}
                    onClick={() => removeBullet(index)}
                    disabled={bullets.length === 1}
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <p className={styles.bulletHint}>Press Enter for next spec • Backspace to clear</p>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
              Discard
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'List Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal