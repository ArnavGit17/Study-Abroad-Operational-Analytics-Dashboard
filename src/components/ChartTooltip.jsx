import { formatNumber } from '../utils/formatters'

function formatValue(name, value) {
  const normalized = String(name).toLowerCase()
  if (
    normalized.includes('rate') ||
    normalized.includes('success') ||
    normalized.includes('conversion') ||
    normalized.includes('progress')
  ) {
    return `${value}%`
  }

  return typeof value === 'number' ? formatNumber(value) : value
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-line/80 bg-white/95 px-3 py-2 text-sm shadow-soft backdrop-blur">
      {label ? <p className="mb-2 font-semibold text-ink">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.name}-${item.value}`} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color || item.payload?.color || '#3178c6' }}
            />
            <span className="text-muted">{item.name}</span>
            <span className="font-semibold text-ink">{formatValue(item.name, item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartTooltip
