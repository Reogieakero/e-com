'use client'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './Inquiries.module.css'
import {
  FiMessageSquare, FiPhone, FiPackage, FiClock,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiEye, FiX
} from 'react-icons/fi'

const STATUS = {
  pending:  { label: 'Pending',   dot: 'dotPending',  badge: 'badgePending',  actionTag: null },
  resolved: { label: 'Done Deal', dot: 'dotResolved', badge: 'badgeResolved', actionTag: 'tagDone' },
  rejected: { label: 'Pass',      dot: 'dotRejected', badge: 'badgeRejected', actionTag: 'tagPass' },
}

// ── Inquiry detail modal ──
function InquiryDrawer({ inquiry, onClose }) {
  const [activeImg, setActiveImg] = React.useState(0)

  React.useEffect(() => { setActiveImg(0) }, [inquiry?.id])

  if (!inquiry) return null

  const s = STATUS[inquiry.status] || STATUS.pending
  const images = inquiry.product_images || (inquiry.product_image ? [inquiry.product_image] : [])
  const finalPrice = inquiry.product_price != null
    ? (inquiry.product_price - (inquiry.product_discount || 0)).toFixed(2)
    : null

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}><FiX size={18} /></button>

        <div className={styles.modalGrid}>

          {/* Left — image gallery */}
          <div className={styles.modalImageCol}>
            <div className={styles.modalMainImgWrap}>
              {images.length > 0 ? (
                <img
                  src={images[activeImg]}
                  alt={inquiry.product_name}
                  className={styles.modalProductImg}
                  onError={e => { e.currentTarget.src = '' }}
                />
              ) : (
                <div className={styles.modalImgPlaceholder}>
                  <FiPackage size={44} />
                  <span className={styles.modalImgPlaceholderText}>No product image</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip — all product images */}
            {images.length > 1 && (
              <div className={styles.modalThumbStrip}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.modalThumb} ${i === activeImg ? styles.modalThumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {inquiry.product_name && (
              <div className={styles.modalProductMeta}>
                <p className={styles.modalProductName}>{inquiry.product_name}</p>
                {finalPrice && (
                  <div className={styles.modalProductPrice}>
                    <span>₱{finalPrice}</span>
                    {inquiry.product_discount > 0 && (
                      <span className={styles.modalOldPrice}>₱{inquiry.product_price.toFixed(2)}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — info */}
          <div className={styles.modalInfoCol}>
            <div className={styles.modalHeader}>
              <h3>Inquiry Detail</h3>
              <div className={styles.modalStatusRow}>
                <span className={`${styles.dot} ${styles[s.dot]}`} />
                {s.actionTag ? (
                  <span className={`${styles.actionTag} ${styles[s.actionTag]}`}>
                    {inquiry.status === 'resolved' ? '✓ Done Deal' : '✗ Pass'}
                  </span>
                ) : (
                  <span className={`${styles.statusBadge} ${styles[s.badge]}`}>{s.label}</span>
                )}
              </div>
            </div>

            <div className={styles.modalDivider} />

            <div className={styles.modalSection}>
              <span className={styles.modalLabel}>Customer</span>
              <div className={styles.drawerCustomer}>
                <div className={styles.drawerAvatar}>
                  {inquiry.customer_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className={styles.drawerName}>{inquiry.customer_name}</p>
                  <div className={styles.drawerPhone}>
                    <FiPhone size={13} />
                    <span>{inquiry.customer_phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalDivider} />

            <div className={styles.modalSection}>
              <span className={styles.modalLabel}>Message</span>
              <p className={styles.drawerMessage}>
                {inquiry.message || <span className={styles.noMsg}>No message provided.</span>}
              </p>
            </div>

            <div className={styles.modalDivider} />

            <div className={styles.modalSection}>
              <span className={styles.modalLabel}>Submitted</span>
              <div className={styles.drawerDate}>
                <FiClock size={13} />
                <span>{formatDate(inquiry.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [updating, setUpdating]   = useState(null)
  const [viewing, setViewing]     = useState(null)

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/inquiries')
      const data = await res.json()
      if (data.success) setInquiries(data.inquiries)
    } catch (err) {
      console.error('Failed to fetch inquiries:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const res    = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const result = await res.json()
      if (result.success) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
        // Update the viewing drawer too if open
        if (viewing?.id === id) setViewing(prev => ({ ...prev, status }))
      }
    } catch (err) {
      console.error('Failed to update:', err)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === filter)

  const counts = {
    all:      inquiries.length,
    pending:  inquiries.filter(i => i.status === 'pending').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length,
    rejected: inquiries.filter(i => i.status === 'rejected').length,
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Customer Inquiries</h1>
          <p>Manage and respond to customer interest submissions.</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchInquiries} disabled={loading}>
          <FiRefreshCw size={15} className={loading ? styles.spinning : ''} />
          Refresh
        </button>
      </header>

      {/* Stats / filter row */}
      <div className={styles.statsRow}>
        {[
          { key: 'all',      label: 'Total',     numClass: '' },
          { key: 'pending',  label: 'Pending',   numClass: styles.statPending },
          { key: 'resolved', label: 'Done Deal', numClass: styles.statResolved },
          { key: 'rejected', label: 'Pass',      numClass: styles.statRejected },
        ].map(s => (
          <button
            key={s.key}
            className={`${styles.statCard} ${filter === s.key ? styles.statCardActive : ''}`}
            onClick={() => setFilter(s.key)}
          >
            <span className={`${styles.statNum} ${s.numClass}`}>{counts[s.key]}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendTitle}>Color Guide:</span>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotPending}`} />
          <span>Pending — awaiting action</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotResolved}`} />
          <span>Done Deal — customer confirmed</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotRejected}`} />
          <span>Pass — not pursuing</span>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loadingCell}>
            <div className={styles.loadingDots}><span /><span /><span /></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIconWrap}>
              <FiMessageSquare size={28} />
            </div>
            <div className={styles.emptyText}>
              <p className={styles.emptyTitle}>No inquiries yet</p>
              <p className={styles.emptySub}>
                {filter !== 'all'
                  ? `No ${STATUS[filter]?.label ?? filter} inquiries to show.`
                  : 'When customers express interest in a product, their inquiries will appear here.'}
              </p>
            </div>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product Inquired</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const s = STATUS[item.status] || STATUS.pending
                return (
                  <tr key={item.id} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>

                    {/* Customer */}
                    <td>
                      <div className={styles.customerCell}>
                        <div className={styles.avatar}>
                          {item.customer_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className={styles.customerName}>{item.customer_name}</p>
                          <div className={styles.phoneRow}>
                            <FiPhone size={11} />
                            <span>{item.customer_phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td>
                      <div className={styles.productCell}>
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className={styles.productThumb} />
                        ) : (
                          <div className={styles.productThumbPlaceholder}><FiPackage size={12} /></div>
                        )}
                        <span>{item.product_name || '—'}</span>
                      </div>
                    </td>

                    {/* Message */}
                    <td>
                      <p className={styles.message}>
                        {item.message
                          ? item.message
                          : <span className={styles.noMessage}>No message</span>
                        }
                      </p>
                    </td>

                    <td>
                      <div className={styles.dateCell}>
                        <FiClock size={11} />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.statusCell}>
                        <span className={`${styles.dot} ${styles[s.dot]}`} />
                        {s.actionTag ? (
                          <span className={`${styles.actionTag} ${styles[s.actionTag]}`}>
                          </span>
                        ) : (
                          <span className={`${styles.statusBadge} ${styles[s.badge]}`}>{s.label}</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => setViewing(item)}
                          title="View Detail"
                        >
                          <FiEye size={14} />
                        </button>

                        {item.status === 'pending' && (
                          <button
                            className={styles.resolveBtn}
                            onClick={() => updateStatus(item.id, 'resolved')}
                            disabled={updating === item.id}
                            title="Mark as Done Deal"
                          >
                            <FiCheckCircle size={14} />
                          </button>
                        )}

                        {item.status === 'pending' && (
                          <button
                            className={styles.rejectBtn}
                            onClick={() => updateStatus(item.id, 'rejected')}
                            disabled={updating === item.id}
                            title="Mark as Pass"
                          >
                            <FiXCircle size={14} />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Inquiry detail drawer */}
      <InquiryDrawer inquiry={viewing} onClose={() => setViewing(null)} />
    </div>
  )
}