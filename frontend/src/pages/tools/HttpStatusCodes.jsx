import { useState, useEffect } from 'react'

const STATUS_GROUPS = [
  {
    range: '1xx',
    label: 'Informational',
    color: 'blue',
    codes: [
      { code: 100, name: 'Continue', desc: 'The server received the request headers and the client should proceed to send the request body.' },
      { code: 101, name: 'Switching Protocols', desc: 'The server is switching protocols as requested by the client — e.g. upgrading from HTTP to WebSockets.' },
      { code: 102, name: 'Processing', desc: 'The server has received and is processing the request, but no response is available yet (WebDAV).' },
      { code: 103, name: 'Early Hints', desc: 'Returns some response headers before the final HTTP response — lets the browser start preloading resources early.' },
    ],
  },
  {
    range: '2xx',
    label: 'Success',
    color: 'green',
    codes: [
      { code: 200, name: 'OK', desc: 'The request succeeded. The response body contains the requested data — the standard success response.' },
      { code: 201, name: 'Created', desc: 'The request succeeded and a new resource was created. Typically returned after a POST or PUT.' },
      { code: 202, name: 'Accepted', desc: 'The request was accepted for processing, but processing is not yet complete — useful for async jobs.' },
      { code: 203, name: 'Non-Authoritative Information', desc: 'The request succeeded, but the response is from a cached or third-party copy, not the origin server.' },
      { code: 204, name: 'No Content', desc: 'The request succeeded but there is nothing to return in the response body. Common for DELETE and PATCH.' },
      { code: 205, name: 'Reset Content', desc: 'The request succeeded. The client should reset the document view — e.g. clear a form after submission.' },
      { code: 206, name: 'Partial Content', desc: 'The server is delivering only part of the resource (byte serving). Used for resumable downloads and video streaming.' },
      { code: 207, name: 'Multi-Status', desc: 'The response body contains status codes for multiple independent operations — used by WebDAV.' },
      { code: 208, name: 'Already Reported', desc: 'The DAV binding members have already been enumerated in an earlier part of the response (WebDAV).' },
      { code: 226, name: 'IM Used', desc: 'The server fulfilled a GET request and the response reflects one or more instance manipulations applied to the current instance.' },
    ],
  },
  {
    range: '3xx',
    label: 'Redirection',
    color: 'yellow',
    codes: [
      { code: 300, name: 'Multiple Choices', desc: 'The request has more than one possible response. The client or user should choose one.' },
      { code: 301, name: 'Moved Permanently', desc: 'The URL has permanently moved. Search engines update their index. Use this for permanent redirects.' },
      { code: 302, name: 'Found', desc: 'The URL has temporarily changed. Search engines keep the old URL. Use for temporary redirects.' },
      { code: 303, name: 'See Other', desc: 'Redirects the client to a different resource using GET — typically used after a POST to prevent form resubmission.' },
      { code: 304, name: 'Not Modified', desc: "The cached version of the resource is still valid — no need to resend it. Saves bandwidth on repeat requests." },
      { code: 307, name: 'Temporary Redirect', desc: 'Like 302, but the original HTTP method must be preserved (a POST redirect stays as POST).' },
      { code: 308, name: 'Permanent Redirect', desc: 'Like 301, but the original HTTP method must be preserved. The permanent version of 307.' },
    ],
  },
  {
    range: '4xx',
    label: 'Client Error',
    color: 'orange',
    codes: [
      { code: 400, name: 'Bad Request', desc: 'The server cannot process the request because the client sent malformed syntax, invalid data, or a missing required field.' },
      { code: 401, name: 'Unauthorized', desc: 'Authentication is required. The client must provide valid credentials (log in) to access this resource.' },
      { code: 402, name: 'Payment Required', desc: 'Reserved for future use. Some APIs use it to indicate a required payment or subscription.' },
      { code: 403, name: 'Forbidden', desc: 'The server understands the request but refuses to authorise it. Unlike 401, re-authenticating will not help.' },
      { code: 404, name: 'Not Found', desc: 'The server cannot find the requested resource. The URL may be wrong or the resource may have been deleted.' },
      { code: 405, name: 'Method Not Allowed', desc: 'The HTTP method is not supported for this endpoint — e.g. sending a POST to a read-only GET route.' },
      { code: 406, name: 'Not Acceptable', desc: 'The server cannot produce a response matching the content types listed in the request\'s Accept headers.' },
      { code: 407, name: 'Proxy Authentication Required', desc: 'Like 401, but the client must authenticate with a proxy server before the request can be forwarded.' },
      { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the client to finish sending the complete request.' },
      { code: 409, name: 'Conflict', desc: 'The request conflicts with the current server state — e.g. duplicate entry, concurrent edit, or version mismatch.' },
      { code: 410, name: 'Gone', desc: 'The resource has been permanently deleted and will not be available again. Stronger than 404 — tells crawlers to remove the link.' },
      { code: 411, name: 'Length Required', desc: 'The server requires a Content-Length header but the client did not include one.' },
      { code: 412, name: 'Precondition Failed', desc: 'A precondition in the request headers (e.g. If-Match) evaluated to false on the server.' },
      { code: 413, name: 'Content Too Large', desc: 'The request body exceeds the size the server is willing to accept. Reduce the payload or upload in chunks.' },
      { code: 414, name: 'URI Too Long', desc: 'The URI in the request is longer than the server is willing to interpret — often caused by massive query strings.' },
      { code: 415, name: 'Unsupported Media Type', desc: 'The request payload format is not supported. Check the Content-Type header matches what the server expects.' },
      { code: 416, name: 'Range Not Satisfiable', desc: 'The byte range specified in the Range header cannot be satisfied — e.g. the range is outside the file size.' },
      { code: 417, name: 'Expectation Failed', desc: 'The server cannot meet the requirements specified in the Expect request header.' },
      { code: 418, name: "I'm a Teapot", desc: "An April Fools' RFC 2324 joke. A teapot refuses to brew coffee. Some APIs use it playfully for intentionally refused requests." },
      { code: 421, name: 'Misdirected Request', desc: 'The request was directed at a server that cannot produce a response for the requested host and port combination.' },
      { code: 422, name: 'Unprocessable Content', desc: 'The request is well-formed but contains semantic errors — e.g. validation failed, business rule violated.' },
      { code: 423, name: 'Locked', desc: 'The resource is currently locked and cannot be modified (WebDAV).' },
      { code: 424, name: 'Failed Dependency', desc: 'The request failed because another request it depended on also failed (WebDAV).' },
      { code: 425, name: 'Too Early', desc: 'The server is unwilling to process a request that could be replayed, to protect against replay attacks.' },
      { code: 426, name: 'Upgrade Required', desc: 'The server refuses to perform the request using the current protocol — client must upgrade to a newer one.' },
      { code: 428, name: 'Precondition Required', desc: 'The server requires a conditional request — e.g. the client must include an If-Match header to prevent lost updates.' },
      { code: 429, name: 'Too Many Requests', desc: 'The client has sent too many requests in a given time window. Back off and retry after the period shown in Retry-After.' },
      { code: 431, name: 'Request Header Fields Too Large', desc: 'The server refuses to process the request because the headers are too large — often caused by bloated cookies.' },
      { code: 451, name: 'Unavailable For Legal Reasons', desc: 'The resource cannot be served for legal reasons such as a government order, GDPR restriction, or copyright takedown.' },
    ],
  },
  {
    range: '5xx',
    label: 'Server Error',
    color: 'red',
    codes: [
      { code: 500, name: 'Internal Server Error', desc: 'A generic server-side error — something went wrong. Check the server logs; this is not a client mistake.' },
      { code: 501, name: 'Not Implemented', desc: 'The server does not support the functionality required to fulfil the request — the method is not implemented.' },
      { code: 502, name: 'Bad Gateway', desc: 'The server, acting as a gateway or proxy, received an invalid response from the upstream server.' },
      { code: 503, name: 'Service Unavailable', desc: 'The server is not ready — it may be down for maintenance or temporarily overloaded. Retry after a short delay.' },
      { code: 504, name: 'Gateway Timeout', desc: 'The server, acting as a gateway, did not get a timely response from the upstream server. Network or upstream issue.' },
      { code: 505, name: 'HTTP Version Not Supported', desc: 'The server does not support the HTTP protocol version used in the request.' },
      { code: 506, name: 'Variant Also Negotiates', desc: 'Transparent content negotiation for the request results in a circular reference (configuration error).' },
      { code: 507, name: 'Insufficient Storage', desc: 'The server cannot store the representation needed to complete the request — out of disk space (WebDAV).' },
      { code: 508, name: 'Loop Detected', desc: 'The server detected an infinite loop while processing the request (WebDAV).' },
      { code: 510, name: 'Not Extended', desc: 'Further extensions to the request are required for the server to fulfil it.' },
      { code: 511, name: 'Network Authentication Required', desc: 'The client must authenticate to gain network access — typically used by captive portals on public Wi-Fi.' },
    ],
  },
]

const COLOR_CLASSES = {
  blue:   { badge: 'bg-blue-500/10 text-blue-400',    heading: 'text-blue-400' },
  green:  { badge: 'bg-green-500/10 text-green-400',  heading: 'text-green-400' },
  yellow: { badge: 'bg-yellow-500/10 text-yellow-400', heading: 'text-yellow-400' },
  orange: { badge: 'bg-orange-500/10 text-orange-400', heading: 'text-orange-400' },
  red:    { badge: 'bg-red-500/10 text-red-400',      heading: 'text-red-400' },
}

export default function HttpStatusCodes() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'HTTP Status Code Reference | OmniverseTools'
  }, [])

  const q = query.trim().toLowerCase()

  const filtered = STATUS_GROUPS.map(group => ({
    ...group,
    codes: q
      ? group.codes.filter(c =>
          String(c.code).includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q)
        )
      : group.codes,
  })).filter(g => g.codes.length > 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">HTTP Status Code Reference</h1>
      <p className="text-gray-400 mb-8">
        All standard HTTP response codes — 1xx through 5xx — with plain-English descriptions and guidance on when to use each.
      </p>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by code number, name, or description…"
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
        />
      </div>

      {/* Summary chips */}
      {!q && (
        <div className="flex flex-wrap gap-2 mb-8">
          {STATUS_GROUPS.map(({ range, label, color, codes }) => (
            <span
              key={range}
              className={`text-xs px-3 py-1.5 rounded-full border ${COLOR_CLASSES[color].badge} border-current/20`}
            >
              {range} {label} ({codes.length})
            </span>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No codes match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="space-y-10">
          {filtered.map(({ range, label, color, codes }) => {
            const cls = COLOR_CLASSES[color]
            return (
              <section key={range}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl font-bold font-mono ${cls.heading}`}>{range}</span>
                  <span className="text-white font-semibold">{label}</span>
                  <span className="ml-auto text-xs text-gray-600 bg-zinc-800 px-2.5 py-1 rounded-full">
                    {codes.length} code{codes.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {codes.map(({ code, name, desc }) => (
                    <div
                      key={code}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className={`text-base font-bold font-mono shrink-0 w-12 pt-0.5 ${cls.heading}`}>
                          {code}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white font-semibold text-sm">{name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${cls.badge}`}>{range}</span>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this reference</h2>
        <p>
          HTTP status codes are three-digit numbers returned by a server in response to a client request.
          The first digit defines the class: <span className="text-blue-400">1xx</span> informational,{' '}
          <span className="text-green-400">2xx</span> success, <span className="text-yellow-400">3xx</span> redirection,{' '}
          <span className="text-orange-400">4xx</span> client error, and <span className="text-red-400">5xx</span> server error.
          Codes are defined across RFC 7231, RFC 4918 (WebDAV), RFC 6585, and related RFCs.
        </p>
      </div>
    </div>
  )
}
