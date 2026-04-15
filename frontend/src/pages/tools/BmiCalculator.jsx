import { useState, useEffect } from 'react'

const CATEGORIES = [
  { max: 18.5, label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700' },
  { max: 25,   label: 'Healthy weight', color: 'text-green-400', bg: 'bg-green-900/20 border-green-700' },
  { max: 30,   label: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700' },
  { max: Infinity, label: 'Obese', color: 'text-red-400', bg: 'bg-red-900/20 border-red-700' },
]

function getCategory(bmi) {
  return CATEGORIES.find(c => bmi < c.max)
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState('metric')
  const [height, setHeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState(null)

  useEffect(() => {
    document.title = 'BMI Calculator Online | OmniverseTools'
  }, [])

  function calculate() {
    let h, w
    if (unit === 'metric') {
      h = parseFloat(height) / 100
      w = parseFloat(weight)
    } else {
      const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn || 0)
      h = totalIn * 0.0254
      w = parseFloat(weight) * 0.453592
    }
    if (!h || !w || h <= 0 || w <= 0) return
    setBmi(w / (h * h))
  }

  const cat = bmi ? getCategory(bmi) : null
  const barPct = bmi ? Math.min(100, ((bmi - 10) / 30) * 100) : 0

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">BMI Calculator</h1>
      <p className="text-gray-400 mb-6">
        Calculate your Body Mass Index — enter your height and weight to find out your BMI and what it means.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="flex bg-zinc-800 rounded-lg p-1 mb-5 w-fit">
          {['metric', 'imperial'].map(u => (
            <button key={u} onClick={() => { setUnit(u); setBmi(null) }}
              className={`px-5 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${unit === u ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              {u}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Height {unit === 'metric' ? '(cm)' : ''}
            </label>
            {unit === 'metric' ? (
              <input type="number" value={height} onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 175"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
            ) : (
              <div className="flex gap-2">
                <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                  placeholder="ft" className="w-24 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
                <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                  placeholder="in" className="w-24 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
            </label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
          </div>
        </div>

        <button onClick={calculate}
          className="mt-5 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate BMI
        </button>
      </div>

      {bmi && cat && (
        <div className={`border rounded-xl p-6 ${cat.bg}`}>
          <div className="text-center mb-5">
            <div className="text-6xl font-bold text-white mb-1">{bmi.toFixed(1)}</div>
            <div className={`text-lg font-semibold ${cat.color}`}>{cat.label}</div>
          </div>

          {/* Bar */}
          <div className="relative h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-500 mb-1">
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-zinc-900 shadow"
              style={{ left: `calc(${barPct}% - 8px)` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 mb-5">
            <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {CATEGORIES.map(c => (
              <div key={c.label} className={`rounded-lg px-3 py-2 border ${c.bg} flex justify-between`}>
                <span className={c.color}>{c.label}</span>
                <span className="text-gray-500 text-xs self-center">
                  {c.max === 18.5 ? '< 18.5' : c.max === 25 ? '18.5–24.9' : c.max === 30 ? '25–29.9' : '≥ 30'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-gray-600 leading-relaxed">
        BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, or fat distribution. Consult a healthcare professional for medical advice.
      </div>
    </div>
  )
}
