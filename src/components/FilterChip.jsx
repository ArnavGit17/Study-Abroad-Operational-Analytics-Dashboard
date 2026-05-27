import { SlidersHorizontal } from 'lucide-react'

function FilterChip({ label, value }) {
  return (
    <button className="focus-ring inline-flex items-center gap-2 rounded-lg border border-line bg-white/90 px-3 py-2 text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-ocean/40">
      <SlidersHorizontal className="h-4 w-4 text-ocean" />
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </button>
  )
}

export default FilterChip
