'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface KalendarzProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export default function Kalendarz({ selectedDate, setSelectedDate }: KalendarzProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <div className="mb-4">
        <p className="text-lg font-semibold">
          {currentTime.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-xl">
          {currentTime.toLocaleTimeString('pl-PL')}
        </p>
      </div>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => setSelectedDate(date)}
        inline
      />
    </div>
  )
}

