import { useState, useEffect } from 'react'

const DEFAULT_STOPS = [
  { id: 0, color: '#f97316', pos: 0 },
  { id: 1, color: '#ef4444', pos: 100 },
]

let nextId = 2

export default function CssGradientGenerator() {
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState(DEFAULT_STOPS)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'CSS Gradient Generator | OmniverseTools'
  }, [])

  function updateStop(id, key, val) {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s))
  }

  function addStop() {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos)
    const midPos = sorted.length >= 2
      ? Math.round((sorted[Math.floor(sorted.length / 2) - 1].pos + sorted[Math.floor(sorted.length / 2)].pos) / 2)
      : 50
    setStops(prev => [...prev, { id: nextId++, color: '#ffffff', pos: midPos }])
  }

  function removeStop(id) {
    if (stops.length <= 2) return
    setStops(prev => prev.filter(s => s.id !== id))
  }

  const sorted = [...stops].sort((a, b) => a.pos - b.pos)
  const stopStr = sorted.map(s => `${s.color} ${s.pos}%`).join(', ')
  const css = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stopStr})`
    : `radial-gradient(circle, ${stopStr})`
  const cssRule = `background: ${css};`

  function copy() {
    navigator.clipboard.writeText(cssRule)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">CSS Gradient Generator</h1>
      <p className="text-gray-400 mb-6">
        Build a linear or radial CSS gradient visually — adjust the angle and colour stops, then copy the ready-to-use CSS.
      </p>

      {/* Live preview */}
      <div
        className="w-full h-36 rounded-xl mb-6 border border-zinc-700"
        style={{ background: css }}
      />

      {/* Type + Angle */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <div className="flex gap-3 mb-4">
          {['linear', 'radial'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                type === t ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {t === 'linear' ? 'Linear' : 'Radial'}
            </button>
          ))}
        </div>

        {type === 'linear' && (
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Direction: {angle}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={e => setAngle(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
            </div>
          </div>
        )}
        {type === 'radial' && (
          <p className="text-xs text-gray-500">Radial gradient radiates outward from the centre.</p>
        )}
      </div>

      {/* Colour stops */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-300">Colour Stops</span>
          <button
            onClick={addStop}
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add Stop
          </button>
        </div>

        <div className="space-y-3">
          {stops.map(s => (
            <div key={s.id} className="flex items-center gap-3">
              <input
                type="color"
                value={s.color}
                onChange={e => updateStop(s.id, 'color', e.target.value)}
                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent p-0 shrink-0"
              />
              <span className="text-xs text-gray-500 font-mono w-16 shrink-0">{s.color}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={s.pos}
                onChange={e => updateStop(s.id, 'pos', Number(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <span className="text-xs text-gray-400 w-8 text-right shrink-0">{s.pos}%</span>
              <button
                onClick={() => removeStop(s.id)}
                disabled={stops.length <= 2}
                className="text-gray-600 hover:text-red-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm shrink-0"
                title="Remove stop"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-300">CSS Output</span>
          <button
            onClick={copy}
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>
        <pre className="bg-zinc-800 rounded-lg px-4 py-3 text-orange-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all">
{cssRule}
        </pre>
      </div>

      <div className="mt-8 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Build CSS gradients visually without writing code. Choose linear or radial, set the angle, and add as many
          colour stops as you need. The generated <code className="text-orange-400 text-xs">background</code> declaration
          is ready to paste directly into any CSS file or style attribute.
        </p>
      </div>
    </div>
  )
}
