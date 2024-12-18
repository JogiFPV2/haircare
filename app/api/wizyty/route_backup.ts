import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { rows } = await db.query('SELECT * FROM wizyty', [])
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const { data, godzina, imieNazwisko, telefon, uslugi, notatki, oplacona } = await request.json()
  const { rows } = await db.query(
    'INSERT INTO wizyty (data, godzina, imie_nazwisko, telefon, uslugi, notatki, oplacona) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [data, godzina, imieNazwisko, telefon, JSON.stringify(uslugi), notatki, oplacona]
  )
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const { id, data, godzina, imieNazwisko, telefon, uslugi, notatki, oplacona } = await request.json()
  const { rows } = await db.query(
    'UPDATE wizyty SET data = $1, godzina = $2, imie_nazwisko = $3, telefon = $4, uslugi = $5, notatki = $6, oplacona = $7 WHERE id = $8 RETURNING *',
    [data, godzina, imieNazwisko, telefon, JSON.stringify(uslugi), notatki, oplacona, id]
  )
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await db.query('DELETE FROM wizyty WHERE id = $1', [id])
  return NextResponse.json({ message: 'Wizyta usunięta' })
}

