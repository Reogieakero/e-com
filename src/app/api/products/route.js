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

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, products: data })
}

export async function POST(request) {
  const supabase = createAdminClient()

  try {
    const formData = await request.formData()

    // Upload images
    const files = formData.getAll('images')
    const imageUrls = []

    for (const file of files) {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`

        const { error: uploadError } = await supabase.storage
          .from('product-image')
          .upload(fileName, file, { contentType: file.type, upsert: false })

        if (uploadError) {
          console.error('Upload Error:', uploadError.message)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-image')
          .getPublicUrl(fileName)

        imageUrls.push(publicUrl)
      }
    }

    // Collect bullet description points
    const description = formData.getAll('description[]').filter(d => d.trim() !== '')

    const stock = parseInt(formData.get('stock')) || 0

    const productData = {
      name: formData.get('name'),
      category: formData.get('category') || 'General',
      price: parseFloat(formData.get('price')) || 0,
      discount: parseFloat(formData.get('discount')) || 0,
      stock,
      images: imageUrls,
      description,
      status: stock > 0 ? 'In Stock' : 'Sold Out',
    }

    const { error: dbError } = await supabase.from('products').insert([productData])

    if (dbError) {
      console.error('Database Error:', dbError.message)
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('System Error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}