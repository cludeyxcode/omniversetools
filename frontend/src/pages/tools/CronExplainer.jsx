import { useState, useEffect } from 'react'
import cronstrue from 'cronstrue'

const EXAMPLES = [
  { expr: '* * * * *',        label: 'Every minute' },
  { expr: '0 * * * *',        label: 'Every hour' },
  { expr: '0 9 * * *',        label: 'Every day at 9 AM' },
  { expr: '0 9 * * 1',        label: 'Every Monday at 9 AM' },
  { expr: '0 0 1 * *',        label: 'First of every month' },
  { expr: '*/15 * * * *',     label: 'Every 15 minutes' },
  { expr: '0 0 * * 0',        label: 'Every Sunday at midnight' },
  { expr: '30 18 * * 1-5',    label: 'Weekdays at 6:30 PM' },
  { expr: '0 9,17 * * *',     label: 'Twice daily (9 AM & 5 PM)' },
  { expr: '0 0 1 1 *',        label: 'Once a year (Jan 1)' },
]

const FIELDS = [
  { name: 'Minute',      range: '0–59' },
  { name: 'Hour',        range: '0–23' },
  { name: 'Day (month)', range: '1–31' },
  { name: 'Month',       range: '1–12' },
  { name: 'Day (week)',  range: '0–6 (Sun–Sat)' },
]

export default function CronExplainer() {
  const [input, setInput] = useState('0 9 * * 1-5')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'CRON Expression Explainer Online | OmniverseTools'
  }, [])

  useEffect(() => {
    explain(input)
  }, [])

  function explain(expr) {
    setError('')
    try {
      const text = cronstrue.toString(expr, { use24HourTimeFormat: false, verbose: true })
      setResult(text)
    } catch (e) {
      setResult('')
      setError('Invalid cron expression. Check the format below.')
    }
  }

  function handleInput(val) {
    setInput(val)
    explain(val)
  }

  const parts = input.trim().split(/\s+/)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">CRON Expression Explainer</h1>
      <p className="text-gray-400 mb-6">
        Paste a cron schedule and instantly get a plain-English explanation of when it runs.
      </p>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Cron Expression</label>
        <input
          type="text"
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder="e.g. 0 9 * * 1-5"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white font-mono text-lg tracking-widest focus:outline-none focus:border-orange-500"
          spellCheck={false}
        />
      </div>

      {/* Field labels */}
      {parts.length >= 5 && (
        <div className="grid grid-cols-5 gap-2 mb-6">
          {FIELDS.map((f, i) => (
            <div key={f.name} className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-center">
              <div className={`font-mono text-base font-bold mb-1 ${parts[i] === '*' ? 'text-gray-500' : 'text-orange-300'}`}>
                {parts[i] ?? '?'}
              </div>
              <div className="text-gray-500 text-xs">{f.name}</div>
              <div className="text-gray-600 text-xs">{f.range}</div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="bg-orange-900/20 border border-orange-700 rounded-xl px-6 py-4 mb-8">
          <div className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-1">Runs</div>
          <div className="text-white text-lg font-medium">{result}</div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-gray-300 font-semibold text-sm mb-3">Quick examples</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLES.map(({ expr, label }) => (
            <button
              key={expr}
              onClick={() => handleInput(expr)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-left transition-colors ${
                input === expr ? 'bg-orange-600/20 border border-orange-600 text-orange-200' : 'bg-zinc-900 border border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className="text-gray-400 font-mono">{expr}</span>
              <span className="text-gray-500 text-xs ml-2">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 text-sm">
        <h2 className="text-gray-300 font-semibold mb-3">Cron syntax reference</h2>
        <div className="grid grid-cols-5 gap-2 text-center text-xs mb-4">
          {FIELDS.map(f => (
            <div key={f.name}>
              <div className="text-gray-400 font-medium">{f.name}</div>
              <div className="text-gray-600">{f.range}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-gray-500 text-xs">
          <div><code className="text-gray-300">*</code> — any value</div>
          <div><code className="text-gray-300">*/n</code> — every n units</div>
          <div><code className="text-gray-300">1,2,3</code> — specific values</div>
          <div><code className="text-gray-300">1-5</code> — range</div>
        </div>
      </div>
    </div>
  )
}
