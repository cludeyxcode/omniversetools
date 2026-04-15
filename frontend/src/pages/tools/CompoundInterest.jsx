import { useState, useEffect } from 'react'

const FREQS = [
  { label: 'Annually',  n: 1 },
  { label: 'Quarterly', n: 4 },
  { label: 'Monthly',   n: 12 },
  { label: 'Daily',     n: 365 },
]

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate]           = useState('')
  const [years, setYears]         = useState('')
  const [freq, setFreq]           = useState(12)
  const [monthly, setMonthly]     = useState('')
  const [result, setResult]       = useState(null)

  useEffect(() => { document.title = 'Compound Interest Calculator | OmniverseTools' }, [])

  function calculate() {
    const P   = parseFloat(principal) || 0
    const r   = parseFloat(rate) / 100
    const t   = parseFloat(years)
    const pmt = parseFloat(monthly) || 0
    if (!r || !t || t <= 0 || (P <= 0 && pmt <= 0)) return

    const mr = r / 12  // monthly rate for contribution series
    const schedule = []
    for (let y = 1; y <= Math.min(t, 50); y++) {
      const months      = 12 * y
      const principalFV = P * Math.pow(1 + r / freq, freq * y)
      const contribFV   = pmt > 0 && mr > 0 ? pmt * (Math.pow(1 + mr, months) - 1) / mr : pmt * months
      const balance     = principalFV + contribFV
      const contributed = P + pmt * months
      schedule.push({ year: y, balance, contributed, interest: balance - contributed })
    }
    setResult(schedule)
  }

  const fmt = v => v.toLocaleString('en-US', { maximumFractionDigits: 0 })
  const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

  const last = result ? result[result.length - 1] : null
  const maxBal = result ? Math.max(...result.map(r => r.balance)) : 1

  // Thin out bars for long time horizons so they stay readable
  const bars = result
    ? result.filter((_, i) => result.length <= 20 || i % Math.ceil(result.length / 20) === 0 || i === result.length - 1)
    : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Compound Interest Calculator</h1>
      <p className="text-gray-400 mb-6">See how an investment grows over time with the power of compounding.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Initial investment ($)</label>
            <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 5000" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Annual interest rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 7" step="0.1" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Time period (years)</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 20" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Monthly contribution ($) <span className="text-gray-600">optional</span></label>
            <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="e.g. 200" className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Compound frequency</label>
          <div className="flex gap-2 flex-wrap">
            {FREQS.map(f => (
              <button key={f.n} onClick={() => setFreq(f.n)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${freq === f.n ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-700'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate
        </button>
      </div>

      {last && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Final balance',     val: `$${fmt(last.balance)}`,     color: 'text-green-400' },
              { label: 'Total contributed', val: `$${fmt(last.contributed)}`, color: 'text-white' },
              { label: 'Interest earned',   val: `$${fmt(last.interest)}`,    color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="text-sm text-gray-400 mb-4">Growth over time</div>
            <div className="space-y-1.5">
              {bars.map(row => (
                <div key={row.year} className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 w-10 text-right shrink-0">Yr {row.year}</div>
                  <div className="flex-1 flex h-5 rounded overflow-hidden bg-zinc-800">
                    <div className="bg-zinc-600 shrink-0" style={{ width: `${(row.contributed / maxBal) * 100}%` }} />
                    <div className="bg-gradient-to-r from-orange-500 to-green-500 shrink-0" style={{ width: `${(Math.max(0, row.interest) / maxBal) * 100}%` }} />
                  </div>
                  <div className="text-xs text-white w-20 text-right font-mono shrink-0">${fmt(row.balance)}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-zinc-600 inline-block" />Contributed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-500 inline-block" />Interest earned</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
