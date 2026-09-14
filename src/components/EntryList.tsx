'use client'

import { useState } from 'react'
import { Entry } from '@/types'
import EntryItem from './EntryItem'

interface EntryListProps {
  entries: Entry[]
  onEntryClick?: (entry: Entry) => void
}

export default function EntryList({ entries, onEntryClick }: EntryListProps) {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('')

  // Get unique tags from entries
  const allTags = [...new Set(entries.flatMap(e => e.tags || []))].sort()

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !search ||
      entry.title?.toLowerCase().includes(search.toLowerCase()) ||
      entry.content.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !tagFilter || entry.tags?.includes(tagFilter)
    return matchesSearch && matchesTag
  })

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No entries yet. Start logging your day!</p>
      </div>
    )
  }

  if (filteredEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No entries match your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="sr-only">Search entries</label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {allTags.length > 0 && (
          <div>
            <label htmlFor="tag-filter" className="sr-only">Filter by tag</label>
            <select
              id="tag-filter"
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredEntries.map(entry => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}