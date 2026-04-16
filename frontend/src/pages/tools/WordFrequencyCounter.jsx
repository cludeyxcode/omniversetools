import { useState, useEffect, useMemo } from 'react'

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','it','its','was','are','were','be','been','being',
  'have','has','had','do','does','did','will','would','could','should',
  'may','might','shall','can','this','that','these','those','i','me',
  'my','we','our','you','your','he','his','she','her','they','them',
  'their','what','which','who','whom','how','when','where','why','not',
  'no','so','if','as','up','out','about','into','than','then','there',
  'also','more','all','any','each','just','like','over','such','other',
])

function getFrequencies(text, caseSensitive, minLen, filterStop) {
  if (!text.trim()) return []
  const words = text.match(/[a-zA-ZÀ-ÿ'-]+/g) || []
  const freq = {}
  for (let w of words) {
    const key = caseSensitive ? w : w.toLowerCase()
    if (key.length < minLen) continue
    if (filterStop && STOP_WORDS.has(key.toLowerCase())) continue
    freq[key] = (freq[key] || 0) + 1
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word, count]) => ({ word, count }))
}

export default function WordFrequencyCounter() {
  const [text, setText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [minLen, setMinLen] = useState(1)
  const [filterStop, setFilterStop] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    document.title = 'Word Frequency Counter — Rank Words by Occurrence | OmniverseTools'
  }, [])

  const results = useMemo(
    () => getFrequencies(text, caseSensitive, minLen, filterStop),
    [text, caseSensitive, minLen, filterStop]
  )

  const totalWords = useMemo(() => {
    if (!text.trim()) return 0
    const words = text.match(/[a-zA-ZÀ-ÿ'-]+/g) || []
    return words.filter(w => {
      const key = w.toLowerCase()
      if (w.length < minLen) return false
      if (filterStop && STOP_WORDS.has(key)) return false
      return true
    }).length
  }, [text, minLen, filterStop])

  const maxCount = results[0]?.count || 1
  const displayed = showAll ? results : results.slice(0, 50)

  function copyResults() {
    const tsv = results.map((r, i) => `${i + 1}\t${r.word}\t${r.count}`).join('\n')
    navigator.clipboard.writeText(tsv)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Word Frequency Counter</h1>
      <p className="text-gray-400 mb-6">
        Paste any text to see every word ranked by how often it appears — useful for writers, SEO, and content analysis.
      </p>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setShowAll(false) }}
        placeholder="Paste your article, blog post, or any text here…"
        rows={8}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none text-sm leading-relaxed mb-4"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
            className="accent-orange-500 w-4 h-4"
          />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterStop}
            onChange={e => setFilterStop(e.target.checked)}
            className="accent-orange-500 w-4 h-4"
          />
          Hide common stop words
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300">
          Min. length
          <input
            type="number"
            min={1}
            max={20}
            value={minLen}
            onChange={e => setMinLen(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-orange-500 text-sm"
          />
          chars
        </label>
        <div className="ml-auto flex gap-2">
          {results.length > 0 && (
            <button
              onClick={copyResults}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy Results'}
            </button>
          )}
          <button
            onClick={() => { setText(''); setShowAll(false) }}
            disabled={!text}
            className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Unique words', value: results.length },
            { label: 'Total words (filtered)', value: totalWords },
            { label: 'Top word', value: `"${results[0].word}" ×${results[0].count}` },
          ].map(c => (
            <div key={c.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-orange-400 truncate">{c.value}</div>
              <div className="text-xs text-gray-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Results table */}
      {results.length > 0 ? (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left text-gray-500 font-medium px-4 py-3 w-12">#</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Word</th>
                <th className="text-right text-gray-500 font-medium px-4 py-3 w-20">Count</th>
                <th className="text-right text-gray-500 font-medium px-4 py-3 w-16">%</th>
                <th className="px-4 py-3 w-40 hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(({ word, count }, i) => {
                const pct = totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : '0.0'
                const barPct = Math.round((count / maxCount) * 100)
                return (
                  <tr
                    key={word}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-600 font-mono">{i + 1}</td>
                    <td className="px-4 py-2.5 text-white font-mono font-medium">{word}</td>
                    <td className="px-4 py-2.5 text-orange-400 font-bold text-right">{count}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-right">{pct}%</td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {results.length > 50 && (
            <div className="px-4 py-3 border-t border-zinc-700 text-center">
              <button
                onClick={() => setShowAll(v => !v)}
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                {showAll
                  ? `Show top 50 only`
                  : `Show all ${results.length} words`}
              </button>
            </div>
          )}
        </div>
      ) : text.trim() ? (
        <div className="text-center py-10 text-gray-500">No words found matching current filters.</div>
      ) : null}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This free word frequency counter analyses any text and ranks every word by how many times
          it appears. It's useful for SEO keyword density analysis, spotting overused words in
          writing, and content research. Toggle "hide stop words" to filter out common English words
          (the, and, is, …) so you can focus on meaningful terms. Results can be copied as
          tab-separated values (rank, word, count) for pasting into a spreadsheet.
          All processing runs entirely in your browser — no data is sent anywhere.
        </p>
      </div>
    </div>
  )
}
