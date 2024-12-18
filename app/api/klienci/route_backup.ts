import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { rows } = await db.query('SELECT * FROM klienci', [])
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const { imie, nazwisko, telefon } = await request.json()
  const { rows } = await db.query(
    'INSERT INTO klienci (imie, nazwisko, telefon) VALUES ($1, $2, $3) RETURNING *',
    [imie, nazwisko, telefon]
  )
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const { id, imie, nazwisko, telefon } = await request.json()
  const { rows } = await db.query(
    'UPDATE klienci SET imie = $1, nazwisko = $2, telefon = $3 WHERE id = $4 RETURNING *',
    [imie, nazwisko, telefon, id]
  )
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await db.query('DELETE FROM klienci WHERE id = $1', [id])
  return NextResponse.json({ message: 'Klient usunięty' })
}

