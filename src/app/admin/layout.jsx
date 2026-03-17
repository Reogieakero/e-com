import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
