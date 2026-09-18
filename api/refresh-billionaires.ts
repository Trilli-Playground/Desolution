import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const RAPIDAPI_HOST = 'forbes-billionaires-api.p.rapidapi.com'
const TOP_N = 10

interface RankingEntry {
  rank: number
  id: string
  name: string
  source: string
  country: string
  gender: string
  age: number
  image: string
  current_worth: number
  previous_worth: number
}

interface ListResponse {
  title: string
  subtitle: string
  updated_at: number
  count: number
  ranking: RankingEntry[]
}

// The API docs don't give an example value for `gender`, so match the
// common variants defensively rather than assume a single exact string.
function isMale(gender: string): boolean {
  const normalized = gender.trim().toLowerCase()
  return normalized === 'm' || normalized === 'male'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!rapidApiKey || !supabaseUrl || !supabaseServiceRoleKey) {
    res.status(500).json({ error: 'Missing required environment variables' })
    return
  }

  try {
    const apiResponse = await fetch(`https://${RAPIDAPI_HOST}/list.php`, {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': rapidApiKey,
      },
    })

    if (!apiResponse.ok) {
      throw new Error(`RapidAPI request failed: ${apiResponse.status}`)
    }

    const data = (await apiResponse.json()) as ListResponse
    const topMen = data.ranking.filter((entry) => isMale(entry.gender)).slice(0, TOP_N)

    if (topMen.length === 0) {
      throw new Error('No male entries found in the ranking response')
    }

    const snapshotDate = new Date(data.updated_at * 1000).toISOString().slice(0, 10)
    const fetchedAt = new Date().toISOString()

    const rows = topMen.map((entry, index) => ({
      position: index + 1,
      global_rank: entry.rank,
      source_id: entry.id,
      name: entry.name,
      country: entry.country,
      age: entry.age,
      image: entry.image,
      current_worth: entry.current_worth,
      previous_worth: entry.previous_worth,
      wealth_source: entry.source,
      snapshot_date: snapshotDate,
      fetched_at: fetchedAt,
    }))

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })

    const { error } = await supabase.from('billionaires_top10_men').upsert(rows)

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`)
    }

    res.status(200).json({ ok: true, count: rows.length, snapshotDate })
  } catch (error) {
    console.error('refresh-billionaires failed:', error)
    res.status(502).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
