import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BadgeCheck,
  Clock3,
  GraduationCap,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import ChartCard from '../components/ChartCard'
import ChartTooltip from '../components/ChartTooltip'
import DataUploadPanel from '../components/DataUploadPanel'
import FilterChip from '../components/FilterChip'
import FunnelSnapshot from '../components/FunnelSnapshot'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import { useDashboardData } from '../context/useDashboardData'
import { formatNumber, formatPercent, getConversionRate } from '../utils/formatters'

function ExecutiveDashboard() {
  const {
    countryData,
    funnelAnalytics,
    intakeSummary,
    monthlyTrend,
    quickInsights,
    recentActivity,
    sourceMix,
    source,
  } = useDashboardData()
  const topCountries = countryData.slice(0, 5)
  const leads = funnelAnalytics[0]?.value || 0
  const applications = funnelAnalytics[2]?.value || 0
  const admits = funnelAnalytics[3]?.value || 0
  const visas = funnelAnalytics[4]?.value || 0

  const kpis = [
    {
      label: 'Total Students',
      value: formatNumber(leads),
      change: source.rowCount ? 'Live data' : '+18.4%',
      caption: 'from active intake leads',
      icon: UsersRound,
      tone: 'ocean',
    },
    {
      label: 'Lead to Enrollment',
      value: formatPercent(intakeSummary.leadToEnrollment),
      change: source.rowCount ? source.type : '+2.1 pts',
      caption: 'overall funnel conversion',
      icon: GraduationCap,
      tone: 'teal',
    },
    {
      label: 'Application Submit Rate',
      value: formatPercent(getConversionRate(applications, leads)),
      change: source.rowCount ? `${formatNumber(applications)} apps` : '+5.6 pts',
      caption: 'leads reaching applications',
      icon: Target,
      tone: 'grape',
    },
    {
      label: 'Visa Success Rate',
      value: formatPercent(getConversionRate(visas, admits)),
      change: source.rowCount ? `${formatNumber(visas)} visas` : '+4.3 pts',
      caption: 'from admits received',
      icon: BadgeCheck,
      tone: 'amber',
    },
  ]

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Executive dashboard"
        title="Study Abroad Operational Analytics"
        description="A recruiter-friendly view of the full student funnel, operational KPIs, country demand, and high-priority business insights for a study abroad consultancy."
      >
        <FilterChip label="Intake" value="Spring 2026" />
        <FilterChip label="Segment" value="All students" />
      </PageHeader>

      <DataUploadPanel />

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Student funnel overview"
          subtitle="Stage-wise movement from lead generation to enrollment confirmation."
        >
          <FunnelSnapshot />
        </ChartCard>

        <ChartCard
          title="Quick operational insights"
          subtitle="The talking points that make the dashboard useful to business teams."
        >
          <div className="space-y-4">
            {quickInsights.map((insight) => (
              <article key={insight.title} className="border-b border-line/70 pb-4 last:border-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="eyebrow">{insight.label}</span>
                  <span className="rounded-full bg-amber/10 px-2.5 py-1 text-xs font-bold text-amber">
                    {insight.metric}
                  </span>
                </div>
                <h3 className="font-bold text-ink">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{insight.detail}</p>
              </article>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="chart-grid mt-5">
        <ChartCard
          title="Monthly intake pipeline"
          subtitle="Leads, applications, admits, and enrollments over the last 6 months."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3178c6" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#3178c6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="enrollmentGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#13a89e" stopOpacity={0.36} />
                    <stop offset="100%" stopColor="#13a89e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#3178c6" strokeWidth={3} fill="url(#leadsGradient)" />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#7467ef" strokeWidth={3} fill="transparent" />
                <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke="#13a89e" strokeWidth={3} fill="url(#enrollmentGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top countries by applications"
          subtitle="Where students are applying most frequently."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCountries} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="code" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="applications" name="Applications" radius={[8, 8, 0, 0]}>
                  {topCountries.map((country, index) => (
                    <Cell key={country.code} fill={['#3178c6', '#13a89e', '#7467ef', '#f2aa3b', '#f9735b'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <ChartCard title="Lead source mix" subtitle="Mock acquisition channel split for the intake.">
          <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
                    {sourceMix.map((source) => (
                      <Cell key={source.name} fill={source.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {sourceMix.map((source) => (
                <div key={source.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium text-muted">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                    {source.name}
                  </span>
                  <span className="font-bold text-ink">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Recent activity" subtitle="Operational events a manager would act on this week.">
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <article key={activity.title} className="flex items-start gap-3 rounded-lg border border-line/70 bg-white/70 p-3">
                <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100">
                  {activity.tone === 'teal' ? <TrendingUp className="h-4 w-4 text-teal" /> : null}
                  {activity.tone === 'coral' ? <Clock3 className="h-4 w-4 text-coral" /> : null}
                  {activity.tone === 'amber' ? <BadgeCheck className="h-4 w-4 text-amber" /> : null}
                  {activity.tone === 'ocean' ? <UsersRound className="h-4 w-4 text-ocean" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-ink">{activity.title}</h3>
                  <p className="mt-1 text-sm text-muted">{activity.meta}</p>
                </div>
                <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-ink sm:inline-flex">
                  {activity.impact}
                </span>
              </article>
            ))}
          </div>
        </ChartCard>
      </section>
    </div>
  )
}

export default ExecutiveDashboard
