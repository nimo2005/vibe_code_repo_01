'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { Entry } from '@/types'

interface EntryItemProps {
  entry: Entry
}

export default function EntryItem({ entry }: EntryItemProps) {
  const displayTitle = entry.title || entry.content.split('\n')[0].slice(0, 80)
  const formattedDate = format(new Date(entry.date), 'EEE, MMM d, yyyy')

  return (
    <Link
      href={`/entry/${entry.id}`}
      className="block p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <time dateTime={entry.date}>{formattedDate}</time>
          </div>
          <h3 className="text-lg font-medium text-gray-900 truncate">{displayTitle}</h3>
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}