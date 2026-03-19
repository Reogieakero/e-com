import React from 'react';
import styles from './DashboardHome.module.css';
import { FiTrendingUp, FiShoppingBag, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const DashboardHome = () => {
  const stats = [
    { id: 1, label: 'Monthly Sales', value: '₱24,500', icon: <FiTrendingUp />, color: 'var(--primary)' },
    { id: 2, label: 'Total Orders', value: '156', icon: <FiShoppingBag />, color: 'var(--gray-800)' },
    { id: 3, label: 'Low Stock', value: '12 Items', icon: <FiAlertCircle />, color: '#ef4444' },
    { id: 4, label: 'Completed', value: '142', icon: <FiCheckCircle />, color: '#10b981' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <p className={styles.label}>{stat.label}</p>
              <h2 className={styles.value}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Transactions</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vintage Levis 501</td>
                <td>₱1,200</td>
                <td><span className={styles.badgeSuccess}>Sold</span></td>
              </tr>
              <tr>
                <td>Oversized Graphic Tee</td>
                <td>₱450</td>
                <td><span className={styles.badgePending}>Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Inventory Alerts</h3>
          <div className={styles.alertItem}>
            <span className={styles.dot}></span>
            <p>5 items in <strong>Jackets</strong> are running low.</p>
          </div>
          <div className={styles.alertItem}>
            <span className={styles.dot}></span>
            <p>Restock request for <strong>Denim</strong> category.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;