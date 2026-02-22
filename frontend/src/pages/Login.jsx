import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Microscope, CloudSun, TrendingUp, Bot } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FEATURES = [
  { icon: Microscope, text: 'AI Disease Detection with YOLOv8', color: '#FF6B6B' },
  { icon: Bot,        text: 'Smart Agricultural Chatbot',       color: '#4ECDC4' },
  { icon: CloudSun,   text: 'Real-time Weather Alerts',         color: '#FCD34D' },
  { icon: TrendingUp, text: 'Live Crop Market Prices',          color: '#34D399' },
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050D0A' }}>

      {/* ── Left Panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1F14 0%, #050D0A 100%)' }}>

        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 relative z-10">
          <motion.div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
            animate={{ boxShadow: ['0 0 15px rgba(0,255,135,0.4)', '0 0 30px rgba(0,255,135,0.8)', '0 0 15px rgba(0,255,135,0.4)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            <Leaf className="w-5 h-5 text-dark-900" />
          </motion.div>
          <span className="font-orbitron font-bold text-xl gradient-text">LeafScan</span>
        </motion.div>

        {/* Center content */}
        <div className="relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-orbitron font-black text-4xl text-white mb-4 leading-tight">
            Protect Your Crops<br />
            <span className="gradient-text">with AI Power</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-leaf-300/60 font-inter text-lg mb-10 leading-relaxed">
            The most advanced agricultural intelligence platform for modern farmers.
          </motion.p>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.text}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: `${f.color}08`, border: `1px solid ${f.color}20` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${f.color}15` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <span className="font-rajdhani font-medium text-white/80">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex gap-8 relative z-10">
          {[['38+', 'Diseases'], ['15+', 'Crops'], ['99%', 'Accuracy']].map(([val, label]) => (
            <div key={label}>
              <div className="font-orbitron font-black text-2xl gradient-text">{val}</div>
              <div className="font-rajdhani text-leaf-300/50 text-sm tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.04) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
                <Leaf className="w-5 h-5 text-dark-900" />
              </div>
              <span className="font-orbitron font-bold text-xl gradient-text">LeafScan</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8">
            <h1 className="font-orbitron font-bold text-3xl text-white mb-2">Welcome Back</h1>
            <p className="text-leaf-300/60 font-inter">Sign in to your agricultural dashboard</p>
          </motion.div>

          {/* Form Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(15,45,28,0.5)',
              border: '1px solid rgba(0,255,135,0.12)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-leaf-300/70 mb-2 tracking-widest uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-leaf-300/40" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="farmer@example.com" className="input-field pl-11" autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-leaf-300/70 mb-2 tracking-widest uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-leaf-300/40" />
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••" className="input-field pl-11 pr-11" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-leaf-300/40 hover:text-neon-500 transition-colors">
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-neon w-full flex items-center justify-center gap-2 py-4 mt-2">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing In...</span></>
                ) : (
                  <><span>Sign In</span><ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(0,255,135,0.1)' }} />
              <span className="text-xs text-leaf-300/40 font-rajdhani tracking-wider">OR</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(0,255,135,0.1)' }} />
            </div>

            {/* Demo Login */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => {
                setForm({ email: 'demo@leafscan.ai', password: 'demo1234' })
                toast('Demo credentials filled! Click Sign In.', { icon: '💡' })
              }}
              className="btn-ghost w-full py-3 text-sm">
              Try Demo Account
            </motion.button>
          </motion.div>

          {/* Register Link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-center mt-6 text-leaf-300/60 font-inter text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-neon-500 hover:text-neon-400 font-semibold transition-colors">
              Create one free →
            </Link>
          </motion.p>

          {/* Back to home */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center mt-3">
            <Link to="/" className="text-leaf-300/40 hover:text-leaf-300/70 font-rajdhani text-sm transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
