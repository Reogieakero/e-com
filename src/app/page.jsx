import { createClient } from '@supabase/supabase-js'
import CustomerNavbar from '../components/customer/CustomerNavbar'
import HeroCarousel from '../components/customer/HeroCarousel'
import ProductGrid from '../components/customer/ProductGrid'
import CustomerFooter from '../components/customer/CustomerFooter'
import styles from './customer.module.css'

export const metadata = {
  title: 'UKAY — Curated Pre-loved Fashion',
  description: 'Discover unique pre-loved fashion pieces at unbeatable prices.',
}

export const revalidate = 60 // re-fetch from Supabase every 60 seconds

export default async function CustomerPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('Failed to fetch products:', error.message)

  return (
    <div className={styles.page}>
      <CustomerNavbar />
      <HeroCarousel />
      <ProductGrid products={products || []} />
      <CustomerFooter />
    </div>
  )
}