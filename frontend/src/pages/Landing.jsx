import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf, Microscope, Bot, Users, CloudSun, Sprout,
  ArrowRight, Zap, TrendingUp, CalendarDays,
  FlaskConical, Star, ChevronRight, History
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Microscope,   title: 'AI Disease Detection',   desc: 'YOLOv8-powered instant diagnosis from a single leaf photo. 38+ diseases across 15+ crops.',  color: '#FF6B6B', badge: 'YOLOv8' },
  { icon: Bot,          title: 'Smart AI Chatbot',        desc: 'LeafBot answers all your farming questions — diseases, fertilizers, pests, and more.',         color: '#4ECDC4', badge: 'AI' },
  { icon: Users,        title: 'Farmer Community',        desc: 'Share experiences, post crop photos, and learn from thousands of farmers worldwide.',           color: '#A78BFA', badge: 'Social' },
  { icon: CloudSun,     title: 'Weather Intelligence',    desc: 'Real-time forecasts with drought, frost, and disease-risk alerts tailored for agriculture.',    color: '#FCD34D', badge: 'Live' },
  { icon: Sprout,       title: 'Cultivation Tips',        desc: 'Expert growing guides for tomatoes, corn, grapes, apples, potatoes, and 10+ more crops.',      color: '#6EE7B7', badge: 'Expert' },
  { icon: TrendingUp,   title: 'Market Prices',           desc: 'Live crop market prices and trends to help you sell at the perfect time.',                     color: '#34D399', badge: 'Real-time' },
  { icon: CalendarDays, title: 'Crop Calendar',           desc: 'Smart planting and harvest schedules based on your crop type and local climate.',              color: '#FB923C', badge: 'Smart' },
  { icon: FlaskConical, title: 'Fertilizer Calculator',   desc: 'Precise NPK calculations for your exact field size and crop requirements.',                   color: '#C084FC', badge: 'Precise' },
  { icon: History,      title: 'History & Analytics',     desc: 'Track all your past diagnoses, searches, and farm activity in one place.',                    color: '#60A5FA', badge: 'Insights' },
]

const TESTIMONIALS = [
  {
    name: 'James Mwangi', role: 'Tomato Farmer', location: 'Nairobi, Kenya',
    avatar: 'JM', color: '#00FF87',
    quote: 'LeafScan saved my entire tomato harvest. I detected late blight early and treated it before it spread. The AI diagnosis is incredibly accurate!',
    rating: 5,
  },
  {
    name: 'Maria Santos', role: 'Vineyard Owner', location: 'São Paulo, Brazil',
    avatar: 'MS', color: '#00D4FF',
    quote: "The weather alerts and market price features help me plan my harvest perfectly. I've increased my profits by 30% since using LeafScan.",
    rating: 5,
  },
  {
    name: 'Ahmed Hassan', role: 'Potato Farmer', location: 'Cairo, Egypt',
    avatar: 'AH', color: '#A78BFA',
    quote: 'The fertilizer calculator is a game-changer. I now use exactly the right amount of NPK for my fields. No more guessing or wasting money!',
    rating: 5,
  },
]

const STATS = [
  { value: '65+',  label: 'Diseases Detected', emoji: '🔬' },
  { value: '22+',  label: 'Crops Supported',   emoji: '🌱' },
  { value: '99%',  label: 'AI Accuracy',        emoji: '🎯' },
  { value: '10K+', label: 'Farmers Helped',     emoji: '👨‍🌾' },
]

const CROPS = [
  '🍅 Tomato','🥔 Potato','🌽 Corn','🍎 Apple','🍇 Grape','🍓 Strawberry',
  '🌶️ Pepper','🫘 Soybean','🍑 Peach','🍒 Cherry','🌾 Rice','🎋 Sugarcane',
  '🌾 Wheat','🍌 Banana','🥭 Mango','☕ Coffee','🧅 Onion','🥕 Carrot',
  '🥒 Cucumber','🍉 Watermelon','🧄 Garlic','🥬 Cabbage'
]

