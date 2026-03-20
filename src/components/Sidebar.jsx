'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import { 
  FiHome, FiPackage, FiTruck, FiUsers, 
  FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';

function Sidebar({ activeView, onNavigate, isCollapsed, toggleSidebar }) {
  const menuItems = [
    { icon: <FiHome />, label: 'Dashboard', id: 'dashboard' },
    { icon: <FiPackage />, label: 'Inventory', id: 'inventory' },
    { icon: <FiTruck />, label: 'Orders', id: 'orders' },
    { icon: <FiUsers />, label: 'Customers', id: 'customers' },
    { icon: <FiBarChart2 />, label: 'Reports', id: 'reports' },
    { icon: <FiSettings />, label: 'Settings', id: 'settings' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.menuItem} ${activeView === item.id ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.label}>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Toggle button is the ONLY thing that collapses/expands */}
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
    </aside>
  );
}

export default Sidebar;