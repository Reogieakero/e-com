'use client';

import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/customers': 'Customers',
  '/admin/categories': 'Categories',
  '/admin/analytics': 'Analytics',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

export default function Navbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Dashboard';

  return (
    <header className={styles.navbar}>
      {/* Left */}
      <div className={styles.left}>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.breadcrumb}>
            Admin / <span>{title}</span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {/* Notification bell */}
        <button className={styles.notifBtn} aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className={styles.notifDot} />
        </button>

        {/* User chip */}
        <div className={styles.userChip}>
          <div className={styles.avatar}>AD</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
