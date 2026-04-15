import { useState, useEffect } from 'react'
import { format } from 'sql-formatter'

const DIALECTS = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'transactsql', label: 'T-SQL (SQL Server)' },
]

const SAMPLE = `SELECT u.id, u.name, u.email, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 50;`

export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState('sql')
  const [indent, setIndent] = useState(2)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'SQL Formatter & Beautifier Online | OmniverseTools'
    formatSql(SAMPLE, 'sql', 2)
  }, [])

  function formatSql(sql = input, d = dialect, i = indent) {
    setError('')
    try {
      const result = format(sql, { language: d, tabWidth: i, keywordCase: 'upper' })
      setOutput(result)
    } catch (e) {
      setError('Could not format SQL — check for syntax errors.')
      setOutput('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">SQL Formatter</h1>
      <p className="text-gray-400 mb-6">
        Paste messy SQL and instantly format it into clean, readable code — supports MySQL, PostgreSQL, SQLite, and more.
      </p>

      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Dialect</label>
          <select
            value={dialect}
            onChange={e => setDialect(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
          >
            {DIALECTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Indent size</label>
          <div className="flex bg-zinc-800 rounded-lg p-1">
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${indent === n ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {n} spaces
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => formatSql()}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Format →
        </button>
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Copy
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input SQL</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={22}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
            placeholder="Paste your SQL here..."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Formatted Output</label>
          <textarea
            readOnly
            value={output}
            rows={22}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-green-300 font-mono resize-none focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Formatted SQL is dramatically easier to read, review, and debug. This tool uses the{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">sql-formatter</code> library
          and supports standard SQL plus popular dialects like MySQL, PostgreSQL, SQLite, BigQuery,
          and SQL Server (T-SQL). Keywords are automatically uppercased.
        </p>
      </div>
    </div>
  )
}
