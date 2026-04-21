import { useState, useEffect } from 'react'

const PRESETS = [5, 7.5, 10, 15, 20, 21, 25]

export default function VatCalculator() {
  const [price, setPrice]       = useState('')
  const [rate, setRate]         = useState(20)
  const [customRate, setCustomRate] = useState('')
  const [mode, setMode]         = useState('add')

  useEffect(() => { document.title = 'VAT / Sales Tax Calculator | OmniverseTools' }, [])

  const effectiveRate = customRate !== '' ? (parseFloat(customRate) || 0) : rate
  const priceNum = parseFloat(price) || 0

  let priceExcl, taxAmt, priceIncl
  if (mode === 'add') {
    priceExcl = priceNum
    taxAmt    = priceNum * effectiveRate / 100
    priceIncl = priceNum + taxAmt
  } else {
    priceIncl = priceNum
    priceExcl = priceNum / (1 + effectiveRate / 100)
    taxAmt    = priceIncl - priceExcl
  }

  const fmt = v => v.toFixed(2)

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">VAT / Sales Tax Calculator</h1>
      <p className="text-gray-400 mb-6">
        Add or remove VAT and sales tax from any price — pick a common rate or enter a custom percentage.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-5 mb-4">
        {/* Mode toggle */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('add')}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'add' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-700'}`}
            >
              Add tax to price
            </button>
            <button
              onClick={() => setMode('remove')}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'remove' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-700'}`}
            >
              Remove tax from price
            </button>
          </div>
        </div>

        {/* Price input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {mode === 'add' ? 'Price (excl. tax)' : 'Price (incl. tax)'}
          </label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-lg font-semibold focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Rate presets */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Tax rate</label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { setRate(p); setCustomRate('') }}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${customRate === '' && rate === p ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-700'}`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="number"
            value={customRate}
            onChange={e => setCustomRate(e.target.value)}
            placeholder="Custom %"
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-300">Price excl. tax</div>
          <div className="text-xl font-bold font-mono text-white">${fmt(priceExcl)}</div>
        </div>
        <div className="px-5 py-4 flex justify-between items-center border-t border-zinc-700">
          <div className="text-sm text-gray-300">Tax ({effectiveRate}%)</div>
          <div className="text-xl font-bold font-mono text-white">${fmt(taxAmt)}</div>
        </div>
        <div className="px-5 py-4 flex justify-between items-center border-t border-zinc-700 bg-zinc-800/30">
          <div className="font-semibold text-white">Price incl. tax</div>
          <div className="text-2xl font-bold font-mono text-orange-400">${fmt(priceIncl)}</div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">How it works</h2>
        <p className="mb-2">
          <strong className="text-gray-400">Add tax:</strong> enter the pre-tax price and your rate. The calculator multiplies by the rate to find the tax amount and adds it to get the final price.
        </p>
        <p>
          <strong className="text-gray-400">Remove tax:</strong> enter the tax-inclusive price. The calculator divides by (1 + rate/100) to recover the original pre-tax price and shows how much tax was included.
        </p>
      </div>
    </div>
  )
}
