import Link from 'next/link'
import styles from './CustomerFooter.module.css'
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from 'react-icons/fi'

export default function CustomerFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Top row */}
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <span className={styles.brandName}>UKAY</span>
            <span className={styles.brandSub}>STUDIO</span>
          </div>
          <p className={styles.tagline}>
            Curated pre-loved fashion for the conscious generation.
          </p>
          <div className={styles.socials}>
            <Link href="#" className={styles.socialBtn}><FiInstagram size={18} /></Link>
            <Link href="#" className={styles.socialBtn}><FiFacebook size={18} /></Link>
            <Link href="#" className={styles.socialBtn}><FiTwitter size={18} /></Link>
            <Link href="#" className={styles.socialBtn}><FiMail size={18} /></Link>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottomRow}>
          <span className={styles.copy}>© {new Date().getFullYear()} UKAY Studio. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <Link href="#" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="#" className={styles.bottomLink}>Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}