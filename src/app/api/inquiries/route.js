import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET() {
  const supabase = createAdminClient()

  // Fetch inquiries and join product image + price from products table
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // Enrich with product image and price
  const productIds = [...new Set(inquiries.map(i => i.product_id).filter(Boolean))]
  let productMap = {}

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, images, price, discount')
      .in('id', productIds)

    if (products) {
      products.forEach(p => {
        productMap[p.id] = {
          product_image: p.images?.[0] || null,   // first image for table thumb
          product_images: p.images || [],           // all images for modal gallery
          product_price: p.price,
          product_discount: p.discount || 0,
        }
      })
    }
  }

  const enriched = inquiries.map(i => ({
    ...i,
    ...(productMap[i.product_id] || {}),
  }))

  return NextResponse.json({ success: true, inquiries: enriched })
}

export async function POST(request) {
  const supabase = createAdminClient()

  try {
    const { product_id, product_name, name, phone, message } = await request.json()

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ success: false, error: 'Name and phone are required.' }, { status: 400 })
    }

    const { error } = await supabase.from('inquiries').insert([{
      product_id,
      product_name,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      message: message?.trim() || null,
      status: 'pending',
    }])

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}