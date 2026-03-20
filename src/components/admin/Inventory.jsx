'use client'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './Inventory.module.css'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import AddProductModal from './AddProductModal'

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) setProducts(data.products)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleModalClose = (didAdd = false) => {
    setIsModalOpen(false)
    if (didAdd) fetchProducts() // refresh table after adding
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Inventory Management</h1>
          <p>Track your stock levels here.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add Product
        </button>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                  No products yet. Add your first product!
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'var(--gray-100)', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td className={styles.itemName}>{item.name}</td>
                  <td>{item.category}</td>
                  <td className={styles.price}>₱{(item.price - (item.discount || 0)).toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td>
                    <span className={item.stock > 0 ? styles.statusStock : styles.statusSold}>
                      {item.stock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn}><FiEdit2 /></button>
                    <button className={styles.deleteBtn}><FiTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  )
}

export default Inventory