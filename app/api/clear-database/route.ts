import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    await supabase.from('wizyty').delete().neq('id', 0)
    await supabase.from('klienci').delete().neq('id', 0)
    await supabase.from('uslugi').delete().neq('id', 0)
    
    return NextResponse.json({ message: 'Database cleared successfully' })
  } catch (error) {
    console.error('Error clearing database:', error)
    return NextResponse.json({ error: 'Failed to clear database' }, { status: 500 })
  }
}

