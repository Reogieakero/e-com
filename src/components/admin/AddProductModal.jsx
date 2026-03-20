'use client'
import React, { useState } from 'react'
import styles from './AddProductModal.module.css'
import { FiX, FiUploadCloud } from 'react-icons/fi'

const AddProductModal = ({ isOpen, onClose }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 4) {
      alert('Maximum 4 photos allowed.')
      return
    }
    setSelectedImages(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.target)

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (!result.success) {
        setError(result.error || 'Something went wrong.')
        return
      }

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
          <h2>Add New Product</h2>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Product Photos (Max 4)</label>
            <div className={styles.fileUploadArea}>
              <FiUploadCloud size={24} />
              <span>{selectedImages.length > 0 ? `${selectedImages.length} image(s) selected` : 'Upload Photos'}</span>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Item Name</label>
            <input name="name" placeholder="Enter name" required />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <input name="category" placeholder="e.g. Tops, Pants" />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Price (₱)</label>
              <input name="price" type="number" step="0.01" required />
            </div>
            <div className={styles.formGroup}>
              <label>Stock</label>
              <input name="stock" type="number" required />
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal