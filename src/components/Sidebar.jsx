'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import {
  FiHome, FiPackage, FiTruck, FiUsers,
  FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight,
  FiMessageSquare
} from 'react-icons/fi';

function Sidebar({ activeView, onNavigate, isCollapsed, toggleSidebar, inquiryCount = 0 }) {
  const menuItems = [
    { icon: <FiHome />,          label: 'Dashboard', id: 'dashboard' },
    { icon: <FiPackage />,       label: 'Inventory',  id: 'inventory' },
    { icon: <FiMessageSquare />, label: 'Inquiries',  id: 'inquiries', badge: inquiryCount },
    { icon: <FiTruck />,         label: 'Orders',     id: 'orders' },
    { icon: <FiUsers />,         label: 'Customers',  id: 'customers' },
    { icon: <FiSettings />,      label: 'Settings',   id: 'settings' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>

      {/* Clickable background layer — sits behind everything */}
      <div className={styles.sidebarBg} onClick={toggleSidebar} />

      {/* Menu items */}
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.menuItem} ${activeView === item.id ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.label}>{item.label}</span>}
            {item.badge > 0 && (
              <span className={`${styles.badge} ${isCollapsed ? styles.badgeCollapsed : ''}`}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Toggle button pinned to bottom */}
      <div className={styles.toggleWrap}>
        <button
          className={styles.toggleBtn}
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed
            ? <FiChevronRight size={16} />
            : <><FiChevronLeft size={16} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;