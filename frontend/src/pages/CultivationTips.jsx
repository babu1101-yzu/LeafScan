import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Search, ChevronDown, ChevronUp, Clock, BarChart3, Leaf, X, AlertTriangle } from 'lucide-react'
import { API } from '../context/AuthContext'

const DIFFICULTY_COLORS = {
  Easy:   { color: '#00FF87', bg: 'rgba(0,255,135,0.1)',   border: 'rgba(0,255,135,0.3)'   },
  Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)'  },
  Hard:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
}

const CATEGORY_COLORS = {
  'Vegetable':     '#00FF87',
  'Root Vegetable':'#f97316',
  'Grain':         '#fbbf24',
  'Fruit Tree':    '#f87171',
  'Fruit Vine':    '#a78bfa',
  'Berry':         '#f9a8d4',
  'Legume':        '#4ade80',
  'Cash Crop':     '#00D4FF',
  'Spice':         '#fb923c',
  'Brassica':      '#86efac',
}

function TipCard({ crop, onClick }) {
  const diff = DIFFICULTY_COLORS[crop.difficulty] || DIFFICULTY_COLORS.Medium
  const catColor = CATEGORY_COLORS[crop.category] || '#00FF87'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onClick(crop)}
      className="glass-card overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={crop.image}
          alt={crop.crop}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />

        {/* Emoji */}
        <div className="absolute top-3 left-3 text-3xl">{crop.emoji}</div>

        {/* Difficulty Badge */}
        <div
          className="absolute top-3 right-3 text-xs font-rajdhani font-bold px-2 py-1 rounded-full"
          style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}
        >
          {crop.difficulty}
        </div>

        {/* Crop Name */}
        <div className="absolute bottom-3 left-3">
          <h3 className="font-orbitron font-bold text-white text-lg">{crop.crop}</h3>
          <span
            className="text-xs font-rajdhani px-2 py-0.5 rounded-full"
            style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}
          >
            {crop.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-leaf-300/60 font-inter text-sm leading-relaxed mb-4 line-clamp-2">{crop.summary}</p>
        <div className="grid grid-cols-2 gap-2 text-xs font-rajdhani">
          <div className="flex items-center gap-1.5 text-leaf-300/50">
            <Clock className="w-3.5 h-3.5 text-neon-500" />
            <span>{crop.growing_time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-leaf-300/50">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-500" />
            <span>{crop.yield}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {crop.common_diseases?.slice(0, 2).map(d => (
            <span key={d} className="text-xs px-2 py-0.5 rounded-full font-rajdhani"
              style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}>
              {d}
            </span>
          ))}
          {crop.common_diseases?.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-rajdhani text-leaf-300/40">
              +{crop.common_diseases.length - 2} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TipModal({ crop, onClose }) {
  const [openTip, setOpenTip] = useState(null)
  const diff = DIFFICULTY_COLORS[crop.difficulty] || DIFFICULTY_COLORS.Medium

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          <img src={crop.image} alt={crop.crop} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-dark-900/60 text-white hover:bg-dark-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl">{crop.emoji}</span>
              <h2 className="font-orbitron font-black text-3xl text-white">{crop.crop}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-rajdhani px-2 py-0.5 rounded-full"
                style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                {crop.difficulty}
              </span>
              <span className="text-xs text-leaf-300/60 font-rajdhani">{crop.season}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <p className="text-leaf-300/70 font-inter leading-relaxed">{crop.summary}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Growing Time', value: crop.growing_time, icon: Clock, color: '#00FF87' },
              { label: 'Expected Yield', value: crop.yield, icon: BarChart3, color: '#00D4FF' },
              { label: 'Category', value: crop.category, icon: Leaf, color: '#a78bfa' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-xl"
                style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}15` }}>
                <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
                <div className="font-orbitron font-bold text-white text-xs mb-0.5">{stat.value}</div>
                <div className="text-xs text-leaf-300/40 font-rajdhani">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Growing Tips Accordion */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-3 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-neon-500" />
              Growing Guide
            </h3>
            <div className="space-y-2">
              {crop.tips?.map((tip, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid rgba(0,255,135,0.1)' }}
                >
                  <button
                    onClick={() => setOpenTip(openTip === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left transition-all hover:bg-neon-500/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-orbitron font-bold text-dark-900"
                        style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
                        {i + 1}
                      </span>
                      <span className="font-rajdhani font-semibold text-white">{tip.title}</span>
                    </div>
                    {openTip === i
                      ? <ChevronUp className="w-4 h-4 text-neon-500" />
                      : <ChevronDown className="w-4 h-4 text-leaf-300/40" />
                    }
                  </button>
                  <AnimatePresence>
                    {openTip === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-leaf-300/70 font-inter leading-relaxed border-t border-neon-500/10 pt-3">
                          {tip.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Common Diseases */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Watch Out For
            </h3>
            <div className="flex flex-wrap gap-2">
              {crop.common_diseases?.map(d => (
                <span key={d} className="px-3 py-1.5 rounded-full text-sm font-rajdhani font-medium"
                  style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                  ⚠ {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CultivationTips() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    API.get('/tips')
      .then(res => setCrops(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(crops.map(c => c.category))]

  const filtered = crops.filter(c => {
    const matchSearch = c.crop.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-orbitron font-bold text-3xl gradient-text mb-1">Cultivation Tips</h1>
        <p className="text-leaf-300/60 font-inter text-sm">Expert growing guides for every crop</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search crops..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-rajdhani font-semibold transition-all"
              style={{
                background: filter === cat ? 'rgba(0,255,135,0.15)' : 'rgba(15,45,28,0.5)',
                color: filter === cat ? '#00FF87' : 'rgba(129,199,132,0.6)',
                border: `1px solid ${filter === cat ? 'rgba(0,255,135,0.4)' : 'rgba(0,255,135,0.1)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton h-72 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Sprout className="w-12 h-12 text-neon-500/30 mx-auto mb-3" />
          <p className="font-orbitron font-bold text-white mb-2">No crops found</p>
          <p className="text-leaf-300/50 font-inter text-sm">Try a different search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((crop, i) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TipCard crop={crop} onClick={setSelected} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <TipModal crop={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
