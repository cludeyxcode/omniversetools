import { useState, useEffect } from 'react'

const DEFAULT_LAYERS = [
  { id: 0, x: 4, y: 8, blur: 24, spread: 0, color: '#000000', opacity: 40, inset: false },
]

let nextId = 1

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`
}

function layerToCSS(l) {
  const color = hexToRgba(l.color, l.opacity)
  return `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`
}

export default function CssBoxShadowGenerator() {
  const [layers, setLayers] = useState(DEFAULT_LAYERS)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'CSS Box Shadow Generator | OmniverseTools'
  }, [])

  function updateLayer(id, key, val) {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [key]: val } : l))
  }

  function addLayer() {
    setLayers(prev => [...prev, { id: nextId++, x: 4, y: 8, blur: 24, spread: 0, color: '#000000', opacity: 40, inset: false }])
  }

  function removeLayer(id) {
    if (layers.length <= 1) return
    setLayers(prev => prev.filter(l => l.id !== id))
  }

  const shadowValue = layers.map(layerToCSS).join(', ')
  const cssRule = `box-shadow: ${shadowValue};`

  function copy() {
    navigator.clipboard.writeText(cssRule)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sliders = [
    { key: 'x',      label: 'Horizontal Offset', min: -100, max: 100, unit: 'px' },
    { key: 'y',      label: 'Vertical Offset',   min: -100, max: 100, unit: 'px' },
    { key: 'blur',   label: 'Blur Radius',        min: 0,    max: 100, unit: 'px' },
    { key: 'spread', label: 'Spread Radius',      min: -50,  max: 50,  unit: 'px' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">CSS Box Shadow Generator</h1>
      <p className="text-gray-400 mb-6">
        Build a CSS box shadow visually — adjust offset, blur, spread, and colour for multiple layers, then copy the ready-to-use rule.
      </p>

      {/* Live preview */}
      <div className="w-full flex items-center justify-center bg-zinc-800 rounded-xl mb-6 border border-zinc-700 py-12">
        <div
          className="w-40 h-24 rounded-xl bg-white"
          style={{ boxShadow: shadowValue || 'none' }}
        />
      </div>

      {/* Shadow layers */}
      <div className="space-y-4 mb-4">
        {layers.map((l, i) => (
          <div key={l.id} className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-300">Layer {i + 1}</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={l.inset}
                    onChange={e => updateLayer(l.id, 'inset', e.target.checked)}
                    className="accent-orange-500 cursor-pointer"
                  />
                  inset
                </label>
                <button
                  onClick={() => removeLayer(l.id)}
                  disabled={layers.length <= 1}
                  className="text-gray-600 hover:text-red-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm"
                  title="Remove layer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {sliders.map(({ key, label, min, max, unit }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {label}: <span className="text-gray-400">{l[key]}{unit}</span>
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={l[key]}
                    onChange={e => updateLayer(l.id, key, Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-gray-500">Colour</label>
                <input
                  type="color"
                  value={l.color}
                  onChange={e => updateLayer(l.id, 'color', e.target.value)}
                  className="w-10 h-8 rounded-lg border-0 cursor-pointer bg-transparent p-0"
                />
                <span className="text-xs text-gray-500 font-mono">{l.color}</span>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">
                  Opacity: <span className="text-gray-400">{l.opacity}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={l.opacity}
                  onChange={e => updateLayer(l.id, 'opacity', Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addLayer}
        className="w-full mb-6 py-2 rounded-xl text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-gray-300 transition-colors border border-zinc-700"
      >
        + Add Layer
      </button>

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
          Generate CSS box shadows visually without writing code. Add multiple layers for complex depth effects,
          toggle <code className="text-orange-400 text-xs">inset</code> to create inner shadows, and adjust
          colour opacity for soft, realistic shadows. The generated{' '}
          <code className="text-orange-400 text-xs">box-shadow</code> declaration is ready to paste directly
          into any CSS file or style attribute.
        </p>
      </div>
    </div>
  )
}
