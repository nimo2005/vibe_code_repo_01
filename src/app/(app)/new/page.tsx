'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EntryForm from '@/components/EntryForm'
import { EntryFormData } from '@/types'
import { useState, useEffect } from 'react'

export default function NewEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [initialDate, setInitialDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (dateParam) {
      setInitialDate(dateParam)
    }
  }, [searchParams])

  const handleSubmit = async (data: EntryFormData) => {
    setLoading(true)

    const tags = data.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('entries')
      .insert({
        user_id: user.id,
        date: data.date,
        title: data.title || null,
        content: data.content,
        tags: tags.length > 0 ? tags : null,
      })

    if (error) {
      throw error
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Entry</h1>
      <EntryForm
        onSubmit={handleSubmit}
        loading={loading}
        initialData={{ date: initialDate, title: '', content: '', tags: '', id: '', user_id: '', created_at: '', updated_at: '' }}
      />
    </div>
  )
}