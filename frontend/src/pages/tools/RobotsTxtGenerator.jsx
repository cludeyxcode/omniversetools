import { useState, useEffect } from 'react'

const INP = 'bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500'

let _id = 0
const uid = () => ++_id

function makeRule(type = 'Disallow', path = '') {
  return { id: uid(), type, path }
}

function makeBlock(userAgent = '*') {
  return { id: uid(), userAgent, crawlDelay: '', rules: [makeRule('Disallow', '')] }
}

function buildOutput(blocks, sitemapUrl) {
  const lines = []
  for (const block of blocks) {
    lines.push(`User-agent: ${block.userAgent.trim() || '*'}`)
    for (const r of block.rules) {
      lines.push(`${r.type}: ${r.path}`)
    }
    if (block.crawlDelay.trim()) lines.push(`Crawl-delay: ${block.crawlDelay.trim()}`)
    lines.push('')
  }
  if (sitemapUrl.trim()) lines.push(`Sitemap: ${sitemapUrl.trim()}`)
  return lines.join('\n').trimEnd()
}

function genericPreset() {
  const b = makeBlock('*')
  b.rules = [makeRule('Allow', '/')]
  return { blocks: [b], sitemap: 'https://example.com/sitemap.xml' }
}

function wordpressPreset() {
  const b = makeBlock('*')
  b.rules = [
    makeRule('Disallow', '/wp-admin/'),
    makeRule('Allow', '/wp-admin/admin-ajax.php'),
    makeRule('Disallow', '/wp-content/plugins/'),
    makeRule('Disallow', '/wp-content/themes/'),
    makeRule('Disallow', '/?s='),
    makeRule('Disallow', '/tag/'),
  ]
  return { blocks: [b], sitemap: 'https://example.com/sitemap.xml' }
}

function shopifyPreset() {
  const b = makeBlock('*')
  b.rules = [
    makeRule('Disallow', '/admin'),
    makeRule('Disallow', '/cart'),
    makeRule('Disallow', '/orders'),
    makeRule('Disallow', '/checkouts/'),
    makeRule('Disallow', '/checkout'),
    makeRule('Disallow', '/customers/'),
    makeRule('Disallow', '/account'),
    makeRule('Allow', '/collections/'),
    makeRule('Allow', '/products/'),
    makeRule('Allow', '/pages/'),
    makeRule('Allow', '/blogs/'),
  ]
  return { blocks: [b], sitemap: 'https://example.com/sitemap.xml' }
}

const PRESET_FNS = { generic: genericPreset, wordpress: wordpressPreset, shopify: shopifyPreset }

