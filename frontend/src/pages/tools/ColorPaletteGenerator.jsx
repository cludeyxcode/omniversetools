import { useState, useEffect } from 'react'

// HSL ↔ HEX helpers
function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      default: h = ((r - g) / d + 4) / 6
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function rotate(h, deg) { return (h + deg + 360) % 360 }

const PALETTES = [
  { name: 'Complementary',       fn: (h,s,l) => [[h,s,l],[rotate(h,180),s,l]] },
  { name: 'Triadic',             fn: (h,s,l) => [[h,s,l],[rotate(h,120),s,l],[rotate(h,240),s,l]] },
  { name: 'Analogous',           fn: (h,s,l) => [rotate(h,-60),rotate(h,-30),h,rotate(h,30),rotate(h,60)].map(a=>[a,s,l]) },
  { name: 'Split-Complementary', fn: (h,s,l) => [[h,s,l],[rotate(h,150),s,l],[rotate(h,210),s,l]] },
  { name: 'Tetradic',            fn: (h,s,l) => [[h,s,l],[rotate(h,90),s,l],[rotate(h,180),s,l],[rotate(h,270),s,l]] },
  { name: 'Shades',              fn: (h,s,l) => [90,75,60,45,30,15].map(li=>[h,s,li]) },
]

function Swatch({ hex }) {
  const [copied, setCopied] = useState(false)
  function copy() { navigator.clipboard.writeText(hex); setCopied(true); setTimeout(()=>setCopied(false),1500) }
  return (
    <div className="flex flex-col items-center gap-1 group">
      <button onClick={copy}
        className="w-12 h-12 rounded-xl border border-zinc-700 hover:scale-110 transition-transform relative overflow-hidden"
        style={{ backgroundColor: hex }}
        title={hex}>
        {copied && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-medium">✓</span>
        )}
      </button>
      <span className="text-xs text-gray-400 font-mono">{hex}</span>
    </div>
  )
}

export default function ColorPaletteGenerator() {
  const [color, setColor] = useState('#f97316')

  useEffect(() => { document.title = 'Colour Palette Generator | OmniverseTools' }, [])

  const [h, s, l] = hexToHsl(color)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Colour Palette Generator</h1>
      <p className="text-gray-400 mb-6">
        Pick a base colour and instantly generate harmonious palettes — complementary, triadic, analogous, and more.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-8 flex items-center gap-5">
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          className="w-16 h-16 rounded-xl border-0 cursor-pointer bg-transparent p-0" />
        <div>
          <div className="text-white font-mono text-lg font-semibold">{color.toUpperCase()}</div>
          <div className="text-xs text-gray-500 mt-0.5">HSL({h}°, {s}%, {l}%)</div>
        </div>
        <input type="text" value={color} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value) }}
          className="ml-auto w-32 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500" />
      </div>

      <div className="space-y-8">
        {PALETTES.map(({ name, fn }) => {
          const swatches = fn(h, s, l).map(([ph, ps, pl]) => hslToHex(ph, ps, pl))
          return (
            <div key={name}>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">{name}</h2>
              <div className="flex gap-4 flex-wrap">
                {swatches.map((hex, i) => <Swatch key={i} hex={hex} />)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-xs text-gray-600">Click any swatch to copy its hex value.</div>
    </div>
  )
}
