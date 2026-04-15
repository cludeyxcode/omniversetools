import { useState, useEffect } from 'react'

function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')           // remove comments
    .replace(/\s*\n\s*/g, ' ')                  // collapse newlines
    .replace(/\s{2,}/g, ' ')                    // collapse multiple spaces
    .replace(/>\s+</g, '><')                    // remove whitespace between tags
    .trim()
}

function beautifyHtml(html) {
  // Normalise first
  let s = html.replace(/>\s+</g, '><').trim()
  let result = ''
  let depth = 0
  const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])

  const tagRe = /(<\/?[a-zA-Z][^>]*>)|([^<]+)/g
  let match
  while ((match = tagRe.exec(s)) !== null) {
    const [, tag, text] = match
    if (tag) {
      const isClose = tag.startsWith('</')
      const isSelfClose = tag.endsWith('/>') || voidTags.has(tag.replace(/<\/?([a-zA-Z]+)[\s>].*/, '$1').toLowerCase())
      const tagName = tag.replace(/<\/?([a-zA-Z]+).*/, '$1').toLowerCase()
      const isInline = ['a','span','strong','em','b','i','small','label','button','code','abbr'].includes(tagName)

      if (isClose && !isInline) {
        depth = Math.max(0, depth - 1)
        result += '\n' + '  '.repeat(depth) + tag
      } else if (isSelfClose || isInline) {
        if (!result.endsWith('\n')) result += ''
        result += tag
      } else {
        result += '\n' + '  '.repeat(depth) + tag
        depth++
      }
    } else if (text && text.trim()) {
      result += text.trim()
    }
  }
  return result.trim()
}

function byteSize(str) {
  const b = new TextEncoder().encode(str).length
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`
}

const SAMPLE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Page title -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
  </head>
  <body>
    <header>
      <h1>Hello, World!</h1>
    </header>
    <main>
      <p>This is a <strong>sample</strong> paragraph.</p>
    </main>
  </body>
</html>`

export default function HtmlMinifier() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('minify')

  useEffect(() => {
    document.title = 'HTML Minifier & Beautifier Online | OmniverseTools'
  }, [])

  function process() {
    setOutput(mode === 'minify' ? minifyHtml(input) : beautifyHtml(input))
  }

  const savings = output && mode === 'minify'
    ? Math.round((1 - new TextEncoder().encode(output).length / new TextEncoder().encode(input).length) * 100)
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">HTML Minifier & Beautifier</h1>
      <p className="text-gray-400 mb-6">
        Strip whitespace from HTML to speed up your page, or prettify minified HTML to read it — free, browser-based.
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
          <label className="block text-sm text-gray-400 mb-1">Input HTML</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={20}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
            placeholder="Paste your HTML here..."
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
          <strong className="text-gray-400">Minifying</strong> removes HTML comments, extra spaces, and line
          breaks — reducing file size so your page loads faster.{' '}
          <strong className="text-gray-400">Beautifying</strong> adds proper indentation and line breaks back,
          making minified or auto-generated HTML easy to read and edit.
        </p>
      </div>
    </div>
  )
}
