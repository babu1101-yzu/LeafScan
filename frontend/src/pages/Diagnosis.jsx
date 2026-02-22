import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Microscope, CheckCircle, AlertTriangle, XCircle,
  Loader2, ImageIcon, RefreshCw, Info, Leaf,
  ChevronRight, Cpu, Wind, Shield, FlaskConical
} from 'lucide-react'
import { API } from '../context/AuthContext'
import { getDiseaseInfo, SEV_CONFIG, getSeverityKey } from '../data/diseaseData'
import toast from 'react-hot-toast'

const ICON_MAP = { CheckCircle, AlertTriangle, XCircle, Info }

// ── Severity Meter ────────────────────────────────────────────────────────────
function SeverityMeter({ severity }) {
  if (!severity) return null
  const { score, level, color, urgency, description } = severity
  const isHealthy = level === 'Healthy'

  // Arc gauge: 180° sweep
  const radius = 52
  const circumference = Math.PI * radius  // half circle
  const offset = circumference * (1 - score / 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-5"
      style={{ background: `${color}08`, border: `1px solid ${color}30` }}
    >
      <div className="flex items-center gap-4">
        {/* Arc Gauge */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="68" viewBox="0 0 120 68">
            {/* Background arc */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <motion.path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
              style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
            {/* Score text */}
            <text x="60" y="58" textAnchor="middle" fontSize="18" fontWeight="900"
              fontFamily="Orbitron, sans-serif" fill={color}>
              {isHealthy ? '✓' : score}
            </text>
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
            <span className="text-xs text-leaf-300/30 font-rajdhani">0</span>
            <span className="text-xs text-leaf-300/30 font-rajdhani">100</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-orbitron font-black text-lg" style={{ color }}>{level}</span>
            <span className="text-xs font-rajdhani px-2 py-0.5 rounded-full"
              style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
              Severity {isHealthy ? '0%' : `${score}%`}
            </span>
          </div>
          <p className="text-sm font-rajdhani font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
            ⏱ {urgency}
          </p>
          <p className="text-xs font-inter leading-relaxed" style={{ color: 'rgba(167,243,208,0.65)' }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100)
  const color = pct >= 90 ? '#00FF87' : pct >= 75 ? '#fbbf24' : '#f87171'
  return (
    <div>
      <div className="flex justify-between text-sm font-rajdhani mb-2">
        <span className="text-leaf-300/70 font-semibold">AI Confidence Score</span>
        <span style={{ color }} className="font-bold text-lg">{pct}%</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,135,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

function ItemList({ items, color, numbered }) {
  return (
    <div className="space-y-2 mt-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
          style={{ background: `${color}07`, border: `1px solid ${color}15` }}>
          <span className="flex-shrink-0 font-bold text-sm mt-0.5" style={{ color }}>
            {numbered ? `${i + 1}.` : '▸'}
          </span>
          <p className="text-sm font-inter leading-relaxed" style={{ color: 'rgba(200,230,201,0.9)' }}>{item}</p>
        </div>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'overview',   label: '📋 Overview' },
  { id: 'spread',     label: '💨 Spread' },
  { id: 'treatment',  label: '💊 Treatment' },
  { id: 'prevention', label: '🛡️ Prevention' },
]

function ResultPanel({ result, activeTab, setActiveTab }) {
  const sevKey = getSeverityKey(result)
  const sev = SEV_CONFIG[sevKey]
  const info = getDiseaseInfo(result.disease_name)
  const SevIcon = ICON_MAP[sev.iconName] || Info

  return (
    <div className="space-y-4">
      {/* Disease Header */}
      <div className="rounded-2xl p-6"
        style={{ background: sev.bg, border: `2px solid ${sev.border}`, boxShadow: `0 0 30px ${sev.color}15` }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${sev.color}20`, border: `1px solid ${sev.border}` }}>
            <SevIcon className="w-7 h-7" style={{ color: sev.color }} />
          </div>
          <div className="flex-1">
            <span className="text-xs font-rajdhani font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: `${sev.color}20`, color: sev.color, border: `1px solid ${sev.border}` }}>
              {sev.label} SEVERITY
            </span>
            <h2 className="font-orbitron font-bold text-2xl text-white mt-2 leading-tight">{result.disease_name}</h2>
            <p className="text-leaf-300/70 font-rajdhani text-sm mt-1">
              Crop: <span className="text-white font-semibold">{result.crop_type}</span>
              {' · '}
              <span style={{ color: result.is_healthy ? '#00FF87' : '#f87171' }}>
                {result.is_healthy ? '✓ Healthy' : '⚠ Disease Detected'}
              </span>
            </p>
          </div>
        </div>
      <ConfidenceBar value={result.confidence} />
    </div>

      {/* Severity Meter */}
      {result.severity && <SeverityMeter severity={result.severity} />}

      {/* Tabs — bright, high-contrast */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-xl"
        style={{ background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(0,255,135,0.25)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="py-2.5 px-1 rounded-lg text-xs font-rajdhani font-bold transition-all text-center"
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(0,255,135,0.28), rgba(0,212,255,0.15))'
                : 'rgba(255,255,255,0.04)',
              color: activeTab === tab.id ? '#00FF87' : 'rgba(220,255,235,0.85)',
              border: activeTab === tab.id
                ? '1px solid rgba(0,255,135,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: activeTab === tab.id ? '0 0 10px rgba(0,255,135,0.2)' : 'none',
              textShadow: activeTab === tab.id ? '0 0 8px rgba(0,255,135,0.5)' : 'none',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(10,31,20,0.7)', border: '1px solid rgba(0,255,135,0.1)', minHeight: '220px' }}>
        {activeTab === 'overview' && (
          <div>
            <h3 className="font-orbitron font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-neon-500" /> What is this disease?
            </h3>
            <p className="text-base font-inter leading-relaxed mb-4" style={{ color: 'rgba(200,230,201,0.9)' }}>{info.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,255,135,0.07)', border: '1px solid rgba(0,255,135,0.15)' }}>
                <p className="text-xs text-leaf-300/50 font-rajdhani uppercase tracking-wider mb-1">Status</p>
                <p className="font-orbitron font-bold text-sm" style={{ color: result.is_healthy ? '#00FF87' : '#f87171' }}>
                  {result.is_healthy ? '✓ Healthy' : '⚠ Diseased'}
                </p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <p className="text-xs text-leaf-300/50 font-rajdhani uppercase tracking-wider mb-1">Crop Type</p>
                <p className="font-orbitron font-bold text-sm text-white">{result.crop_type}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'spread' && (
          <div>
            <h3 className="font-orbitron font-bold text-white mb-3 flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400" /> How Does It Spread?
            </h3>
            <p className="text-base font-inter leading-relaxed mb-4" style={{ color: 'rgba(200,230,201,0.9)' }}>{info.spread}</p>
            <div className="p-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p className="text-sm font-rajdhani font-semibold text-red-400">
                ⚠ Act quickly — early intervention prevents spread to neighboring plants!
              </p>
            </div>
          </div>
        )}
        {activeTab === 'treatment' && (
          <div>
            <h3 className="font-orbitron font-bold text-white mb-2 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-yellow-400" /> Treatment Options
            </h3>
            <p className="text-xs text-leaf-300/50 font-rajdhani uppercase tracking-wider mb-1">🌿 Organic Remedies</p>
            <ItemList items={info.organic} color="#00FF87" numbered />
            <p className="text-xs text-leaf-300/50 font-rajdhani uppercase tracking-wider mt-4 mb-1">⚗️ Chemical Treatments</p>
            <ItemList items={info.chemical} color="#fbbf24" numbered />
          </div>
        )}
        {activeTab === 'prevention' && (
          <div>
            <h3 className="font-orbitron font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-500" /> Prevention Strategies
            </h3>
            <ItemList items={info.prevention} color="#00FF87" numbered />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Crop Selector ─────────────────────────────────────────────────────────────
const CROPS = [
  { id: 'tomato',     emoji: '🍅', label: 'Tomato' },
  { id: 'potato',     emoji: '🥔', label: 'Potato' },
  { id: 'corn',       emoji: '🌽', label: 'Corn' },
  { id: 'apple',      emoji: '🍎', label: 'Apple' },
  { id: 'grape',      emoji: '🍇', label: 'Grape' },
  { id: 'orange',     emoji: '🍊', label: 'Orange' },
  { id: 'peach',      emoji: '🍑', label: 'Peach' },
  { id: 'pepper',     emoji: '🌶️', label: 'Pepper' },
  { id: 'strawberry', emoji: '🍓', label: 'Strawberry' },
  { id: 'soybean',    emoji: '🫘', label: 'Soybean' },
  { id: 'cherry',     emoji: '🍒', label: 'Cherry' },
  { id: 'blueberry',  emoji: '🫐', label: 'Blueberry' },
  { id: 'raspberry',  emoji: '🌿', label: 'Raspberry' },
  { id: 'rice',       emoji: '🌾', label: 'Rice' },
  { id: 'sugarcane',  emoji: '🎋', label: 'Sugarcane' },
  { id: 'wheat',      emoji: '🌾', label: 'Wheat' },
  { id: 'banana',     emoji: '🍌', label: 'Banana' },
  { id: 'mango',      emoji: '🥭', label: 'Mango' },
  { id: 'coffee',     emoji: '☕', label: 'Coffee' },
  { id: 'squash',     emoji: '🎃', label: 'Squash' },
]

function CropSelector({ selected, onSelect }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(10,31,20,0.85)', border: '1px solid rgba(0,255,135,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-orbitron font-bold text-white text-sm flex items-center gap-2">
          <Leaf className="w-4 h-4 text-neon-500" />
          Select Your Crop
          <span className="text-xs font-rajdhani font-normal text-neon-500/70">(improves accuracy)</span>
        </p>
        {selected && (
          <button onClick={() => onSelect(null)}
            className="text-xs font-rajdhani text-leaf-300/50 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10">
            ✕ Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {CROPS.map(crop => {
          const isSelected = selected === crop.id
          return (
            <motion.button
              key={crop.id}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(isSelected ? null : crop.id)}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-center transition-all"
              style={{
                background: isSelected ? 'rgba(0,255,135,0.2)' : 'rgba(0,255,135,0.04)',
                border: isSelected ? '1.5px solid rgba(0,255,135,0.6)' : '1px solid rgba(0,255,135,0.1)',
                boxShadow: isSelected ? '0 0 12px rgba(0,255,135,0.25)' : 'none',
              }}
            >
              <span className="text-lg leading-none">{crop.emoji}</span>
              <span className="text-xs font-rajdhani font-semibold leading-none"
                style={{ color: isSelected ? '#00FF87' : 'rgba(167,243,208,0.75)' }}>
                {crop.label}
              </span>
            </motion.button>
          )
        })}
      </div>
      {selected && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.3)' }}>
          <div className="w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
          <p className="text-sm font-rajdhani font-semibold text-neon-500">
            ✓ Crop hint active: <span className="text-white">{CROPS.find(c => c.id === selected)?.emoji} {CROPS.find(c => c.id === selected)?.label}</span>
            {' '}— AI will focus on this crop's diseases
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default function Diagnosis() {
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [step, setStep]           = useState('upload')
  const [modelStatus, setModelStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCrop, setSelectedCrop] = useState(null)

  useEffect(() => {
    API.get('/diagnosis/model-status').then(r => setModelStatus(r.data)).catch(() => {})
  }, [])

  const onDrop = useCallback((accepted) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setStep('upload')
    setActiveTab('overview')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => toast.error('Invalid file. Use JPG/PNG/WebP under 10MB.'),
  })

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setStep('analyzing')
    const fd = new FormData()
    fd.append('file', file)
    if (selectedCrop) fd.append('crop_hint', selectedCrop)
    try {
      const res = await API.post('/diagnosis/predict', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(res.data)
      setStep('result')
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Analysis failed. Please try again.')
      setStep('upload')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setStep('upload')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-orbitron font-bold text-3xl gradient-text mb-2">Disease Diagnosis</h1>
        <p className="text-leaf-300/70 font-inter text-base">
          Upload a clear leaf photo for instant AI-powered disease detection and treatment advice
        </p>
      </div>

      {/* Model Status */}
      {modelStatus && (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: modelStatus.model_loaded ? 'rgba(0,255,135,0.07)' : 'rgba(251,191,36,0.07)',
            border: `1px solid ${modelStatus.model_loaded ? 'rgba(0,255,135,0.25)' : 'rgba(251,191,36,0.25)'}`,
          }}>
          <Cpu className="w-5 h-5 flex-shrink-0" style={{ color: modelStatus.model_loaded ? '#00FF87' : '#fbbf24' }} />
          <div>
            <p className="font-rajdhani font-bold" style={{ color: modelStatus.model_loaded ? '#00FF87' : '#fbbf24' }}>
              {modelStatus.model_loaded ? '✓ YOLOv8 Real-Time Inference Active' : '⚡ Demo Mode — Mock Predictions'}
            </p>
            <p className="text-sm text-leaf-300/50 font-inter">
              {modelStatus.total_classes} disease classes · {modelStatus.model_name || 'YOLOv8'}
            </p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse ml-auto"
            style={{ background: modelStatus.model_loaded ? '#00FF87' : '#fbbf24' }} />
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {['Upload Photo', 'AI Analysis', 'View Results'].map((s, i) => {
          const keys = ['upload', 'analyzing', 'result']
          const isActive = keys[i] === step
          const isDone = keys.indexOf(step) > i
          return (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-rajdhani font-semibold transition-all"
                style={{
                  background: isActive ? 'rgba(0,255,135,0.18)' : isDone ? 'rgba(0,255,135,0.1)' : 'rgba(15,45,28,0.5)',
                  color: isActive ? '#00FF87' : isDone ? '#4ade80' : 'rgba(129,199,132,0.4)',
                  border: `1px solid ${isActive ? 'rgba(0,255,135,0.5)' : isDone ? 'rgba(0,255,135,0.25)' : 'rgba(0,255,135,0.08)'}`,
                }}>
                <span className="font-orbitron font-bold">{i + 1}</span>
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < 2 && <ChevronRight className="w-4 h-4 text-leaf-300/30" />}
            </div>
          )
        })}
      </div>

      {/* Crop Selector — placed before upload */}
      <CropSelector selected={selectedCrop} onSelect={setSelectedCrop} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <motion.div
            {...getRootProps()}
            className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden"
            style={{
              borderColor: isDragActive ? '#00FF87' : preview ? 'rgba(0,255,135,0.4)' : 'rgba(0,255,135,0.18)',
              background: isDragActive ? 'rgba(0,255,135,0.06)' : 'rgba(10,31,20,0.6)',
              minHeight: '320px',
            }}
            whileHover={{ borderColor: 'rgba(0,255,135,0.45)' }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative w-full h-80">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-rajdhani font-semibold truncate">{file?.name}</p>
                  <p className="text-leaf-300/60 text-sm font-rajdhani">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-900/70">
                    <div className="text-center">
                      <motion.div
                        className="w-20 h-20 rounded-full border-2 border-neon-500 mx-auto mb-3"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <p className="font-orbitron text-neon-500 font-bold animate-pulse">SCANNING LEAF...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 p-8 text-center">
                <motion.div
                  animate={{ y: isDragActive ? -12 : 0 }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(0,255,135,0.1)', border: '2px solid rgba(0,255,135,0.2)' }}
                >
                  {isDragActive
                    ? <Leaf className="w-12 h-12 text-neon-500" />
                    : <ImageIcon className="w-12 h-12 text-neon-500/50" />
                  }
                </motion.div>
                <p className="font-orbitron font-bold text-white text-xl mb-2">
                  {isDragActive ? 'Drop Your Leaf Photo!' : 'Upload Leaf Photo'}
                </p>
                <p className="text-leaf-300/60 font-inter text-base mb-3">Drag & drop or click to browse</p>
                <p className="text-sm text-leaf-300/40 font-rajdhani">JPG, PNG, WebP • Max 10MB</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {preview && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex items-center gap-2 flex-1 justify-center py-3.5 rounded-xl font-rajdhani font-semibold transition-all"
                style={{ border: '1px solid rgba(0,255,135,0.2)', color: 'rgba(129,199,132,0.7)' }}
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: preview && !loading ? 1.02 : 1 }}
              whileTap={{ scale: preview && !loading ? 0.98 : 1 }}
              onClick={handleAnalyze}
              disabled={!preview || loading}
              className="flex items-center gap-2 flex-1 justify-center py-3.5 rounded-xl font-orbitron font-bold transition-all"
              style={{
                background: preview && !loading ? 'linear-gradient(135deg, #00FF87, #00D4FF)' : 'rgba(0,255,135,0.1)',
                color: preview && !loading ? '#050D0A' : 'rgba(0,255,135,0.35)',
                boxShadow: preview && !loading ? '0 0 20px rgba(0,255,135,0.3)' : 'none',
              }}
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                : <><Microscope className="w-5 h-5" /> Analyze Now</>
              }
            </motion.button>
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.12)' }}>
            <p className="font-rajdhani font-bold text-neon-500 tracking-wider uppercase text-sm mb-3">📸 Tips for Best Results</p>
            {[
              'Use clear, well-lit natural light photos',
              'Focus on the affected leaf area clearly',
              'Include both healthy and diseased parts',
              'Avoid blurry, dark, or overexposed images',
            ].map(tip => (
              <div key={tip} className="flex items-start gap-2 mb-2">
                <span className="text-neon-500 mt-0.5 flex-shrink-0">▸</span>
                <p className="text-sm text-leaf-300/70 font-inter">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Results Panel */}
        <div>
          {step === 'result' && result ? (
            <ResultPanel result={result} activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : step === 'analyzing' ? (
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-80"
              style={{ background: 'rgba(10,31,20,0.7)', border: '1px solid rgba(0,255,135,0.15)' }}>
              <motion.div
                className="w-24 h-24 rounded-full border-2 border-neon-500/30 flex items-center justify-center mb-6 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Microscope className="w-10 h-10 text-neon-500" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  style={{ borderTopColor: '#00FF87' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
              <h3 className="font-orbitron font-bold text-white text-xl mb-2">Analyzing Leaf</h3>
              <p className="text-leaf-300/60 font-inter text-sm text-center">
                YOLOv8 AI model is scanning your image for disease patterns...
              </p>
              <div className="flex gap-1 mt-6">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-neon-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-80 text-center"
              style={{ background: 'rgba(10,31,20,0.5)', border: '1px solid rgba(0,255,135,0.1)' }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.15)' }}>
                <Microscope className="w-10 h-10 text-neon-500/40" />
              </div>
              <h3 className="font-orbitron font-bold text-white text-lg mb-2">Results Appear Here</h3>
              <p className="text-leaf-300/50 font-inter text-sm">
                Upload a leaf photo and click "Analyze Now" to get instant disease diagnosis with treatment advice.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Supported Crops */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(10,31,20,0.6)', border: '1px solid rgba(0,255,135,0.1)' }}>
        <h3 className="font-orbitron font-bold text-white mb-4">🌾 Supported Crops & Diseases</h3>
        <div className="flex flex-wrap gap-2">
          {[
            '🍅 Tomato', '🥔 Potato', '🌽 Corn', '🍎 Apple', '🍇 Grape',
            '🍊 Orange', '🍑 Peach', '🌶️ Pepper', '🍓 Strawberry',
            '🫘 Soybean', '🍒 Cherry', '🫐 Blueberry', '🌿 Raspberry',
            '🌾 Rice', '🎋 Sugarcane', '🌾 Wheat', '🍌 Banana', '🥭 Mango',
          ].map(crop => (
            <span key={crop} className="px-3 py-1.5 rounded-full text-sm font-rajdhani"
              style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.15)', color: '#86efac' }}>
              {crop}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
