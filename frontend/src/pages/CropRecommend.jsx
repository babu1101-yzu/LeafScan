import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Sprout, FlaskConical, Thermometer, Droplets, CloudRain,
  RotateCcw, CheckCircle, AlertTriangle, XCircle, Leaf,
  Clock, Zap, ChevronDown, ChevronUp, Brain
} from 'lucide-react'

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS = [
  { name: 'Tropical Humid',  icon: '🌴', N: 82,  P: 48,  K: 40,  temp: 27, humidity: 82, ph: 6.4, rainfall: 236 },
  { name: 'Dry Arid',        icon: '🏜️', N: 21,  P: 48,  K: 20,  temp: 28, humidity: 53, ph: 6.9, rainfall: 51  },
  { name: 'Temperate',       icon: '🌿', N: 40,  P: 68,  K: 80,  temp: 18, humidity: 16, ph: 7.3, rainfall: 80  },
  { name: 'Subtropical',     icon: '☀️', N: 78,  P: 46,  K: 20,  temp: 24, humidity: 80, ph: 6.9, rainfall: 80  },
  { name: 'Highland Cool',   icon: '🏔️', N: 21,  P: 134, K: 200, temp: 21, humidity: 92, ph: 5.9, rainfall: 113 },
  { name: 'Coastal Humid',   icon: '🌊', N: 22,  P: 16,  K: 30,  temp: 27, humidity: 95, ph: 5.9, rainfall: 176 },
]

const SUITABILITY_STYLE = {
  'Excellent': { color: '#00FF87', bg: 'rgba(0,255,135,0.12)',   border: 'rgba(0,255,135,0.4)',   rank: 1 },
  'Good':      { color: '#4ade80', bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.35)', rank: 2 },
  'Moderate':  { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.35)', rank: 3 },
  'Low':       { color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.3)', rank: 4 },
}

const STATUS_ICON_MAP = {
  'Deficient': XCircle, 'Low': AlertTriangle, 'Optimal': CheckCircle,
  'High': AlertTriangle, 'Very Acidic': XCircle, 'Acidic': AlertTriangle,
  'Slightly Acidic': CheckCircle, 'Neutral': CheckCircle,
  'Alkaline': AlertTriangle, 'Very Alkaline': XCircle,
}

// ─── Slider Input ─────────────────────────────────────────────────────────────
function SliderInput({ label, icon: Icon, value, onChange, min, max, step = 1, unit, color = '#00FF87', hint }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="font-rajdhani font-semibold text-white text-sm">{label}</span>
          {hint && <span className="text-leaf-300/40 text-xs font-rajdhani">({hint})</span>}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            min={min} max={max} step={step}
            className="w-16 text-right bg-dark-700/50 border border-neon-500/20 rounded-lg px-2 py-1 text-sm font-orbitron font-bold focus:outline-none focus:border-neon-500/60"
            style={{ color }}
          />
          <span className="text-leaf-300/50 text-xs font-rajdhani w-8">{unit}</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-dark-700/60">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
      <div className="flex justify-between text-xs text-leaf-300/30 font-rajdhani">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  )
}

