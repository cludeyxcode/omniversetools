import { useState, useEffect } from 'react'

function encodeEntities(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
}

function decodeEntities(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode')

  useEffect(() => {
    document.title = 'HTML Entity Encoder / Decoder Online | OmniverseTools'
  }, [])

  function process() {
    setOutput(mode === 'encode' ? encodeEntities(input) : decodeEntities(input))
  }

  function swap() {
    setInput(output)
    setOutput('')
    setMode(m => m === 'encode' ? 'decode' : 'encode')
  }

  const COMMON = [
    ['&amp;', '&'], ['&lt;', '<'], ['&gt;', '>'], ['&quot;', '"'],
    ['&#39;', "'"], ['&nbsp;', ' (non-breaking space)'], ['&copy;', '©'],
    ['&reg;', '®'], ['&trade;', '™'], ['&mdash;', '—'], ['&ndash;', '–'],
    ['&hellip;', '…'], ['&laquo;', '«'], ['&raquo;', '»'],
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">HTML Entity Encoder / Decoder</h1>
      <p className="text-gray-400 mb-6">
        Convert special characters like &lt; &gt; &amp; into safe HTML entities — and decode them back.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Decode
          </button>
        </div>
        <button onClick={process} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          {mode === 'encode' ? 'Encode →' : '← Decode'}
        </button>
        {output && (
          <>
            <button onClick={swap} className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Swap ⇄
            </button>
            <button onClick={() => navigator.clipboard.writeText(output)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Copy
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {mode === 'encode' ? 'Plain HTML / Text' : 'Encoded Input'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<div class="test">Hello & "world"</div>' : '&lt;div&gt;Hello &amp; &quot;world&quot;&lt;/div&gt;'}
            rows={12}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {mode === 'encode' ? 'Encoded Output' : 'Decoded Text'}
          </label>
          <textarea
            readOnly
            value={output}
            rows={12}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-green-300 font-mono resize-none focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <h2 className="text-gray-300 font-semibold text-sm mb-3">Common HTML Entities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {COMMON.map(([entity, char]) => (
            <div key={entity} className="bg-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
              <code className="text-orange-300 text-xs font-mono">{entity}</code>
              <span className="text-gray-400 text-xs">{char}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          HTML entities prevent special characters from being interpreted as HTML markup.
          For example, <code className="bg-zinc-800 px-1 rounded text-gray-300">&lt;</code> must
          be written as <code className="bg-zinc-800 px-1 rounded text-gray-300">&amp;lt;</code> inside
          HTML to display correctly. This is essential for preventing XSS attacks when displaying user-generated content.
        </p>
      </div>
    </div>
  )
}
