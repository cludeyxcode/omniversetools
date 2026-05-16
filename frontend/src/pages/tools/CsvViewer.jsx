import { useState, useEffect, useRef, useCallback } from 'react'

function parseCSV(text) {
  const rows = []
  let i = 0
  const n = text.length

  while (i < n) {
    const row = []

    while (i < n) {
      let field = ''

      if (text[i] === '"') {
        i++ // skip opening quote
        while (i < n) {
          if (text[i] === '"') {
            if (i + 1 < n && text[i + 1] === '"') {
              field += '"'
              i += 2
            } else {
              i++
              break
            }
          } else {
            field += text[i++]
          }
        }
      } else {
        while (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i++]
        }
      }

      row.push(field)

      if (i < n && text[i] === ',') {
        i++
      } else {
        break
      }
    }

    if (i < n && text[i] === '\r') i++
    if (i < n && text[i] === '\n') i++

    if (row.length > 0 && !(row.length === 1 && row[0] === '')) rows.push(row)
  }

  return rows
}

const SAMPLE = `Name,Age,City,Occupation,Salary
Alice Johnson,32,New York,Engineer,95000
Bob Smith,45,London,Designer,72000
Carol White,28,Toronto,Developer,88000
David Lee,38,Sydney,Manager,105000
Eva Martinez,25,Berlin,Analyst,61000`

export default function CsvViewer() {
  const [raw, setRaw] = useState('')
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [showPaste, setShowPaste] = useState(true)
  const fileRef = useRef()

  useEffect(() => {
    document.title = 'CSV Viewer | OmniverseTools'
  }, [])

  function process(text) {
    setError('')
    const parsed = parseCSV(text.trim())
    if (parsed.length === 0) {
      setError('No data found. Make sure your CSV has at least a header row.')
      setHeaders([])
      setRows([])
      return
    }
    const cols = parsed[0]
    const dataRows = parsed.slice(1)
    setHeaders(cols)
    setRows(dataRows)
    setSortCol(null)
    setSortDir('asc')
    setQuery('')
  }

  function handleRawChange(e) {
    const val = e.target.value
    setRaw(val)
    if (val.trim()) process(val)
    else { setHeaders([]); setRows([]); setError('') }
  }

  function loadFile(file) {
    if (!file) return
    if (!file.name.match(/\.(csv|tsv|txt)$/i) && file.type !== 'text/csv' && file.type !== 'text/plain') {
      setError('Please drop a .csv, .tsv, or .txt file.')
      return
    }
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target.result
      setRaw(text)
      process(text)
      setShowPaste(false)
    }
    reader.readAsText(file)
  }

  const onDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    loadFile(e.dataTransfer.files[0])
  }, [])

  const onDragOver = useCallback(e => { e.preventDefault(); setDragging(true) }, [])
  const onDragLeave = useCallback(() => setDragging(false), [])

  function loadSample() {
    setRaw(SAMPLE)
    process(SAMPLE)
    setShowPaste(false)
  }

  function reset() {
    setRaw('')
    setHeaders([])
    setRows([])
    setQuery('')
    setSortCol(null)
    setSortDir('asc')
    setError('')
    setShowPaste(true)
  }

  function toggleSort(colIdx) {
    if (sortCol === colIdx) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(colIdx)
      setSortDir('asc')
    }
  }

  const q = query.trim().toLowerCase()

  let displayRows = rows
  if (q) {
    displayRows = displayRows.filter(row =>
      row.some(cell => cell.toLowerCase().includes(q))
    )
  }
  if (sortCol !== null) {
    displayRows = [...displayRows].sort((a, b) => {
      const av = (a[sortCol] ?? '').toLowerCase()
      const bv = (b[sortCol] ?? '').toLowerCase()
      const numA = parseFloat(av)
      const numB = parseFloat(bv)
      const numeric = !isNaN(numA) && !isNaN(numB)
      const cmp = numeric ? numA - numB : av.localeCompare(bv)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  const hasData = headers.length > 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">CSV Viewer</h1>
      <p className="text-gray-400 mb-8">
        Drag-drop a CSV file or paste your data — view it as a sortable, searchable table.
        Nothing leaves your browser.
      </p>

      {/* Input area */}
      {!hasData && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${
            dragging
              ? 'border-orange-500 bg-orange-500/5'
              : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900'
          }`}
          onClick={() => fileRef.current.click()}
        >
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4V6a1 1 0 011-1h8a1 1 0 011 1v4h4l-8 8-8-8z" />
          </svg>
          <p className="text-gray-300 font-medium mb-1">Drop a CSV file here</p>
          <p className="text-gray-500 text-sm">or click to browse — .csv, .tsv, .txt supported</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.tsv,.txt,text/csv,text/plain"
            className="hidden"
            onChange={e => loadFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Paste textarea */}
      {showPaste && !hasData && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400 font-medium">Or paste CSV text</label>
            <button
              onClick={loadSample}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              Load sample data
            </button>
          </div>
          <textarea
            value={raw}
            onChange={handleRawChange}
            rows={6}
            placeholder={"Name,Age,City\nAlice,32,New York\nBob,45,London"}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-orange-500 placeholder-gray-600 resize-y"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Table controls */}
      {hasData && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search rows…"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-gray-500"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >✕</button>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-gray-400">
                {displayRows.length} / {rows.length} row{rows.length !== 1 ? 's' : ''} · {headers.length} col{headers.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={reset}
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 w-10 border-b border-zinc-700 select-none">#</th>
                  {headers.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => toggleSort(idx)}
                      className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 border-b border-zinc-700 cursor-pointer hover:text-orange-300 hover:bg-zinc-700/50 transition-colors select-none whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5">
                        {h || <span className="text-gray-600 italic">Column {idx + 1}</span>}
                        <span className="text-gray-600 text-xs">
                          {sortCol === idx ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + 1} className="px-4 py-8 text-center text-gray-500">
                      No rows match &ldquo;{query}&rdquo;
                    </td>
                  </tr>
                ) : (
                  displayRows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-gray-600 text-xs font-mono w-10">{ri + 1}</td>
                      {headers.map((_, ci) => {
                        const cell = row[ci] ?? ''
                        const highlighted = q && cell.toLowerCase().includes(q)
                        return (
                          <td key={ci} className="px-4 py-2.5 text-gray-300 whitespace-nowrap max-w-xs">
                            {highlighted ? (
                              <HighlightCell text={cell} query={q} />
                            ) : (
                              <span className="truncate block">{cell}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {displayRows.length > 50 && (
            <p className="text-xs text-gray-600 mt-2 text-right">
              Showing all {displayRows.length} rows — scroll right if the table overflows
            </p>
          )}
        </>
      )}

      {!hasData && !error && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-gray-300 font-semibold mb-3 text-base">How it works</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-orange-400">1.</span> Drop a CSV file or paste raw CSV text above.</li>
            <li className="flex gap-2"><span className="text-orange-400">2.</span> The first row is treated as column headers.</li>
            <li className="flex gap-2"><span className="text-orange-400">3.</span> Click any column header to sort — click again to reverse.</li>
            <li className="flex gap-2"><span className="text-orange-400">4.</span> Use the search box to filter rows across all columns.</li>
            <li className="flex gap-2"><span className="text-orange-400">5.</span> Quoted fields and embedded commas are handled correctly.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

function HighlightCell({ text, query }) {
  const idx = text.toLowerCase().indexOf(query)
  if (idx === -1) return <span className="truncate block">{text}</span>
  return (
    <span className="truncate block">
      {text.slice(0, idx)}
      <mark className="bg-orange-500/30 text-orange-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  )
}
