import { useState, useEffect } from 'react'

const ALG_MAP = {
  HS256: { name: 'HMAC', hash: 'SHA-256' },
  HS384: { name: 'HMAC', hash: 'SHA-384' },
  HS512: { name: 'HMAC', hash: 'SHA-512' },
}

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function strToBase64Url(str) {
  return base64UrlEncode(new TextEncoder().encode(str))
}

async function generateJwt(algorithm, secret, payload) {
  const header = { alg: algorithm, typ: 'JWT' }
  const encodedHeader = strToBase64Url(JSON.stringify(header))
  const encodedPayload = strToBase64Url(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`

  const algConfig = ALG_MAP[algorithm]
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    algConfig,
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(algConfig, cryptoKey, new TextEncoder().encode(signingInput))
  return `${signingInput}.${base64UrlEncode(new Uint8Array(sig))}`
}

function makeSamplePayload() {
  const now = Math.floor(Date.now() / 1000)
  return JSON.stringify({ sub: '1234567890', name: 'John Doe', role: 'admin', iat: now, exp: now + 3600 }, null, 2)
}

export default function JwtGenerator() {
  const [algorithm, setAlgorithm] = useState('HS256')
  const [secret, setSecret] = useState('your-256-bit-secret-key-here-min32')
  const [payloadText, setPayloadText] = useState(makeSamplePayload)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    document.title = 'JWT Generator Online | OmniverseTools'
  }, [])

  async function generate() {
    setError('')
    setToken('')
    setGenerating(true)
    try {
      let payload
      try {
        payload = JSON.parse(payloadText)
      } catch {
        setError('Payload is not valid JSON — fix it and try again.')
        setGenerating(false)
        return
      }
      if (!secret.trim()) {
        setError('Please enter a secret key.')
        setGenerating(false)
        return
      }
      const jwt = await generateJwt(algorithm, secret, payload)
      setToken(jwt)
    } catch (e) {
      setError('Failed to generate token: ' + e.message)
    }
    setGenerating(false)
  }

  function copy() {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function addClaim(field, value) {
    try {
      const obj = JSON.parse(payloadText)
      obj[field] = value
      setPayloadText(JSON.stringify(obj, null, 2))
    } catch {
      // ignore if payload is invalid JSON
    }
  }

  const now = Math.floor(Date.now() / 1000)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">JWT Generator</h1>
      <p className="text-gray-400 mb-8">
        Generate signed HS256 / HS384 / HS512 JSON Web Tokens entirely in your browser — no data
        leaves your device. Use alongside the{' '}
        <a href="/tools/jwt-decoder" className="text-orange-400 hover:underline">JWT Decoder</a>.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5">
          {/* Algorithm */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Algorithm</label>
            <div className="flex gap-2">
              {['HS256', 'HS384', 'HS512'].map(alg => (
                <button
                  key={alg}
                  onClick={() => setAlgorithm(alg)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    algorithm === alg
                      ? 'bg-orange-600 text-white'
                      : 'bg-zinc-800 text-gray-400 border border-zinc-700 hover:border-orange-500 hover:text-white'
                  }`}
                >
                  {alg}
                </button>
              ))}
            </div>
          </div>

          {/* Secret */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Secret Key</label>
            <input
              type="text"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="your-secret-key"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              HS256 → ≥32 chars &nbsp;·&nbsp; HS384 → ≥48 chars &nbsp;·&nbsp; HS512 → ≥64 chars
            </p>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-400">Payload (JSON)</label>
              <div className="flex gap-3">
                <button onClick={() => addClaim('iat', now)} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  + iat
                </button>
                <button onClick={() => addClaim('exp', now + 3600)} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  + exp (1 h)
                </button>
                <button onClick={() => addClaim('nbf', now)} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  + nbf
                </button>
              </div>
            </div>
            <textarea
              value={payloadText}
              onChange={e => setPayloadText(e.target.value)}
              rows={10}
              spellCheck={false}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-yellow-300 font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-y"
            />
          </div>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {generating ? 'Generating…' : 'Generate Token'}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Generated JWT</label>
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 min-h-[200px]">
              {error ? (
                <div className="text-red-400 text-sm">❌ {error}</div>
              ) : token ? (
                <div>
                  <p className="font-mono text-xs break-all leading-relaxed">
                    {token.split('.').map((part, i) => (
                      <span key={i}>
                        <span className={['text-blue-400', 'text-purple-400', 'text-orange-400'][i]}>
                          {part}
                        </span>
                        {i < 2 && <span className="text-gray-600">.</span>}
                      </span>
                    ))}
                  </p>
                  <button
                    onClick={copy}
                    className="mt-4 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs rounded-lg transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy Token'}
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Fill in the fields on the left and click <em>Generate Token</em>.
                </p>
              )}
            </div>
          </div>

          {/* Colour legend */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400 shrink-0" />
              <span className="text-gray-400"><strong className="text-blue-400">Header</strong> — algorithm &amp; token type</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
              <span className="text-gray-400"><strong className="text-purple-400">Payload</strong> — claims (sub, name, iat, exp…)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400 shrink-0" />
              <span className="text-gray-400"><strong className="text-orange-400">Signature</strong> — HMAC of header.payload with your secret</span>
            </div>
          </div>

          {/* Common claims cheatsheet */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-xs">
            <div className="text-gray-400 font-semibold mb-3">Common standard claims</div>
            <div className="space-y-1.5 text-gray-500">
              {[
                ['sub', 'Subject — who the token refers to'],
                ['iss', 'Issuer — who created the token'],
                ['aud', 'Audience — intended recipient(s)'],
                ['iat', 'Issued-At — creation time (Unix seconds)'],
                ['exp', 'Expiry — expiration time (Unix seconds)'],
                ['nbf', 'Not-Before — token not valid before this time'],
                ['jti', 'JWT ID — unique identifier for the token'],
              ].map(([key, desc]) => (
                <div key={key} className="flex gap-2">
                  <code className="text-orange-300 min-w-[28px]">{key}</code>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          JWTs are signed using HMAC-SHA (this tool) or RSA/EC (not supported here). The Web Crypto
          API signs the token entirely in your browser — your secret never leaves your machine.
          Use generated tokens for <strong className="text-gray-400">local testing only</strong>; in
          production always sign tokens server-side and keep the secret out of client code.
        </p>
      </div>
    </div>
  )
}
