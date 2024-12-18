import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { rows } = await db.query('SELECT * FROM uslugi', [])
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const { nazwa, czas, kolor } = await request.json()
  const { rows } = await db.query(
    'INSERT INTO uslugi (nazwa, czas, kolor) VALUES ($1, $2, $3) RETURNING *',
    [nazwa, czas, kolor]
  )
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const { id, nazwa, czas, kolor } = await request.json()
  const { rows } = await db.query(
    'UPDATE uslugi SET nazwa = $1, czas = $2, kolor = $3 WHERE id = $4 RETURNING *',
    [nazwa, czas, kolor, id]
  )
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await db.query('DELETE FROM uslugi WHERE id = $1', [id])
  return NextResponse.json({ message: 'Usługa usunięta' })
}

