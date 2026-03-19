'use client'
import React, { useState } from 'react'
import { addProduct } from '../../app/admin/actions'
import styles from './AddProductModal.module.css'
import { FiX, FiUploadCloud } from 'react-icons/fi'

const AddProductModal = ({ isOpen, onClose }) => {
  const [selectedImages, setSelectedImages] = useState([])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 4) {
      alert("You can only upload a maximum of 4 photos.")
      e.target.value = null
      return
    }
    setSelectedImages(files)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add New Product</h2>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>
        
        <form action={addProduct} onSubmit={() => onClose()} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Product Photos (Max 4)</label>
            <div className={styles.fileUploadArea}>
              <FiUploadCloud size={24} />
              <span>{selectedImages.length > 0 ? `${selectedImages.length} images selected` : "Click to upload photos"}</span>
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
            <input name="name" placeholder="Enter item name" required />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Original Price (₱)</label>
              <input name="price" type="number" step="0.01" required />
            </div>
            <div className={styles.formGroup}>
              <label>Stock</label>
              <input name="stock" type="number" required />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Save Product</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal