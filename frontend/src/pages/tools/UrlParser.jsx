import { useState, useEffect } from 'react'

const DEFAULT_URL = 'https://example.com/path/to/page?foo=bar&lang=en#section'

let nextId = 0

function parseUrl(raw) {
  try {
    const u = new URL(raw.trim())
    const params = []
    u.searchParams.forEach((value, key) => {
      params.push({ id: nextId++, key, value })
    })
    return {
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port,
      pathname: u.pathname,
      params,
      hash: u.hash.slice(1),
      error: null,
    }
  } catch {
    return { protocol: '', hostname: '', port: '', pathname: '', params: [], hash: '', error: true }
  }
}

function buildUrl(fields) {
  try {
    const pathname = fields.pathname.startsWith('/') ? fields.pathname : '/' + fields.pathname
    const portPart = fields.port ? `:${fields.port}` : ''
    const base = `${fields.protocol}//${fields.hostname}${portPart}${pathname}`
    const u = new URL(base)
    fields.params.forEach(p => {
      if (p.key.trim()) u.searchParams.append(p.key, p.value)
    })
    if (fields.hash) u.hash = '#' + fields.hash
    return u.toString()
  } catch {
    return ''
  }
}

export default function UrlParser() {
  const [rawInput, setRawInput] = useState(DEFAULT_URL)
  const [fields, setFields] = useState(() => parseUrl(DEFAULT_URL))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'URL Parser / Builder | OmniverseTools'
  }, [])

  function handleInputChange(val) {
    setRawInput(val)
    setFields(parseUrl(val))
  }

  function updateField(key, val) {
    const next = { ...fields, [key]: val, error: null }
    setFields(next)
    const rebuilt = buildUrl(next)
    if (rebuilt) setRawInput(rebuilt)
  }

  function updateParam(id, field, val) {
    const params = fields.params.map(p => p.id === id ? { ...p, [field]: val } : p)
    const next = { ...fields, params, error: null }
    setFields(next)
    const rebuilt = buildUrl(next)
    if (rebuilt) setRawInput(rebuilt)
  }

  function addParam() {
    const params = [...fields.params, { id: nextId++, key: '', value: '' }]
    const next = { ...fields, params }
    setFields(next)
    const rebuilt = buildUrl(next)
    if (rebuilt) setRawInput(rebuilt)
  }

  function removeParam(id) {
    const params = fields.params.filter(p => p.id !== id)
    const next = { ...fields, params }
    setFields(next)
    const rebuilt = buildUrl(next)
    if (rebuilt) setRawInput(rebuilt)
  }

  function copy() {
    navigator.clipboard.writeText(rawInput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const URL_PARTS = [
    { label: 'Protocol', key: 'protocol', placeholder: 'https:', hint: 'https: / http: / ftp:' },
    { label: 'Hostname', key: 'hostname', placeholder: 'example.com', hint: 'domain or IP' },
    { label: 'Port', key: 'port', placeholder: '(default)', hint: '80 / 443 / 3000 / blank' },
    { label: 'Path', key: 'pathname', placeholder: '/', hint: '/path/to/resource' },
    { label: 'Fragment (#)', key: 'hash', placeholder: '', hint: 'section-id (no #)' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">URL Parser / Builder</h1>
      <p className="text-gray-400 mb-8">
        Paste any URL to break it into its components, then edit each field to rebuild the URL instantly.
      </p>

      {/* URL input */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
        <label className="text-xs text-gray-500 uppercase tracking-wide block mb-2">URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={rawInput}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="https://example.com/path?key=value#hash"
            spellCheck={false}
            className="flex-1 min-w-0 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={copy}
            className="text-sm bg-zinc-700 hover:bg-zinc-600 text-gray-300 px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {fields.error && (
          <p className="text-red-400 text-xs mt-2">
            Cannot parse — URL must start with a scheme such as <code className="text-red-300">https://</code>
          </p>
        )}
      </div>

      {!fields.error && (
        <>
          {/* URL components */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
            <h2 className="text-white font-semibold mb-4">Components</h2>
            <div className="space-y-3">
              {URL_PARTS.map(({ label, key, placeholder, hint }) => (
                <div key={key} className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <div>
                    <div className="text-xs text-gray-400 font-medium">{label}</div>
                    <div className="text-xs text-gray-600 truncate">{hint}</div>
                  </div>
                  <input
                    type="text"
                    value={fields[key] ?? ''}
                    onChange={e => updateField(key, e.target.value)}
                    placeholder={placeholder}
                    spellCheck={false}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Query parameters */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">
                Query Parameters
                {fields.params.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500 font-normal bg-zinc-800 px-1.5 py-0.5 rounded">
                    {fields.params.length}
                  </span>
                )}
              </h2>
              <button
                onClick={addParam}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Add
              </button>
            </div>

            {fields.params.length === 0 ? (
              <p className="text-gray-600 text-sm italic">No query parameters in this URL.</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_32px] gap-2 px-1 mb-1">
                  <span className="text-xs text-gray-600 uppercase tracking-wide">Key</span>
                  <span className="text-xs text-gray-600 uppercase tracking-wide">Value</span>
                </div>
                {fields.params.map(p => (
                  <div key={p.id} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
                    <input
                      type="text"
                      value={p.key}
                      onChange={e => updateParam(p.id, 'key', e.target.value)}
                      placeholder="key"
                      spellCheck={false}
                      className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      value={p.value}
                      onChange={e => updateParam(p.id, 'value', e.target.value)}
                      placeholder="value"
                      spellCheck={false}
                      className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={() => removeParam(p.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors text-sm text-center"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-6 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Break any URL into its protocol, hostname, port, path, query parameters, and fragment.
          Edit any component or query parameter and the full URL rebuilds instantly. Useful for
          debugging API requests, constructing deep links, or understanding what a URL does.
          Uses the browser-native <code className="text-orange-400 text-xs">URL</code> API —
          nothing is sent to any server.
        </p>
      </div>
    </div>
  )
}
