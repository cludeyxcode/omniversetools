import { useState, useEffect } from 'react'

function calcAge(dob, ref) {
  const d = new Date(dob)
  const r = new Date(ref)
  if (isNaN(d) || isNaN(r) || d > r) return null

  let years = r.getFullYear() - d.getFullYear()
  let months = r.getMonth() - d.getMonth()
  let days = r.getDate() - d.getDate()

  if (days < 0) {
    months--
    const prev = new Date(r.getFullYear(), r.getMonth(), 0)
    days += prev.getDate()
  }
  if (months < 0) { years--; months += 12 }

  const totalDays = Math.floor((r - d) / 86400000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = totalDays * 24

  const next = new Date(d)
  next.setFullYear(r.getFullYear())
  if (next <= r) next.setFullYear(r.getFullYear() + 1)
  const daysToNext = Math.floor((next - r) / 86400000)

  const DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

  return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysToNext, dobDay: DOW[d.getDay()], dobMonth: MONTHS[d.getMonth()] }
}

export default function AgeCalculator() {
  const today = new Date().toISOString().split('T')[0]
  const [dob, setDob] = useState('1990-01-01')
  const [refDate, setRefDate] = useState(today)

  useEffect(() => {
    document.title = 'Age Calculator Online | OmniverseTools'
  }, [])

  const age = calcAge(dob, refDate)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Age Calculator</h1>
      <p className="text-gray-400 mb-6">
        Find out exactly how old someone is — in years, months, days, weeks, and more.
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date of birth</label>
            <input
              type="date"
              value={dob}
              max={today}
              onChange={e => setDob(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Age at date</label>
            <input
              type="date"
              value={refDate}
              onChange={e => setRefDate(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {age ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-white mb-1">{age.years}</div>
            <div className="text-orange-400 font-medium">years old</div>
            <div className="text-gray-400 text-sm mt-2">
              {age.years} years, {age.months} months, {age.days} days
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['Total days', age.totalDays.toLocaleString()],
              ['Total weeks', age.totalWeeks.toLocaleString()],
              ['Total months', age.totalMonths.toLocaleString()],
              ['Total hours', age.totalHours.toLocaleString()],
              ['Born on', age.dobDay],
              ['Next birthday', `${age.daysToNext} days`],
            ].map(([label, val]) => (
              <div key={label} className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-center">
                <div className="text-gray-500 text-xs mb-1">{label}</div>
                <div className="text-white font-semibold text-sm">{val}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Enter a valid date of birth to see results.
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About this tool</h2>
        <p>
          The calculator gives your exact age by accounting for months of different lengths and leap years.
          Change the "Age at date" field to calculate how old someone will be on a future date, or how old
          they were on a past date.
        </p>
      </div>
    </div>
  )
}
