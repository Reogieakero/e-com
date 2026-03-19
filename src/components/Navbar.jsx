import React from 'react';
import styles from './Navbar.module.css';
import { FiSearch } from 'react-icons/fi';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}></div>
          <h1 className={styles.brandName}>Ukay-Ecom</h1>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search dashboard..." />
        </div>
        
        <button className={styles.logoutBtn}>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;