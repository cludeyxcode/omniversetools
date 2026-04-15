import { useState, useEffect, useRef } from 'react'

export default function ImageToBase64() {
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    document.title = 'Image to Base64 Converter Online | OmniverseTools'
  }, [])

  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setResult({
        dataUrl: e.target.result,
        base64: e.target.result.split(',')[1],
        mimeType: file.type,
        name: file.name,
        size: file.size,
      })
      setCopied(false)
    }
    reader.readAsDataURL(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  function copy(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Image to Base64</h1>
      <p className="text-gray-400 mb-6">
        Convert any image to a Base64 data URL — drag & drop or click to upload. 100% browser-based.
      </p>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-6
          ${dragging ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-orange-500/60 bg-zinc-900'}`}
      >
        <div className="text-4xl mb-3">🖼️</div>
        <p className="text-gray-300 font-medium">Drop an image here, or click to browse</p>
        <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF, SVG, WebP — any image format</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => processFile(e.target.files[0])}
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center gap-4">
            <img
              src={result.dataUrl}
              alt="Preview"
              className="w-20 h-20 object-contain rounded-lg bg-zinc-800 border border-zinc-700"
            />
            <div className="text-sm text-gray-400">
              <div className="text-white font-medium mb-1">{result.name}</div>
              <div>{result.mimeType} · {formatSize(result.size)}</div>
              <div className="text-gray-500 mt-1">Base64 size: {formatSize(result.base64.length)}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Data URL (src-ready)</label>
              <div className="flex gap-2">
                <button
                  onClick={() => copy(result.dataUrl)}
                  className="text-xs bg-zinc-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy Data URL'}
                </button>
                <button
                  onClick={() => copy(result.base64)}
                  className="text-xs bg-zinc-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Copy Base64 only
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={result.dataUrl}
              rows={6}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs text-green-300 font-mono resize-none focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">HTML usage</label>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-yellow-300 break-all">
              {'<img src="'}
              <span className="text-green-400">{result.dataUrl.slice(0, 60)}…</span>
              {'" alt="image" />'}
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Base64-encoded images can be embedded directly in HTML, CSS, or JSON without a separate
          file request. Useful for email templates, small icons, or offline-capable apps. The image
          is read using the browser's <code className="bg-zinc-800 px-1 rounded text-gray-300">FileReader</code> API
          — nothing is uploaded to any server.
        </p>
      </div>
    </div>
  )
}
