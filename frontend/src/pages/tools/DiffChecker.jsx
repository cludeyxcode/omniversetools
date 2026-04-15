import { useState, useEffect, useMemo } from 'react'
import * as Diff from 'diff'

const SAMPLE_A = `The quick brown fox
jumps over the lazy dog.
Hello, world!
This line stays the same.
Old line to be removed.`

const SAMPLE_B = `The quick brown fox
leaps over the lazy cat.
Hello, world!
This line stays the same.
New line was added here.`

export default function DiffChecker() {
  const [left, setLeft] = useState(SAMPLE_A)
  const [right, setRight] = useState(SAMPLE_B)
  const [mode, setMode] = useState('lines')

  useEffect(() => {
    document.title = 'Text Diff Checker Online | OmniverseTools'
  }, [])

  const diff = useMemo(() => {
    if (mode === 'lines') return Diff.diffLines(left, right)
    if (mode === 'words') return Diff.diffWords(left, right)
    return Diff.diffChars(left, right)
  }, [left, right, mode])

  const stats = useMemo(() => {
    let added = 0, removed = 0
    diff.forEach(part => {
      const count = mode === 'lines'
        ? part.value.split('\n').filter(Boolean).length
        : part.value.length
      if (part.added) added += count
      if (part.removed) removed += count
    })
    return { added, removed }
  }, [diff, mode])

  function renderDiff() {
    if (mode === 'lines') {
      return diff.map((part, i) => {
        const lines = part.value.split('\n').filter((l, idx, arr) => !(idx === arr.length - 1 && l === ''))
        return lines.map((line, j) => (
          <div
            key={`${i}-${j}`}
            className={`font-mono text-sm px-3 py-0.5 whitespace-pre-wrap break-all ${
              part.added ? 'bg-green-900/40 text-green-300' :
              part.removed ? 'bg-red-900/40 text-red-300' :
              'text-gray-400'
            }`}
          >
            <span className={`select-none mr-3 text-xs ${part.added ? 'text-green-500' : part.removed ? 'text-red-500' : 'text-gray-600'}`}>
              {part.added ? '+' : part.removed ? '−' : ' '}
            </span>
            {line || ' '}
          </div>
        ))
      })
    }

    return (
      <div className="font-mono text-sm px-3 py-3 whitespace-pre-wrap break-all text-gray-300 leading-relaxed">
        {diff.map((part, i) => (
          <span
            key={i}
            className={
              part.added ? 'bg-green-900/50 text-green-300 rounded' :
              part.removed ? 'bg-red-900/50 text-red-300 rounded line-through' :
              ''
            }
          >
            {part.value}
          </span>
        ))}
      </div>
    )
  }

  const identical = diff.every(p => !p.added && !p.removed)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Text Diff Checker</h1>
      <p className="text-gray-400 mb-6">
        Compare two blocks of text and highlight the differences — instant, browser-based.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          {[['lines', 'Line diff'], ['words', 'Word diff'], ['chars', 'Char diff']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === v ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
        {!identical && (
          <div className="flex gap-3 text-sm">
            <span className="text-green-400">+{stats.added} added</span>
            <span className="text-red-400">−{stats.removed} removed</span>
          </div>
        )}
        {identical && left && (
          <span className="text-gray-400 text-sm">✓ Texts are identical</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Original</label>
          <textarea
            value={left}
            onChange={e => setLeft(e.target.value)}
            rows={12}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-red-500/60 resize-none"
            placeholder="Paste original text here..."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Modified</label>
          <textarea
            value={right}
            onChange={e => setRight(e.target.value)}
            rows={12}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-green-500/60 resize-none"
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      {(left || right) && (
        <div className="bg-zinc-950 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-700 text-xs text-gray-500 font-medium uppercase tracking-wide">
            Diff Output
          </div>
          <div className="overflow-auto max-h-[500px]">
            {renderDiff()}
          </div>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Paste two versions of text to see exactly what changed. Line diff is best for code or
          structured content; word and char diffs are better for prose. All comparison happens in
          your browser using the <code className="bg-zinc-800 px-1 rounded text-gray-300">diff</code> library.
        </p>
      </div>
    </div>
  )
}
