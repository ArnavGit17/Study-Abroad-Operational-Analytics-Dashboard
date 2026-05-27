import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, CheckCircle2, Filter, Milestone, TrendingDown } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import ChartTooltip from '../components/ChartTooltip'
import FilterChip from '../components/FilterChip'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import { useDashboardData } from '../context/useDashboardData'
import { formatNumber, formatPercent } from '../utils/formatters'

function FunnelAnalytics() {
  const { dropOffReasons, funnelAnalytics, intakeSummary, studentSegments, source } = useDashboardData()
  const largestDropOff = funnelAnalytics
    .slice(1)
    .reduce((largest, stage) => (stage.lost > largest.lost ? stage : largest), funnelAnalytics[1])

  const funnelKpis = [
    {
      label: 'Overall Conversion',
      value: formatPercent(intakeSummary.leadToEnrollment),
      change: source.rowCount ? source.type : '+2.1 pts',
      caption: 'lead to enrollment',
      icon: CheckCircle2,
      tone: 'teal',
    },
    {
      label: 'Largest Drop-off',
      value: formatNumber(largestDropOff?.lost || 0),
      change: largestDropOff?.short || 'Stage',
      caption: `${largestDropOff?.dropOff || 0}% drop-off`,
      icon: TrendingDown,
      tone: 'coral',
      trend: 'down',
    },
    {
      label: 'Application to Admit',
      value: formatPercent(intakeSummary.applicationToAdmit),
      change: source.rowCount ? 'Auto-calculated' : '+3.8 pts',
      caption: 'stronger shortlisting',
      icon: Milestone,
      tone: 'amber',
    },
    {
      label: 'Open Follow-ups',
      value: formatNumber(intakeSummary.openFollowUps),
      change: `${intakeSummary.slaAdherence}% SLA`,
      caption: 'pending counselor actions',
      icon: AlertTriangle,
      tone: 'ocean',
    },
  ]

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Funnel analytics"
        title="Find the conversion gaps that operations can fix"
        description="Track how students move through the study abroad journey, identify stage-wise leakage, and explain practical interventions like follow-up queues, document readiness, and counselor nudges."
      >
        <FilterChip label="Country" value="All" />
        <FilterChip label="Counselor" value="All" />
        <FilterChip label="Intake" value="Spring 2026" />
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {funnelKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard
          title="Funnel volume by stage"
          subtitle="A visual snapshot of how the student base narrows from first lead to confirmed enrollment."
          action={
            <button className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white">
              <Filter className="h-4 w-4" />
              Mock filters
            </button>
          }
        >
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<ChartTooltip />} />
                <Funnel dataKey="value" nameKey="stage" data={funnelAnalytics} isAnimationActive>
                  <LabelList position="right" fill="#172033" stroke="none" dataKey="short" fontSize={12} />
                  {funnelAnalytics.map((entry) => (
                    <Cell key={entry.stage} fill={entry.color} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Stage-wise conversion and drop-off"
          subtitle="Shows where the process needs counselor effort or operational cleanup."
        >
          <div className="space-y-4">
            {funnelAnalytics.slice(1).map((stage) => (
              <article key={stage.stage} className="rounded-lg border border-line/70 bg-white/70 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{stage.stage}</h3>
                    <p className="text-sm text-muted">{formatNumber(stage.value)} students at this stage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-ink">{formatPercent(stage.conversion)}</p>
                    <p className="text-xs text-muted">conversion from prior stage</p>
                  </div>
                </div>
                <ProgressBar value={stage.conversion} tone={stage.dropOff > 35 ? 'coral' : 'teal'} />
                <p className="mt-2 text-xs font-medium text-muted">
                  Lost {formatNumber(stage.lost)} students here, equal to {formatPercent(stage.dropOff)} drop-off.
                </p>
              </article>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="chart-grid mt-5">
        <ChartCard
          title="Drop-off reason analysis"
          subtitle="A realistic operations view of why students leave the funnel."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dropOffReasons} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#dfe6ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={72} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#657084', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="lowIntent" name="Low intent" stackId="a" fill="#3178c6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unreachable" name="Unreachable" stackId="a" fill="#7467ef" />
                <Bar dataKey="budget" name="Budget" stackId="a" fill="#f9735b" />
                <Bar dataKey="timing" name="Timing/doc fit" stackId="a" fill="#f2aa3b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Student segment conversion"
          subtitle="Which program segments convert best into confirmed enrollments."
        >
          <div className="space-y-4">
            {studentSegments.map((segment) => (
              <article key={segment.segment} className="grid gap-3 rounded-lg border border-line/70 bg-white/70 p-4 sm:grid-cols-[1fr_100px] sm:items-center">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-bold text-ink">{segment.segment}</h3>
                    <span className="text-sm font-extrabold text-ink">{formatPercent(segment.conversion)}</span>
                  </div>
                  <ProgressBar value={segment.conversion * 4} tone={segment.conversion > 16 ? 'teal' : 'amber'} />
                </div>
                <div className="text-sm text-muted sm:text-right">
                  <p>
                    <span className="font-bold text-ink">{formatNumber(segment.enrollments)}</span> enrollments
                  </p>
                  <p>{formatNumber(segment.students)} students</p>
                </div>
              </article>
            ))}
          </div>
        </ChartCard>
      </section>
    </div>
  )
}

export default FunnelAnalytics
