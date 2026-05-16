import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ppihdyxsegcllrsscbnt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaWhkeXhzZWdjbGxyc3NjYm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzQyMTcsImV4cCI6MjA5MDA1MDIxN30.OemEJGqC96iIQbNAwbWDdRreZpW6iHzt00U9PsD-wMY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
