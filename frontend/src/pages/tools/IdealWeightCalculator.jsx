import { useState, useEffect } from 'react'

export default function IdealWeightCalculator() {
  const [unit, setUnit]         = useState('metric')
  const [gender, setGender]     = useState('male')
  const [height, setHeight]     = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [result, setResult]     = useState(null)

  useEffect(() => { document.title = 'Ideal Weight Calculator | OmniverseTools' }, [])

  function calculate() {
    let totalIn
    if (unit === 'metric') {
      const cm = parseFloat(height)
      if (!cm || cm <= 0) return
      totalIn = cm / 2.54
    } else {
      totalIn = parseFloat(heightFt || 0) * 12 + parseFloat(heightIn || 0)
      if (!totalIn || totalIn <= 0) return
    }
    const x = totalIn - 60
    const m = gender === 'male'
    setResult({
      hamwi:    Math.max(0, m ? 48.0 + 2.7  * x : 45.5 + 2.2  * x),
      devine:   Math.max(0, m ? 50.0 + 2.3  * x : 45.5 + 2.3  * x),
      robinson: Math.max(0, m ? 52.0 + 1.9  * x : 49.0 + 1.7  * x),
      miller:   Math.max(0, m ? 56.2 + 1.41 * x : 53.1 + 1.36 * x),
    })
  }

  const fmt = kg => `${kg.toFixed(1)} kg  /  ${(kg * 2.20462).toFixed(1)} lbs`
  const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

  const avg = result ? (result.hamwi + result.devine + result.robinson + result.miller) / 4 : 0

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Ideal Weight Calculator</h1>
      <p className="text-gray-400 mb-6">
        Estimate your ideal body weight using four widely-used medical formulas — Hamwi, Devine, Robinson, and Miller.
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
              <button key={g} onClick={() => { setGender(g); setResult(null) }}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${gender === g ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-600'}`}>
                {g}
              </button>
            ))}
          </div>
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

        <button onClick={calculate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate
        </button>
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-700 text-sm font-medium text-white">Results by formula</div>
          <div className="divide-y divide-zinc-800">
            {[
              { name: 'Hamwi',    key: 'hamwi',    note: 'Classic clinical formula (1964)' },
              { name: 'Devine',   key: 'devine',   note: 'Widely used in medicine (1974)' },
              { name: 'Robinson', key: 'robinson', note: 'Modified Devine (1983)' },
              { name: 'Miller',   key: 'miller',   note: 'Revised formula (1983)' },
            ].map(({ name, key, note }) => (
              <div key={key} className="px-5 py-4 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-xs text-gray-500">{note}</div>
                </div>
                <div className="text-sm text-orange-400 font-mono font-semibold text-right">{fmt(result[key])}</div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-zinc-700 bg-zinc-800/30 flex justify-between items-center">
            <span className="text-sm font-semibold text-white">Average</span>
            <span className="text-sm text-white font-bold font-mono">{fmt(avg)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-gray-600 leading-relaxed">
        These formulas estimate ideal weight from height and sex only — muscle mass, frame size, and body composition are not accounted for. Consult a healthcare professional for personalised advice.
      </div>
    </div>
  )
}
