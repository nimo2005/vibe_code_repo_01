import { createClient } from './supabase/server'
import { Entry, EntryFormData } from '@/types'

export async function getEntries(userId: string, search?: string, tagFilter?: string): Promise<Entry[]> {
  const supabase = createClient()

  let query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  if (tagFilter) {
    query = query.contains('tags', [tagFilter])
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching entries:', error)
    return []
  }

  return data || []
}

export async function getEntry(id: string, userId: string): Promise<Entry | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching entry:', error)
    return null
  }

  return data
}

export async function createEntry(userId: string, formData: EntryFormData): Promise<Entry | null> {
  const supabase = createClient()

  const tags = formData.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  const { data, error } = await supabase
    .from('entries')
    .insert({
      user_id: userId,
      date: formData.date,
      title: formData.title || null,
      content: formData.content,
      tags: tags.length > 0 ? tags : null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating entry:', error)
    return null
  }

  return data
}

export async function updateEntry(id: string, userId: string, formData: EntryFormData): Promise<Entry | null> {
  const supabase = createClient()

  const tags = formData.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  const { data, error } = await supabase
    .from('entries')
    .update({
      date: formData.date,
      title: formData.title || null,
      content: formData.content,
      tags: tags.length > 0 ? tags : null,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating entry:', error)
    return null
  }

  return data
}

export async function deleteEntry(id: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting entry:', error)
    return false
  }

  return true
}

export async function getUserTags(userId: string): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('entries')
    .select('tags')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  const allTags = data?.flatMap(entry => entry.tags || []) || []
  return [...new Set(allTags)].sort()
}

export async function getEntriesForCalendar(userId: string, year: number, month: number): Promise<{ date: string }[]> {
  const supabase = createClient()

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`

  const { data, error } = await supabase
    .from('entries')
    .select('date')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) {
    console.error('Error fetching calendar entries:', error)
    return []
  }

  return data || []
}