export default function RobotsTxtGenerator() {
  const [activePreset, setActivePreset] = useState('generic')
  const [sitemapUrl, setSitemapUrl] = useState('https://example.com/sitemap.xml')
  const [blocks, setBlocks] = useState(() => {
    const b = makeBlock('*')
    b.rules = [makeRule('Allow', '/')]
    return [b]
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = 'Robots.txt Generator | OmniverseTools' }, [])

  function applyPreset(key) {
    const { blocks: newBlocks, sitemap } = PRESET_FNS[key]()
    setBlocks(newBlocks)
    setSitemapUrl(sitemap)
    setActivePreset(key)
  }

  function updateBlock(id, key, val) {
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, [key]: val } : b))
  }

  function removeBlock(id) {
    setBlocks(bs => bs.filter(b => b.id !== id))
  }

  function addBlock() {
    setBlocks(bs => [...bs, makeBlock('*')])
    setActivePreset(null)
  }

  function updateRule(blockId, ruleId, key, val) {
    setBlocks(bs => bs.map(b => {
      if (b.id !== blockId) return b
      return { ...b, rules: b.rules.map(r => r.id === ruleId ? { ...r, [key]: val } : r) }
    }))
    setActivePreset(null)
  }

  function removeRule(blockId, ruleId) {
    setBlocks(bs => bs.map(b => {
      if (b.id !== blockId) return b
      return { ...b, rules: b.rules.filter(r => r.id !== ruleId) }
    }))
    setActivePreset(null)
  }

  function addRule(blockId) {
    setBlocks(bs => bs.map(b => {
      if (b.id !== blockId) return b
      return { ...b, rules: [...b.rules, makeRule('Disallow', '')] }
    }))
    setActivePreset(null)
  }

  const output = buildOutput(blocks, sitemapUrl)

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function download() {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'robots.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Robots.txt Generator</h1>
      <p className="text-gray-400 mb-8">
        Start from a platform preset or build your rules manually, then copy or download the finished{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">robots.txt</code> file.
      </p>

      {/* Preset buttons */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-5">
        <h2 className="text-white font-semibold mb-3">Platform Preset</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'generic',   label: 'Generic' },
            { key: 'wordpress', label: 'WordPress' },
            { key: 'shopify',   label: 'Shopify' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePreset === key
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click a preset to populate the builder below, then customise as needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left — builder */}
        <div className="space-y-4">

          {/* Sitemap URL */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1.5">
              Sitemap URL <span className="normal-case">(optional)</span>
            </label>
            <input
              className={INP + ' w-full'}
              value={sitemapUrl}
              onChange={e => { setSitemapUrl(e.target.value); setActivePreset(null) }}
              placeholder="https://example.com/sitemap.xml"
              spellCheck={false}
            />
          </div>

          {/* User-agent blocks */}
          {blocks.map((block, bIdx) => (
            <div key={block.id} className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-orange-400 text-sm font-medium">Block {bIdx + 1}</span>
                {blocks.length > 1 && (
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Remove block
                  </button>
                )}
              </div>

              {/* User-agent */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">User-agent</label>
                <input
                  className={INP + ' w-full'}
                  value={block.userAgent}
                  onChange={e => updateBlock(block.id, 'userAgent', e.target.value)}
                  placeholder="*"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Use <code className="text-gray-500">*</code> for all crawlers, or a bot name like{' '}
                  <code className="text-gray-500">Googlebot</code>.
                </p>
              </div>

              {/* Rules */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wide block">Rules</label>
                {block.rules.map(rule => (
                  <div key={rule.id} className="flex gap-2 items-center">
                    <select
                      value={rule.type}
                      onChange={e => updateRule(block.id, rule.id, 'type', e.target.value)}
                      className="bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-orange-500 shrink-0"
                    >
                      <option value="Allow">Allow</option>
                      <option value="Disallow">Disallow</option>
                    </select>
                    <input
                      className={INP + ' flex-1 min-w-0'}
                      value={rule.path}
                      onChange={e => updateRule(block.id, rule.id, 'path', e.target.value)}
                      placeholder="/path/"
                      spellCheck={false}
                    />
                    {block.rules.length > 1 && (
                      <button
                        onClick={() => removeRule(block.id, rule.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none shrink-0 pb-0.5"
                        title="Remove rule"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addRule(block.id)}
                  className="w-full py-2 rounded-lg text-sm bg-zinc-800 text-gray-500 hover:text-orange-400 hover:bg-zinc-700 transition-colors border border-zinc-700 border-dashed"
                >
                  + Add rule
                </button>
              </div>

              {/* Crawl-delay */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
                  Crawl-delay <span className="normal-case">(optional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className={INP + ' w-28'}
                    type="number"
                    min="0"
                    value={block.crawlDelay}
                    onChange={e => updateBlock(block.id, 'crawlDelay', e.target.value)}
                    placeholder="10"
                  />
                  <span className="text-xs text-gray-600">seconds between requests</span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addBlock}
            className="w-full py-3 rounded-xl text-sm bg-zinc-900 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 transition-colors border border-zinc-700 border-dashed"
          >
            + Add user-agent block
          </button>
        </div>

        {/* Right — output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">robots.txt output</label>
            <div className="flex gap-2">
              <button
                onClick={download}
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-500"
              >
                Download
              </button>
              <button
                onClick={copy}
                className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            rows={30}
            spellCheck={false}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-green-300 text-sm font-mono focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About robots.txt</h2>
        <p>
          A <code className="bg-zinc-800 px-1 rounded text-gray-300">robots.txt</code> file sits at your
          domain root (e.g.{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">https://example.com/robots.txt</code>) and
          tells web crawlers which pages to crawl or skip. <code className="bg-zinc-800 px-1 rounded text-gray-300 mx-0.5">Disallow</code>
          blocks a path; <code className="bg-zinc-800 px-1 rounded text-gray-300 mx-0.5">Allow</code> overrides
          a broader Disallow for a sub-path. The{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">Sitemap</code> line helps crawlers find your
          sitemap automatically. Note: robots.txt is advisory — malicious bots may ignore it. Use proper
          authentication to protect sensitive pages.
        </p>
      </div>
    </div>
  )
}