const HOW_IT_WORKS = [
  { step: '01', icon: '📸', title: 'Snap a Photo',    desc: 'Take a clear photo of the affected leaf using your phone or camera.' },
  { step: '02', icon: '🤖', title: 'AI Analyzes',     desc: 'Our YOLOv8 model scans the image and identifies the disease in seconds.' },
  { step: '03', icon: '💊', title: 'Get Treatment',   desc: 'Receive a full diagnosis report with treatment steps and prevention tips.' },
]

// ─── Animated Counter ─────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center p-6 rounded-2xl"
      style={{ background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.1)' }}
    >
      <div className="text-3xl mb-2">{stat.emoji}</div>
      <div className="font-orbitron font-black text-4xl lg:text-5xl gradient-text mb-1">{stat.value}</div>
      <div className="font-rajdhani text-leaf-300/60 tracking-wider text-sm uppercase">{stat.label}</div>
    </motion.div>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group rounded-2xl p-6 cursor-default overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15,45,28,0.7) 0%, rgba(10,31,20,0.9) 100%)',
        border: `1px solid ${feature.color}20`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 70%)` }}
      />

      {/* Badge */}
      <div
        className="absolute top-4 right-4 text-xs font-rajdhani font-bold tracking-widest px-2 py-0.5 rounded-full"
        style={{ background: `${feature.color}20`, color: feature.color, border: `1px solid ${feature.color}40` }}
      >
        {feature.badge}
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${feature.color}15`, boxShadow: `0 0 30px ${feature.color}25` }}
      >
        <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
      </div>

      <h3 className="font-orbitron font-bold text-lg text-white mb-2 relative z-10">{feature.title}</h3>
      <p className="text-leaf-300/60 font-inter text-sm leading-relaxed relative z-10">{feature.desc}</p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
      />
    </motion.div>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="glass-card p-8 flex flex-col gap-4"
    >
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-leaf-300/80 font-inter text-sm leading-relaxed italic flex-1">
        "{t.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-neon-500/10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm text-dark-900"
          style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
        >
          {t.avatar}
        </div>
        <div>
          <p className="font-rajdhani font-semibold text-white">{t.name}</p>
          <p className="text-xs text-leaf-300/50">{t.role} · {t.location}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050D0A' }}>

      {/* ── Gradient Mesh Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0,255,135,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0,212,255,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(167,139,250,0.03) 0%, transparent 70%)
          `
        }} />
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Animated scan line */}
        <div className="absolute left-0 right-0 h-px top-0 animate-scan"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,135,0.4), transparent)' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-20 py-5 border-b border-white/5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
            animate={{ boxShadow: ['0 0 15px rgba(0,255,135,0.4)', '0 0 30px rgba(0,255,135,0.8)', '0 0 15px rgba(0,255,135,0.4)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Leaf className="w-5 h-5 text-dark-900" />
          </motion.div>
          <span className="font-orbitron font-bold text-xl gradient-text">LeafScan</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Testimonials'].map((item) => (
            <button key={item}
              className="text-leaf-300/60 hover:text-neon-500 font-rajdhani font-medium tracking-wide transition-colors text-sm">
              {item}
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="btn-ghost text-sm py-2 px-5">Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-neon text-sm py-2 px-5">Get Started</button>
        </motion.div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.25)' }}>
          <motion.div className="w-2 h-2 rounded-full bg-neon-500"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
          <Zap className="w-3.5 h-3.5 text-neon-500" />
          <span className="text-xs font-rajdhani font-bold text-neon-500 tracking-widest uppercase">
            Powered by YOLOv8 AI · Now Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-orbitron font-black leading-tight mb-6 max-w-5xl"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
          <span className="text-white">Protect Your Crops</span>
          <br />
          <span className="gradient-text" style={{ textShadow: '0 0 60px rgba(0,255,135,0.3)' }}>
            with AI Intelligence
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-leaf-300/70 text-lg lg:text-xl max-w-2xl mb-10 font-inter leading-relaxed">
          Upload a leaf photo and get instant disease diagnosis, treatment recommendations,
          live market prices, weather alerts, and expert farming guidance — all in one platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-12">
          <button onClick={() => navigate('/register')}
            className="btn-neon text-base py-4 px-8 flex items-center justify-center gap-2">
            Start Diagnosing Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/login')}
            className="btn-ghost text-base py-4 px-8 flex items-center justify-center gap-2">
            Sign In
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-6 text-sm text-leaf-300/50 font-rajdhani mb-12">
          {['✓ Free to start', '✓ No credit card required', '✓ 65+ diseases detected', '✓ Works on mobile'].map((item) => (
            <span key={item} className="flex items-center gap-1">{item}</span>
          ))}
        </motion.div>

        {/* Crop Tags */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 max-w-3xl">
          {CROPS.map((crop, i) => (
            <motion.span key={crop}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.04 }}
              className="px-3 py-1.5 rounded-full text-sm font-rajdhani font-medium"
              style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.15)', color: '#86efac' }}>
              {crop}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative z-10 py-12 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,135,0.03), transparent)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)' }}>
              <span className="text-xs font-rajdhani font-bold text-neon-500 tracking-widest uppercase">Platform Features</span>
            </div>
            <h2 className="font-orbitron font-bold text-4xl lg:text-5xl gradient-text mb-4">
              Everything You Need
            </h2>
            <p className="text-leaf-300/60 text-lg max-w-xl mx-auto font-inter">
              A complete agricultural intelligence platform built for modern farmers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => <FeatureCard key={feature.title} feature={feature} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6"
        style={{ background: 'rgba(0,255,135,0.02)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <span className="text-xs font-rajdhani font-bold tracking-widest uppercase" style={{ color: '#00D4FF' }}>Simple Process</span>
            </div>
            <h2 className="font-orbitron font-bold text-4xl lg:text-5xl gradient-text mb-4">How It Works</h2>
            <p className="text-leaf-300/60 text-lg max-w-xl mx-auto font-inter">
              Get a full disease diagnosis in under 10 seconds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,135,0.4), transparent)' }} />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative text-center">
                <div className="glass-card p-8">
                  {/* Step number */}
                  <div className="font-orbitron text-6xl font-black mb-4"
                    style={{ color: 'rgba(0,255,135,0.12)' }}>{step.step}</div>
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="font-orbitron font-bold text-xl text-white mb-3">{step.title}</h3>
                  <p className="text-leaf-300/60 font-inter text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-16 -right-4 z-10 items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-neon-500/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <span className="text-xs font-rajdhani font-bold tracking-widest uppercase" style={{ color: '#a78bfa' }}>Testimonials</span>
            </div>
            <h2 className="font-orbitron font-bold text-4xl lg:text-5xl gradient-text mb-4">
              Trusted by Farmers
            </h2>
            <p className="text-leaf-300/60 text-lg max-w-xl mx-auto font-inter">
              Thousands of farmers worldwide rely on LeafScan to protect their crops.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Supported Crops Banner ── */}
      <section className="relative z-10 py-12 px-6 overflow-hidden"
        style={{ background: 'rgba(0,255,135,0.02)', borderTop: '1px solid rgba(0,255,135,0.08)', borderBottom: '1px solid rgba(0,255,135,0.08)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-rajdhani text-leaf-300/50 tracking-widest text-sm uppercase mb-6">Supported Crops</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Tomato',      emoji: '🍅' }, { name: 'Potato',     emoji: '🥔' },
              { name: 'Corn',        emoji: '🌽' }, { name: 'Apple',      emoji: '🍎' },
              { name: 'Grape',       emoji: '🍇' }, { name: 'Strawberry', emoji: '🍓' },
              { name: 'Pepper',      emoji: '🌶️' }, { name: 'Soybean',    emoji: '🫘' },
              { name: 'Peach',       emoji: '🍑' }, { name: 'Cherry',     emoji: '🍒' },
              { name: 'Orange',      emoji: '🍊' }, { name: 'Blueberry',  emoji: '🫐' },
              { name: 'Raspberry',   emoji: '🍇' }, { name: 'Squash',     emoji: '🥦' },
              { name: 'Rice',        emoji: '🌾' }, { name: 'Sugarcane',  emoji: '🎋' },
              { name: 'Wheat',       emoji: '🌾' }, { name: 'Banana',     emoji: '🍌' },
              { name: 'Mango',       emoji: '🥭' }, { name: 'Coffee',     emoji: '☕' },
              { name: 'Onion',       emoji: '🧅' }, { name: 'Carrot',     emoji: '🥕' },
              { name: 'Cucumber',    emoji: '🥒' }, { name: 'Watermelon', emoji: '🍉' },
              { name: 'Garlic',      emoji: '🧄' }, { name: 'Cabbage',    emoji: '🥬' },
            ].map((crop, i) => (
              <motion.div key={crop.name}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-rajdhani font-medium text-sm"
                style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.12)', color: '#86efac' }}>
                <span>{crop.emoji}</span>
                <span>{crop.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-32 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,135,0.08) 0%, rgba(0,212,255,0.05) 100%)',
            border: '1px solid rgba(0,255,135,0.2)',
            boxShadow: '0 0 80px rgba(0,255,135,0.08)',
          }}>
          {/* Background glow */}
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,135,0.1) 0%, transparent 70%)' }} />

          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}>
            <Leaf className="w-10 h-10 text-dark-900" />
          </motion.div>

          <h2 className="font-orbitron font-black text-4xl lg:text-5xl gradient-text mb-4 relative z-10">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-leaf-300/60 font-inter mb-10 text-lg max-w-xl mx-auto relative z-10">
            Join thousands of farmers using AI to protect their crops, maximize yields, and make smarter decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button onClick={() => navigate('/register')}
              className="btn-neon text-lg py-4 px-10 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')}
              className="btn-ghost text-lg py-4 px-10">
              Sign In
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 relative z-10">
            {['✓ Free forever plan', '✓ No setup required', '✓ Works on any device'].map((item) => (
              <span key={item} className="text-sm font-rajdhani text-leaf-300/50">{item}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-neon-500/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
                  <Leaf className="w-4 h-4 text-dark-900" />
                </div>
                <span className="font-orbitron font-bold text-lg gradient-text">LeafScan</span>
              </div>
              <p className="text-leaf-300/50 font-inter text-sm leading-relaxed max-w-xs">
                AI-powered plant disease detection and agricultural intelligence platform for modern farmers.
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-rajdhani font-bold text-white tracking-wider text-sm uppercase mb-4">Features</h4>
              <ul className="space-y-2">
                {['Disease Detection', 'AI Chatbot', 'Weather Alerts', 'Market Prices', 'Crop Calendar'].map((item) => (
                  <li key={item}>
                    <button onClick={() => navigate('/register')}
                      className="text-leaf-300/50 hover:text-neon-500 font-rajdhani text-sm transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-rajdhani font-bold text-white tracking-wider text-sm uppercase mb-4">Platform</h4>
              <ul className="space-y-2">
                {['Sign Up Free', 'Sign In', 'Community', 'Cultivation Tips', 'Fertilizer Calc'].map((item) => (
                  <li key={item}>
                    <button onClick={() => navigate('/register')}
                      className="text-leaf-300/50 hover:text-neon-500 font-rajdhani text-sm transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-neon-500/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-leaf-300/40 text-sm font-rajdhani">
                © 2026 LeafScan project by Biswas Sougato (LiAn)
              </p>
              <p className="text-white/80 text-sm font-rajdhani tracking-wide">
                Credit goes to Mr. Wu Xuanwei, Mr. Chen Caikou, Mr. Zhu Xinfeng &amp; my friends — pingguo, barek, monitor, bota, roommate, xinxiye, efty bok**, body and others — because of them today I am <span style={{ color: '#00FF87', fontWeight: 'bold' }}>THE LIAN</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
              <span className="text-xs font-rajdhani text-leaf-300/40 tracking-wider">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
