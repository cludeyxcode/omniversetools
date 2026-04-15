import { useState, useEffect } from 'react'

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('encode')

  useEffect(() => {
    document.title = 'URL Encoder / Decoder Online | OmniverseTools'
  }, [])

  function process() {
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input.trim()))
      }
    } catch {
      setError('Invalid URL-encoded input.')
      setOutput('')
    }
  }

  function swap() {
    setInput(output)
    setOutput('')
    setMode(m => m === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">URL Encoder / Decoder</h1>
      <p className="text-gray-400 mb-6">
        Encode or decode URL components online — free, instant, browser-based.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Decode
          </button>
        </div>
        <button onClick={process} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          {mode === 'encode' ? 'Encode →' : '← Decode'}
        </button>
        {output && (
          <>
            <button onClick={swap} className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Swap ⇄
            </button>
            <button onClick={() => navigator.clipboard.writeText(output)} className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Copy
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {mode === 'encode' ? 'Plain Text / URL' : 'Encoded Input'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'https://example.com/path?q=hello world' : 'https%3A%2F%2Fexample.com%2F...'}
            rows={14}
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
            rows={14}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-green-300 font-mono resize-none focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          URL encoding (percent-encoding) replaces unsafe ASCII characters with a{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">%</code> followed by two hex digits.
          This tool uses{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">encodeURIComponent</code> and{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">decodeURIComponent</code> to encode/decode
          individual URL components like query string values.
        </p>
      </div>
    </div>
  )
}
