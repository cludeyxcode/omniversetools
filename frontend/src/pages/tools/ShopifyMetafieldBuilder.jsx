import { useState, useEffect } from 'react'

const OWNER_TYPES = [
  { value: 'product',    label: 'Product',         liquidVar: 'product',    gidType: 'Product',        gqlOwnerType: 'PRODUCT',        restBase: '/admin/api/2024-01/products/{id}/metafields.json' },
  { value: 'variant',   label: 'Product Variant',  liquidVar: 'variant',    gidType: 'ProductVariant', gqlOwnerType: 'PRODUCTVARIANTS', restBase: '/admin/api/2024-01/products/{product_id}/variants/{variant_id}/metafields.json' },
  { value: 'customer',  label: 'Customer',         liquidVar: 'customer',   gidType: 'Customer',       gqlOwnerType: 'CUSTOMER',       restBase: '/admin/api/2024-01/customers/{id}/metafields.json' },
  { value: 'order',     label: 'Order',            liquidVar: 'order',      gidType: 'Order',          gqlOwnerType: 'ORDER',          restBase: '/admin/api/2024-01/orders/{id}/metafields.json' },
  { value: 'collection',label: 'Collection',       liquidVar: 'collection', gidType: 'Collection',     gqlOwnerType: 'COLLECTION',     restBase: '/admin/api/2024-01/custom_collections/{id}/metafields.json' },
  { value: 'blog',      label: 'Blog',             liquidVar: 'blog',       gidType: 'Blog',           gqlOwnerType: 'BLOG',           restBase: '/admin/api/2024-01/blogs/{id}/metafields.json' },
  { value: 'article',   label: 'Article',          liquidVar: 'article',    gidType: 'Article',        gqlOwnerType: 'ARTICLE',        restBase: '/admin/api/2024-01/blogs/{blog_id}/articles/{id}/metafields.json' },
  { value: 'page',      label: 'Page',             liquidVar: 'page',       gidType: 'Page',           gqlOwnerType: 'PAGE',           restBase: '/admin/api/2024-01/pages/{id}/metafields.json' },
  { value: 'shop',      label: 'Shop',             liquidVar: 'shop',       gidType: 'Shop',           gqlOwnerType: 'SHOP',           restBase: '/admin/api/2024-01/metafields.json' },
]

const METAFIELD_TYPES = [
  { value: 'single_line_text_field', label: 'Single line text',     group: 'Text',        example: 'Hello World' },
  { value: 'multi_line_text_field',  label: 'Multi-line text',      group: 'Text',        example: 'Line 1\nLine 2' },
  { value: 'rich_text_field',        label: 'Rich text',            group: 'Text',        example: '{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","value":"Hello"}]}]}' },
  { value: 'number_integer',         label: 'Integer',              group: 'Number',      example: '42' },
  { value: 'number_decimal',         label: 'Decimal',              group: 'Number',      example: '3.14' },
  { value: 'date',                   label: 'Date',                 group: 'Date & Time', example: '2024-01-15' },
  { value: 'date_time',              label: 'Date & time',          group: 'Date & Time', example: '2024-01-15T10:30:00' },
  { value: 'boolean',                label: 'Boolean',              group: 'Other',       example: 'true' },
  { value: 'color',                  label: 'Color',                group: 'Other',       example: '#FF6600' },
  { value: 'url',                    label: 'URL',                  group: 'Other',       example: 'https://example.com' },
  { value: 'json',                   label: 'JSON',                 group: 'Structured',  example: '{"key":"value"}' },
  { value: 'file_reference',         label: 'File reference',       group: 'Reference',   example: 'gid://shopify/MediaImage/123456789' },
  { value: 'page_reference',         label: 'Page reference',       group: 'Reference',   example: 'gid://shopify/Page/123456789' },
  { value: 'product_reference',      label: 'Product reference',    group: 'Reference',   example: 'gid://shopify/Product/123456789' },
  { value: 'variant_reference',      label: 'Variant reference',    group: 'Reference',   example: 'gid://shopify/ProductVariant/123456789' },
  { value: 'collection_reference',   label: 'Collection reference', group: 'Reference',   example: 'gid://shopify/Collection/123456789' },
  { value: 'rating',                 label: 'Rating',               group: 'Measurement', example: '{"value":"4.5","scale_min":"1","scale_max":"5"}' },
  { value: 'money',                  label: 'Money',                group: 'Measurement', example: '{"amount":"19.99","currency_code":"USD"}' },
  { value: 'volume',                 label: 'Volume',               group: 'Measurement', example: '{"value":1.5,"unit":"LITERS"}' },
  { value: 'weight',                 label: 'Weight',               group: 'Measurement', example: '{"value":0.5,"unit":"KILOGRAMS"}' },
  { value: 'dimension',              label: 'Dimension',            group: 'Measurement', example: '{"value":10.0,"unit":"CENTIMETERS"}' },
]

const GROUPS = ['Text', 'Number', 'Date & Time', 'Other', 'Structured', 'Reference', 'Measurement']

