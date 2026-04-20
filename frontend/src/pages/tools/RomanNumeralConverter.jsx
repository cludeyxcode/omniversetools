import { useState, useEffect } from 'react'

const TABLE = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100,  'C'], [90,  'XC'], [50,  'L'], [40,  'XL'],
  [10,   'X'], [9,   'IX'], [5,   'V'], [4,   'IV'],
  [1,    'I'],
]

function toRoman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null
  let result = ''
  const steps = []
  let remaining = n
  for (const [val, sym] of TABLE) {
    while (remaining >= val) {
      result += sym
      steps.push({ sym, val, remaining: remaining - val })
      remaining -= val
    }
  }
  return { roman: result, steps }
}

function fromRoman(str) {
  const s = str.trim().toUpperCase()
  if (!s) return null
  const vals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const cur = vals[s[i]]
    const nxt = vals[s[i + 1]]
    if (cur === undefined) return null
    if (nxt && nxt > cur) {
      total += nxt - cur
      i++
    } else {
      total += cur
    }
  }
  // Validate by round-tripping
  const check = toRoman(total)
  if (!check || check.roman !== s) return null
  return total
}

const EXAMPLES = [
  { label: '2024', n: 2024 },
  { label: '1999', n: 1999 },
  { label: '42',   n: 42   },
  { label: 'XIV',  r: 'XIV' },
  { label: 'XLII', r: 'XLII' },
  { label: 'MMXXIV', r: 'MMXXIV' },
]

export default function RomanNumeralConverter() {
  const [decInput, setDecInput] = useState('2024')
  const [romInput, setRomInput] = useState('')
  const [mode, setMode]         = useState('toRoman') // 'toRoman' | 'fromRoman'

  useEffect(() => {
    document.title = 'Roman Numeral Converter — Decimal ↔ Roman | OmniverseTools'
  }, [])

  // --- to-Roman branch ---
  const decNum = parseInt(decInput, 10)
  const decValid = decInput !== '' && Number.isInteger(decNum) && decNum >= 1 && decNum <= 3999
  const toResult = decValid ? toRoman(decNum) : null

  // --- from-Roman branch ---
  const fromResult = romInput.trim() ? fromRoman(romInput) : null
  const romInvalid = romInput.trim() !== '' && fromResult === null

  function applyExample(ex) {
    if (ex.n !== undefined) {
      setMode('toRoman')
      setDecInput(String(ex.n))
      setRomInput('')
    } else {
      setMode('fromRoman')
      setRomInput(ex.r)
      setDecInput('')
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Roman Numeral Converter</h1>
      <p className="text-gray-400 mb-8">
        Convert between decimal numbers and Roman numerals instantly — supports 1 to 3999 with a
        full step-by-step breakdown.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('toRoman')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            mode === 'toRoman'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          Decimal → Roman
        </button>
        <button
          onClick={() => setMode('fromRoman')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            mode === 'fromRoman'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          Roman → Decimal
        </button>
      </div>

      {/* --- Decimal → Roman --- */}
      {mode === 'toRoman' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-2">
              Decimal number (1–3999)
            </label>
            <input
              type="number"
              value={decInput}
              min="1"
              max="3999"
              onChange={e => setDecInput(e.target.value)}
              placeholder="e.g. 2024"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-orange-500"
            />
            {decInput !== '' && !decValid && (
              <p className="text-red-400 text-xs mt-2">Enter a whole number between 1 and 3999.</p>
            )}
          </div>

          {toResult && (
            <>
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Roman numeral</label>
                  <button
                    onClick={() => copyText(toResult.roman)}
                    className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-4xl font-bold font-mono text-orange-300 tracking-widest mt-2">
                  {toResult.roman}
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
                <h2 className="text-white font-semibold mb-3">Step-by-step breakdown</h2>
                <div className="space-y-2">
                  {toResult.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-10 text-right font-mono text-orange-300 font-bold">{s.sym}</span>
                      <span className="text-gray-500">=</span>
                      <span className="text-gray-300 font-mono w-12">{s.val}</span>
                      <span className="text-gray-600 text-xs">
                        (remaining: {s.remaining})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Roman → Decimal --- */}
      {mode === 'fromRoman' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-2">
              Roman numeral
            </label>
            <input
              type="text"
              value={romInput}
              onChange={e => setRomInput(e.target.value.toUpperCase())}
              placeholder="e.g. MMXXIV"
              className={`w-full bg-zinc-800 border rounded-lg px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-orange-500 uppercase ${
                romInvalid ? 'border-red-500' : 'border-zinc-600'
              }`}
            />
            {romInvalid && (
              <p className="text-red-400 text-xs mt-2">
                Not a valid Roman numeral (1–3999). Use only I, V, X, L, C, D, M.
              </p>
            )}
          </div>

          {fromResult !== null && (
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Decimal value</label>
                <button
                  onClick={() => copyText(String(fromResult))}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-4xl font-bold font-mono text-orange-300 mt-2">{fromResult}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick examples */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mt-6">
        <h2 className="text-white font-semibold mb-3">Quick examples</h2>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => applyExample(ex)}
              className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors font-mono"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reference table */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mt-4">
        <h2 className="text-white font-semibold mb-3">Symbol reference</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-sm">
          {[['I','1'],['V','5'],['X','10'],['L','50'],['C','100'],['D','500'],['M','1000']].map(([sym, val]) => (
            <div key={sym} className="bg-zinc-800 rounded-lg py-2">
              <div className="text-orange-300 font-bold font-mono text-lg">{sym}</div>
              <div className="text-gray-500 text-xs">{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 leading-relaxed mt-6">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About Roman numerals</h2>
        <p>
          Roman numerals use seven symbols: I (1), V (5), X (10), L (50), C (100), D (500), and
          M (1000). Smaller values placed before larger ones indicate subtraction — IV = 4,
          IX = 9, XL = 40, XC = 90, CD = 400, CM = 900. The system supports numbers from 1 to
          3999 (MMMCMXCIX). All calculations happen instantly in your browser.
        </p>
      </div>
    </div>
  )
}
