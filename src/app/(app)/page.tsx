import { getUser } from '@/lib/auth'
import { getEntries, getUserTags } from '@/lib/db'
import EntryList from '@/components/EntryList'

export default async function TimelinePage() {
  const user = await getUser()
  const entries = await getEntries(user!.id)
  const tags = await getUserTags(user!.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
        <p className="text-sm text-gray-500">{entries.length} entr{entries.length === 1 ? 'y' : 'ies'}</p>
      </div>
      <EntryList entries={entries} />
    </div>
  )
}