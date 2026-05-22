import { useState, useEffect } from 'react'

const PLATFORMS = ['Apache / WordPress', 'Nginx', 'Shopify CSV']

const EXAMPLE = `/old-page → /new-page
/about-us → /about
/products/old-name → /products/new-name
/blog/2022/my-post → /blog/my-post`

function parseRedirects(text) {
  return text
    .split('\n')
    .map(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return null
      // Support →, ->, ,, or two+ spaces as separator
      const m = trimmed.match(/^(.+?)\s*(?:→|->)\s*(.+)$/) ||
                trimmed.match(/^(.+?),(.+)$/) ||
                trimmed.match(/^(.+?)\s{2,}(.+)$/)
      if (!m) return null
      return { from: m[1].trim(), to: m[2].trim() }
    })
    .filter(Boolean)
}

function buildOutput(redirects, platform) {
  if (!redirects.length) return ''

  if (platform === 'Apache / WordPress') {
    const rules = redirects.map(r => {
      // Strip leading slash for the regex pattern (RewriteRule matches without leading slash in .htaccess)
      const pattern = r.from.replace(/^\//, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return `RewriteRule ^${pattern}/?$ ${r.to} [R=301,L]`
    })
    return `# 301 Redirects — Apache / WordPress .htaccess
# Add inside your <IfModule mod_rewrite.c> block, after: RewriteEngine On

${rules.join('\n')}`
  }

  if (platform === 'Nginx') {
    const rules = redirects.map(r => {
      const pattern = r.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return `rewrite ^${pattern}/?$ ${r.to} permanent;`
    })
    return `# 301 Redirects — Nginx
# Place these inside your server { } block

${rules.join('\n')}`
  }

  if (platform === 'Shopify CSV') {
    const rows = redirects.map(r => `${r.from},${r.to}`)
    return ['Redirect from,Redirect to', ...rows].join('\n')
  }

  return ''
}

export default function RedirectMapBuilder() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('Apache / WordPress')
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = '301 Redirect Map Builder | OmniverseTools' }, [])

  const redirects = parseRedirects(input)
  const output = buildOutput(redirects, platform)

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function download() {
    const filename =
      platform === 'Shopify CSV' ? 'shopify-redirects.csv'
      : platform === 'Nginx' ? 'redirects.conf'
      : 'htaccess-redirects.txt'
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const outputLabel =
    platform === 'Shopify CSV' ? 'Shopify CSV import'
    : platform === 'Nginx' ? 'Nginx rewrite rules'
    : '.htaccess RewriteRules'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">301 Redirect Map Builder</h1>
      <p className="text-gray-400 mb-8">
        Paste old → new URL pairs and get ready-to-paste{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">.htaccess</code> RewriteRules,
        Nginx <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">rewrite</code> directives,
        or a Shopify CSV redirect import file.
      </p>

      {/* Platform tabs */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-5">
        <h2 className="text-white font-semibold mb-3">Platform</h2>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                platform === p
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {platform === 'Apache / WordPress' && 'Generates RewriteRule directives for your .htaccess file.'}
          {platform === 'Nginx' && 'Generates rewrite rules to paste inside your server {} block.'}
          {platform === 'Shopify CSV' && 'Generates a two-column CSV to import via Online Store › Navigation › URL Redirects › Import.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left — input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">
              URL pairs <span className="text-gray-600">(one per line, old → new)</span>
            </label>
            <span className={`text-xs ${redirects.length > 0 ? 'text-orange-400' : 'text-gray-600'}`}>
              {redirects.length} redirect{redirects.length !== 1 ? 's' : ''}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={22}
            placeholder={EXAMPLE}
            spellCheck={false}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 text-sm font-mono focus:outline-none focus:border-orange-500 resize-none placeholder-zinc-600"
          />
          <p className="text-xs text-gray-600 mt-2">
            Separators supported: <code className="text-gray-500">→</code>, <code className="text-gray-500">-{'>'}</code>, or comma. Lines beginning with <code className="text-gray-500">#</code> are ignored.
          </p>
        </div>

        {/* Right — output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">{outputLabel}</label>
            <div className="flex gap-2">
              <button
                onClick={download}
                disabled={!output}
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Download
              </button>
              <button
                onClick={copy}
                disabled={!output}
                className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            rows={22}
            spellCheck={false}
            placeholder="Output appears here once you enter URL pairs…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-green-300 text-sm font-mono focus:outline-none resize-none placeholder-zinc-600"
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About 301 Redirect Maps</h2>
        <p className="mb-3">
          A <strong className="text-gray-400">301 redirect</strong> permanently forwards one URL to another,
          telling search engines to transfer all ranking signals to the new URL. Use redirects when you rename
          pages, migrate platforms, or restructure your URL hierarchy.
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            <strong className="text-gray-400">Apache / WordPress</strong> — paste the generated rules inside your{' '}
            <code className="bg-zinc-800 px-1 rounded text-gray-300">.htaccess</code> file after{' '}
            <code className="bg-zinc-800 px-1 rounded text-gray-300">RewriteEngine On</code>. Requires{' '}
            <code className="bg-zinc-800 px-1 rounded text-gray-300">mod_rewrite</code>.
          </li>
          <li>
            <strong className="text-gray-400">Nginx</strong> — add the{' '}
            <code className="bg-zinc-800 px-1 rounded text-gray-300">rewrite</code> lines inside your{' '}
            <code className="bg-zinc-800 px-1 rounded text-gray-300">server {'{}'}</code> block and reload Nginx.
          </li>
          <li>
            <strong className="text-gray-400">Shopify CSV</strong> — go to{' '}
            <em>Online Store › Navigation › URL Redirects</em>, click <em>Import</em>, and upload the CSV.
            Shopify accepts up to 100,000 redirects via import.
          </li>
        </ul>
      </div>
    </div>
  )
}
