import { useState, useEffect } from 'react'

const PORT_GROUPS = [
  {
    label: 'Web & HTTP',
    color: 'blue',
    ports: [
      { port: 80,   proto: 'TCP',     service: 'HTTP',          desc: 'Hypertext Transfer Protocol — the foundation of the World Wide Web. All unencrypted web traffic uses this port.' },
      { port: 443,  proto: 'TCP',     service: 'HTTPS',         desc: 'HTTP over TLS/SSL — encrypted web traffic. Every modern website uses this for secure communication.' },
      { port: 8080, proto: 'TCP',     service: 'HTTP Alt',      desc: 'Alternative HTTP port, commonly used for development servers, proxies, and web apps that cannot bind to port 80.' },
      { port: 8443, proto: 'TCP',     service: 'HTTPS Alt',     desc: 'Alternative HTTPS port. Used when 443 is already in use or when running without root privileges.' },
      { port: 3000, proto: 'TCP',     service: 'Dev Server',    desc: 'Common default for development web servers — Node.js, React, Express, Grafana, and many other tools default here.' },
      { port: 8888, proto: 'TCP',     service: 'Jupyter',       desc: 'Jupyter Notebook / Lab web server. Common default for data science environments — protect with a token or password.' },
    ],
  },
  {
    label: 'Email',
    color: 'yellow',
    ports: [
      { port: 25,  proto: 'TCP', service: 'SMTP',            desc: 'Simple Mail Transfer Protocol — server-to-server email relay. Often blocked by ISPs on residential connections to prevent spam.' },
      { port: 110, proto: 'TCP', service: 'POP3',            desc: 'Post Office Protocol v3 — downloads email from the server to the client and (by default) deletes it from the server.' },
      { port: 143, proto: 'TCP', service: 'IMAP',            desc: 'Internet Message Access Protocol — syncs email between server and client while keeping messages on the server. The modern standard.' },
      { port: 465, proto: 'TCP', service: 'SMTPS',           desc: 'SMTP over SSL (implicit TLS) — an older secure port for email submission. Superseded by 587 but still widely supported.' },
      { port: 587, proto: 'TCP', service: 'SMTP Submission', desc: 'Recommended port for email client submission. Uses STARTTLS to upgrade to an encrypted connection. Modern standard for sending email.' },
      { port: 993, proto: 'TCP', service: 'IMAPS',           desc: 'IMAP over TLS — the secure version of IMAP. Always prefer this over plain port 143 in production.' },
      { port: 995, proto: 'TCP', service: 'POP3S',           desc: 'POP3 over TLS — encrypted email retrieval for legacy mail clients that use the POP3 protocol.' },
    ],
  },
  {
    label: 'Database',
    color: 'green',
    ports: [
      { port: 1433,  proto: 'TCP', service: 'MSSQL',         desc: 'Microsoft SQL Server — the default connection port. Should never be exposed to the public internet.' },
      { port: 1521,  proto: 'TCP', service: 'Oracle DB',     desc: 'Oracle Database listener port. Connects Oracle clients and JDBC/ODBC drivers to the database server.' },
      { port: 3306,  proto: 'TCP', service: 'MySQL / MariaDB', desc: 'MySQL and MariaDB database server. One of the most widely used database ports — keep it behind a firewall.' },
      { port: 5432,  proto: 'TCP', service: 'PostgreSQL',    desc: 'PostgreSQL database server. Default for Postgres connections — used by Heroku, AWS RDS, and most cloud databases.' },
      { port: 5984,  proto: 'TCP', service: 'CouchDB',       desc: 'Apache CouchDB HTTP API — the database exposes a REST API over HTTP on this port.' },
      { port: 6379,  proto: 'TCP', service: 'Redis',         desc: 'Redis in-memory data store. Widely used for caching, sessions, and queues — always firewall this port.' },
      { port: 9200,  proto: 'TCP', service: 'Elasticsearch', desc: 'Elasticsearch REST API. Many data breaches have occurred because this port was left exposed to the internet.' },
      { port: 27017, proto: 'TCP', service: 'MongoDB',       desc: 'MongoDB database server. Always bind to localhost or a private IP — never expose this publicly.' },
    ],
  },
  {
    label: 'Security & Remote Access',
    color: 'red',
    ports: [
      { port: 22,    proto: 'TCP',     service: 'SSH',           desc: 'Secure Shell — encrypted remote terminal access, file transfer (SCP/SFTP), and port forwarding. The essential admin port.' },
      { port: 23,    proto: 'TCP',     service: 'Telnet',        desc: 'Unencrypted remote terminal — transmits passwords in plain text. Completely insecure; replaced by SSH. Do not use.' },
      { port: 389,   proto: 'TCP/UDP', service: 'LDAP',          desc: 'Lightweight Directory Access Protocol — used for directory services, Active Directory, and centralised authentication.' },
      { port: 636,   proto: 'TCP',     service: 'LDAPS',         desc: 'LDAP over TLS — the secure version of LDAP. Use this instead of plain port 389 for encrypted directory queries.' },
      { port: 500,   proto: 'UDP',     service: 'IKE / IPsec',   desc: 'Internet Key Exchange — negotiates IPsec VPN sessions. Part of site-to-site and client VPN setups.' },
      { port: 1194,  proto: 'TCP/UDP', service: 'OpenVPN',       desc: 'OpenVPN — a popular open-source VPN. Runs on both TCP and UDP; UDP is preferred for lower latency.' },
      { port: 3389,  proto: 'TCP',     service: 'RDP',           desc: 'Remote Desktop Protocol — Windows remote desktop. A prime target for brute-force attacks; never expose to the internet.' },
      { port: 4500,  proto: 'UDP',     service: 'IPsec NAT-T',   desc: 'IPsec NAT Traversal — allows IPsec VPN traffic through NAT devices. Used alongside port 500.' },
      { port: 51820, proto: 'UDP',     service: 'WireGuard',     desc: 'WireGuard VPN — modern, fast, and cryptographically clean. The default port, though it is fully configurable.' },
    ],
  },
  {
    label: 'Networking & Infrastructure',
    color: 'purple',
    ports: [
      { port: 53,  proto: 'TCP/UDP', service: 'DNS',         desc: 'Domain Name System — translates domain names to IP addresses. UDP for standard queries, TCP for large responses and zone transfers.' },
      { port: 67,  proto: 'UDP',     service: 'DHCP Server', desc: 'DHCP server side — listens for broadcast requests from clients and responds with an IP address lease.' },
      { port: 68,  proto: 'UDP',     service: 'DHCP Client', desc: 'DHCP client side — sends broadcast discovery requests to find a DHCP server on the local network.' },
      { port: 123, proto: 'UDP',     service: 'NTP',         desc: 'Network Time Protocol — synchronises clocks across systems. Crucial for TLS, logs, and distributed databases.' },
      { port: 161, proto: 'UDP',     service: 'SNMP',        desc: 'Simple Network Management Protocol — collects and manages data from routers, switches, and servers.' },
      { port: 162, proto: 'UDP',     service: 'SNMP Trap',   desc: 'SNMP trap receiver — network devices send unsolicited alerts to this port on the monitoring station.' },
      { port: 179, proto: 'TCP',     service: 'BGP',         desc: 'Border Gateway Protocol — the routing protocol that runs the internet, exchanging routes between autonomous systems.' },
      { port: 514, proto: 'UDP',     service: 'Syslog',      desc: 'System logging protocol — sends log messages to a central log server for aggregation and alerting.' },
    ],
  },
  {
    label: 'File Transfer',
    color: 'orange',
    ports: [
      { port: 20,  proto: 'TCP', service: 'FTP Data',    desc: 'FTP active mode data channel — the server opens a connection back to the client on this port for file transfers.' },
      { port: 21,  proto: 'TCP', service: 'FTP Control', desc: 'FTP command channel — sends commands and receives responses. Data flows over port 20 (active) or a dynamic port (passive).' },
      { port: 69,  proto: 'UDP', service: 'TFTP',        desc: 'Trivial File Transfer Protocol — minimal, unauthenticated transfers. Used for network boot (PXE) and firmware flashing.' },
      { port: 139, proto: 'TCP', service: 'NetBIOS',     desc: 'NetBIOS Session Service — older Windows file and printer sharing. Superseded by direct SMB on port 445.' },
      { port: 445, proto: 'TCP', service: 'SMB / CIFS',  desc: 'Server Message Block — Windows file and printer sharing, used by Samba on Linux. Never expose to the internet (see WannaCry).' },
      { port: 990, proto: 'TCP', service: 'FTPS',        desc: 'FTP over TLS (implicit mode) — encrypted file transfer. Prefer SFTP over SSH (port 22) when possible.' },
    ],
  },
  {
    label: 'Messaging & Media',
    color: 'violet',
    ports: [
      { port: 554,  proto: 'TCP/UDP', service: 'RTSP',  desc: 'Real Time Streaming Protocol — controls media streaming for IP cameras, video players, and live broadcasts.' },
      { port: 1883, proto: 'TCP',     service: 'MQTT',  desc: 'Message Queuing Telemetry Transport — a lightweight pub/sub protocol for IoT devices and sensor networks.' },
      { port: 5060, proto: 'TCP/UDP', service: 'SIP',   desc: 'Session Initiation Protocol — establishes, modifies, and terminates VoIP calls and video conferencing sessions.' },
      { port: 5061, proto: 'TCP',     service: 'SIPS',  desc: 'SIP over TLS — encrypted VoIP signalling. The secure alternative to port 5060 for production telephony.' },
      { port: 5222, proto: 'TCP',     service: 'XMPP',  desc: 'Extensible Messaging and Presence Protocol — an open standard for instant messaging used by Jabber and many chat apps.' },
      { port: 6667, proto: 'TCP',     service: 'IRC',   desc: 'Internet Relay Chat — the classic real-time text messaging protocol, still used by many open-source communities.' },
    ],
  },
  {
    label: 'DevOps & Containers',
    color: 'teal',
    ports: [
      { port: 2375,  proto: 'TCP', service: 'Docker (plain)',  desc: 'Docker daemon REST API without TLS — gives full container control. Never expose this port; use 2376 with TLS instead.' },
      { port: 2376,  proto: 'TCP', service: 'Docker (TLS)',    desc: 'Docker daemon REST API over TLS — secure remote container management requiring client certificate authentication.' },
      { port: 2181,  proto: 'TCP', service: 'ZooKeeper',       desc: 'Apache ZooKeeper — coordination service used by Kafka, Hadoop, and other distributed systems.' },
      { port: 5601,  proto: 'TCP', service: 'Kibana',          desc: 'Kibana web UI — the visualisation dashboard for Elasticsearch, part of the ELK stack.' },
      { port: 6443,  proto: 'TCP', service: 'Kubernetes API',  desc: 'Kubernetes API server — the control plane endpoint. kubectl and all cluster components talk through this port.' },
      { port: 9090,  proto: 'TCP', service: 'Prometheus',      desc: 'Prometheus metrics server — scrapes and stores time-series monitoring data. Also used by Cockpit admin panel.' },
      { port: 9418,  proto: 'TCP', service: 'Git Protocol',    desc: 'Native Git protocol for anonymous repository access. Unauthenticated; most teams use SSH or HTTPS instead.' },
    ],
  },
]

