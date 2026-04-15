import { useState, useEffect } from 'react'

const PRESETS = [10, 15, 18, 20, 25]

export default function TipCalculator() {
  const [bill, setBill]     = useState('')
  const [tipPct, setTipPct] = useState(18)
  const [custom, setCustom] = useState('')
  const [people, setPeople] = useState('1')

  useEffect(() => { document.title = 'Tip Calculator | OmniverseTools' }, [])

  const effectivePct = custom !== '' ? (parseFloat(custom) || 0) : tipPct
  const billNum  = parseFloat(bill) || 0
  const pplNum   = Math.max(1, parseInt(people) || 1)
  const tipAmt   = billNum * effectivePct / 100
  const total    = billNum + tipAmt
  const perPerson = total / pplNum
  const tipPer   = tipAmt / pplNum
  const fmt = v => v.toFixed(2)

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Tip Calculator</h1>
      <p className="text-gray-400 mb-6">Calculate tips and split the bill between any number of people.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-5 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Bill amount ($)</label>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="0.00"
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-lg font-semibold focus:outline-none focus:border-orange-500" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Tip percentage</label>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {PRESETS.map(p => (
              <button key={p} onClick={() => { setTipPct(p); setCustom('') }}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${custom === '' && tipPct === p ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-700'}`}>
                {p}%
              </button>
            ))}
          </div>
          <input type="number" value={custom} onChange={e => setCustom(e.target.value)} placeholder="Custom %"
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Split between</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setPeople(String(Math.max(1, pplNum - 1)))}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xl flex items-center justify-center hover:border-orange-500 transition-colors">−</button>
            <input type="number" value={people} onChange={e => setPeople(e.target.value)} min="1"
              className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-center text-sm focus:outline-none focus:border-orange-500" />
            <button onClick={() => setPeople(String(pplNum + 1))}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xl flex items-center justify-center hover:border-orange-500 transition-colors">+</button>
            <span className="text-gray-400 text-sm">people</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-300">Tip ({effectivePct}%)</div>
            {pplNum > 1 && <div className="text-xs text-gray-500 mt-0.5">${fmt(tipPer)} per person</div>}
          </div>
          <div className="text-2xl font-bold font-mono text-white">${fmt(tipAmt)}</div>
        </div>
        <div className="px-5 py-4 flex justify-between items-center border-t border-zinc-700 bg-zinc-800/30">
          <div>
            <div className="font-semibold text-white">Total</div>
            {pplNum > 1 && <div className="text-xs text-gray-500 mt-0.5">${fmt(perPerson)} per person</div>}
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400">${fmt(total)}</div>
        </div>
      </div>

      {pplNum > 1 && (
        <div className="mt-3 bg-zinc-900 border border-orange-800/40 rounded-xl px-5 py-5 text-center">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Each person pays</div>
          <div className="text-5xl font-bold text-orange-400 font-mono">${fmt(perPerson)}</div>
          <div className="text-xs text-gray-500 mt-2">includes ${fmt(tipPer)} tip</div>
        </div>
      )}
    </div>
  )
}
