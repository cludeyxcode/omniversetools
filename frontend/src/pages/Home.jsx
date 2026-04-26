import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  QrCode, Braces, FileCode2, KeyRound, FileText, Ruler, Pipette, SearchCode,
  Link2, FileType2, Hash, Clock, Image, GitCompare, ShieldCheck, Paintbrush,
  Code2, CalendarClock, AlignLeft, Binary, Fingerprint, CaseSensitive, Database,
  Code, Percent, Cake, ArrowUpDown, Scale, Flame, Weight, Receipt, Landmark,
  TrendingUp, Shuffle, Calculator, CalendarRange, Globe, Slash, Table2, Palette,
  Lock, BarChart2, BookOpen, Type, Ratio, Crown, Tag, DollarSign, Building2, Activity,
} from 'lucide-react'

const categories = [
  {
    name: 'Generators',
    tools: [
      { path: '/tools/qr-code',               Icon: QrCode,       title: 'QR Code Generator',          desc: 'Turn any link or text into a scannable QR code you can download as an image.' },
      { path: '/tools/password-generator',     Icon: KeyRound,     title: 'Password Generator',         desc: 'Create a strong, random password in one click. Set length and which characters to include.' },
      { path: '/tools/uuid-generator',         Icon: Fingerprint,  title: 'UUID Generator',             desc: 'Generate random v4 UUIDs instantly — copy one or bulk-generate up to 50 at a time.' },
      { path: '/tools/lorem-ipsum',            Icon: AlignLeft,    title: 'Lorem Ipsum Generator',      desc: 'Generate placeholder text for designs and mockups — choose words, sentences, or paragraphs.' },
      { path: '/tools/random-number-generator',Icon: Shuffle,      title: 'Random Number Generator',    desc: 'Generate random integers in any range — set quantity, no-duplicates, and optional sorting.' },
    ],
  },
  {
    name: 'Text Tools',
    tools: [
      { path: '/tools/word-counter',           Icon: FileText,     title: 'Word & Character Counter',   desc: 'Paste any text to instantly see its word count, character count, sentence count, and more.' },
      { path: '/tools/word-frequency-counter', Icon: BarChart2,    title: 'Word Frequency Counter',     desc: 'Paste text and see every word ranked by occurrence — great for writers and SEO keyword analysis.' },
      { path: '/tools/reading-time-estimator', Icon: BookOpen,     title: 'Reading Time Estimator',     desc: 'Paste an article and instantly see how long it takes to read — adjust the WPM to match your pace.' },
      { path: '/tools/character-limit-tester', Icon: Type,         title: 'Character Limit Tester',     desc: 'Live counters for Twitter (280), LinkedIn, SMS (160), meta description (160), and 9 more platforms.' },
      { path: '/tools/diff-checker',           Icon: GitCompare,   title: 'Text Diff Checker',          desc: 'Paste two versions of a text and see exactly what was added, removed, or changed.' },
      { path: '/tools/text-sorter',            Icon: ArrowUpDown,  title: 'Text Sorter & Line Tools',   desc: 'Sort lines alphabetically, remove duplicates, reverse, shuffle, or trim blank lines.' },
      { path: '/tools/markdown-previewer',     Icon: FileType2,    title: 'Markdown Previewer',         desc: 'Write Markdown on the left and see it rendered as formatted text on the right, live.' },
      { path: '/tools/slugify',                Icon: Slash,        title: 'Slugify Tool',               desc: 'Convert any title or phrase into a clean URL slug — "My Blog Post" → "my-blog-post".' },
    ],
  },
  {
    name: 'Encoding & Conversion',
    tools: [
      { path: '/tools/base64',                 Icon: FileCode2,    title: 'Base64 Encoder / Decoder',   desc: 'Convert text into a compact format used in emails and APIs — and decode it back.' },
      { path: '/tools/url-encoder',            Icon: Link2,        title: 'URL Encoder / Decoder',      desc: 'Fix URLs that break because of spaces or special characters — encode or decode instantly.' },
      { path: '/tools/image-to-base64',        Icon: Image,        title: 'Image to Base64',            desc: 'Drop an image and get a code you can paste directly into HTML or CSS — no upload needed.' },
      { path: '/tools/hash-generator',         Icon: Hash,         title: 'Hash Generator',             desc: 'Create a unique fingerprint of any text — useful for verifying that a file has not been changed.' },
      { path: '/tools/number-base-converter',  Icon: Binary,       title: 'Number Base Converter',      desc: 'Convert numbers between decimal, binary, hex, and octal — type in any field to update all.' },
      { path: '/tools/html-entity-encoder',    Icon: Code,         title: 'HTML Entity Encoder / Decoder', desc: 'Convert special characters like < > & into safe HTML entities — and decode them back.' },
      { path: '/tools/json-csv-converter',     Icon: Table2,       title: 'JSON ↔ CSV Converter',       desc: 'Convert between JSON arrays and CSV format — nested objects are flattened automatically.' },
    ],
  },
  {
    name: 'Developer Tools',
    tools: [
      { path: '/tools/json-formatter',         Icon: Braces,       title: 'JSON Formatter & Validator', desc: 'Paste messy JSON and instantly make it readable — also checks for errors.' },
      { path: '/tools/sql-formatter',          Icon: Database,     title: 'SQL Formatter',              desc: 'Paste messy SQL and get it back clean and readable. Supports MySQL, PostgreSQL, SQLite, and more.' },
      { path: '/tools/string-case-converter',  Icon: CaseSensitive,title: 'String Case Converter',      desc: 'Convert text between camelCase, snake_case, kebab-case, PascalCase, and 6 more formats at once.' },
      { path: '/tools/regex-tester',           Icon: SearchCode,   title: 'Regex Tester',               desc: 'Write a search pattern and test it against text — matches highlight in real time.' },
      { path: '/tools/jwt-decoder',            Icon: ShieldCheck,  title: 'JWT Decoder',                desc: "Read what's inside a login token — see who it belongs to, what permissions it has, and when it expires." },
      { path: '/tools/timestamp-converter',    Icon: Clock,        title: 'Unix Timestamp Converter',   desc: 'Convert a number like 1700000000 into a real date and time — or pick a date to get its timestamp.' },
      { path: '/tools/css-minifier',           Icon: Paintbrush,   title: 'CSS Minifier & Beautifier',  desc: 'Compress CSS to shrink file size and speed up your site, or format messy CSS to read it.' },
      { path: '/tools/html-minifier',          Icon: Code2,        title: 'HTML Minifier & Beautifier', desc: 'Strip whitespace from HTML to make pages load faster, or prettify minified HTML to edit it.' },
      { path: '/tools/cron-explainer',         Icon: CalendarClock,title: 'CRON Expression Explainer',  desc: 'Paste a cron schedule like "0 9 * * 1" and get a plain-English explanation of when it runs.' },
      { path: '/tools/chmod-calculator',       Icon: Lock,         title: 'Chmod Calculator',           desc: 'Build Unix file permissions visually — click checkboxes and get the octal number and chmod command.' },
    ],
  },
  {
    name: 'Calculators',
    tools: [
      { path: '/tools/scientific-calculator',  Icon: Calculator,   title: 'Scientific Calculator',      desc: 'Full scientific calculator with sin, cos, tan, log, powers, square root, and constants.' },
      { path: '/tools/bmi-calculator',         Icon: Scale,        title: 'BMI Calculator',             desc: 'Calculate your Body Mass Index from your height and weight — metric and imperial supported.' },
      { path: '/tools/bmr-calculator',         Icon: Flame,        title: 'BMR & Calorie Calculator',   desc: 'Find your Basal Metabolic Rate and daily calorie needs using the Mifflin-St Jeor formula.' },
      { path: '/tools/ideal-weight-calculator',Icon: Weight,       title: 'Ideal Weight Calculator',    desc: 'Estimate ideal body weight using four medical formulas — Hamwi, Devine, Robinson, and Miller.' },
      { path: '/tools/tip-calculator',         Icon: Receipt,      title: 'Tip Calculator',             desc: 'Calculate tips and split the bill between any number of people instantly.' },
      { path: '/tools/loan-calculator',        Icon: Landmark,     title: 'Loan & EMI Calculator',      desc: 'Calculate your monthly payment and view the full amortisation schedule for any loan.' },
      { path: '/tools/compound-interest',      Icon: TrendingUp,   title: 'Compound Interest Calculator',desc: 'See how an investment grows over time — add regular contributions and compare compound frequencies.' },
      { path: '/tools/percentage-calculator',  Icon: Percent,      title: 'Percentage Calculator',      desc: 'Six percentage calculators in one — discounts, tax, growth rates, tips, and more.' },
      { path: '/tools/age-calculator',           Icon: Cake,         title: 'Age Calculator',             desc: 'Find out exactly how old someone is in years, months, days, weeks, and hours.' },
      { path: '/tools/aspect-ratio-calculator',  Icon: Ratio,        title: 'Aspect Ratio Calculator',    desc: 'Enter width × height to find the simplified ratio, then scale to any new dimension instantly.' },
      { path: '/tools/roman-numeral-converter',  Icon: Crown,        title: 'Roman Numeral Converter',    desc: 'Convert between decimal numbers and Roman numerals instantly — 1 to 3999, with step-by-step breakdown.' },
      { path: '/tools/vat-calculator',           Icon: Tag,          title: 'VAT / Sales Tax Calculator', desc: 'Add or remove VAT and sales tax from any price — pick a common rate or enter a custom percentage.' },
      { path: '/tools/currency-formatter',       Icon: DollarSign,   title: 'Currency Formatter',         desc: 'Format any number as money in any locale and currency — symbol, code, or full name. No exchange rates.' },
      { path: '/tools/mortgage-calculator',      Icon: Building2,    title: 'Mortgage Calculator',         desc: 'Enter home price, down payment, rate, and term to get your monthly payment, LTV ratio, and full amortisation schedule.' },
      { path: '/tools/body-fat-calculator',      Icon: Activity,     title: 'Body Fat Percentage Calculator', desc: 'Estimate body fat % using the US Navy method — enter neck, waist, and height (plus hip for women). No calipers needed.' },
    ],
  },
  {
    name: 'Date & Time',
    tools: [
      { path: '/tools/date-duration-calculator',Icon: CalendarRange,title: 'Date Duration Calculator',  desc: 'Find the exact number of days, weeks, months, and years between any two dates.' },
      { path: '/tools/timezone-converter',     Icon: Globe,        title: 'Time Zone Converter',        desc: 'Convert a date and time between any two time zones — 28 zones, DST handled automatically.' },
    ],
  },
  {
    name: 'Unit & Colour Converters',
    tools: [
      { path: '/tools/unit-converter',         Icon: Ruler,        title: 'Unit Converter',             desc: 'Convert between metres and feet, kilograms and pounds, Celsius and Fahrenheit, and more.' },
      { path: '/tools/color-converter',        Icon: Pipette,      title: 'Color Picker & Converter',   desc: 'Pick a colour and instantly convert between HEX (#ff6600), RGB, and HSL formats.' },
      { path: '/tools/color-palette-generator',Icon: Palette,      title: 'Colour Palette Generator',   desc: 'Pick a base colour and generate harmonious palettes — complementary, triadic, analogous, and more.' },
    ],
  },
]

