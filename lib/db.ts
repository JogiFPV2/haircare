import { Pool } from 'pg'
import { createClient } from '@supabase/supabase-js'

// PostgreSQL configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Supabase configuration (optional)
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null

export const db = supabase || {
  query: (text: string, params: any[]) => pool.query(text, params),
}

