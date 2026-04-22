import { useState, useEffect } from 'react'

const LOCALES = [
  { label: 'en-US (United States)', value: 'en-US' },
  { label: 'en-GB (United Kingdom)', value: 'en-GB' },
  { label: 'de-DE (Germany)', value: 'de-DE' },
  { label: 'fr-FR (France)', value: 'fr-FR' },
  { label: 'ja-JP (Japan)', value: 'ja-JP' },
  { label: 'en-IN (India)', value: 'en-IN' },
  { label: 'zh-CN (China)', value: 'zh-CN' },
  { label: 'en-CA (Canada)', value: 'en-CA' },
  { label: 'en-AU (Australia)', value: 'en-AU' },
  { label: 'de-CH (Switzerland)', value: 'de-CH' },
  { label: 'pt-BR (Brazil)', value: 'pt-BR' },
  { label: 'ko-KR (South Korea)', value: 'ko-KR' },
  { label: 'ru-RU (Russia)', value: 'ru-RU' },
  { label: 'ar-SA (Saudi Arabia)', value: 'ar-SA' },
  { label: 'nl-NL (Netherlands)', value: 'nl-NL' },
  { label: 'es-ES (Spain)', value: 'es-ES' },
  { label: 'it-IT (Italy)', value: 'it-IT' },
  { label: 'pl-PL (Poland)', value: 'pl-PL' },
  { label: 'sv-SE (Sweden)', value: 'sv-SE' },
  { label: 'nb-NO (Norway)', value: 'nb-NO' },
]

const CURRENCIES = [
  { label: 'USD — US Dollar', value: 'USD' },
  { label: 'EUR — Euro', value: 'EUR' },
  { label: 'GBP — British Pound', value: 'GBP' },
  { label: 'JPY — Japanese Yen', value: 'JPY' },
  { label: 'CAD — Canadian Dollar', value: 'CAD' },
  { label: 'AUD — Australian Dollar', value: 'AUD' },
  { label: 'CHF — Swiss Franc', value: 'CHF' },
  { label: 'CNY — Chinese Yuan', value: 'CNY' },
  { label: 'INR — Indian Rupee', value: 'INR' },
  { label: 'BRL — Brazilian Real', value: 'BRL' },
  { label: 'KRW — South Korean Won', value: 'KRW' },
  { label: 'MXN — Mexican Peso', value: 'MXN' },
  { label: 'SGD — Singapore Dollar', value: 'SGD' },
  { label: 'HKD — Hong Kong Dollar', value: 'HKD' },
  { label: 'NZD — New Zealand Dollar', value: 'NZD' },
  { label: 'NOK — Norwegian Krone', value: 'NOK' },
  { label: 'SEK — Swedish Krona', value: 'SEK' },
  { label: 'DKK — Danish Krone', value: 'DKK' },
  { label: 'PLN — Polish Zloty', value: 'PLN' },
  { label: 'TRY — Turkish Lira', value: 'TRY' },
  { label: 'RUB — Russian Ruble', value: 'RUB' },
  { label: 'SAR — Saudi Riyal', value: 'SAR' },
  { label: 'AED — UAE Dirham', value: 'AED' },
  { label: 'ZAR — South African Rand', value: 'ZAR' },
  { label: 'THB — Thai Baht', value: 'THB' },
]

const POPULAR = [
  { locale: 'en-US', currency: 'USD', name: 'US Dollar' },
  { locale: 'en-GB', currency: 'GBP', name: 'British Pound' },
  { locale: 'de-DE', currency: 'EUR', name: 'Euro' },
  { locale: 'ja-JP', currency: 'JPY', name: 'Japanese Yen' },
  { locale: 'en-IN', currency: 'INR', name: 'Indian Rupee' },
  { locale: 'en-CA', currency: 'CAD', name: 'Canadian Dollar' },
  { locale: 'en-AU', currency: 'AUD', name: 'Australian Dollar' },
  { locale: 'de-CH', currency: 'CHF', name: 'Swiss Franc' },
]

