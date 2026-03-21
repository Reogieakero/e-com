'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../hooks/useSidebar';
import DashboardHome from '../../components/admin/DashboardHome';
import Inventory from '../../components/admin/Inventory';
import Inquiries from '../../components/admin/Inquiries';
import Orders from '../../components/admin/Orders';
import Customers from '../../components/admin/Customers';
import Settings from '../../components/admin/Settings';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import AdminDesktopOnly from '../../components/admin/AdminDesktopOnly';
import styles from './admin.module.css';

function AdminContent() {
  const { activeView, isCollapsed, handleNavigate, toggleSidebar } = useSidebar('dashboard');
  const { theme } = useTheme();
  const [pendingCount, setPendingCount] = useState(0);

  const resolvedTheme =
    theme === 'system'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light')
      : theme;

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res  = await fetch('/api/inquiries');
        const data = await res.json();
        if (data.success) {
          setPendingCount(data.inquiries.filter(i => i.status === 'pending').length);
        }
      } catch (err) { console.error(err); }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':  return <DashboardHome />;
      case 'inventory':  return <Inventory />;
      case 'inquiries':  return <Inquiries />;
      case 'orders':     return <Orders />;
      case 'customers':  return <Customers />;
      case 'settings':   return <Settings />;
      default:           return <DashboardHome />;
    }
  };

  return (
    <div
      className={styles.adminWrapper}
      data-theme={resolvedTheme}
      suppressHydrationWarning
    >
      <Navbar />
      <div className={styles.layoutBody}>
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          inquiryCount={pendingCount}
        />
        <main className={`${styles.adminMain} ${isCollapsed ? styles.collapsed : ''}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function AdminRoot() {
  return (
    <AdminDesktopOnly>
      <ThemeProvider>
        <AdminContent />
      </ThemeProvider>
    </AdminDesktopOnly>
  );
}