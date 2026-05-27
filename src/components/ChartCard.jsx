import clsx from 'clsx'

function ChartCard({ title, subtitle, action, className, children }) {
  return (
    <section className={clsx('glass-card p-5 animate-fade-up', className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}

export default ChartCard
