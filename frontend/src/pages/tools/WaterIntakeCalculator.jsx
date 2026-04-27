import { useState, useEffect } from 'react'

const ACTIVITY_LEVELS = [
  { key: 'sedentary',    label: 'Sedentary',          desc: 'Little or no exercise, desk job',          extra: 0 },
  { key: 'lightly',      label: 'Lightly Active',      desc: 'Light exercise 1–3 days/week',             extra: 0.35 },
  { key: 'moderately',   label: 'Moderately Active',   desc: 'Moderate exercise 3–5 days/week',          extra: 0.7 },
  { key: 'very',         label: 'Very Active',         desc: 'Hard exercise 6–7 days/week',              extra: 1.0 },
  { key: 'extremely',    label: 'Extremely Active',    desc: 'Athlete / physical job + daily training',  extra: 1.5 },
]

const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

export default function WaterIntakeCalculator() {
  const [unit, setUnit]       = useState('metric')
  const [weight, setWeight]   = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [climate, setClimate] = useState('temperate')
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => { document.title = 'Water Intake Calculator | OmniverseTools' }, [])

  function calculate() {
    setError('')
    setResult(null)

    const w = parseFloat(weight)
    if (!w || w <= 0) {
      setError('Please enter a valid weight.')
      return
    }
    if (w > 500) {
      setError('Please enter a realistic weight.')
      return
    }

    const weightKg = unit === 'metric' ? w : w * 0.453592

    const base = weightKg * 0.033
    const actExtra = ACTIVITY_LEVELS.find(a => a.key === activity)?.extra ?? 0
    const climateExtra = climate === 'hot' ? 0.5 : 0
    const totalLiters = base + actExtra + climateExtra

    const totalOz    = totalLiters * 33.814
    const totalCups  = totalLiters * 4.22675
    const glasses    = Math.ceil(totalLiters / 0.25)

    setResult({ liters: totalLiters, oz: totalOz, cups: totalCups, glasses })
  }

  const weightLabel = unit === 'metric' ? 'kg' : 'lbs'

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Water Intake Calculator</h1>
      <p className="text-gray-400 mb-6">
        Find your recommended daily water intake based on your weight, activity level, and climate.
        Results shown in litres, fluid ounces, cups, and 250 ml glasses.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        {/* Unit toggle */}
        <div className="flex bg-zinc-800 rounded-lg p-1 w-fit">
          {['metric', 'imperial'].map(u => (
            <button key={u} onClick={() => { setUnit(u); setResult(null); setError('') }}
              className={`px-5 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${unit === u ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              {u}
            </button>
          ))}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Body weight ({weightLabel})</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
            className={inputCls}
          />
        </div>

        {/* Activity level */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Activity level</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(a => (
              <button
                key={a.key}
                onClick={() => { setActivity(a.key); setResult(null) }}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                  activity === a.key
                    ? 'bg-orange-600/20 border-orange-600 text-orange-300'
                    : 'bg-zinc-800 border-zinc-600 text-gray-300 hover:border-zinc-500 hover:text-white'
                }`}
              >
                <span className="font-medium">{a.label}</span>
                <span className="text-xs text-gray-500 ml-2">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Climate */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Climate</label>
          <div className="flex gap-2">
            {[
              { key: 'temperate', label: 'Temperate / Cool' },
              { key: 'hot',       label: 'Hot / Humid (+0.5 L)' },
            ].map(c => (
              <button
                key={c.key}
                onClick={() => { setClimate(c.key); setResult(null) }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  climate === c.key
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Calculate Water Intake
        </button>
      </div>

      {result !== null && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6 space-y-5">
          {/* Primary result */}
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-1">{result.liters.toFixed(2)}<span className="text-2xl text-blue-400 ml-1">L</span></div>
            <div className="text-blue-300 text-lg font-semibold">per day</div>
          </div>

          {/* Progress bar — 2 L = healthy baseline, 4 L = max */}
          <div>
            <div className="relative h-3 rounded-full bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                style={{ width: `${Math.min(100, (result.liters / 4) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 L</span><span>2 L</span><span>4 L+</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xl font-bold text-white">{result.glasses}</div>
              <div className="text-xs text-gray-400 mt-0.5">glasses<br/><span className="text-gray-600">@ 250 ml</span></div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xl font-bold text-white">{result.oz.toFixed(0)}</div>
              <div className="text-xs text-gray-400 mt-0.5">fluid oz</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xl font-bold text-white">{result.cups.toFixed(1)}</div>
              <div className="text-xs text-gray-400 mt-0.5">cups<br/><span className="text-gray-600">@ 237 ml</span></div>
            </div>
          </div>

          {/* Breakdown list */}
          <div className="text-sm space-y-1 text-gray-400">
            <div className="flex justify-between">
              <span>Base ({unit === 'metric' ? parseFloat(weight).toFixed(1) : parseFloat(weight).toFixed(1)} {weightLabel} × 33 ml/kg)</span>
              <span className="text-white">{(unit === 'metric' ? parseFloat(weight) * 0.033 : parseFloat(weight) * 0.453592 * 0.033).toFixed(2)} L</span>
            </div>
            {ACTIVITY_LEVELS.find(a => a.key === activity)?.extra > 0 && (
              <div className="flex justify-between">
                <span>Activity adjustment</span>
                <span className="text-white">+{ACTIVITY_LEVELS.find(a => a.key === activity).extra.toFixed(2)} L</span>
              </div>
            )}
            {climate === 'hot' && (
              <div className="flex justify-between">
                <span>Hot / humid climate</span>
                <span className="text-white">+0.50 L</span>
              </div>
            )}
            <div className="flex justify-between border-t border-zinc-700 pt-1 font-medium">
              <span className="text-white">Total daily intake</span>
              <span className="text-blue-300">{result.liters.toFixed(2)} L</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
        <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider">How it works</div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Base intake is calculated as 33 ml per kg of body weight — a widely used rule of thumb endorsed by
          nutrition guidelines. Activity extras (0–1.5 L) account for sweat lost during exercise, and a
          hot/humid climate adds a further 0.5 L to offset additional perspiration.
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          This is a general estimate. Individual needs vary with health conditions, pregnancy, medication, and
          altitude. Consult a healthcare professional for personalised advice.
        </p>
      </div>
    </div>
  )
}
