'use client'
import { useEffect, useState } from 'react'
import styles from './AdminDesktopOnly.module.css'
import { FiMonitor } from 'react-icons/fi'

export default function AdminDesktopOnly({ children }) {
  const [isMobile, setIsMobile] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024)
      setChecked(true)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!checked) return null

  if (isMobile) {
    return (
      <div className={styles.blocker}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <FiMonitor size={40} />
          </div>
          <h1 className={styles.title}>Desktop Required</h1>
          <p className={styles.desc}>
            The admin panel is optimized for desktop screens only.
            Please open this page on a computer or laptop with a
            screen width of at least <strong>1024px</strong>.
          </p>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Admin Portal — UKAY Studio
          </div>
        </div>
      </div>
    )
  }

  return children
}