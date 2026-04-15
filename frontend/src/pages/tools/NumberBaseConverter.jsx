import { useState, useEffect } from 'react'

const BASES = [
  { label: 'Decimal',     short: 'DEC', base: 10, prefix: '',   chars: '0-9' },
  { label: 'Binary',      short: 'BIN', base: 2,  prefix: '0b', chars: '0-1' },
  { label: 'Octal',       short: 'OCT', base: 8,  prefix: '0o', chars: '0-7' },
  { label: 'Hexadecimal', short: 'HEX', base: 16, prefix: '0x', chars: '0-9, A-F' },
]

function convert(value, fromBase) {
  const trimmed = value.trim().replace(/^0[bBoOxX]/, '')
  if (!trimmed) return {}
  const num = parseInt(trimmed, fromBase)
  if (isNaN(num) || num < 0) return { error: true }
  const result = {}
  for (const { base, label } of BASES) {
    result[label] = num.toString(base).toUpperCase()
  }
  return result
}

export default function NumberBaseConverter() {
  const [values, setValues] = useState({ Decimal: '255', Binary: '', Octal: '', Hexadecimal: '' })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    document.title = 'Number Base Converter — Binary, Hex, Octal | OmniverseTools'
    handleChange('255', 10)
  }, [])

  function handleChange(raw, fromBase) {
    const trimmed = raw.trim().replace(/^0[bBoOxX]/, '')
    if (!trimmed) {
      setValues({ Decimal: '', Binary: '', Octal: '', Hexadecimal: '' })
      setError('')
      return
    }
    const result = convert(raw, fromBase)
    if (result.error) {
      setError('Invalid characters for this base.')
      return
    }
    setError('')
    setValues(result)
  }

  function copy(label, val) {
    navigator.clipboard.writeText(val)
    setCopied(label)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Number Base Converter</h1>
      <p className="text-gray-400 mb-6">
        Convert numbers between decimal, binary, octal, and hexadecimal instantly — type in any field to update all.
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      <div className="space-y-3">
        {BASES.map(({ label, short, base, prefix, chars }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-white font-semibold text-sm">{label}</span>
                <span className="text-gray-600 text-xs ml-2">base {base} · {chars}</span>
              </div>
              <div className="flex items-center gap-2">
                {prefix && <span className="text-gray-600 font-mono text-xs">{prefix}</span>}
                <button
                  onClick={() => copy(label, values[label] || '')}
                  disabled={!values[label]}
                  className="text-xs bg-zinc-700 hover:bg-gray-600 disabled:opacity-40 text-white px-3 py-1 rounded transition-colors"
                >
                  {copied === label ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <input
              type="text"
              value={values[label] || ''}
              onChange={e => handleChange(e.target.value, base)}
              placeholder={`Enter ${label.toLowerCase()} number...`}
              className="w-full bg-zinc-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-orange-500"
              spellCheck={false}
            />
          </div>
        ))}
      </div>

      {values.Decimal && (
        <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Quick reference — {values.Decimal} in all bases</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BASES.map(({ label, short, prefix }) => (
              <div key={label} className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="text-gray-500 text-xs mb-1">{short}</div>
                <div className="text-orange-300 font-mono font-bold text-sm break-all">
                  {prefix}{values[label]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Computers work in binary (base 2), but programmers often use hexadecimal (base 16) as a
          compact way to represent binary values — one hex digit equals exactly 4 binary bits.
          Octal (base 8) appears in Unix file permissions. Decimal is what we use every day.
          Type in any field and all others update instantly.
        </p>
      </div>
    </div>
  )
}
