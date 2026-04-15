import { useState, useEffect } from 'react'

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')         // strip comments
    .replace(/\s*([{};:,>~+])\s*/g, '$1')     // remove space around symbols
    .replace(/\s+/g, ' ')                      // collapse whitespace
    .replace(/;\}/g, '}')                      // remove last semicolon in block
    .trim()
}

function beautifyCss(css) {
  // First minify to normalise
  let s = minifyCss(css)
  let result = ''
  let depth = 0
  let i = 0

  while (i < s.length) {
    const ch = s[i]
    if (ch === '{') {
      result += ' {\n' + '  '.repeat(depth + 1)
      depth++
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1)
      result = result.trimEnd()
      result += '\n' + '  '.repeat(depth) + '}\n'
      if (depth === 0 && i < s.length - 1) result += '\n'
    } else if (ch === ';') {
      result += ';\n' + '  '.repeat(depth)
    } else {
      result += ch
    }
    i++
  }
  return result.trim()
}

function byteSize(str) {
  const b = new TextEncoder().encode(str).length
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`
}

export default function CssMinifier() {
  const [input, setInput] = useState(`.container {\n  display: flex;\n  /* center content */\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}\n\n.button {\n  background-color: #6d28d9;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 8px 16px;\n  cursor: pointer;\n}`)
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('minify')

  useEffect(() => {
    document.title = 'CSS Minifier & Beautifier Online | OmniverseTools'
  }, [])

  function process() {
    setOutput(mode === 'minify' ? minifyCss(input) : beautifyCss(input))
  }

  const savings = output && mode === 'minify'
    ? Math.round((1 - new TextEncoder().encode(output).length / new TextEncoder().encode(input).length) * 100)
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">CSS Minifier & Beautifier</h1>
      <p className="text-gray-400 mb-6">
        Compress CSS to shrink file size, or format messy CSS into clean, readable code — free, browser-based.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setMode('minify')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'minify' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Minify
          </button>
          <button
            onClick={() => setMode('beautify')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'beautify' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Beautify
          </button>
        </div>
        <button onClick={process} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          {mode === 'minify' ? 'Minify →' : 'Beautify →'}
        </button>
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Copy
          </button>
        )}
        {savings !== null && savings > 0 && (
          <span className="text-green-400 text-sm font-medium">{savings}% smaller — {byteSize(input)} → {byteSize(output)}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input CSS</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={20}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
            placeholder="Paste your CSS here..."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output</label>
          <textarea
            readOnly
            value={output}
            rows={20}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-green-300 font-mono resize-none focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          <strong className="text-gray-400">Minifying</strong> removes comments, extra spaces, and unnecessary
          characters to reduce file size — smaller CSS means faster page loads.{' '}
          <strong className="text-gray-400">Beautifying</strong> does the opposite: it reformats compressed
          or messy CSS into properly indented, readable code. Everything runs in your browser.
        </p>
      </div>
    </div>
  )
}
