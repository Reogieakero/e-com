'use server'
import { createClient } from '../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData) {
  const supabase = await createClient()
  
  try {
    const files = formData.getAll('images')
    const imageUrls = []

    for (const file of files) {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
        
        const { data, error: uploadError } = await supabase.storage
          .from('product-image')
          .upload(fileName, file)

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

    const productData = {
      name: formData.get('name'),
      category: formData.get('category') || 'General',
      price: parseFloat(formData.get('price')) || 0,
      discount: parseFloat(formData.get('discount')) || 0,
      stock: parseInt(formData.get('stock')) || 0,
      images: imageUrls,
      status: parseInt(formData.get('stock')) > 0 ? 'In Stock' : 'Sold Out'
    }

    const { error: dbError } = await supabase.from('products').insert([productData])
    
    if (dbError) {
      console.error('Database Error:', dbError.message)
      return { success: false, error: dbError.message }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('System Error:', err.message)
    return { success: false, error: err.message }
  }
}