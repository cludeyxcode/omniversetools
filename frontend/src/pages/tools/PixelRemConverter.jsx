import { useState, useEffect } from 'react'

const COMMON_SIZES = [4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 96]

function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return parseFloat(n.toFixed(4)).toString()
}

export default function PixelRemConverter() {
  const [base, setBase] = useState('16')
  const [px, setPx]     = useState('16')
  const [rem, setRem]   = useState('1')
  const [em, setEm]     = useState('1')
  const [source, setSource] = useState('px')
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    document.title = 'Pixel ↔ REM / EM Converter | OmniverseTools'
  }, [])

  const baseNum = parseFloat(base) || 16

  function handlePxChange(val) {
    setPx(val)
    setSource('px')
    const n = parseFloat(val)
    if (!isNaN(n)) {
      setRem(fmt(n / baseNum))
      setEm(fmt(n / baseNum))
    }
  }

  function handleRemChange(val) {
    setRem(val)
    setSource('rem')
    const n = parseFloat(val)
    if (!isNaN(n)) {
      setPx(fmt(n * baseNum))
      setEm(fmt(n))
    }
  }

  function handleEmChange(val) {
    setEm(val)
    setSource('em')
    const n = parseFloat(val)
    if (!isNaN(n)) {
      setPx(fmt(n * baseNum))
      setRem(fmt(n))
    }
  }

  function handleBaseChange(val) {
    setBase(val)
    const nb = parseFloat(val) || 16
    if (source === 'px') {
      const n = parseFloat(px)
      if (!isNaN(n)) { setRem(fmt(n / nb)); setEm(fmt(n / nb)) }
    } else {
      const n = parseFloat(rem)
      if (!isNaN(n)) { setPx(fmt(n * nb)) }
    }
  }

  function copyCell(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const fields = [
    { unit: 'px',  value: px,  onChange: handlePxChange  },
    { unit: 'rem', value: rem, onChange: handleRemChange  },
    { unit: 'em',  value: em,  onChange: handleEmChange   },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Pixel ↔ REM / EM Converter</h1>
      <p className="text-gray-400 mb-8">
        Convert between px, rem, and em instantly. Set your base font size to match your
        project — type in any field to update the rest.
      </p>

      {/* Base font size */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <h2 className="text-white font-semibold mb-3">Base font size</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={base}
              min="1"
              onChange={e => handleBaseChange(e.target.value)}
              className="w-24 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            />
            <span className="text-gray-400 text-sm">px</span>
          </div>
          <div className="flex gap-2">
            {[14, 16, 18, 20].map(s => (
              <button
                key={s}
                onClick={() => handleBaseChange(String(s))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  parseFloat(base) === s
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Converter */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <h2 className="text-white font-semibold mb-4">Convert</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fields.map(({ unit, value, onChange }) => (
            <div key={unit}>
              <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1.5">{unit}</label>
              <input
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          rem and em are equivalent when the parent font size equals the root font size.
        </p>
      </div>

      {/* Reference table */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-8">
        <h2 className="text-white font-semibold mb-4">
          Reference table{' '}
          <span className="text-gray-500 font-normal text-sm">(base: {base || 16}px)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-orange-500 pb-2 pr-4 w-1/4">px</th>
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-orange-500 pb-2 pr-4 w-1/3">rem</th>
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-orange-500 pb-2 w-1/3">em</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_SIZES.map((size, i) => {
                const remVal = fmt(size / baseNum)
                const emVal  = fmt(size / baseNum)
                return (
                  <tr key={size} className={i % 2 === 0 ? 'bg-zinc-800/30' : ''}>
                    <td className="py-2 pr-4 font-mono text-gray-300">{size}px</td>
                    <td className="py-2 pr-4">
                      <button
                        onClick={() => copyCell(`${remVal}rem`, `rem-${size}`)}
                        className="font-mono text-orange-300 hover:text-orange-200 transition-colors"
                        title="Copy"
                      >
                        {copied === `rem-${size}` ? '✓' : `${remVal}rem`}
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => copyCell(`${emVal}em`, `em-${size}`)}
                        className="font-mono text-orange-300 hover:text-orange-200 transition-colors"
                        title="Copy"
                      >
                        {copied === `em-${size}` ? '✓' : `${emVal}em`}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 mt-3">Click a rem/em value to copy it to the clipboard.</p>
      </div>

      <div className="text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          <strong className="text-gray-400">rem</strong> (root em) is relative to the root{' '}
          <code className="text-orange-400 text-xs">html</code> font size — typically 16 px in
          browsers. <strong className="text-gray-400">em</strong> is relative to the parent
          element's font size. When the parent equals the root, rem and em are identical.
          Use rem for consistent sizing that only depends on the root; use em for components
          that should scale with their parent context. All conversions run entirely in your browser.
        </p>
      </div>
    </div>
  )
}
