import { useState, useEffect } from 'react'

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([])
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    document.title = 'UUID Generator Online — Free v4 UUIDs | OmniverseTools'
    generate(5)
  }, [])

  function generate(n = count) {
    const list = Array.from({ length: n }, () => {
      let id = uuidv4()
      if (!hyphens) id = id.replace(/-/g, '')
      if (uppercase) id = id.toUpperCase()
      return id
    })
    setUuids(list)
    setCopied('')
  }

  function copy(val, key) {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join('\n'))
    setCopied('all')
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">UUID Generator</h1>
      <p className="text-gray-400 mb-6">
        Generate random version 4 UUIDs instantly — free, browser-based, cryptographically random.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap gap-5 items-end">
          <div>
            <label className="block text-sm text-gray-400 mb-2">How many</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setCount(c => Math.max(1, c - 1))} className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold transition-colors">−</button>
              <input
                type="number" min={1} max={50} value={count}
                onChange={e => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-16 text-center bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
              <button onClick={() => setCount(c => Math.min(50, c + 1))} className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold transition-colors">+</button>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-orange-500" />
              Uppercase
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
              <input type="checkbox" checked={hyphens} onChange={e => setHyphens(e.target.checked)} className="accent-orange-500" />
              Hyphens
            </label>
          </div>
          <button
            onClick={() => generate()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Generate
          </button>
        </div>
      </div>

      {uuids.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">{uuids.length} UUID{uuids.length > 1 ? 's' : ''}</label>
            <button onClick={copyAll} className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded transition-colors">
              {copied === 'all' ? '✓ Copied all' : 'Copy all'}
            </button>
          </div>
          <div className="space-y-2">
            {uuids.map((id, i) => (
              <div key={i} className="flex items-center justify-between bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 group">
                <code className="text-green-300 font-mono text-sm">{id}</code>
                <button
                  onClick={() => copy(id, i)}
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-all ml-3 shrink-0"
                >
                  {copied === i ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify
          objects in software. Version 4 UUIDs are randomly generated using{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">crypto.getRandomValues</code> —
          the same API used for cryptographic operations. The chance of a collision is astronomically small.
        </p>
      </div>
    </div>
  )
}
