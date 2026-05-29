import { useState, useEffect } from 'react'

const SIZES = [
  { suffix: 'master',             label: 'master',              dims: 'Full resolution',         desc: 'Original unmodified image' },
  { suffix: '2048x2048',          label: '2048x2048',           dims: '2048×2048 max',           desc: 'Retina / zoom view' },
  { suffix: '1024x1024',          label: '1024x1024',           dims: '1024×1024 max',           desc: 'Full zoom view' },
  { suffix: 'grande',             label: 'grande',              dims: '600×600 max',             desc: 'Named preset' },
  { suffix: '800x800',            label: '800x800',             dims: '800×800 max',             desc: '' },
  { suffix: '600x600',            label: '600x600',             dims: '600×600 max',             desc: '' },
  { suffix: '500x500',            label: '500x500',             dims: '500×500 max',             desc: '' },
  { suffix: 'large',              label: 'large',               dims: '480×480 max',             desc: 'Named preset' },
  { suffix: '400x400',            label: '400x400',             dims: '400×400 max',             desc: '' },
  { suffix: '300x300',            label: '300x300',             dims: '300×300 max',             desc: 'Common product tile' },
  { suffix: 'medium',             label: 'medium',              dims: '240×240 max',             desc: 'Named preset' },
  { suffix: '200x200',            label: '200x200',             dims: '200×200 max',             desc: '' },
  { suffix: 'compact',            label: 'compact',             dims: '160×160 max',             desc: 'Named preset' },
  { suffix: 'thumb',              label: 'thumb',               dims: '160×160 max',             desc: 'Named preset (= compact)' },
  { suffix: '100x100',            label: '100x100',             dims: '100×100 max',             desc: '' },
  { suffix: 'small',              label: 'small',               dims: '100×100 max',             desc: 'Named preset' },
  { suffix: 'icon',               label: 'icon',                dims: '32×32 max',               desc: 'Named preset' },
  { suffix: '800x',               label: '800x',                dims: '800px wide, auto height', desc: 'Width-only constraint' },
  { suffix: 'x800',               label: 'x800',                dims: 'Auto width, 800px tall',  desc: 'Height-only constraint' },
  { suffix: '300x300_crop_center',label: '300x300_crop_center', dims: '300×300, cropped',        desc: 'Exact crop to center' },
]

const SIZE_REGEX = /_(?:(?:\d+x\d*|\d*x\d+)|master|grande|large|medium|small|compact|thumb|icon)(?:_crop_(?:center|top|bottom|left|right))?(?=\.[^.?]+)/i

function stripSize(url) {
  return url.replace(SIZE_REGEX, '')
}

function applySize(baseUrl, suffix) {
  if (suffix === 'master') return baseUrl
  return baseUrl.replace(/(\.[^.?]+)(\?|$)/, `_${suffix}$1$2`)
}

function isShopifyCdnUrl(url) {
  return /cdn\.shopify\.com.*\/files\//.test(url)
}

