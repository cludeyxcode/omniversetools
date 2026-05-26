import { useState, useEffect } from 'react'

function phpParse(str) {
  str = str.trim()
  let pos = 0

  function next() {
    if (pos >= str.length) throw new Error('Unexpected end of input')
    const type = str[pos]
    pos++

    if (type === 'N') {
      if (str[pos] !== ';') throw new Error(`Expected ';' at pos ${pos}`)
      pos++
      return null
    }

    if (str[pos] !== ':') throw new Error(`Expected ':' at pos ${pos}, got '${str[pos]}'`)
    pos++

    switch (type) {
      case 'b': {
        const v = str[pos] === '1'
        pos += 2
        return v
      }
      case 'i': {
        const semi = str.indexOf(';', pos)
        if (semi === -1) throw new Error('Unterminated integer')
        const v = parseInt(str.slice(pos, semi), 10)
        pos = semi + 1
        return v
      }
      case 'd': {
        const semi = str.indexOf(';', pos)
        if (semi === -1) throw new Error('Unterminated float')
        const v = parseFloat(str.slice(pos, semi))
        pos = semi + 1
        return v
      }
      case 's': {
        const colon = str.indexOf(':', pos)
        if (colon === -1) throw new Error('Malformed string token')
        const len = parseInt(str.slice(pos, colon), 10)
        if (isNaN(len)) throw new Error('Invalid string length')
        pos = colon + 2
        const v = str.slice(pos, pos + len)
        pos += len + 2
        return v
      }
      case 'a': {
        const colon = str.indexOf(':', pos)
        if (colon === -1) throw new Error('Malformed array token')
        const count = parseInt(str.slice(pos, colon), 10)
        if (isNaN(count)) throw new Error('Invalid array count')
        pos = colon + 2
        const keys = []
        const vals = []
        let isSeq = true
        for (let i = 0; i < count; i++) {
          const k = next()
          const v = next()
          keys.push(k)
          vals.push(v)
          if (k !== i) isSeq = false
        }
        pos++
        if (isSeq && keys.every(k => typeof k === 'number')) return vals
        const obj = {}
        keys.forEach((k, idx) => { obj[k] = vals[idx] })
        return obj
      }
      case 'O': {
        const c1 = str.indexOf(':', pos)
        if (c1 === -1) throw new Error('Malformed object token')
        const nLen = parseInt(str.slice(pos, c1), 10)
        pos = c1 + 2
        const cls = str.slice(pos, pos + nLen)
        pos += nLen + 2
        const c2 = str.indexOf(':', pos)
        if (c2 === -1) throw new Error('Malformed object prop count')
        const pCount = parseInt(str.slice(pos, c2), 10)
        pos = c2 + 2
        const obj = { __class: cls }
        for (let i = 0; i < pCount; i++) {
          const k = next()
          const v = next()
          obj[k] = v
        }
        pos++
        return obj
      }
      default:
        throw new Error(`Unknown type '${type}' at pos ${pos - 2}`)
    }
  }

  return next()
}

function parseCron(raw) {
  const data = phpParse(raw)
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Expected a PHP associative array at the top level')
  }
  const events = []
  for (const [tsKey, hooks] of Object.entries(data)) {
    if (tsKey === 'version') continue
    const ts = parseInt(tsKey, 10)
    if (isNaN(ts) || ts <= 0) continue
    if (!hooks || typeof hooks !== 'object' || Array.isArray(hooks)) continue
    for (const [hook, hashes] of Object.entries(hooks)) {
      if (!hashes || typeof hashes !== 'object') continue
      for (const [, ev] of Object.entries(hashes)) {
        events.push({
          ts,
          hook,
          schedule: ev?.schedule || null,
          interval: ev?.interval || 0,
          args: ev?.args ?? [],
        })
      }
    }
  }
  events.sort((a, b) => a.ts - b.ts)
  return events
}

