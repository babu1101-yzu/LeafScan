import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Microscope, Bot, Users, Sprout,
  CloudSun, History, User, LogOut, Leaf, X, ChevronRight,
  TrendingUp, CalendarDays, FlaskConical
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',         color: '#00FF87' },
      { to: '/diagnosis',  icon: Microscope,      label: 'Disease Diagnosis', color: '#f87171' },
      { to: '/chatbot',    icon: Bot,             label: 'LiAn Assistant',    color: '#00D4FF' },
      { to: '/community',  icon: Users,           label: 'Community',         color: '#a78bfa' },
    ]
  },
  {
    label: 'Farmer Tools',
    items: [
      { to: '/tips',       icon: Sprout,          label: 'Cultivation Tips',  color: '#4ade80' },
      { to: '/weather',    icon: CloudSun,        label: 'Weather',           color: '#fbbf24' },
      { to: '/market',     icon: TrendingUp,      label: 'Market Prices',     color: '#fb923c' },
      { to: '/calendar',   icon: CalendarDays,    label: 'Crop Calendar',     color: '#34d399' },
      { to: '/calculator',    icon: FlaskConical,    label: 'Fertilizer Calc',   color: '#c084fc' },
      { to: '/crop-recommend', icon: Sprout,          label: 'AI Crop Advisor',   color: '#00FF87' },
    ]
  },
  {
    label: 'Account',
    items: [
      { to: '/history',    icon: History,         label: 'History Log',       color: '#94a3b8' },
      { to: '/profile',    icon: User,            label: 'Profile',           color: '#f9a8d4' },
    ]
  },
]

function NavItem({ item, onClose }) {
  return (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-rajdhani font-medium tracking-wide transition-all duration-200 group relative ${
          isActive ? 'text-white' : 'text-leaf-300/60 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`,
                borderLeft: `3px solid ${item.color}`,
              }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <item.icon
            className="w-5 h-5 relative z-10 transition-all duration-200"
            style={{ color: isActive ? item.color : undefined }}
          />
          <span className="relative z-10 flex-1">{item.label}</span>
          {isActive && (
            <ChevronRight className="w-4 h-4 relative z-10" style={{ color: item.color }} />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-neon-500/10">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
            animate={{ boxShadow: ['0 0 10px rgba(0,255,135,0.4)', '0 0 25px rgba(0,255,135,0.8)', '0 0 10px rgba(0,255,135,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Leaf className="w-5 h-5 text-dark-900" />
          </motion.div>
          <div>
            <h1 className="font-orbitron font-bold text-lg gradient-text leading-none">LeafScan</h1>
            <p className="text-xs text-leaf-300/60 font-rajdhani tracking-widest">AI AGRICULTURE</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg text-leaf-300/60 hover:text-neon-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-neon-500/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-dark-900 font-orbitron font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-rajdhani font-semibold text-white truncate">{user?.full_name || user?.username}</p>
            <p className="text-xs text-leaf-300/60 truncate">{user?.email}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={gi < NAV_GROUPS.length - 1 ? 'mb-4' : ''}>
            <p className="text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (gi * 4 + index) * 0.04 }}
                >
                  <NavItem item={item} onClose={onClose} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neon-500/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-rajdhani font-medium tracking-wide text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-dark-800/80 backdrop-blur-xl border-r border-neon-500/10 fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed left-0 top-0 h-screen w-72 bg-dark-800/95 backdrop-blur-xl border-r border-neon-500/10 z-50 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
