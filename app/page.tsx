'use client'

import { useState } from 'react'
import PanelKlienci from './components/PanelKlienci'
import PanelUslugi from './components/PanelUslugi'
import PanelTerminarz from './components/PanelTerminarz'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function App() {
  const [activeTab, setActiveTab] = useState("terminarz")

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#37352F] p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Aplikacja Salon</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="bg-[#EFEEE9] p-1 rounded-md">
              <TabsTrigger value="klienci" className="data-[state=active]:bg-white data-[state=active]:text-[#37352F]">Klienci</TabsTrigger>
              <TabsTrigger value="uslugi" className="data-[state=active]:bg-white data-[state=active]:text-[#37352F]">Usługi</TabsTrigger>
            </TabsList>
            <TabsList className="bg-[#EFEEE9] p-1 rounded-md">
              <TabsTrigger value="terminarz" className="data-[state=active]:bg-white data-[state=active]:text-[#37352F]">Terminarz</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="klienci">
            <PanelKlienci />
          </TabsContent>
          <TabsContent value="uslugi">
            <PanelUslugi />
          </TabsContent>
          <TabsContent value="terminarz">
            <PanelTerminarz />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

