import { useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { DashboardDataProvider } from './context/DashboardDataContext'
import CountryAnalytics from './pages/CountryAnalytics'
import CounselorPerformance from './pages/CounselorPerformance'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import FunnelAnalytics from './pages/FunnelAnalytics'

const pages = {
  executive: {
    title: 'Executive Dashboard',
    component: ExecutiveDashboard,
  },
  funnel: {
    title: 'Funnel Analytics',
    component: FunnelAnalytics,
  },
  countries: {
    title: 'Country Analytics',
    component: CountryAnalytics,
  },
  counselors: {
    title: 'Counselor Performance',
    component: CounselorPerformance,
  },
}

function App() {
  const [activePage, setActivePage] = useState('executive')
  const [mobileOpen, setMobileOpen] = useState(false)

  const CurrentPage = useMemo(() => pages[activePage].component, [activePage])
  const currentTitle = pages[activePage].title

  const handleNavigate = (pageId) => {
    setActivePage(pageId)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <DashboardDataProvider>
      <div className="min-h-screen text-ink">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <div className="lg:pl-72">
          <Navbar title={currentTitle} onMenuClick={() => setMobileOpen(true)} />
          <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            <CurrentPage />
          </main>
        </div>
      </div>
    </DashboardDataProvider>
  )
}

export default App
