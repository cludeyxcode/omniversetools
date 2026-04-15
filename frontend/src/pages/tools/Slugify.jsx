import { useState, useEffect } from 'react'

const CHAR_MAP = {
  'à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae',
  'ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i',
  'ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o',
  'ù':'u','ú':'u','û':'u','ü':'u','ý':'y','ÿ':'y','ß':'ss',
}

function slugify(text, sep, lower, maxLen) {
  let s = text
  // Replace accented chars
  s = s.replace(/[àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿß]/g, c => CHAR_MAP[c] ?? c)
  // Remove anything not alphanumeric or whitespace
  s = s.replace(/[^a-zA-Z0-9\s]/g, ' ')
  // Collapse whitespace → separator
  s = s.trim().replace(/\s+/g, sep)
  if (lower) s = s.toLowerCase()
  if (maxLen) s = s.slice(0, maxLen).replace(new RegExp(`\\${sep}$`), '')
  return s
}

export default function Slugify() {
  const [input, setInput]   = useState('')
  const [sep, setSep]       = useState('-')
  const [lower, setLower]   = useState(true)
  const [maxLen, setMaxLen] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = 'Slugify Tool — URL Slug Generator | OmniverseTools' }, [])

  const slug = slugify(input, sep, lower, maxLen ? parseInt(maxLen) : 0)

  function copy() {
    navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Slugify Tool</h1>
      <p className="text-gray-400 mb-6">
        Convert any title or phrase into a clean URL slug — "My Blog Post Title" → "my-blog-post-title".
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input text</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g. My Blog Post Title"
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Separator</label>
            <select value={sep} onChange={e => setSep(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500">
              <option value="-">Hyphen  (-)</option>
              <option value="_">Underscore (_)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Case</label>
            <select value={lower ? 'lower' : 'preserve'} onChange={e => setLower(e.target.value === 'lower')}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500">
              <option value="lower">Lowercase</option>
              <option value="preserve">Preserve</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max length</label>
            <input type="number" value={maxLen} onChange={e => setMaxLen(e.target.value)} placeholder="None"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-white">Result</span>
          <button onClick={copy} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <div className={`font-mono text-sm rounded-lg px-4 py-3 min-h-[2.5rem] break-all ${slug ? 'bg-zinc-800 text-orange-300' : 'bg-zinc-800/50 text-gray-600'}`}>
          {slug || 'Start typing above…'}
        </div>
        {slug && (
          <div className="mt-2 text-xs text-gray-500">{slug.length} characters</div>
        )}
      </div>
    </div>
  )
}
