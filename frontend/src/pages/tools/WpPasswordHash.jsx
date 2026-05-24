import { useState, useEffect } from 'react'

const ITOA64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// MD5 implementation (phpass requires MD5, not available in Web Crypto)
function md5(inputBytes) {
  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21,
  ]
  const K = [
    0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,
    0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,
    0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,
    0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,
    0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,
    0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,
    0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,
    0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391,
  ]

  const msgLen = inputBytes.length
  const bitLen = msgLen * 8
  // Padded length: message + 0x80 + zeros + 8-byte length, aligned to 64 bytes
  const paddedLen = (Math.floor((msgLen + 8) / 64) + 1) * 64
  const padded = new Uint8Array(paddedLen)
  padded.set(inputBytes)
  padded[msgLen] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(paddedLen - 8, bitLen >>> 0, true)
  view.setUint32(paddedLen - 4, Math.floor(bitLen / 0x100000000), true)

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476

  for (let i = 0; i < paddedLen; i += 64) {
    const M = new Uint32Array(16)
    const bv = new DataView(padded.buffer, i, 64)
    for (let j = 0; j < 16; j++) M[j] = bv.getUint32(j * 4, true)

    let A = a0, B = b0, C = c0, D = d0
    for (let j = 0; j < 64; j++) {
      let F, g
      if (j < 16)      { F = (B & C) | (~B & D);        g = j }
      else if (j < 32) { F = (D & B) | (~D & C);        g = (5 * j + 1) % 16 }
      else if (j < 48) { F = B ^ C ^ D;                  g = (3 * j + 5) % 16 }
      else             { F = C ^ (B | ~D);               g = (7 * j) % 16 }
      F = (F + A + K[j] + M[g]) >>> 0
      A = D; D = C; C = B
      B = (B + ((F << s[j]) | (F >>> (32 - s[j])))) >>> 0
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0
    c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0
  }

  const result = new Uint8Array(16)
  const rv = new DataView(result.buffer)
  rv.setUint32(0, a0, true); rv.setUint32(4, b0, true)
  rv.setUint32(8, c0, true); rv.setUint32(12, d0, true)
  return result
}

// phpass base64 encoding
function encode64(input, count) {
  let out = '', i = 0
  do {
    let v = input[i++]
    out += ITOA64[v & 0x3f]
    if (i < count) v |= input[i] << 8
    out += ITOA64[(v >> 6) & 0x3f]
    if (i++ >= count) break
    if (i < count) v |= input[i] << 16
    out += ITOA64[(v >> 12) & 0x3f]
    if (i++ >= count) break
    out += ITOA64[(v >> 18) & 0x3f]
  } while (i < count)
  return out
}

function concat(a, b) {
  const out = new Uint8Array(a.length + b.length)
  out.set(a); out.set(b, a.length)
  return out
}

// Core phpass hash function (matches WordPress wp-includes/class-phpass.php)
function cryptPrivate(password, setting) {
  const countLog2 = ITOA64.indexOf(setting[3])
  if (countLog2 < 7 || countLog2 > 30) return '*0'
  let count = 1 << countLog2
  const enc = new TextEncoder()
  const saltBytes = enc.encode(setting.slice(4, 12))
  const pwBytes = enc.encode(password)
  let hash = md5(concat(saltBytes, pwBytes))
  do { hash = md5(concat(hash, pwBytes)) } while (--count)
  return setting.slice(0, 12) + encode64(hash, 16)
}

// Generate a new WordPress-compatible hash
// Uses ITOA64[11] = '9' → count_log2=11 → 2^11=2048 iterations (WordPress default on 64-bit PHP)
function hashPassword(password) {
  const saltRaw = crypto.getRandomValues(new Uint8Array(6))
  const setting = '$P$' + ITOA64[11] + encode64(saltRaw, 6)
  return cryptPrivate(password, setting)
}

// Returns true if password matches a phpass hash
function checkPassword(password, hash) {
  if (!hash.startsWith('$P$')) return false
  return cryptPrivate(password, hash) === hash
}

