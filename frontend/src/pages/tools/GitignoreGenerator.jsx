import { useState, useEffect, useMemo } from 'react'

const STACKS = [
  {
    category: 'Languages',
    items: [
      {
        id: 'nodejs',
        label: 'Node.js',
        content: `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.npm
.yarn-integrity
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
dist/
build/
.cache/
.eslintcache
*.tsbuildinfo`,
      },
      {
        id: 'python',
        label: 'Python',
        content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/
pip-log.txt
pip-delete-this-directory.txt
.pytest_cache/
.mypy_cache/
.ruff_cache/
.hypothesis/
htmlcov/
.coverage
.coverage.*
coverage.xml
nosetests.xml`,
      },
      {
        id: 'go',
        label: 'Go',
        content: `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
vendor/`,
      },
      {
        id: 'rust',
        label: 'Rust',
        content: `# Rust
/target/
debug/
*.pdb`,
      },
      {
        id: 'java',
        label: 'Java',
        content: `# Java
*.class
*.jar
*.war
*.ear
*.nar
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*
target/
build/`,
      },
      {
        id: 'c_cpp',
        label: 'C / C++',
        content: `# C / C++
*.d
*.slo
*.lo
*.o
*.obj
*.gch
*.pch
*.so
*.dylib
*.dll
*.mod
*.smod
*.lai
*.la
*.a
*.lib
*.exe
*.out
*.app
CMakeFiles/
cmake_install.cmake
CMakeCache.txt
install_manifest.txt`,
      },
      {
        id: 'ruby',
        label: 'Ruby',
        content: `# Ruby
*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.bundle/
/vendor/bundle
/log/
.byebug_history`,
      },
      {
        id: 'php',
        label: 'PHP',
        content: `# PHP
/vendor/
composer.phar
.phpunit.result.cache
.phpunit.cache/
*.log`,
      },
      {
        id: 'swift',
        label: 'Swift',
        content: `# Swift / Xcode
xcuserdata/
*.xcuserstate
*.xcworkspace/xcuserdata/
DerivedData/
.build/
.swiftpm/xcuserdata/
*.resolved
Pods/`,
      },
    ],
  },
  {
    category: 'Frameworks',
    items: [
      {
        id: 'react',
        label: 'React',
        content: `# React
node_modules/
build/
dist/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
      },
      {
        id: 'vue',
        label: 'Vue.js',
        content: `# Vue.js
node_modules/
/dist/
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*`,
      },
      {
        id: 'angular',
        label: 'Angular',
        content: `# Angular
/dist/
/tmp/
/out-tsc/
/bazel-out/
node_modules/
npm-debug.log
yarn-error.log
.angular/`,
      },
      {
        id: 'nextjs',
        label: 'Next.js',
        content: `# Next.js
.next/
out/
node_modules/
.env
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel`,
      },
      {
        id: 'django',
        label: 'Django',
        content: `# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/
staticfiles/
.env
*.pot
*.pyc
__pycache__/
.pytest_cache/`,
      },
      {
        id: 'rails',
        label: 'Rails',
        content: `# Rails
.bundle/
vendor/bundle
log/
tmp/
.byebug_history
.env
/public/system
/public/uploads
/public/assets
storage/`,
      },
      {
        id: 'laravel',
        label: 'Laravel',
        content: `# Laravel
/vendor/
/node_modules/
.env
.env.backup
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log
storage/*.key
public/hot
public/storage`,
      },
    ],
  },
  {
    category: 'Operating Systems',
    items: [
      {
        id: 'macos',
        label: 'macOS',
        content: `# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk`,
      },
      {
        id: 'windows',
        label: 'Windows',
        content: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.tmp
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk`,
      },
      {
        id: 'linux',
        label: 'Linux',
        content: `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`,
      },
    ],
  },
  {
    category: 'IDEs & Editors',
    items: [
      {
        id: 'vscode',
        label: 'VS Code',
        content: `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.history/
*.vsix`,
      },
      {
        id: 'jetbrains',
        label: 'JetBrains',
        content: `# JetBrains IDEs
.idea/
*.iml
*.iws
out/
.idea_modules/
atlassian-ide-plugin.xml`,
      },
      {
        id: 'vim',
        label: 'Vim',
        content: `# Vim
[._]*.s[a-v][a-z]
!*.svg
[._]*.sw[a-p]
[._]s[a-rt-v][a-z]
[._]ss[a-gi-z]
[._]sw[a-p]
Session.vim
Sessionx.vim
.netrwhist
*~
tags
[._]*.un~`,
      },
      {
        id: 'emacs',
        label: 'Emacs',
        content: `# Emacs
*~
\\#*\\#
/.emacs.desktop
/.emacs.desktop.lock
*.elc
auto-save-list
tramp
.\\#*
.org-id-locations
*_archive
/eshell/history
/eshell/lastdir
/elpa/
.cask/
flycheck_*.el
/server/
.projectile`,
      },
    ],
  },
  {
    category: 'DevOps & Cloud',
    items: [
      {
        id: 'terraform',
        label: 'Terraform',
        content: `# Terraform
.terraform/
.terraform.lock.hcl
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraformrc
terraform.rc`,
      },
      {
        id: 'docker',
        label: 'Docker',
        content: `# Docker
.docker/
docker-compose.override.yml`,
      },
      {
        id: 'ansible',
        label: 'Ansible',
        content: `# Ansible
*.retry
.vault_pass
vault_password_file`,
      },
    ],
  },
]

const ALL_ITEMS = STACKS.flatMap(c => c.items)

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState(new Set(['nodejs', 'macos', 'vscode']))
  const [copied, setCopied] = useState(false)
  const [stripComments, setStripComments] = useState(false)

  useEffect(() => {
    document.title = '.gitignore Generator | OmniverseTools'
  }, [])

  const output = useMemo(() => {
    const selectedItems = ALL_ITEMS.filter(item => selected.has(item.id))
    if (!selectedItems.length) return ''
    return selectedItems
      .map(item => {
        if (stripComments) {
          return item.content
            .split('\n')
            .filter(line => !line.startsWith('#') && line.trim() !== '')
            .join('\n')
        }
        return item.content
      })
      .join('\n\n')
  }, [selected, stripComments])

  const ruleCount = useMemo(
    () => output.split('\n').filter(l => l.trim() && !l.startsWith('#')).length,
    [output]
  )

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function download() {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.gitignore'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">.gitignore Generator</h1>
      <p className="text-gray-400 mb-8">
        Select your stack to get the right{' '}
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-300 text-sm">.gitignore</code> file.
        Pick multiple stacks to combine them into one.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — stack selector */}
        <div className="lg:col-span-2 space-y-5">
          {STACKS.map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
                {category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selected.has(item.id)
                        ? 'bg-orange-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-zinc-700 hover:border-orange-500 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setStripComments(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors flex items-center shrink-0 ${
                  stripComments ? 'bg-orange-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
                    stripComments ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-300">Strip comments</span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setSelected(new Set(ALL_ITEMS.map(i => i.id)))}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Select all
              </button>
              <span className="text-zinc-700">·</span>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Right — output */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">
              {selected.size > 0
                ? `.gitignore — ${ruleCount} rule${ruleCount !== 1 ? 's' : ''}`
                : '.gitignore output'}
            </label>
            {output && (
              <div className="flex gap-3 items-center">
                <button
                  onClick={download}
                  className="text-sm text-gray-400 hover:text-white transition-colors px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 hover:border-zinc-500"
                >
                  Download
                </button>
                <button
                  onClick={copy}
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {output ? (
            <textarea
              value={output}
              readOnly
              rows={32}
              spellCheck={false}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-green-300 text-sm font-mono focus:outline-none resize-none"
            />
          ) : (
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 min-h-[420px] flex items-center justify-center">
              <p className="text-gray-600 text-sm">Select at least one stack on the left.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Pick any combination of languages, frameworks, operating systems, editors, and DevOps tools
          to generate a combined{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">.gitignore</code> file.
          All patterns follow the official{' '}
          <code className="bg-zinc-800 px-1 rounded text-gray-300">github/gitignore</code> templates.
          Everything runs in your browser — nothing is uploaded.
        </p>
      </div>
    </div>
  )
}
