import { useState, useEffect } from 'react'

const byteLen = typeof TextEncoder !== 'undefined'
  ? (s) => new TextEncoder().encode(s).length
  : (s) => s.length

// PHP unserialize → JS value
function phpParse(str) {
  str = str.trim()
  let pos = 0

  function next() {
    if (pos >= str.length) throw new Error('Unexpected end of input')
    const type = str[pos]
    pos++

    if (type === 'N') {
      if (str[pos] !== ';') throw new Error(`Expected ';' at pos ${pos}`)
      pos++
      return null
    }

    if (str[pos] !== ':') throw new Error(`Expected ':' at pos ${pos}, got '${str[pos]}'`)
    pos++

    switch (type) {
      case 'b': {
        const v = str[pos] === '1'
        pos += 2 // digit + ';'
        return v
      }
      case 'i': {
        const semi = str.indexOf(';', pos)
        if (semi === -1) throw new Error('Unterminated integer')
        const v = parseInt(str.slice(pos, semi), 10)
        pos = semi + 1
        return v
      }
      case 'd': {
        const semi = str.indexOf(';', pos)
        if (semi === -1) throw new Error('Unterminated float')
        const v = parseFloat(str.slice(pos, semi))
        pos = semi + 1
        return v
      }
      case 's': {
        const colon = str.indexOf(':', pos)
        if (colon === -1) throw new Error('Malformed string token')
        const len = parseInt(str.slice(pos, colon), 10)
        if (isNaN(len)) throw new Error('Invalid string length')
        pos = colon + 2 // ':' + opening '"'
        const v = str.slice(pos, pos + len)
        pos += len + 2 // content + '"' + ';'
        return v
      }
      case 'a': {
        const colon = str.indexOf(':', pos)
        if (colon === -1) throw new Error('Malformed array token')
        const count = parseInt(str.slice(pos, colon), 10)
        if (isNaN(count)) throw new Error('Invalid array count')
        pos = colon + 2 // ':' + '{'
        const keys = []
        const vals = []
        let isSeq = true
        for (let i = 0; i < count; i++) {
          const k = next()
          const v = next()
          keys.push(k)
          vals.push(v)
          if (k !== i) isSeq = false
        }
        pos++ // '}'
        if (isSeq && keys.every(k => typeof k === 'number')) return vals
        const obj = {}
        keys.forEach((k, i) => { obj[k] = vals[i] })
        return obj
      }
      case 'O': {
        const c1 = str.indexOf(':', pos)
        if (c1 === -1) throw new Error('Malformed object token')
        const nLen = parseInt(str.slice(pos, c1), 10)
        pos = c1 + 2 // ':' + '"'
        const cls = str.slice(pos, pos + nLen)
        pos += nLen + 2 // class name + '"' + ':'
        const c2 = str.indexOf(':', pos)
        if (c2 === -1) throw new Error('Malformed object prop count')
        const pCount = parseInt(str.slice(pos, c2), 10)
        pos = c2 + 2 // ':' + '{'
        const obj = { __class: cls }
        for (let i = 0; i < pCount; i++) {
          const k = next()
          const v = next()
          obj[k] = v
        }
        pos++ // '}'
        return obj
      }
      default:
        throw new Error(`Unknown type '${type}' at pos ${pos - 2}`)
    }
  }

  const result = next()
  return JSON.stringify(result, null, 2)
}

// JS value → PHP serialize string
function phpStringify(value) {
  if (value === null || value === undefined) return 'N;'
  if (typeof value === 'boolean') return `b:${value ? 1 : 0};`
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return `i:${value};`
    return `d:${value};`
  }
  if (typeof value === 'string') {
    return `s:${byteLen(value)}:"${value}";`
  }
  if (Array.isArray(value)) {
    const inner = value.map((v, i) => phpStringify(i) + phpStringify(v)).join('')
    return `a:${value.length}:{${inner}}`
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    const inner = keys.map(k => phpStringify(k) + phpStringify(value[k])).join('')
    return `a:${keys.length}:{${inner}}`
  }
  throw new Error(`Cannot serialize type: ${typeof value}`)
}

function serializeJson(jsonStr) {
  return phpStringify(JSON.parse(jsonStr))
}

const EXAMPLES = {
  'Simple array':   'a:3:{i:0;s:3:"foo";i:1;s:3:"bar";i:2;i:42;}',
  'Assoc array':    'a:2:{s:4:"name";s:5:"Alice";s:3:"age";i:30;}',
  'Nested object':  'a:1:{s:4:"user";O:8:"stdClass":2:{s:4:"name";s:3:"Bob";s:5:"email";s:15:"bob@example.com";}}',
  'WP cron option': 'a:1:{s:16:"wp_version_check";a:1:{s:32:"40cd750bba9870f18aada2478b24840a";a:3:{s:8:"schedule";s:5:"daily";s:4:"args";a:0:{}s:8:"interval";i:86400;}}}',
}