function getLiquidSnippets(liquidVar, ns, key, type) {
  const ref = `${liquidVar}.metafields.${ns}.${key}`
  switch (type) {
    case 'single_line_text_field':
    case 'multi_line_text_field':
    case 'number_integer':
    case 'number_decimal':
    case 'color':
    case 'url':
      return [{ label: null, code: `{{ ${ref} }}` }]
    case 'rich_text_field':
      return [{ label: 'Render as HTML', code: `{{ ${ref}.value }}` }]
    case 'boolean':
      return [{ label: 'Conditional check', code: `{% if ${ref} == true %}\n  <!-- true branch -->\n{% endif %}` }]
    case 'date':
      return [
        { label: 'Formatted', code: `{{ ${ref} | date: "%B %d, %Y" }}` },
        { label: 'ISO', code: `{{ ${ref} | date: "%Y-%m-%d" }}` },
      ]
    case 'date_time':
      return [{ label: 'Formatted', code: `{{ ${ref} | date: "%B %d, %Y at %I:%M %p" }}` }]
    case 'json':
      return [{ label: 'Access parsed object', code: `{%- assign data = ${ref}.value -%}\n{{ data }}` }]
    case 'file_reference':
      return [
        { label: 'Image tag (recommended)', code: `{{ ${ref} | image_url: width: 600 | image_tag }}` },
        { label: 'Image src only', code: `{{ ${ref} | image_url: width: 600 }}` },
      ]
    case 'page_reference':
    case 'product_reference':
    case 'variant_reference':
    case 'collection_reference':
      return [{ label: 'Access referenced object', code: `{%- assign ref_obj = ${ref}.value -%}\n{{ ref_obj.title }}` }]
    case 'rating':
      return [{ label: 'Display rating', code: `{%- assign r = ${ref}.value -%}\n{{ r.value }} / {{ r.scale_max }}` }]
    case 'money':
      return [{ label: 'Display as money', code: `{{ ${ref} | money }}` }]
    default:
      return [{ label: null, code: `{{ ${ref} }}` }]
  }
}

