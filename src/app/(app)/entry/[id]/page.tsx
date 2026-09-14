'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import EntryForm from '@/components/EntryForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Entry, EntryFormData } from '@/types'

export default function EntryPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState('')

  const entryId = params.id as string

  const fetchEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setEntry(data)
    } catch (err) {
      setError('Failed to load entry')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: EntryFormData) => {
    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const { error } = await supabase
        .from('entries')
        .update({
          date: formData.date,
          title: formData.title || null,
          content: formData.content,
          tags: tags.length > 0 ? tags : null,
        })
        .eq('id', entryId)
        .eq('user_id', user.id)

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Failed to save entry. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id)

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Failed to delete entry. Please try again.')
      setShowDeleteDialog(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error && !entry) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to timeline
        </button>
      </div>
    )
  }

  if (!entry) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {entry.title || 'Untitled Entry'}
          </h1>
          <p className="text-sm text-gray-500">
            {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      <EntryForm
        initialData={entry}
        onSubmit={handleSave}
        submitLabel="Save Changes"
        loading={saving}
      />

      {error && (
        <div className="mt-4 text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}