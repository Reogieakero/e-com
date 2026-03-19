// src/app/admin/actions.js
'use server'
import { createClient } from '../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData) {
  const supabase = await createClient()
  
  const files = formData.getAll('images')
  const imageUrls = []

  for (const file of files) {
    if (file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (uploadError) throw new Error(uploadError.message)

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      
      imageUrls.push(publicUrl)
    }
  }

  const productData = {
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    discount: parseFloat(formData.get('discount')) || 0,
    stock: parseInt(formData.get('stock')),
    images: imageUrls,
    status: parseInt(formData.get('stock')) > 0 ? 'In Stock' : 'Sold Out'
  }

  const { error } = await supabase.from('products').insert([productData])
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  return { success: true }
}