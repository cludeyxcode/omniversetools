import { useState, useEffect } from 'react'

function fmt(n) {
  if (isNaN(n) || !isFinite(n)) return '—'
  return parseFloat(n.toFixed(6)).toLocaleString()
}

function Calc({ title, desc, fields, compute }) {
  const [vals, setVals] = useState(fields.map(() => ''))
  const result = compute(...vals.map(Number))

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <h2 className="text-white font-semibold mb-1">{title}</h2>
      <p className="text-gray-500 text-xs mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2 items-center">
        {fields.map((f, i) => (
          <input
            key={i}
            type="number"
            value={vals[i]}
            onChange={e => { const v = [...vals]; v[i] = e.target.value; setVals(v) }}
            placeholder={f}
            className="w-28 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
          />
        ))}
        <span className="text-gray-400 text-sm">=</span>
        <div className="bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 min-w-[80px] text-center">
          <span className="text-orange-300 font-bold font-mono">{fmt(result)}</span>
        </div>
      </div>
    </div>
  )
}

export default function PercentageCalculator() {
  useEffect(() => {
    document.title = 'Percentage Calculator Online | OmniverseTools'
  }, [])

  const calcs = [
    {
      title: 'What is X% of Y?',
      desc: 'e.g. What is 20% of 150? → 30',
      fields: ['X (%)', 'of Y'],
      compute: (x, y) => (x / 100) * y,
    },
    {
      title: 'X is what % of Y?',
      desc: 'e.g. 30 is what % of 150? → 20%',
      fields: ['X', 'of Y'],
      compute: (x, y) => (x / y) * 100,
    },
    {
      title: 'Percentage change from X to Y',
      desc: 'e.g. From 80 to 100 → +25%',
      fields: ['From X', 'To Y'],
      compute: (x, y) => ((y - x) / Math.abs(x)) * 100,
    },
    {
      title: 'Add X% to Y',
      desc: 'e.g. Add 20% to 100 → 120',
      fields: ['Y', 'add X (%)'],
      compute: (y, x) => y + (x / 100) * y,
    },
    {
      title: 'Subtract X% from Y',
      desc: 'e.g. Subtract 20% from 100 → 80',
      fields: ['Y', 'subtract X (%)'],
      compute: (y, x) => y - (x / 100) * y,
    },
    {
      title: 'X is Y% — what is the total?',
      desc: 'e.g. 30 is 20% — total is 150',
      fields: ['X', 'is Y (%)'],
      compute: (x, y) => (x / y) * 100,
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Percentage Calculator</h1>
      <p className="text-gray-400 mb-6">
        Six percentage calculators in one — type the numbers you know and get the answer instantly.
      </p>

      <div className="space-y-4">
        {calcs.map(c => <Calc key={c.title} {...c} />)}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Percentages appear everywhere — discounts, tax, tips, growth rates, test scores.
          Each calculator above solves a different common percentage problem. Just fill in
          the values you know and the answer updates instantly.
        </p>
      </div>
    </div>
  )
}
