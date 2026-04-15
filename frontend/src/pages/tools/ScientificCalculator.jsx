import { useState, useEffect } from 'react'

function safeEval(expr, deg) {
  // Sanitise: strip all known-safe tokens; anything left is suspicious
  const stripped = expr
    .replace(/\b(sin|cos|tan|asin|acos|atan|sqrt|abs|log|ln|floor|ceil)\b/g, '')
    .replace(/[0-9+\-*/.^()%\s]/g, '')
    .replace(/[eπ]/g, '')  // standalone constants from buttons
  if (stripped.length > 0) throw new Error('Invalid expression')

  const d2r = deg ? Math.PI / 180 : 1
  const r2d = deg ? 180 / Math.PI : 1

  // Replace ^ and constants first
  const e = expr
    .replace(/\^/g, '**')
    .replace(/π/g, String(Math.PI))
    // e = Euler's number when NOT followed by alphanumeric (avoids matching "ceil", "floor")
    // 1e5 stays as-is (JS scientific notation), standalone e → Math.E
    .replace(/e(?![a-zA-Z0-9_])/g, String(Math.E))

  // Inject trig/math helpers with deg↔rad baked in, then eval
  const code = `(function(){
    const sin  = x => Math.sin(x  * ${d2r});
    const cos  = x => Math.cos(x  * ${d2r});
    const tan  = x => Math.tan(x  * ${d2r});
    const asin = x => Math.asin(x) * ${r2d};
    const acos = x => Math.acos(x) * ${r2d};
    const atan = x => Math.atan(x) * ${r2d};
    const sqrt  = x => Math.sqrt(x);
    const abs   = x => Math.abs(x);
    const log   = x => Math.log10(x);
    const ln    = x => Math.log(x);
    const floor = x => Math.floor(x);
    const ceil  = x => Math.ceil(x);
    return (${e});
  })()`

  return Function('"use strict"; return ' + code)()
}

const BUTTONS = [
  // row 1
  { label: 'sin',   type: 'fn',  val: 'sin('   },
  { label: 'cos',   type: 'fn',  val: 'cos('   },
  { label: 'tan',   type: 'fn',  val: 'tan('   },
  { label: '(',     type: 'str', val: '('      },
  { label: ')',     type: 'str', val: ')'      },
  // row 2
  { label: 'asin',  type: 'fn',  val: 'asin('  },
  { label: 'acos',  type: 'fn',  val: 'acos('  },
  { label: 'atan',  type: 'fn',  val: 'atan('  },
  { label: 'xʸ',   type: 'str', val: '^'      },
  { label: '√',    type: 'fn',  val: 'sqrt('  },
  // row 3
  { label: 'log',   type: 'fn',  val: 'log('   },
  { label: 'ln',    type: 'fn',  val: 'ln('    },
  { label: 'π',    type: 'str', val: 'π'      },
  { label: 'e',     type: 'str', val: 'e'      },
  { label: '%',    type: 'str', val: '%'      },
  // row 4
  { label: '7',     type: 'str', val: '7'      },
  { label: '8',     type: 'str', val: '8'      },
  { label: '9',     type: 'str', val: '9'      },
  { label: '÷',    type: 'str', val: '/'      },
  { label: '⌫',   type: 'del', val: null     },
  // row 5
  { label: '4',     type: 'str', val: '4'      },
  { label: '5',     type: 'str', val: '5'      },
  { label: '6',     type: 'str', val: '6'      },
  { label: '×',    type: 'str', val: '*'      },
  { label: 'AC',   type: 'clr', val: null     },
  // row 6
  { label: '1',     type: 'str', val: '1'      },
  { label: '2',     type: 'str', val: '2'      },
  { label: '3',     type: 'str', val: '3'      },
  { label: '−',    type: 'str', val: '-'      },
  { label: '=',    type: 'eq',  val: null,  span: true },
  // row 7
  { label: '0',     type: 'str', val: '0'      },
  { label: '.',     type: 'str', val: '.'      },
  { label: '±',    type: 'neg', val: null     },
  { label: '+',    type: 'str', val: '+'      },
]

