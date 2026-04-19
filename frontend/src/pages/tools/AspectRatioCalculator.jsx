import { useState, useEffect } from 'react'

function gcd(a, b) {
  a = Math.round(Math.abs(a))
  b = Math.round(Math.abs(b))
  while (b) { [a, b] = [b, a % b] }
  return a || 1
}

function simplifyRatio(w, h) {
  const d = gcd(w, h)
  return [w / d, h / d]
}

function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return parseFloat(n.toFixed(2)).toString()
}

const COMMON_RATIOS = [
  { label: '16:9',  w: 16, h: 9  },
  { label: '4:3',   w: 4,  h: 3  },
  { label: '1:1',   w: 1,  h: 1  },
  { label: '21:9',  w: 21, h: 9  },
  { label: '3:2',   w: 3,  h: 2  },
  { label: '2:3',   w: 2,  h: 3  },
  { label: '9:16',  w: 9,  h: 16 },
  { label: '4:5',   w: 4,  h: 5  },
]

export default function AspectRatioCalculator() {
  const [width, setWidth]   = useState('1920')
  const [height, setHeight] = useState('1080')
  const [newW, setNewW]     = useState('')
  const [newH, setNewH]     = useState('')

  useEffect(() => {
    document.title = 'Aspect Ratio Calculator — Scale Any Dimension | OmniverseTools'
  }, [])

  const w = parseFloat(width)
  const h = parseFloat(height)
  const valid = w > 0 && h > 0 && isFinite(w) && isFinite(h)

  const [rw, rh] = valid ? simplifyRatio(w, h) : [0, 0]
  const ratioStr = valid ? `${rw}:${rh}` : '—'
  const decimalRatio = valid ? fmt(w / h) : '—'

  const scaledH = newW && valid ? fmt((parseFloat(newW) / w) * h) : ''
  const scaledW = newH && valid ? fmt((parseFloat(newH) / h) * w) : ''

  function applyPreset(pw, ph) {
    setWidth(String(pw))
    setHeight(String(ph))
    setNewW('')
    setNewH('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Aspect Ratio Calculator</h1>
      <p className="text-gray-400 mb-8">
        Enter a width and height to find the simplified ratio, then scale to any new dimension
        while keeping the same proportions.
      </p>

      {/* Source dimensions */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <h2 className="text-white font-semibold mb-4">Original dimensions</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">Width</label>
            <input
              type="number"
              value={width}
              min="1"
              onChange={e => setWidth(e.target.value)}
              className="w-32 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
              placeholder="e.g. 1920"
            />
          </div>
          <span className="text-gray-500 mt-5">×</span>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">Height</label>
            <input
              type="number"
              value={height}
              min="1"
              onChange={e => setHeight(e.target.value)}
              className="w-32 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
              placeholder="e.g. 1080"
            />
          </div>
          <div className="flex flex-col gap-1 mt-5 pl-2">
            <span className="text-gray-500 text-sm">=</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">Ratio</label>
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 min-w-[96px] text-center">
              <span className="text-orange-300 font-bold font-mono text-lg">{ratioStr}</span>
            </div>
          </div>
          {valid && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Decimal</label>
              <div className="bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 min-w-[80px] text-center">
                <span className="text-gray-300 font-mono text-sm">{decimalRatio}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Common ratio presets */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <h2 className="text-white font-semibold mb-3">Common ratios</h2>
        <div className="flex flex-wrap gap-2">
          {COMMON_RATIOS.map(({ label, w: pw, h: ph }) => {
            const active = valid && rw === pw && rh === ph
            return (
              <button
                key={label}
                onClick={() => applyPreset(pw, ph)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scale dimensions */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-8">
        <h2 className="text-white font-semibold mb-1">Scale to a new size</h2>
        <p className="text-gray-500 text-xs mb-4">Enter either the new width or new height — the other value is calculated automatically.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scale by width */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-2">New width → height</label>
            <input
              type="number"
              value={newW}
              min="1"
              onChange={e => setNewW(e.target.value)}
              placeholder="Enter new width"
              className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 mb-3"
            />
            {newW && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Height</span>
                <span className="text-orange-300 font-bold font-mono">
                  {valid ? scaledH : '—'}
                </span>
              </div>
            )}
          </div>

          {/* Scale by height */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-2">New height → width</label>
            <input
              type="number"
              value={newH}
              min="1"
              onChange={e => setNewH(e.target.value)}
              placeholder="Enter new height"
              className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 mb-3"
            />
            {newH && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Width</span>
                <span className="text-orange-300 font-bold font-mono">
                  {valid ? scaledW : '—'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual ratio preview */}
      {valid && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-8">
          <h2 className="text-white font-semibold mb-4">Ratio preview</h2>
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className="bg-orange-500/20 border-2 border-orange-500/40 rounded-lg"
                style={{
                  width:  `${Math.min(160, 160 * (w / h))}px`,
                  height: `${Math.min(160, 160 * (h / w))}px`,
                }}
              />
              <span className="text-xs text-gray-500">{rw}:{rh}</span>
            </div>
            <div className="text-gray-600 text-sm space-y-1">
              <div className="text-gray-400"><span className="text-white font-mono">{w} × {h}</span> px</div>
              <div>Ratio: <span className="text-orange-300 font-mono">{ratioStr}</span></div>
              <div>Decimal: <span className="text-gray-300 font-mono">{decimalRatio}:1</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          The aspect ratio is the proportional relationship between width and height. It is
          expressed as W:H in simplified form — for example, 1920×1080 simplifies to 16:9.
          Use the scaling section to find what height a 16:9 image needs at 1200 px wide, or
          what width you need for a specific height. Everything is calculated instantly in your
          browser with no data sent to a server.
        </p>
      </div>
    </div>
  )
}
