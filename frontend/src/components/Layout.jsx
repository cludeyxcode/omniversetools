import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const categories = [
  {
    name: 'Generators',
    tools: [
      { path: '/tools/qr-code',                label: 'QR Code Generator' },
      { path: '/tools/password-generator',      label: 'Password Generator' },
      { path: '/tools/uuid-generator',          label: 'UUID Generator' },
      { path: '/tools/lorem-ipsum',             label: 'Lorem Ipsum Generator' },
      { path: '/tools/random-number-generator', label: 'Random Number Generator' },
    ],
  },
  {
    name: 'Text Tools',
    tools: [
      { path: '/tools/word-counter',            label: 'Word Counter' },
      { path: '/tools/word-frequency-counter',  label: 'Word Frequency Counter' },
      { path: '/tools/reading-time-estimator',  label: 'Reading Time Estimator' },
      { path: '/tools/character-limit-tester',  label: 'Character Limit Tester' },
      { path: '/tools/diff-checker',       label: 'Text Diff Checker' },
      { path: '/tools/text-sorter',        label: 'Text Sorter & Line Tools' },
      { path: '/tools/markdown-previewer', label: 'Markdown Previewer' },
      { path: '/tools/slugify',            label: 'Slugify Tool' },
    ],
  },
  {
    name: 'Encoding & Conversion',
    tools: [
      { path: '/tools/base64',               label: 'Base64 Encoder / Decoder' },
      { path: '/tools/url-encoder',          label: 'URL Encoder / Decoder' },
      { path: '/tools/html-entity-encoder',  label: 'HTML Entity Encoder' },
      { path: '/tools/image-to-base64',      label: 'Image to Base64' },
      { path: '/tools/hash-generator',       label: 'Hash Generator' },
      { path: '/tools/number-base-converter',label: 'Number Base Converter' },
      { path: '/tools/json-csv-converter',   label: 'JSON ↔ CSV Converter' },
    ],
  },
  {
    name: 'Developer Tools',
    tools: [
      { path: '/tools/json-formatter',       label: 'JSON Formatter' },
      { path: '/tools/sql-formatter',        label: 'SQL Formatter' },
      { path: '/tools/string-case-converter',label: 'String Case Converter' },
      { path: '/tools/regex-tester',         label: 'Regex Tester' },
      { path: '/tools/jwt-decoder',          label: 'JWT Decoder' },
      { path: '/tools/timestamp-converter',  label: 'Timestamp Converter' },
      { path: '/tools/css-minifier',         label: 'CSS Minifier / Beautifier' },
      { path: '/tools/html-minifier',        label: 'HTML Minifier / Beautifier' },
      { path: '/tools/cron-explainer',       label: 'CRON Explainer' },
      { path: '/tools/chmod-calculator',     label: 'Chmod Calculator' },
    ],
  },
  {
    name: 'Calculators',
    tools: [
      { path: '/tools/scientific-calculator',   label: 'Scientific Calculator' },
      { path: '/tools/bmi-calculator',          label: 'BMI Calculator' },
      { path: '/tools/bmr-calculator',          label: 'BMR & Calorie Calculator' },
      { path: '/tools/ideal-weight-calculator', label: 'Ideal Weight Calculator' },
      { path: '/tools/tip-calculator',          label: 'Tip Calculator' },
      { path: '/tools/loan-calculator',         label: 'Loan & EMI Calculator' },
      { path: '/tools/compound-interest',       label: 'Compound Interest Calculator' },
      { path: '/tools/percentage-calculator',   label: 'Percentage Calculator' },
      { path: '/tools/age-calculator',           label: 'Age Calculator' },
      { path: '/tools/aspect-ratio-calculator',  label: 'Aspect Ratio Calculator' },
      { path: '/tools/roman-numeral-converter',  label: 'Roman Numeral Converter' },
      { path: '/tools/vat-calculator',           label: 'VAT / Sales Tax Calculator' },
      { path: '/tools/currency-formatter',       label: 'Currency Formatter' },
      { path: '/tools/mortgage-calculator',      label: 'Mortgage Calculator' },
      { path: '/tools/body-fat-calculator',      label: 'Body Fat Calculator' },
    ],
  },
  {
    name: 'Date & Time',
    tools: [
      { path: '/tools/date-duration-calculator', label: 'Date Duration Calculator' },
      { path: '/tools/timezone-converter',       label: 'Time Zone Converter' },
    ],
  },
  {
    name: 'Unit & Colour',
    tools: [
      { path: '/tools/unit-converter',          label: 'Unit Converter' },
      { path: '/tools/color-converter',         label: 'Color Converter' },
      { path: '/tools/color-palette-generator', label: 'Colour Palette Generator' },
    ],
  },
]

const allTools = categories.flatMap(c => c.tools)

export default function Layout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownQuery, setDropdownQuery] = useState('')
  const dropdownRef = useRef()

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
    setDropdownQuery('')
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => { if (!e.target.closest('header')) setMenuOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [dropdownOpen])

  const activeTool = allTools.find(t => t.path === pathname)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-gray-100">
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent shrink-0">
            OmniverseTools
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname === '/' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white hover:bg-zinc-800'}`}
            >
              All Tools
            </Link>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${activeTool ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white hover:bg-zinc-800'}`}
              >
                {activeTool ? activeTool.label : 'Browse Tools'}
                <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (() => {
                const dq = dropdownQuery.trim().toLowerCase()
                const flatFiltered = dq ? allTools.filter(t => t.label.toLowerCase().includes(dq)) : null
                return (
                <div className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* Search input */}
                  <div className="p-2 border-b border-zinc-800">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                      <input
                        type="text"
                        value={dropdownQuery}
                        onChange={e => setDropdownQuery(e.target.value)}
                        placeholder="Search tools…"
                        autoFocus
                        className="w-full bg-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-[70vh] py-2">
                  {flatFiltered ? (
                    flatFiltered.length > 0 ? flatFiltered.map(t => (
                      <Link key={t.path} to={t.path}
                        className={`block px-4 py-2 text-sm transition-colors ${pathname === t.path ? 'bg-orange-600/20 text-orange-300' : 'text-gray-300 hover:bg-zinc-800 hover:text-white'}`}>
                        {t.label}
                      </Link>
                    )) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No results</div>
                    )
                  ) : categories.map(({ name, tools }) => (
                    <div key={name} className="mb-2 last:mb-0">
                      <div className="px-4 py-1 text-xs font-semibold uppercase tracking-widest text-orange-500">
                        {name}
                      </div>
                      {tools.map(t => (
                        <Link
                          key={t.path}
                          to={t.path}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            pathname === t.path
                              ? 'bg-orange-600/20 text-orange-300'
                              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                  </div>
                </div>
                )
              })()}
            </div>
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-gray-300 transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-300 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-300 transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 overflow-y-auto max-h-[75vh]">
            <Link
              to="/"
              className={`block mb-4 px-3 py-2.5 rounded-lg text-sm text-center transition-colors ${
                pathname === '/' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-zinc-800 text-gray-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              All Tools
            </Link>
            {categories.map(({ name, tools }) => (
              <div key={name} className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2 px-1">{name}</div>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map(t => (
                    <Link
                      key={t.path}
                      to={t.path}
                      className={`px-3 py-2.5 rounded-lg text-xs text-center transition-colors ${
                        pathname === t.path
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-zinc-800 text-gray-300 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} OmniverseTools — Free online tools. No logins. No tracking.</p>
      </footer>
    </div>
  )
}