export default function ScientificCalculator() {
  const [expr, setExpr]   = useState('')
  const [display, setDisplay] = useState('0')
  const [deg, setDeg]     = useState(true)
  const [hasResult, setHasResult] = useState(false)

  useEffect(() => { document.title = 'Scientific Calculator Online | OmniverseTools' }, [])

  function press(btn) {
    if (btn.type === 'clr') { setExpr(''); setDisplay('0'); setHasResult(false); return }
    if (btn.type === 'del') {
      const next = expr.slice(0, -1)
      setExpr(next)
      setDisplay(next || '0')
      setHasResult(false)
      return
    }
    if (btn.type === 'eq') {
      try {
        const res = safeEval(expr || '0', deg)
        const formatted = Number.isFinite(res)
          ? parseFloat(res.toPrecision(12)).toString()
          : 'Error'
        setDisplay(formatted)
        setExpr(formatted === 'Error' ? '' : formatted)
        setHasResult(true)
      } catch {
        setDisplay('Error')
        setExpr('')
        setHasResult(true)
      }
      return
    }
    if (btn.type === 'neg') {
      if (expr.startsWith('-')) { setExpr(expr.slice(1)); setDisplay(expr.slice(1) || '0') }
      else { setExpr('-' + expr); setDisplay('-' + (expr || '0')) }
      return
    }

    const next = hasResult && (btn.type === 'str' && /[0-9.]/.test(btn.val))
      ? btn.val
      : expr + btn.val
    setExpr(next)
    setDisplay(next)
    setHasResult(false)
  }

  const btnBase = 'flex items-center justify-center rounded-xl text-sm font-medium transition-colors select-none cursor-pointer h-12'
  const numBtn  = `${btnBase} bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700`
  const fnBtn   = `${btnBase} bg-zinc-900 hover:bg-zinc-800 text-orange-300 border border-zinc-700`
  const opBtn   = `${btnBase} bg-zinc-800 hover:bg-zinc-700 text-orange-400 font-bold border border-zinc-700`
  const eqBtn   = `${btnBase} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white col-span-1`
  const actBtn  = `${btnBase} bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600`

  function btnClass(btn) {
    if (btn.type === 'eq')  return eqBtn
    if (btn.type === 'fn')  return fnBtn
    if (btn.type === 'clr' || btn.type === 'del') return actBtn
    if (['+', '-', '*', '/', '^', '%'].includes(btn.val)) return opBtn
    return numBtn
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Scientific Calculator</h1>
      <p className="text-gray-400 mb-6">Full scientific calculator with trig, log, powers, and constants.</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
        {/* DEG / RAD toggle */}
        <div className="flex justify-end mb-3">
          <div className="flex bg-zinc-800 rounded-lg p-0.5">
            {['DEG', 'RAD'].map(m => (
              <button key={m} onClick={() => setDeg(m === 'DEG')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${(deg && m === 'DEG') || (!deg && m === 'RAD') ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Display */}
        <div className="bg-zinc-950 rounded-xl p-4 mb-4 min-h-[4.5rem] flex items-end justify-end overflow-hidden">
          <div className="text-right">
            {expr && !hasResult && <div className="text-xs text-gray-600 mb-1 truncate max-w-[240px]">{expr}</div>}
            <div className="text-3xl font-mono text-white break-all">{display}</div>
          </div>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-5 gap-2">
          {BUTTONS.map((btn, i) => (
            <button key={i} onClick={() => press(btn)} className={btnClass(btn)}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 leading-relaxed">
        Use <code className="text-gray-500">^</code> for powers, <code className="text-gray-500">π</code> for pi, <code className="text-gray-500">e</code> for Euler's number. Trig functions use {deg ? 'degrees' : 'radians'} (toggle above).
      </div>
    </div>
  )
}
