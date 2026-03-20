import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// PATCH /api/products/[id]
export async function PATCH(request, { params }) {
  const supabase = createAdminClient()
  const { id } = await params

  try {
    const formData = await request.formData()

    // Handle new image uploads
    const files = formData.getAll('images')
    const existingImages = formData.getAll('existingImages')
    const imageUrls = [...existingImages]

    for (const file of files) {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
          .from('product-image')
          .upload(fileName, file, { contentType: file.type, upsert: false })

        if (uploadError) { console.error('Upload Error:', uploadError.message); continue }

        const { data: { publicUrl } } = supabase.storage
          .from('product-image')
          .getPublicUrl(fileName)

        imageUrls.push(publicUrl)
      }
    }

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

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
  const supabase = createAdminClient()
  const { id } = await params

  try {
    // Fetch images to delete from storage too
    const { data: product } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single()

    if (product?.images?.length) {
      const filePaths = product.images.map(url => url.split('/product-image/')[1]).filter(Boolean)
      if (filePaths.length) {
        await supabase.storage.from('product-image').remove(filePaths)
      }
    }

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}