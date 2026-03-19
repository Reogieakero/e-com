'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../hooks/useSidebar';
import DashboardHome from '../../components/admin/DashboardHome'; 
import Inventory from '../../components/admin/Inventory';
import styles from './Admin.module.css';

function AdminRoot() {
  const { activeView, isCollapsed, handleNavigate, toggleSidebar } = useSidebar('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardHome />;
      case 'inventory': return <Inventory />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className={styles.adminWrapper}>
      <Navbar />
      <div className={styles.layoutBody}>
        <Sidebar 
          activeView={activeView} 
          onNavigate={handleNavigate} 
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className={styles.adminMain}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminRoot;