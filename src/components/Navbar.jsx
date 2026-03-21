'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { FiSearch, FiLogOut } from 'react-icons/fi';

function Navbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    } finally {
      router.push('/login');
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* Brand — same style as CustomerNavbar */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>✦</span>
        <span className={styles.brandName}>UKAY</span>
        <span className={styles.brandSub}>STUDIO</span>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} size={16} />
          <input type="text" placeholder="Search dashboard..." />
        </div>

        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <FiLogOut size={15} />
          <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;