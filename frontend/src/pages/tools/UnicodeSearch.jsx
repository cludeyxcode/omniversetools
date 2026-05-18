import { useState, useEffect } from 'react'

const GROUPS = [
  {
    label: 'Arrows',
    color: 'blue',
    chars: [
      { char: '←', name: 'Leftwards Arrow', code: 'U+2190', html: '&larr;' },
      { char: '→', name: 'Rightwards Arrow', code: 'U+2192', html: '&rarr;' },
      { char: '↑', name: 'Upwards Arrow', code: 'U+2191', html: '&uarr;' },
      { char: '↓', name: 'Downwards Arrow', code: 'U+2193', html: '&darr;' },
      { char: '↖', name: 'North West Arrow', code: 'U+2196', html: '' },
      { char: '↗', name: 'North East Arrow', code: 'U+2197', html: '' },
      { char: '↘', name: 'South East Arrow', code: 'U+2198', html: '' },
      { char: '↙', name: 'South West Arrow', code: 'U+2199', html: '' },
      { char: '↔', name: 'Left Right Arrow', code: 'U+2194', html: '&harr;' },
      { char: '↕', name: 'Up Down Arrow', code: 'U+2195', html: '' },
      { char: '⇐', name: 'Leftwards Double Arrow', code: 'U+21D0', html: '&lArr;' },
      { char: '⇒', name: 'Rightwards Double Arrow', code: 'U+21D2', html: '&rArr;' },
      { char: '⇑', name: 'Upwards Double Arrow', code: 'U+21D1', html: '&uArr;' },
      { char: '⇓', name: 'Downwards Double Arrow', code: 'U+21D3', html: '&dArr;' },
      { char: '⇔', name: 'Left Right Double Arrow', code: 'U+21D4', html: '&hArr;' },
      { char: '↩', name: 'Leftwards Arrow with Hook', code: 'U+21A9', html: '' },
      { char: '↪', name: 'Rightwards Arrow with Hook', code: 'U+21AA', html: '' },
      { char: '↵', name: 'Downwards Arrow with Corner Leftwards', code: 'U+21B5', html: '&crarr;' },
      { char: '↺', name: 'Anticlockwise Open Circle Arrow', code: 'U+21BA', html: '' },
      { char: '↻', name: 'Clockwise Open Circle Arrow', code: 'U+21BB', html: '' },
      { char: '⟵', name: 'Long Leftwards Arrow', code: 'U+27F5', html: '' },
      { char: '⟶', name: 'Long Rightwards Arrow', code: 'U+27F6', html: '' },
      { char: '⟷', name: 'Long Left Right Arrow', code: 'U+27F7', html: '' },
      { char: '➡', name: 'Black Rightwards Arrow', code: 'U+27A1', html: '' },
      { char: '⬅', name: 'Black Leftwards Arrow', code: 'U+2B05', html: '' },
      { char: '⬆', name: 'Black Upwards Arrow', code: 'U+2B06', html: '' },
      { char: '⬇', name: 'Black Downwards Arrow', code: 'U+2B07', html: '' },
    ],
  },
  {
    label: 'Math & Science',
    color: 'green',
    chars: [
      { char: '∑', name: 'N-ary Summation', code: 'U+2211', html: '&sum;' },
      { char: '∫', name: 'Integral', code: 'U+222B', html: '&int;' },
      { char: '√', name: 'Square Root', code: 'U+221A', html: '&radic;' },
      { char: '∞', name: 'Infinity', code: 'U+221E', html: '&infin;' },
      { char: '±', name: 'Plus-Minus Sign', code: 'U+00B1', html: '&plusmn;' },
      { char: '×', name: 'Multiplication Sign', code: 'U+00D7', html: '&times;' },
      { char: '÷', name: 'Division Sign', code: 'U+00F7', html: '&divide;' },
      { char: '≈', name: 'Almost Equal To', code: 'U+2248', html: '&asymp;' },
      { char: '≠', name: 'Not Equal To', code: 'U+2260', html: '&ne;' },
      { char: '≤', name: 'Less-Than or Equal To', code: 'U+2264', html: '&le;' },
      { char: '≥', name: 'Greater-Than or Equal To', code: 'U+2265', html: '&ge;' },
      { char: '°', name: 'Degree Sign', code: 'U+00B0', html: '&deg;' },
      { char: '∂', name: 'Partial Differential', code: 'U+2202', html: '&part;' },
      { char: '∇', name: 'Nabla / Del Operator', code: 'U+2207', html: '&nabla;' },
      { char: '∆', name: 'Increment / Delta', code: 'U+2206', html: '' },
      { char: '∏', name: 'N-ary Product', code: 'U+220F', html: '&prod;' },
      { char: '∓', name: 'Minus-or-Plus Sign', code: 'U+2213', html: '&mnplus;' },
      { char: '∀', name: 'For All', code: 'U+2200', html: '&forall;' },
      { char: '∃', name: 'There Exists', code: 'U+2203', html: '&exist;' },
      { char: '∄', name: 'There Does Not Exist', code: 'U+2204', html: '' },
      { char: '∅', name: 'Empty Set', code: 'U+2205', html: '&empty;' },
      { char: '∈', name: 'Element Of', code: 'U+2208', html: '&isin;' },
      { char: '∉', name: 'Not an Element Of', code: 'U+2209', html: '&notin;' },
      { char: '⊂', name: 'Subset Of', code: 'U+2282', html: '&sub;' },
      { char: '⊃', name: 'Superset Of', code: 'U+2283', html: '&sup;' },
      { char: '⊆', name: 'Subset Of or Equal To', code: 'U+2286', html: '&sube;' },
      { char: '⊇', name: 'Superset Of or Equal To', code: 'U+2287', html: '&supe;' },
      { char: '⊕', name: 'Circled Plus / XOR', code: 'U+2295', html: '&oplus;' },
      { char: '⊗', name: 'Circled Times', code: 'U+2297', html: '&otimes;' },
      { char: '⊥', name: 'Perpendicular / Up Tack', code: 'U+22A5', html: '&perp;' },
      { char: '∠', name: 'Angle', code: 'U+2220', html: '&ang;' },
      { char: '≡', name: 'Identical To', code: 'U+2261', html: '&equiv;' },
      { char: '≢', name: 'Not Identical To', code: 'U+2262', html: '' },
      { char: '≪', name: 'Much Less-Than', code: 'U+226A', html: '&Lt;' },
      { char: '≫', name: 'Much Greater-Than', code: 'U+226B', html: '&Gt;' },
      { char: 'µ', name: 'Micro Sign', code: 'U+00B5', html: '&micro;' },
    ],
  },
  {
    label: 'Currency',
    color: 'yellow',
    chars: [
      { char: '$', name: 'Dollar Sign', code: 'U+0024', html: '' },
      { char: '€', name: 'Euro Sign', code: 'U+20AC', html: '&euro;' },
      { char: '£', name: 'Pound Sign', code: 'U+00A3', html: '&pound;' },
      { char: '¥', name: 'Yen / Yuan Sign', code: 'U+00A5', html: '&yen;' },
      { char: '₹', name: 'Indian Rupee Sign', code: 'U+20B9', html: '' },
      { char: '₩', name: 'Korean Won Sign', code: 'U+20A9', html: '' },
      { char: '₪', name: 'New Shekel Sign', code: 'U+20AA', html: '' },
      { char: '₫', name: 'Vietnamese Dong Sign', code: 'U+20AB', html: '' },
      { char: '₴', name: 'Ukrainian Hryvnia Sign', code: 'U+20B4', html: '' },
      { char: '₸', name: 'Kazakhstani Tenge Sign', code: 'U+20B8', html: '' },
      { char: '₺', name: 'Turkish Lira Sign', code: 'U+20BA', html: '' },
      { char: '₽', name: 'Russian Ruble Sign', code: 'U+20BD', html: '' },
      { char: '¢', name: 'Cent Sign', code: 'U+00A2', html: '&cent;' },
      { char: '₦', name: 'Nigerian Naira Sign', code: 'U+20A6', html: '' },
      { char: '₱', name: 'Philippine Peso Sign', code: 'U+20B1', html: '' },
      { char: '฿', name: 'Thai Baht Sign', code: 'U+0E3F', html: '' },
      { char: '₲', name: 'Paraguayan Guaraní Sign', code: 'U+20B2', html: '' },
      { char: '₼', name: 'Azerbaijani Manat Sign', code: 'U+20BC', html: '' },
    ],
  },
  {
    label: 'Legal & Technical',
    color: 'purple',
    chars: [
      { char: '©', name: 'Copyright Sign', code: 'U+00A9', html: '&copy;' },
      { char: '®', name: 'Registered Sign', code: 'U+00AE', html: '&reg;' },
      { char: '™', name: 'Trade Mark Sign', code: 'U+2122', html: '&trade;' },
      { char: '℗', name: 'Sound Recording Copyright', code: 'U+2117', html: '' },
      { char: '℠', name: 'Service Mark', code: 'U+2120', html: '' },
      { char: '℃', name: 'Degree Celsius', code: 'U+2103', html: '' },
      { char: '℉', name: 'Degree Fahrenheit', code: 'U+2109', html: '' },
      { char: 'Å', name: 'Angstrom Sign', code: 'U+212B', html: '' },
      { char: '‰', name: 'Per Mille Sign', code: 'U+2030', html: '&permil;' },
      { char: '‱', name: 'Per Ten Thousand Sign', code: 'U+2031', html: '' },
      { char: '№', name: 'Numero Sign', code: 'U+2116', html: '' },
      { char: 'Ω', name: 'Ohm Sign', code: 'U+2126', html: '' },
      { char: '℞', name: 'Prescription Take Sign', code: 'U+211E', html: '' },
    ],
  },
  {
    label: 'Typography & Punctuation',
    color: 'orange',
    chars: [
      { char: '‘', name: 'Left Single Quotation Mark', code: 'U+2018', html: '&lsquo;' },
      { char: '’', name: 'Right Single Quotation Mark', code: 'U+2019', html: '&rsquo;' },
      { char: '“', name: 'Left Double Quotation Mark', code: 'U+201C', html: '&ldquo;' },
      { char: '”', name: 'Right Double Quotation Mark', code: 'U+201D', html: '&rdquo;' },
      { char: '«', name: 'Left Double Angle Quotation Mark', code: 'U+00AB', html: '&laquo;' },
      { char: '»', name: 'Right Double Angle Quotation Mark', code: 'U+00BB', html: '&raquo;' },
      { char: '‹', name: 'Left Single Angle Quotation Mark', code: 'U+2039', html: '&lsaquo;' },
      { char: '›', name: 'Right Single Angle Quotation Mark', code: 'U+203A', html: '&rsaquo;' },
      { char: '—', name: 'Em Dash', code: 'U+2014', html: '&mdash;' },
      { char: '–', name: 'En Dash', code: 'U+2013', html: '&ndash;' },
      { char: '‒', name: 'Figure Dash', code: 'U+2012', html: '' },
      { char: '‐', name: 'Hyphen', code: 'U+2010', html: '' },
      { char: '…', name: 'Horizontal Ellipsis', code: 'U+2026', html: '&hellip;' },
      { char: '‥', name: 'Two Dot Leader', code: 'U+2025', html: '' },
      { char: '•', name: 'Bullet', code: 'U+2022', html: '&bull;' },
      { char: '·', name: 'Middle Dot', code: 'U+00B7', html: '&middot;' },
      { char: '¶', name: 'Pilcrow Sign (Paragraph)', code: 'U+00B6', html: '&para;' },
      { char: '§', name: 'Section Sign', code: 'U+00A7', html: '&sect;' },
      { char: '†', name: 'Dagger', code: 'U+2020', html: '&dagger;' },
      { char: '‡', name: 'Double Dagger', code: 'U+2021', html: '&Dagger;' },
      { char: '※', name: 'Reference Mark', code: 'U+203B', html: '' },
      { char: '¿', name: 'Inverted Question Mark', code: 'U+00BF', html: '&iquest;' },
      { char: '¡', name: 'Inverted Exclamation Mark', code: 'U+00A1', html: '&iexcl;' },
      { char: '‼', name: 'Double Exclamation Mark', code: 'U+203C', html: '' },
    ],
  },
  {
    label: 'Greek Letters',
    color: 'teal',
    chars: [
      { char: 'α', name: 'Greek Small Alpha', code: 'U+03B1', html: '&alpha;' },
      { char: 'β', name: 'Greek Small Beta', code: 'U+03B2', html: '&beta;' },
      { char: 'γ', name: 'Greek Small Gamma', code: 'U+03B3', html: '&gamma;' },
      { char: 'δ', name: 'Greek Small Delta', code: 'U+03B4', html: '&delta;' },
      { char: 'ε', name: 'Greek Small Epsilon', code: 'U+03B5', html: '&epsilon;' },
      { char: 'ζ', name: 'Greek Small Zeta', code: 'U+03B6', html: '&zeta;' },
      { char: 'η', name: 'Greek Small Eta', code: 'U+03B7', html: '&eta;' },
      { char: 'θ', name: 'Greek Small Theta', code: 'U+03B8', html: '&theta;' },
      { char: 'ι', name: 'Greek Small Iota', code: 'U+03B9', html: '&iota;' },
      { char: 'κ', name: 'Greek Small Kappa', code: 'U+03BA', html: '&kappa;' },
      { char: 'λ', name: 'Greek Small Lambda', code: 'U+03BB', html: '&lambda;' },
      { char: 'μ', name: 'Greek Small Mu', code: 'U+03BC', html: '&mu;' },
      { char: 'ν', name: 'Greek Small Nu', code: 'U+03BD', html: '&nu;' },
      { char: 'ξ', name: 'Greek Small Xi', code: 'U+03BE', html: '&xi;' },
      { char: 'ο', name: 'Greek Small Omicron', code: 'U+03BF', html: '' },
      { char: 'π', name: 'Greek Small Pi', code: 'U+03C0', html: '&pi;' },
      { char: 'ρ', name: 'Greek Small Rho', code: 'U+03C1', html: '&rho;' },
      { char: 'σ', name: 'Greek Small Sigma', code: 'U+03C3', html: '&sigma;' },
      { char: 'τ', name: 'Greek Small Tau', code: 'U+03C4', html: '&tau;' },
      { char: 'υ', name: 'Greek Small Upsilon', code: 'U+03C5', html: '&upsilon;' },
      { char: 'φ', name: 'Greek Small Phi', code: 'U+03C6', html: '&phi;' },
      { char: 'χ', name: 'Greek Small Chi', code: 'U+03C7', html: '&chi;' },
      { char: 'ψ', name: 'Greek Small Psi', code: 'U+03C8', html: '&psi;' },
      { char: 'ω', name: 'Greek Small Omega', code: 'U+03C9', html: '&omega;' },
      { char: 'Α', name: 'Greek Capital Alpha', code: 'U+0391', html: '&Alpha;' },
      { char: 'Β', name: 'Greek Capital Beta', code: 'U+0392', html: '&Beta;' },
      { char: 'Γ', name: 'Greek Capital Gamma', code: 'U+0393', html: '&Gamma;' },
      { char: 'Δ', name: 'Greek Capital Delta', code: 'U+0394', html: '&Delta;' },
      { char: 'Ε', name: 'Greek Capital Epsilon', code: 'U+0395', html: '&Epsilon;' },
      { char: 'Ζ', name: 'Greek Capital Zeta', code: 'U+0396', html: '&Zeta;' },
      { char: 'Η', name: 'Greek Capital Eta', code: 'U+0397', html: '&Eta;' },
      { char: 'Θ', name: 'Greek Capital Theta', code: 'U+0398', html: '&Theta;' },
      { char: 'Ι', name: 'Greek Capital Iota', code: 'U+0399', html: '&Iota;' },
      { char: 'Κ', name: 'Greek Capital Kappa', code: 'U+039A', html: '&Kappa;' },
      { char: 'Λ', name: 'Greek Capital Lambda', code: 'U+039B', html: '&Lambda;' },
      { char: 'Μ', name: 'Greek Capital Mu', code: 'U+039C', html: '&Mu;' },
      { char: 'Ν', name: 'Greek Capital Nu', code: 'U+039D', html: '&Nu;' },
      { char: 'Ξ', name: 'Greek Capital Xi', code: 'U+039E', html: '&Xi;' },
      { char: 'Ο', name: 'Greek Capital Omicron', code: 'U+039F', html: '' },
      { char: 'Π', name: 'Greek Capital Pi', code: 'U+03A0', html: '&Pi;' },
      { char: 'Ρ', name: 'Greek Capital Rho', code: 'U+03A1', html: '&Rho;' },
      { char: 'Σ', name: 'Greek Capital Sigma', code: 'U+03A3', html: '&Sigma;' },
      { char: 'Τ', name: 'Greek Capital Tau', code: 'U+03A4', html: '&Tau;' },
      { char: 'Υ', name: 'Greek Capital Upsilon', code: 'U+03A5', html: '&Upsilon;' },
      { char: 'Φ', name: 'Greek Capital Phi', code: 'U+03A6', html: '&Phi;' },
      { char: 'Χ', name: 'Greek Capital Chi', code: 'U+03A7', html: '&Chi;' },
      { char: 'Ψ', name: 'Greek Capital Psi', code: 'U+03A8', html: '&Psi;' },
      { char: 'Ω', name: 'Greek Capital Omega', code: 'U+03A9', html: '&Omega;' },
    ],
  },
  {
    label: 'Shapes & Symbols',
    color: 'red',
    chars: [
      { char: '★', name: 'Black Star', code: 'U+2605', html: '&starf;' },
      { char: '☆', name: 'White Star', code: 'U+2606', html: '&star;' },
      { char: '♦', name: 'Black Diamond Suit', code: 'U+2666', html: '&diams;' },
      { char: '♠', name: 'Black Spade Suit', code: 'U+2660', html: '&spades;' },
      { char: '♣', name: 'Black Club Suit', code: 'U+2663', html: '&clubs;' },
      { char: '♥', name: 'Black Heart Suit', code: 'U+2665', html: '&hearts;' },
      { char: '♡', name: 'White Heart Suit', code: 'U+2661', html: '' },
      { char: '♤', name: 'White Spade Suit', code: 'U+2664', html: '' },
      { char: '♧', name: 'White Club Suit', code: 'U+2667', html: '' },
      { char: '⚡', name: 'High Voltage / Lightning', code: 'U+26A1', html: '' },
      { char: '⚠', name: 'Warning Sign', code: 'U+26A0', html: '' },
      { char: '✓', name: 'Check Mark', code: 'U+2713', html: '&check;' },
      { char: '✗', name: 'Ballot X', code: 'U+2717', html: '' },
      { char: '✔', name: 'Heavy Check Mark', code: 'U+2714', html: '' },
      { char: '✘', name: 'Heavy Ballot X', code: 'U+2718', html: '' },
      { char: '☑', name: 'Ballot Box with Check', code: 'U+2611', html: '' },
      { char: '☒', name: 'Ballot Box with X', code: 'U+2612', html: '' },
      { char: '☐', name: 'Ballot Box (Empty)', code: 'U+2610', html: '' },
      { char: '☀', name: 'Black Sun with Rays', code: 'U+2600', html: '' },
      { char: '☁', name: 'Cloud', code: 'U+2601', html: '' },
      { char: '☂', name: 'Umbrella', code: 'U+2602', html: '' },
      { char: '❄', name: 'Snowflake', code: 'U+2744', html: '' },
      { char: '♪', name: 'Eighth Note (Music)', code: 'U+266A', html: '' },
      { char: '♫', name: 'Beamed Eighth Notes', code: 'U+266B', html: '' },
      { char: '☎', name: 'Black Telephone', code: 'U+260E', html: '' },
      { char: '✉', name: 'Envelope', code: 'U+2709', html: '' },
    ],
  },
  {
    label: 'Superscripts & Fractions',
    color: 'violet',
    chars: [
      { char: '¹', name: 'Superscript One', code: 'U+00B9', html: '&sup1;' },
      { char: '²', name: 'Superscript Two', code: 'U+00B2', html: '&sup2;' },
      { char: '³', name: 'Superscript Three', code: 'U+00B3', html: '&sup3;' },
      { char: '⁴', name: 'Superscript Four', code: 'U+2074', html: '' },
      { char: '⁵', name: 'Superscript Five', code: 'U+2075', html: '' },
      { char: '⁶', name: 'Superscript Six', code: 'U+2076', html: '' },
      { char: '⁷', name: 'Superscript Seven', code: 'U+2077', html: '' },
      { char: '⁸', name: 'Superscript Eight', code: 'U+2078', html: '' },
      { char: '⁹', name: 'Superscript Nine', code: 'U+2079', html: '' },
      { char: '⁰', name: 'Superscript Zero', code: 'U+2070', html: '' },
      { char: '⁺', name: 'Superscript Plus Sign', code: 'U+207A', html: '' },
      { char: '⁻', name: 'Superscript Minus', code: 'U+207B', html: '' },
      { char: '¼', name: 'Vulgar Fraction One Quarter', code: 'U+00BC', html: '&frac14;' },
      { char: '½', name: 'Vulgar Fraction One Half', code: 'U+00BD', html: '&frac12;' },
      { char: '¾', name: 'Vulgar Fraction Three Quarters', code: 'U+00BE', html: '&frac34;' },
      { char: '⅓', name: 'Vulgar Fraction One Third', code: 'U+2153', html: '' },
      { char: '⅔', name: 'Vulgar Fraction Two Thirds', code: 'U+2154', html: '' },
      { char: '⅕', name: 'Vulgar Fraction One Fifth', code: 'U+2155', html: '' },
      { char: '⅙', name: 'Vulgar Fraction One Sixth', code: 'U+2159', html: '' },
      { char: '⅛', name: 'Vulgar Fraction One Eighth', code: 'U+215B', html: '' },
    ],
  },
]

