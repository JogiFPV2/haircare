'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface Usluga {
  id: number
  nazwa: string
  kolor: string
}

interface Klient {
  id: number
  imieNazwisko: string
  telefon: string
}

const uslugi: Usluga[] = [
  { id: 1, nazwa: "Strzyżenie", kolor: "#FFB3BA" },
  { id: 2, nazwa: "Farbowanie", kolor: "#BAFFC9" },
  { id: 3, nazwa: "Modelowanie", kolor: "#BAE1FF" },
]

const klienci: Klient[] = [
  { id: 1, imieNazwisko: "Jan Kowalski", telefon: "123456789" },
  { id: 2, imieNazwisko: "Anna Nowak", telefon: "987654321" },
]

export default function PanelTerminarz() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [wizyty, setWizyty] = useState<Wizyta[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [nowaWizyta, setNowaWizyta] = useState<Partial<Wizyta>>({
    data: selectedDate,
    godzina: '',
    imieNazwisko: '',
    telefon: '',
    uslugi: [],
    notatki: '',
    oplacona: false
  })
  const [wyszukiwanieUslugi, setWyszukiwanieUslugi] = useState('')
  const [wyszukiwanieKlienta, setWyszukiwanieKlienta] = useState('')
  const [filtrowaneUslugi, setFiltrowaneUslugi] = useState<Usluga[]>(uslugi)
  const [filtrowaniKlienci, setFiltrowaniKlienci] = useState<Klient[]>(klienci)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [wybraneUslugi, setWybraneUslugi] = useState<Usluga[]>([])
  const [wybranyKlient, setWybranyKlient] = useState<Klient | null>(null)
  const [edytowanaWizyta, setEdytowanaWizyta] = useState<Wizyta | null>(null)

  useEffect(() => {
    fetchWizyty()
  }, [])

  useEffect(() => {
    if (wyszukiwanieUslugi.length >= 3) {
      setFiltrowaneUslugi(uslugi.filter(usluga => 
        usluga.nazwa.toLowerCase().includes(wyszukiwanieUslugi.toLowerCase())
      ))
    } else {
      setFiltrowaneUslugi(uslugi)
    }
  }, [wyszukiwanieUslugi])

  useEffect(() => {
    if (wyszukiwanieKlienta.length >= 3) {
      setFiltrowaniKlienci(klienci.filter(klient => 
        klient.imieNazwisko.toLowerCase().includes(wyszukiwanieKlienta.toLowerCase()) ||
        klient.telefon.includes(wyszukiwanieKlienta)
      ))
    } else {
      setFiltrowaniKlienci(klienci)
    }
  }, [wyszukiwanieKlienta])

  useEffect(() => {
    setNowaWizyta(prev => ({ ...prev, data: selectedDate }))
  }, [selectedDate])

  const toggleNotatki = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const updateNotatki = async (id: number, notatki: string) => {
    const wizyta = wizyty.find(w => w.id === id)
    if (wizyta) {
      const updatedWizyta = { ...wizyta, notatki }
      const response = await fetch('/api/wizyty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWizyta)
      })
      const data = await response.json()
      setWizyty(wizyty.map(w => w.id === id ? data : w))
    }
  }

  const toggleOplacona = async (id: number) => {
    const wizyta = wizyty.find(w => w.id === id)
    if (wizyta) {
      const updatedWizyta = { ...wizyta, oplacona: !wizyta.oplacona }
      const response = await fetch('/api/wizyty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWizyta)
      })
      const data = await response.json()
      setWizyty(wizyty.map(w => w.id === id ? data : w))
    }
  }

  const dodajWizyte = async () => {
    if (wybranyKlient && wybraneUslugi.length > 0) {
      const nowaWizytaBase = {
        ...nowaWizyta,
        id: Date.now(),
        imieNazwisko: wybranyKlient.imieNazwisko,
        telefon: wybranyKlient.telefon,
        uslugi: wybraneUslugi.map(u => ({ nazwa: u.nazwa, kolor: u.kolor }))
      };
      const response = await fetch('/api/wizyty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nowaWizytaBase)
      })
      const data = await response.json()
      setWizyty([...wizyty, data]);
      resetNowaWizyta();
    }
  };

  const edytujWizyte = async () => {
    if (edytowanaWizyta) {
      const response = await fetch('/api/wizyty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edytowanaWizyta)
      })
      const data = await response.json()
      setWizyty(wizyty.map(w => w.id === data.id ? data : w));
      resetNowaWizyta();
    }
  };

  const resetNowaWizyta = () => {
    setNowaWizyta({
      data: selectedDate,
      godzina: '',
      imieNazwisko: '',
      telefon: '',
      uslugi: [],
      notatki: '',
      oplacona: false
    });
    setWybraneUslugi([]);
    setWybranyKlient(null);
    setEdytowanaWizyta(null);
    setDialogOpen(false);
  };

  const dodajUsluge = (usluga: Usluga) => {
    if (!wybraneUslugi.some(u => u.id === usluga.id)) {
      setWybraneUslugi([...wybraneUslugi, usluga])
    }
  }

  const usunUsluge = (id: number) => {
    setWybraneUslugi(wybraneUslugi.filter(u => u.id !== id))
  }

  const wybierzKlienta = (klient: Klient) => {
    setWybranyKlient(klient)
    setNowaWizyta({...nowaWizyta, imieNazwisko: klient.imieNazwisko, telefon: klient.telefon})
    setWyszukiwanieKlienta('')
  }

  const usunWybranegoKlienta = () => {
    setWybranyKlient(null)
    setNowaWizyta({...nowaWizyta, imieNazwisko: '', telefon: ''})
  }

  const otworzEdycjeWizyty = (wizyta: Wizyta) => {
    setEdytowanaWizyta(wizyta);
    setNowaWizyta(wizyta);
    setWybraneUslugi(wizyta.uslugi.map(u => ({ id: Date.now(), ...u })));
    setWybranyKlient({ id: Date.now(), imieNazwisko: wizyta.imieNazwisko, telefon: wizyta.telefon });
    setDialogOpen(true);
  };

  const usunWizyte = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę wizytę?')) {
      await fetch('/api/wizyty', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setWizyty(wizyty.filter(w => w.id !== id));
    }
  };

  const fetchWizyty = async () => {
    const response = await fetch('/api/wizyty')
    const data = await response.json()
    setWizyty(data)
  }

  return (
    <Card className="bg-[#F0F0F0] shadow-sm border-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Panel Terminarz</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FDE8E9] text-[#37352F] hover:bg-[#FDD1D3] text-xs h-7 px-3 rounded">Nowa wizyta</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-lg font-semibold">
                  {edytowanaWizyta ? 'Edytuj wizytę' : 'Dodaj nową wizytę'}
                </DialogTitle>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetNowaWizyta} className="h-7 text-xs">Anuluj</Button>
                  <Button onClick={edytowanaWizyta ? edytujWizyte : dodajWizyte} className="h-7 text-xs">
                    {edytowanaWizyta ? 'Zapisz zmiany' : 'Zapisz'}
                  </Button>
                </div>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    selected={nowaWizyta.data}
                    onChange={(date: Date) => setNowaWizyta({...nowaWizyta, data: date})}
                    dateFormat="dd/MM/yyyy"
                    className="w-full h-8 px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                  />
                  <Select onValueChange={(value) => setNowaWizyta({...nowaWizyta, godzina: value})}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Wybierz godzinę" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 24 * 4}, (_, i) => {
                        const hour = Math.floor(i / 4);
                        const minute = (i % 4) * 15;
                        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      }).map((time) => (
                        <SelectItem key={time} value={time} className="text-xs">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Wyszukaj usługę"
                  value={wyszukiwanieUslugi}
                  onChange={(e) => setWyszukiwanieUslugi(e.target.value)}
                  className="h-8 text-xs"
                />
                <ul className="max-h-28 overflow-y-auto text-xs">
                  {filtrowaneUslugi.map(usluga => (
                    <li
                      key={usluga.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => dodajUsluge(usluga)}
                    >
                      <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: usluga.kolor}}></div>
                      {usluga.nazwa}
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-2">
                  {wybraneUslugi.map((usluga, index) => (
                    <div
                      key={usluga.id}
                      className={`flex items-center rounded-full px-3 py-1 text-xs ${index >= 3 ? 'mt-2' : ''}`}
                      style={{ backgroundColor: usluga.kolor }}
                    >
                      <span className="truncate">{usluga.nazwa}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => usunUsluge(usluga.id)}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Wyszukaj klienta"
                  value={wyszukiwanieKlienta}
                  onChange={(e) => setWyszukiwanieKlienta(e.target.value)}
                  className="h-8 text-xs"
                />
                {wybranyKlient ? (
                  <div className="flex items-center bg-black text-white rounded-full px-3 py-1 text-xs">
                    <span className="truncate">{wybranyKlient.imieNazwisko}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={usunWybranegoKlienta}
                      className="ml-2 h-4 w-4 p-0 text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <ul className="max-h-28 overflow-y-auto text-xs">
                    {filtrowaniKlienci.map(klient => (
                      <li
                        key={klient.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => wybierzKlienta(klient)}
                      >
                        {klient.imieNazwisko} - {klient.telefon}
                      </li>
                    ))}
                  </ul>
                )}
                <Input
                  placeholder="Notatki (opcjonalne)"
                  value={nowaWizyta.notatki}
                  onChange={(e) => setNowaWizyta({...nowaWizyta, notatki: e.target.value})}
                  className="h-8 text-xs"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Kalendarz selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
          <div className="col-span-2">
            <ListaWizyt 
              wizyty={wizyty} 
              selectedDate={selectedDate} 
              expandedId={expandedId} 
              toggleNotatki={toggleNotatki} 
              updateNotatki={updateNotatki} 
              toggleOplacona={toggleOplacona}
              otworzEdycjeWizyty={otworzEdycjeWizyty}
              usunWizyte={usunWizyte}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Kalendarz({ selectedDate, setSelectedDate }: { selectedDate: Date; setSelectedDate: (date: Date) => void }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#F7F6F6F3] p-3 rounded">
      <div className="mb-3">
        <p className="text-sm font-medium">
          {currentTime.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-base">
          {currentTime.toLocaleTimeString('pl-PL')}
        </p>
      </div>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => setSelectedDate(date)}
        inline
        className="bg-white rounded shadow-sm text-xs"
      />
    </div>
  )
}

function ListaWizyt({ 
  wizyty, 
  selectedDate, 
  expandedId, 
  toggleNotatki, 
  updateNotatki, 
  toggleOplacona,
  otworzEdycjeWizyty,
  usunWizyte
}: { 
  wizyty: Wizyta[], 
  selectedDate: Date, 
  expandedId: number | null, 
  toggleNotatki: (id: number) => void, 
  updateNotatki: (id: number, notatki: string) => void, 
  toggleOplacona: (id: number) => void,
  otworzEdycjeWizyty: (wizyta: Wizyta) => void,
  usunWizyte: (id: number) => void
}) {
  const groupedWizyty = wizyty.reduce((acc, wizyta) => {
    const dayOfWeek = wizyta.data.toLocaleDateString('pl-PL', { weekday: 'long' });
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(wizyta);
    return acc;
  }, {} as Record<string, Wizyta[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedWizyty).map(([dayOfWeek, dayWizyty]) => (
        <div key={dayOfWeek}>
          <h3 className="text-sm font-semibold mb-2">{dayOfWeek}</h3>
          <ul className="space-y-2">
            {dayWizyty.map(wizyta => (
              <li 
                key={wizyta.id} 
                className="p-3 rounded bg-white border border-gray-200 shadow-sm transition-opacity duration-200" 
                style={{
                  borderLeft: `4px solid ${wizyta.uslugi[0].kolor}`,
                  opacity: wizyta.data.toDateString() === selectedDate.toDateString() ? 1 : 0.4
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-xs">{wizyta.godzina}</span>
                    <span className="ml-2 text-xs font-bold">{wizyta.imieNazwisko}</span>
                    <p className="text-xs text-gray-500">{wizyta.telefon}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wizyta.uslugi.map((usluga, index) => (
                        <Button
                          key={index}
                          className="text-xs px-2 py-1"
                          style={{ backgroundColor: usluga.kolor, color: '#37352F' }}
                        >
                          {usluga.nazwa}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => otworzEdycjeWizyty(wizyta)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => usunWizyte(wizyta.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNotatki(wizyta.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedId === wizyta.id ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      onClick={() => toggleOplacona(wizyta.id)}
                      className={`text-xs h-6 px-2 ${wizyta.oplacona ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {wizyta.oplacona ? 'Opłacona' : 'Nieopłacona'}
                    </Button>
                  </div>
                </div>
                {expandedId === wizyta.id && (
                  <div className="mt-2">
                    <Input
                      value={wizyta.notatki}
                      onChange={(e) => updateNotatki(wizyta.id, e.target.value)}
                      placeholder="Dodaj notatki..."
                      className="h-7 text-xs"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

