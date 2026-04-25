import { useState, useEffect } from 'react'

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('')
  const [downPct,   setDownPct]   = useState('')
  const [downAmt,   setDownAmt]   = useState('')
  const [downMode,  setDownMode]  = useState('pct')
  const [rate,      setRate]      = useState('')
  const [term,      setTerm]      = useState('30')
  const [result,    setResult]    = useState(null)
  const [showAll,   setShowAll]   = useState(false)

  useEffect(() => { document.title = 'Mortgage Calculator | OmniverseTools' }, [])

  function handleHomePrice(val) {
    setHomePrice(val)
    const price = parseFloat(val)
    if (!isNaN(price) && price > 0) {
      if (downMode === 'pct' && downPct !== '') {
        setDownAmt(((parseFloat(downPct) / 100) * price).toFixed(2))
      } else if (downMode === 'amt' && downAmt !== '') {
        setDownPct(((parseFloat(downAmt) / price) * 100).toFixed(2))
      }
    }
  }

  function handleDownPct(val) {
    setDownPct(val)
    const price = parseFloat(homePrice)
    const pct   = parseFloat(val)
    if (!isNaN(price) && price > 0 && !isNaN(pct)) {
      setDownAmt(((pct / 100) * price).toFixed(2))
    }
  }

  function handleDownAmt(val) {
    setDownAmt(val)
    const price = parseFloat(homePrice)
    const amt   = parseFloat(val)
    if (!isNaN(price) && price > 0 && !isNaN(amt)) {
      setDownPct(((amt / price) * 100).toFixed(2))
    }
  }

  function calculate() {
    const price = parseFloat(homePrice)
    const r     = parseFloat(rate)
    const n     = parseInt(term) * 12
    if (!price || price <= 0 || isNaN(r) || r < 0 || !n) return

    let dp
    if (downMode === 'pct') {
      const pct = parseFloat(downPct)
      if (isNaN(pct) || pct < 0 || pct >= 100) return
      dp = (pct / 100) * price
    } else {
      dp = parseFloat(downAmt)
      if (isNaN(dp) || dp < 0 || dp >= price) return
    }

    const principal   = price - dp
    const monthlyRate = r / 100 / 12

    const emi = monthlyRate === 0
      ? principal / n
      : principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1)

    const totalPayment  = emi * n
    const totalInterest = totalPayment - principal
    const ltv           = (principal / price) * 100

    let balance = principal
    const schedule = Array.from({ length: n }, (_, i) => {
      const interest = balance * monthlyRate
      const prinPart = emi - interest
      balance = Math.max(0, balance - prinPart)
      return { month: i + 1, principal: prinPart, interest, balance }
    })

    setResult({ emi, totalPayment, totalInterest, ltv, principal, schedule, n })
    setShowAll(false)
  }

  const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'
  const rows = result ? (showAll ? result.schedule : result.schedule.slice(0, 12)) : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Mortgage Calculator</h1>
      <p className="text-gray-400 mb-6">
        Calculate your monthly mortgage payment, LTV ratio, and full amortisation schedule.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Home price ($)</label>
            <input
              type="number"
              value={homePrice}
              onChange={e => handleHomePrice(e.target.value)}
              placeholder="e.g. 350000"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Down payment</label>
            <div className="flex gap-2">
              {downMode === 'pct' ? (
                <input
                  type="number"
                  value={downPct}
                  onChange={e => handleDownPct(e.target.value)}
                  placeholder="e.g. 20"
                  step="0.1"
                  className={inputCls}
                />
              ) : (
                <input
                  type="number"
                  value={downAmt}
                  onChange={e => handleDownAmt(e.target.value)}
                  placeholder="e.g. 70000"
                  className={inputCls}
                />
              )}
              <button
                onClick={() => setDownMode(m => m === 'pct' ? 'amt' : 'pct')}
                className="px-3 py-2.5 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 rounded-lg text-sm text-white transition-colors shrink-0"
              >
                {downMode === 'pct' ? '%' : '$'}
              </button>
            </div>
            {downMode === 'pct' && downAmt && (
              <div className="text-xs text-gray-500 mt-1">${fmt(parseFloat(downAmt))}</div>
            )}
            {downMode === 'amt' && downPct && (
              <div className="text-xs text-gray-500 mt-1">{parseFloat(downPct).toFixed(1)}% of home price</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Annual interest rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={e => setRate(e.target.value)}
              placeholder="e.g. 6.5"
              step="0.1"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Loan term</label>
            <select value={term} onChange={e => setTerm(e.target.value)} className={inputCls}>
              <option value="10">10 years</option>
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Calculate
        </button>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Monthly payment', val: `$${fmt(result.emi)}`,           color: 'text-orange-400' },
              { label: 'Total payment',   val: `$${fmt(result.totalPayment)}`,   color: 'text-white' },
              { label: 'Total interest',  val: `$${fmt(result.totalInterest)}`,  color: 'text-red-400' },
              { label: 'LTV ratio',       val: `${result.ltv.toFixed(1)}%`,      color: result.ltv > 80 ? 'text-yellow-400' : 'text-green-400' },
            ].map(s => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>

          {result.ltv > 80 && (
            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4 mb-6 text-sm text-yellow-300">
              LTV above 80% — lenders typically require Private Mortgage Insurance (PMI) until you reach 20% equity.
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
            <div className="text-sm text-gray-400 mb-3">Principal vs Interest breakdown</div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div className="bg-orange-500" style={{ width: `${(result.principal / result.totalPayment) * 100}%` }} />
              <div className="bg-red-700 flex-1" />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                Principal ${fmt(result.principal)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-700 inline-block" />
                Interest ${fmt(result.totalInterest)}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-700 text-sm font-medium text-white">
              Amortisation Schedule{!showAll && result.n > 12 && (
                <span className="text-gray-500 font-normal ml-1">(first 12 of {result.n} months)</span>
              )}
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
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
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
