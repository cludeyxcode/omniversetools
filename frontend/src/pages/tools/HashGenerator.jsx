import { useState, useEffect } from 'react'

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

async function hashText(text, algorithm) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    document.title = 'Hash Generator — SHA-256 / SHA-512 Online | OmniverseTools'
  }, [])

  async function generate() {
    if (!input.trim()) return
    setLoading(true)
    const results = {}
    for (const alg of ALGORITHMS) {
      results[alg] = await hashText(input, alg)
    }
    setHashes(results)
    setLoading(false)
  }

  function copy(alg, value) {
    navigator.clipboard.writeText(value)
    setCopied(alg)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Hash Generator</h1>
      <p className="text-gray-400 mb-6">
        Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text — free, instant, browser-based.
      </p>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.ctrlKey && generate()}
          placeholder="Enter text to hash..."
          rows={5}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
        />
      </div>

      <button
        onClick={generate}
        disabled={loading || !input.trim()}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors mb-8"
      >
        {loading ? 'Hashing…' : 'Generate Hashes'}
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          {ALGORITHMS.map(alg => (
            <div key={alg} className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-400 font-semibold text-sm">{alg}</span>
                <button
                  onClick={() => copy(alg, hashes[alg])}
                  className="text-xs bg-zinc-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                >
                  {copied === alg ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <code className="text-green-300 text-sm font-mono break-all">{hashes[alg]}</code>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Cryptographic hash functions produce a fixed-size fingerprint of any input. SHA-256 and
          SHA-512 are widely used for data integrity checks, password hashing, and digital signatures.
          This tool uses the browser's built-in{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">crypto.subtle</code> API —
          your text never leaves the browser.
        </p>
        <p className="mt-2 text-yellow-600">
          Note: MD5 is not available via the Web Crypto API as it is considered cryptographically broken.
          Use SHA-256 or stronger for any security-sensitive purpose.
        </p>
      </div>
    </div>
  )
}
