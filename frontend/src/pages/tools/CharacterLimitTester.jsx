import { useState, useEffect } from 'react'

const PLATFORMS = [
  { group: 'Social Media',    platform: 'Twitter / X post',       limit: 280   },
  { group: 'Social Media',    platform: 'Instagram caption',       limit: 2200  },
  { group: 'Social Media',    platform: 'LinkedIn post',           limit: 3000  },
  { group: 'Social Media',    platform: 'LinkedIn headline',       limit: 220   },
  { group: 'Social Media',    platform: 'Pinterest description',   limit: 500   },
  { group: 'Social Media',    platform: 'TikTok caption',          limit: 2200  },
  { group: 'SMS / Email',     platform: 'SMS (1 segment)',         limit: 160   },
  { group: 'SMS / Email',     platform: 'SMS (2 segments)',        limit: 306   },
  { group: 'SMS / Email',     platform: 'Email subject line',      limit: 78    },
  { group: 'SEO / Web',       platform: 'Page title (SEO)',        limit: 60    },
  { group: 'SEO / Web',       platform: 'Meta description (SEO)',  limit: 160   },
  { group: 'Video',           platform: 'YouTube title',           limit: 100   },
  { group: 'Video',           platform: 'YouTube description',     limit: 5000  },
]

function getStatus(count, limit) {
  if (count > limit) return 'over'
  if (count >= limit * 0.9) return 'warning'
  return 'ok'
}

function StatusBar({ count, limit }) {
  const pct = Math.min((count / limit) * 100, 100)
  const status = getStatus(count, limit)
  const barColor =
    status === 'over'    ? 'bg-red-500' :
    status === 'warning' ? 'bg-yellow-500' :
                           'bg-green-500'
  const textColor =
    status === 'over'    ? 'text-red-400' :
    status === 'warning' ? 'text-yellow-400' :
                           'text-green-400'
  const remaining = limit - count

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-150 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-24 text-right ${textColor}`}>
        {status === 'over'
          ? `${Math.abs(remaining)} over`
          : `${remaining} left`}
      </span>
    </div>
  )
}

export default function CharacterLimitTester() {
  const [text, setText] = useState('')

  useEffect(() => {
    document.title = 'Character Limit Tester — Twitter, SMS, SEO & More | OmniverseTools'
  }, [])

  const count = text.length

  const groups = [...new Set(PLATFORMS.map(p => p.group))]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Character Limit Tester</h1>
      <p className="text-gray-400 mb-6">
        Type or paste your text and instantly see how it fits within the character limits for
        Twitter, LinkedIn, SMS, SEO meta tags, YouTube, and more.
      </p>

      {/* Textarea */}
      <div className="relative mb-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          rows={6}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none text-sm leading-relaxed"
        />
        <div className="absolute bottom-3 right-4 text-xs text-gray-500 select-none">
          {count.toLocaleString()} characters
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Platform limit cards by group */}
      <div className="space-y-6">
        {groups.map(group => (
          <section key={group}>
            <h2 className="text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
              {group}
            </h2>
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
              {PLATFORMS.filter(p => p.group === group).map((p, idx, arr) => {
                const status = getStatus(count, p.limit)
                return (
                  <div
                    key={p.platform}
                    className={`px-4 py-3.5 ${idx < arr.length - 1 ? 'border-b border-zinc-800' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">{p.platform}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {status === 'over' && (
                          <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-medium">
                            Over limit
                          </span>
                        )}
                        {status === 'warning' && (
                          <span className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                            Near limit
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono">
                          {count.toLocaleString()} / {p.limit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <StatusBar count={count} limit={p.limit} />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Different platforms enforce very different character limits. A tweet cuts off at 280, an
          SMS segment at 160 (longer messages split into multiple segments billed separately), and
          search engines typically truncate page titles beyond 60 characters and meta descriptions
          beyond 160. This tool checks your text against 13 common limits simultaneously so you can
          tweak the copy once and see where it fits. Everything runs in your browser — no text is
          ever sent to a server.
        </p>
      </div>
    </div>
  )
}
