'use client'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './Customers.module.css'
import { FiUsers, FiPhone, FiSearch, FiRefreshCw, FiMessageSquare } from 'react-icons/fi'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/inquiries')
      const data = await res.json()
      if (data.success) {
        const all = data.inquiries

        // Group by phone number
        const map = {}
        all.forEach(i => {
          const key = i.customer_phone
          if (!map[key]) {
            map[key] = {
              name:       i.customer_name,
              phone:      i.customer_phone,
              inquiries:  0,
              orders:     0,
              lastActive: i.created_at,
            }
          }
          map[key].inquiries++
          if (i.status === 'resolved') map[key].orders++
          if (new Date(i.created_at) > new Date(map[key].lastActive)) {
            map[key].lastActive = i.created_at
          }
        })

        const unique = Object.values(map).sort((a, b) =>
          a.name?.localeCompare(b.name)
        )
        setCustomers(unique)
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Customers</h1>
          <p>All unique customers who submitted an inquiry.</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchCustomers} disabled={loading}>
          <FiRefreshCw size={15} className={loading ? styles.spinning : ''} />
          Refresh
        </button>
      </header>

      {/* Stat + Search row */}
      <div className={styles.controlsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap}>
            <FiUsers size={18} />
          </div>
          <div>
            <span className={styles.statNum}>{customers.length}</span>
            <span className={styles.statLabel}>Total Customers</span>
          </div>
        </div>

        <div className={styles.searchBox}>
          <FiSearch size={15} />
          <input
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loaderWrap}>
            <div className={styles.dots}><span /><span /><span /></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <FiUsers size={40} />
            <p>No customers found.</p>
            <span>Customers appear once they submit an inquiry.</span>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Contact Number</th>
                <th>Inquiries</th>
                <th>Orders</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.phone} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>

                  {/* # */}
                  <td><span className={styles.rowNum}>{i + 1}</span></td>

                  {/* Customer name */}
                  <td>
                    <div className={styles.customerCell}>
                      <div className={styles.avatar}>
                        {c.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className={styles.customerName}>{c.name}</span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td>
                    <div className={styles.phoneCell}>
                      <FiPhone size={13} />
                      <span>{c.phone}</span>
                    </div>
                  </td>

                  {/* Inquiry count */}
                  <td>
                    <div className={styles.countCell}>
                      <FiMessageSquare size={12} />
                      <span>{c.inquiries}</span>
                    </div>
                  </td>

                  {/* Orders (Done Deal) */}
                  <td>
                    {c.orders > 0
                      ? <span className={styles.orderBadge}>✓ {c.orders}</span>
                      : <span className={styles.noOrders}>—</span>
                    }
                  </td>

                  {/* Last active */}
                  <td>
                    <span className={styles.dateText}>
                      {new Date(c.lastActive).toLocaleDateString('en-PH', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}