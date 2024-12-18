import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('wizyty').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { data, godzina, imieNazwisko, telefon, uslugi, notatki, oplacona } = await request.json()
  const { data: insertedData, error } = await supabase
    .from('wizyty')
    .insert({ data, godzina, imie_nazwisko: imieNazwisko, telefon, uslugi, notatki, oplacona })
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(insertedData[0])
}

export async function PUT(request: Request) {
  const { id, data, godzina, imieNazwisko, telefon, uslugi, notatki, oplacona } = await request.json()
  const { data: updatedData, error } = await supabase
    .from('wizyty')
    .update({ data, godzina, imie_nazwisko: imieNazwisko, telefon, uslugi, notatki, oplacona })
    .eq('id', id)
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(updatedData[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const { error } = await supabase.from('wizyty').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Wizyta usunięta' })
}

