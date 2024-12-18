'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface Wizyta {
  id: number
  godzina: string
  imieNazwisko: string
  telefon: string
  notatki: string
  oplacona: boolean
}

interface ListaWizytProps {
  selectedDate: Date
}

export default function ListaWizyt({ selectedDate }: ListaWizytProps) {
  const [wizyty, setWizyty] = useState<Wizyta[]>([
    { id: 1, godzina: '10:00', imieNazwisko: 'Jan Kowalski', telefon: '123456789', notatki: '', oplacona: false },
    { id: 2, godzina: '11:30', imieNazwisko: 'Anna Nowak', telefon: '987654321', notatki: '', oplacona: true },
  ])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleNotatki = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const updateNotatki = (id: number, notatki: string) => {
    setWizyty(wizyty.map(wizyta => 
      wizyta.id === id ? { ...wizyta, notatki } : wizyta
    ))
  }

  const toggleOplacona = (id: number) => {
    setWizyty(wizyty.map(wizyta => 
      wizyta.id === id ? { ...wizyta, oplacona: !wizyta.oplacona } : wizyta
    ))
  }

  return (
    <ul>
      {wizyty.map(wizyta => (
        <li key={wizyta.id} className={`mb-4 p-4 rounded-lg ${selectedDate.toDateString() === new Date().toDateString() ? 'bg-white' : 'bg-gray-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">{wizyta.godzina}</span>
            <span className="ml-4">{wizyta.imieNazwisko}</span>
            <p className="text-sm text-gray-600">{wizyta.telefon}</p>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="mr-2">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleNotatki(wizyta.id)}
            >
              {expandedId === wizyta.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedId === wizyta.id && (
          <div className="mt-2">
            <Input
              value={wizyta.notatki}
              onChange={(e) => updateNotatki(wizyta.id, e.target.value)}
              placeholder="Dodaj notatki..."
              className="mb-2"
            />
          </div>
        )}
        <Button
          onClick={() => toggleOplacona(wizyta.id)}
          className={`mt-2 ${wizyta.oplacona ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {wizyta.oplacona ? 'Opłacona' : 'Nieopłacona'}
        </Button>
      </li>
    ))}
  </ul>
  )
}

