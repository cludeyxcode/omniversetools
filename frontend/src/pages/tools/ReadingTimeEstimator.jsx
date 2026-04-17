import { useState, useEffect, useMemo } from 'react'

const PRESETS = [
  { label: 'Slow', wpm: 150 },
  { label: 'Average', wpm: 238 },
  { label: 'Fast', wpm: 350 },
  { label: 'Speed reader', wpm: 600 },
]

function estimateTime(wordCount, wpm) {
  if (!wordCount || !wpm) return { minutes: 0, seconds: 0, totalSec: 0 }
  const totalSec = Math.round((wordCount / wpm) * 60)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return { minutes, seconds, totalSec }
}

function formatDuration(minutes, seconds) {
  if (minutes === 0) return `${seconds}s`
  if (seconds === 0) return `${minutes} min`
  return `${minutes} min ${seconds}s`
}

export default function ReadingTimeEstimator() {
  const [text, setText] = useState('')
  const [wpm, setWpm] = useState(238)
  const [rawWpm, setRawWpm] = useState('238')

  useEffect(() => {
    document.title = 'Reading Time Estimator — How Long to Read? | OmniverseTools'
  }, [])

  const wordCount = useMemo(() => {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).length
  }, [text])

  const charCount = text.length
  const sentenceCount = useMemo(() => {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return (text.match(/[.!?]+/g) || []).length
  }, [text])

  const readTime = useMemo(() => estimateTime(wordCount, wpm), [wordCount, wpm])
  const speakTime = useMemo(() => estimateTime(wordCount, 130), [wordCount])

  function handleWpmInput(val) {
    setRawWpm(val)
    const n = parseInt(val, 10)
    if (!isNaN(n) && n >= 10 && n <= 2000) setWpm(n)
  }

  function handleWpmBlur() {
    const n = parseInt(rawWpm, 10)
    if (isNaN(n) || n < 10) { setWpm(10); setRawWpm('10') }
    else if (n > 2000) { setWpm(2000); setRawWpm('2000') }
    else { setWpm(n); setRawWpm(String(n)) }
  }

  const stats = [
    { label: 'Reading time', value: wordCount ? formatDuration(readTime.minutes, readTime.seconds) : '—' },
    { label: 'Word count', value: wordCount.toLocaleString() },
    { label: 'Characters', value: charCount.toLocaleString() },
    { label: 'Sentences', value: sentenceCount.toLocaleString() },
    { label: 'Speaking time', value: wordCount ? formatDuration(speakTime.minutes, speakTime.seconds) : '—' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Reading Time Estimator</h1>
      <p className="text-gray-400 mb-6">
        Paste any article or text to estimate how long it takes to read at your pace. Adjust the WPM to match your reading speed.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stats.map(c => (
          <div key={c.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-orange-400 truncate">{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* WPM controls */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <span className="text-sm text-gray-300 font-medium">Reading speed</span>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => { setWpm(p.wpm); setRawWpm(String(p.wpm)) }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  wpm === p.wpm
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:text-white'
                }`}
              >
                {p.label} ({p.wpm} WPM)
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-400">Custom WPM</label>
            <input
              type="number"
              min={10}
              max={2000}
              value={rawWpm}
              onChange={e => handleWpmInput(e.target.value)}
              onBlur={handleWpmBlur}
              className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>
        <input
          type="range"
          min={10}
          max={1000}
          value={Math.min(wpm, 1000)}
          onChange={e => { const v = parseInt(e.target.value); setWpm(v); setRawWpm(String(v)) }}
          className="w-full accent-orange-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>10 WPM</span>
          <span>1000 WPM</span>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your article, blog post, or any text here…"
        rows={14}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none text-sm leading-relaxed mb-3"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Breakdown table */}
      {wordCount > 0 && (
        <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-700">
            <span className="text-sm font-semibold text-gray-300">Reading time by speed</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-gray-500 font-medium px-4 py-2.5">Speed</th>
                <th className="text-right text-gray-500 font-medium px-4 py-2.5">WPM</th>
                <th className="text-right text-gray-500 font-medium px-4 py-2.5">Reading time</th>
              </tr>
            </thead>
            <tbody>
              {PRESETS.map(p => {
                const t = estimateTime(wordCount, p.wpm)
                return (
                  <tr key={p.label} className={`border-b border-zinc-800 last:border-0 transition-colors ${wpm === p.wpm ? 'bg-orange-500/10' : 'hover:bg-zinc-800/50'}`}>
                    <td className="px-4 py-2.5 text-white">{p.label}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-right">{p.wpm}</td>
                    <td className="px-4 py-2.5 text-orange-400 font-semibold text-right">{formatDuration(t.minutes, t.seconds)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This reading time estimator calculates how long it takes to read any text based on your
          words-per-minute reading speed. The average adult reads at around 238 WPM for non-fiction
          and 260 WPM for fiction. Speaking time is calculated at 130 WPM — a typical conversational
          pace — useful for estimating podcast or speech duration. All processing happens entirely
          in your browser; no text is sent to any server.
        </p>
      </div>
    </div>
  )
}
