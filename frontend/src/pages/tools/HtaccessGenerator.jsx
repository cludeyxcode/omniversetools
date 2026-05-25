import { useState, useEffect } from 'react'

const WP_PERMALINK = `# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress`

function buildHtaccess({ forceHttps, disableDirListing, blockXmlrpc, protectFiles, securityHeaders, limitLoginIp, loginIps, blockHotlinking, hotlinkDomain, enableGzip }) {
  const sections = []

  if (forceHttps) {
    sections.push(`# Force HTTPS
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>`)
  }

  if (disableDirListing) {
    sections.push(`# Disable directory listing
Options -Indexes`)
  }

  sections.push(WP_PERMALINK)

  if (blockXmlrpc) {
    sections.push(`# Block XML-RPC
<Files xmlrpc.php>
  Order Deny,Allow
  Deny from all
</Files>`)
  }

  if (limitLoginIp) {
    const ipLines = loginIps
      .split(/[\n,]+/)
      .map(ip => ip.trim())
      .filter(Boolean)
      .map(ip => `  Allow from ${ip}`)
      .join('\n')
    sections.push(`# Restrict wp-login.php to specific IPs
<Files wp-login.php>
  Order Deny,Allow
  Deny from all
${ipLines || '  # Add your IP address(es) above'}
</Files>`)
  }

  if (protectFiles) {
    sections.push(`# Protect sensitive files
<FilesMatch "^(readme\\.html|readme\\.txt|licence\\.txt|license\\.txt|wp-config-sample\\.php|\\.htpasswd)$">
  Order Deny,Allow
  Deny from all
</FilesMatch>`)
  }

  if (securityHeaders) {
    sections.push(`# Security headers
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>`)
  }

  if (enableGzip) {
    sections.push(`# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json text/xml application/xml image/svg+xml
</IfModule>`)
  }

  if (blockHotlinking) {
    const domain = hotlinkDomain.trim() || 'your-domain.com'
    const escaped = domain.replace(/\./g, '\\.')
    sections.push(`# Block image hotlinking
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?${escaped} [NC]
RewriteRule \\.(jpg|jpeg|png|gif|svg|webp)$ - [F,NC]
</IfModule>`)
  }

  return sections.join('\n\n')
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 mt-0.5 w-9 h-5 rounded-full transition-colors focus:outline-none ${checked ? 'bg-orange-500' : 'bg-zinc-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
      <div>
        <div className="text-sm text-white font-medium leading-snug group-hover:text-orange-300 transition-colors">{label}</div>
        {desc && <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>}
      </div>
    </label>
  )
}