const allTools = categories.flatMap(c => c.tools)

function ToolCard({ path, Icon, title, desc }) {
  return (
    <Link
      to={path}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500 hover:bg-zinc-800 transition-all group"
    >
      <div className="mb-3 w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
        <Icon size={20} className="text-orange-400" />
      </div>
      <h3 className="text-white font-semibold text-base mb-2 group-hover:text-orange-300 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </Link>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'Free Online Tools — OmniverseTools'
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? allTools.filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
    : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
        Free Online Utility Tools
      </h1>
      <p className="text-center text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
        No logins. No tracking. 100% free, browser-based tools that work instantly.
      </p>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-12">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${allTools.length} tools…`}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-11 pr-10 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search results */}
      {q && (
        <div>
          <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(t => <ToolCard key={t.path} {...t} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              No tools found for "<span className="text-gray-400">{query}</span>"
            </div>
          )}
        </div>
      )}

      {/* Category grid — hidden while searching */}
      {!q && (
        <div className="space-y-12">
          {categories.map(({ name, tools }) => (
            <section key={name}>
              <h2 className="text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">{name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools.map(t => <ToolCard key={t.path} {...t} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-center text-gray-600 text-sm mt-16">
        All tools run entirely in your browser — nothing is sent to any server.
      </p>
    </div>
  )
}
