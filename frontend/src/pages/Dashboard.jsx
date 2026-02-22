import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Microscope, Bot, Users, CloudSun, Sprout, History,
  TrendingUp, Leaf, AlertTriangle, CheckCircle, Activity,
  ArrowRight, Zap, Upload, MessageSquare, Star, Sparkles,
  ShieldCheck, Brain
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { API } from '../context/AuthContext'

const QUICK_ACTIONS = [
  { label: 'Community',          icon: Users,      to: '/community',  color: '#a78bfa', bg: 'rgba(167,139,250,0.1)'},
  { label: 'Weather Alerts',     icon: CloudSun,   to: '/weather',    color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { label: 'Cultivation Tips',   icon: Sprout,     to: '/tips',       color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  { label: 'History Log',        icon: History,    to: '/history',    color: '#94a3b8', bg: 'rgba(148,163,184,0.1)'},
]

const ACTIVITY_DATA = [
  { day: 'Mon', diagnoses: 2, chats: 5 },
  { day: 'Tue', diagnoses: 4, chats: 8 },
  { day: 'Wed', diagnoses: 1, chats: 3 },
  { day: 'Thu', diagnoses: 6, chats: 12 },
  { day: 'Fri', diagnoses: 3, chats: 7 },
  { day: 'Sat', diagnoses: 5, chats: 9 },
  { day: 'Sun', diagnoses: 2, chats: 4 },
]

const DISEASE_DIST = [
  { name: 'Tomato', value: 35, color: '#f87171' },
  { name: 'Potato', value: 20, color: '#fbbf24' },
  { name: 'Corn',   value: 18, color: '#4ade80' },
  { name: 'Apple',  value: 15, color: '#a78bfa' },
  { name: 'Other',  value: 12, color: '#00D4FF' },
]

const RECENT_ALERTS = [
  { type: 'warning', icon: AlertTriangle, msg: 'High humidity detected — fungal disease risk elevated', time: '2h ago', color: '#fbbf24' },
  { type: 'success', icon: CheckCircle,   msg: 'Tomato Late Blight diagnosed — treatment applied',      time: '5h ago', color: '#00FF87' },
  { type: 'info',    icon: Activity,      msg: 'New community post: "Best practices for corn rust"',    time: '1d ago', color: '#00D4FF' },
]

function StatCard({ label, value, icon: Icon, color, change, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, boxShadow: `0 0 20px ${color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {change && (
          <span className="text-xs font-rajdhani font-semibold px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,255,135,0.1)', color: '#00FF87' }}>
            {change}
          </span>
        )}
      </div>
      <div className="font-orbitron font-bold text-3xl text-white mb-1">{value}</div>
      <div className="font-rajdhani text-leaf-300/60 text-sm tracking-wide">{label}</div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [weather, setWeather] = useState(null)
  const [recentDiagnoses, setRecentDiagnoses] = useState([])

  useEffect(() => {
    // Fetch weather
    API.get('/weather/current?city=Nairobi')
      .then(r => setWeather(r.data))
      .catch(() => {})

    // Fetch recent diagnoses
    API.get('/diagnosis/history')
      .then(r => setRecentDiagnoses(r.data.slice(0, 3)))
      .catch(() => {})
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="space-y-8">
      {/* ─── Welcome Banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8 relative overflow-hidden"
        style={{ borderColor: 'rgba(0,255,135,0.2)' }}
      >
        <div className="absolute inset-0 bg-glow-gradient opacity-50" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <p className="font-rajdhani text-leaf-300/60 tracking-widest uppercase text-sm mb-1">{greeting}</p>
            <h1 className="font-orbitron font-bold text-3xl lg:text-4xl gradient-text mb-2">
              {user?.full_name || user?.username} 👋
            </h1>
            <p className="text-leaf-300/70 font-inter">
              Your farm intelligence dashboard is ready. {recentDiagnoses.length > 0
                ? `You have ${recentDiagnoses.length} recent diagnoses.`
                : 'Start by diagnosing a plant disease.'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/diagnosis')}
            className="btn-neon flex items-center gap-2 whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            Quick Diagnose
          </motion.button>
        </div>
      </motion.div>

      {/* ─── FEATURED: Diagnosis & Chatbot Hero Cards ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Diagnosis — PRIMARY FEATURE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => navigate('/diagnosis')}
          className="relative overflow-hidden rounded-2xl cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, rgba(248,113,113,0.15) 0%, rgba(15,45,28,0.95) 60%)',
            border: '1px solid rgba(248,113,113,0.4)',
            boxShadow: '0 0 40px rgba(248,113,113,0.15)',
          }}
        >
          {/* Animated glow background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle at 30% 50%, rgba(248,113,113,0.12) 0%, transparent 70%)' }} />

          {/* Featured badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-orbitron font-bold"
            style={{ background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.5)', color: '#f87171' }}>
            <Star className="w-3 h-3 fill-current" />
            CORE FEATURE
          </div>

          <div className="relative z-10 p-7">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'rgba(248,113,113,0.2)', boxShadow: '0 0 30px rgba(248,113,113,0.3)' }}>
                <Microscope className="w-8 h-8" style={{ color: '#f87171' }} />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-2xl text-white mb-1">Disease Diagnosis</h2>
                <p className="text-sm font-rajdhani text-white/60">AI-Powered YOLOv8 Detection</p>
              </div>
            </div>

            <p className="text-white/70 font-inter text-sm leading-relaxed mb-5">
              Upload a photo of your plant leaf and get instant AI-powered disease detection across
              <span className="text-red-400 font-semibold"> 39 disease classes</span> covering
              14+ crops. Get treatment recommendations in seconds.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: '39 Diseases', icon: ShieldCheck },
                { label: '14+ Crops',   icon: Leaf },
                { label: 'Instant AI',  icon: Zap },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#f87171' }} />
                  <span className="text-xs font-rajdhani font-semibold text-white/80">{label}</span>
                </div>
              ))}
            </div>

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 font-orbitron font-bold text-sm"
              style={{ color: '#f87171' }}
            >
              <Upload className="w-4 h-4" />
              Upload & Diagnose Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </motion.div>

        {/* AI Chatbot — PRIMARY FEATURE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => navigate('/chatbot')}
          className="relative overflow-hidden rounded-2xl cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(15,45,28,0.95) 60%)',
            border: '1px solid rgba(0,212,255,0.4)',
            boxShadow: '0 0 40px rgba(0,212,255,0.15)',
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle at 70% 50%, rgba(0,212,255,0.12) 0%, transparent 70%)' }} />

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-orbitron font-bold"
            style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.5)', color: '#00D4FF' }}>
            <Sparkles className="w-3 h-3" />
            CORE FEATURE
          </div>

          <div className="relative z-10 p-7">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'rgba(0,212,255,0.2)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
                <Bot className="w-8 h-8" style={{ color: '#00D4FF' }} />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-2xl text-white mb-1">LeafBot AI</h2>
                <p className="text-sm font-rajdhani text-white/60">Agricultural Intelligence Assistant</p>
              </div>
            </div>

            <p className="text-white/70 font-inter text-sm leading-relaxed mb-5">
              Chat with LeafBot — your 24/7 AI farming expert. Get instant answers on
              <span className="text-cyan-400 font-semibold"> disease treatment</span>,
              crop management, irrigation, fertilization, and pest control.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: '24/7 Support', icon: MessageSquare },
                { label: 'Expert Tips',  icon: Brain },
                { label: 'Instant Reply', icon: Zap },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00D4FF' }} />
                  <span className="text-xs font-rajdhani font-semibold text-white/80">{label}</span>
                </div>
              ))}
            </div>

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 font-orbitron font-bold text-sm"
              style={{ color: '#00D4FF' }}
            >
              <MessageSquare className="w-4 h-4" />
              Start Chatting Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ─── Stats Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Diagnoses"  value="24"  icon={Microscope} color="#f87171" change="+3 today" delay={0.05} />
        <StatCard label="Healthy Plants"   value="18"  icon={Leaf}       color="#00FF87" change="75%"      delay={0.1}  />
        <StatCard label="Diseases Found"   value="6"   icon={AlertTriangle} color="#fbbf24" change="25%"  delay={0.15} />
        <StatCard label="Chats with Bot"   value="47"  icon={Bot}        color="#00D4FF" change="+5 today" delay={0.2}  />
      </div>

      {/* ─── Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-orbitron font-bold text-white">Weekly Activity</h3>
              <p className="text-xs text-leaf-300/50 font-rajdhani mt-1">Diagnoses & chatbot interactions</p>
            </div>
            <TrendingUp className="w-5 h-5 text-neon-500" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ACTIVITY_DATA}>
              <defs>
                <linearGradient id="diagGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF87" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00FF87" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,45,28,0.95)',
                  border: '1px solid rgba(0,255,135,0.3)',
                  borderRadius: '0.5rem',
                  color: '#E8F5E9',
                }}
              />
              <Area type="monotone" dataKey="diagnoses" stroke="#00FF87" fill="url(#diagGrad)" strokeWidth={2} name="Diagnoses" />
              <Area type="monotone" dataKey="chats" stroke="#00D4FF" fill="url(#chatGrad)" strokeWidth={2} name="Chats" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Disease Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="font-orbitron font-bold text-white mb-1">Disease by Crop</h3>
          <p className="text-xs text-leaf-300/50 font-rajdhani mb-4">Distribution this month</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={DISEASE_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {DISEASE_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,45,28,0.95)',
                  border: '1px solid rgba(0,255,135,0.3)',
                  borderRadius: '0.5rem',
                  color: '#E8F5E9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DISEASE_DIST.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs font-rajdhani">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-leaf-300/70">{d.name}</span>
                </div>
                <span className="text-white font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Quick Actions ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-6"
      >
        <h3 className="font-orbitron font-bold text-white mb-6">More Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.to)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200 group"
              style={{ background: action.bg, border: `1px solid ${action.color}20` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: `${action.color}20` }}
              >
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-xs font-rajdhani font-semibold text-center leading-tight"
                style={{ color: action.color }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ─── Bottom Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-orbitron font-bold text-white">Recent Alerts</h3>
            <button onClick={() => navigate('/history')} className="text-xs text-neon-500 font-rajdhani hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_ALERTS.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: `${alert.color}08`, border: `1px solid ${alert.color}15` }}
              >
                <alert.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: alert.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 font-inter leading-snug">{alert.msg}</p>
                  <p className="text-xs text-leaf-300/40 font-rajdhani mt-1">{alert.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-orbitron font-bold text-white">Weather</h3>
            <button onClick={() => navigate('/weather')} className="text-xs text-neon-500 font-rajdhani hover:underline flex items-center gap-1">
              Full Forecast <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {weather ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-orbitron font-bold text-4xl text-white">{weather.temperature}°C</div>
                  <div className="text-leaf-300/60 font-rajdhani capitalize">{weather.description}</div>
                  <div className="text-xs text-leaf-300/40 font-rajdhani mt-1">{weather.city}</div>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-16 h-16 opacity-80"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Humidity', value: `${weather.humidity}%` },
                  { label: 'Wind', value: `${weather.wind_speed} m/s` },
                  { label: 'Feels Like', value: `${weather.feels_like}°C` },
                ].map((item) => (
                  <div key={item.label} className="text-center p-2 rounded-lg bg-dark-800/50">
                    <div className="font-orbitron font-bold text-neon-500 text-sm">{item.value}</div>
                    <div className="text-xs text-leaf-300/50 font-rajdhani">{item.label}</div>
                  </div>
                ))}
              </div>
              {weather.alerts?.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400 font-rajdhani">{weather.alerts[0].message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-8 rounded-lg" />)}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
