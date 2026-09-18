import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface BillionaireRow {
  position: number
  name: string
  country: string | null
  age: number | null
  current_worth: number
  wealth_source: string | null
  snapshot_date: string | null
}

const worthFormatter = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

function formatWorth(billions: number): string {
  return `${worthFormatter.format(billions)} Mrd. $`
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Top10Billionaires() {
  const [rows, setRows] = useState<BillionaireRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Top 10 reichste Männer – dominik.'

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('billionaires_top10_men')
          .select('position, name, country, age, current_worth, wealth_source, snapshot_date')
          .order('position')

        if (fetchError) {
          setError(fetchError.message)
          return
        }
        setRows(data ?? [])
      } catch {
        setError('Die Liste konnte nicht geladen werden — magst du es nochmal versuchen?')
      } finally {
        setLoading(false)
      }
    }

    loadRanking()
  }, [])

  const snapshotDate = rows[0]?.snapshot_date

  return (
    <main className="auth-page top10-page">
      <div className="auth-card top10-card">
        <span className="eyebrow">Täglich aktualisiert</span>
        <h1>Die 10 reichsten Männer</h1>
        {snapshotDate && <p className="top10-stand">Stand: {formatDate(snapshotDate)}</p>}
        <p className="top10-disclaimer">
          Daten von einer Drittanbieter-Spiegelung der Forbes-Milliardärsliste. Kann von Forbes'
          eigener Live-Anzeige leicht abweichen.
        </p>

        {loading && <p className="auth-sub">Lädt…</p>}
        {error && <p className="auth-error">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="auth-sub">
            Noch keine Daten vorhanden — der erste tägliche Abruf ist noch nicht gelaufen.
          </p>
        )}

        {rows.length > 0 && (
          <ol className="top10-list">
            {rows.map((row) => (
              <li key={row.position} className="top10-item">
                <span className="top10-rank">{row.position}</span>
                <div className="top10-info">
                  <span className="top10-name">{row.name}</span>
                  <span className="top10-meta">
                    {[row.wealth_source, row.country].filter(Boolean).join(' · ')}
                    {row.age ? ` · ${row.age} Jahre` : ''}
                  </span>
                </div>
                <span className="top10-worth">{formatWorth(row.current_worth)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  )
}

export default Top10Billionaires
