import { useState, useEffect } from 'react'

const categories = {
  Length: {
    units: ['Meter', 'Kilometer', 'Mile', 'Yard', 'Foot', 'Inch', 'Centimeter', 'Millimeter', 'Nautical Mile'],
    toBase: { Meter: 1, Kilometer: 1000, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254, Centimeter: 0.01, Millimeter: 0.001, 'Nautical Mile': 1852 },
  },
  Weight: {
    units: ['Kilogram', 'Gram', 'Pound', 'Ounce', 'Ton (metric)', 'Stone'],
    toBase: { Kilogram: 1, Gram: 0.001, Pound: 0.453592, Ounce: 0.0283495, 'Ton (metric)': 1000, Stone: 6.35029 },
  },
  Temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    special: true,
  },
  Speed: {
    units: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
    toBase: { 'm/s': 1, 'km/h': 1 / 3.6, 'mph': 0.44704, 'knot': 0.514444, 'ft/s': 0.3048 },
  },
  Area: {
    units: ['m²', 'km²', 'Hectare', 'Acre', 'ft²', 'in²', 'mi²'],
    toBase: { 'm²': 1, 'km²': 1e6, 'Hectare': 1e4, 'Acre': 4046.856, 'ft²': 0.092903, 'in²': 0.00064516, 'mi²': 2.59e6 },
  },
  Volume: {
    units: ['Liter', 'Milliliter', 'Gallon (US)', 'Quart (US)', 'Pint (US)', 'Cup (US)', 'fl oz (US)', 'm³'],
    toBase: { 'Liter': 1, 'Milliliter': 0.001, 'Gallon (US)': 3.78541, 'Quart (US)': 0.946353, 'Pint (US)': 0.473176, 'Cup (US)': 0.236588, 'fl oz (US)': 0.0295735, 'm³': 1000 },
  },
  'Data Storage': {
    units: ['Byte', 'Kilobyte', 'Megabyte', 'Gigabyte', 'Terabyte'],
    toBase: { Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824, Terabyte: 1099511627776 },
  },
}

function convertTemp(value, from, to) {
  let celsius = from === 'Celsius' ? value : from === 'Fahrenheit' ? (value - 32) * 5 / 9 : value - 273.15
  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length')
  const [from, setFrom] = useState('Meter')
  const [to, setTo] = useState('Foot')
  const [input, setInput] = useState('1')
  const [result, setResult] = useState('')

  useEffect(() => {
    document.title = 'Online Unit Converter | OmniverseTools'
  }, [])

  useEffect(() => {
    const cat = categories[category]
    const units = cat.units
    if (!units.includes(from)) setFrom(units[0])
    if (!units.includes(to)) setTo(units[1] || units[0])
  }, [category])

  useEffect(() => {
    const val = parseFloat(input)
    if (isNaN(val)) { setResult(''); return }
    const cat = categories[category]
    let converted
    if (cat.special) {
      converted = convertTemp(val, from, to)
    } else {
      converted = (val * cat.toBase[from]) / cat.toBase[to]
    }
    setResult(Number(converted.toPrecision(8)).toString())
  }, [input, from, to, category])

  const units = categories[category].units

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Unit Converter</h1>
      <p className="text-gray-400 mb-8">
        Convert between length, weight, temperature, speed, area, volume, and data units online — free.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(categories).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${category === cat ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-zinc-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
              {units.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-zinc-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
              {units.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Value</label>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-zinc-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="bg-zinc-800 rounded-lg px-4 py-4 text-center">
          <div className="text-sm text-gray-400 mb-1">{input || '0'} {from} =</div>
          <div className="text-3xl font-bold text-orange-400">{result || '—'}</div>
          <div className="text-sm text-gray-400 mt-1">{to}</div>
        </div>

        <button
          onClick={() => { const tmp = from; setFrom(to); setTo(tmp) }}
          className="w-full bg-zinc-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
        >
          ⇄ Swap Units
        </button>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This free online unit converter handles 7 categories: Length, Weight, Temperature, Speed, Area, Volume, and Data Storage.
          All conversions happen instantly in your browser with up to 8 significant figures of precision.
        </p>
      </div>
    </div>
  )
}
