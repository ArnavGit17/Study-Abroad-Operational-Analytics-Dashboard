import clsx from 'clsx'
import {
  BarChart3,
  Flag,
  Globe2,
  LayoutDashboard,
  LineChart,
  UsersRound,
  X,
} from 'lucide-react'

const navigationItems = [
  {
    id: 'executive',
    label: 'Executive Dashboard',
    helper: 'KPI overview',
    icon: LayoutDashboard,
  },
  {
    id: 'funnel',
    label: 'Funnel Analytics',
    helper: 'Stage conversion',
    icon: LineChart,
  },
  {
    id: 'countries',
    label: 'Country Analytics',
    helper: 'Market trends',
    icon: Globe2,
  },
  {
    id: 'counselors',
    label: 'Counselor Performance',
    helper: 'Team output',
    icon: UsersRound,
  },
]

function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm transition lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/70 bg-white/90 shadow-soft backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white shadow-glow">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-ink">StudyOps</p>
              <p className="text-xs font-medium text-muted">Analytics Console</p>
            </div>
          </div>
          <button
            className="focus-ring rounded-lg p-2 text-muted hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  'focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition',
                  isActive
                    ? 'bg-ink text-white shadow-soft'
                    : 'text-muted hover:bg-white hover:text-ink hover:shadow-sm',
                )}
              >
                <span
                  className={clsx(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-lg',
                    isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-ocean',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className={clsx('text-xs', isActive ? 'text-white/65' : 'text-muted')}>
                    {item.helper}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="m-4 rounded-lg border border-teal/20 bg-teal/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <Flag className="h-4 w-4 text-teal" />
            Interview angle
          </div>
          <p className="text-sm leading-6 text-muted">
            Built to explain funnel leakage, counselor productivity, and country-level
            operations using simple mock data.
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
