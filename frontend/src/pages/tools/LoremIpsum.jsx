import { useState, useEffect } from 'react'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nulla gravida orci a odio nullam varius turpis egestas libero facilisis blandit nec porta sit amet neque blandit fermentum'.split(' ')

function randomWord(prev) {
  let w
  do { w = WORDS[Math.floor(Math.random() * WORDS.length)] } while (w === prev)
  return w
}

function generateWords(count) {
  const words = []
  for (let i = 0; i < count; i++) words.push(i === 0 ? 'Lorem' : randomWord(words[i - 1]))
  return words.join(' ') + '.'
}

function generateSentence() {
  const len = 8 + Math.floor(Math.random() * 12)
  const words = []
  for (let i = 0; i < len; i++) words.push(i === 0 ? capitalize(randomWord('')) : randomWord(words[i - 1]))
  return words.join(' ') + '.'
}

function generateParagraph(sentences = 5) {
  return Array.from({ length: sentences }, (_, i) =>
    i === 0 ? generateWords(10 + Math.floor(Math.random() * 8)) : generateSentence()
  ).join(' ')
}

function capitalize(w) { return w.charAt(0).toUpperCase() + w.slice(1) }

export default function LoremIpsum() {
  const [type, setType] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Lorem Ipsum Generator Online | OmniverseTools'
  }, [])

  function generate() {
    let text = ''
    if (type === 'paragraphs') {
      text = Array.from({ length: count }, () => generateParagraph()).join('\n\n')
    } else if (type === 'sentences') {
      text = Array.from({ length: count }, (_, i) =>
        i === 0 ? generateWords(10) : generateSentence()
      ).join(' ')
    } else {
      text = generateWords(count)
    }
    setOutput(text)
    setCopied(false)
  }

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const maxCount = type === 'words' ? 500 : type === 'sentences' ? 50 : 20

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Lorem Ipsum Generator</h1>
      <p className="text-gray-400 mb-6">
        Generate placeholder text in seconds — choose how many words, sentences, or paragraphs.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Generate</label>
            <div className="flex bg-zinc-800 rounded-lg p-1">
              {['paragraphs', 'sentences', 'words'].map(t => (
                <button
                  key={t}
                  onClick={() => { setType(t); setCount(t === 'words' ? 50 : t === 'sentences' ? 5 : 3) }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${type === t ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCount(c => Math.max(1, c - 1))}
                className="w-8 h-8 bg-zinc-700 hover:bg-gray-600 text-white rounded-lg text-lg font-bold transition-colors"
              >−</button>
              <input
                type="number"
                min={1}
                max={maxCount}
                value={count}
                onChange={e => setCount(Math.min(maxCount, Math.max(1, Number(e.target.value))))}
                className="w-16 text-center bg-zinc-800 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={() => setCount(c => Math.min(maxCount, c + 1))}
                className="w-8 h-8 bg-zinc-700 hover:bg-gray-600 text-white rounded-lg text-lg font-bold transition-colors"
              >+</button>
            </div>
          </div>

          <button
            onClick={generate}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Generate
          </button>
        </div>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Generated text</label>
            <div className="flex gap-2">
              <button onClick={generate} className="text-xs bg-zinc-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors">
                Regenerate
              </button>
              <button onClick={copy} className="text-xs bg-zinc-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          Lorem Ipsum is placeholder text used in design and publishing to fill space before real
          content is ready. It's been used since the 1500s and is standard in web and print design.
          This generator uses a pool of Latin-like words to produce randomised, natural-looking text.
        </p>
      </div>
    </div>
  )
}