export default function HtaccessGenerator() {
  const [forceHttps, setForceHttps]           = useState(false)
  const [disableDirListing, setDisableDirListing] = useState(true)
  const [blockXmlrpc, setBlockXmlrpc]         = useState(true)
  const [protectFiles, setProtectFiles]       = useState(true)
  const [securityHeaders, setSecurityHeaders] = useState(false)
  const [limitLoginIp, setLimitLoginIp]       = useState(false)
  const [loginIps, setLoginIps]               = useState('')
  const [enableGzip, setEnableGzip]           = useState(false)
  const [blockHotlinking, setBlockHotlinking] = useState(false)
  const [hotlinkDomain, setHotlinkDomain]     = useState('')
  const [copied, setCopied]                   = useState(false)

  useEffect(() => { document.title = '.htaccess Generator | OmniverseTools' }, [])

  const output = buildHtaccess({
    forceHttps, disableDirListing, blockXmlrpc, protectFiles,
    securityHeaders, limitLoginIp, loginIps,
    blockHotlinking, hotlinkDomain, enableGzip,
  })

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function download() {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.htaccess'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">.htaccess Generator</h1>
      <p className="text-gray-400 mb-8">
        Start from the standard WordPress permalink block, then toggle optional security rules. The
        output updates live — copy or download the finished{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">.htaccess</code> file.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Base block notice */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Base Block</h2>
            <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-3">
              <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">Always included</p>
              <p className="text-xs text-gray-400">Standard WordPress permalink rewrite rules — managed by WordPress and always needed for pretty permalinks.</p>
            </div>
          </div>

          {/* Security rule toggles */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
            <h2 className="text-white font-semibold">Optional Rules</h2>

            <Toggle
              checked={forceHttps}
              onChange={setForceHttps}
              label="Force HTTPS (301 redirect)"
              desc="Redirect all HTTP requests to HTTPS via mod_rewrite — place above the WordPress block."
            />

            <Toggle
              checked={disableDirListing}
              onChange={setDisableDirListing}
              label="Disable directory listing"
              desc="Prevents visitors from browsing folder contents when no index file exists (Options -Indexes)."
            />

            <Toggle
              checked={blockXmlrpc}
              onChange={setBlockXmlrpc}
              label="Block XML-RPC"
              desc="Denies all requests to xmlrpc.php — reduces brute-force and DDoS attack surface."
            />

            <Toggle
              checked={protectFiles}
              onChange={setProtectFiles}
              label="Protect sensitive files"
              desc="Blocks public access to readme.html, licence.txt, wp-config-sample.php, and .htpasswd."
            />

            <Toggle
              checked={securityHeaders}
              onChange={setSecurityHeaders}
              label="Set security headers"
              desc="Adds X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, and Referrer-Policy via mod_headers."
            />

            <div className="space-y-3">
              <Toggle
                checked={limitLoginIp}
                onChange={v => { setLimitLoginIp(v); if (!v) setLoginIps('') }}
                label="Restrict wp-login.php to IPs"
                desc="Only listed IP addresses can access the WordPress login page."
              />
              {limitLoginIp && (
                <div className="ml-12">
                  <label className="text-xs text-gray-400 block mb-1">Allowed IPs — one per line or comma-separated</label>
                  <textarea
                    rows={3}
                    value={loginIps}
                    onChange={e => setLoginIps(e.target.value)}
                    placeholder={'203.0.113.1\n198.51.100.0/24'}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
              )}
            </div>

            <Toggle
              checked={enableGzip}
              onChange={setEnableGzip}
              label="Enable GZIP compression"
              desc="Compresses HTML, CSS, JS, and JSON to reduce page load time (requires mod_deflate)."
            />

            <div className="space-y-3">
              <Toggle
                checked={blockHotlinking}
                onChange={v => { setBlockHotlinking(v); if (!v) setHotlinkDomain('') }}
                label="Block image hotlinking"
                desc="Prevents external sites from embedding your images directly and using your bandwidth."
              />
              {blockHotlinking && (
                <div className="ml-12">
                  <label className="text-xs text-gray-400 block mb-1">Your domain (e.g. example.com)</label>
                  <input
                    type="text"
                    value={hotlinkDomain}
                    onChange={e => setHotlinkDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">.htaccess Output</h2>
            <div className="flex gap-2">
              <button
                onClick={download}
                className="text-sm bg-zinc-700 hover:bg-zinc-600 text-gray-300 hover:text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Download
              </button>
              <button
                onClick={copy}
                className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <pre className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-xs font-mono text-gray-300 overflow-auto whitespace-pre leading-relaxed min-h-[420px]">
            {output}
          </pre>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-3">Tips & Notes</h2>
        <ul className="text-sm text-gray-400 space-y-2 list-none">
          <li>
            <span className="text-orange-400 font-medium">Backup first — </span>
            always save your existing <code className="bg-zinc-800 px-1 rounded text-gray-300">.htaccess</code> before replacing it. A syntax error returns a 500 error for all visitors.
          </li>
          <li>
            <span className="text-orange-400 font-medium">WordPress block — </span>
            the <code className="bg-zinc-800 px-1 rounded text-gray-300"># BEGIN WordPress</code> / <code className="bg-zinc-800 px-1 rounded text-gray-300"># END WordPress</code> markers are updated by WordPress automatically when you save permalink settings. Keep them intact.
          </li>
          <li>
            <span className="text-orange-400 font-medium">mod_headers — </span>
            security headers require Apache's <code className="bg-zinc-800 px-1 rounded text-gray-300">mod_headers</code> module. Verify with <code className="bg-zinc-800 px-1 rounded text-gray-300">apache2ctl -M | grep headers</code>.
          </li>
          <li>
            <span className="text-orange-400 font-medium">IP restriction — </span>
            confirm your IP address before enabling the login restriction. Locking yourself out requires FTP or cPanel file manager access to recover.
          </li>
          <li>
            <span className="text-orange-400 font-medium">GZIP — </span>
            requires <code className="bg-zinc-800 px-1 rounded text-gray-300">mod_deflate</code>, which is enabled by default on most shared hosting. If already set elsewhere, skip this to avoid duplicates.
          </li>
        </ul>
      </div>
    </div>
  )
}
