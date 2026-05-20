import { useState, useEffect } from 'react'

const SCHEMA_TYPES = [
  { value: 'Product',        label: 'Product' },
  { value: 'Article',        label: 'Article' },
  { value: 'FAQ',            label: 'FAQ' },
  { value: 'LocalBusiness',  label: 'Local Business' },
  { value: 'BreadcrumbList', label: 'Breadcrumb List' },
]

function buildProduct(f) {
  const schema = { '@context': 'https://schema.org/', '@type': 'Product' }
  if (f.name)        schema.name = f.name
  if (f.description) schema.description = f.description
  if (f.image)       schema.image = f.image
  if (f.brand)       schema.brand = { '@type': 'Brand', name: f.brand }
  if (f.sku)         schema.sku = f.sku
  if (f.price || f.priceCurrency || f.availability || f.url) {
    schema.offers = { '@type': 'Offer' }
    if (f.price)         schema.offers.price = f.price
    if (f.priceCurrency) schema.offers.priceCurrency = f.priceCurrency
    if (f.availability)  schema.offers.availability = `https://schema.org/${f.availability}`
    if (f.url)           schema.offers.url = f.url
  }
  if (f.ratingValue || f.reviewCount) {
    schema.aggregateRating = { '@type': 'AggregateRating' }
    if (f.ratingValue) schema.aggregateRating.ratingValue = f.ratingValue
    if (f.reviewCount) schema.aggregateRating.reviewCount = f.reviewCount
  }
  return schema
}

function buildArticle(f) {
  const schema = { '@context': 'https://schema.org', '@type': 'Article' }
  if (f.headline)       schema.headline = f.headline
  if (f.description)    schema.description = f.description
  if (f.image)          schema.image = f.image
  if (f.authorName)     schema.author = { '@type': 'Person', name: f.authorName }
  if (f.datePublished)  schema.datePublished = f.datePublished
  if (f.dateModified)   schema.dateModified = f.dateModified
  if (f.publisherName) {
    schema.publisher = { '@type': 'Organization', name: f.publisherName }
    if (f.publisherLogo) schema.publisher.logo = { '@type': 'ImageObject', url: f.publisherLogo }
  }
  if (f.url) schema.url = f.url
  return schema
}

function buildFaq(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items
      .filter(i => i.q.trim() || i.a.trim())
      .map(i => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a },
      })),
  }
}

function buildLocalBusiness(f) {
  const schema = { '@context': 'https://schema.org', '@type': 'LocalBusiness' }
  if (f.name)        schema.name = f.name
  if (f.description) schema.description = f.description
  if (f.url)         schema.url = f.url
  if (f.telephone)   schema.telephone = f.telephone
  if (f.streetAddress || f.city || f.region || f.postalCode || f.country) {
    schema.address = { '@type': 'PostalAddress' }
    if (f.streetAddress) schema.address.streetAddress = f.streetAddress
    if (f.city)          schema.address.addressLocality = f.city
    if (f.region)        schema.address.addressRegion = f.region
    if (f.postalCode)    schema.address.postalCode = f.postalCode
    if (f.country)       schema.address.addressCountry = f.country
  }
  if (f.latitude && f.longitude) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: f.latitude, longitude: f.longitude }
  }
  if (f.openingHours) schema.openingHours = f.openingHours
  return schema
}

function buildBreadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter(i => i.name.trim() || i.url.trim())
      .map((i, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: i.name,
        item: i.url,
      })),
  }
}

const INP = 'w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500'
const LBL = 'text-xs text-gray-500 uppercase tracking-wide block mb-1'

function Field({ label, children }) {
  return (
    <div>
      <label className={LBL}>{label}</label>
      {children}
    </div>
  )
}

