import { useState, useEffect } from 'react'

const DEFAULT = {
  title: 'My Awesome Page',
  description: 'A short description of your page that will appear in search results and social media link previews.',
  url: 'https://example.com/',
  image: '',
  siteName: 'My Site',
  twitterHandle: '@myhandle',
  ogType: 'website',
  twitterCard: 'summary_large_image',
}

function generateSnippet(f) {
  const lines = []
  const handle = f.twitterHandle
    ? (f.twitterHandle.startsWith('@') ? f.twitterHandle : '@' + f.twitterHandle)
    : ''

  lines.push('<!-- Primary Meta Tags -->')
  if (f.title) lines.push(`<title>${f.title}</title>`)
  if (f.title) lines.push(`<meta name="title" content="${f.title}" />`)
  if (f.description) lines.push(`<meta name="description" content="${f.description}" />`)

  lines.push('')
  lines.push('<!-- Open Graph / Facebook -->')
  if (f.ogType) lines.push(`<meta property="og:type" content="${f.ogType}" />`)
  if (f.url) lines.push(`<meta property="og:url" content="${f.url}" />`)
  if (f.title) lines.push(`<meta property="og:title" content="${f.title}" />`)
  if (f.description) lines.push(`<meta property="og:description" content="${f.description}" />`)
  if (f.image) lines.push(`<meta property="og:image" content="${f.image}" />`)
  if (f.siteName) lines.push(`<meta property="og:site_name" content="${f.siteName}" />`)

  lines.push('')
  lines.push('<!-- Twitter -->')
  if (f.twitterCard) lines.push(`<meta property="twitter:card" content="${f.twitterCard}" />`)
  if (f.url) lines.push(`<meta property="twitter:url" content="${f.url}" />`)
  if (f.title) lines.push(`<meta property="twitter:title" content="${f.title}" />`)
  if (f.description) lines.push(`<meta property="twitter:description" content="${f.description}" />`)
  if (f.image) lines.push(`<meta property="twitter:image" content="${f.image}" />`)
  if (handle) lines.push(`<meta name="twitter:creator" content="${handle}" />`)

  return lines.join('\n')
}

function getHostname(url) {
  try { return new URL(url).hostname } catch { return url }
}

export default function MetaTagsGenerator() {
  const [fields, setFields] = useState(DEFAULT)
  const [copied, setCopied] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    document.title = 'Meta / OG Tags Generator | OmniverseTools'
  }, [])

  function update(key, val) {
    setFields(f => ({ ...f, [key]: val }))
    if (key === 'image') setImgError(false)
  }

  const snippet = generateSnippet(fields)
  const hostname = getHostname(fields.url)
  const titlePreview = fields.title.slice(0, 60)
  const descPreview = fields.description.slice(0, 155)

  function copy() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Meta / OG Tags Generator</h1>
      <p className="text-gray-400 mb-8">
        Fill in your page details and get the complete{' '}
        <code className="text-orange-400 text-xs">&lt;head&gt;</code> meta tag snippet — Open Graph,
        Twitter Card, and primary SEO tags — ready to paste into any HTML page.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4">
          <h2 className="text-white font-semibold">Page Details</h2>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
              Page Title{' '}
              <span className={`normal-case font-normal ${fields.title.length > 60 ? 'text-yellow-500' : 'text-gray-600'}`}>
                ({fields.title.length}/60)
              </span>
            </label>
            <input
              type="text"
              value={fields.title}
              onChange={e => update('title', e.target.value)}
              placeholder="My Awesome Page"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
              Description{' '}
              <span className={`normal-case font-normal ${fields.description.length > 160 ? 'text-yellow-500' : 'text-gray-600'}`}>
                ({fields.description.length}/160)
              </span>
            </label>
            <textarea
              rows={3}
              value={fields.description}
              onChange={e => update('description', e.target.value)}
              placeholder="A short description of your page…"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Page URL</label>
            <input
              type="text"
              value={fields.url}
              onChange={e => update('url', e.target.value)}
              placeholder="https://example.com/"
              spellCheck={false}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
              Image URL <span className="normal-case text-gray-600 font-normal">(1200×630 px recommended)</span>
            </label>
            <input
              type="text"
              value={fields.image}
              onChange={e => update('image', e.target.value)}
              placeholder="https://example.com/preview.jpg"
              spellCheck={false}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Site Name</label>
            <input
              type="text"
              value={fields.siteName}
              onChange={e => update('siteName', e.target.value)}
              placeholder="My Site"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Twitter / X Handle</label>
            <input
              type="text"
              value={fields.twitterHandle}
              onChange={e => update('twitterHandle', e.target.value)}
              placeholder="@handle"
              spellCheck={false}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">OG Type</label>
              <select
                value={fields.ogType}
                onChange={e => update('ogType', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
                <option value="video.other">video</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Twitter Card</label>
              <select
                value={fields.twitterCard}
                onChange={e => update('twitterCard', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Previews */}
        <div className="space-y-4">
          {/* Social card preview */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Social Card Preview</h2>
            <div className="border border-zinc-700 rounded-lg overflow-hidden">
              {fields.image && !imgError ? (
                <div className="w-full aspect-[1.91/1] bg-zinc-800 overflow-hidden">
                  <img
                    src={fields.image}
                    alt="OG preview"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className="w-full aspect-[1.91/1] bg-zinc-800 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">
                    {fields.image && imgError ? 'Image could not be loaded' : 'No image URL set'}
                  </span>
                </div>
              )}
              <div className="px-3 py-2.5 bg-zinc-800 border-t border-zinc-700">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5 truncate">
                  {hostname || 'example.com'}
                </div>
                <div className="text-white text-sm font-semibold leading-snug line-clamp-2">
                  {titlePreview || 'Page Title'}
                </div>
                <div className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
                  {descPreview || 'Page description'}
                </div>
              </div>
            </div>
          </div>

          {/* Google search preview */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Google Preview</h2>
            <div className="text-xs text-green-500 truncate mb-0.5">
              {fields.url || 'https://example.com/'}
            </div>
            <div className="text-blue-400 text-base leading-snug">
              {titlePreview || 'Page Title'}
            </div>
            <div className="text-gray-400 text-xs leading-relaxed mt-0.5">
              {descPreview || 'Page description…'}
            </div>
          </div>
        </div>
      </div>

      {/* Generated snippet */}
      <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Generated HTML Snippet</h2>
          <button
            onClick={copy}
            className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-zinc-800 rounded-lg p-4 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
          {snippet}
        </pre>
      </div>

      <div className="mt-6 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Meta tags and Open Graph tags control how your pages appear in search results and social media
          link previews. The <code className="text-orange-400 text-xs">og:title</code>,{' '}
          <code className="text-orange-400 text-xs">og:description</code>, and{' '}
          <code className="text-orange-400 text-xs">og:image</code> tags are read by Facebook, LinkedIn,
          WhatsApp, and most social platforms. Twitter / X uses its own{' '}
          <code className="text-orange-400 text-xs">twitter:card</code> tags. Paste the generated snippet
          inside the <code className="text-orange-400 text-xs">&lt;head&gt;</code> element of your HTML
          page. All processing happens in your browser — nothing is sent to any server.
        </p>
      </div>
    </div>
  )
}
