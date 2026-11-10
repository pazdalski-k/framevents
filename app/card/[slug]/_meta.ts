import { createClient } from '@supabase/supabase-js'

export type VisitCardMeta = {
  slug: string
  first_name: string | null
  last_name: string | null
  company: string | null
  job_title: string | null
  bio: string | null
  logo_url: string | null
  photo_url: string | null
  brand_color: string | null
}

export async function getVisitCardMeta(
  slug: string
): Promise<VisitCardMeta | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return null

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data, error } = await supabase
    .from('visit_cards')
    .select(`
      slug,
      first_name,
      last_name,
      company,
      job_title,
      bio,
      logo_url,
      photo_url,
      brand_color
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('Visit Card metadata error:', error)
    return null
  }

  return data
}
