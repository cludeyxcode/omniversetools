import { useState, useEffect } from 'react'
import yaml from 'js-yaml'

export default function YamlJsonConverter() {
  const [mode, setMode]     = useState('yaml-to-json')
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [error, setError]   = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  useEffect(() => { document.title = 'YAML ↔ JSON Converter Online | OmniverseTools' }, [])

  function convert() {
    setError('')
    setOutput('')
    if (!input.trim()) return
    try {
      if (mode === 'yaml-to-json') {
        const parsed = yaml.load(input)
        setOutput(JSON.stringify(parsed, null, indent))
      } else {
        const parsed = JSON.parse(input)
        setOutput(yaml.dump(parsed, { indent }))
      }
    } catch (e) {
      setError(e.message)
    }
  }

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function swapMode() {
    const next = mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json'
    setMode(next)
    setInput(output)
    setOutput('')
    setError('')
  }

  const textCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-orange-500 resize-none'

  const yamlPlaceholder = `name: Alice
age: 30
hobbies:
  - reading
  - coding
address:
  city: London
  country: UK`

  const jsonPlaceholder = `{
  "name": "Alice",
  "age": 30,
  "hobbies": ["reading", "coding"],
  "address": {
    "city": "London",
    "country": "UK"
  }
}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">YAML ↔ JSON Converter</h1>
      <p className="text-gray-400 mb-6">
        Convert between YAML and JSON instantly — paste your data, choose a direction, and copy the result.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          {[
            { val: 'yaml-to-json', label: 'YAML → JSON' },
            { val: 'json-to-yaml', label: 'JSON → YAML' },
          ].map(m => (
            <button
              key={m.val}
              onClick={() => { setMode(m.val); setInput(''); setOutput(''); setError('') }}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === m.val ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-400">Indent:</label>
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 text-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {mode === 'yaml-to-json' ? 'YAML input' : 'JSON input'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={12}
            placeholder={mode === 'yaml-to-json' ? yamlPlaceholder : jsonPlaceholder}
            className={textCls}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={convert}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Convert
          </button>
          {output && (
            <button
              onClick={swapMode}
              title="Swap — use output as new input"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              ⇄ Swap
            </button>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
            ❌ {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-400">
                {mode === 'yaml-to-json' ? 'JSON output' : 'YAML output'}
              </label>
              <button onClick={copy} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <textarea value={output} readOnly rows={12} className={textCls + ' text-green-300'} />
          </div>
        )}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This converter uses the <code className="bg-zinc-800 px-1 rounded text-gray-300">js-yaml</code> library
          to parse and serialise YAML and JSON entirely in your browser — nothing is uploaded to any server.
          YAML is a superset of JSON, so any valid JSON is also valid YAML. Use the Swap button to convert the
          output back in the opposite direction.
        </p>
      </div>
    </div>
  )
}
