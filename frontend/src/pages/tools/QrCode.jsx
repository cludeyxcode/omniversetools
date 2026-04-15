import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

export default function QrCode() {
  const [text, setText] = useState('https://omniversetools.com')
  const [size, setSize] = useState(300)
  const canvasRef = useRef(null)

  useEffect(() => {
    document.title = 'Free QR Code Generator Online | OmniverseTools'
  }, [])

  useEffect(() => {
    if (!text.trim()) return
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
  }, [text, size])

  function download() {
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">QR Code Generator</h1>
      <p className="text-gray-400 mb-8">
        Generate a QR code from any URL or text instantly — free, no signup required.
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1">URL or Text</label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter URL or text..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Size: {size}px</label>
          <input
            type="range"
            min="128"
            max="512"
            step="8"
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="rounded-lg border border-zinc-700" />
        <button
          onClick={download}
          disabled={!text.trim()}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:opacity-40 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Download PNG
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This free QR code generator works entirely in your browser using the <em>qrcode</em> library.
          Enter any URL, email, phone number, or plain text and instantly get a scannable QR code.
          Download it as a PNG image at your chosen resolution. No data is sent to any server.
        </p>
      </div>
    </div>
  )
}
