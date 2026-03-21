import { createClient } from '@supabase/supabase-js'
import CustomerNavbar from '../../components/customer/CustomerNavbar'
import CustomerFooter from '../../components/customer/CustomerFooter'
import ProductGrid from '../../components/customer/ProductGrid'
import styles from './sale.module.css'

export const metadata = { title: 'Sale — UKAY Studio' }
export const revalidate = 60

export default async function SalePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'Sale')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.page}>
      <CustomerNavbar />
      <div className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80"
          alt="Sale"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>— Limited Time</span>
          <h1 className={styles.heroTitle}>Sale</h1>
          <p className={styles.heroSub}>Major markdowns on selected pieces. Shop before they&apos;re gone.</p>
        </div>
      </div>
      <ProductGrid products={products || []} hideFilters />
      <CustomerFooter />
    </div>
  )
}