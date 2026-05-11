import { useState, useEffect } from 'react'

const DELIMITERS = [
  { label: 'Auto-detect', value: 'auto' },
  { label: 'Tab (TSV)', value: '\t' },
  { label: 'Comma (CSV)', value: ',' },
  { label: 'Semicolon', value: ';' },
  { label: 'Pipe ( | )', value: '|' },
]

const ALIGNMENTS = ['left', 'center', 'right', 'none']

function detectDelimiter(text) {
  const firstLine = text.split('\n').find(l => l.trim()) || ''
  const counts = {
    '\t': (firstLine.match(/\t/g) || []).length,
    ',':  (firstLine.match(/,/g)  || []).length,
    ';':  (firstLine.match(/;/g)  || []).length,
    '|':  (firstLine.match(/\|/g) || []).length,
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function parseRows(text, delim) {
  const d = delim === 'auto' ? detectDelimiter(text) : delim
  return text
    .split('\n')
    .map(line => line.split(d).map(cell => cell.trim()))
    .filter(row => row.some(c => c !== ''))
}

function buildMarkdownTable(rows, alignments, hasHeader) {
  if (!rows.length) return ''
  const colCount = Math.max(...rows.map(r => r.length))
  const padded = rows.map(r => {
    const copy = [...r]
    while (copy.length < colCount) copy.push('')
    return copy
  })

  const colWidths = Array.from({ length: colCount }, (_, ci) =>
    Math.max(3, ...padded.map(r => (r[ci] || '').length))
  )

  function renderRow(row) {
    return '| ' + row.map((cell, ci) => (cell || '').padEnd(colWidths[ci])).join(' | ') + ' |'
  }

  function renderSep() {
    return '| ' + colWidths.map((w, ci) => {
      const al = alignments[ci] || 'none'
      const dashes = '-'.repeat(w)
      if (al === 'center') return ':' + dashes.slice(1, -1) + ':'
      if (al === 'left')   return ':' + dashes.slice(1)
      if (al === 'right')  return dashes.slice(0, -1) + ':'
      return dashes
    }).join(' | ') + ' |'
  }

  if (hasHeader && padded.length >= 1) {
    const [header, ...body] = padded
    return [renderRow(header), renderSep(), ...body.map(renderRow)].join('\n')
  }
  return padded.map(renderRow).join('\n')
}

const SAMPLE = `Name\tAge\tCity
Alice\t30\tLondon
Bob\t25\tParis
Carol\t35\tBerlin`

export default function MarkdownTableGenerator() {
  const [input, setInput] = useState(SAMPLE)
  const [delimiter, setDelimiter] = useState('auto')
  const [hasHeader, setHasHeader] = useState(true)
  const [alignments, setAlignments] = useState([])
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [colCount, setColCount] = useState(0)

  useEffect(() => {
    document.title = 'Markdown Table Generator | OmniverseTools'
  }, [])

  useEffect(() => {
    generate()
  }, [input, delimiter, hasHeader, alignments])

  function generate() {
    setError('')
    if (!input.trim()) { setOutput(''); return }
    try {
      const rows = parseRows(input, delimiter)
      if (!rows.length) { setOutput(''); return }
      const cols = Math.max(...rows.map(r => r.length))
      setColCount(cols)
      setAlignments(prev => {
        if (prev.length === cols) return prev
        return Array.from({ length: cols }, (_, i) => prev[i] || 'none')
      })
      const result = buildMarkdownTable(rows, alignments, hasHeader)
      setOutput(result)
    } catch (e) {
      setError(e.message)
    }
  }

  function setAlignment(col, val) {
    setAlignments(prev => {
      const next = [...prev]
      next[col] = val
      return next
    })
  }

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const textCls = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Markdown Table Generator</h1>
      <p className="text-gray-400 mb-8">
        Paste tab- or comma-separated data and instantly get a formatted Markdown table.
        Supports CSV, TSV, and other delimited formats.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — input + options */}
        <div className="space-y-5">
          {/* Delimiter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Delimiter</label>
            <div className="flex flex-wrap gap-2">
              {DELIMITERS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDelimiter(d.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    delimiter === d.value
                      ? 'bg-orange-600 text-white'
                      : 'bg-zinc-800 text-gray-400 border border-zinc-700 hover:border-orange-500 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Header toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setHasHeader(h => !h)}
              className={`w-10 h-5 rounded-full transition-colors flex items-center ${hasHeader ? 'bg-orange-600' : 'bg-zinc-700'}`}
            >
              <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${hasHeader ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm text-gray-300">First row is header</span>
          </label>

          {/* Column alignments */}
          {colCount > 0 && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Column Alignment</label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: colCount }, (_, ci) => (
                  <div key={ci} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">Col {ci + 1}</span>
                    <select
                      value={alignments[ci] || 'none'}
                      onChange={e => setAlignment(ci, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 text-gray-300 text-xs rounded px-2 py-1"
                    >
                      {ALIGNMENTS.map(a => (
                        <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-400">Input data</label>
              <button
                onClick={() => { setInput(''); setOutput(''); setError('') }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={12}
              placeholder={"Name\tAge\tCity\nAlice\t30\tLondon"}
              spellCheck={false}
              className={textCls}
            />
            <p className="text-xs text-gray-600 mt-1">Paste CSV, TSV, or any delimited data — blank lines are ignored.</p>
          </div>
        </div>

        {/* Right — output */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-400">Markdown table</label>
              {output && (
                <button onClick={copy} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {error ? (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                ❌ {error}
              </div>
            ) : output ? (
              <textarea
                value={output}
                readOnly
                rows={12}
                className={textCls + ' text-green-300'}
              />
            ) : (
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 min-h-[280px] flex items-center justify-center">
                <p className="text-gray-600 text-sm">Paste data on the left to generate a table.</p>
              </div>
            )}
          </div>

          {/* Preview */}
          {output && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Rendered preview</label>
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto">
                <MarkdownTablePreview markdown={output} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Paste a spreadsheet selection, CSV export, or any tab/comma-separated text and this tool
          instantly formats it as a GitHub-Flavored Markdown table with aligned column separators.
          Choose a column alignment (left, center, right) to add the <code className="bg-zinc-800 px-1 rounded text-gray-300">:---:</code> syntax.
          Everything runs in your browser — nothing is uploaded.
        </p>
      </div>
    </div>
  )
}

function MarkdownTablePreview({ markdown }) {
  const lines = markdown.split('\n').filter(Boolean)
  if (lines.length < 2) return null

  function parseLine(line) {
    return line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(c => c.trim())
  }

  function isSep(line) {
    return /^\|?[\s:\-|]+\|?$/.test(line)
  }

  const sepIdx = lines.findIndex(isSep)
  if (sepIdx === -1) return null

  const headers = parseLine(lines[0])
  const bodyLines = lines.slice(sepIdx + 1)
  const sepLine = parseLine(lines[sepIdx])

  function getAlign(cell) {
    if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
    if (cell.endsWith(':')) return 'right'
    if (cell.startsWith(':')) return 'left'
    return 'left'
  }

  const aligns = sepLine.map(getAlign)

  return (
    <table className="text-sm text-gray-200 border-collapse w-full">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: aligns[i] }} className="border border-zinc-600 px-3 py-1.5 bg-zinc-800 font-semibold text-white">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyLines.map((line, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800/50'}>
            {parseLine(line).map((cell, ci) => (
              <td key={ci} style={{ textAlign: aligns[ci] }} className="border border-zinc-700 px-3 py-1.5 text-gray-300">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
