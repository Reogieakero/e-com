'use client'
import React, { useState } from 'react'
import styles from './Inventory.module.css'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import AddProductModal from './AddProductModal'

const Inventory = ({ products = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Inventory Management</h1>
          <p>Manage and track your ukay-ukay stock levels.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add Product
        </button>
      </header>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input placeholder="Search products..." />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Original</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              const finalPrice = item.price - (item.discount || 0);
              return (
                <tr key={item.id}>
                  <td className={styles.itemName}>{item.name}</td>
                  <td>{item.category || 'General'}</td>
                  <td className={styles.oldPrice}>₱{item.price}</td>
                  <td className={styles.discountText}>-₱{item.discount || 0}</td>
                  <td className={styles.price}>₱{finalPrice}</td>
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
              )
            })}
          </tbody>
        </table>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default Inventory