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

        {/* Links */}
        <div className={styles.linksRow}>
          <div className={styles.linkGroup}>
            <span className={styles.linkTitle}>Shop</span>
            {['New Arrivals', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Sale'].map(l => (
              <Link key={l} href="#products" className={styles.link}>{l}</Link>
            ))}
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.linkTitle}>Help</span>
            {['FAQs', 'Shipping Info', 'Returns', 'Size Guide', 'Contact Us'].map(l => (
              <Link key={l} href="#" className={styles.link}>{l}</Link>
            ))}
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.linkTitle}>About</span>
            {['Our Story', 'Sustainability', 'Careers', 'Press'].map(l => (
              <Link key={l} href="#" className={styles.link}>{l}</Link>
            ))}
          </div>
          <div className={styles.newsletter}>
            <span className={styles.linkTitle}>Stay in the loop</span>
            <p className={styles.newsletterDesc}>New drops and exclusive deals — straight to your inbox.</p>
            <div className={styles.emailRow}>
              <input type="email" placeholder="your@email.com" className={styles.emailInput} />
              <button className={styles.emailBtn}>Subscribe</button>
            </div>
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