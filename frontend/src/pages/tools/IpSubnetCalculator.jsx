import { useState, useEffect } from 'react'

const EXAMPLES = [
  { cidr: '192.168.1.0/24', note: 'Home network' },
  { cidr: '10.0.0.0/8',     note: 'Class A private' },
  { cidr: '172.16.0.0/12',  note: 'Class B private' },
  { cidr: '10.0.0.0/24',    note: 'WireGuard VPN' },
  { cidr: '10.10.10.0/30',  note: '4 addresses' },
  { cidr: '0.0.0.0/0',      note: 'All IP addresses' },
]

function prefixToMask(prefix) {
  if (prefix === 0) return 0
  return (0xffffffff << (32 - prefix)) >>> 0
}

function parseIp(ipStr) {
  const parts = ipStr.trim().split('.')
  if (parts.length !== 4) return null
  const nums = parts.map(Number)
  if (nums.some(n => isNaN(n) || !Number.isInteger(n) || n < 0 || n > 255)) return null
  return (((nums[0] * 256 + nums[1]) * 256 + nums[2]) * 256 + nums[3]) >>> 0
}

function ipToStr(n) {
  n = n >>> 0
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join('.')
}

function getIpClass(ipStr) {
  const first = parseInt(ipStr.split('.')[0], 10)
  if (first === 127) return 'Loopback'
  if (first < 128)   return 'A'
  if (first < 192)   return 'B'
  if (first < 224)   return 'C'
  if (first < 240)   return 'D — Multicast'
  return 'E — Reserved'
}

function getScope(ipStr) {
  const [a, b] = ipStr.split('.').map(Number)
  if (a === 10)                         return 'Private (RFC 1918)'
  if (a === 172 && b >= 16 && b <= 31)  return 'Private (RFC 1918)'
  if (a === 192 && b === 168)           return 'Private (RFC 1918)'
  if (a === 127)                         return 'Loopback'
  if (a === 169 && b === 254)           return 'Link-local (APIPA)'
  if (a >= 224 && a <= 239)             return 'Multicast (D)'
  if (a >= 240)                          return 'Reserved (E)'
  return 'Public'
}

function calc(cidr) {
  const m = cidr.trim().match(/^([0-9]{1,3}(?:\.[0-9]{1,3}){3})\/([0-9]{1,2})$/)
  if (!m) return { error: 'Enter a CIDR block, e.g. 192.168.1.0/24' }

  const [, ipPart, prefixStr] = m
  const prefix = parseInt(prefixStr, 10)
  if (prefix > 32) return { error: 'Prefix length must be 0–32' }

  const ip = parseIp(ipPart)
  if (ip === null) return { error: 'Invalid IP address — each octet must be 0–255' }

  const mask     = prefixToMask(prefix)
  const wildcard = (~mask) >>> 0
  const network  = (ip & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0

  const totalAddresses = prefix <= 30 ? Math.pow(2, 32 - prefix) : prefix === 31 ? 2 : 1
  let usableHosts, firstHost, lastHost

  if (prefix === 32) {
    usableHosts = 1
    firstHost = lastHost = network
  } else if (prefix === 31) {
    usableHosts = 2
    firstHost = network
    lastHost = broadcast
  } else {
    usableHosts = totalAddresses - 2
    firstHost = network + 1
    lastHost = broadcast - 1
  }

  const networkStr  = ipToStr(network)
  const inputIpStr  = ipToStr(ip)

  return {
    inputIp:       inputIpStr,
    networkAddr:   networkStr,
    broadcastAddr: ipToStr(broadcast),
    maskStr:       ipToStr(mask),
    wildcardStr:   ipToStr(wildcard),
    firstHostStr:  ipToStr(firstHost),
    lastHostStr:   ipToStr(lastHost),
    usableHosts,
    totalAddresses,
    prefix,
    ipClass:       getIpClass(ipPart),
    scope:         getScope(ipPart),
    hostBitsSet:   inputIpStr !== networkStr,
    canonicalCidr: `${networkStr}/${prefix}`,
  }
}

function BinaryRow({ label, ipStr, prefix }) {
  const full = ipStr.split('.').map(n => parseInt(n).toString(2).padStart(8, '0')).join('')
  const octets = [full.slice(0, 8), full.slice(8, 16), full.slice(16, 24), full.slice(24, 32)]
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-gray-500 w-16 shrink-0 pt-0.5">{label}</span>
      <code className="text-xs font-mono leading-5 break-all">
        {octets.map((oct, i) => {
          const start = i * 8
          const netEnd = Math.min(prefix, start + 8) - start
          return (
            <span key={i}>
              {i > 0 && <span className="text-zinc-600">.</span>}
              <span className="text-orange-400">{oct.slice(0, netEnd)}</span>
              <span className="text-zinc-400">{oct.slice(netEnd)}</span>
            </span>
          )
        })}
      </code>
    </div>
  )
}

