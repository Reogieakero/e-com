'use client'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './DashboardHome.module.css'
import {
  FiTrendingUp, FiShoppingBag, FiPackage,
  FiMessageSquare, FiAlertCircle, FiCheckCircle,
  FiArrowUpRight, FiArrowDownRight
} from 'react-icons/fi'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// ── Custom Tooltip ──────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      {label && <p className={styles.tooltipLabel}>{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipName}>{entry.name}:</span>
          <span className={styles.tooltipVal}>{prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{suffix}</span>
        </div>
      ))}
    </div>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipDot} style={{ background: d.payload.fill }} />
        <span className={styles.tooltipName}>{d.name}:</span>
        <span className={styles.tooltipVal}>{d.value} ({d.payload.pct}%)</span>
      </div>
    </div>
  )
}

// ── Stat Card ───────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, trend, trendUp, accent }) => (
  <div className={styles.statCard} style={{ '--accent': accent }}>
    <div className={styles.statTop}>
      <div className={styles.statIconWrap} style={{ background: `${accent}18`, color: accent }}>
        {icon}
      </div>
      {trend != null && (
        <span className={`${styles.trendBadge} ${trendUp ? styles.trendUp : styles.trendDown}`}>
          {trendUp ? <FiArrowUpRight size={11} /> : <FiArrowDownRight size={11} />}
          {trend}%
        </span>
      )}
    </div>
    <div className={styles.statBottom}>
      <p className={styles.statLabel}>{label}</p>
      <h2 className={styles.statValue}>{value}</h2>
      {sub && <p className={styles.statSub}>{sub}</p>}
    </div>
    <div className={styles.statAccentBar} style={{ background: accent }} />
  </div>
)

// ── Section Header ──────────────────────────────────────────────
const SectionHeader = ({ title, sub }) => (
  <div className={styles.sectionHeader}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {sub && <p className={styles.sectionSub}>{sub}</p>}
  </div>
)

const COLORS = {
  primary:  '#f97316',
  green:    '#16a34a',
  red:      '#dc2626',
  amber:    '#d97706',
  blue:     '#2563eb',
  purple:   '#7c3aed',
  gray:     '#6b7280',
}

const PIE_COLORS = [COLORS.primary, COLORS.blue, COLORS.green, COLORS.purple, COLORS.amber]

