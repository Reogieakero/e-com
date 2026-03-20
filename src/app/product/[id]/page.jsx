import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import CustomerNavbar from '../../../components/customer/CustomerNavbar'
import CustomerFooter from '../../../components/customer/CustomerFooter'
import ProductDetail from '../../../components/customer/ProductDetail'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const { data } = await supabase.from('products').select('name').eq('id', id).single()
  return { title: data?.name ? `${data.name} — UKAY Studio` : 'Product — UKAY Studio' }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  // Fetch related products (same category, exclude current)
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', id)
    .limit(4)

  return (
    <>
      <CustomerNavbar />
      <ProductDetail product={product} related={related || []} />
      <CustomerFooter />
    </>
  )
}