export default function ShopifyImageResizer() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(null)

  useEffect(() => { document.title = 'Shopify Image URL Resizer | OmniverseTools' }, [])

  const trimmed = input.trim()
  const baseUrl = trimmed ? stripSize(trimmed) : ''
  const isValid = trimmed.length > 0 && /^https?:\/\//.test(trimmed)
  const isShopify = isShopifyCdnUrl(trimmed)
  const sizeStripped = baseUrl !== trimmed

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Shopify Image URL Resizer</h1>
      <p className="text-gray-400 mb-8">
        Paste any Shopify CDN image URL to instantly generate all size variants using Shopify's{' '}
        <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">_300x300</code>,{' '}
        <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">_master</code>, and{' '}
        <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">_2048x2048</code> URL syntax. Click any URL to copy it.
      </p>

      {/* Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Shopify Image URL</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="https://cdn.shopify.com/s/files/1/0001/1234/products/shirt.jpg?v=123456"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
        />
        {trimmed && !isShopify && (
          <p className="text-yellow-400 text-xs mt-2">
            ⚠ This doesn&apos;t look like a Shopify CDN URL — the transformed URLs may not work.
          </p>
        )}
        {isValid && sizeStripped && (
          <p className="text-green-400 text-xs mt-2">
            Existing size modifier detected and stripped from base URL.
          </p>
        )}
      </div>

      {isValid && (
        <>
          {/* Base URL */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Base URL (no size modifier)</div>
                <code className="text-sm text-orange-300 font-mono break-all leading-relaxed">{baseUrl}</code>
              </div>
              <button
                onClick={() => copy(baseUrl, 'base')}
                className="shrink-0 text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied === 'base' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Size table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs whitespace-nowrap">Size String</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs whitespace-nowrap">Dimensions</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs">Generated URL</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map(({ suffix, label, dims, desc }) => {
                  const generated = applySize(baseUrl, suffix)
                  const key = `size-${suffix}`
                  return (
                    <tr key={suffix} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <code className="text-orange-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded whitespace-nowrap">
                          _{label}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300 text-xs whitespace-nowrap">{dims}</span>
                        {desc && <span className="text-gray-600 text-xs block mt-0.5">{desc}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-gray-400 font-mono text-xs break-all">{generated}</code>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => copy(generated, key)}
                          className="text-xs bg-zinc-700 hover:bg-orange-600 text-gray-300 hover:text-white px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                        >
                          {copied === key ? '✓' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Liquid snippets */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
            <h2 className="text-gray-300 font-semibold text-base mb-4">Liquid Snippets</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Modern image_url filter (recommended)</div>
                  <button
                    onClick={() => copy("{{ product.featured_image | image_url: width: 300 | image_tag }}", 'liq1')}
                    className="text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 hover:text-white px-2.5 py-1 rounded transition-colors"
                  >
                    {copied === 'liq1' ? '✓' : 'Copy'}
                  </button>
                </div>
                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono">
                  {"{{ product.featured_image | image_url: width: 300 | image_tag }}"}
                </code>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Legacy img_url filter</div>
                  <button
                    onClick={() => copy("{{ product.featured_image | img_url: '300x300' }}", 'liq2')}
                    className="text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 hover:text-white px-2.5 py-1 rounded transition-colors"
                  >
                    {copied === 'liq2' ? '✓' : 'Copy'}
                  </button>
                </div>
                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono">
                  {"{{ product.featured_image | img_url: '300x300' }}"}
                </code>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">With exact crop (center)</div>
                  <button
                    onClick={() => copy("{{ product.featured_image | img_url: '300x300', crop: 'center' }}", 'liq3')}
                    className="text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-300 hover:text-white px-2.5 py-1 rounded transition-colors"
                  >
                    {copied === 'liq3' ? '✓' : 'Copy'}
                  </button>
                </div>
                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono">
                  {"{{ product.featured_image | img_url: '300x300', crop: 'center' }}"}
                </code>
              </div>
            </div>
          </div>
        </>
      )}

      {!isValid && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-12 text-center text-gray-500 text-sm">
          Paste a Shopify CDN image URL above to see all size variants.
        </div>
      )}

      {/* Info section */}
      <div className="mt-10 text-sm text-gray-500 leading-relaxed space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-gray-300 font-semibold text-base mb-3">How Shopify Image Resizing Works</h2>
          <p className="mb-3">
            Shopify CDN images are resized by inserting a size suffix directly before the file extension. For example,{' '}
            <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">shirt.jpg</code>{' '}
            becomes <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">shirt_300x300.jpg</code>.
            Shopify&apos;s CDN handles the resize automatically — no server processing needed on your end.
          </p>
          <p>
            All sizes preserve the original aspect ratio unless you add a{' '}
            <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">_crop_center</code> modifier,
            which forces an exact crop. Use{' '}
            <code className="text-orange-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">_master</code> to always get
            the full-resolution original.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-gray-300 font-semibold text-base mb-3">Size Format Cheatsheet</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ['WxH', 'shirt_300x300.jpg', 'Max 300px wide AND tall, preserves ratio'],
              ['Wx', 'shirt_800x.jpg', 'Max 800px wide, height auto-scales'],
              ['xH', 'shirt_x600.jpg', 'Max 600px tall, width auto-scales'],
              ['WxH_crop_center', 'shirt_300x300_crop_center.jpg', 'Exact 300×300 — crops to center'],
              ['Named', 'shirt_grande.jpg', 'Preset: icon/small/medium/large/grande/master'],
              ['master', 'shirt_master.jpg', 'Original full-resolution image (no resize)'],
            ].map(([fmt, ex, note]) => (
              <div key={fmt} className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-3">
                <p className="text-orange-400 font-mono font-semibold text-sm mb-1">{fmt}</p>
                <p className="text-gray-400 font-mono text-xs mb-1 break-all">{ex}</p>
                <p className="text-gray-600 text-xs">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400/80 text-xs leading-relaxed">
          <strong className="text-blue-400">100% client-side:</strong> All URL transformations happen in your browser. No images are uploaded or processed on any server.
        </div>
      </div>
    </div>
  )
}
