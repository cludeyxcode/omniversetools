import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  QrCode, Braces, FileCode2, KeyRound, FileText, Ruler, Pipette, SearchCode,
  Link2, FileType2, Hash, Clock, Image, GitCompare, ShieldCheck, Paintbrush,
  Code2, CalendarClock, AlignLeft, Binary, Fingerprint, CaseSensitive, Database,
  Code, Percent, Cake, ArrowUpDown, Scale, Flame, Weight, Receipt, Landmark,
  TrendingUp, Shuffle, Calculator, CalendarRange, Globe, Slash, Table2, Palette,
  Lock, BarChart2, BookOpen, Type, Ratio, Crown, Tag, DollarSign, Building2, Activity,
  Droplets,
  Layers,
  Square,
  Maximize2,
  LayoutGrid,
  ArrowLeftRight,
  Globe2,
  Server,
  Sliders,
  Key,
  TableProperties,
  GitBranch,
  Network,
  Plug,
  ScanEye,
  FileSpreadsheet,
  ImageDown,
  Languages,
  Share2,
  Boxes,
  Bot,
  Replace,
  Terminal,
  UserCog,
  Shield,
  Timer,
  Package,
  BookMarked,
  Scaling,
  Tags,
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
      { path: '/tools/base64-image-viewer',    Icon: ScanEye,      title: 'Base64 Image Data URI Viewer', desc: 'Paste a data:image/…;base64,… URI to instantly preview the image and inspect its MIME type, dimensions, and file size.' },
      { path: '/tools/csv-viewer',             Icon: FileSpreadsheet, title: 'CSV Viewer',                  desc: 'Drag-drop or paste a CSV file to view it as a sortable, searchable table — all in your browser, no upload.' },
      { path: '/tools/image-compressor',       Icon: ImageDown,       title: 'Image Compressor',             desc: 'Compress JPG, PNG, or WebP images in your browser using the Canvas API — pick quality, resize, and download. Nothing is uploaded.' },
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
      { path: '/tools/css-gradient-generator',    Icon: Layers,  title: 'CSS Gradient Generator',      desc: 'Build a linear or radial CSS gradient visually — adjust angle and colour stops, then copy the CSS.' },
      { path: '/tools/css-box-shadow-generator',  Icon: Square,    title: 'CSS Box Shadow Generator',    desc: 'Build a CSS box shadow visually — adjust offset, blur, spread, and colour for multiple layers, then copy the rule.' },
      { path: '/tools/px-rem-converter',          Icon: Maximize2, title: 'Pixel ↔ REM / EM Converter',   desc: 'Convert between px, rem, and em instantly. Set your base font size and type in any field to update the rest.' },
      { path: '/tools/flexbox-grid-cheatsheet',  Icon: LayoutGrid, title: 'Flexbox & CSS Grid Cheatsheet', desc: 'Interactive property reference for Flexbox and CSS Grid — click any value to see the live effect.' },
      { path: '/tools/yaml-json-converter',       Icon: ArrowLeftRight, title: 'YAML ↔ JSON Converter',       desc: 'Paste YAML and get JSON (or vice versa) instantly — bidirectional conversion, runs entirely in your browser.' },
      { path: '/tools/url-parser',                Icon: Globe2,         title: 'URL Parser / Builder',         desc: 'Paste any URL to break it into protocol, host, path, query params, and fragment — edit each field to rebuild the URL.' },
      { path: '/tools/http-status-codes',         Icon: Server,         title: 'HTTP Status Code Reference',   desc: 'Searchable reference for all HTTP status codes — 1xx to 5xx — with plain-English descriptions and when to use each.' },
      { path: '/tools/cron-builder',              Icon: Sliders,        title: 'Cron Expression Builder',       desc: 'Build a cron schedule visually — pick options for each field (minute, hour, day, month, weekday) and get the cron string.' },
      { path: '/tools/jwt-generator',             Icon: Key,            title: 'JWT Generator',                  desc: 'Generate signed HS256, HS384, or HS512 JSON Web Tokens in your browser — set payload claims and secret, copy the token.' },
      { path: '/tools/markdown-table-generator',  Icon: TableProperties, title: 'Markdown Table Generator',        desc: 'Paste CSV or tab-separated data and instantly get a formatted | col | col | Markdown table with column alignment options.' },
      { path: '/tools/gitignore-generator',        Icon: GitBranch,       title: '.gitignore Generator',             desc: 'Select your stack (Node, Python, Go, Rust, Django, Rails, macOS, VS Code…) and get the right .gitignore file instantly.' },
      { path: '/tools/ip-subnet-calculator',       Icon: Network,         title: 'IP Subnet / CIDR Calculator',      desc: 'Enter a CIDR block like 10.0.0.0/24 to get the network address, broadcast, usable host range, subnet mask, and binary breakdown.' },
      { path: '/tools/port-reference',             Icon: Plug,            title: 'Port Number Reference',             desc: 'Searchable table of well-known TCP/UDP ports — SSH (22), HTTP (80), MySQL (3306), and 50+ more with protocol and description.' },
      { path: '/tools/unicode-search',              Icon: Languages,       title: 'Unicode / Symbol Search',           desc: 'Search 200+ Unicode characters — arrows, math symbols, currency, Greek letters, and more. Click any symbol to copy it.' },
      { path: '/tools/meta-tags-generator',          Icon: Share2,          title: 'Meta / OG Tags Generator',          desc: 'Fill in title, description, image URL, and Twitter handle to get the full Open Graph and meta tag snippet — with live social card preview.' },
      { path: '/tools/schema-markup-generator',      Icon: Boxes,           title: 'Schema Markup Generator',           desc: 'Pick a schema type (Product, Article, FAQ, LocalBusiness, BreadcrumbList), fill in the fields, and get the JSON-LD script block to add to any page.' },
      { path: '/tools/robots-txt-generator',         Icon: Bot,             title: 'Robots.txt Generator',              desc: 'Build a robots.txt file visually — start from a WordPress, Shopify, or generic preset, add Allow/Disallow rules, and copy the finished file.' },
      { path: '/tools/redirect-map-builder',          Icon: Replace,         title: '301 Redirect Map Builder',           desc: 'Paste old → new URL pairs and get .htaccess RewriteRules, Nginx rewrite directives, or a Shopify CSV redirect import file in one click.' },
      { path: '/tools/php-serialize',                 Icon: Terminal,        title: 'PHP Serialize / Unserialize',         desc: 'Decode PHP serialized strings (WordPress wp_options, ACF fields, WooCommerce sessions) to readable JSON — and serialize JSON back to PHP format.' },
      { path: '/tools/wp-password-hash',              Icon: UserCog,         title: 'WordPress Password Hash Generator',   desc: 'Generate a phpass-compatible hash to paste into wp_users.user_pass for emergency admin recovery — verify existing hashes too. Runs entirely in your browser.' },
      { path: '/tools/htaccess-generator',            Icon: Shield,          title: '.htaccess Generator',                 desc: 'Start from the standard WordPress permalink block, then toggle security rules: block XML-RPC, force HTTPS, restrict login by IP, set security headers, and more.' },
      { path: '/tools/wordpress-cron-viewer',          Icon: Timer,           title: 'WordPress Cron Viewer',               desc: 'Paste the serialized cron value from wp_options to decode and display all scheduled events — hook name, schedule, interval, next run — without opening phpMyAdmin.' },
      { path: '/tools/shopify-variant-matrix',          Icon: Package,         title: 'Shopify Variant Matrix',              desc: 'Enter product options (Size, Colour, etc.) and their values to instantly see every variant combination, total count, and a CSV-ready export for Shopify import.' },
      { path: '/tools/liquid-filter-reference',          Icon: BookMarked,      title: 'Liquid Filter & Tag Reference',       desc: 'Searchable cheatsheet for all Shopify Liquid filters (upcase, split, where, money…) and tags (for, if, paginate, render…) with syntax and examples.' },
      { path: '/tools/shopify-image-resizer',             Icon: Scaling,          title: 'Shopify Image URL Resizer',           desc: 'Paste a Shopify CDN image URL to instantly generate all size variants — _300x300, _master, _2048x2048, named presets, width-only, and crop variants side by side.' },
      { path: '/tools/shopify-metafield-builder',         Icon: Tags,             title: 'Shopify Metafield Builder',           desc: 'Define namespace, key, and type to get the Liquid reference syntax, REST API payload, and GraphQL mutation for any Shopify metafield — no docs lookup needed.' },
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
      { path: '/tools/water-intake-calculator',  Icon: Droplets,     title: 'Water Intake Calculator',        desc: 'Find your recommended daily water intake based on your weight, activity level, and climate. Results in litres, oz, cups, and glasses.' },
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