function formatMoney(amount, locale, currency, display) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: display,
    }).format(amount)
  } catch {
    return '—'
  }
}

export default function CurrencyFormatter() {
  const [amount, setAmount]     = useState('1234.56')
  const [locale, setLocale]     = useState('en-US')
  const [currency, setCurrency] = useState('USD')
  const [copied, setCopied]     = useState('')

  useEffect(() => {
    document.title = 'Currency Formatter — Format Money in Any Locale | OmniverseTools'
  }, [])

  const num   = parseFloat(amount)
  const valid = amount !== '' && isFinite(num)

  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  const FORMATS = [
    { key: 'symbol', label: 'Symbol',    desc: 'e.g. $1,234.56'           },
    { key: 'code',   label: 'Code',      desc: 'e.g. USD 1,234.56'        },
    { key: 'name',   label: 'Full name', desc: 'e.g. 1,234.56 US dollars' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Currency Formatter</h1>
      <p className="text-gray-400 mb-8">
        Format any number as money in any locale and currency — symbol, code, or full name. Uses
        the browser's built-in Intl API. No exchange rates applied; this is a display formatter only.
      </p>

      {/* Inputs */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="e.g. 1234.56"
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-lg font-semibold focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Locale</label>
            <select
              value={locale}
              onChange={e => setLocale(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {LOCALES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {CURRENCIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formatted output */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden mb-4">
        {FORMATS.map(({ key, label, desc }, i) => {
          const value = valid ? formatMoney(num, locale, currency, key) : '—'
          return (
            <div
              key={key}
              className={`px-5 py-4 flex justify-between items-center gap-3 ${i > 0 ? 'border-t border-zinc-700' : ''}`}
            >
              <div>
                <div className="text-sm text-gray-300 font-medium">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`font-mono font-bold ${i === 0 ? 'text-orange-400 text-xl' : 'text-white text-base'}`}>
                  {value}
                </span>
                {valid && (
                  <button
                    onClick={() => copy(value, key)}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white px-2 py-1 rounded transition-colors border border-zinc-700 whitespace-nowrap"
                  >
                    {copied === key ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Popular currencies reference */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-zinc-700">
          <h2 className="text-white font-semibold text-sm">Same number in popular currencies</h2>
          <p className="text-xs text-gray-500 mt-0.5">Each formatted in its native locale — symbol style</p>
        </div>
        <div className="divide-y divide-zinc-800">
          {POPULAR.map(({ locale: loc, currency: cur, name }) => {
            const formatted = valid ? formatMoney(num, loc, cur, 'symbol') : '—'
            return (
              <div key={cur} className="px-5 py-3 flex justify-between items-center">
                <div>
                  <span className="text-gray-200 text-sm font-medium">{cur}</span>
                  <span className="text-gray-500 text-xs ml-2">{name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-white">{formatted}</span>
                  {valid && (
                    <button
                      onClick={() => copy(formatted, cur)}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white px-2 py-1 rounded transition-colors border border-zinc-700"
                    >
                      {copied === cur ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">How it works</h2>
        <p className="mb-2">
          This tool uses the browser's built-in{' '}
          <code className="text-orange-300 bg-zinc-800 px-1 rounded text-xs">Intl.NumberFormat</code> API
          with <code className="text-orange-300 bg-zinc-800 px-1 rounded text-xs">style: 'currency'</code>.
          No exchange rates are applied — the number is formatted as-is for the chosen locale and currency code.
        </p>
        <p>
          The <strong className="text-gray-400">locale</strong> controls separators and symbol placement
          (e.g. German uses a comma for decimals). The <strong className="text-gray-400">currency</strong> controls
          which symbol or code is shown. Mix freely — USD formatted in a German locale gives{' '}
          <span className="text-gray-300 font-mono">1.234,56 $</span>.
        </p>
      </div>
    </div>
  )
}
