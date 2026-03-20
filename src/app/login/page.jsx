'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.brandIcon}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="14" fill="rgba(255,255,255,0.15)" />
            <path d="M16 20l5-6h14l5 6H16z" fill="white" opacity="0.9" />
            <path d="M14 20h28v18a2 2 0 01-2 2H16a2 2 0 01-2-2V20z" fill="white" />
            <path d="M22 26a6 6 0 0012 0" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        <h1 className={styles.brandName}>UKAY</h1>
        <p className={styles.brandTagline}>
          Pre-loved fashion,<br />reimagined for everyone.
        </p>

        <div className={styles.brandDivider} />

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureDot} />
            Manage orders &amp; inventory
          </div>
          <div className={styles.feature}>
            <span className={styles.featureDot} />
            Track customer activity
          </div>
          <div className={styles.feature}>
            <span className={styles.featureDot} />
            Real-time sales analytics
          </div>
          <div className={styles.feature}>
            <span className={styles.featureDot} />
            Secure admin access
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your admin account to continue.</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading || !username.trim() || !password}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className={styles.footer}>
            Ukay E-Commerce &copy; {new Date().getFullYear()} &middot; Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