export default function IpSubnetCalculator() {
  const [input, setInput] = useState('192.168.1.0/24')
  const [result, setResult] = useState(() => calc('192.168.1.0/24'))

  useEffect(() => {
    document.title = 'IP Subnet / CIDR Calculator | OmniverseTools'
  }, [])

  function handleChange(val) {
    setInput(val)
    setResult(val.trim() ? calc(val) : null)
  }

  const r = result && !result.error ? result : null

  const rows = r ? [
    { label: 'Network address',   value: r.networkAddr,                      mono: true  },
    { label: 'Broadcast address', value: r.broadcastAddr,                    mono: true  },
    { label: 'First usable host', value: r.firstHostStr,                     mono: true  },
    { label: 'Last usable host',  value: r.lastHostStr,                      mono: true  },
    { label: 'Usable hosts',      value: r.usableHosts.toLocaleString(),     mono: false },
    { label: 'Total addresses',   value: r.totalAddresses.toLocaleString(),  mono: false },
    { label: 'Subnet mask',       value: r.maskStr,                          mono: true  },
    { label: 'Wildcard mask',     value: r.wildcardStr,                      mono: true  },
    { label: 'CIDR notation',     value: r.canonicalCidr,                    mono: true  },
    { label: 'IP class',          value: r.ipClass,                          mono: false },
    { label: 'Scope',             value: r.scope,                            mono: false },
  ] : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">IP Subnet / CIDR Calculator</h1>
      <p className="text-gray-400 mb-8">
        Enter a CIDR block to get the network address, broadcast address, usable host range, subnet mask, and more.
        Useful for planning IP subnets, VPN configuration, and firewall rules.
      </p>

      {/* Input */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">CIDR block</label>
        <input
          type="text"
          value={input}
          onChange={e => handleChange(e.target.value)}
          placeholder="e.g. 192.168.1.0/24"
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-orange-500 placeholder-gray-600"
          spellCheck={false}
          autoComplete="off"
        />
        {result?.error && (
          <p className="mt-2 text-sm text-red-400">{result.error}</p>
        )}
        {r?.hostBitsSet && (
          <p className="mt-2 text-sm text-yellow-400">
            Host bits detected — showing network <span className="font-mono">{r.canonicalCidr}</span>
          </p>
        )}
      </div>

      {/* Results */}
      {r && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden mb-6">
          {rows.map(({ label, value, mono }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-3.5 ${i < rows.length - 1 ? 'border-b border-zinc-800' : ''}`}
            >
              <span className="text-sm text-gray-400">{label}</span>
              <span className={`text-sm text-white ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Binary view */}
      {r && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Binary —{' '}
            <span className="text-orange-400 normal-case font-normal">orange</span>
            {' '}= network bits &nbsp;
            <span className="text-zinc-400 normal-case font-normal">grey</span>
            {' '}= host bits
          </div>
          <div className="space-y-2">
            <BinaryRow label="Network"   ipStr={r.networkAddr}   prefix={r.prefix} />
            <BinaryRow label="Mask"      ipStr={r.maskStr}       prefix={r.prefix} />
            <BinaryRow label="Broadcast" ipStr={r.broadcastAddr} prefix={r.prefix} />
          </div>
        </div>
      )}

      {/* Quick examples */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick examples</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EXAMPLES.map(({ cidr, note }) => (
            <button
              key={cidr}
              onClick={() => handleChange(cidr)}
              className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-colors ${
                input.trim() === cidr
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
              }`}
            >
              <span className="text-sm font-mono text-orange-400">{cidr}</span>
              <span className="text-xs text-gray-500 mt-0.5">{note}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
