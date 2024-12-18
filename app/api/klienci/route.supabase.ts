import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('klienci').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { imie, nazwisko, telefon } = await request.json()
  const { data, error } = await supabase
    .from('klienci')
    .insert({ imie, nazwisko, telefon })
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function PUT(request: Request) {
  const { id, imie, nazwisko, telefon } = await request.json()
  const { data, error } = await supabase
    .from('klienci')
    .update({ imie, nazwisko, telefon })
    .eq('id', id)
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const { error } = await supabase.from('klienci').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Klient usunięty' })
}

