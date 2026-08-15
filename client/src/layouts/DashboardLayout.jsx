import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { Sidebar, MobileSidebar } from '../components/Sidebar.jsx'
import { CareerGoalProvider } from '../context/CareerGoalContext.jsx'

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <CareerGoalProvider>
      <div className="flex h-screen overflow-hidden bg-canvas">
        <Sidebar />
        <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex flex-1 flex-col min-w-0">
          <Navbar onMenuClick={() => setMobileNavOpen(true)} />
          <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </CareerGoalProvider>
  )
}
