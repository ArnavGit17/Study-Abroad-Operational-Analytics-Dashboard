import { Bell, CalendarDays, Menu, Search } from 'lucide-react'

function Navbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-canvas/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="focus-ring rounded-lg border border-line bg-white p-2 text-ink shadow-sm lg:hidden"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Operational Analytics
            </p>
            <h2 className="truncate text-lg font-extrabold text-ink">{title}</h2>
          </div>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-white bg-white/80 px-3 py-2 text-sm text-muted shadow-sm">
            <Search className="h-4 w-4" />
            <input
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
              placeholder="Search students, countries, counselors..."
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button className="focus-ring hidden items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm sm:inline-flex">
            <CalendarDays className="h-4 w-4 text-ocean" />
            Spring 2026
          </button>
          <button className="focus-ring rounded-lg border border-line bg-white p-2.5 text-muted shadow-sm hover:text-ink">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
