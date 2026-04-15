import { useState, useEffect, useMemo } from 'react'

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function safeBase64Decode(str) {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=')
    return JSON.parse(decodeURIComponent(atob(padded).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')))
  } catch {
    return null
  }
}

function formatValue(val) {
  if (typeof val === 'number' && val > 1000000000 && val < 9999999999) {
    const d = new Date(val * 1000)
    return `${val} (${d.toUTCString()})`
  }
  return String(val)
}

export default function JwtDecoder() {
  const [input, setInput] = useState(SAMPLE_JWT)

  useEffect(() => {
    document.title = 'JWT Decoder Online | OmniverseTools'
  }, [])

  const decoded = useMemo(() => {
    const trimmed = input.trim()
    if (!trimmed) return null
    const parts = trimmed.split('.')
    if (parts.length !== 3) return { error: 'A JWT must have exactly 3 parts separated by dots.' }
    const header = safeBase64Decode(parts[0])
    const payload = safeBase64Decode(parts[1])
    if (!header) return { error: 'Could not decode header — invalid Base64URL.' }
    if (!payload) return { error: 'Could not decode payload — invalid Base64URL.' }
    return { header, payload, signature: parts[2] }
  }, [input])

  function isExpired(payload) {
    if (!payload?.exp) return null
    return Date.now() / 1000 > payload.exp
  }

  const expired = decoded?.payload ? isExpired(decoded.payload) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">JWT Decoder</h1>
      <p className="text-gray-400 mb-6">
        Decode and inspect JWT (JSON Web Token) headers and payloads — instant, browser-based, no validation.
      </p>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">JWT Token</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          placeholder="Paste your JWT here..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-yellow-300 font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
        />
      </div>

      {decoded?.error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {decoded.error}
        </div>
      )}

      {decoded && !decoded.error && (
        <div className="space-y-4">
          {expired !== null && (
            <div className={`rounded-lg px-4 py-3 text-sm border ${expired ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-green-900/30 border-green-700 text-green-400'}`}>
              {expired ? '⚠️ Token is expired' : '✅ Token is not expired'}
            </div>
          )}

          <Section title="Header" color="blue" data={decoded.header} />
          <Section title="Payload" color="purple" data={decoded.payload} />

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Signature</div>
            <code className="text-gray-400 text-sm font-mono break-all">{decoded.signature}</code>
            <p className="text-gray-600 text-xs mt-2">
              Signature is not verified — this tool only decodes the token, it does not validate it.
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          A JWT consists of three Base64URL-encoded parts: a header (algorithm and type), a payload
          (claims), and a signature. This tool decodes the header and payload for inspection.
          The signature is displayed but <strong className="text-gray-400">not verified</strong> — never
          trust a JWT's contents without cryptographic verification on your server.
        </p>
      </div>
    </div>
  )
}

function Section({ title, color, data }) {
  const colors = {
    blue: 'text-blue-400',
    purple: 'text-orange-400',
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">{title}</div>
      <div className="space-y-2">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex gap-3 text-sm">
            <span className={`font-semibold min-w-[80px] ${colors[color] || 'text-gray-300'}`}>{key}</span>
            <span className="text-gray-300 font-mono break-all">
              {typeof val === 'object' ? JSON.stringify(val) : formatValue(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