const COLOR_CLASSES = {
  blue:   { badge: 'bg-blue-500/10 text-blue-400',     heading: 'text-blue-400',   char: 'text-blue-300' },
  green:  { badge: 'bg-green-500/10 text-green-400',   heading: 'text-green-400',  char: 'text-green-300' },
  yellow: { badge: 'bg-yellow-500/10 text-yellow-400', heading: 'text-yellow-400', char: 'text-yellow-300' },
  purple: { badge: 'bg-purple-500/10 text-purple-400', heading: 'text-purple-400', char: 'text-purple-300' },
  orange: { badge: 'bg-orange-500/10 text-orange-400', heading: 'text-orange-400', char: 'text-orange-300' },
  teal:   { badge: 'bg-teal-500/10 text-teal-400',    heading: 'text-teal-400',   char: 'text-teal-300' },
  red:    { badge: 'bg-red-500/10 text-red-400',      heading: 'text-red-400',    char: 'text-red-300' },
  violet: { badge: 'bg-violet-500/10 text-violet-400', heading: 'text-violet-400', char: 'text-violet-300' },
}

export default function UnicodeSearch() {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    document.title = 'Unicode / Symbol Search | OmniverseTools'
  }, [])

  const q = query.trim().toLowerCase()

  const filtered = GROUPS.map(group => ({
    ...group,
    chars: q
      ? group.chars.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.html && c.html.toLowerCase().includes(q))
        )
      : group.chars,
  })).filter(g => g.chars.length > 0)

  const total = GROUPS.reduce((sum, g) => sum + g.chars.length, 0)
  const resultCount = filtered.reduce((sum, g) => sum + g.chars.length, 0)

  function copyChar(char, code) {
    navigator.clipboard.writeText(char).then(() => {
      setCopied(code)
      setTimeout(() => setCopied(c => c === code ? null : c), 1500)
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Unicode / Symbol Search</h1>
      <p className="text-gray-400 mb-8">
        Search {total} Unicode characters — arrows, math symbols, currency, Greek letters, and more. Click any symbol to copy it to your clipboard.
      </p>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, code point (e.g. U+2192), or HTML entity (e.g. &rarr;)…"
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
        />
      </div>

      {/* Category chips */}
      {!q && (
        <div className="flex flex-wrap gap-2 mb-8">
          {GROUPS.map(({ label, color, chars }) => (
            <span key={label} className={`text-xs px-3 py-1.5 rounded-full ${COLOR_CLASSES[color].badge}`}>
              {label} ({chars.length})
            </span>
          ))}
        </div>
      )}

      {/* Result count while searching */}
      {q && (
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">
          {resultCount} result{resultCount !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No symbols match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="space-y-10">
          {filtered.map(({ label, color, chars }) => {
            const cls = COLOR_CLASSES[color]
            return (
              <section key={label}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-lg font-bold ${cls.heading}`}>{label}</span>
                  <span className="ml-auto text-xs text-gray-600 bg-zinc-800 px-2.5 py-1 rounded-full">
                    {chars.length} symbol{chars.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  {chars.map(({ char, name, code, html }) => (
                    <button
                      key={code}
                      onClick={() => copyChar(char, code)}
                      title={`${name} (${code}) — click to copy`}
                      className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-orange-500 hover:bg-zinc-800 transition-all text-center"
                    >
                      {copied === code && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/95 rounded-xl z-10">
                          <span className="text-orange-400 text-xs font-semibold">Copied!</span>
                        </div>
                      )}
                      <div className={`text-2xl mb-1.5 leading-none ${cls.char}`}>{char}</div>
                      <div className="text-gray-400 text-[10px] leading-tight mb-0.5 line-clamp-2">{name}</div>
                      <div className="text-gray-600 text-[10px] font-mono">{code}</div>
                      {html && <div className="text-gray-600 text-[10px] font-mono truncate">{html}</div>}
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About Unicode</h2>
        <p>
          Unicode is the universal character encoding standard — every character in every writing system has a unique code point
          written as <span className="text-orange-400 font-mono">U+XXXX</span> (hexadecimal). HTML entities like{' '}
          <span className="text-orange-400 font-mono">&amp;copy;</span> for © are an alternative for embedding special characters
          in HTML without encoding issues. Click any symbol to copy it directly to your clipboard.
        </p>
      </div>
    </div>
  )
}
