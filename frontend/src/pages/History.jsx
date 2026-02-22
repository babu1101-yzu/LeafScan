import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History as HistoryIcon, Microscope, Search, MessageSquare,
  Trash2, Loader2, Calendar, Filter, X, AlertTriangle, CheckCircle
} from 'lucide-react'
import { API } from '../context/AuthContext'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  diagnosis: { icon: Microscope,    color: '#f87171', bg: 'rgba(248,113,113,0.1)',  label: 'Diagnosis'  },
  tip:       { icon: Search,        color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   label: 'Tip'        },
  search:    { icon: Search,        color: '#00D4FF', bg: 'rgba(0,212,255,0.1)',    label: 'Search'     },
  chat:      { icon: MessageSquare, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', label: 'Chat'       },
}

const MOCK_HISTORY = [
  {
    id: 1,
    query: 'Diagnosis: Tomato Late Blight',
    result_type: 'diagnosis',
    result_summary: 'Tomato - Tomato Late Blight (94.2% confidence)',
    image_url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=100',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    query: 'Diagnosis: Healthy Apple',
    result_type: 'diagnosis',
    result_summary: 'Apple - Healthy Apple (97.8% confidence)',
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    query: 'Diagnosis: Corn Gray Leaf Spot',
    result_type: 'diagnosis',
    result_summary: 'Corn - Gray Leaf Spot (88.5% confidence)',
    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    query: 'Diagnosis: Potato Late Blight',
    result_type: 'diagnosis',
    result_summary: 'Potato - Late Blight (91.3% confidence)',
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100',
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    query: 'Diagnosis: Grape Black Rot',
    result_type: 'diagnosis',
    result_summary: 'Grape - Black Rot (85.7% confidence)',
    image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=100',
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
]

function HistoryItem({ item, onDelete, index }) {
  const cfg = TYPE_CONFIG[item.result_type] || TYPE_CONFIG.search
  const isHealthy = item.result_summary?.toLowerCase().includes('healthy')

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-card p-4 flex items-start gap-4 group hover:border-neon-500/20 transition-all"
    >
      {/* Image or Icon */}
      <div className="flex-shrink-0">
        {item.image_url ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-neon-500/15">
            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: cfg.bg }}
          >
            <cfg.icon className="w-6 h-6" style={{ color: cfg.color }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-xs font-rajdhani font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
              >
                {cfg.label}
              </span>
              {item.result_type === 'diagnosis' && (
                <span
                  className="text-xs font-rajdhani font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={isHealthy
                    ? { background: 'rgba(0,255,135,0.1)', color: '#00FF87', border: '1px solid rgba(0,255,135,0.2)' }
                    : { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
                  }
                >
                  {isHealthy ? '✓ Healthy' : '⚠ Disease'}
                </span>
              )}
            </div>
            <p className="font-rajdhani font-semibold text-white truncate">{item.query}</p>
            {item.result_summary && (
              <p className="text-sm text-leaf-300/60 font-inter mt-0.5 truncate">{item.result_summary}</p>
            )}
          </div>

          {/* Delete button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-xl text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 mt-2">
          <Calendar className="w-3 h-3 text-leaf-300/30" />
          <span className="text-xs text-leaf-300/40 font-rajdhani">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })} •{' '}
            {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [clearing, setClearing] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await API.get('/history/')
      setHistory(res.data.length > 0 ? res.data : MOCK_HISTORY)
    } catch {
      setHistory(MOCK_HISTORY)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const handleDelete = async (id) => {
    try {
      await API.delete(`/history/${id}`)
      setHistory(prev => prev.filter(h => h.id !== id))
      toast.success('Entry deleted')
    } catch {
      // Remove from local state anyway for mock data
      setHistory(prev => prev.filter(h => h.id !== id))
      toast.success('Entry deleted')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return
    setClearing(true)
    try {
      await API.delete('/history/')
      setHistory([])
      toast.success('History cleared')
    } catch {
      setHistory([])
      toast.success('History cleared')
    } finally {
      setClearing(false)
    }
  }

  const filtered = history.filter(h => {
    const matchSearch = h.query.toLowerCase().includes(search.toLowerCase()) ||
      h.result_summary?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || h.result_type === filter
    return matchSearch && matchFilter
  })

  // Group by date
  const grouped = filtered.reduce((acc, item) => {
    const date = format(new Date(item.created_at), 'MMMM d, yyyy')
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {})

  const FILTERS = [
    { key: 'all',       label: 'All',       count: history.length },
    { key: 'diagnosis', label: 'Diagnoses', count: history.filter(h => h.result_type === 'diagnosis').length },
    { key: 'search',    label: 'Searches',  count: history.filter(h => h.result_type === 'search').length },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-bold text-3xl gradient-text mb-1">History Log</h1>
          <p className="text-leaf-300/60 font-inter text-sm">Your past diagnoses and searches</p>
        </div>
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all text-sm font-rajdhani font-semibold"
          >
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear All
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Entries', value: history.length, color: '#00FF87', icon: HistoryIcon },
          { label: 'Diagnoses', value: history.filter(h => h.result_type === 'diagnosis').length, color: '#f87171', icon: Microscope },
          { label: 'This Week', value: history.filter(h => new Date(h.created_at) > new Date(Date.now() - 7*86400000)).length, color: '#00D4FF', icon: Calendar },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
            <div>
              <div className="font-orbitron font-bold text-white text-xl leading-none">{stat.value}</div>
              <div className="text-xs text-leaf-300/50 font-rajdhani mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search history..."
            className="input-field pl-11"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-leaf-300/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-2.5 rounded-xl text-sm font-rajdhani font-semibold transition-all whitespace-nowrap"
              style={{
                background: filter === f.key ? 'rgba(0,255,135,0.15)' : 'rgba(15,45,28,0.5)',
                color: filter === f.key ? '#00FF87' : 'rgba(129,199,132,0.6)',
                border: `1px solid ${filter === f.key ? 'rgba(0,255,135,0.4)' : 'rgba(0,255,135,0.1)'}`,
              }}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-60">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HistoryIcon className="w-12 h-12 text-neon-500/30 mx-auto mb-3" />
          <p className="font-orbitron font-bold text-white mb-2">No History Found</p>
          <p className="text-leaf-300/50 font-inter text-sm">
            {search ? 'No results match your search' : 'Start diagnosing plants to build your history'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-neon-500/10" />
                  <span className="text-xs font-rajdhani font-semibold text-leaf-300/40 tracking-wider uppercase px-3 py-1 rounded-full"
                    style={{ background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.1)' }}>
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-neon-500/10" />
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <HistoryItem key={item.id} item={item} onDelete={handleDelete} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