export default function DashboardHome() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [prodRes, inqRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/inquiries'),
      ])
      const prodData = await prodRes.json()
      const inqData  = await inqRes.json()

      const products  = prodData.products  || []
      const inquiries = inqData.inquiries   || []

      // ── Derived metrics ──────────────────────────────────────
      const orders   = inquiries.filter(i => i.status === 'resolved')
      const pending  = inquiries.filter(i => i.status === 'pending')
      const passed   = inquiries.filter(i => i.status === 'rejected')
      const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5)
      const soldOut  = products.filter(p => p.stock === 0)

      const totalRevenue = orders.reduce((sum, o) => {
        return sum + ((o.product_price || 0) - (o.product_discount || 0))
      }, 0)

      // ── Monthly inquiries (last 6 months) ────────────────────
      const now = new Date()
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        return {
          key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: d.toLocaleString('default', { month: 'short' }),
          inquiries: 0, orders: 0, revenue: 0
        }
      })

      inquiries.forEach(inq => {
        const d   = new Date(inq.created_at)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const m   = months.find(m => m.key === key)
        if (!m) return
        m.inquiries++
        if (inq.status === 'resolved') {
          m.orders++
          m.revenue += (inq.product_price || 0) - (inq.product_discount || 0)
        }
      })

      // ── Category breakdown ───────────────────────────────────
      const catMap = {}
      products.forEach(p => {
        const c = p.category || 'General'
        catMap[c] = (catMap[c] || 0) + 1
      })
      const total = products.length || 1
      const categoryData = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
          name, value,
          pct: Math.round((value / total) * 100),
          fill: PIE_COLORS[Object.keys(catMap).indexOf(name) % PIE_COLORS.length]
        }))

      // ── Inquiry status breakdown ─────────────────────────────
      const statusData = [
        { name: 'Pending',   value: pending.length,  fill: COLORS.amber },
        { name: 'Done Deal', value: orders.length,   fill: COLORS.green },
        { name: 'Pass',      value: passed.length,   fill: COLORS.red },
      ].filter(d => d.value > 0)

      // ── Stock health bar ─────────────────────────────────────
      const stockBar = [
        { name: 'Healthy',  value: products.filter(p => p.stock > 5).length,  fill: COLORS.green },
        { name: 'Low Stock',value: lowStock.length,                             fill: COLORS.amber },
        { name: 'Sold Out', value: soldOut.length,                              fill: COLORS.red },
      ]

      // ── Recent orders (last 5) ───────────────────────────────
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)

      setData({
        totalRevenue, orders, pending, passed,
        products, lowStock, soldOut,
        months, categoryData, statusData, stockBar, recentOrders,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading || !data) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.dots}><span /><span /><span /></div>
      </div>
    )
  }

  const {
    totalRevenue, orders, pending, products, lowStock, soldOut,
    months, categoryData, statusData, stockBar, recentOrders,
  } = data

  const convRate = orders.length + pending.length > 0
    ? Math.round((orders.length / (orders.length + pending.length + data.passed.length)) * 100)
    : 0

  return (
    <div className={styles.container}>

      {/* ── Greeting ── */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetTitle}>Welcome back 👋</h1>
          <p className={styles.greetSub}>Here&apos;s what&apos;s happening in your store today.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Revenue"
          value={`₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
          sub={`From ${orders.length} done deals`}
          icon={<FiTrendingUp size={18} />}
          accent={COLORS.primary}
        />
        <StatCard
          label="Total Orders"
          value={orders.length}
          sub="Confirmed done deals"
          icon={<FiShoppingBag size={18} />}
          accent={COLORS.green}
        />
        <StatCard
          label="Pending Inquiries"
          value={pending.length}
          sub="Awaiting response"
          icon={<FiMessageSquare size={18} />}
          accent={COLORS.amber}
        />
        <StatCard
          label="Total Products"
          value={products.length}
          sub={`${soldOut.length} sold out · ${lowStock.length} low stock`}
          icon={<FiPackage size={18} />}
          accent={COLORS.blue}
        />
        <StatCard
          label="Conversion Rate"
          value={`${convRate}%`}
          sub="Inquiries → Done Deal"
          icon={<FiCheckCircle size={18} />}
          accent={COLORS.purple}
        />
        <StatCard
          label="Low Stock Alerts"
          value={lowStock.length + soldOut.length}
          sub={`${soldOut.length} items sold out`}
          icon={<FiAlertCircle size={18} />}
          accent={COLORS.red}
        />
      </div>

      {/* ── Row 1: Line + Pie ── */}
      <div className={styles.row2}>

        {/* Monthly Inquiries & Orders Line Chart */}
        <div className={styles.chartCard}>
          <SectionHeader title="Monthly Activity" sub="Inquiries vs confirmed orders over 6 months" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={months} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontFamily: 'Kulim Park', fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Kulim Park', fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Kulim Park', fontSize: 12 }} />
              <Line type="monotone" dataKey="inquiries" name="Inquiries" stroke={COLORS.amber} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.amber }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="orders" name="Done Deal" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.green }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inquiry Status Pie */}
        <div className={styles.chartCard}>
          <SectionHeader title="Inquiry Status" sub="Breakdown of all customer inquiries" />
          {statusData.length === 0 ? (
            <div className={styles.noData}>No inquiry data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'Kulim Park', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row 2: Bar + Pie ── */}
      <div className={styles.row2}>

        {/* Monthly Revenue Bar */}
        <div className={styles.chartCard}>
          <SectionHeader title="Monthly Revenue" sub="Revenue from Done Deal orders (₱)" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={months} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontFamily: 'Kulim Park', fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Kulim Park', fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip prefix="₱" />} />
              <Bar dataKey="revenue" name="Revenue" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className={styles.chartCard}>
          <SectionHeader title="Products by Category" sub="Inventory distribution per category" />
          {categoryData.length === 0 ? (
            <div className={styles.noData}>No products yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'Kulim Park', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row 3: Stock Health + Recent Orders ── */}
      <div className={styles.row2}>

        {/* Stock Health Bar */}
        <div className={styles.chartCard}>
          <SectionHeader title="Stock Health" sub="Current inventory condition overview" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stockBar} layout="vertical" margin={{ top: 4, right: 12, left: 20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: 'Kulim Park', fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontFamily: 'Kulim Park', fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={<ChartTooltip suffix=" items" />} />
              <Bar dataKey="value" name="Items" radius={[0, 4, 4, 0]}>
                {stockBar.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className={styles.chartCard}>
          <SectionHeader title="Recent Orders" sub="Latest 5 confirmed done deals" />
          {recentOrders.length === 0 ? (
            <div className={styles.noData}>No orders yet.</div>
          ) : (
            <div className={styles.recentList}>
              {recentOrders.map((o, i) => {
                const fp = ((o.product_price || 0) - (o.product_discount || 0)).toFixed(2)
                return (
                  <div key={o.id} className={styles.recentRow}>
                    <div className={styles.recentImg}>
                      {o.product_image
                        ? <img src={o.product_image} alt={o.product_name} />
                        : <FiPackage size={14} />
                      }
                    </div>
                    <div className={styles.recentInfo}>
                      <p className={styles.recentProduct}>{o.product_name || '—'}</p>
                      <p className={styles.recentCustomer}>{o.customer_name}</p>
                    </div>
                    <div className={styles.recentRight}>
                      <span className={styles.recentPrice}>₱{fp}</span>
                      <span className={styles.recentDate}>
                        {new Date(o.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}