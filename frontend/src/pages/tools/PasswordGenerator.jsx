import { useState, useEffect, useCallback } from 'react'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generatePassword(length, options) {
  let charset = ''
  if (options.upper) charset += CHARS.upper
  if (options.lower) charset += CHARS.lower
  if (options.numbers) charset += CHARS.numbers
  if (options.symbols) charset += CHARS.symbols
  if (!charset) return ''

  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, n => charset[n % charset.length]).join('')
}

function strength(password) {
  if (!password) return { label: '', color: '', width: 0 }
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 33 }
  if (score <= 4) return { label: 'Good', color: 'bg-yellow-500', width: 66 }
  return { label: 'Strong', color: 'bg-green-500', width: 100 }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Strong Password Generator Online | OmniverseTools'
  }, [])

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options))
    setCopied(false)
  }, [length, options])

  useEffect(() => { generate() }, [generate])

  function copy() {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const s = strength(password)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Strong Password Generator</h1>
      <p className="text-gray-400 mb-8">
        Generate secure, random passwords using your browser's cryptographic API — nothing is sent to any server.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6">
        <div className="font-mono text-lg text-white break-all mb-3 min-h-[2rem]">{password}</div>
        {s.label && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Strength</span><span>{s.label}</span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div className={`h-full ${s.color} transition-all`} style={{ width: `${s.width}%` }} />
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={generate} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Generate New
          </button>
          <button onClick={copy} className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            {copied ? '✅ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Length</span><span className="text-white font-mono">{length}</span>
          </label>
          <input
            type="range" min={8} max={64} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CHARS).map(([key, example]) => (
            <label key={key} className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-500 transition-colors">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={e => setOptions(o => ({ ...o, [key]: e.target.checked }))}
                className="accent-orange-500 w-4 h-4"
              />
              <div>
                <div className="text-white text-sm capitalize">{key === 'upper' ? 'Uppercase' : key === 'lower' ? 'Lowercase' : key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className="text-gray-500 text-xs font-mono">{example.slice(0, 10)}…</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This password generator uses the Web Crypto API (<code className="bg-zinc-800 px-1 rounded text-gray-300">crypto.getRandomValues()</code>)
          for cryptographically secure randomness. Passwords are generated entirely in your browser and never transmitted anywhere.
          For maximum security, use a password length of 16+ characters with all character types enabled.
        </p>
      </div>
    </div>
  )
}
