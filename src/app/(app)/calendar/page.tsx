import { getUser } from '@/lib/auth'
import { getEntriesForCalendar } from '@/lib/db'
import Calendar from '@/components/Calendar'

export default async function CalendarPage() {
  const user = await getUser()
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const entries = await getEntriesForCalendar(user!.id, year, month)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h1>
      <Calendar
        entries={entries}
        selectedDate={now}
        onDateClick={date => {
          const dateStr = date.toISOString().split('T')[0]
          window.location.href = `/new?date=${dateStr}`
        }}
      />
      <p className="mt-4 text-sm text-gray-500 text-center">
        Click a day to create an entry for that date. Days with entries are highlighted.
      </p>
    </div>
  )
}