export default function SchemaMarkupGenerator() {
  const [schemaType, setSchemaType] = useState('Product')
  const [copied, setCopied] = useState(false)

  const [product, setProduct] = useState({
    name: 'Blue Running Shoes',
    description: 'High-performance running shoes with advanced cushioning technology.',
    image: '', brand: '', sku: '',
    price: '89.99', priceCurrency: 'USD',
    availability: 'InStock', url: '',
    ratingValue: '', reviewCount: '',
  })

  const [article, setArticle] = useState({
    headline: 'How to Build a Next.js App from Scratch',
    description: '', image: '', authorName: '',
    datePublished: new Date().toISOString().slice(0, 10),
    dateModified: '', publisherName: '', publisherLogo: '', url: '',
  })

  const [faqItems, setFaqItems] = useState([
    { q: 'What is structured data?', a: 'Structured data is a standardised format for providing information about a page and classifying the page content.' },
    { q: '', a: '' },
  ])

  const [business, setBusiness] = useState({
    name: '', description: '', url: '', telephone: '',
    streetAddress: '', city: '', region: '', postalCode: '',
    country: '', latitude: '', longitude: '', openingHours: '',
  })

  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: 'Home',    url: 'https://example.com/' },
    { name: 'Blog',    url: 'https://example.com/blog/' },
    { name: 'Article', url: '' },
  ])

  useEffect(() => { document.title = 'Schema Markup Generator | OmniverseTools' }, [])

  function getSchema() {
    switch (schemaType) {
      case 'Product':        return buildProduct(product)
      case 'Article':        return buildArticle(article)
      case 'FAQ':            return buildFaq(faqItems)
      case 'LocalBusiness':  return buildLocalBusiness(business)
      case 'BreadcrumbList': return buildBreadcrumb(breadcrumbs)
      default:               return {}
    }
  }

  const jsonStr = JSON.stringify(getSchema(), null, 2)
  const snippet = `<script type="application/ld+json">\n${jsonStr}\n</script>`

  function copy() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const upP = (k, v) => setProduct(p => ({ ...p, [k]: v }))
  const upA = (k, v) => setArticle(a => ({ ...a, [k]: v }))
  const upB = (k, v) => setBusiness(b => ({ ...b, [k]: v }))

  function upFaq(idx, key, val) {
    setFaqItems(items => items.map((it, i) => i === idx ? { ...it, [key]: val } : it))
  }
  function upCrumb(idx, key, val) {
    setBreadcrumbs(items => items.map((it, i) => i === idx ? { ...it, [key]: val } : it))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Schema Markup Generator</h1>
      <p className="text-gray-400 mb-8">
        Pick a schema type, fill in the fields, and get the{' '}
        <code className="text-orange-400 text-xs">{'<script type="application/ld+json">'}</code>{' '}
        block ready to drop into any page — works with WordPress, Shopify, or plain HTML.
      </p>

      {/* Type selector */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-5">
        <h2 className="text-white font-semibold mb-3">Schema Type</h2>
        <div className="flex flex-wrap gap-2">
          {SCHEMA_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setSchemaType(t.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                schemaType === t.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic fields */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-5 space-y-4">

        {/* Product */}
        {schemaType === 'Product' && (
          <>
            <h2 className="text-white font-semibold">Product Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Product Name">
                <input className={INP} value={product.name} onChange={e => upP('name', e.target.value)} placeholder="Blue Running Shoes" />
              </Field>
              <Field label="Brand">
                <input className={INP} value={product.brand} onChange={e => upP('brand', e.target.value)} placeholder="Nike" />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={INP + ' resize-none'} rows={2} value={product.description} onChange={e => upP('description', e.target.value)} placeholder="Brief product description…" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Image URL">
                <input className={INP} value={product.image} onChange={e => upP('image', e.target.value)} placeholder="https://example.com/img.jpg" spellCheck={false} />
              </Field>
              <Field label="SKU">
                <input className={INP} value={product.sku} onChange={e => upP('sku', e.target.value)} placeholder="SHO-BLU-42" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Price">
                <input className={INP} value={product.price} onChange={e => upP('price', e.target.value)} placeholder="89.99" />
              </Field>
              <Field label="Currency">
                <input className={INP} value={product.priceCurrency} onChange={e => upP('priceCurrency', e.target.value)} placeholder="USD" />
              </Field>
              <Field label="Availability">
                <select className={INP} value={product.availability} onChange={e => upP('availability', e.target.value)}>
                  <option value="InStock">In Stock</option>
                  <option value="OutOfStock">Out of Stock</option>
                  <option value="PreOrder">Pre-Order</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </Field>
            </div>
            <Field label="Product URL">
              <input className={INP} value={product.url} onChange={e => upP('url', e.target.value)} placeholder="https://example.com/product" spellCheck={false} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Rating (1–5)">
                <input className={INP} value={product.ratingValue} onChange={e => upP('ratingValue', e.target.value)} placeholder="4.5" />
              </Field>
              <Field label="Review Count">
                <input className={INP} value={product.reviewCount} onChange={e => upP('reviewCount', e.target.value)} placeholder="128" />
              </Field>
            </div>
          </>
        )}

        {/* Article */}
        {schemaType === 'Article' && (
          <>
            <h2 className="text-white font-semibold">Article Details</h2>
            <Field label={`Headline (${article.headline.length}/110)`}>
              <input className={INP} value={article.headline} onChange={e => upA('headline', e.target.value)} placeholder="Article headline…" />
            </Field>
            <Field label="Description">
              <textarea className={INP + ' resize-none'} rows={2} value={article.description} onChange={e => upA('description', e.target.value)} placeholder="Short summary of the article…" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Image URL">
                <input className={INP} value={article.image} onChange={e => upA('image', e.target.value)} placeholder="https://example.com/image.jpg" spellCheck={false} />
              </Field>
              <Field label="Author Name">
                <input className={INP} value={article.authorName} onChange={e => upA('authorName', e.target.value)} placeholder="Jane Smith" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date Published">
                <input type="date" className={INP} value={article.datePublished} onChange={e => upA('datePublished', e.target.value)} />
              </Field>
              <Field label="Date Modified">
                <input type="date" className={INP} value={article.dateModified} onChange={e => upA('dateModified', e.target.value)} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Publisher Name">
                <input className={INP} value={article.publisherName} onChange={e => upA('publisherName', e.target.value)} placeholder="Acme Media" />
              </Field>
              <Field label="Publisher Logo URL">
                <input className={INP} value={article.publisherLogo} onChange={e => upA('publisherLogo', e.target.value)} placeholder="https://example.com/logo.png" spellCheck={false} />
              </Field>
            </div>
            <Field label="Article URL">
              <input className={INP} value={article.url} onChange={e => upA('url', e.target.value)} placeholder="https://example.com/article" spellCheck={false} />
            </Field>
          </>
        )}

        {/* FAQ */}
        {schemaType === 'FAQ' && (
          <>
            <h2 className="text-white font-semibold">FAQ Questions & Answers</h2>
            <p className="text-gray-500 text-xs">Each question/answer pair becomes a schema.org Question entity. Add as many as you need.</p>
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-zinc-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-400 font-medium">Q{idx + 1}</span>
                  {faqItems.length > 1 && (
                    <button
                      onClick={() => setFaqItems(f => f.filter((_, i) => i !== idx))}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Field label="Question">
                  <input className={INP} value={item.q} onChange={e => upFaq(idx, 'q', e.target.value)} placeholder="What is…?" />
                </Field>
                <Field label="Answer">
                  <textarea className={INP + ' resize-none'} rows={2} value={item.a} onChange={e => upFaq(idx, 'a', e.target.value)} placeholder="The answer…" />
                </Field>
              </div>
            ))}
            <button
              onClick={() => setFaqItems(f => [...f, { q: '', a: '' }])}
              className="w-full py-2.5 rounded-lg text-sm bg-zinc-800 text-gray-400 hover:text-orange-400 hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              + Add Question
            </button>
          </>
        )}

        {/* Local Business */}
        {schemaType === 'LocalBusiness' && (
          <>
            <h2 className="text-white font-semibold">Local Business Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business Name">
                <input className={INP} value={business.name} onChange={e => upB('name', e.target.value)} placeholder="Joe's Coffee" />
              </Field>
              <Field label="Telephone">
                <input className={INP} value={business.telephone} onChange={e => upB('telephone', e.target.value)} placeholder="+1-212-555-0100" />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={INP + ' resize-none'} rows={2} value={business.description} onChange={e => upB('description', e.target.value)} placeholder="Brief description of the business…" />
            </Field>
            <Field label="Website URL">
              <input className={INP} value={business.url} onChange={e => upB('url', e.target.value)} placeholder="https://example.com" spellCheck={false} />
            </Field>
            <div className="border-t border-zinc-700 pt-4">
              <p className={LBL + ' mb-3'}>Address</p>
              <div className="space-y-3">
                <Field label="Street Address">
                  <input className={INP} value={business.streetAddress} onChange={e => upB('streetAddress', e.target.value)} placeholder="123 Main St" />
                </Field>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="City">
                    <input className={INP} value={business.city} onChange={e => upB('city', e.target.value)} placeholder="New York" />
                  </Field>
                  <Field label="State / Region">
                    <input className={INP} value={business.region} onChange={e => upB('region', e.target.value)} placeholder="NY" />
                  </Field>
                  <Field label="Postal Code">
                    <input className={INP} value={business.postalCode} onChange={e => upB('postalCode', e.target.value)} placeholder="10001" />
                  </Field>
                </div>
                <Field label="Country Code">
                  <input className={INP} value={business.country} onChange={e => upB('country', e.target.value)} placeholder="US" />
                </Field>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Latitude (optional)">
                <input className={INP} value={business.latitude} onChange={e => upB('latitude', e.target.value)} placeholder="40.7128" />
              </Field>
              <Field label="Longitude (optional)">
                <input className={INP} value={business.longitude} onChange={e => upB('longitude', e.target.value)} placeholder="-74.0060" />
              </Field>
            </div>
            <Field label="Opening Hours (e.g. Mo-Fr 09:00-17:00)">
              <input className={INP} value={business.openingHours} onChange={e => upB('openingHours', e.target.value)} placeholder="Mo-Fr 09:00-17:00" />
            </Field>
          </>
        )}

        {/* Breadcrumb */}
        {schemaType === 'BreadcrumbList' && (
          <>
            <h2 className="text-white font-semibold">Breadcrumb Items</h2>
            <p className="text-gray-500 text-xs">Items are numbered automatically starting from 1. The last item typically has no URL.</p>
            {breadcrumbs.map((item, idx) => (
              <div key={idx} className="bg-zinc-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-400 font-medium">Item {idx + 1}</span>
                  {breadcrumbs.length > 1 && (
                    <button
                      onClick={() => setBreadcrumbs(b => b.filter((_, i) => i !== idx))}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Label">
                    <input className={INP} value={item.name} onChange={e => upCrumb(idx, 'name', e.target.value)} placeholder="Home" />
                  </Field>
                  <Field label="URL">
                    <input className={INP} value={item.url} onChange={e => upCrumb(idx, 'url', e.target.value)} placeholder="https://example.com/" spellCheck={false} />
                  </Field>
                </div>
              </div>
            ))}
            <button
              onClick={() => setBreadcrumbs(b => [...b, { name: '', url: '' }])}
              className="w-full py-2.5 rounded-lg text-sm bg-zinc-800 text-gray-400 hover:text-orange-400 hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              + Add Item
            </button>
          </>
        )}
      </div>

      {/* Output */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Generated JSON-LD Snippet</h2>
          <button
            onClick={copy}
            className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Snippet'}
          </button>
        </div>
        <pre className="bg-zinc-800 rounded-lg p-4 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
          {snippet}
        </pre>
      </div>

      <div className="mt-6 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Schema markup (structured data) helps search engines understand your content and can unlock
          rich results in Google Search — star ratings for products, FAQ dropdowns, breadcrumb trails,
          and more. Paste the generated{' '}
          <code className="text-orange-400 text-xs">{'<script>'}</code> block inside the{' '}
          <code className="text-orange-400 text-xs">{'<head>'}</code> of your page. Validate your output
          with Google's Rich Results Test after adding it. All processing happens in your browser —
          nothing is sent to any server.
        </p>
      </div>
    </div>
  )
}
