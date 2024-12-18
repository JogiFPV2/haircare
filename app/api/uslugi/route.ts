import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('uslugi').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { nazwa, czas, kolor } = await request.json()
  const { data, error } = await supabase
    .from('uslugi')
    .insert({ nazwa, czas, kolor })
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function PUT(request: Request) {
  const { id, nazwa, czas, kolor } = await request.json()
  const { data, error } = await supabase
    .from('uslugi')
    .update({ nazwa, czas, kolor })
    .eq('id', id)
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const { error } = await supabase.from('uslugi').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Usługa usunięta' })
}

