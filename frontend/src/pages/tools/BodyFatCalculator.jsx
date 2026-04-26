import { useState, useEffect } from 'react'

const CATEGORIES_MALE = [
  { max: 6,        label: 'Essential Fat',  color: 'text-blue-400',   bg: 'bg-blue-900/20 border-blue-700' },
  { max: 14,       label: 'Athletes',       color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700' },
  { max: 18,       label: 'Fitness',        color: 'text-teal-400',   bg: 'bg-teal-900/20 border-teal-700' },
  { max: 25,       label: 'Acceptable',     color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700' },
  { max: Infinity, label: 'Obese',          color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700' },
]

const CATEGORIES_FEMALE = [
  { max: 14,       label: 'Essential Fat',  color: 'text-blue-400',   bg: 'bg-blue-900/20 border-blue-700' },
  { max: 21,       label: 'Athletes',       color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700' },
  { max: 25,       label: 'Fitness',        color: 'text-teal-400',   bg: 'bg-teal-900/20 border-teal-700' },
  { max: 32,       label: 'Acceptable',     color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700' },
  { max: Infinity, label: 'Obese',          color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700' },
]

const RANGES_MALE   = ['2–5%', '6–13%', '14–17%', '18–24%', '≥ 25%']
const RANGES_FEMALE = ['10–13%', '14–20%', '21–24%', '25–31%', '≥ 32%']

function getCategory(bf, gender) {
  const cats = gender === 'male' ? CATEGORIES_MALE : CATEGORIES_FEMALE
  return cats.find(c => bf < c.max)
}

const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

export default function BodyFatCalculator() {
  const [unit, setUnit]       = useState('metric')
  const [gender, setGender]   = useState('male')
  const [height, setHeight]   = useState('')
  const [neck, setNeck]       = useState('')
  const [waist, setWaist]     = useState('')
  const [hip, setHip]         = useState('')
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => { document.title = 'Body Fat Percentage Calculator | OmniverseTools' }, [])

  function toInches(val) { return parseFloat(val) }

  function calculate() {
    setError('')
    setResult(null)

    const h   = parseFloat(height)
    const n   = parseFloat(neck)
    const w   = parseFloat(waist)
    const hp  = parseFloat(hip)

    if (!h || !n || !w || h <= 0 || n <= 0 || w <= 0) {
      setError('Please fill in all required fields with positive values.')
      return
    }
    if (gender === 'female' && (!hp || hp <= 0)) {
      setError('Hip circumference is required for women.')
      return
    }
    if (n >= w) {
      setError('Neck circumference must be less than waist circumference.')
      return
    }

    let bf
    if (unit === 'metric') {
      // Navy method (metric — cm): convert internally to log10
      if (gender === 'male') {
        bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76
      } else {
        if (n >= w + hp) {
          setError('Neck must be less than waist + hip.')
          return
        }
        bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387
      }
    } else {
      // Navy method (imperial — inches)
      if (gender === 'male') {
        bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76
      } else {
        if (n >= w + hp) {
          setError('Neck must be less than waist + hip.')
          return
        }
        bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387
      }
    }

    if (isNaN(bf) || !isFinite(bf) || bf < 0) {
      setError('Could not calculate — please check your measurements.')
      return
    }
    setResult(bf)
  }

  const cat   = result !== null ? getCategory(result, gender) : null
  const cats  = gender === 'male' ? CATEGORIES_MALE : CATEGORIES_FEMALE
  const ranges = gender === 'male' ? RANGES_MALE : RANGES_FEMALE
  const barPct = result !== null ? Math.min(100, (result / 45) * 100) : 0
  const unitLabel = unit === 'metric' ? 'cm' : 'in'

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Body Fat Percentage Calculator</h1>
      <p className="text-gray-400 mb-6">
        Estimate your body fat percentage using the US Navy circumference method — no calipers needed.
        Enter neck, waist{gender === 'female' ? ', and hip' : ''}, and height measurements below.
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

        {/* Gender toggle */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Biological sex</label>
          <div className="flex gap-2">
            {['male', 'female'].map(g => (
              <button key={g} onClick={() => { setGender(g); setResult(null); setError('') }}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${gender === g ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white border border-zinc-600'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Height ({unitLabel})</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
            className={inputCls} />
        </div>

        {/* Neck */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Neck circumference ({unitLabel})</label>
          <p className="text-xs text-gray-600 mb-1">Measure just below the larynx, perpendicular to the neck axis.</p>
          <input type="number" value={neck} onChange={e => setNeck(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 37' : 'e.g. 14.5'}
            className={inputCls} />
        </div>

        {/* Waist */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Waist circumference ({unitLabel})</label>
          <p className="text-xs text-gray-600 mb-1">
            {gender === 'male'
              ? 'Measure at the navel level.'
              : 'Measure at the narrowest point (smallest circumference).'}
          </p>
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 85' : 'e.g. 33.5'}
            className={inputCls} />
        </div>

        {/* Hip — female only */}
        {gender === 'female' && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Hip circumference ({unitLabel})</label>
            <p className="text-xs text-gray-600 mb-1">Measure at the widest point of the hips/buttocks.</p>
            <input type="number" value={hip} onChange={e => setHip(e.target.value)}
              placeholder={unit === 'metric' ? 'e.g. 95' : 'e.g. 37.5'}
              className={inputCls} />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <button onClick={calculate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Calculate Body Fat %
        </button>
      </div>

      {result !== null && cat && (
        <div className={`border rounded-xl p-6 ${cat.bg}`}>
          <div className="text-center mb-5">
            <div className="text-6xl font-bold text-white mb-1">{result.toFixed(1)}%</div>
            <div className={`text-lg font-semibold ${cat.color}`}>{cat.label}</div>
          </div>

          {/* Bar */}
          <div className="relative h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-500 mb-1">
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-zinc-900 shadow"
              style={{ left: `calc(${barPct}% - 8px)` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 mb-5">
            <span>0%</span><span>15%</span><span>25%</span><span>35%</span><span>45%+</span>
          </div>

          {/* Category table */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            {cats.map((c, i) => (
              <div key={c.label} className={`rounded-lg px-3 py-2 border ${c.bg} flex justify-between`}>
                <span className={c.color}>{c.label}</span>
                <span className="text-gray-500 text-xs self-center">{ranges[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
        <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider">How it works</div>
        <p className="text-xs text-gray-500 leading-relaxed">
          The US Navy method uses circumference measurements to estimate body fat.
          {gender === 'male'
            ? ' Formula: 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76'
            : ' Formula: 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387'}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          This is an estimate. For clinical accuracy, use DEXA scanning or hydrostatic weighing. Consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  )
}