export default function ShopifyMetafieldBuilder() {
  const [owner, setOwner] = useState('product')
  const [namespace, setNamespace] = useState('custom')
  const [key, setKey] = useState('')
  const [type, setType] = useState('single_line_text_field')
  const [copied, setCopied] = useState(null)

  useEffect(() => { document.title = 'Shopify Metafield Builder | OmniverseTools' }, [])

  const ownerObj = OWNER_TYPES.find(o => o.value === owner)
  const typeObj = METAFIELD_TYPES.find(t => t.value === type)
  const ns = namespace.trim() || 'custom'
  const k = key.trim() || 'my_field'
  const ready = namespace.trim().length > 0 && key.trim().length > 0

  function copy(text, id) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const liquidSnippets = ownerObj ? getLiquidSnippets(ownerObj.liquidVar, ns, k, type) : []
  const exampleValue = typeObj?.example ?? 'value'

  const restPayload = JSON.stringify({
    metafield: { namespace: ns, key: k, type, value: exampleValue },
  }, null, 2)

  const safeValue = exampleValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')

  const gqlSetMutation = `mutation MetafieldsSet {
  metafieldsSet(metafields: [
    {
      ownerId: "gid://shopify/${ownerObj?.gidType}/123456789"
      namespace: "${ns}"
      key: "${k}"
      type: "${type}"
      value: "${safeValue}"
    }
  ]) {
    metafields {
      id
      key
      namespace
      value
    }
    userErrors {
      field
      message
    }
  }
}`

  const definitionName = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const gqlDefinitionMutation = `mutation CreateDefinition {
  metafieldDefinitionCreate(definition: {
    name: "${definitionName}"
    namespace: "${ns}"
    key: "${k}"
    type: "${type}"
    ownerType: ${ownerObj?.gqlOwnerType}
  }) {
    createdDefinition {
      id
      name
      namespace
      key
    }
    userErrors {
      field
      message
    }
  }
}`

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Shopify Metafield Builder</h1>
      <p className="text-gray-400 mb-8">
        Define your metafield namespace, key, and type to instantly get the Liquid reference syntax,
        REST API payload, and GraphQL mutation — no more digging through the docs.
      </p>

      {/* Builder form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Owner Resource</label>
            <select
              value={owner}
              onChange={e => setOwner(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              {OWNER_TYPES.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Metafield Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              {GROUPS.map(group => {
                const items = METAFIELD_TYPES.filter(t => t.group === group)
                if (!items.length) return null
                return (
                  <optgroup key={group} label={group}>
                    {items.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Namespace</label>
            <input
              type="text"
              value={namespace}
              onChange={e => setNamespace(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
              placeholder="custom"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors"
            />
            <p className="text-xs text-gray-600 mt-1">e.g. custom, myapp, acf</p>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Key</label>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
              placeholder="my_field"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors"
            />
            <p className="text-xs text-gray-600 mt-1">snake_case recommended, max 30 chars</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!ready && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-12 text-center text-gray-500 text-sm">
          Enter a namespace and key above to generate all metafield references.
        </div>
      )}

      {/* Outputs */}
      {ready && (
        <div className="space-y-4">
          {/* Liquid */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-300 font-semibold text-base">Liquid Reference</h2>
              <span className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full">
                Theme templates
              </span>
            </div>
            <div className="space-y-3">
              {liquidSnippets.map((s, i) => (
                <div key={i}>
                  {s.label && (
                    <div className="text-xs text-gray-500 mb-1.5">{s.label}</div>
                  )}
                  <div className="flex items-start gap-3">
                    <code className="flex-1 block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono whitespace-pre break-all">{s.code}</code>
                    <button
                      onClick={() => copy(s.code, `liq-${i}`)}
                      className="shrink-0 text-xs bg-zinc-700 hover:bg-orange-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {copied === `liq-${i}` ? '✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REST API */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-300 font-semibold text-base">REST Admin API — Set Value</h2>
              <span className="text-xs px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full">
                POST
              </span>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Endpoint</div>
              <div className="flex items-start gap-3">
                <code className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-xs text-orange-300 font-mono break-all">
                  POST {ownerObj?.restBase}
                </code>
                <button
                  onClick={() => copy(`POST ${ownerObj?.restBase}`, 'rest-ep')}
                  className="shrink-0 text-xs bg-zinc-700 hover:bg-orange-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied === 'rest-ep' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Request body</div>
              <div className="flex items-start gap-3">
                <code className="flex-1 block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono whitespace-pre">{restPayload}</code>
                <button
                  onClick={() => copy(restPayload, 'rest-body')}
                  className="shrink-0 text-xs bg-zinc-700 hover:bg-orange-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied === 'rest-body' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* GraphQL - Set Value */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-300 font-semibold text-base">GraphQL Admin API — Set Value</h2>
              <span className="text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full">
                metafieldsSet
              </span>
            </div>
            <div className="flex items-start gap-3">
              <code className="flex-1 block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono whitespace-pre">{gqlSetMutation}</code>
              <button
                onClick={() => copy(gqlSetMutation, 'gql-set')}
                className="shrink-0 text-xs bg-zinc-700 hover:bg-orange-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied === 'gql-set' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* GraphQL - Definition */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-300 font-semibold text-base">GraphQL Admin API — Create Definition</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
                metafieldDefinitionCreate
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Register the definition so this metafield appears in Shopify Admin and can be set via the UI.
            </p>
            <div className="flex items-start gap-3">
              <code className="flex-1 block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono whitespace-pre">{gqlDefinitionMutation}</code>
              <button
                onClick={() => copy(gqlDefinitionMutation, 'gql-def')}
                className="shrink-0 text-xs bg-zinc-700 hover:bg-orange-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied === 'gql-def' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="mt-10 text-sm text-gray-500 leading-relaxed space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-gray-300 font-semibold text-base mb-3">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['Namespace', '"custom" is for merchant-defined metafields in Shopify Admin. App-owned metafields use an "app--{app_id}" prefix.'],
              ['Key', 'Must be unique within a namespace. Use snake_case — letters, numbers, and underscores only (max 30 chars).'],
              ['Type', 'Determines how the value is stored and validated. Pick the strictest type that fits your data.'],
              ['Definition vs. Value', 'Create a definition once to register the schema. Then set the value per-resource (each product, order, etc.) as needed.'],
            ].map(([term, def]) => (
              <div key={term} className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-3">
                <p className="text-orange-400 text-xs font-semibold mb-1">{term}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-gray-300 font-semibold text-base mb-3">Common Metafield Patterns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 pr-4 text-gray-400 font-medium">Use case</th>
                  <th className="text-left py-2 pr-4 text-gray-400 font-medium">Namespace</th>
                  <th className="text-left py-2 pr-4 text-gray-400 font-medium">Key</th>
                  <th className="text-left py-2 text-gray-400 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[
                  ['Product subtitle',    'custom', 'subtitle',          'single_line_text_field'],
                  ['Care instructions',   'custom', 'care_instructions', 'multi_line_text_field'],
                  ['Ingredients list',    'custom', 'ingredients',       'multi_line_text_field'],
                  ['Product video',       'custom', 'product_video',     'file_reference'],
                  ['Sale end date',       'custom', 'sale_end_date',     'date_time'],
                  ['Is featured',         'custom', 'is_featured',       'boolean'],
                  ['Average rating',      'custom', 'rating',            'rating'],
                  ['Before-sale price',   'custom', 'compare_price',     'money'],
                  ['Size chart image',    'custom', 'size_chart',        'file_reference'],
                  ['Related article',     'custom', 'related_article',   'page_reference'],
                ].map(([use, ns, k, t]) => (
                  <tr key={use}>
                    <td className="py-2 pr-4 text-gray-300">{use}</td>
                    <td className="py-2 pr-4 font-mono text-orange-400">{ns}</td>
                    <td className="py-2 pr-4 font-mono text-orange-400">{k}</td>
                    <td className="py-2 text-gray-400">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400/80 text-xs leading-relaxed">
          <strong className="text-blue-400">100% client-side:</strong> All syntax is generated in your browser. No data is sent to any server.
        </div>
      </div>
    </div>
  )
}
