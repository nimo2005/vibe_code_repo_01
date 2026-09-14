export interface Entry {
  id: string;
  user_id: string;
  date: string;
  title: string | null;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface EntryFormData {
  date: string;
  title: string;
  content: string;
  tags: string;
}

export interface User {
  id: string;
  email: string;
}