export default function WpPasswordHash() {
  const [password, setPassword]     = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [hash, setHash]             = useState('')
  const [copied, setCopied]         = useState(false)

  const [verifyPw, setVerifyPw]     = useState('')
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyResult, setVerifyResult] = useState(null) // null | true | false

  useEffect(() => {
    document.title = 'WordPress Password Hash Generator | OmniverseTools'
  }, [])

  function generate() {
    if (!password.trim()) return
    setHash(hashPassword(password.trim()))
    setCopied(false)
  }

  function copy() {
    if (!hash) return
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function verify() {
    if (!verifyPw || !verifyHash.trim()) return
    setVerifyResult(checkPassword(verifyPw, verifyHash.trim()))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">WordPress Password Hash Generator</h1>
      <p className="text-gray-400 mb-8">
        Generate a{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">phpass</code>-compatible
        hash you can paste directly into{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">wp_users.user_pass</code>{' '}
        for emergency admin account recovery. Everything runs in your browser — no password leaves your device.
      </p>

      {/* Generate */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold text-lg mb-4">Generate Hash</h2>

        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setHash('') }}
            placeholder="Enter the new password…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors pr-16"
          />
          <button
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          onClick={generate}
          disabled={!password.trim()}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generate Hash
        </button>

        {hash && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Hash (paste into <code className="bg-zinc-800 px-1 rounded text-gray-300">user_pass</code>)</label>
              <button
                onClick={copy}
                className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-green-300 font-mono text-sm break-all select-all">
              {hash}
            </div>
            <div className="mt-4 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">SQL snippet</p>
              <code className="text-xs font-mono text-orange-300 break-all">
                {`UPDATE wp_users SET user_pass = '${hash}', user_activation_key = '' WHERE user_login = 'admin';`}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Verify */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold text-lg mb-4">Verify Existing Hash</h2>
        <p className="text-gray-500 text-sm mb-4">
          Check whether a password matches a hash already in your database.
        </p>

        <label className="block text-sm text-gray-400 mb-1">Password to check</label>
        <input
          type="text"
          value={verifyPw}
          onChange={e => { setVerifyPw(e.target.value); setVerifyResult(null) }}
          placeholder="Enter password…"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors mb-4"
        />

        <label className="block text-sm text-gray-400 mb-1">Existing hash from <code className="bg-zinc-800 px-1 rounded text-gray-300">user_pass</code></label>
        <input
          type="text"
          value={verifyHash}
          onChange={e => { setVerifyHash(e.target.value); setVerifyResult(null) }}
          placeholder="$P$B…"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors mb-4"
        />

        <button
          onClick={verify}
          disabled={!verifyPw || !verifyHash.trim()}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Verify
        </button>

        {verifyResult !== null && (
          <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            verifyResult
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {verifyResult ? '✓ Password matches the hash.' : '✗ Password does not match the hash.'}
          </div>
        )}
      </div>

      {/* Reference */}
      <div className="text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-3">How WordPress Stores Passwords</h2>
        <p className="mb-4">
          WordPress uses the{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">phpass</code> library to hash passwords
          with iterated MD5. A hash looks like{' '}
          <code className="bg-zinc-800 px-1 rounded text-orange-300 text-xs">$P$9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>{' '}
          (34 characters). The <code className="bg-zinc-800 px-1 rounded text-gray-300">$P$</code> prefix
          identifies it as phpass portable, the next character encodes the iteration count, the following
          8 characters are the salt, and the last 22 characters are the encoded hash.
        </p>
        <p className="mb-6">
          This tool generates hashes using the same algorithm WordPress uses on 64-bit PHP
          (2&thinsp;048 iterations) so the hash is accepted directly by the WordPress authentication system.
        </p>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-600/80 text-xs leading-relaxed">
          <strong className="text-yellow-500">Security reminder:</strong> Never share or store unhashed passwords.
          After pasting the new hash into your database and logging in, change the password immediately via{' '}
          <em>Users → Profile</em> in the WordPress admin so WordPress can re-hash it with its own salt.
          Clear your browser history if you typed the password here on a shared machine.
        </div>
      </div>
    </div>
  )
}
