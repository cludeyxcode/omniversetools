import { useState, useEffect } from 'react'

const COLS = ['Owner', 'Group', 'Others']
const PERMS = [
  { label: 'Read',    bit: 4, short: 'r' },
  { label: 'Write',   bit: 2, short: 'w' },
  { label: 'Execute', bit: 1, short: 'x' },
]

const PRESETS = [
  { octal: '755', note: 'Executable / directory (owner full, others read+exec)' },
  { octal: '644', note: 'Regular file (owner read+write, others read-only)' },
  { octal: '600', note: 'Private file (owner read+write only)' },
  { octal: '777', note: 'Full access for everyone (not recommended)' },
  { octal: '400', note: 'Read-only (owner only)' },
  { octal: '700', note: 'Full private (owner only, no group/others)' },
]

export default function ChmodCalculator() {
  // bits[col][perm] = true/false
  const [bits, setBits] = useState([
    [true,  true,  true],   // owner rwx
    [true,  false, true],   // group r-x
    [true,  false, true],   // others r-x
  ])
  const [filename, setFilename] = useState('filename')

  useEffect(() => { document.title = 'Chmod Calculator | OmniverseTools' }, [])

  function toggle(col, perm) {
    setBits(prev => prev.map((c, ci) => ci === col ? c.map((v, pi) => pi === perm ? !v : v) : c))
  }

  function applyOctal(oct) {
    const digits = oct.split('').map(Number)
    if (digits.length !== 3 || digits.some(isNaN)) return
    setBits(digits.map(d => PERMS.map(p => !!(d & p.bit))))
  }

  const octal  = bits.map(col => col.reduce((acc, v, i) => acc + (v ? PERMS[i].bit : 0), 0)).join('')
  const symbolic = bits.map(col => PERMS.map((p, i) => col[i] ? p.short : '-').join('')).join('')

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Chmod Calculator</h1>
      <p className="text-gray-400 mb-6">
        Build Unix file permissions visually — click the checkboxes to set read, write, and execute bits.
      </p>

      {/* Permission grid */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-4 border-b border-zinc-700">
          <div className="px-4 py-3" />
          {COLS.map(c => (
            <div key={c} className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{c}</div>
          ))}
        </div>
        {PERMS.map((perm, pi) => (
          <div key={perm.label} className="grid grid-cols-4 border-b border-zinc-800 last:border-0">
            <div className="px-4 py-4 text-sm text-gray-300">{perm.label}</div>
            {COLS.map((_, ci) => (
              <div key={ci} className="flex justify-center items-center py-4">
                <label className="cursor-pointer">
                  <input type="checkbox" checked={bits[ci][pi]} onChange={() => toggle(ci, pi)} className="sr-only" />
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${bits[ci][pi] ? 'bg-orange-500 border-orange-500' : 'border-zinc-600 hover:border-zinc-400'}`}>
                    {bits[ci][pi] && <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Octal</span>
          <span className="text-3xl font-bold font-mono text-orange-400">{octal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Symbolic</span>
          <span className="text-xl font-mono text-white">{symbolic}</span>
        </div>
        <div className="border-t border-zinc-700 pt-3 flex gap-2 items-center">
          <span className="text-sm text-gray-400">Command</span>
          <code className="flex-1 bg-zinc-800 rounded px-3 py-1.5 text-sm text-green-300 font-mono">
            chmod {octal} <input
              value={filename}
              onChange={e => setFilename(e.target.value)}
              className="bg-transparent border-b border-zinc-600 text-green-300 focus:outline-none focus:border-orange-500 w-28"
            />
          </code>
        </div>
      </div>

      {/* Presets */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Common presets</div>
        <div className="space-y-2">
          {PRESETS.map(p => (
            <button key={p.octal} onClick={() => applyOctal(p.octal)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors text-left ${octal === p.octal ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}`}>
              <span className="text-xl font-bold font-mono text-orange-400 w-10 shrink-0">{p.octal}</span>
              <span className="text-sm text-gray-300">{p.note}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
