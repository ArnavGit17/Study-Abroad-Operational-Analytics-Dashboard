import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Award, Clock3, MessageSquareText, Trophy, UserCheck, UsersRound } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import ChartTooltip from '../components/ChartTooltip'
import FilterChip from '../components/FilterChip'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import { useDashboardData } from '../context/useDashboardData'
import { formatNumber, formatPercent, sumBy } from '../utils/formatters'

const chartColors = ['#3178c6', '#13a89e', '#f2aa3b', '#7467ef', '#f9735b']

function CounselorPerformance() {
  const { counselorRadar, counselors, counselorTrend, source } = useDashboardData()
  const totalStudents = sumBy(counselors, 'students')
  const totalEnrollments = sumBy(counselors, 'enrollments')
  const avgConversion = (totalEnrollments / Math.max(totalStudents, 1)) * 100
  const topCounselor = [...counselors].sort((a, b) => b.conversion - a.conversion)[0] || {
    name: 'No counselor',
    conversion: 0,
    region: 'No data',
  }
  const fastestResponder = [...counselors].sort((a, b) => a.responseHours - b.responseHours)[0] || {
    name: 'No counselor',
    responseHours: 0,
  }
  const counselorKeys = counselors.slice(0, 5).map((counselor) => counselor.name.split(' ')[0])
  const radarKeys = counselors.slice(0, 4).map((counselor) => counselor.name.split(' ')[0])

  const counselorKpis = [
    {
      label: 'Students Handled',
      value: formatNumber(totalStudents),
      change: source.rowCount ? source.type : '+12.8%',
      caption: `across ${counselors.length} counselors`,
      icon: UsersRound,
      tone: 'ocean',
    },
    {
      label: 'Avg Conversion',
      value: formatPercent(avgConversion),
      change: source.rowCount ? 'uploaded rows' : '+1.9 pts',
      caption: 'lead to enrollment',
      icon: UserCheck,
      tone: 'teal',
    },
    {
      label: 'Top Counselor',
      value: topCounselor.name.split(' ')[0],
      change: formatPercent(topCounselor.conversion),
      caption: topCounselor.region,
      icon: Trophy,
      tone: 'amber',
    },
    {
      label: 'Fastest Response',
      value: `${fastestResponder.responseHours}h`,
      change: fastestResponder.name.split(' ')[0],
      caption: 'avg student response time',
      icon: Clock3,
      tone: 'coral',
    },
  ]

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Counselor performance"
        title="Measure counselor workload, speed, and conversion quality"
        description="A practical operational dashboard for understanding counselor productivity, comparing conversion outcomes, and spotting which playbooks can be reused across the team."
      >
        <FilterChip label="Team" value="Admissions Ops" />
        <FilterChip label="Metric" value="Enrollment" />
        <FilterChip label="Period" value="Monthly" />
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counselorKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="chart-grid mt-5">
        <ChartCard
          title="Counselor workload and outcomes"
          subtitle="Compare students handled, applications submitted, and confirmed enrollments."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={counselors} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 11 }} interval={0} angle={-16} textAnchor="end" height={70} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="students" name="Students" fill="#3178c6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="applications" name="Applications" fill="#7467ef" radius={[8, 8, 0, 0]} />
                <Bar dataKey="enrollments" name="Enrollments" fill="#13a89e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Performance quality radar"
          subtitle="Mock scorecard combining conversion, speed, admits, visa outcomes, and CSAT."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={counselorRadar} outerRadius="76%">
                <PolarGrid stroke="#dfe6ef" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                {radarKeys.map((key, index) => (
                  <Radar
                    key={key}
                    name={key}
                    dataKey={key}
                    stroke={chartColors[index % chartColors.length]}
                    fill={chartColors[index % chartColors.length]}
                    fillOpacity={0.14}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Monthly enrollments by counselor"
          subtitle="A trendline-style comparison of counselor enrollment outcomes."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={counselorTrend} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                {counselorKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={chartColors[index % chartColors.length]}
                    radius={index === counselorKeys.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top counselor playbooks" subtitle="Simple insights an operations intern can explain.">
          <div className="space-y-4">
            <article className="rounded-lg border border-teal/20 bg-teal/10 p-4">
              <div className="mb-2 flex items-center gap-2 font-bold text-ink">
                <Award className="h-4 w-4 text-teal" />
                Replicate {topCounselor.name.split(' ')[0]}'s workflow
              </div>
              <p className="text-sm leading-6 text-muted">
                Best conversion at {formatPercent(topCounselor.conversion)} with high application-to-admit quality.
              </p>
            </article>
            <article className="rounded-lg border border-ocean/20 bg-ocean/10 p-4">
              <div className="mb-2 flex items-center gap-2 font-bold text-ink">
                <MessageSquareText className="h-4 w-4 text-ocean" />
                Keep response time below 15 hours
              </div>
              <p className="text-sm leading-6 text-muted">
                Faster responders show stronger conversion and better student satisfaction scores.
              </p>
            </article>
            <article className="rounded-lg border border-amber/25 bg-amber/10 p-4">
              <div className="mb-2 flex items-center gap-2 font-bold text-ink">
                <Clock3 className="h-4 w-4 text-amber" />
                Coach overloaded counselors
              </div>
              <p className="text-sm leading-6 text-muted">
                Kabir handles a smaller market but has the slowest response time and needs follow-up automation.
              </p>
            </article>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5">
        <ChartCard title="Counselor leaderboard" subtitle="Operational ranking with workload and quality context.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="py-3 pr-4 font-bold">Counselor</th>
                  <th className="py-3 pr-4 font-bold">Students</th>
                  <th className="py-3 pr-4 font-bold">Applications</th>
                  <th className="py-3 pr-4 font-bold">Enrollments</th>
                  <th className="py-3 pr-4 font-bold">Conversion</th>
                  <th className="py-3 pr-4 font-bold">Target</th>
                  <th className="py-3 pr-4 font-bold">CSAT</th>
                </tr>
              </thead>
              <tbody>
                {[...counselors]
                  .sort((a, b) => b.conversion - a.conversion)
                  .map((counselor, index) => (
                    <tr key={counselor.name} className="border-b border-line/70 last:border-0">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 font-extrabold text-ink">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-bold text-ink">{counselor.name}</p>
                            <p className="text-xs text-muted">{counselor.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-semibold text-ink">{formatNumber(counselor.students)}</td>
                      <td className="py-4 pr-4 text-muted">{formatNumber(counselor.applications)}</td>
                      <td className="py-4 pr-4 font-semibold text-ink">{formatNumber(counselor.enrollments)}</td>
                      <td className="py-4 pr-4 text-muted">{formatPercent(counselor.conversion)}</td>
                      <td className="py-4 pr-4">
                        <div className="min-w-28">
                          <div className="mb-1 flex justify-between gap-2">
                            <span className="text-muted">{counselor.targetProgress}%</span>
                          </div>
                          <ProgressBar value={counselor.targetProgress} tone={counselor.targetProgress >= 90 ? 'teal' : 'amber'} />
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-semibold text-ink">{counselor.satisfaction.toFixed(1)}/5</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </section>
    </div>
  )
}

export default CounselorPerformance
