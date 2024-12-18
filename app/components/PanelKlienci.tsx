'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface Klient {
  id: number
  imie: string
  nazwisko: string
  telefon: string
}

export default function PanelKlienci() {
  const [klienci, setKlienci] = useState<Klient[]>([])
  const [nowyKlient, setNowyKlient] = useState({ imie: '', nazwisko: '', telefon: '' })
  const [wyszukiwanie, setWyszukiwanie] = useState('')
  const [filtrowaniKlienci, setFiltrowaniKlienci] = useState<Klient[]>([])
  const [edytowanyKlient, setEdytowanyKlient] = useState<Klient | null>(null)

  useEffect(() => {
    fetchKlienci()
  }, [])

  const fetchKlienci = async () => {
    const response = await fetch('/api/klienci')
    const data = await response.json()
    setKlienci(data)
  }

  useEffect(() => {
    if (wyszukiwanie.length >= 3) {
      const wynik = klienci.filter(klient => 
        klient.imie.toLowerCase().includes(wyszukiwanie.toLowerCase()) ||
        klient.nazwisko.toLowerCase().includes(wyszukiwanie.toLowerCase()) ||
        klient.telefon.includes(wyszukiwanie)
      )
      setFiltrowaniKlienci(wynik)
    } else {
      setFiltrowaniKlienci([])
    }
  }, [wyszukiwanie, klienci])

  const dodajKlienta = async () => {
    if (nowyKlient.imie && nowyKlient.nazwisko && nowyKlient.telefon) {
      const response = await fetch('/api/klienci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nowyKlient)
      })
      const data = await response.json()
      setKlienci([...klienci, data])
      setNowyKlient({ imie: '', nazwisko: '', telefon: '' })
    }
  }

  const usunKlienta = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      await fetch('/api/klienci', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setKlienci(klienci.filter(klient => klient.id !== id))
    }
  }

  const edytujKlienta = (klient: Klient) => {
    setEdytowanyKlient(klient)
  }

  const zapiszEdycje = async () => {
    if (edytowanyKlient) {
      const response = await fetch('/api/klienci', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edytowanyKlient)
      })
      const data = await response.json()
      setKlienci(klienci.map(k => k.id === data.id ? data : k))
      setEdytowanyKlient(null)
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Panel Klienci</h2>
        <Tabs defaultValue="klienci" className="space-y-4">
          <TabsList className="bg-[#EFEEE9] p-1 rounded-md">
            <TabsTrigger value="klienci" className="data-[state=active]:bg-white data-[state=active]:text-[#37352F]">Klienci</TabsTrigger>
            <TabsTrigger value="dluznicy" className="data-[state=active]:bg-white data-[state=active]:text-[#37352F]">Dłużnicy</TabsTrigger>
          </TabsList>
          <TabsContent value="klienci">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Imię"
                value={nowyKlient.imie}
                onChange={(e) => setNowyKlient({...nowyKlient, imie: e.target.value})}
                className="h-9 text-sm"
              />
              <Input
                placeholder="Nazwisko"
                value={nowyKlient.nazwisko}
                onChange={(e) => setNowyKlient({...nowyKlient, nazwisko: e.target.value})}
                className="h-9 text-sm"
              />
              <Input
                placeholder="Nr telefonu"
                value={nowyKlient.telefon}
                onChange={(e) => setNowyKlient({...nowyKlient, telefon: e.target.value})}
                className="h-9 text-sm"
              />
            </div>
            <Button onClick={dodajKlienta} className="mb-4 bg-[#FDE8E9] text-[#37352F] hover:bg-[#FDD1D3]">Dodaj klienta</Button>

            <Input
              placeholder="Wyszukaj klienta"
              value={wyszukiwanie}
              onChange={(e) => setWyszukiwanie(e.target.value)}
              className="mb-4 h-9 text-sm"
            />

            {filtrowaniKlienci.length > 0 && (
              <ul className="mb-4 space-y-2">
                {filtrowaniKlienci.map(klient => (
                  <li key={klient.id} className="p-2 bg-[#EFEEE9] rounded-md text-sm">
                    {klient.imie} {klient.nazwisko} - {klient.telefon}
                  </li>
                ))}
              </ul>
            )}

            <ul className="space-y-2">
              {klienci.map(klient => (
                <li key={klient.id} className="flex justify-between items-center p-2 bg-[#EFEEE9] rounded-md">
                  {edytowanyKlient && edytowanyKlient.id === klient.id ? (
                    <>
                      <Input
                        value={edytowanyKlient.imie}
                        onChange={(e) => setEdytowanyKlient({...edytowanyKlient, imie: e.target.value})}
                        className="mr-2 h-8 text-sm"
                      />
                      <Input
                        value={edytowanyKlient.nazwisko}
                        onChange={(e) => setEdytowanyKlient({...edytowanyKlient, nazwisko: e.target.value})}
                        className="mr-2 h-8 text-sm"
                      />
                      <Input
                        value={edytowanyKlient.telefon}
                        onChange={(e) => setEdytowanyKlient({...edytowanyKlient, telefon: e.target.value})}
                        className="mr-2 h-8 text-sm"
                      />
                      <Button onClick={zapiszEdycje} className="bg-[#FDE8E9] text-[#37352F] hover:bg-[#FDD1D3] text-sm">Zapisz</Button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">{klient.imie} {klient.nazwisko} - {klient.telefon}</span>
                      <div>
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => edytujKlienta(klient)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => usunKlienta(klient.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="dluznicy">
            <Dluznicy />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Dluznicy() {
  return <p>Lista dłużników</p>
}

