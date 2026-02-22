import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BENEFITS = [
  '✓ Free disease diagnosis — unlimited scans',
  '✓ AI chatbot for instant farming advice',
  '✓ Live weather alerts & market prices',
  '✓ Join a community of 10,000+ farmers',
  '✓ Crop calendar & fertilizer calculator',
  '✓ No credit card required',
]

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password, form.full_name)
      toast.success('Account created! Welcome to LeafScan 🌿')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050D0A' }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1F14 0%, #050D0A 100%)' }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.07) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)' }} />
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
            style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)' }}>
            <span className="text-xs font-rajdhani font-bold text-neon-500 tracking-widest uppercase">Free Forever</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-orbitron font-black text-4xl text-white mb-4 leading-tight">
            Start Farming<br />
            <span className="gradient-text">Smarter Today</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-leaf-300/60 font-inter mb-8 leading-relaxed">
            Join thousands of farmers using AI to protect their crops and maximize yields.
          </motion.p>

          <div className="space-y-3">
            {BENEFITS.map((benefit, i) => (
              <motion.div key={benefit}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-neon-500 flex-shrink-0" />
                <span className="font-rajdhani text-leaf-300/70 text-sm">{benefit.replace('✓ ', '')}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="relative z-10 p-4 rounded-xl"
          style={{ background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.1)' }}>
          <p className="text-leaf-300/60 font-inter text-sm italic mb-2">
            "LeafScan detected late blight in my tomatoes before I could even see it. Saved my entire harvest!"
          </p>
          <p className="text-neon-500 font-rajdhani font-semibold text-sm">— James M., Tomato Farmer, Kenya</p>
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.04) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 w-full max-w-md py-4">
          {/* Mobile logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
                <Leaf className="w-5 h-5 text-dark-900" />
              </div>
              <span className="font-orbitron font-bold text-xl gradient-text">LeafScan</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="font-orbitron font-bold text-3xl text-white mb-2">Create Account</h1>
            <p className="text-leaf-300/60 font-inter">Start your free agricultural AI journey</p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-leaf-300/70 mb-2 tracking-widest uppercase">
                  Full Name <span className="text-leaf-300/30">(optional)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-300/40" />
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                    placeholder="John Farmer" className="input-field pl-11" />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-leaf-300/70 mb-2 tracking-widest uppercase">
                  Username <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-300/40 font-rajdhani text-sm">@</span>
                  <input type="text" name="username" value={form.username} onChange={handleChange}
                    placeholder="farmerjohn" className="input-field pl-9" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-leaf-300/70 mb-2 tracking-widest uppercase">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-300/40" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="farmer@example.com" className="input-field pl-11" required autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-leaf-300/70 mb-2 tracking-widest uppercase">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-300/40" />
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 6 characters" className="input-field pl-11 pr-11"
                    required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-leaf-300/40 hover:text-neon-500 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength indicator */}
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div key={level} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: form.password.length >= level * 2
                            ? level <= 1 ? '#ef4444' : level <= 2 ? '#f59e0b' : level <= 3 ? '#3b82f6' : '#00FF87'
                            : 'rgba(255,255,255,0.1)'
                        }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-neon w-full flex items-center justify-center gap-2 py-4 mt-2">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating Account...</span></>
                ) : (
                  <><span>Create Free Account</span><ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>

              <p className="text-center text-xs text-leaf-300/40 font-inter">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </motion.div>

          {/* Login Link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-center mt-5 text-leaf-300/60 font-inter text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-500 hover:text-neon-400 font-semibold transition-colors">
              Sign in →
            </Link>
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center mt-2">
            <Link to="/" className="text-leaf-300/40 hover:text-leaf-300/70 font-rajdhani text-sm transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
