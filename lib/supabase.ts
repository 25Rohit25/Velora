
import { createClient } from '@supabase/supabase-js'

// These would normally be in .env.local
// For now, we'll placeholder them. The app will throw a clear error if missing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