const COLOR_CLASSES = {
  blue:   { badge: 'bg-blue-500/10 text-blue-400',     heading: 'text-blue-400' },
  yellow: { badge: 'bg-yellow-500/10 text-yellow-400', heading: 'text-yellow-400' },
  green:  { badge: 'bg-green-500/10 text-green-400',   heading: 'text-green-400' },
  red:    { badge: 'bg-red-500/10 text-red-400',       heading: 'text-red-400' },
  purple: { badge: 'bg-purple-500/10 text-purple-400', heading: 'text-purple-400' },
  orange: { badge: 'bg-orange-500/10 text-orange-400', heading: 'text-orange-400' },
  violet: { badge: 'bg-violet-500/10 text-violet-400', heading: 'text-violet-400' },
  teal:   { badge: 'bg-teal-500/10 text-teal-400',    heading: 'text-teal-400' },
}

export default function PortNumberReference() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'Port Number Reference | OmniverseTools'
  }, [])

  const q = query.trim().toLowerCase()

  const filtered = PORT_GROUPS.map(group => ({
    ...group,
    ports: q
      ? group.ports.filter(p =>
          String(p.port).includes(q) ||
          p.service.toLowerCase().includes(q) ||
          p.proto.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
        )
      : group.ports,
  })).filter(g => g.ports.length > 0)

  const totalPorts = PORT_GROUPS.reduce((sum, g) => sum + g.ports.length, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Port Number Reference</h1>
      <p className="text-gray-400 mb-8">
        A searchable reference of well-known TCP/UDP port numbers — from web and email to databases, VPNs, and DevOps tools.
      </p>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${totalPorts} ports by number, service name, protocol, or description…`}
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
        />
      </div>

      {/* Category summary chips */}
      {!q && (
        <div className="flex flex-wrap gap-2 mb-8">
          {PORT_GROUPS.map(({ label, color, ports }) => (
            <span
              key={label}
              className={`text-xs px-3 py-1.5 rounded-full ${COLOR_CLASSES[color].badge}`}
            >
              {label} ({ports.length})
            </span>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No ports match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="space-y-10">
          {filtered.map(({ label, color, ports }) => {
            const cls = COLOR_CLASSES[color]
            return (
              <section key={label}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-lg font-bold ${cls.heading}`}>{label}</span>
                  <span className="ml-auto text-xs text-gray-600 bg-zinc-800 px-2.5 py-1 rounded-full">
                    {ports.length} port{ports.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {ports.map(({ port, proto, service, desc }) => (
                    <div
                      key={port}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className={`text-base font-bold font-mono shrink-0 w-14 pt-0.5 ${cls.heading}`}>
                          {port}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white font-semibold text-sm">{service}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${cls.badge}`}>{proto}</span>
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
        <h2 className="text-gray-300 font-semibold text-base mb-2">About port numbers</h2>
        <p>
          Port numbers range from 0 to 65535. The{' '}
          <span className="text-orange-400">well-known ports</span> (0–1023) are reserved by IANA and
          require root/administrator privileges to bind on most systems. Ports 1024–49151 are{' '}
          <span className="text-orange-400">registered ports</span> assigned to specific services.
          Ports 49152–65535 are{' '}
          <span className="text-orange-400">dynamic / ephemeral ports</span>, used temporarily by
          client-side connections. TCP and UDP are the two main transport protocols — TCP is
          connection-oriented and reliable; UDP is connectionless and faster.
        </p>
      </div>
    </div>
  )
}
