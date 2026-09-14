'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns'
import Link from 'next/link'

interface CalendarProps {
  entries: { date: string }[]
  selectedDate?: Date
  onDateClick: (date: Date) => void
}

export default function Calendar({ entries, selectedDate, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const entryDates = new Set(entries.map(e => e.date))
  const today = new Date()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => addDays(startOfMonth(prev), -1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => addDays(startOfMonth(prev), 32))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 p-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="contents">
            {week.map(day => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const hasEntry = entryDates.has(dayStr)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isToday = isSameDay(day, today)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={dayStr}
                  onClick={() => onDateClick(day)}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-sm
                    transition-colors rounded-md
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                    ${isToday && !isSelected ? 'bg-blue-50' : ''}
                    ${isSelected ? 'bg-blue-100 text-blue-900 font-medium' : ''}
                    ${hasEntry && isCurrentMonth ? 'font-semibold' : ''}
                    hover:${isCurrentMonth ? 'bg-gray-100' : 'bg-gray-50'}
                  `}
                  disabled={!isCurrentMonth}
                >
                  <span>{format(day, 'd')}</span>
                  {hasEntry && isCurrentMonth && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}