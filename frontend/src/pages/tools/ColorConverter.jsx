import { useState, useEffect } from 'react'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      default: h = ((r - g) / d + 4) / 6
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

function isValidHex(h) { return /^#[0-9a-f]{6}$/i.test(h) }

export default function ColorConverter() {
  const [hex, setHex] = useState('#7c3aed')
  const [rgb, setRgb] = useState({ r: 124, g: 58, b: 237 })
  const [hsl, setHsl] = useState({ h: 262, s: 83, l: 58 })
  const [copied, setCopied] = useState('')

  useEffect(() => {
    document.title = 'HEX to RGB Color Converter | Color Picker Online | OmniverseTools'
  }, [])

  function updateFromHex(h) {
    setHex(h)
    if (!isValidHex(h)) return
    const r2 = hexToRgb(h)
    setRgb(r2)
    setHsl(rgbToHsl(r2.r, r2.g, r2.b))
  }

  function updateFromRgb(key, val) {
    const next = { ...rgb, [key]: Math.min(255, Math.max(0, Number(val))) }
    setRgb(next)
    const h = rgbToHex(next.r, next.g, next.b)
    setHex(h)
    setHsl(rgbToHsl(next.r, next.g, next.b))
  }

  function updateFromHsl(key, val) {
    const limits = { h: 360, s: 100, l: 100 }
    const next = { ...hsl, [key]: Math.min(limits[key], Math.max(0, Number(val))) }
    setHsl(next)
    const r2 = hslToRgb(next.h, next.s, next.l)
    setRgb(r2)
    setHex(rgbToHex(r2.r, r2.g, r2.b))
  }

  function copy(text, label) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const hexStr = hex.toUpperCase()
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Color Picker & HEX to RGB Converter</h1>
      <p className="text-gray-400 mb-8">
        Convert colors between HEX, RGB, and HSL formats instantly — free online color converter.
      </p>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="color"
          value={hex}
          onChange={e => updateFromHex(e.target.value)}
          className="w-24 h-24 rounded-xl border-2 border-gray-600 cursor-pointer bg-transparent"
        />
        <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4" style={{ backgroundColor: hex }}>
          <div className="text-sm font-mono text-white bg-black/40 px-2 py-1 rounded w-fit">{hexStr}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* HEX */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">HEX</span>
            <button onClick={() => copy(hexStr, 'hex')} className="text-xs bg-zinc-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg transition-colors">
              {copied === 'hex' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={hex}
            onChange={e => updateFromHex(e.target.value)}
            className="w-full bg-zinc-800 border border-gray-600 text-white font-mono rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* RGB */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">RGB</span>
            <button onClick={() => copy(rgbStr, 'rgb')} className="text-xs bg-zinc-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg transition-colors">
              {copied === 'rgb' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['r', 'g', 'b'].map(ch => (
              <div key={ch}>
                <label className="text-xs text-gray-500 mb-1 block">{ch.toUpperCase()} (0–255)</label>
                <input type="number" min={0} max={255} value={rgb[ch]} onChange={e => updateFromRgb(ch, e.target.value)}
                  className="w-full bg-zinc-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
              </div>
            ))}
          </div>
        </div>

        {/* HSL */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">HSL</span>
            <button onClick={() => copy(hslStr, 'hsl')} className="text-xs bg-zinc-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg transition-colors">
              {copied === 'hsl' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['h', 'H°', 360], ['s', 'S%', 100], ['l', 'L%', 100]].map(([ch, label, max]) => (
              <div key={ch}>
                <label className="text-xs text-gray-500 mb-1 block">{label} (0–{max})</label>
                <input type="number" min={0} max={max} value={hsl[ch]} onChange={e => updateFromHsl(ch, e.target.value)}
                  className="w-full bg-zinc-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This free online color converter instantly converts between HEX, RGB, and HSL formats.
          Use the color picker or type values directly. HEX is used in CSS and HTML; RGB and HSL
          are standard CSS color functions. All conversions happen in your browser.
        </p>
      </div>
    </div>
  )
}
