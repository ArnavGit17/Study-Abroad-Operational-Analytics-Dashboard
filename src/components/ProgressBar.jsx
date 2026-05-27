import clsx from 'clsx'

const toneClasses = {
  ocean: 'bg-ocean',
  teal: 'bg-teal',
  amber: 'bg-amber',
  coral: 'bg-coral',
  grape: 'bg-grape',
  ink: 'bg-ink',
}

function ProgressBar({ value, tone = 'ocean' }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className={clsx('h-full rounded-full transition-all duration-700', toneClasses[tone])}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

export default ProgressBar
