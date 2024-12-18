'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HexColorPicker } from "react-colorful"
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface Usluga {
  id: number
  nazwa: string
  czas: string
  kolor: string
}

const koloryPastelowe = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#FFC6FF', '#BDB2FF', '#A0C4FF', '#9BF6FF', '#CAFFBF',
  '#FDFFB6', '#FFD6A5', '#FFADAD', '#FFC6FF', '#BDB2FF'
]

export default function PanelUslugi() {
  const [uslugi, setUslugi] = useState<Usluga[]>([])
  const [nowaUsluga, setNowaUsluga] = useState({ nazwa: '', czas: '', kolor: '' })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [edytowanaUsluga, setEdytowanaUsluga] = useState<Usluga | null>(null)

  useEffect(() => {
    fetchUslugi()
  }, [])

  const fetchUslugi = async () => {
    const response = await fetch('/api/uslugi')
    const data = await response.json()
    setUslugi(data)
  }

  const dodajUsluge = async () => {
    if (nowaUsluga.nazwa && nowaUsluga.czas && nowaUsluga.kolor) {
      const response = await fetch('/api/uslugi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nowaUsluga)
      })
      const data = await response.json()
      setUslugi([...uslugi, data])
      setNowaUsluga({ nazwa: '', czas: '', kolor: '' })
    }
  }

  const usunUsluge = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę usługę?')) {
      await fetch('/api/uslugi', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setUslugi(uslugi.filter(usluga => usluga.id !== id))
    }
  }

  const edytujUsluge = (usluga: Usluga) => {
    setEdytowanaUsluga(usluga)
    setNowaUsluga(usluga)
    setShowColorPicker(true)
  }

  const zapiszEdycje = async () => {
    if (edytowanaUsluga) {
      const response = await fetch('/api/uslugi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nowaUsluga)
      })
      const data = await response.json()
      setUslugi(uslugi.map(u => u.id === data.id ? data : u))
      setEdytowanaUsluga(null)
      setNowaUsluga({ nazwa: '', czas: '', kolor: '' })
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Panel Usługi</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Nazwa usługi"
            value={nowaUsluga.nazwa}
            onChange={(e) => setNowaUsluga({...nowaUsluga, nazwa: e.target.value})}
            className="h-9 text-sm"
          />
          <Input
            placeholder="Czas trwania (min)"
            value={nowaUsluga.czas}
            onChange={(e) => setNowaUsluga({...nowaUsluga, czas: e.target.value})}
            className="h-9 text-sm"
          />
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Wybierz kolor:</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {koloryPastelowe.map((kolor, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: kolor }}
                onClick={() => setNowaUsluga({...nowaUsluga, kolor})}
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <Button 
              onClick={() => setShowColorPicker(!showColorPicker)}
              variant="outline"
              className="bg-[#EFEEE9] text-[#37352F] hover:bg-[#E3E2DD] text-sm h-9"
            >
              {showColorPicker ? 'Ukryj' : 'Pokaż'} własny wybór koloru
            </Button>
            <Button 
              onClick={edytowanaUsluga ? zapiszEdycje : dodajUsluge}
              className="bg-[#FDE8E9] text-[#37352F] hover:bg-[#FDD1D3] text-sm h-9"
            >
              {edytowanaUsluga ? 'Zapisz zmiany' : 'Dodaj usługę'}
            </Button>
          </div>
          {showColorPicker && (
            <div className="mt-2">
              <HexColorPicker 
                color={nowaUsluga.kolor} 
                onChange={(color) => setNowaUsluga({...nowaUsluga, kolor: color})} 
              />
            </div>
          )}
        </div>
        
        <ul className="space-y-2">
          {uslugi.map(usluga => (
            <li key={usluga.id} className="flex justify-between items-center p-2 rounded-md" style={{ backgroundColor: usluga.kolor }}>
              <span className="text-sm">{usluga.nazwa} - {usluga.czas} min</span>
              <div>
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => edytujUsluge(usluga)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => usunUsluge(usluga.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

