import { useState, useEffect } from 'react'
import cronstrue from 'cronstrue'

const MONTHS = [
  'January (1)', 'February (2)', 'March (3)', 'April (4)',
  'May (5)', 'June (6)', 'July (7)', 'August (8)',
  'September (9)', 'October (10)', 'November (11)', 'December (12)',
]
const DAYS_OF_WEEK = [
  'Sunday (0)', 'Monday (1)', 'Tuesday (2)', 'Wednesday (3)',
  'Thursday (4)', 'Friday (5)', 'Saturday (6)',
]

const FIELD_CONFIGS = [
  { key: 'minute', label: 'Minute',       min: 0, max: 59, step: 15 },
  { key: 'hour',   label: 'Hour',         min: 0, max: 23, step: 6  },
  { key: 'dom',    label: 'Day of Month', min: 1, max: 31, step: 5  },
  { key: 'month',  label: 'Month',        min: 1, max: 12, step: 3,  names: MONTHS },
  { key: 'dow',    label: 'Day of Week',  min: 0, max: 6,  step: 1,  names: DAYS_OF_WEEK },
]

const PRESETS = [
  { label: 'Every minute',      expr: '* * * * *'    },
  { label: 'Every hour',        expr: '0 * * * *'    },
  { label: 'Daily at midnight', expr: '0 0 * * *'    },
  { label: 'Daily at 9 AM',     expr: '0 9 * * *'    },
  { label: 'Weekdays at 9 AM',  expr: '0 9 * * 1-5'  },
  { label: 'Every 15 minutes',  expr: '*/15 * * * *' },
  { label: 'Weekly (Monday)',   expr: '0 0 * * 1'    },
  { label: 'Monthly (1st)',     expr: '0 0 1 * *'    },
]

function makeDefault(config) {
  return {
    type: 'every',
    value: String(config.min),
    value2: String(config.max),
    step: String(config.step),
  }
}

function buildPart({ type, value, value2, step }) {
  if (type === 'every')    return '*'
  if (type === 'specific') return value || '0'
  if (type === 'step')     return `*/${step || '1'}`
  if (type === 'range')    return `${value}-${value2}`
  return '*'
}

function parsePart(part, config) {
  const { min, max, step } = config
  if (part === '*')              return { type: 'every',    value: String(min), value2: String(max), step: String(step) }
  if (/^\*\/\d+$/.test(part))   return { type: 'step',     value: String(min), value2: String(max), step: part.split('/')[1] }
  if (/^\d+-\d+$/.test(part)) {
    const [a, b] = part.split('-')
    return { type: 'range',    value: a, value2: b, step: String(step) }
  }
  if (/^\d+$/.test(part))       return { type: 'specific', value: part, value2: String(max), step: String(step) }
  return { type: 'every', value: String(min), value2: String(max), step: String(step) }
}

function FieldCard({ config, value, onChange }) {
  const { label, min, max, names } = config
  const options = Array.from({ length: max - min + 1 }, (_, i) => {
    const n = min + i
    return { num: n, label: names ? names[i] : String(n) }
  })

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300 font-semibold">{label}</span>
        <span className="font-mono text-orange-300 text-sm bg-orange-500/10 px-2 py-0.5 rounded">
          {buildPart(value)}
        </span>
      </div>

      <select
        value={value.type}
        onChange={e => onChange({ ...value, type: e.target.value })}
        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
      >
        <option value="every">Every {label.toLowerCase()}</option>
        <option value="specific">Specific value</option>
        <option value="step">Every N units (*/N)</option>
        <option value="range">Range (A–B)</option>
      </select>

      {value.type === 'specific' && (
        <select
          value={value.value}
          onChange={e => onChange({ ...value, value: e.target.value })}
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
        >
          {options.map(o => (
            <option key={o.num} value={String(o.num)}>{o.label}</option>
          ))}
        </select>
      )}

      {value.type === 'step' && (
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            N — run every N {label.toLowerCase()}s
          </label>
          <input
            type="number"
            min={1}
            max={max}
            value={value.step}
            onChange={e => onChange({ ...value, step: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      )}

      {value.type === 'range' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <select
              value={value.value}
              onChange={e => onChange({ ...value, value: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {options.map(o => (
                <option key={o.num} value={String(o.num)}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <select
              value={value.value2}
              onChange={e => onChange({ ...value, value2: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {options.map(o => (
                <option key={o.num} value={String(o.num)}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CronBuilder() {
  const [fields, setFields] = useState(() =>
    Object.fromEntries(FIELD_CONFIGS.map(c => [c.key, makeDefault(c)]))
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Cron Expression Builder | OmniverseTools'
  }, [])

  const parts = FIELD_CONFIGS.map(c => buildPart(fields[c.key]))
  const expr = parts.join(' ')

  let description = ''
  let parseError = ''
  try {
    description = cronstrue.toString(expr, { use24HourTimeFormat: false, verbose: true })
  } catch {
    parseError = 'Invalid combination — adjust the fields above.'
  }

  function update(key, val) {
    setFields(prev => ({ ...prev, [key]: val }))
  }

  function applyPreset(presetExpr) {
    const p = presetExpr.trim().split(/\s+/)
    if (p.length !== 5) return
    const next = {}
    FIELD_CONFIGS.forEach((c, i) => {
      next[c.key] = parsePart(p[i], c)
    })
    setFields(next)
  }

  function copy() {
    navigator.clipboard.writeText(expr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Cron Expression Builder</h1>
      <p className="text-gray-400 mb-8">
        Build a cron schedule visually — pick options for each field and get the cron string instantly.
        Works alongside the{' '}
        <a href="/tools/cron-explainer" className="text-orange-400 hover:underline">CRON Explainer</a>.
      </p>

      {/* Quick presets */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Quick presets</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.expr}
              onClick={() => applyPreset(p.expr)}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-gray-300 text-xs rounded-lg hover:bg-zinc-700 hover:border-orange-500 hover:text-orange-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Field editors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {FIELD_CONFIGS.map(c => (
          <FieldCard
            key={c.key}
            config={c}
            value={fields[c.key]}
            onChange={val => update(c.key, val)}
          />
        ))}
      </div>

      {/* Result */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400 font-semibold">Generated cron expression</span>
          <button
            onClick={copy}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs rounded-lg transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <div className="font-mono text-2xl text-orange-300 tracking-widest mb-3">{expr}</div>
        {description && (
          <div className="text-gray-300 text-sm">{description}</div>
        )}
        {parseError && (
          <div className="text-red-400 text-sm">{parseError}</div>
        )}
      </div>

      {/* Field reference */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 text-sm">
        <h2 className="text-gray-300 font-semibold mb-4">Field order reference</h2>
        <div className="grid grid-cols-5 gap-2 text-center mb-4">
          {FIELD_CONFIGS.map((c, i) => (
            <div key={c.key} className="bg-zinc-800 rounded-lg p-2">
              <div className="font-mono text-orange-300 text-base font-bold mb-1">{parts[i]}</div>
              <div className="text-gray-400 text-xs">{c.label}</div>
              <div className="text-gray-600 text-xs">{c.min}–{c.max}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-gray-500 text-xs">
          <div><code className="text-gray-300">*</code> — any / every value</div>
          <div><code className="text-gray-300">*/N</code> — every N units</div>
          <div><code className="text-gray-300">5</code> — specific value</div>
          <div><code className="text-gray-300">1-5</code> — range from 1 to 5</div>
        </div>
      </div>
    </div>
  )
}
