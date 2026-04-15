import { useState, useEffect } from 'react'

function toWords(input) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
}

const CASES = [
  {
    key: 'camel',
    label: 'camelCase',
    example: 'myVariableName',
    convert: words => words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join(''),
  },
  {
    key: 'pascal',
    label: 'PascalCase',
    example: 'MyVariableName',
    convert: words => words.map(w => w[0].toUpperCase() + w.slice(1)).join(''),
  },
  {
    key: 'snake',
    label: 'snake_case',
    example: 'my_variable_name',
    convert: words => words.join('_'),
  },
  {
    key: 'screaming',
    label: 'SCREAMING_SNAKE',
    example: 'MY_VARIABLE_NAME',
    convert: words => words.join('_').toUpperCase(),
  },
  {
    key: 'kebab',
    label: 'kebab-case',
    example: 'my-variable-name',
    convert: words => words.join('-'),
  },
  {
    key: 'title',
    label: 'Title Case',
    example: 'My Variable Name',
    convert: words => words.map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
  },
  {
    key: 'lower',
    label: 'lowercase',
    example: 'my variable name',
    convert: words => words.join(' '),
  },
  {
    key: 'upper',
    label: 'UPPERCASE',
    example: 'MY VARIABLE NAME',
    convert: words => words.join(' ').toUpperCase(),
  },
  {
    key: 'dot',
    label: 'dot.case',
    example: 'my.variable.name',
    convert: words => words.join('.'),
  },
  {
    key: 'path',
    label: 'path/case',
    example: 'my/variable/name',
    convert: words => words.join('/'),
  },
]

export default function StringCaseConverter() {
  const [input, setInput] = useState('my variable name')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    document.title = 'String Case Converter — camelCase, snake_case, kebab-case | OmniverseTools'
  }, [])

  const words = toWords(input)
  const results = CASES.map(c => ({ ...c, output: input.trim() ? c.convert(words) : '' }))

  function copy(key, val) {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">String Case Converter</h1>
      <p className="text-gray-400 mb-6">
        Convert text between camelCase, snake_case, kebab-case, PascalCase, and more — instantly.
      </p>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Input — any format</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. my variable name, myVarName, my-var-name..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-orange-500"
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map(({ key, label, output }) => (
          <div key={key} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-400 text-xs font-semibold">{label}</span>
              <button
                onClick={() => copy(key, output)}
                disabled={!output}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 text-white px-3 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                {copied === key ? '✓' : 'Copy'}
              </button>
            </div>
            <code className="text-green-300 font-mono text-sm break-all">{output || '—'}</code>
          </div>
        ))}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Different programming languages and frameworks favour different naming conventions —
          JavaScript uses camelCase for variables, Python uses snake_case, CSS uses kebab-case,
          and so on. This tool detects your input format automatically and converts to all variants at once.
        </p>
      </div>
    </div>
  )
}
