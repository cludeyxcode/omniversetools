import { useState, useEffect } from 'react'

function analyze(text) {
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) || []).length
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(p => p.trim()).length || 1
  const readTime = Math.max(1, Math.ceil(words / 200))
  return { words, chars, charsNoSpaces, sentences, paragraphs, readTime }
}

export default function WordCounter() {
  const [text, setText] = useState('')

  useEffect(() => {
    document.title = 'Word Counter & Character Counter Online | OmniverseTools'
  }, [])

  const stats = analyze(text)

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Chars (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read time', value: `${stats.readTime} min` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Word & Character Counter</h1>
      <p className="text-gray-400 mb-6">
        Count words, characters, sentences, and paragraphs in any text — instantly, online, free.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {cards.map(c => (
          <div key={c.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        rows={18}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none text-base leading-relaxed"
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="bg-zinc-700 hover:bg-gray-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          disabled={!text}
          className="bg-zinc-700 hover:bg-gray-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Copy Text
        </button>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This free online word counter instantly tallies words, characters (with and without spaces),
          sentences, paragraphs, and estimated reading time as you type. Reading time is estimated at
          200 words per minute — a common average for adult readers. All processing happens in your browser.
        </p>
      </div>
    </div>
  )
}
