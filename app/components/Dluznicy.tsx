'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface Wizyta {
  id: number
  godzina: string
  imieNazwisko: string
  telefon: string
  data: string
  oplacona: boolean
}

export default function Dluznicy() {
  const [nieoplaconeWizyty, setNieoplaconeWizyty] = useState<Wizyta[]>([])

  useEffect(() => {
    // Tu powinno być pobieranie danych z API lub bazy danych
    // Na potrzeby przykładu użyjemy mocowanych danych
    const mockWizyty: Wizyta[] = [
      { id: 1, godzina: '10:00', imieNazwisko: 'Jan Kowalski', telefon: '123456789', data: '2023-06-01', oplacona: false },
      { id: 2, godzina: '11:30', imieNazwisko: 'Anna Nowak', telefon: '987654321', data: '2023-06-02', oplacona: false },
    ]
    setNieoplaconeWizyty(mockWizyty)
  }, [])

  const oplacWizyte = (id: number) => {
    setNieoplaconeWizyty(nieoplaconeWizyty.filter(wizyta => wizyta.id !== id))
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Lista dłużników</h3>
      <ul>
        {nieoplaconeWizyty.map(wizyta => (
          <li key={wizyta.id} className="mb-4 p-4 bg-red-100 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{wizyta.imieNazwisko}</p>
                <p className="text-sm">{wizyta.telefon}</p>
                <p className="text-sm">{wizyta.data} {wizyta.godzina}</p>
              </div>
              <Button onClick={() => oplacWizyte(wizyta.id)}>Oznacz jako opłacone</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