function formatInterval(seconds) {
  if (!seconds) return '—'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`
  return `${Math.round(seconds / 86400)}d`
}

function formatTs(ts) {
  const d = new Date(ts * 1000)
  const now = Date.now() / 1000
  const diff = ts - now
  const abs = Math.abs(diff)
  let rel
  if (abs < 60) rel = 'just now'
  else if (abs < 3600) rel = `${Math.round(abs / 60)}m`
  else if (abs < 86400) rel = `${Math.round(abs / 3600)}h`
  else rel = `${Math.round(abs / 86400)}d`
  const overdue = diff < 0
  const iso = d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
  return { iso, rel, overdue }
}

function hasArgs(args) {
  if (Array.isArray(args)) return args.length > 0
  if (args && typeof args === 'object') return Object.keys(args).length > 0
  return false
}

const EXAMPLE = 'a:4:{i:1735000000;a:1:{s:16:"wp_version_check";a:1:{s:32:"40cd750bba9870f18aada2478b24840a";a:3:{s:8:"schedule";s:5:"daily";s:4:"args";a:0:{}s:8:"interval";i:86400;}}}i:1735086400;a:2:{s:17:"wp_update_plugins";a:1:{s:32:"40cd750bba9870f18aada2478b24840a";a:3:{s:8:"schedule";s:5:"daily";s:4:"args";a:0:{}s:8:"interval";i:86400;}}s:16:"wp_update_themes";a:1:{s:32:"40cd750bba9870f18aada2478b24840a";a:3:{s:8:"schedule";s:5:"daily";s:4:"args";a:0:{}s:8:"interval";i:86400;}}}i:1735172800;a:1:{s:19:"wp_scheduled_delete";a:1:{s:32:"40cd750bba9870f18aada2478b24840a";a:3:{s:8:"schedule";s:10:"twicedaily";s:4:"args";a:0:{}s:8:"interval";i:43200;}}}s:7:"version";i:2;}'

export default function WpCronViewer() {
  const [input, setInput] = useState('')
  const [events, setEvents] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'WordPress Cron Viewer | OmniverseTools' }, [])

  function parse(val) {
    if (!val.trim()) { setEvents(null); setError(''); return }
    try {
      setEvents(parseCron(val))
      setError('')
    } catch (e) {
      setEvents(null)
      setError(e.message)
    }
  }

  function handleInput(val) {
    setInput(val)
    parse(val)
  }

  function loadExample() {
    setInput(EXAMPLE)
    parse(EXAMPLE)
  }

  function clear() {
    setInput('')
    setEvents(null)
    setError('')
  }

  const now = Math.floor(Date.now() / 1000)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">WordPress Cron Viewer</h1>
      <p className="text-gray-400 mb-8">
        Paste the raw serialized value of the{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">cron</code>{' '}
        option from your{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">wp_options</code>{' '}
        table to decode and display all scheduled events in a clean table — without opening phpMyAdmin.
      </p>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button
          onClick={loadExample}
          className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-lg transition-colors"
        >
          Load example
        </button>
        <button
          onClick={clear}
          className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          Serialized <code className="bg-zinc-800 px-1 rounded text-gray-300">cron</code> option value
        </label>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={'Paste the PHP serialized cron value from wp_options…\ne.g. a:2:{i:1735000000;a:1:{s:16:"wp_version_check";…}s:7:"version";i:2;}'}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 text-sm font-mono focus:outline-none focus:border-orange-500 resize-y placeholder-zinc-600"
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          ⚠ {error}
        </div>
      )}

      {events !== null && events.length === 0 && (
        <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-8 text-center text-gray-500 text-sm">
          No scheduled events found in the parsed data.
        </div>
      )}

      {events !== null && events.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm text-gray-400">
              {events.length} scheduled event{events.length !== 1 ? 's' : ''} found
            </p>
            <span className="text-xs text-gray-600">·</span>
            <p className="text-xs text-gray-500">
              {events.filter(e => e.ts < now).length} overdue
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">Hook</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">Next Run (UTC)</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">Schedule</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">Interval</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">Args</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => {
                  const { iso, rel, overdue } = formatTs(ev.ts)
                  return (
                    <tr key={i} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-orange-300 break-all max-w-xs">{ev.hook}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-gray-200 text-xs">{iso}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${overdue ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                          {overdue ? `${rel} overdue` : `in ${rel}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {ev.schedule
                          ? <span className="text-blue-300">{ev.schedule}</span>
                          : <span className="text-gray-500 italic">one-time</span>
                        }
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-300 whitespace-nowrap">{formatInterval(ev.interval)}</td>
                      <td className="px-4 py-3">
                        {hasArgs(ev.args)
                          ? <code className="text-gray-300 text-xs bg-zinc-800 px-2 py-0.5 rounded">{JSON.stringify(ev.args)}</code>
                          : <span className="text-gray-600 italic text-xs">none</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-12 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-3">How to get the cron option value</h2>
        <ol className="list-decimal list-inside space-y-2 mb-6">
          <li>Open phpMyAdmin or any MySQL client connected to your WordPress database.</li>
          <li>
            Run:{' '}
            <code className="bg-zinc-800 px-2 py-0.5 rounded text-gray-300 text-xs">
              SELECT option_value FROM wp_options WHERE option_name = 'cron';
            </code>
          </li>
          <li>Copy the raw value from the <code className="bg-zinc-800 px-1 rounded text-gray-300 text-xs">option_value</code> column.</li>
          <li>Paste it into the field above.</li>
        </ol>
        <p className="mb-6">
          With WP-CLI, run{' '}
          <code className="bg-zinc-800 px-2 py-0.5 rounded text-gray-300 text-xs">wp option get cron</code>{' '}
          to get the serialized value directly from the command line.
        </p>

        <h2 className="text-gray-300 font-semibold text-base mb-3">Understanding the table</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            ['Hook', 'The action name WordPress fires when the event runs (e.g. wp_version_check).'],
            ['Next Run', 'The Unix timestamp for the next scheduled execution, shown as UTC date/time.'],
            ['Schedule', 'The recurrence string (daily, hourly, twicedaily, weekly) or "one-time" for single-fire events.'],
            ['Interval', 'How many seconds between recurrences — converted to a human-readable unit.'],
            ['Args', 'Arguments passed to the hook callback, if any. Most core hooks use none.'],
          ].map(([col, desc]) => (
            <div key={col} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
              <span className="text-orange-300 text-xs font-semibold">{col}</span>
              <span className="text-gray-500 text-xs ml-2">{desc}</span>
            </div>
          ))}
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400/80 text-xs leading-relaxed">
          <strong className="text-blue-400">Privacy:</strong> All decoding happens entirely in your browser.
          Your database values are never sent to any server.
        </div>
      </div>
    </div>
  )
}