// ─── Crop Result Card ─────────────────────────────────────────────────────────
function CropCard({ crop, index, isTop }) {
  const [expanded, setExpanded] = useState(false)
  const style = SUITABILITY_STYLE[crop.suitability] || SUITABILITY_STYLE['Low']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, type: 'spring', bounce: 0.3 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
      onClick={() => setExpanded(!expanded)}
    >
      {isTop && (
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${style.color}, transparent)` }} />
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Rank badge */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-black text-sm text-dark-900"
              style={{ background: style.color }}>
              #{index + 1}
            </div>
            <span className="text-3xl">{crop.emoji}</span>
            <div>
              <h3 className="font-orbitron font-bold text-white text-base">{crop.crop_display}</h3>
              <span className="text-xs font-rajdhani px-2 py-0.5 rounded-full"
                style={{ background: `${style.color}20`, color: style.color, border: `1px solid ${style.color}40` }}>
                {crop.suitability} Match
              </span>
            </div>
          </div>

          {/* Confidence ring */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="28" cy="28" r="22" fill="none" stroke={style.color} strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - crop.confidence / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-orbitron font-black text-xs" style={{ color: style.color }}>
                  {crop.confidence}%
                </span>
              </div>
            </div>
            <span className="text-xs text-leaf-300/40 font-rajdhani">confidence</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { icon: '📅', label: 'Season', value: crop.season },
            { icon: '💧', label: 'Water', value: crop.water_need },
            { icon: '⏱️', label: 'Duration', value: crop.duration },
          ].map(stat => (
            <div key={stat.label} className="text-center p-2 rounded-xl bg-dark-800/40">
              <div className="text-base mb-0.5">{stat.icon}</div>
              <div className="text-xs text-leaf-300/40 font-rajdhani">{stat.label}</div>
              <div className="text-xs text-white font-rajdhani font-semibold leading-tight">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Yield */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-leaf-300/50 font-rajdhani">Expected Yield</span>
          <span className="font-rajdhani font-bold" style={{ color: style.color }}>{crop.yield}</span>
        </div>

        {/* Expand toggle */}
        <div className="flex items-center justify-center mt-3 text-leaf-300/40">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t overflow-hidden"
            style={{ borderColor: `${style.color}20` }}
          >
            <div className="p-4 text-sm text-leaf-300/70 font-rajdhani leading-relaxed">
              <p className="mb-2">
                <span className="text-white font-semibold">{crop.crop_display}</span> is a{' '}
                <span style={{ color: style.color }}>{crop.suitability.toLowerCase()}</span> match for your soil and climate conditions.
                The AI model analyzed your N-P-K values, temperature, humidity, pH, and rainfall to determine this recommendation.
              </p>
              <p>
                Best planted during <span className="text-white">{crop.season}</span> with{' '}
                <span className="text-white">{crop.water_need.toLowerCase()}</span> water requirements.
                Expected harvest in <span className="text-white">{crop.duration}</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Soil Analysis Card ───────────────────────────────────────────────────────
function SoilCard({ label, data }) {
  const Icon = STATUS_ICON_MAP[data.status] || CheckCircle
  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="font-rajdhani font-semibold text-white text-sm">{label}</span>
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4" style={{ color: data.color }} />
          <span className="text-xs font-rajdhani font-bold" style={{ color: data.color }}>{data.status}</span>
        </div>
      </div>
      <p className="text-xs text-leaf-300/60 font-rajdhani leading-relaxed">{data.advice}</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CropRecommend() {
  const { API } = useAuth()
  const [form, setForm] = useState({ N: 80, P: 48, K: 40, temp: 25, humidity: 70, ph: 6.5, rainfall: 120 })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activePreset, setActivePreset] = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const applyPreset = (preset) => {
    setForm({ N: preset.N, P: preset.P, K: preset.K, temp: preset.temp, humidity: preset.humidity, ph: preset.ph, rainfall: preset.rainfall })
    setActivePreset(preset.name)
    setResult(null)
    toast.success(`Applied "${preset.name}" preset`)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await API.post('/crop-recommend/predict', {
        nitrogen: form.N,
        phosphorus: form.P,
        potassium: form.K,
        temperature: form.temp,
        humidity: form.humidity,
        ph: form.ph,
        rainfall: form.rainfall,
        top_n: 3,
      })
      setResult(res.data)
      toast.success('AI analysis complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ N: 80, P: 48, K: 40, temp: 25, humidity: 70, ph: 6.5, rainfall: 120 })
    setResult(null)
    setActivePreset(null)
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00FF87, #4ade80)' }}>
              <Brain className="w-5 h-5 text-dark-900" />
            </div>
            <h1 className="font-orbitron font-bold text-2xl gradient-text">AI Crop Advisor</h1>
          </div>
          <p className="text-leaf-300/60 font-rajdhani text-sm ml-13">
            Enter your soil & climate data — our Random Forest ML model recommends the best crops
          </p>
        </div>
        <button onClick={handleReset}
          className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </motion.div>

      {/* ── Presets ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-xs font-rajdhani text-leaf-300/40 uppercase tracking-widest mb-3">Quick Presets</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESETS.map(preset => (
            <button key={preset.name} onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl text-center transition-all duration-200 border ${
                activePreset === preset.name
                  ? 'border-neon-500/60 bg-neon-500/10 text-white'
                  : 'border-neon-500/10 bg-dark-800/40 text-leaf-300/60 hover:border-neon-500/30 hover:text-white'
              }`}>
              <div className="text-xl mb-1">{preset.icon}</div>
              <div className="text-xs font-rajdhani font-semibold leading-tight">{preset.name}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Input Form ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6 space-y-6">

          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-5 h-5 text-neon-500" />
            <h2 className="font-orbitron font-bold text-white">Soil Nutrients (NPK)</h2>
          </div>

          <SliderInput label="Nitrogen (N)" icon={Leaf} value={form.N} onChange={v => set('N', v)}
            min={0} max={200} unit="kg/ha" color="#00FF87" hint="Promotes leaf growth" />
          <SliderInput label="Phosphorus (P)" icon={Zap} value={form.P} onChange={v => set('P', v)}
            min={0} max={200} unit="kg/ha" color="#00D4FF" hint="Root & flower development" />
          <SliderInput label="Potassium (K)" icon={Sprout} value={form.K} onChange={v => set('K', v)}
            min={0} max={200} unit="kg/ha" color="#a78bfa" hint="Disease resistance" />

          <div className="border-t border-neon-500/10 pt-5">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <h2 className="font-orbitron font-bold text-white">Climate Conditions</h2>
            </div>
            <div className="space-y-5">
              <SliderInput label="Temperature" icon={Thermometer} value={form.temp} onChange={v => set('temp', v)}
                min={0} max={55} step={0.5} unit="°C" color="#fb923c" />
              <SliderInput label="Humidity" icon={Droplets} value={form.humidity} onChange={v => set('humidity', v)}
                min={0} max={100} unit="%" color="#38bdf8" />
              <SliderInput label="Soil pH" icon={FlaskConical} value={form.ph} onChange={v => set('ph', v)}
                min={3} max={10} step={0.1} unit="" color="#f472b6" hint="3=acidic, 7=neutral, 10=alkaline" />
              <SliderInput label="Annual Rainfall" icon={CloudRain} value={form.rainfall} onChange={v => set('rainfall', v)}
                min={0} max={500} unit="mm" color="#818cf8" />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-neon py-4 flex items-center justify-center gap-3 text-base font-orbitron font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <motion.div className="w-5 h-5 border-2 border-dark-900/40 border-t-dark-900 rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Get AI Crop Recommendations
              </>
            )}
          </motion.button>
        </motion.div>

        {/* ── Results Panel ── */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card p-10 flex flex-col items-center justify-center text-center h-full min-h-64">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-6xl mb-4">🌱</motion.div>
                <h3 className="font-orbitron font-bold text-white mb-2">Ready to Analyze</h3>
                <p className="text-leaf-300/50 font-rajdhani text-sm max-w-xs">
                  Enter your soil NPK values and climate data, then click the button to get AI-powered crop recommendations.
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card p-10 flex flex-col items-center justify-center text-center h-full min-h-64">
                <motion.div className="w-16 h-16 rounded-full border-4 border-neon-500/20 border-t-neon-500 mb-6"
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                <h3 className="font-orbitron font-bold text-white mb-2">AI Processing...</h3>
                <p className="text-leaf-300/50 font-rajdhani text-sm">Random Forest model analyzing 7 parameters</p>
                <div className="flex gap-1 mt-4">
                  {['N', 'P', 'K', 'Temp', 'Humidity', 'pH', 'Rain'].map((f, i) => (
                    <motion.span key={f}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="text-xs font-rajdhani px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(0,255,135,0.1)', color: '#00FF87' }}>
                      {f}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-4">

                {/* Top recommendation banner */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4 flex items-center gap-3"
                  style={{ border: '1px solid rgba(0,255,135,0.3)', background: 'rgba(0,255,135,0.05)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #00FF87, #4ade80)' }}>
                    <CheckCircle className="w-5 h-5 text-dark-900" />
                  </div>
                  <div>
                    <p className="text-xs text-leaf-300/50 font-rajdhani uppercase tracking-widest">Best Match</p>
                    <p className="font-orbitron font-bold text-white">
                      {result.recommendations[0]?.emoji} {result.recommendations[0]?.crop_display}
                      <span className="text-neon-500 ml-2">{result.recommendations[0]?.confidence}%</span>
                    </p>
                  </div>
                </motion.div>

                {/* Crop cards */}
                <div className="space-y-3">
                  {result.recommendations.map((crop, i) => (
                    <CropCard key={crop.crop} crop={crop} index={i} isTop={i === 0} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Soil Analysis ── */}
      <AnimatePresence>
        {result?.soil_analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-neon-500" />
              Soil Health Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(result.soil_analysis).map(([key, data]) => (
                <SoilCard key={key}
                  label={key === 'ph' ? 'Soil pH' : key.charAt(0).toUpperCase() + key.slice(1)}
                  data={data} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info Banner ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass-card p-5 flex items-start gap-4"
        style={{ border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,212,255,0.04)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,212,255,0.15)' }}>
          <Brain className="w-5 h-5" style={{ color: '#00D4FF' }} />
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-white text-sm mb-1">About the AI Model</h3>
          <p className="text-leaf-300/60 font-rajdhani text-sm leading-relaxed">
            This recommendation uses a <span className="text-white">Random Forest classifier</span> trained on 4,400 soil-crop samples
            across 22 crop types. It analyzes 7 parameters: Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH, and Rainfall
            to predict the most suitable crops for your specific conditions with confidence scores.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
