import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'

// Eagerly loaded — small, no heavy deps
import QrCode from './pages/tools/QrCode'
import JsonFormatter from './pages/tools/JsonFormatter'
import Base64 from './pages/tools/Base64'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import WordCounter from './pages/tools/WordCounter'
import UnitConverter from './pages/tools/UnitConverter'
import ColorConverter from './pages/tools/ColorConverter'
import RegexTester from './pages/tools/RegexTester'
import UrlEncoder from './pages/tools/UrlEncoder'
import HashGenerator from './pages/tools/HashGenerator'
import TimestampConverter from './pages/tools/TimestampConverter'
import UuidGenerator from './pages/tools/UuidGenerator'
import StringCaseConverter from './pages/tools/StringCaseConverter'
import PercentageCalculator from './pages/tools/PercentageCalculator'
import AgeCalculator from './pages/tools/AgeCalculator'
import TextSorter from './pages/tools/TextSorter'
import BmiCalculator from './pages/tools/BmiCalculator'
import BmrCalculator from './pages/tools/BmrCalculator'
import IdealWeightCalculator from './pages/tools/IdealWeightCalculator'
import TipCalculator from './pages/tools/TipCalculator'
import LoanCalculator from './pages/tools/LoanCalculator'
import CompoundInterest from './pages/tools/CompoundInterest'
import RandomNumberGenerator from './pages/tools/RandomNumberGenerator'
import ScientificCalculator from './pages/tools/ScientificCalculator'
import DateDurationCalculator from './pages/tools/DateDurationCalculator'
import TimezoneConverter from './pages/tools/TimezoneConverter'
import Slugify from './pages/tools/Slugify'
import ChmodCalculator from './pages/tools/ChmodCalculator'
import WordFrequencyCounter from './pages/tools/WordFrequencyCounter'
import ReadingTimeEstimator from './pages/tools/ReadingTimeEstimator'
import CharacterLimitTester from './pages/tools/CharacterLimitTester'
import AspectRatioCalculator from './pages/tools/AspectRatioCalculator'
import RomanNumeralConverter from './pages/tools/RomanNumeralConverter'
import VatCalculator from './pages/tools/VatCalculator'
import CurrencyFormatter from './pages/tools/CurrencyFormatter'
import MortgageCalculator from './pages/tools/MortgageCalculator'
import BodyFatCalculator from './pages/tools/BodyFatCalculator'
import WaterIntakeCalculator from './pages/tools/WaterIntakeCalculator'

// Lazily loaded — heavier dependencies split into separate chunks
const MarkdownPreviewer   = lazy(() => import('./pages/tools/MarkdownPreviewer'))
const DiffChecker         = lazy(() => import('./pages/tools/DiffChecker'))
const ImageToBase64       = lazy(() => import('./pages/tools/ImageToBase64'))
const JwtDecoder          = lazy(() => import('./pages/tools/JwtDecoder'))
const CssMinifier         = lazy(() => import('./pages/tools/CssMinifier'))
const HtmlMinifier        = lazy(() => import('./pages/tools/HtmlMinifier'))
const CronExplainer       = lazy(() => import('./pages/tools/CronExplainer'))
const LoremIpsum          = lazy(() => import('./pages/tools/LoremIpsum'))
const NumberBaseConverter = lazy(() => import('./pages/tools/NumberBaseConverter'))
const SqlFormatter        = lazy(() => import('./pages/tools/SqlFormatter'))
const HtmlEntityEncoder   = lazy(() => import('./pages/tools/HtmlEntityEncoder'))
const JsonCsvConverter    = lazy(() => import('./pages/tools/JsonCsvConverter'))
const ColorPaletteGenerator = lazy(() => import('./pages/tools/ColorPaletteGenerator'))

const Loader = () => (
  <div className="flex items-center justify-center min-h-[40vh] text-gray-500 text-sm">Loading…</div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tools/qr-code" element={<QrCode />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64" element={<Base64 />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/url-encoder" element={<UrlEncoder />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/string-case-converter" element={<StringCaseConverter />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/text-sorter" element={<TextSorter />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/bmr-calculator" element={<BmrCalculator />} />
            <Route path="/tools/ideal-weight-calculator" element={<IdealWeightCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/compound-interest" element={<CompoundInterest />} />
            <Route path="/tools/random-number-generator" element={<RandomNumberGenerator />} />
            <Route path="/tools/scientific-calculator" element={<ScientificCalculator />} />
            <Route path="/tools/date-duration-calculator" element={<DateDurationCalculator />} />
            <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
            <Route path="/tools/slugify" element={<Slugify />} />
            <Route path="/tools/chmod-calculator" element={<ChmodCalculator />} />
            <Route path="/tools/word-frequency-counter" element={<WordFrequencyCounter />} />
            <Route path="/tools/reading-time-estimator" element={<ReadingTimeEstimator />} />
            <Route path="/tools/character-limit-tester" element={<CharacterLimitTester />} />
            <Route path="/tools/aspect-ratio-calculator" element={<AspectRatioCalculator />} />
            <Route path="/tools/roman-numeral-converter" element={<RomanNumeralConverter />} />
            <Route path="/tools/vat-calculator" element={<VatCalculator />} />
            <Route path="/tools/currency-formatter" element={<CurrencyFormatter />} />
            <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/tools/body-fat-calculator" element={<BodyFatCalculator />} />
            <Route path="/tools/water-intake-calculator" element={<WaterIntakeCalculator />} />
            <Route path="/tools/markdown-previewer" element={<MarkdownPreviewer />} />
            <Route path="/tools/diff-checker" element={<DiffChecker />} />
            <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/css-minifier" element={<CssMinifier />} />
            <Route path="/tools/html-minifier" element={<HtmlMinifier />} />
            <Route path="/tools/cron-explainer" element={<CronExplainer />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
            <Route path="/tools/html-entity-encoder" element={<HtmlEntityEncoder />} />
            <Route path="/tools/json-csv-converter" element={<JsonCsvConverter />} />
            <Route path="/tools/color-palette-generator" element={<ColorPaletteGenerator />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
