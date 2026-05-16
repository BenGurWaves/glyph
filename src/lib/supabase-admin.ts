import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://localhost'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'service'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
