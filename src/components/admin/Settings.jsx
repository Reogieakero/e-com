'use client'
import React from 'react'
import styles from './Settings.module.css'
import { useTheme } from '../../context/ThemeContext'
import { FiSun, FiMoon, FiMonitor, FiCheck } from 'react-icons/fi'

const THEMES = [
  {
    id: 'light',
    label: 'Light',
    description: 'Clean white background, easy on the eyes during the day.',
    icon: <FiSun size={22} />,
    preview: {
      bg: '#f9fafb',
      card: '#ffffff',
      sidebar: '#ffffff',
      accent: '#f97316',
      text: '#111827',
      sub: '#6b7280',
    },
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Dark surface reduces eye strain in low-light environments.',
    icon: <FiMoon size={22} />,
    preview: {
      bg: '#111827',
      card: '#1f2937',
      sidebar: '#1f2937',
      accent: '#f97316',
      text: '#f9fafb',
      sub: '#9ca3af',
    },
  },
  {
    id: 'system',
    label: 'System',
    description: 'Automatically follows your device\'s system preference.',
    icon: <FiMonitor size={22} />,
    preview: {
      bg: 'linear-gradient(135deg, #f9fafb 50%, #111827 50%)',
      card: '#ffffff',
      sidebar: '#1f2937',
      accent: '#f97316',
      text: '#374151',
      sub: '#6b7280',
    },
  },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className={styles.container}>

      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Settings</h1>
          <p>Customize your admin panel preferences.</p>
        </div>
      </header>

      {/* Appearance section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Appearance</h2>
          <p>Choose how the admin panel looks. Changes apply instantly.</p>
        </div>

        <div className={styles.themeGrid}>
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`${styles.themeCard} ${theme === t.id ? styles.themeCardActive : ''}`}
              onClick={() => setTheme(t.id)}
            >
              {/* Mini preview */}
              <div className={styles.preview} style={{ background: t.preview.bg }}>
                <div className={styles.previewSidebar} style={{ background: t.preview.sidebar }}>
                  {[1,2,3].map(i => (
                    <div key={i} className={styles.previewSidebarItem}
                      style={{ background: i === 1 ? t.preview.accent : t.preview.card, opacity: i === 1 ? 1 : 0.5 }}
                    />
                  ))}
                </div>
                <div className={styles.previewMain}>
                  <div className={styles.previewNavbar} style={{ background: t.preview.card }} />
                  <div className={styles.previewCards}>
                    {[1,2].map(i => (
                      <div key={i} className={styles.previewCard} style={{ background: t.preview.card }} />
                    ))}
                  </div>
                  <div className={styles.previewCard2} style={{ background: t.preview.card }} />
                </div>
              </div>

              {/* Label row */}
              <div className={styles.themeInfo}>
                <div className={styles.themeIconLabel}>
                  <span className={styles.themeIcon}
                    style={{ color: theme === t.id ? t.preview.accent : undefined }}
                  >
                    {t.icon}
                  </span>
                  <span className={styles.themeLabel}>{t.label}</span>
                </div>
                {theme === t.id && (
                  <span className={styles.activeCheck}>
                    <FiCheck size={13} />
                  </span>
                )}
              </div>
              <p className={styles.themeDesc}>{t.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>About</h2>
          <p>System information.</p>
        </div>
        <div className={styles.aboutCard}>
          <div className={styles.aboutRow}>
            <span className={styles.aboutLabel}>Application</span>
            <span className={styles.aboutValue}>Ukay-Ecom Admin</span>
          </div>
          <div className={styles.aboutRow}>
            <span className={styles.aboutLabel}>Version</span>
            <span className={styles.aboutValue}>1.0.0</span>
          </div>
          <div className={styles.aboutRow}>
            <span className={styles.aboutLabel}>Framework</span>
            <span className={styles.aboutValue}>Next.js 16</span>
          </div>
          <div className={styles.aboutRow}>
            <span className={styles.aboutLabel}>Database</span>
            <span className={styles.aboutValue}>Supabase</span>
          </div>
        </div>
      </section>

    </div>
  )
}