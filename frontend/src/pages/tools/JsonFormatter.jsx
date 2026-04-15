import { useState, useEffect } from 'react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

  useEffect(() => {
    document.title = 'JSON Formatter & Validator Online | OmniverseTools'
  }, [])

  function format() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">JSON Formatter & Validator</h1>
      <p className="text-gray-400 mb-6">
        Format, validate, and minify JSON online — instant, free, runs in your browser.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={format} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Format / Validate
        </button>
        <button onClick={minify} className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Minify
        </button>
        <select
          value={indent}
          onChange={e => setIndent(Number(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 text-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={'\t'.codePointAt(0)}>Tab</option>
        </select>
        {output && (
          <button onClick={copyOutput} className="ml-auto bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Copy Output
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}
      {output && !error && (
        <div className="bg-green-900/20 border border-green-800 text-green-400 rounded-lg px-4 py-2 text-sm mb-4">
          ✅ Valid JSON
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input JSON</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Paste your JSON here...'
            rows={20}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
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
          This free JSON formatter and validator uses the browser's built-in <code className="bg-zinc-800 px-1 rounded text-gray-300">JSON.parse()</code> to
          validate and reformat JSON data. Paste any JSON, choose your indentation level, and click Format.
          Use Minify to compact JSON for APIs or storage. All processing happens in your browser — nothing is uploaded.
        </p>
      </div>
    </div>
  )
}
