import 'server-only'
import { createClient } from '@supabase/supabase-js'

const MISSING_SECRET_KEY_MESSAGE =
  'SUPABASE_SECRET_KEY belum diisi. Ambil dari Supabase Dashboard > Project Settings > API keys (sb_secret_...).'

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) throw new Error(MISSING_SECRET_KEY_MESSAGE)

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
