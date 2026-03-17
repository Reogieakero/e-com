import styles from './dashboard.module.css';

const stats = [
  {
    label: 'Total Revenue',
    value: '₱184,320',
    badge: '+12.5%',
    trend: 'up',
    color: 'orange',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: 'Total Orders',
    value: '1,284',
    badge: '+8.1%',
    trend: 'up',
    color: 'green',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: 'Customers',
    value: '3,657',
    badge: '+4.3%',
    trend: 'up',
    color: 'blue',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Products Listed',
    value: '842',
    badge: '-2.0%',
    trend: 'down',
    color: 'purple',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
];

const recentOrders = [
  { id: '#ORD-1042', customer: 'Maria Santos', amount: '₱980', status: 'Delivered', date: 'Mar 17' },
  { id: '#ORD-1041', customer: 'Juan Dela Cruz', amount: '₱1,240', status: 'Processing', date: 'Mar 17' },
  { id: '#ORD-1040', customer: 'Ana Reyes', amount: '₱560', status: 'Pending', date: 'Mar 16' },
  { id: '#ORD-1039', customer: 'Carlos Lim', amount: '₱2,100', status: 'Delivered', date: 'Mar 16' },
  { id: '#ORD-1038', customer: 'Sofia Garcia', amount: '₱430', status: 'Cancelled', date: 'Mar 15' },
];

const topProducts = [
  { name: 'Vintage Denim Jacket', sold: 148, revenue: '₱44,400', emoji: '🧥' },
  { name: 'Floral Summer Dress', sold: 122, revenue: '₱36,600', emoji: '👗' },
  { name: 'Classic White Tee', sold: 110, revenue: '₱11,000', emoji: '👕' },
  { name: 'High-waist Mom Jeans', sold: 95, revenue: '₱28,500', emoji: '👖' },
  { name: 'Linen Oversized Blazer', sold: 78, revenue: '₱46,800', emoji: '🧣' },
];

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Good morning, Admin 👋</h2>
          <p className={styles.pageDate}>
            {new Date().toLocaleDateString('en-PH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles[stat.color]}`}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
            <span className={`${styles.statBadge} ${styles[stat.trend]}`}>
              {stat.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className={styles.contentGrid}>
        {/* Recent orders */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Orders</h3>
            <a href="/admin/orders" className={styles.cardAction}>View all →</a>
          </div>
          <div className={styles.cardBody}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderId}>{order.id}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.miniAvatar}>
                          {getInitials(order.customer)}
                        </div>
                        {order.customer}
                      </div>
                    </td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Top Products</h3>
            <a href="/admin/products" className={styles.cardAction}>View all →</a>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.productList}>
              {topProducts.map((product, i) => (
                <div key={product.name} className={styles.productItem}>
                  <span className={styles.productRank}>#{i + 1}</span>
                  <div className={styles.productThumb}>{product.emoji}</div>
                  <div className={styles.productDetails}>
                    <div className={styles.productName}>{product.name}</div>
                    <div className={styles.productSold}>{product.sold} sold</div>
                  </div>
                  <span className={styles.productRevenue}>{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
