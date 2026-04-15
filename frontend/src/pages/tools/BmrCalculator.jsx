import { useState, useEffect } from 'react'

const ACTIVITY = [
  { label: 'Sedentary',          desc: 'Little or no exercise',             factor: 1.2 },
  { label: 'Lightly active',     desc: 'Light exercise 1–3 days/week',      factor: 1.375 },
  { label: 'Moderately active',  desc: 'Moderate exercise 3–5 days/week',   factor: 1.55 },
  { label: 'Very active',        desc: 'Hard exercise 6–7 days/week',       factor: 1.725 },
  { label: 'Extra active',       desc: 'Very hard exercise or physical job', factor: 1.9 },
]

const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

export default function BmrCalculator() {
  const [unit, setUnit]       = useState('metric')
  const [gender, setGender]   = useState('male')
  const [age, setAge]         = useState('')
  const [height, setHeight]   = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weight, setWeight]   = useState('')
  const [activity, setActivity] = useState(1.55)
  const [result, setResult]   = useState(null)

  useEffect(() => { document.title = 'BMR & Calorie Calculator | OmniverseTools' }, [])

  function calculate() {
    let h_cm, w_kg
    if (unit === 'metric') {
      h_cm = parseFloat(height)
      w_kg = parseFloat(weight)
    } else {
      h_cm = (parseFloat(heightFt) * 12 + parseFloat(heightIn || 0)) * 2.54
      w_kg = parseFloat(weight) * 0.453592
    }
    const a = parseFloat(age)
    if (!h_cm || !w_kg || !a || h_cm <= 0 || w_kg <= 0 || a <= 0) return
    const bmr = 10 * w_kg + 6.25 * h_cm - 5 * a + (gender === 'male' ? 5 : -161)
    setResult({ bmr: Math.round(bmr), tdee: Math.round(bmr * activity) })
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">BMR &amp; Calorie Calculator</h1>
      <p className="text-gray-400 mb-6">
        Calculate your Basal Metabolic Rate and daily calorie needs using the Mifflin-St Jeor formula.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        <div className="flex bg-zinc-800 rounded-lg p-1 w-fit">
          {['metric', 'imperial'].map(u => (
            <button key={u} onClick={() => { setUnit(u); setResult(null) }}
              className={`px-5 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${unit === u ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              {u}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Biological sex</label>
          <div className="flex gap-2">
            {['male', 'female'].map(g => (
              <button key={g} onClick={() => setGender(g)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${gender === g ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-600'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Age (years)</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 30" className={inputCls} />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Height {unit === 'metric' ? '(cm)' : ''}</label>
          {unit === 'metric' ? (
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" className={inputCls} />
          ) : (
            <div className="flex gap-2">
              <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft"
                className="w-24 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
              <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in"
                className="w-24 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Weight {unit === 'metric' ? '(kg)' : '(lbs)'}</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Activity level</label>
          <div className="space-y-2">
            {ACTIVITY.map(a => (
              <label key={a.factor} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${activity === a.factor ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
                <input type="radio" name="activity" checked={activity === a.factor} onChange={() => setActivity(a.factor)} className="accent-orange-500" />
                <div>
                  <div className="text-sm text-white font-medium">{a.label}</div>
                  <div className="text-xs text-gray-500">{a.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Basal Metabolic Rate (BMR)</div>
            <div className="text-4xl font-bold text-white">{result.bmr.toLocaleString()} <span className="text-lg text-gray-400">kcal/day</span></div>
            <div className="text-xs text-gray-500 mt-1">Calories your body burns at complete rest</div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Weight loss  (–500 kcal/day)', val: result.tdee - 500, color: 'text-blue-400', border: 'border-blue-800' },
              { label: 'Maintenance  (TDEE)',           val: result.tdee,       color: 'text-green-400', border: 'border-green-800' },
              { label: 'Weight gain  (+500 kcal/day)', val: result.tdee + 500, color: 'text-orange-400', border: 'border-orange-800' },
            ].map(r => (
              <div key={r.label} className={`bg-zinc-900 border ${r.border} rounded-xl px-5 py-4 flex justify-between items-center`}>
                <span className="text-sm text-gray-300">{r.label}</span>
                <span className={`text-lg font-bold font-mono ${r.color}`}>{Math.round(r.val).toLocaleString()} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-gray-600 leading-relaxed">
        The Mifflin-St Jeor equation is widely regarded as the most accurate BMR formula. Results are estimates — individual metabolism varies. Consult a healthcare professional for personalised advice.
      </div>
    </div>
  )
}
