import { useState, useEffect } from 'react'

const ZONES = [
  { label: 'UTC',                     tz: 'UTC' },
  { label: 'London (GMT/BST)',         tz: 'Europe/London' },
  { label: 'Paris / Berlin (CET)',     tz: 'Europe/Paris' },
  { label: 'Helsinki (EET)',           tz: 'Europe/Helsinki' },
  { label: 'Moscow (MSK)',             tz: 'Europe/Moscow' },
  { label: 'Dubai (GST)',              tz: 'Asia/Dubai' },
  { label: 'Karachi (PKT)',            tz: 'Asia/Karachi' },
  { label: 'Kolkata (IST)',            tz: 'Asia/Kolkata' },
  { label: 'Dhaka (BST)',              tz: 'Asia/Dhaka' },
  { label: 'Bangkok (ICT)',            tz: 'Asia/Bangkok' },
  { label: 'Singapore / KL (SGT)',     tz: 'Asia/Singapore' },
  { label: 'Hong Kong (HKT)',          tz: 'Asia/Hong_Kong' },
  { label: 'Tokyo (JST)',              tz: 'Asia/Tokyo' },
  { label: 'Sydney (AEST/AEDT)',       tz: 'Australia/Sydney' },
  { label: 'Auckland (NZST/NZDT)',     tz: 'Pacific/Auckland' },
  { label: 'Honolulu (HST)',           tz: 'Pacific/Honolulu' },
  { label: 'Los Angeles (PST/PDT)',    tz: 'America/Los_Angeles' },
  { label: 'Denver (MST/MDT)',         tz: 'America/Denver' },
  { label: 'Chicago (CST/CDT)',        tz: 'America/Chicago' },
  { label: 'New York (EST/EDT)',       tz: 'America/New_York' },
  { label: 'Toronto (EST/EDT)',        tz: 'America/Toronto' },
  { label: 'São Paulo (BRT)',          tz: 'America/Sao_Paulo' },
  { label: 'Buenos Aires (ART)',       tz: 'America/Argentina/Buenos_Aires' },
  { label: 'Mexico City (CST/CDT)',    tz: 'America/Mexico_City' },
  { label: 'Johannesburg (SAST)',      tz: 'Africa/Johannesburg' },
  { label: 'Cairo (EET)',              tz: 'Africa/Cairo' },
  { label: 'Lagos (WAT)',              tz: 'Africa/Lagos' },
  { label: 'Nairobi (EAT)',            tz: 'Africa/Nairobi' },
]

function formatInZone(date, tz) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function getOffset(date, tz) {
  // Get the UTC offset string for a zone
  return new Intl.DateTimeFormat('en', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  }).formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? tz
}

export default function TimezoneConverter() {
  const now = new Date()
  const localISO = now.toISOString().slice(0, 16)

  const [datetime, setDatetime] = useState(localISO)
  const [fromZone, setFromZone] = useState('UTC')
  const [toZone, setToZone]     = useState('America/New_York')
  const [result, setResult]     = useState(null)

  useEffect(() => { document.title = 'Time Zone Converter | OmniverseTools' }, [])

  function convert() {
    try {
      // Parse datetime as if it's in fromZone by computing the UTC equivalent
      const [datePart, timePart] = datetime.split('T')
      const [y, mo, d] = datePart.split('-').map(Number)
      const [h, mi]    = timePart.split(':').map(Number)

      // Create a UTC date by finding what UTC time corresponds to the given wall clock in fromZone
      // We use the trick: format a known UTC time in fromZone, then adjust
      // Simpler: treat the input as UTC first, then find the offset of fromZone at that moment
      const assumed = new Date(Date.UTC(y, mo - 1, d, h, mi))

      // Get the local time that Intl would display for `assumed` in fromZone
      const parts = new Intl.DateTimeFormat('en', {
        timeZone: fromZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(assumed)

      const get = type => parseInt(parts.find(p => p.type === type)?.value)
      const displayedH = get('hour') === 24 ? 0 : get('hour')
      const diffMs = assumed - new Date(Date.UTC(get('year'), get('month') - 1, get('day'), displayedH, get('minute')))
      const utcDate = new Date(assumed.getTime() + diffMs)

      setResult({
        from:   formatInZone(utcDate, fromZone),
        to:     formatInZone(utcDate, toZone),
        fromOff: getOffset(utcDate, fromZone),
        toOff:   getOffset(utcDate, toZone),
      })
    } catch {
      setResult(null)
    }
  }

  const selectCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Time Zone Converter</h1>
      <p className="text-gray-400 mb-6">Convert a date and time between any two time zones.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date &amp; time</label>
          <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">From</label>
            <select value={fromZone} onChange={e => setFromZone(e.target.value)} className={selectCls}>
              {ZONES.map(z => <option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">To</label>
            <select value={toZone} onChange={e => setToZone(e.target.value)} className={selectCls}>
              {ZONES.map(z => <option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
          </div>
        </div>

        <button onClick={convert}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Convert
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          {[
            { label: ZONES.find(z => z.tz === fromZone)?.label ?? fromZone, time: result.from, off: result.fromOff },
            { label: ZONES.find(z => z.tz === toZone)?.label   ?? toZone,  time: result.to,   off: result.toOff },
          ].map((r, i) => (
            <div key={i} className={`bg-zinc-900 border rounded-xl p-5 ${i === 1 ? 'border-orange-700' : 'border-zinc-700'}`}>
              <div className="text-xs text-gray-500 mb-1">{r.label} · {r.off}</div>
              <div className={`text-xl font-mono font-semibold ${i === 1 ? 'text-orange-400' : 'text-white'}`}>{r.time}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-xs text-gray-600">Daylight saving time is handled automatically by your browser's Intl API.</div>
    </div>
  )
}
