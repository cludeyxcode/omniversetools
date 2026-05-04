import { useState, useEffect } from 'react'

const COLORS = ['#f97316', '#ef4444', '#fb923c', '#fbbf24', '#a78bfa']

function B({ n, s = {} }) {
  return (
    <div style={{
      background: COLORS[(n - 1) % COLORS.length],
      borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 10, fontWeight: 700,
      ...s,
    }}>
      {n}
    </div>
  )
}

const SZ = { width: 28, height: 28 }

const FLEX_PROPS = [
  {
    prop: 'flex-direction',
    tag: 'container',
    desc: 'Sets the main axis — row (left→right), column (top→bottom), or reversed.',
    values: ['row', 'row-reverse', 'column', 'column-reverse'],
    render: v => (
      <div style={{ display: 'flex', flexDirection: v, gap: 6, padding: 10, minHeight: 72, alignItems: 'flex-start' }}>
        {[1, 2, 3].map(n => <B key={n} n={n} s={SZ} />)}
      </div>
    ),
  },
  {
    prop: 'flex-wrap',
    tag: 'container',
    desc: 'Controls whether items wrap to a new line when they overflow the container.',
    values: ['nowrap', 'wrap', 'wrap-reverse'],
    render: v => (
      <div style={{ display: 'flex', flexWrap: v, gap: 6, padding: 10, width: 130 }}>
        {[1, 2, 3, 4, 5].map(n => <B key={n} n={n} s={{ width: 36, height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'justify-content',
    tag: 'container',
    desc: 'Aligns items along the main axis (horizontal when flex-direction is row).',
    values: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    render: v => (
      <div style={{ display: 'flex', justifyContent: v, alignItems: 'center', gap: 4, padding: 10, height: 56 }}>
        {[1, 2, 3].map(n => <B key={n} n={n} s={SZ} />)}
      </div>
    ),
  },
  {
    prop: 'align-items',
    tag: 'container',
    desc: 'Aligns items along the cross axis (vertical when flex-direction is row).',
    values: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    render: v => (
      <div style={{ display: 'flex', alignItems: v, gap: 6, padding: 10, height: 80 }}>
        <B n={1} s={{ width: 28, height: v === 'stretch' ? undefined : 20 }} />
        <B n={2} s={{ width: 28, height: v === 'stretch' ? undefined : 40 }} />
        <B n={3} s={{ width: 28, height: v === 'stretch' ? undefined : 28 }} />
      </div>
    ),
  },
  {
    prop: 'align-content',
    tag: 'container',
    desc: 'Aligns wrapped lines along the cross axis. Only applies when items wrap.',
    values: ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    render: v => (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: v, gap: 4, padding: 10, width: 110, height: 110 }}>
        {[1, 2, 3, 4, 5].map(n => <B key={n} n={n} s={{ width: 36, height: 24 }} />)}
      </div>
    ),
  },
  {
    prop: 'gap',
    tag: 'container',
    desc: 'Sets spacing between flex items (shorthand for row-gap and column-gap).',
    values: ['0', '4px', '8px', '16px', '24px'],
    render: v => (
      <div style={{ display: 'flex', gap: v, padding: 10, alignItems: 'center' }}>
        {[1, 2, 3].map(n => <B key={n} n={n} s={SZ} />)}
      </div>
    ),
  },
  {
    prop: 'flex-grow',
    tag: 'item',
    desc: 'Allows item 2 to grow and fill available space. 0 = no grow, 1 = grow.',
    values: ['0', '1', '2'],
    render: v => (
      <div style={{ display: 'flex', gap: 6, padding: 10, height: 52, alignItems: 'stretch' }}>
        <B n={1} s={{ width: 40 }} />
        <B n={2} s={{ flexGrow: Number(v), minWidth: 28 }} />
        <B n={3} s={{ width: 40 }} />
      </div>
    ),
  },
  {
    prop: 'flex-shrink',
    tag: 'item',
    desc: 'Controls how much item 2 shrinks when the container is too narrow.',
    values: ['0', '1', '2'],
    render: v => (
      <div style={{ display: 'flex', gap: 4, padding: 10, height: 52, overflow: 'hidden', alignItems: 'stretch' }}>
        <B n={1} s={{ width: 80, flexShrink: 1 }} />
        <B n={2} s={{ width: 80, flexShrink: Number(v) }} />
        <B n={3} s={{ width: 80, flexShrink: 1 }} />
      </div>
    ),
  },
  {
    prop: 'flex-basis',
    tag: 'item',
    desc: 'Sets the initial main-size of item 2 before free space is distributed.',
    values: ['auto', '0', '40px', '80px', '50%'],
    render: v => (
      <div style={{ display: 'flex', gap: 4, padding: 10, height: 52, alignItems: 'stretch' }}>
        <B n={1} s={{ flexGrow: 1, minWidth: 0 }} />
        <B n={2} s={{ flexBasis: v, flexShrink: 0, minWidth: 0 }} />
        <B n={3} s={{ flexGrow: 1, minWidth: 0 }} />
      </div>
    ),
  },
  {
    prop: 'align-self',
    tag: 'item',
    desc: 'Overrides align-items for item 2 only.',
    values: ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
    render: v => (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: 10, height: 88 }}>
        <B n={1} s={{ width: 28, height: 28 }} />
        <B n={2} s={{ width: 28, alignSelf: v, height: v === 'stretch' ? undefined : 44 }} />
        <B n={3} s={{ width: 28, height: 28 }} />
      </div>
    ),
  },
  {
    prop: 'order',
    tag: 'item',
    desc: 'Changes the visual order of item 2. Default is 0; higher numbers appear later.',
    values: ['-1', '0', '1', '2'],
    render: v => (
      <div style={{ display: 'flex', gap: 6, padding: 10, height: 52, alignItems: 'center' }}>
        <B n={1} s={{ ...SZ, order: 0 }} />
        <B n={2} s={{ ...SZ, order: Number(v) }} />
        <B n={3} s={{ ...SZ, order: 0 }} />
      </div>
    ),
  },
]

const GRID_PROPS = [
  {
    prop: 'grid-template-columns',
    tag: 'container',
    desc: 'Defines the column track sizes. 1fr = one fraction of available space.',
    values: ['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)', '1fr 2fr', '80px 1fr 80px'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: v, gap: 6, padding: 10 }}>
        {[1, 2, 3, 4, 5, 6].map(n => <B key={n} n={n} s={{ height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'grid-template-rows',
    tag: 'container',
    desc: 'Defines the row track sizes.',
    values: ['auto', 'repeat(2, 40px)', '40px auto', '1fr 2fr'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: v, gap: 6, padding: 10, minHeight: 80 }}>
        {[1, 2, 3, 4, 5, 6].map(n => <B key={n} n={n} s={{ minHeight: 20 }} />)}
      </div>
    ),
  },
  {
    prop: 'gap',
    tag: 'container',
    desc: 'Sets spacing between rows and columns in the grid.',
    values: ['0', '4px', '8px', '16px'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: v, padding: 10 }}>
        {[1, 2, 3, 4, 5, 6].map(n => <B key={n} n={n} s={{ height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'justify-items',
    tag: 'container',
    desc: 'Aligns items within their cell along the row (inline) axis.',
    values: ['stretch', 'start', 'end', 'center'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10, height: 88, justifyItems: v }}>
        {[1, 2, 3].map(n => <B key={n} n={n} s={{ width: 28, height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'align-items',
    tag: 'container',
    desc: 'Aligns items within their cell along the column (block) axis.',
    values: ['stretch', 'start', 'end', 'center'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10, height: 88, alignItems: v }}>
        {[1, 2, 3].map(n => <B key={n} n={n} s={{ width: 28, height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'justify-content',
    tag: 'container',
    desc: 'Aligns the entire grid along the row axis when the grid is smaller than its container.',
    values: ['start', 'end', 'center', 'stretch', 'space-between', 'space-evenly'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 48px)', gap: 4, padding: 10, height: 72, alignItems: 'center', justifyContent: v }}>
        {[1, 2, 3].map(n => <B key={n} n={n} s={{ height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'align-content',
    tag: 'container',
    desc: 'Aligns the grid rows when the grid is shorter than its container.',
    values: ['start', 'end', 'center', 'stretch', 'space-between', 'space-around'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 28px)', gap: 4, padding: 10, height: 110, alignContent: v }}>
        {[1, 2, 3, 4, 5, 6].map(n => <B key={n} n={n} />)}
      </div>
    ),
  },
  {
    prop: 'grid-column',
    tag: 'item',
    desc: 'Controls how many columns item 1 spans, or its start/end lines.',
    values: ['auto', 'span 2', 'span 3', '1 / 3', '1 / -1'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10 }}>
        <B n={1} s={{ gridColumn: v, height: 28 }} />
        {[2, 3, 4, 5].map(n => <B key={n} n={n} s={{ height: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'grid-row',
    tag: 'item',
    desc: 'Controls how many rows item 1 spans, or its start/end lines.',
    values: ['auto', 'span 2', '1 / 3'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10 }}>
        <B n={1} s={{ gridRow: v, minHeight: 28 }} />
        {[2, 3, 4, 5, 6].map(n => <B key={n} n={n} s={{ minHeight: 28 }} />)}
      </div>
    ),
  },
  {
    prop: 'justify-self',
    tag: 'item',
    desc: 'Aligns item 2 within its cell along the row (inline) axis.',
    values: ['stretch', 'start', 'end', 'center'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10, height: 88, alignItems: 'center' }}>
        <B n={1} s={{ height: 28 }} />
        <B n={2} s={{ height: 28, width: 28, justifySelf: v }} />
        <B n={3} s={{ height: 28 }} />
      </div>
    ),
  },
  {
    prop: 'align-self',
    tag: 'item',
    desc: 'Aligns item 2 within its cell along the column (block) axis.',
    values: ['stretch', 'start', 'end', 'center'],
    render: v => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10, height: 88 }}>
        <B n={1} s={{ height: 28 }} />
        <B n={2} s={{ height: 28, width: 28, alignSelf: v }} />
        <B n={3} s={{ height: 28 }} />
      </div>
    ),
  },
]

export default function FlexboxGridCheatsheet() {
  const [tab, setTab] = useState('flex')
  const [selections, setSelections] = useState(() => {
    const init = {}
    FLEX_PROPS.forEach(p => { init[`flex/${p.prop}`] = p.values[0] })
    GRID_PROPS.forEach(p => { init[`grid/${p.prop}`] = p.values[0] })
    return init
  })

  useEffect(() => {
    document.title = 'Flexbox & CSS Grid Cheatsheet | OmniverseTools'
  }, [])

  function select(prop, value) {
    setSelections(prev => ({ ...prev, [`${tab}/${prop}`]: value }))
  }

  const props = tab === 'flex' ? FLEX_PROPS : GRID_PROPS

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Flexbox & CSS Grid Cheatsheet</h1>
      <p className="text-gray-400 mb-6">
        Interactive property reference — click any value to see the live effect instantly.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[['flex', 'Flexbox'], ['grid', 'CSS Grid']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === val
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-6 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 font-medium">container</span>
          <span className="text-gray-500">— applied to the parent</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 font-medium">item</span>
          <span className="text-gray-500">— applied to a child</span>
        </span>
      </div>

      {/* Property cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {props.map(({ prop, tag, desc, values, render }) => {
          const selKey = `${tab}/${prop}`
          const selected = selections[selKey]
          return (
            <div key={selKey} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <code className="text-orange-400 text-sm font-mono font-semibold">{prop}</code>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  tag === 'container'
                    ? 'bg-blue-900/40 text-blue-300'
                    : 'bg-purple-900/40 text-purple-300'
                }`}>
                  {tag}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">{desc}</p>

              {/* Value buttons */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {values.map(v => (
                  <button
                    key={v}
                    onClick={() => select(prop, v)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                      selected === v
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Live preview */}
              <div className="rounded-lg overflow-hidden border border-zinc-700" style={{ background: '#0a0a0b' }}>
                {render(selected)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Click any value button to see its effect rendered live — no page reload needed.
          Properties marked <span className="text-blue-300">container</span> are set on the
          parent element (the flex or grid container); properties marked{' '}
          <span className="text-purple-300">item</span> are set on individual children.
          Everything runs entirely in your browser.
        </p>
      </div>
    </div>
  )
}
