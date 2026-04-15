import { useState, useEffect } from 'react'

export default function TextSorter() {
  const [input, setInput] = useState('banana\napple\ncherry\napple\ndate\nbanana\nfig')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Text Line Sorter & Deduplicator Online | OmniverseTools'
  }, [])

  function process(op) {
    const lines = input.split('\n')
    let result
    switch (op) {
      case 'asc':       result = [...lines].sort((a, b) => a.localeCompare(b)); break
      case 'desc':      result = [...lines].sort((a, b) => b.localeCompare(a)); break
      case 'asc-ci':    result = [...lines].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); break
      case 'desc-ci':   result = [...lines].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase())); break
      case 'reverse':   result = [...lines].reverse(); break
      case 'shuffle':   result = [...lines].sort(() => Math.random() - 0.5); break
      case 'dedup':     result = [...new Set(lines)]; break
      case 'dedup-ci':  result = lines.filter((l, i, a) => a.findIndex(x => x.toLowerCase() === l.toLowerCase()) === i); break
      case 'trim':      result = lines.map(l => l.trim()).filter(Boolean); break
      case 'length-asc': result = [...lines].sort((a, b) => a.length - b.length); break
      case 'length-desc': result = [...lines].sort((a, b) => b.length - a.length); break
      default:          result = lines
    }
    setOutput(result.join('\n'))
    setCopied(false)
  }

  const lineCount = input.split('\n').filter(Boolean).length

  const actions = [
    { label: 'A → Z', op: 'asc' },
    { label: 'Z → A', op: 'desc' },
    { label: 'A → Z (ignore case)', op: 'asc-ci' },
    { label: 'Z → A (ignore case)', op: 'desc-ci' },
    { label: 'Reverse order', op: 'reverse' },
    { label: 'Shuffle randomly', op: 'shuffle' },
    { label: 'Remove duplicates', op: 'dedup' },
    { label: 'Remove duplicates (ignore case)', op: 'dedup-ci' },
    { label: 'Trim & remove blank lines', op: 'trim' },
    { label: 'Shortest first', op: 'length-asc' },
    { label: 'Longest first', op: 'length-desc' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Text Sorter & Line Tools</h1>
      <p className="text-gray-400 mb-6">
        Sort lines alphabetically, remove duplicates, reverse, shuffle, or trim — paste your text and pick an action.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input — {lineCount} line{lineCount !== 1 ? 's' : ''}</label>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput('') }}
            rows={16}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
            placeholder="Paste lines of text here..."
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Output</label>
            {output && (
              <button
                onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            rows={16}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-green-300 font-mono resize-none focus:outline-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map(({ label, op }) => (
          <button
            key={op}
            onClick={() => process(op)}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Useful for cleaning up lists, sorting CSV columns before pasting, deduplicating log output,
          or randomising a list of names. Each line of your input is treated as a separate item.
          Everything runs in your browser — nothing is sent to a server.
        </p>
      </div>
    </div>
  )
}
