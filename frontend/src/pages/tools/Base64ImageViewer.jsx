import { useState, useEffect } from 'react'

function parseDataUri(raw) {
  const trimmed = raw.trim()
  const match = trimmed.match(/^data:([^;]+);base64,(.+)$/s)
  if (!match) return null
  return { mimeType: match[1], base64: match[2].trim(), dataUrl: trimmed }
}

function estimateBytes(base64) {
  const padding = (base64.match(/=+$/) || [''])[0].length
  return Math.floor((base64.length * 3) / 4) - padding
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function Base64ImageViewer() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [imgDims, setImgDims] = useState(null)

  useEffect(() => {
    document.title = 'Base64 Image Data URI Viewer | OmniverseTools'
  }, [])

  function handleInput(val) {
    setInput(val)
    setImgDims(null)
    if (!val.trim()) {
      setParsed(null)
      setError('')
      return
    }
    const result = parseDataUri(val)
    if (!result) {
      setError('Not a valid data URI. It should start with data:image/…;base64,…')
      setParsed(null)
    } else if (!result.mimeType.startsWith('image/')) {
      setError(`MIME type "${result.mimeType}" is not an image type.`)
      setParsed(null)
    } else {
      setError('')
      setParsed(result)
    }
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  function clear() {
    setInput('')
    setParsed(null)
    setError('')
    setImgDims(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Base64 Image Data URI Viewer</h1>
      <p className="text-gray-400 mb-6">
        Paste a <code className="bg-zinc-800 px-1 rounded text-gray-300">data:image/…;base64,…</code> URI
        to preview the image and inspect its metadata — all in your browser.
      </p>

      {/* Input area */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Paste your data URI here</label>
          {input && (
            <button
              onClick={clear}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              ✕ Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs text-green-300 font-mono resize-y focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600"
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-6">
          {/* Image preview */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Preview</span>
              <span className="text-xs text-gray-500">{parsed.mimeType}</span>
            </div>
            <div className="p-6 flex items-center justify-center bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23374151%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23374151%22%2F%3E%3C%2Fsvg%3E')]">
              <img
                src={parsed.dataUrl}
                alt="Decoded preview"
                className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                onLoad={e => setImgDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
              <span className="text-sm font-medium text-gray-300">Details</span>
            </div>
            <div className="divide-y divide-zinc-800">
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">MIME type</span>
                <span className="text-gray-200 font-mono">{parsed.mimeType}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">Decoded size (approx.)</span>
                <span className="text-gray-200">{formatSize(estimateBytes(parsed.base64))}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">Base64 string length</span>
                <span className="text-gray-200">{parsed.base64.length.toLocaleString()} chars</span>
              </div>
              {imgDims && (
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-gray-500">Dimensions</span>
                  <span className="text-gray-200">{imgDims.w} × {imgDims.h} px</span>
                </div>
              )}
            </div>
          </div>

          {/* Copy actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => copy(parsed.dataUrl, 'dataUrl')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500 text-sm text-gray-300 hover:text-white rounded-xl px-4 py-3 transition-all text-center"
            >
              {copied === 'dataUrl' ? '✓ Copied!' : 'Copy Data URI'}
            </button>
            <button
              onClick={() => copy(parsed.base64, 'base64')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500 text-sm text-gray-300 hover:text-white rounded-xl px-4 py-3 transition-all text-center"
            >
              {copied === 'base64' ? '✓ Copied!' : 'Copy Base64 Only'}
            </button>
            <button
              onClick={() => copy(`<img src="${parsed.dataUrl}" alt="" />`, 'html')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500 text-sm text-gray-300 hover:text-white rounded-xl px-4 py-3 transition-all text-center"
            >
              {copied === 'html' ? '✓ Copied!' : 'Copy as <img> Tag'}
            </button>
          </div>

          {/* CSS usage snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">CSS background usage</label>
              <button
                onClick={() => copy(`background-image: url("${parsed.dataUrl}");`, 'css')}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded transition-colors"
              >
                {copied === 'css' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-yellow-300 break-all">
              background-image: url("<span className="text-green-400">{parsed.dataUrl.slice(0, 60)}…</span>");
            </div>
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {!input && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-gray-500 text-sm">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-gray-400 font-medium mb-1">Paste any data URI to get started</p>
          <p>The image will render instantly — nothing leaves your browser.</p>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          A Base64 data URI embeds an image directly in a document as a text string, avoiding an extra
          HTTP request. This tool decodes and renders the image so you can verify it looks correct,
          check its dimensions and file size, and copy it in the format you need. It's a companion to
          the{' '}
          <a href="/tools/image-to-base64" className="text-orange-400 hover:text-orange-300 underline">
            Image to Base64 encoder
          </a>
          . All processing happens in your browser — the URI is never transmitted anywhere.
        </p>
      </div>
    </div>
  )
}
