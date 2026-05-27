import clsx from 'clsx'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

const toneStyles = {
  ocean: 'bg-ocean/10 text-ocean border-ocean/20',
  teal: 'bg-teal/10 text-teal border-teal/20',
  amber: 'bg-amber/10 text-amber border-amber/20',
  coral: 'bg-coral/10 text-coral border-coral/20',
  grape: 'bg-grape/10 text-grape border-grape/20',
  ink: 'bg-ink/10 text-ink border-ink/20',
}

function KpiCard({
  label,
  value,
  change,
  caption,
  icon: Icon,
  tone = 'ocean',
  trend = 'up',
}) {
  const TrendIcon = trend === 'down' ? ArrowDownRight : ArrowUpRight

  return (
    <article className="glass-card group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">{value}</p>
        </div>
        {Icon ? (
          <div className={clsx('rounded-lg border p-3', toneStyles[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/70 pt-4">
        <span
          className={clsx(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
            trend === 'down' ? 'bg-coral/10 text-coral' : 'bg-teal/10 text-teal',
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {change}
        </span>
        <span className="text-right text-xs font-medium text-muted">{caption}</span>
      </div>
    </article>
  )
}

export default KpiCard
