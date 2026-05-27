import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BadgeCheck, Globe2, PlaneTakeoff, TimerReset, TrendingUp } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import ChartTooltip from '../components/ChartTooltip'
import FilterChip from '../components/FilterChip'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import { useDashboardData } from '../context/useDashboardData'
import { formatNumber, formatPercent } from '../utils/formatters'

const chartColors = ['#3178c6', '#13a89e', '#7467ef', '#f2aa3b', '#f9735b']

function CountryAnalytics() {
  const { countryData, countryTrend, visaTrend, source } = useDashboardData()
  const topCountry = countryData[0] || { code: 'NA', country: 'No country', applications: 0 }
  const bestVisaCountry = [...countryData].sort((a, b) => b.visaSuccess - a.visaSuccess)[0] || topCountry
  const fastestGrowingCountry = [...countryData].sort((a, b) => b.demandGrowth - a.demandGrowth)[0] || topCountry
  const avgVisaSuccess =
    countryData.reduce((total, country) => total + country.visaSuccess, 0) / Math.max(countryData.length, 1)
  const avgProcessingDays = Math.round(
    countryData.reduce((total, country) => total + country.avgProcessingDays, 0) / Math.max(countryData.length, 1),
  )
  const trendCountries = countryData.slice(0, 5)

  const countryKpis = [
    {
      label: 'Top Destination',
      value: topCountry.code,
      change: `${formatNumber(topCountry.applications)} apps`,
      caption: topCountry.country,
      icon: Globe2,
      tone: 'ocean',
    },
    {
      label: 'Best Visa Success',
      value: formatPercent(bestVisaCountry.visaSuccess),
      change: bestVisaCountry.code,
      caption: 'highest approval rate',
      icon: BadgeCheck,
      tone: 'teal',
    },
    {
      label: 'Fastest Demand Growth',
      value: `${fastestGrowingCountry.demandGrowth >= 0 ? '+' : ''}${fastestGrowingCountry.demandGrowth}%`,
      change: fastestGrowingCountry.code,
      caption: source.rowCount ? 'uploaded trend' : 'month-on-month signal',
      icon: TrendingUp,
      tone: 'amber',
    },
    {
      label: 'Avg Processing Time',
      value: `${avgProcessingDays} days`,
      change: source.rowCount ? 'from upload' : '-3 days',
      caption: 'visa documentation cycle',
      icon: TimerReset,
      tone: 'coral',
    },
  ]

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Country analytics"
        title="Compare study abroad markets by demand and outcomes"
        description="Analyze where students are applying, which countries generate better admit and visa outcomes, and where operations should allocate counselor capacity."
      >
        <FilterChip label="Region" value="Global" />
        <FilterChip label="Metric" value="Applications" />
        <FilterChip label="Period" value="6 months" />
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {countryKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="chart-grid mt-5">
        <ChartCard
          title="Applications, admits, and visa outcomes"
          subtitle="Country comparison across the most important operational milestones."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={countryData} margin={{ top: 12, right: 0, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="code" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="applications" name="Applications" fill="#3178c6" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="left" dataKey="admits" name="Admits" fill="#13a89e" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="visaSuccess" name="Visa success" stroke="#f9735b" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Country application trends"
          subtitle="Monthly demand trend by country for the active intake."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={countryTrend} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                {trendCountries.map((country, index) => (
                  <Line
                    key={country.code}
                    type="monotone"
                    dataKey={country.code}
                    stroke={chartColors[index % chartColors.length]}
                    strokeWidth={3}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <ChartCard
          title="Visa pipeline status"
          subtitle="A simple visa operations view showing success, rejection, and pending share."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={visaTrend} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="visaSuccessGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#13a89e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#13a89e" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="success" name="Success" fill="url(#visaSuccessGradient)" stroke="#13a89e" strokeWidth={3} />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#f2aa3b" strokeWidth={3} />
                <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#f9735b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 rounded-lg border border-teal/20 bg-teal/10 p-4 text-sm leading-6 text-muted">
            <span className="font-bold text-ink">Insight:</span> Average visa success is{' '}
            {formatPercent(avgVisaSuccess)}. {bestVisaCountry.country} is strongest on visa outcomes,
            while lower-success countries need more document-readiness checks.
          </div>
        </ChartCard>

        <ChartCard title="Country comparison table" subtitle="A recruiter-friendly operations table.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="py-3 pr-4 font-bold">Country</th>
                  <th className="py-3 pr-4 font-bold">Applications</th>
                  <th className="py-3 pr-4 font-bold">Admit rate</th>
                  <th className="py-3 pr-4 font-bold">Visa success</th>
                  <th className="py-3 pr-4 font-bold">Enrollments</th>
                  <th className="py-3 pr-4 font-bold">Ops note</th>
                </tr>
              </thead>
              <tbody>
                {countryData.map((country, index) => (
                  <tr key={country.code} className="border-b border-line/70 last:border-0">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 font-extrabold text-ink">
                          {country.code.slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-bold text-ink">{country.country}</p>
                          <p className="text-xs text-muted">+{country.demandGrowth}% demand growth</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-ink">{formatNumber(country.applications)}</td>
                    <td className="py-4 pr-4 text-muted">{formatPercent(country.admitRate)}</td>
                    <td className="py-4 pr-4">
                      <div className="min-w-28">
                        <div className="mb-1 flex justify-between gap-2">
                          <span className="text-muted">{formatPercent(country.visaSuccess)}</span>
                        </div>
                        <ProgressBar value={country.visaSuccess} tone={country.visaSuccess >= 75 ? 'teal' : 'amber'} />
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-ink">{formatNumber(country.enrollments)}</td>
                    <td className="py-4 pr-4 text-muted">
                      {index < 2 ? 'High counselor capacity' : country.visaSuccess < 70 ? 'Document review focus' : 'Growth campaign fit'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {countryData.slice(0, 3).map((country, index) => (
          <article key={country.code} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Market rank {index + 1}</p>
                <h3 className="mt-2 text-lg font-extrabold text-ink">{country.country}</h3>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-ocean/10 text-ocean">
                <PlaneTakeoff className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-extrabold text-ink">{country.applications}</p>
                <p className="text-xs text-muted">Apps</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-ink">{country.admits}</p>
                <p className="text-xs text-muted">Admits</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-ink">{country.enrollments}</p>
                <p className="text-xs text-muted">Enroll</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default CountryAnalytics
