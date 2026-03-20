'use client'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './Inventory.module.css'
import { FiPlus, FiEdit2, FiTrash2, FiList, FiGrid, FiSearch, FiPackage, FiAlertTriangle } from 'react-icons/fi'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'

const StockBar = ({ stock, maxStock = 100 }) => {
  const pct = Math.min((stock / maxStock) * 100, 100)
  const level = stock === 0 ? 'empty' : stock <= 5 ? 'low' : stock <= 20 ? 'mid' : 'high'
  return (
    <div className={styles.stockBar}>
      <div className={`${styles.stockFill} ${styles[level]}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

const StatusBadge = ({ stock }) => (
  <span className={stock > 0 ? styles.statusStock : styles.statusSold}>
    {stock > 0 ? 'In Stock' : 'Sold Out'}
  </span>
)

const EmptyState = () => (
  <div className={styles.emptyState}>
    <FiPackage size={40} />
    <p>No products found</p>
    <span>Add your first product to get started</span>
  </div>
)

// Delete confirmation dialog
const DeleteConfirm = ({ product, onConfirm, onCancel, isDeleting }) => (
  <div className={styles.confirmOverlay} onClick={onCancel}>
    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
      <div className={styles.confirmIcon}><FiAlertTriangle size={24} /></div>
      <h3>Delete Product?</h3>
      <p>
        <strong>{product?.name}</strong> will be permanently removed along with its images.
        This cannot be undone.
      </p>
      <div className={styles.confirmActions}>
        <button className={styles.confirmCancel} onClick={onCancel} disabled={isDeleting}>
          Cancel
        </button>
        <button className={styles.confirmDelete} onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
)

const ProductCard = ({ item, onEdit, onDelete }) => {
  const finalPrice = item.price - (item.discount || 0)
  const discountPct = item.discount > 0 ? Math.round((item.discount / item.price) * 100) : 0
  const stock = item.stock
  const stockLevel = stock === 0 ? 'empty' : stock <= 5 ? 'low' : stock <= 20 ? 'mid' : 'high'
  const stockLabel =
    stock === 0 ? 'Out of stock' :
    stock <= 5 ? `Only ${stock} left` :
    `${stock} pcs left`

  return (
    <div className={styles.card}>
      <div className={styles.cardImg}>
        {item.images?.[0]
          ? <img src={item.images[0]} alt={item.name} className={styles.cardImgFill} />
          : <div className={styles.cardImgPlaceholder}><FiPackage size={28} /></div>
        }
        {discountPct > 0 && <div className={styles.discountBadge}>−{discountPct}%</div>}
        {stock === 0 && (
          <div className={styles.soldOutOverlay}><span>Sold out</span></div>
        )}
        <div className={styles.actionStrip}>
          <button className={styles.actionBtn} title="Edit" onClick={() => onEdit(item)}>
            <FiEdit2 size={15} />
          </button>
          <button className={`${styles.actionBtn} ${styles.actionDanger}`} title="Delete" onClick={() => onDelete(item)}>
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
      <StockBar stock={stock} />
      <div className={styles.cardBody}>
        <span className={styles.cardEyebrow}>{item.category || 'General'}</span>
        <p className={styles.cardName}>{item.name}</p>
        <div className={styles.cardPriceRow}>
          <span className={styles.cardPrice}>₱{finalPrice.toFixed(2)}</span>
          {item.discount > 0 && <span className={styles.cardOldPrice}>₱{item.price.toFixed(2)}</span>}
        </div>
        <div className={styles.cardFooter}>
          <span className={`${styles.cardStockLabel} ${styles[`stock_${stockLevel}`]}`}>{stockLabel}</span>
          <span className={styles.cardId}>#{String(item.id).slice(0, 6)}</span>
        </div>
      </div>
    </div>
  )
}

const Inventory = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('card')
  const [search, setSearch] = useState('')

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

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteProduct) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/products/${deleteProduct.id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== deleteProduct.id))
        setDeleteProduct(null)
      }
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Inventory Management</h1>
          <p>Track your stock levels here.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsAddOpen(true)}>
          <FiPlus /> Add Product
        </button>
      </header>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FiSearch size={15} />
          <input
            placeholder="Search by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.viewToggle}>
          <button className={`${styles.toggleBtn} ${view === 'table' ? styles.toggleActive : ''}`} onClick={() => setView('table')} title="Table view">
            <FiList size={15} />
          </button>
          <button className={`${styles.toggleBtn} ${view === 'card' ? styles.toggleActive : ''}`} onClick={() => setView('card')} title="Card view">
            <FiGrid size={15} />
          </button>
        </div>
      </div>

      {/* ── TABLE VIEW ── */}
      {view === 'table' && (
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
                <tr><td colSpan={7} className={styles.loadingCell}><div className={styles.loadingDots}><span /><span /><span /></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState /></td></tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={styles.tableRow} style={{ animationDelay: `${i * 0.04}s` }}>
                    <td>
                      {item.images?.[0]
                        ? <img src={item.images[0]} alt={item.name} className={styles.tableThumb} />
                        : <div className={styles.thumbPlaceholder}><FiPackage size={14} /></div>
                      }
                    </td>
                    <td className={styles.itemName}>{item.name}</td>
                    <td><span className={styles.categoryTag}>{item.category || '—'}</span></td>
                    <td>
                      <div className={styles.priceCell}>
                        {item.discount > 0 && <span className={styles.oldPrice}>₱{item.price.toFixed(2)}</span>}
                        <span className={styles.price}>₱{(item.price - (item.discount || 0)).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className={styles.stockNum}>{item.stock}</td>
                    <td><StatusBadge stock={item.stock} /></td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.editBtn} onClick={() => setEditProduct(item)} title="Edit"><FiEdit2 size={13} /></button>
                        <button className={styles.deleteBtn} onClick={() => setDeleteProduct(item)} title="Delete"><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CARD VIEW ── */}
      {view === 'card' && (
        loading ? (
          <div className={styles.cardGrid}>
            {[...Array(8)].map((_, i) => <div key={i} className={styles.cardSkeleton} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.cardGrid}>
            {filtered.map((item, i) => (
              <div key={item.id} style={{ animationDelay: `${i * 0.05}s` }} className={styles.cardWrapper}>
                <ProductCard
                  item={item}
                  onEdit={setEditProduct}
                  onDelete={setDeleteProduct}
                />
              </div>
            ))}
          </div>
        )
      )}

      {/* Modals */}
      <AddProductModal
        isOpen={isAddOpen}
        onClose={(didAdd) => { setIsAddOpen(false); if (didAdd) fetchProducts() }}
      />

      <EditProductModal
        isOpen={!!editProduct}
        product={editProduct}
        onClose={(didEdit) => { setEditProduct(null); if (didEdit) fetchProducts() }}
      />

      {deleteProduct && (
        <DeleteConfirm
          product={deleteProduct}
          onConfirm={handleDelete}
          onCancel={() => setDeleteProduct(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}

export default Inventory