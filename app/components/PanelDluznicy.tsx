'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Wizyta {
  id: number
  data: Date
  godzina: string
  imie: string
  nazwisko: string
  telefon: string
  uslugi: { nazwa: string; kolor: string }[]
  notatki: string
  oplacona: boolean
}

export default function PanelDluznicy() {
  const [nieoplaconeWizyty, setNieoplaconeWizyty] = useState<Wizyta[]>([])

  useEffect(() => {
    fetchNieoplaconeWizyty()
  }, [])

  const fetchNieoplaconeWizyty = async () => {
    try {
      const response = await fetch('/api/wizyty?oplacona=false')
      if (!response.ok) throw new Error('Błąd podczas pobierania nieopłaconych wizyt')
      const data = await response.json()
      setNieoplaconeWizyty(data.map((wizyta: any) => ({
        ...wizyta,
        data: new Date(wizyta.data)
      })))
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać listy nieopłaconych wizyt",
        variant: "destructive",
      })
    }
  }

  const oplacWizyte = async (id: number) => {
    try {
      const response = await fetch('/api/wizyty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, oplacona: true })
      })
      if (!response.ok) throw new Error('Błąd podczas oznaczania wizyty jako opłaconej')
      setNieoplaconeWizyty(nieoplaconeWizyty.filter(wizyta => wizyta.id !== id))
      toast({
        title: "Sukces",
        description: "Wizyta została oznaczona jako opłacona",
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się oznaczyć wizyty jako opłaconej",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Lista dłużników</h2>
        {nieoplaconeWizyty.length === 0 ? (
          <p className="text-gray-500">Brak nieopłaconych wizyt.</p>
        ) : (
          <ul className="space-y-4">
            {nieoplaconeWizyty.map(wizyta => (
              <li key={wizyta.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{`${wizyta.imie} ${wizyta.nazwisko}`}</p>
                    <p className="text-sm text-gray-600">{wizyta.telefon}</p>
                    <p className="text-sm">
                      {new Date(wizyta.data).toLocaleDateString('pl-PL')} {wizyta.godzina}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {wizyta.uslugi.map((usluga, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: usluga.kolor, color: '#37352F' }}
                        >
                          {usluga.nazwa}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => oplacWizyte(wizyta.id)} className="bg-green-500 hover:bg-green-600 text-white">
                    Oznacz jako opłacone
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

