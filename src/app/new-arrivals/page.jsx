import { createClient } from '@supabase/supabase-js'
import CustomerNavbar from '../../components/customer/CustomerNavbar'
import CustomerFooter from '../../components/customer/CustomerFooter'
import ProductGrid from '../../components/customer/ProductGrid'
import styles from './new-arrivals.module.css'

export const metadata = { title: 'New Arrivals — UKAY Studio' }
export const revalidate = 60

export default async function NewArrivalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'New Arrivals')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.page}>
      <CustomerNavbar />
      <div className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="New Arrivals"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>— Just Dropped</span>
          <h1 className={styles.heroTitle}>New Arrivals</h1>
          <p className={styles.heroSub}>Fresh pieces added to the collection. Be the first to grab them.</p>
        </div>
      </div>
      <ProductGrid products={products || []} hideFilters />
      <CustomerFooter />
    </div>
  )
}