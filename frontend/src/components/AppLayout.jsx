import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, Leaf } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':  { title: 'Dashboard',            subtitle: 'Overview of your farm intelligence' },
  '/diagnosis':  { title: 'Disease Diagnosis',    subtitle: 'AI-powered plant disease detection' },
  '/chatbot':    { title: 'LiAn Assistant',        subtitle: 'Your intelligent farming assistant' },
  '/community':  { title: 'Community',             subtitle: 'Connect with farmers worldwide' },
  '/tips':       { title: 'Cultivation Tips',      subtitle: 'Expert guidance for every crop' },
  '/weather':    { title: 'Weather Center',        subtitle: 'Real-time forecasts & agricultural alerts' },
  '/market':     { title: 'Market Prices',         subtitle: 'Live crop commodity prices & trends' },
  '/calendar':   { title: 'Crop Calendar',         subtitle: 'Planting schedules & seasonal tasks' },
  '/calculator':     { title: 'Fertilizer Calculator', subtitle: 'Precise NPK requirements for your crops' },
  '/crop-recommend': { title: 'AI Crop Advisor',        subtitle: 'ML-powered crop recommendation from soil data' },
  '/history':    { title: 'History Log',           subtitle: 'Your past diagnoses and searches' },
  '/profile':    { title: 'Profile',               subtitle: 'Manage your account settings' },
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'LeafScan', subtitle: '' }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #071a10 0%, #0b2318 50%, #071a10 100%)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* ── Top Navbar ─────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl border-b"
          style={{ background: 'rgba(7,22,13,0.97)', borderColor: 'rgba(0,255,135,0.22)' }}
        >
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">

            {/* Left: Hamburger + Page Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl transition-all hover:bg-neon-500/10"
                style={{ color: '#a7f3d0' }}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <motion.h2
                  key={location.pathname}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-orbitron font-bold text-lg leading-none"
                  style={{ color: '#ffffff' }}
                >
                  {pageInfo.title}
                </motion.h2>
                <p
                  className="text-xs font-rajdhani font-semibold mt-0.5 hidden sm:block"
                  style={{ color: 'rgba(167,243,208,0.8)' }}
                >
                  {pageInfo.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Search + Bell + Avatar */}
            <div className="flex items-center gap-3">

              {/* Search bar */}
              <div
                className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-48 lg:w-64"
                style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.28)' }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(167,243,208,0.75)' }} />
                <input
                  type="text"
                  placeholder="Search crops, diseases..."
                  className="bg-transparent text-sm outline-none flex-1 font-rajdhani font-medium"
                  style={{ color: '#e2fef0' }}
                />
              </div>

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="relative p-2 rounded-xl transition-all"
                style={{
                  background: 'rgba(0,255,135,0.08)',
                  border: '1px solid rgba(0,255,135,0.22)',
                  color: '#a7f3d0',
                }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
              </motion.button>

              {/* User Avatar */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm cursor-pointer select-none"
                style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)', color: '#050D0A' }}
                title={user?.username || 'User'}
              >
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </motion.div>
            </div>
          </div>
        </header>

        {/* ── Page Content ───────────────────────────────────────────────── */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer
          className="px-8 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,255,135,0.15)' }}
        >
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-neon-500" />
            <span
              className="font-orbitron text-xs tracking-widest"
              style={{ color: 'rgba(167,243,208,0.65)' }}
            >
              LEAFSCAN v1.0
            </span>
          </div>
          <p
            className="text-xs font-rajdhani font-semibold"
            style={{ color: 'rgba(167,243,208,0.5)' }}
          >
            AI-Powered Agricultural Intelligence
          </p>
        </footer>
      </div>
    </div>
  )
}
