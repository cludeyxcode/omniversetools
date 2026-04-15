import { useState, useEffect } from 'react'

function pad(n) { return String(n).padStart(2, '0') }
function toLocal(d) { return d.toISOString().split('T')[0] }

export default function DateDurationCalculator() {
  const today = toLocal(new Date())
  const [from, setFrom] = useState(today)
  const [to, setTo]     = useState(today)
  const [result, setResult] = useState(null)

  useEffect(() => { document.title = 'Date Duration Calculator | OmniverseTools' }, [])

  function calculate() {
    const a = new Date(from + 'T00:00:00')
    const b = new Date(to   + 'T00:00:00')
    if (isNaN(a) || isNaN(b)) return

    const [start, end, sign] = a <= b ? [a, b, 1] : [b, a, -1]
    const msPerDay = 86400000
    const totalDays = Math.round((end - start) / msPerDay)

    // Calendar months/years
    let years  = end.getFullYear()  - start.getFullYear()
    let months = end.getMonth()     - start.getMonth()
    let days   = end.getDate()      - start.getDate()

    if (days < 0) {
      months--
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate()
    }
    if (months < 0) { years--; months += 12 }

    // Business days (Mon–Fri)
    let biz = 0
    const cur = new Date(start)
    while (cur < end) {
      const d = cur.getDay()
      if (d !== 0 && d !== 6) biz++
      cur.setDate(cur.getDate() + 1)
    }

    setResult({ totalDays: totalDays * sign, weeks: (totalDays / 7) * sign, totalMonths: (years * 12 + months) * sign, years: years * sign, remMonths: months, days: days * sign, biz: biz * sign })
  }

  const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'
  const fmt = n => n < 0 ? `−${Math.abs(n).toLocaleString()}` : n.toLocaleString()

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Date Duration Calculator</h1>
      <p className="text-gray-400 mb-6">Find the exact number of days, weeks, months, and years between two dates.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className={inputCls} />
          </div>
        </div>
        <button onClick={calculate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate
        </button>
      </div>

      {result !== null && (
        <>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total days</div>
            <div className="text-6xl font-bold text-orange-400 font-mono">{fmt(result.totalDays)}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Weeks',          val: parseFloat(result.weeks.toFixed(1)) },
              { label: 'Business days',  val: fmt(result.biz) },
              { label: 'Calendar months (approx)', val: fmt(Math.abs(result.totalMonths)) },
              { label: 'Years + months + days',    val: `${Math.abs(result.years)}y  ${result.remMonths}m  ${Math.abs(result.days)}d` },
            ].map(s => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-4">
                <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                <div className="text-xl font-bold text-white font-mono">{s.val}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
