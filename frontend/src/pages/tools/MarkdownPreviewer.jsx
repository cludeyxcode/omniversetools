import { useState, useEffect, useMemo } from 'react'
import { marked } from 'marked'

const SAMPLE = `# Hello, Markdown!

**Bold** and *italic* text, plus \`inline code\`.

## Lists

- Item one
- Item two
  - Nested item

1. First
2. Second

## Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Blockquote

> "The best way to predict the future is to create it."

## Link & Image

[OmniverseTools](https://omniversetools.com)
`

export default function MarkdownPreviewer() {
  const [input, setInput] = useState(SAMPLE)
  const [view, setView] = useState('split')

  useEffect(() => {
    document.title = 'Markdown Previewer Online | OmniverseTools'
  }, [])

  const html = useMemo(() => {
    try {
      return marked.parse(input, { breaks: true })
    } catch {
      return '<p style="color:#f87171">Parse error</p>'
    }
  }, [input])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Markdown Previewer</h1>
      <p className="text-gray-400 mb-6">
        Write Markdown on the left, see the live rendered preview on the right.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          {['split', 'editor', 'preview'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${view === v ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(input)}
          className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Copy Markdown
        </button>
        <button
          onClick={() => setInput('')}
          className="bg-zinc-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Clear
        </button>
      </div>

      <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {view !== 'preview' && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Markdown</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your Markdown here..."
              rows={28}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>
        )}
        {view !== 'editor' && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Preview</label>
            <div
              className="w-full min-h-[28rem] bg-zinc-900 border border-zinc-700 rounded-lg px-6 py-4 prose prose-invert prose-sm max-w-none overflow-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      <style>{`
        .prose h1,.prose h2,.prose h3 { color: #f3f4f6; margin-top: 1.25em; margin-bottom: 0.5em; font-weight: 700; }
        .prose h1 { font-size: 1.75rem; border-bottom: 1px solid #374151; padding-bottom: 0.3em; }
        .prose h2 { font-size: 1.35rem; border-bottom: 1px solid #374151; padding-bottom: 0.2em; }
        .prose h3 { font-size: 1.1rem; }
        .prose p { color: #d1d5db; margin: 0.75em 0; line-height: 1.7; }
        .prose a { color: #a78bfa; text-decoration: underline; }
        .prose strong { color: #f9fafb; font-weight: 700; }
        .prose em { color: #e5e7eb; }
        .prose code { background: #1f2937; color: #86efac; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.85em; }
        .prose pre { background: #111827; border: 1px solid #374151; border-radius: 8px; padding: 1em; overflow-x: auto; }
        .prose pre code { background: none; padding: 0; color: #86efac; }
        .prose blockquote { border-left: 4px solid #6d28d9; padding-left: 1em; color: #9ca3af; margin: 1em 0; font-style: italic; }
        .prose ul,.prose ol { color: #d1d5db; padding-left: 1.5em; margin: 0.75em 0; }
        .prose li { margin: 0.25em 0; }
        .prose hr { border-color: #374151; margin: 1.5em 0; }
        .prose table { width: 100%; border-collapse: collapse; }
        .prose th,.prose td { border: 1px solid #374151; padding: 0.5em 0.75em; color: #d1d5db; }
        .prose th { background: #1f2937; font-weight: 600; }
      `}</style>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Markdown is a lightweight markup language for formatting plain text. This previewer
          uses the <code className="bg-zinc-800 px-1 rounded text-gray-300">marked</code> library
          and renders entirely in your browser — nothing is sent to a server.
        </p>
      </div>
    </div>
  )
}
