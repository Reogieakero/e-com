import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// PATCH — update inquiry status
export async function PATCH(request, { params }) {
  const supabase = createAdminClient()
  const { id } = await params

  try {
    const { status } = await request.json()

    if (!['pending', 'resolved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}