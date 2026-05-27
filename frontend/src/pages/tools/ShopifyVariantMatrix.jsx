import { useState, useEffect } from 'react'

function cartesian(arrays) {
  if (arrays.length === 0) return []
  return arrays.reduce((acc, arr) =>
    acc.flatMap(a => arr.map(v => [...a, v])), [[]])
}

let _id = 0
function makeOption(name = '', values = '') {
  return { id: _id++, name, values }
}

function parseValues(str) {
  return str.split(/[,\n]/).map(v => v.trim()).filter(Boolean)
}

export default function ShopifyVariantMatrix() {
  const [options, setOptions] = useState([
    makeOption('Size', 'S, M, L, XL'),
    makeOption('Colour', 'Red, Blue, Black'),
  ])
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = 'Shopify Variant Matrix | OmniverseTools' }, [])

  function addOption() {
    if (options.length >= 3) return
    setOptions(prev => [...prev, makeOption()])
  }

  function removeOption(id) {
    setOptions(prev => prev.filter(o => o.id !== id))
  }

  function update(id, field, value) {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
  }

  const parsed = options
    .map(o => ({ name: o.name.trim() || '(unnamed)', values: parseValues(o.values) }))
    .filter(o => o.values.length > 0)

  const combos = parsed.length > 0 ? cartesian(parsed.map(o => o.values)) : []
  const LIMIT = 100
  const overLimit = combos.length > LIMIT

  function toCsv() {
    const header = parsed.map(o => `"${o.name}"`).join(',')
    const rows = combos.map(row => row.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    return header + '\n' + rows
  }

  function copyCSV() {
    navigator.clipboard.writeText(toCsv())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadCSV() {
    const blob = new Blob([toCsv()], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shopify-variants.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Shopify Variant Matrix</h1>
      <p className="text-gray-400 mb-8">
        Enter your product options and values to see every variant combination. Shopify supports up to{' '}
        <strong className="text-gray-300">3 options</strong> and <strong className="text-gray-300">100 variants</strong>{' '}
        per product. Export to CSV for the Shopify product import template.
      </p>

      {/* Option builder */}
      <div className="space-y-4 mb-6">
        {options.map((opt, idx) => (
          <div key={opt.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                Option {idx + 1}
              </span>
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(opt.id)}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Option name</label>
                <input
                  type="text"
                  value={opt.name}
                  onChange={e => update(opt.id, 'name', e.target.value)}
                  placeholder="e.g. Size"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Values{' '}
                  <span className="text-gray-600">(comma or newline separated)</span>
                </label>
                <textarea
                  value={opt.values}
                  onChange={e => update(opt.id, 'values', e.target.value)}
                  placeholder="e.g. S, M, L, XL"
                  rows={2}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
                {parseValues(opt.values).length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {parseValues(opt.values).length} value{parseValues(opt.values).length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {options.length < 3 && (
          <button
            onClick={addOption}
            className="w-full py-3 rounded-xl border border-dashed border-zinc-700 text-sm text-gray-500 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
          >
            + Add Option {options.length + 1} of 3
          </button>
        )}
      </div>

      {/* Results */}
      {combos.length > 0 && (
        <div>
          {/* Summary bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${overLimit ? 'text-red-400' : 'text-white'}`}>
                {combos.length} variant{combos.length !== 1 ? 's' : ''}
              </span>
              {overLimit && (
                <span className="text-xs px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-full">
                  Exceeds Shopify's 100-variant limit
                </span>
              )}
              {!overLimit && (
                <span className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full">
                  Within Shopify limit
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadCSV}
                className="text-sm bg-zinc-700 hover:bg-zinc-600 text-gray-300 hover:text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Download CSV
              </button>
              <button
                onClick={copyCSV}
                className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy CSV'}
              </button>
            </div>
          </div>

          {/* Variant table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium w-12">#</th>
                  {parsed.map(o => (
                    <th key={o.name} className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">
                      {o.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(overLimit ? combos.slice(0, LIMIT) : combos).map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-600 text-xs">{i + 1}</td>
                    {row.map((val, j) => (
                      <td key={j} className="px-4 py-2.5 text-gray-200">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {overLimit && (
              <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800 text-xs text-gray-500 text-center">
                Showing first {LIMIT} of {combos.length} variants — reduce your options or values to stay within Shopify's limit.
              </div>
            )}
          </div>
        </div>
      )}

      {parsed.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-12 text-center text-gray-500 text-sm">
          Add at least one option with values to see the variant matrix.
        </div>
      )}

      {/* Info section */}
      <div className="mt-10 text-sm text-gray-500 leading-relaxed space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-gray-300 font-semibold text-base mb-3">Shopify Variant Limits</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ['Max options per product', '3', 'e.g. Size, Colour, Material'],
              ['Max values per option', '255', 'Shopify has no hard cap here, but variant total is capped'],
              ['Max variants per product', '100', '3 × 4 × 8 = 96 — exceeding 100 requires an app'],
            ].map(([label, val, note]) => (
              <div key={label} className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold text-orange-400 mb-1">{val}</p>
                <p className="text-white text-xs font-semibold mb-0.5">{label}</p>
                <p className="text-gray-500 text-xs">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-gray-300 font-semibold text-base mb-3">How to use the CSV export</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-400">
            <li>Download the CSV and open it in a spreadsheet.</li>
            <li>Add your Shopify product import columns: <code className="bg-zinc-800 px-1.5 rounded text-gray-300 text-xs">Handle</code>, <code className="bg-zinc-800 px-1.5 rounded text-gray-300 text-xs">Title</code>, <code className="bg-zinc-800 px-1.5 rounded text-gray-300 text-xs">Price</code>, <code className="bg-zinc-800 px-1.5 rounded text-gray-300 text-xs">SKU</code>, etc.</li>
            <li>Each row in this CSV becomes one variant row in the Shopify product import template.</li>
            <li>In Shopify Admin, go to <strong className="text-gray-300">Products → Import</strong> and upload the completed file.</li>
          </ol>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400/80 text-xs leading-relaxed">
          <strong className="text-blue-400">100% client-side:</strong> All combinations are generated in your browser. No product data is sent to any server.
        </div>
      </div>
    </div>
  )
}
