'use client'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './Orders.module.css'
import {
  FiPackage, FiPhone, FiUser, FiClock,
  FiList, FiGrid, FiSearch, FiRefreshCw,
  FiCheckCircle, FiCalendar
} from 'react-icons/fi'

export default function Orders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView]       = useState('table')
  const [search, setSearch]   = useState('')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/inquiries')
      const data = await res.json()
      if (data.success) {
        // Orders = only Done Deal inquiries
        setOrders(data.inquiries.filter(i => i.status === 'resolved'))
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = orders.filter(o =>
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search)
  )

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }

  const totalRevenue = orders.reduce((sum, o) => {
    const price = o.product_price != null
      ? o.product_price - (o.product_discount || 0)
      : 0
    return sum + price
  }, 0)

  // ── Empty state
  const EmptyState = () => (
    <div className={styles.empty}>
      <FiCheckCircle size={44} />
      <p>No orders yet</p>
      <span>Done Deal inquiries will appear here.</span>
    </div>
  )

  // ── Loading dots
  const Loader = () => (
    <div className={styles.loaderWrap}>
      <div className={styles.dots}><span /><span /><span /></div>
    </div>
  )

  return (
    <div className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Orders</h1>
          <p>All confirmed Done Deal transactions.</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchOrders} disabled={loading}>
          <FiRefreshCw size={15} className={loading ? styles.spinning : ''} />
          Refresh
        </button>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{orders.length}</span>
          <span className={styles.statLabel}>Total Orders</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statNum} ${styles.statGreen}`}>
            ₱{totalRevenue.toFixed(2)}
          </span>
          <span className={styles.statLabel}>Total Revenue</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>
            {orders.filter(o => {
              const d = new Date(o.created_at)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length}
          </span>
          <span className={styles.statLabel}>This Month</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FiSearch size={15} />
          <input
            placeholder="Search by customer, product, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${view === 'table' ? styles.toggleActive : ''}`}
            onClick={() => setView('table')}
            title="Table view"
          >
            <FiList size={15} />
          </button>
          <button
            className={`${styles.toggleBtn} ${view === 'card' ? styles.toggleActive : ''}`}
            onClick={() => setView('card')}
            title="Card view"
          >
            <FiGrid size={15} />
          </button>
        </div>
      </div>

      {/* ── TABLE VIEW ── */}
      {view === 'table' && (
        <div className={styles.tableWrapper}>
          {loading ? <Loader /> : filtered.length === 0 ? <EmptyState /> : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Price</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const finalPrice = order.product_price != null
                    ? (order.product_price - (order.product_discount || 0)).toFixed(2)
                    : null

                  return (
                    <tr key={order.id} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>

                      {/* Order number */}
                      <td>
                        <span className={styles.orderNum}>#{String(i + 1).padStart(3, '0')}</span>
                      </td>

                      {/* Product */}
                      <td>
                        <div className={styles.productCell}>
                          {order.product_image
                            ? <img src={order.product_image} alt={order.product_name} className={styles.productThumb} />
                            : <div className={styles.thumbPlaceholder}><FiPackage size={13} /></div>
                          }
                          <div>
                            <p className={styles.productName}>{order.product_name || '—'}</p>
                            {order.product_discount > 0 && (
                              <span className={styles.discountTag}>
                                −{Math.round((order.product_discount / order.product_price) * 100)}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td>
                        <div className={styles.customerCell}>
                          <div className={styles.avatar}>
                            {order.customer_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className={styles.customerName}>{order.customer_name}</p>
                            <div className={styles.phoneRow}>
                              <FiPhone size={11} />
                              <span>{order.customer_phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td>
                        {finalPrice ? (
                          <div className={styles.priceCell}>
                            <span className={styles.price}>₱{finalPrice}</span>
                            {order.product_discount > 0 && (
                              <span className={styles.oldPrice}>₱{order.product_price.toFixed(2)}</span>
                            )}
                          </div>
                        ) : <span className={styles.noData}>—</span>}
                      </td>

                      {/* Message */}
                      <td>
                        <p className={styles.message}>
                          {order.message || <span className={styles.noData}>No message</span>}
                        </p>
                      </td>

                      {/* Date */}
                      <td>
                        <div className={styles.dateCell}>
                          <FiCalendar size={11} />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={styles.doneDealBadge}>✓ Done Deal</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── CARD VIEW ── */}
      {view === 'card' && (
        loading ? <Loader /> : filtered.length === 0 ? <EmptyState /> : (
          <div className={styles.cardGrid}>
            {filtered.map((order, i) => {
              const finalPrice = order.product_price != null
                ? (order.product_price - (order.product_discount || 0)).toFixed(2)
                : null
              const discountPct = order.product_discount > 0
                ? Math.round((order.product_discount / order.product_price) * 100)
                : 0

              return (
                <div key={order.id} className={styles.card} style={{ animationDelay: `${i * 0.06}s` }}>

                  {/* Product image */}
                  <div className={styles.cardImg}>
                    {order.product_image
                      ? <img src={order.product_image} alt={order.product_name} className={styles.cardImgFill} />
                      : <div className={styles.cardImgPlaceholder}><FiPackage size={28} /></div>
                    }
                    {discountPct > 0 && (
                      <span className={styles.cardDiscountBadge}>−{discountPct}%</span>
                    )}
                    <span className={styles.cardDoneBadge}>✓ Done Deal</span>
                  </div>

                  {/* Card body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardOrderNum}>Order #{String(i + 1).padStart(3, '0')}</div>

                    <p className={styles.cardProductName}>{order.product_name || '—'}</p>

                    {finalPrice && (
                      <div className={styles.cardPriceRow}>
                        <span className={styles.cardPrice}>₱{finalPrice}</span>
                        {order.product_discount > 0 && (
                          <span className={styles.cardOldPrice}>₱{order.product_price.toFixed(2)}</span>
                        )}
                      </div>
                    )}

                    <div className={styles.cardDivider} />

                    {/* Customer */}
                    <div className={styles.cardCustomer}>
                      <div className={styles.cardAvatar}>
                        {order.customer_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className={styles.cardCustomerName}>{order.customer_name}</p>
                        <div className={styles.cardPhone}>
                          <FiPhone size={11} />
                          <span>{order.customer_phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className={styles.cardDate}>
                      <FiCalendar size={11} />
                      <span>{formatDate(order.created_at)} · {formatTime(order.created_at)}</span>
                    </div>

                    {/* Message */}
                    {order.message && (
                      <p className={styles.cardMessage}> {order.message}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}