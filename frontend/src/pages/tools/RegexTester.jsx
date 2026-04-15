import { useState, useEffect, useMemo } from 'react'

const FLAG_OPTIONS = [
  { flag: 'g', label: 'Global (g)', desc: 'Find all matches' },
  { flag: 'i', label: 'Case insensitive (i)', desc: 'Ignore case' },
  { flag: 'm', label: 'Multiline (m)', desc: '^ and $ match line starts/ends' },
  { flag: 's', label: 'Dot all (s)', desc: '. matches newlines' },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)')
  const [flags, setFlags] = useState(['g', 'i'])
  const [testStr, setTestStr] = useState('Send email to support@example.com or hello@omniversetools.com')

  useEffect(() => {
    document.title = 'Regex Tester Online | Regular Expression Tester | OmniverseTools'
  }, [])

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], error: '', highlighted: testStr }
    try {
      const re = new RegExp(pattern, flags.join(''))
      const allMatches = []
      let m
      const reForMatches = new RegExp(pattern, flags.includes('g') ? flags.join('') : flags.join('') + 'g')
      while ((m = reForMatches.exec(testStr)) !== null) {
        allMatches.push({ index: m.index, length: m[0].length, value: m[0], groups: m.slice(1) })
        if (!flags.includes('g')) break
      }

      // Build highlighted HTML
      let result = []
      let pos = 0
      for (const match of allMatches) {
        if (match.index > pos) result.push({ text: testStr.slice(pos, match.index), highlight: false })
        result.push({ text: match.value, highlight: true })
        pos = match.index + match.length
      }
      if (pos < testStr.length) result.push({ text: testStr.slice(pos), highlight: false })

      return { matches: allMatches, error: '', highlighted: result }
    } catch (e) {
      return { matches: [], error: e.message, highlighted: [{ text: testStr, highlight: false }] }
    }
  }, [pattern, flags, testStr])

  function toggleFlag(f) {
    setFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Regex Tester</h1>
      <p className="text-gray-400 mb-6">
        Test and debug regular expressions online with live match highlighting — free regex tester.
      </p>

      <div className="space-y-4">
        {/* Pattern */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <label className="block text-sm text-gray-400 mb-2">Regular Expression</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xl font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 bg-zinc-800 border border-gray-600 text-orange-300 font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            />
            <span className="text-gray-500 text-xl font-mono">/{flags.join('')}</span>
          </div>
          {error && <div className="mt-2 text-red-400 text-sm">❌ {error}</div>}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-2">
          {FLAG_OPTIONS.map(({ flag, label }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${flags.includes(flag) ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Test string */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Test String</label>
          <textarea
            value={testStr}
            onChange={e => setTestStr(e.target.value)}
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500 resize-none"
          />
        </div>

        {/* Highlighted result */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Match Preview — <span className="text-orange-400 font-semibold">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
          </label>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 font-mono text-sm leading-relaxed min-h-[60px] whitespace-pre-wrap break-all">
            {Array.isArray(highlighted)
              ? highlighted.map((part, i) =>
                  part.highlight
                    ? <mark key={i} className="bg-orange-500/40 text-orange-200 rounded px-0.5">{part.text}</mark>
                    : <span key={i} className="text-gray-300">{part.text}</span>
                )
              : <span className="text-gray-300">{highlighted}</span>
            }
          </div>
        </div>

        {/* Match details */}
        {matches.length > 0 && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Match Details</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm">
                  <div className="flex gap-4">
                    <span className="text-gray-500">#{i + 1}</span>
                    <span className="text-orange-300 font-mono">"{m.value}"</span>
                    <span className="text-gray-500">index: {m.index}</span>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="mt-1 text-gray-400 text-xs">
                      Groups: {m.groups.map((g, gi) => <span key={gi} className="bg-zinc-800 px-1.5 py-0.5 rounded ml-1 font-mono">{g ?? 'undefined'}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          This free online regex tester uses JavaScript's built-in <code className="bg-zinc-800 px-1 rounded text-gray-300">RegExp</code> engine.
          It supports global, case-insensitive, multiline, and dot-all flags, shows all matches with their index positions,
          and highlights capture groups. Results update in real time as you type.
        </p>
      </div>
    </div>
  )
}
