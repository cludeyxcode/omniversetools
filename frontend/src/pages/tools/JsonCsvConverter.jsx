import { useState, useEffect } from 'react'

// Flatten a nested object: { a: { b: 1 } } → { 'a.b': 1 }
function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key))
    } else {
      out[key] = Array.isArray(v) ? JSON.stringify(v) : String(v ?? '')
    }
  }
  return out
}

function jsonToCsv(jsonStr) {
  const data = JSON.parse(jsonStr)
  const rows = Array.isArray(data) ? data : [data]
  const flat = rows.map(r => (typeof r === 'object' && r !== null ? flatten(r) : { value: String(r) }))
  const headers = [...new Set(flat.flatMap(r => Object.keys(r)))]
  const escape  = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [headers.map(escape).join(','), ...flat.map(r => headers.map(h => escape(r[h] ?? '')).join(','))].join('\n')
}

function csvToJson(csvStr) {
  const lines = csvStr.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return '[]'
  const parse = line => {
    const fields = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
        else inQ = !inQ
      } else if (line[i] === ',' && !inQ) { fields.push(cur); cur = '' }
      else cur += line[i]
    }
    fields.push(cur)
    return fields
  }
  const headers = parse(lines[0]).map(h => h.trim())
  const result  = lines.slice(1).map(line => {
    const vals = parse(line)
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })
  return JSON.stringify(result, null, 2)
}

export default function JsonCsvConverter() {
  const [mode, setMode]     = useState('json-to-csv')
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [error, setError]   = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = 'JSON to CSV Converter | OmniverseTools' }, [])

  function convert() {
    setError('')
    setOutput('')
    if (!input.trim()) return
    try {
      setOutput(mode === 'json-to-csv' ? jsonToCsv(input) : csvToJson(input))
    } catch (e) {
      setError(e.message)
    }
  }

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const textCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-orange-500 resize-none'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">JSON ↔ CSV Converter</h1>
      <p className="text-gray-400 mb-6">Convert between JSON arrays and CSV — nested objects are flattened automatically.</p>

      <div className="flex bg-zinc-800 rounded-lg p-1 w-fit mb-6">
        {[
          { val: 'json-to-csv', label: 'JSON → CSV' },
          { val: 'csv-to-json', label: 'CSV → JSON' },
        ].map(m => (
          <button key={m.val} onClick={() => { setMode(m.val); setInput(''); setOutput(''); setError('') }}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === m.val ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{mode === 'json-to-csv' ? 'JSON input' : 'CSV input'}</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={10}
            placeholder={mode === 'json-to-csv' ? '[{"name":"Alice","age":30},{"name":"Bob","age":25}]' : 'name,age\nAlice,30\nBob,25'}
            className={textCls} />
        </div>

        <button onClick={convert}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Convert
        </button>

        {error && <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">{error}</div>}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-400">{mode === 'json-to-csv' ? 'CSV output' : 'JSON output'}</label>
              <button onClick={copy} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <textarea value={output} readOnly rows={10} className={textCls + ' text-green-300'} />
          </div>
        )}
      </div>
    </div>
  )
}