const FORMAT_ROWS = [
  ['N;',                        'null'],
  ['b:0; / b:1;',               'boolean false / true'],
  ['i:42;',                     'integer 42'],
  ['d:3.14;',                   'float 3.14'],
  ['s:3:"foo";',                'string "foo" (byte-length prefixed)'],
  ['a:2:{…}',                   'array with 2 key/value pairs'],
  ['O:8:"stdClass":1:{…}',      'object of class stdClass'],
]

export default function PhpSerialize() {
  const [mode, setMode]     = useState('decode')
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [error, setError]   = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = 'PHP Serialize / Unserialize | OmniverseTools' }, [])

  function run(val, m) {
    if (!val.trim()) { setOutput(''); setError(''); return }
    try {
      setOutput(m === 'decode' ? phpParse(val) : serializeJson(val))
      setError('')
    } catch (e) {
      setOutput('')
      setError(e.message)
    }
  }

  function handleInput(val) {
    setInput(val)
    run(val, mode)
  }

  function switchMode(m) {
    const next = output
    setMode(m)
    setInput(next)
    setOutput('')
    setError('')
    run(next, m)
  }

  function loadExample(val) {
    setMode('decode')
    setInput(val)
    run(val, 'decode')
  }

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">PHP Serialize / Unserialize</h1>
      <p className="text-gray-400 mb-8">
        Decode PHP serialized strings — like WordPress{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">wp_options</code>,
        ACF fields, and serialized post meta — to readable JSON. Or serialize JSON back to PHP format.
        Pure JavaScript; nothing leaves your browser.
      </p>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[['decode', 'PHP → JSON (Unserialize)'], ['encode', 'JSON → PHP (Serialize)']].map(([m, label]) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-orange-600 text-white'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Example snippets */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-gray-500">Load example:</span>
        {Object.entries(EXAMPLES).map(([label, val]) => (
          <button
            key={label}
            onClick={() => loadExample(val)}
            className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* I/O panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">
              {mode === 'decode' ? 'PHP serialized string' : 'JSON input'}
            </label>
            <button
              onClick={() => { setInput(''); setOutput(''); setError('') }}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            rows={20}
            spellCheck={false}
            placeholder={
              mode === 'decode'
                ? 'Paste PHP serialized data…\ne.g. a:2:{s:3:"foo";s:3:"bar";}'
                : 'Paste JSON…\ne.g. {"name": "Alice", "age": 30}'
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 text-sm font-mono focus:outline-none focus:border-orange-500 resize-none placeholder-zinc-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm ${error ? 'text-red-400' : 'text-gray-400'}`}>
              {error ? 'Parse error' : mode === 'decode' ? 'JSON output' : 'PHP serialized output'}
            </label>
            <button
              onClick={copy}
              disabled={!output}
              className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={error ? `⚠ ${error}` : output}
            readOnly
            rows={20}
            spellCheck={false}
            placeholder="Output appears here…"
            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none resize-none placeholder-zinc-600 ${
              error ? 'border-red-500/40 text-red-400' : 'border-zinc-700 text-green-300'
            }`}
          />
        </div>
      </div>

      {/* Reference */}
      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-3">About PHP Serialization</h2>
        <p className="mb-4">
          PHP's <code className="bg-zinc-800 px-1 rounded text-gray-300">serialize()</code> converts any PHP value to a
          compact string. WordPress stores dozens of options and meta fields this way — including{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">sidebars_widgets</code>,{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">cron</code>,
          Advanced Custom Fields data, and WooCommerce session data.
        </p>
        <h3 className="text-gray-400 font-semibold mb-2">Format reference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {FORMAT_ROWS.map(([fmt, desc]) => (
            <div key={fmt} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
              <code className="text-orange-300 text-xs">{fmt}</code>
              <span className="text-gray-500 text-xs ml-2">— {desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-600/80 text-xs leading-relaxed">
          <strong className="text-yellow-500">Important:</strong> Never do a plain find-and-replace on raw serialized
          data — the byte-length prefix in{' '}
          <code className="bg-zinc-800 px-1 rounded text-yellow-400">s:N:</code> tokens will become wrong and corrupt
          deserialization. Always decode → edit the JSON → re-serialize with this tool instead.
        </div>
      </div>
    </div>
  )
}
