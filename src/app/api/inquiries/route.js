import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
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
      console.error('Inquiry DB Error:', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}