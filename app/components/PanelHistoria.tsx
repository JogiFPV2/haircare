'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"

interface Wizyta {
  id: number;
  data: Date;
  godzina: string;
  imieNazwisko: string;
  telefon: string;
  uslugi: { nazwa: string; kolor: string }[];
  notatki: string;
  oplacona: boolean;
}

export default function PanelHistoria() {
  const [wizyty, setWizyty] = useState<Wizyta[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filteredWizyty, setFilteredWizyty] = useState<Wizyta[]>([])

  useEffect(() => {
    fetchWizyty()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const filtered = wizyty.filter(wizyta => 
        new Date(wizyta.data).toDateString() === selectedDate.toDateString()
      )
      setFilteredWizyty(filtered)
    }
  }, [selectedDate, wizyty])

  const fetchWizyty = async () => {
    try {
      const response = await fetch('/api/wizyty')
      if (!response.ok) throw new Error('Błąd podczas pobierania wizyt')
      const data = await response.json()
      setWizyty(data.map((wizyta: any) => ({
        ...wizyta,
        data: new Date(wizyta.data)
      })))
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać historii wizyt",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold mb-8">Historia Wizyt</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Wybierz datę</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Wizyty w wybranym dniu</h3>
            {filteredWizyty.length > 0 ? (
              <ul className="space-y-4">
                {filteredWizyty.map(wizyta => (
                  <li key={wizyta.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{wizyta.godzina} - {wizyta.imieNazwisko}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${wizyta.oplacona ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {wizyta.oplacona ? 'Opłacona' : 'Nieopłacona'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{wizyta.telefon}</p>
                    <div className="mt-2">
                      {wizyta.uslugi.map((usluga, index) => (
                        <span 
                          key={index} 
                          className="inline-block mr-2 mb-2 px-2 py-1 text-xs rounded-full" 
                          style={{ backgroundColor: usluga.kolor, color: '#37352F' }}
                        >
                          {usluga.nazwa}
                        </span>
                      ))}
                    </div>
                    {wizyta.notatki && (
                      <p className="mt-2 text-sm italic">{wizyta.notatki}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Brak wizyt w wybranym dniu.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

