import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { API } from '../context/AuthContext'
import {
  TrendingUp, TrendingDown, Minus, RefreshCw,
  Search, ArrowUpRight, ArrowDownRight, Wifi, WifiOff,
  Clock, Zap, Database
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-neon-500/20 rounded-lg px-3 py-2 text-sm">
        <p className="text-leaf-300/60">{label}</p>
        <p className="text-neon-500 font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function MarketPrices() {
  const [prices, setPrices] = useState([])
  const [topMovers, setTopMovers] = useState({ gainers: [], losers: [] })
  const [cacheStatus, setCacheStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [forceRefreshing, setForceRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [lastFetched, setLastFetched] = useState(null)

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const [pricesRes, moversRes, cacheRes] = await Promise.all([
        API.get('/market'),
        API.get('/market/summary/top-movers'),
        API.get('/market/cache-status').catch(() => ({ data: null })),
      ])
      setPrices(pricesRes.data)
      setTopMovers(moversRes.data)
      setCacheStatus(cacheRes.data)
      setLastFetched(new Date())
      if (!selected && pricesRes.data.length > 0) setSelected(pricesRes.data[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const forceRefresh = async () => {
    setForceRefreshing(true)
    try {
      await API.get('/market/refresh')
      await fetchData(false)
    } catch (err) {
      console.error(err)
    } finally {
      setForceRefreshing(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), 60000)
    return () => clearInterval(interval)
  }, [])

  const filtered = prices.filter(p => {
    const matchSearch = p.crop.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.trend === filter
    return matchSearch && matchFilter
  })

  const TrendIcon = ({ trend, size = 'w-4 h-4' }) => {
    if (trend === 'up') return <TrendingUp className={`${size} text-neon-500`} />
    if (trend === 'down') return <TrendingDown className={`${size} text-red-400`} />
    return <Minus className={`${size} text-yellow-400`} />
  }

  const trendColor = (trend) => {
    if (trend === 'up') return 'text-neon-500'
    if (trend === 'down') return 'text-red-400'
    return 'text-yellow-400'
  }

  const trendBg = (trend) => {
    if (trend === 'up') return 'bg-neon-500/10 border-neon-500/20'
    if (trend === 'down') return 'bg-red-500/10 border-red-500/20'
    return 'bg-yellow-500/10 border-yellow-500/20'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-neon-500/30 border-t-neon-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-bold text-2xl text-white">
            Market <span className="gradient-text">Prices</span>
          </h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="text-leaf-300/60 font-rajdhani">
              Crop commodity prices — 24h cached, daily refresh
            </p>
            {/* Live data indicator */}
            {cacheStatus && (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-rajdhani font-semibold ${
                cacheStatus.cache_active
                  ? 'bg-neon-500/10 border border-neon-500/30 text-neon-500'
                  : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
              }`}>
                {cacheStatus.cache_active ? (
                  <><Wifi className="w-3 h-3" /> CACHED</>
                ) : (
                  <><WifiOff className="w-3 h-3" /> FETCHING LIVE</>
                )}
              </div>
            )}
            {cacheStatus?.alpha_vantage_configured && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-rajdhani bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Zap className="w-3 h-3" /> Alpha Vantage
              </div>
            )}
            {cacheStatus?.world_bank_available && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-rajdhani bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Database className="w-3 h-3" /> World Bank
              </div>
            )}
          </div>
          {lastFetched && (
            <p className="text-xs text-leaf-300/40 font-rajdhani mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last fetched: {lastFetched.toLocaleTimeString()}
              {cacheStatus?.expires_in_hours > 0 && (
                <span className="ml-2">· Cache expires in {cacheStatus.expires_in_hours.toFixed(1)}h</span>
              )}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => fetchData(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700 border border-neon-500/20 text-neon-500 font-rajdhani hover:bg-neon-500/10 transition-all text-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          <motion.button
            onClick={forceRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Force fetch live prices (clears cache)"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-rajdhani hover:bg-cyan-500/20 transition-all text-sm"
          >
            <Zap className={`w-3.5 h-3.5 ${forceRefreshing ? 'animate-pulse' : ''}`} />
            {forceRefreshing ? 'Fetching...' : 'Live Fetch'}
          </motion.button>
        </div>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gainers */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-5 h-5 text-neon-500" />
            <h3 className="font-orbitron font-bold text-neon-500">Top Gainers</h3>
          </div>
          <div className="space-y-2">
            {topMovers.gainers.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.crop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neon-500/5 cursor-pointer transition-colors"
                onClick={() => setSelected(prices.find(p => p.crop === item.crop))}
              >
                <span className="font-rajdhani text-white">{item.emoji} {item.crop}</span>
                <div className="flex items-center gap-2">
                  <span className="font-rajdhani text-leaf-300/60 text-sm">${item.price.toFixed(2)}/{item.unit}</span>
                  <span className="text-neon-500 font-bold text-sm">+{item.change_pct}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownRight className="w-5 h-5 text-red-400" />
            <h3 className="font-orbitron font-bold text-red-400">Top Losers</h3>
          </div>
          <div className="space-y-2">
            {topMovers.losers.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.crop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-red-500/5 cursor-pointer transition-colors"
                onClick={() => setSelected(prices.find(p => p.crop === item.crop))}
              >
                <span className="font-rajdhani text-white">{item.emoji} {item.crop}</span>
                <div className="flex items-center gap-2">
                  <span className="font-rajdhani text-leaf-300/60 text-sm">${item.price.toFixed(2)}/{item.unit}</span>
                  <span className="text-red-400 font-bold text-sm">{item.change_pct}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Crop Chart */}
      {selected && (
        <motion.div
          key={selected.crop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white">
                {selected.emoji} {selected.crop}
              </h2>
              <p className="text-leaf-300/60 font-rajdhani">7-Day Price History</p>
            </div>
            <div className="text-right">
              <p className="font-orbitron font-bold text-2xl text-white">
                ${selected.price.toFixed(2)}
                <span className="text-sm text-leaf-300/60 font-rajdhani ml-1">/{selected.unit}</span>
              </p>
              <div className={`flex items-center gap-1 justify-end ${trendColor(selected.trend)}`}>
                <TrendIcon trend={selected.trend} />
                <span className="font-rajdhani font-bold">
                  {selected.change > 0 ? '+' : ''}{selected.change.toFixed(2)} ({selected.change_pct > 0 ? '+' : ''}{selected.change_pct}%)
                </span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selected.weekly_history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,135,0.05)" />
              <XAxis dataKey="day" stroke="#4ade80" tick={{ fontSize: 12, fontFamily: 'Rajdhani' }} />
              <YAxis stroke="#4ade80" tick={{ fontSize: 12, fontFamily: 'Rajdhani' }} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={selected.trend === 'up' ? '#00FF87' : selected.trend === 'down' ? '#f87171' : '#fbbf24'}
                strokeWidth={2}
                dot={{ fill: '#00FF87', r: 4 }}
                activeDot={{ r: 6, fill: '#00FF87' }}
              />
            </LineChart>
          </ResponsiveContainer>
          {selected.market_insight && (
            <div className={`mt-4 p-3 rounded-xl border ${trendBg(selected.trend)}`}>
              <p className="font-rajdhani text-sm text-white">{selected.market_insight}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-300/40" />
          <input
            type="text"
            placeholder="Search crops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-neon-500/20 rounded-xl text-white font-rajdhani placeholder-leaf-300/40 focus:outline-none focus:border-neon-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'up', 'down'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-rajdhani font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-neon-500 text-dark-900'
                  : 'bg-dark-700 border border-neon-500/20 text-leaf-300/60 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'up' ? '📈 Rising' : '📉 Falling'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-neon-500/10 text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase">
          <span className="col-span-2">Crop</span>
          <span className="text-right">Price</span>
          <span className="text-right">Change</span>
          <span className="text-right">Trend</span>
        </div>
        <div className="divide-y divide-neon-500/5">
          {filtered.map((item, i) => (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(item)}
              className={`grid grid-cols-5 gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-neon-500/5 ${
                selected?.crop === item.crop ? 'bg-neon-500/5 border-l-2 border-neon-500' : ''
              }`}
            >
              <div className="col-span-2 flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-rajdhani font-semibold text-white">{item.crop}</p>
                    {item.data_source === 'live' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-neon-500/15 text-neon-500 border border-neon-500/30 font-rajdhani">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-leaf-300/40">per {item.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-orbitron font-bold text-white">${item.price.toFixed(2)}</p>
                <p className="text-xs text-leaf-300/40">{item.currency}</p>
              </div>
              <div className={`text-right font-rajdhani font-bold ${trendColor(item.trend)}`}>
                {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                <p className="text-xs">{item.change_pct > 0 ? '+' : ''}{item.change_pct}%</p>
              </div>
              <div className="flex justify-end items-center">
                <TrendIcon trend={item.trend} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-leaf-300/40 font-rajdhani">
          No crops found matching "{search}"
        </div>
      )}
    </motion.div>
  )
}
