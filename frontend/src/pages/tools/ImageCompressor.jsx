import { useState, useEffect, useRef, useCallback } from 'react'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageCompressor() {
  const [original, setOriginal] = useState(null)
  const [compressed, setCompressed] = useState(null)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState('')
  const [format, setFormat] = useState('jpeg')
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const canvasRef = useRef()

  useEffect(() => {
    document.title = 'Image Compressor — Compress JPG & PNG Online | OmniverseTools'
  }, [])

  function loadImage(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, GIF, etc.)')
      return
    }
    setError('')
    setCompressed(null)
    if (original) URL.revokeObjectURL(original.url)

    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight, size: file.size, name: file.name })
    }
    img.onerror = () => setError('Failed to load image.')
    img.src = url
  }

  const compress = useCallback(() => {
    if (!original) return
    setProcessing(true)
    setError('')

    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current
      let w = img.naturalWidth
      let h = img.naturalHeight

      const mw = parseInt(maxWidth, 10)
      if (mw > 0 && mw < w) {
        h = Math.round(h * (mw / w))
        w = mw
      }

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')

      if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
      } else {
        ctx.clearRect(0, 0, w, h)
      }
      ctx.drawImage(img, 0, 0, w, h)

      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg'
      const q = format === 'png' ? undefined : quality / 100

      canvas.toBlob(
        blob => {
          if (!blob) {
            setError('Compression failed. Your browser may not support this format.')
            setProcessing(false)
            return
          }
          if (compressed) URL.revokeObjectURL(compressed.url)
          const url = URL.createObjectURL(blob)
          setCompressed({ url, size: blob.size, w, h, format })
          setProcessing(false)
        },
        mimeType,
        q
      )
    }
    img.onerror = () => { setError('Failed to process image.'); setProcessing(false) }
    img.src = original.url
  }, [original, quality, maxWidth, format, compressed])

  function download() {
    if (!compressed) return
    const ext = compressed.format
    const baseName = original.file.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.download = `${baseName}-compressed.${ext}`
    a.href = compressed.url
    a.click()
  }

  function reset() {
    if (original) URL.revokeObjectURL(original.url)
    if (compressed) URL.revokeObjectURL(compressed.url)
    setOriginal(null)
    setCompressed(null)
    setQuality(80)
    setMaxWidth('')
    setFormat('jpeg')
    setError('')
  }

  const onDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    loadImage(e.dataTransfer.files[0])
  }, [original])

  const savings = compressed && original ? Math.round((1 - compressed.size / original.size) * 100) : 0
  const savingsPositive = savings > 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <canvas ref={canvasRef} className="hidden" />

      <h1 className="text-3xl font-bold text-white mb-2">Image Compressor</h1>
      <p className="text-gray-400 mb-8">
        Compress JPG, PNG, or WebP images using the Canvas API — 100% browser-based, nothing is uploaded.
      </p>

      {/* Drop zone */}
      {!original && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-6
            ${dragging ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-orange-500/60 bg-zinc-900'}`}
        >
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.5V19a.75.75 0 00.75.75h16.5A.75.75 0 0021 19v-2.5M16.5 3.75h.008v.008h-.008V3.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-gray-300 font-medium text-lg mb-1">Drop an image here</p>
          <p className="text-gray-500 text-sm">or click to browse — JPG, PNG, WebP, GIF supported</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => loadImage(e.target.files[0])}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Settings + preview */}
      {original && (
        <div className="space-y-6">
          {/* Original info bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={original.url}
              alt="Original preview"
              className="w-20 h-20 object-contain rounded-lg bg-zinc-800 border border-zinc-700 shrink-0"
            />
            <div className="text-sm flex-1">
              <div className="text-white font-medium mb-1 truncate">{original.name}</div>
              <div className="text-gray-400">
                {original.w} × {original.h} px &nbsp;·&nbsp; {formatSize(original.size)}
              </div>
            </div>
            <button
              onClick={reset}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg shrink-0"
            >
              Change image
            </button>
          </div>

          {/* Settings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Compression settings</h2>

            {/* Output format */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Output format</label>
              <div className="flex gap-2 flex-wrap">
                {[['jpeg', 'JPEG'], ['png', 'PNG (lossless)'], ['webp', 'WebP']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFormat(val)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      format === val
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider — only for lossy formats */}
            {format !== 'png' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Quality</label>
                  <span className="text-sm font-mono text-orange-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Smallest file</span>
                  <span>Best quality</span>
                </div>
              </div>
            )}

            {/* Max width */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Max width <span className="text-gray-600">(optional — leave blank to keep original)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={maxWidth}
                  onChange={e => setMaxWidth(e.target.value)}
                  placeholder={`${original.w}`}
                  className="w-36 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-gray-600"
                />
                <span className="text-gray-500 text-sm">px — height scaled proportionally</span>
              </div>
            </div>

            <button
              onClick={compress}
              disabled={processing}
              className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {processing ? 'Compressing…' : 'Compress Image'}
            </button>
          </div>

          {/* Result */}
          {compressed && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-white font-semibold">Result</h2>
                <button
                  onClick={download}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {compressed.format.toUpperCase()}
                </button>
              </div>

              {/* Before / after stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Original</div>
                  <div className="text-white font-semibold text-lg">{formatSize(original.size)}</div>
                  <div className="text-gray-500 text-xs mt-1">{original.w} × {original.h} px</div>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                  <div className={`text-2xl font-bold ${savingsPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {savingsPositive ? `−${savings}%` : `+${Math.abs(savings)}%`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {savingsPositive ? 'size reduction' : 'size increase'}
                  </div>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Compressed</div>
                  <div className="text-white font-semibold text-lg">{formatSize(compressed.size)}</div>
                  <div className="text-gray-500 text-xs mt-1">{compressed.w} × {compressed.h} px</div>
                </div>
              </div>

              {!savingsPositive && (
                <div className="bg-amber-900/30 border border-amber-700 text-amber-300 rounded-xl px-4 py-3 text-sm">
                  The compressed file is larger than the original. Try increasing quality, switching to JPEG, or the original is already well-optimised.
                </div>
              )}

              {/* Preview */}
              <div>
                <div className="text-sm text-gray-400 mb-3">Compressed preview</div>
                <img
                  src={compressed.url}
                  alt="Compressed preview"
                  className="max-w-full rounded-xl border border-zinc-700 bg-zinc-800"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!original && !error && (
        <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-gray-300 font-semibold mb-3 text-base">How it works</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-orange-400">1.</span> Drop an image or click to browse — JPG, PNG, WebP all accepted.</li>
            <li className="flex gap-2"><span className="text-orange-400">2.</span> Choose your output format and quality level (or leave at the default 80%).</li>
            <li className="flex gap-2"><span className="text-orange-400">3.</span> Optionally set a max width to resize the image proportionally.</li>
            <li className="flex gap-2"><span className="text-orange-400">4.</span> Click Compress — the browser's Canvas API handles everything locally.</li>
            <li className="flex gap-2"><span className="text-orange-400">5.</span> Download the result. Nothing is ever uploaded to any server.</li>
          </ul>
        </div>
      )}
    </div>
  )
}
