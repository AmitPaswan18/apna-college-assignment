import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('your-supabase')) {
    console.warn('Supabase credentials missing or using placeholders. Please check your .env file.')
    // Return a dummy client or handle as needed to prevent crash, 
    // but ultimately the app needs these.
  }

  return createBrowserClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder-key'
  )
}
