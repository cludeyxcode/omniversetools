import { useState, useEffect } from 'react'

export default function RandomNumberGenerator() {
  const [min, setMin]           = useState('1')
  const [max, setMax]           = useState('100')
  const [count, setCount]       = useState('1')
  const [noDupes, setNoDupes]   = useState(false)
  const [sorted, setSorted]     = useState(false)
  const [numbers, setNumbers]   = useState([])
  const [copied, setCopied]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => { document.title = 'Random Number Generator | OmniverseTools' }, [])

  function generate() {
    setError('')
    const lo   = parseInt(min)
    const hi   = parseInt(max)
    const n    = Math.min(parseInt(count) || 1, 1000)
    if (isNaN(lo) || isNaN(hi) || lo > hi) { setError('Min must be less than or equal to max.'); return }
    const range = hi - lo + 1
    if (noDupes && n > range) { setError(`Can't generate ${n} unique numbers in a range of ${range}.`); return }

    let result = []
    if (noDupes) {
      const pool = Array.from({ length: range }, (_, i) => lo + i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
      }
      result = pool.slice(0, n)
    } else {
      result = Array.from({ length: n }, () => Math.floor(Math.random() * range) + lo)
    }

    if (sorted) result.sort((a, b) => a - b)
    setNumbers(result)
  }

  function copyAll() {
    navigator.clipboard.writeText(numbers.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Random Number Generator</h1>
      <p className="text-gray-400 mb-6">Generate random integers within any range, with optional no-duplicates and sorting.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min</label>
            <input type="number" value={min} onChange={e => setMin(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max</label>
            <input type="number" value={max} onChange={e => setMax(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Count</label>
            <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="1000" className={inputCls} />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={noDupes} onChange={e => setNoDupes(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
            <span className="text-sm text-gray-300">No duplicates</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={sorted} onChange={e => setSorted(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
            <span className="text-sm text-gray-300">Sort results</span>
          </label>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <button onClick={generate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          Generate
        </button>
      </div>

      {numbers.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-white">{numbers.length} number{numbers.length !== 1 ? 's' : ''}</span>
            <button onClick={copyAll}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
              {copied ? '✓ Copied!' : 'Copy all'}
            </button>
          </div>
          {numbers.length === 1 ? (
            <div className="text-7xl font-bold text-orange-400 text-center py-4 font-mono">{numbers[0]}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {numbers.map((n, i) => (
                <span key={i} className="bg-zinc-800 text-white font-mono text-sm px-3 py-1.5 rounded-lg border border-zinc-700">{n}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
