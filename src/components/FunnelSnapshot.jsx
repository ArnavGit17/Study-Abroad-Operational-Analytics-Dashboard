import { useDashboardData } from '../context/useDashboardData'
import { formatNumber, formatPercent } from '../utils/formatters'

function FunnelSnapshot() {
  const { funnelAnalytics } = useDashboardData()
  const maxValue = funnelAnalytics[0].value

  return (
    <div className="space-y-4">
      {funnelAnalytics.map((stage, index) => (
        <div key={stage.stage}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">{stage.stage}</p>
              <p className="text-xs text-muted">{stage.summary}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-ink">{formatNumber(stage.value)}</p>
              <p className="text-xs text-muted">
                {index === 0 ? 'Starting pool' : `${formatPercent(stage.conversion)} conversion`}
              </p>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(stage.value / maxValue) * 100}%`,
                backgroundColor: stage.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default FunnelSnapshot
