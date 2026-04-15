import { useState, useEffect } from 'react'

function pad(n) { return String(n).padStart(2, '0') }

function toLocalISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function TimestampConverter() {
  const [unix, setUnix] = useState(() => String(Math.floor(Date.now() / 1000)))
  const [datetime, setDatetime] = useState(() => toLocalISO(new Date()))
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Unix Timestamp Converter Online | OmniverseTools'
  }, [])

  function fromUnix() {
    setError('')
    const ms = unix.trim().length > 11 ? Number(unix) : Number(unix) * 1000
    const d = new Date(ms)
    if (isNaN(d.getTime())) { setError('Invalid timestamp.'); return }
    setDatetime(toLocalISO(d))
  }

  function fromDatetime() {
    setError('')
    const d = new Date(datetime)
    if (isNaN(d.getTime())) { setError('Invalid date/time.'); return }
    setUnix(String(Math.floor(d.getTime() / 1000)))
  }

  function setNow() {
    const now = new Date()
    setUnix(String(Math.floor(now.getTime() / 1000)))
    setDatetime(toLocalISO(now))
    setError('')
  }

  const asDate = (() => {
    const ms = unix.trim().length > 11 ? Number(unix) : Number(unix) * 1000
    const d = new Date(ms)
    if (isNaN(d.getTime())) return null
    return d
  })()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Unix Timestamp Converter</h1>
      <p className="text-gray-400 mb-6">
        Convert Unix epoch timestamps to human-readable dates and back — instant, browser-based.
      </p>

      <button
        onClick={setNow}
        className="mb-6 bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Use Current Time
      </button>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <label className="block text-sm text-gray-400 mb-2">Unix Timestamp (seconds or milliseconds)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={unix}
              onChange={e => setUnix(e.target.value)}
              className="flex-1 bg-zinc-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
              placeholder="e.g. 1700000000"
            />
            <button
              onClick={fromUnix}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              → To Date
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(unix)}
              className="bg-zinc-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <label className="block text-sm text-gray-400 mb-2">Date / Time (local timezone)</label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              className="flex-1 bg-zinc-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={fromDatetime}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              → To Unix
            </button>
          </div>
        </div>

        {asDate && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-gray-300 font-semibold text-sm mb-4">Breakdown</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                ['UTC', asDate.toUTCString()],
                ['ISO 8601', asDate.toISOString()],
                ['Local', asDate.toLocaleString()],
                ['Unix (s)', Math.floor(asDate.getTime() / 1000)],
                ['Unix (ms)', asDate.getTime()],
                ['Day of week', asDate.toLocaleDateString(undefined, { weekday: 'long' })],
              ].map(([label, val]) => (
                <div key={label} className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">{label}</div>
                  <div className="text-white font-mono text-xs break-all">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          The Unix timestamp is the number of seconds (or milliseconds) elapsed since
          January 1, 1970 00:00:00 UTC. It's widely used in programming, databases, and APIs.
          This tool auto-detects whether your input is in seconds (≤11 digits) or milliseconds (12+ digits).
        </p>
      </div>
    </div>
  )
}
