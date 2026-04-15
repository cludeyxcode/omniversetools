import { useState, useEffect } from 'react'

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate]           = useState('')
  const [term, setTerm]           = useState('')
  const [termUnit, setTermUnit]   = useState('years')
  const [result, setResult]       = useState(null)
  const [showAll, setShowAll]     = useState(false)

  useEffect(() => { document.title = 'Loan & EMI Calculator | OmniverseTools' }, [])

  function calculate() {
    const P = parseFloat(principal)
    const r = parseFloat(rate) / 100 / 12
    const t = parseFloat(term)
    if (!P || !t || P <= 0 || t <= 0 || parseFloat(rate) < 0) return
    const n = termUnit === 'years' ? Math.round(t * 12) : Math.round(t)
    if (n <= 0) return

    const emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - P

    let balance = P
    const schedule = Array.from({ length: n }, (_, i) => {
      const interest = balance * r
      const principal = emi - interest
      balance = Math.max(0, balance - principal)
      return { month: i + 1, principal, interest, balance }
    })

    setResult({ emi, totalPayment, totalInterest, schedule, n })
    setShowAll(false)
  }

  const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

  const rows = result ? (showAll ? result.schedule : result.schedule.slice(0, 12)) : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Loan &amp; EMI Calculator</h1>
      <p className="text-gray-400 mb-6">Calculate your monthly payment and view the full amortisation schedule.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Loan amount ($)</label>
            <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 10000" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Annual interest rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 6.5" step="0.1" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Loan term</label>
            <div className="flex gap-2">
              <input type="number" value={term} onChange={e => setTerm(e.target.value)}
                placeholder={termUnit === 'years' ? 'e.g. 5' : 'e.g. 60'}
                className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
              <select value={termUnit} onChange={e => setTermUnit(e.target.value)}
                className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500">
                <option value="years">Yrs</option>
                <option value="months">Mo</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={calculate}
          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate
        </button>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Monthly payment', val: `$${fmt(result.emi)}`,           color: 'text-orange-400' },
              { label: 'Total payment',   val: `$${fmt(result.totalPayment)}`,   color: 'text-white' },
              { label: 'Total interest',  val: `$${fmt(result.totalInterest)}`,  color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
            <div className="text-sm text-gray-400 mb-3">Principal vs Interest breakdown</div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div className="bg-orange-500" style={{ width: `${(parseFloat(principal) / result.totalPayment) * 100}%` }} />
              <div className="bg-red-700 flex-1" />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />Principal ${fmt(parseFloat(principal))}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-700 inline-block" />Interest ${fmt(result.totalInterest)}</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-700 text-sm font-medium text-white">
              Amortisation Schedule {!showAll && result.n > 12 && <span className="text-gray-500 font-normal ml-1">(first 12 of {result.n} months)</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Principal</th>
                    <th className="px-4 py-3 text-right">Interest</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {rows.map(row => (
                    <tr key={row.month} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-2.5 text-gray-400">{row.month}</td>
                      <td className="px-4 py-2.5 text-right text-orange-400">${fmt(row.principal)}</td>
                      <td className="px-4 py-2.5 text-right text-red-400">${fmt(row.interest)}</td>
                      <td className="px-4 py-2.5 text-right text-white">${fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.n > 12 && (
              <div className="px-5 py-3 border-t border-zinc-700">
                <button onClick={() => setShowAll(v => !v)}
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                  {showAll ? '↑ Show less' : `↓ Show all ${result.n} months`}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
