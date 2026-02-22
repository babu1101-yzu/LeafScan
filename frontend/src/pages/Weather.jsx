import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudSun, Wind, Droplets, Thermometer, Eye, Search,
  AlertTriangle, CheckCircle, Info, XCircle, Loader2,
  MapPin, RefreshCw, Gauge, Sunrise, Sunset, Leaf,
  Sprout, FlaskConical, Tractor, Wheat, Zap, CloudRain
} from 'lucide-react'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ─── Alert config ─────────────────────────────────────────────────────────────
const ALERT_CONFIG = {
  frost:         { icon: AlertTriangle, color: '#00D4FF', bg: '#00D4FF' },
  cold:          { icon: AlertTriangle, color: '#93c5fd', bg: '#93c5fd' },
  heat:          { icon: AlertTriangle, color: '#f97316', bg: '#f97316' },
  extreme_heat:  { icon: XCircle,       color: '#ef4444', bg: '#ef4444' },
  drought:       { icon: AlertTriangle, color: '#fbbf24', bg: '#fbbf24' },
  disease_risk:  { icon: AlertTriangle, color: '#f87171', bg: '#f87171' },
  rain:          { icon: CloudRain,     color: '#60a5fa', bg: '#60a5fa' },
  heavy_rain:    { icon: CloudRain,     color: '#3b82f6', bg: '#3b82f6' },
  storm:         { icon: XCircle,       color: '#ef4444', bg: '#ef4444' },
  wind:          { icon: Wind,          color: '#a78bfa', bg: '#a78bfa' },
  snow:          { icon: AlertTriangle, color: '#e0f2fe', bg: '#e0f2fe' },
  freezing_rain: { icon: AlertTriangle, color: '#bfdbfe', bg: '#bfdbfe' },
  low_pressure:  { icon: Gauge,         color: '#fb923c', bg: '#fb923c' },
  optimal:       { icon: CheckCircle,   color: '#00FF87', bg: '#00FF87' },
  normal:        { icon: Info,          color: '#00FF87', bg: '#00FF87' },
  info:          { icon: Info,          color: '#00FF87', bg: '#00FF87' },
}

const WEATHER_BACKGROUNDS = {
  '01d': 'from-yellow-900/20 to-orange-900/10',
  '01n': 'from-indigo-900/20 to-blue-900/10',
  '02d': 'from-blue-900/20 to-gray-900/10',
  '02n': 'from-indigo-900/20 to-gray-900/10',
  '03d': 'from-gray-900/20 to-slate-900/10',
  '04d': 'from-gray-900/30 to-slate-900/20',
  '09d': 'from-blue-900/30 to-cyan-900/20',
  '10d': 'from-blue-900/30 to-cyan-900/20',
  '11d': 'from-purple-900/30 to-gray-900/20',
  '13d': 'from-blue-900/20 to-white/5',
  '50d': 'from-gray-900/30 to-slate-900/20',
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function WeatherMetric({ icon: Icon, label, value, color = '#00FF87', sub }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-default"
      style={{ background: `${color}08`, border: `1px solid ${color}15` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
      <div className="font-orbitron font-bold text-white text-lg leading-none">{value}</div>
      {sub && <div className="text-xs font-inter" style={{ color: `${color}80` }}>{sub}</div>}
      <div className="text-xs text-leaf-300/50 font-rajdhani tracking-wider uppercase">{label}</div>
    </motion.div>
  )
}

function ForecastCard({ day, date, high, low, icon, description, humidity, rain_chance }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl glass-card cursor-default"
    >
      <p className="text-xs font-rajdhani font-bold text-leaf-300/70 tracking-wider">{day}</p>
      {date && <p className="text-xs font-inter text-leaf-300/40">{date}</p>}
      <img
        src={`https://openweathermap.org/img/wn/${icon}.png`}
        alt={description}
        className="w-10 h-10"
        onError={e => { e.target.style.display = 'none' }}
      />
      <p className="text-xs text-leaf-300/50 font-inter capitalize text-center leading-tight">{description}</p>
      <div className="flex gap-2 text-xs font-rajdhani font-bold">
        <span className="text-white">{high}°</span>
        <span className="text-leaf-300/40">{low}°</span>
      </div>
      {rain_chance !== undefined && (
        <div className="flex items-center gap-1 text-xs font-inter" style={{ color: '#60a5fa' }}>
          <CloudRain className="w-3 h-3" />
          <span>{rain_chance}%</span>
        </div>
      )}
    </motion.div>
  )
}

function FarmingAdviceCard({ icon: Icon, title, advice, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-xl"
      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <p className="font-rajdhani font-bold text-sm" style={{ color }}>{title}</p>
      </div>
      <p className="text-sm text-leaf-300/70 font-inter leading-relaxed">{advice}</p>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Weather() {
  const [weather, setWeather]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [city, setCity]           = useState('Nairobi')
  const [inputCity, setInputCity] = useState('Nairobi')
  const [apiStatus, setApiStatus] = useState(null)

  const fetchWeather = async (cityName, lat, lon) => {
    setLoading(true)
    try {
      let url = '/weather/current'
      if (lat != null && lon != null) {
        url += `?lat=${lat}&lon=${lon}`
      } else {
        url += `?city=${encodeURIComponent(cityName || city)}`
      }
      const res = await API.get(url)
      setWeather(res.data)
      if (res.data.city) setCity(res.data.city)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to fetch weather data'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatus = async () => {
    try {
      const res = await API.get('/weather/status')
      setApiStatus(res.data)
    } catch {}
  }

  useEffect(() => {
    fetchWeather(city)
    fetchStatus()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!inputCity.trim()) return
    fetchWeather(inputCity.trim())
  }

  const handleGeoLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return }
    toast.loading('Getting your location...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss()
        fetchWeather(null, pos.coords.latitude, pos.coords.longitude)
      },
      () => { toast.dismiss(); toast.error('Location access denied') }
    )
  }

  const bgClass = weather
    ? (WEATHER_BACKGROUNDS[weather.icon] || WEATHER_BACKGROUNDS[weather.icon?.replace('n','d')] || 'from-dark-800/20 to-dark-900/10')
    : ''

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-orbitron font-bold text-3xl gradient-text mb-1">Weather Center</h1>
          <p className="text-leaf-300/60 font-inter text-sm">Real-time forecasts & agricultural alerts</p>
        </div>
        {apiStatus && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-rajdhani font-bold"
            style={{
              background: apiStatus.api_configured ? 'rgba(0,255,135,0.1)' : 'rgba(251,191,36,0.1)',
              border: `1px solid ${apiStatus.api_configured ? 'rgba(0,255,135,0.3)' : 'rgba(251,191,36,0.3)'}`,
              color: apiStatus.api_configured ? '#00FF87' : '#fbbf24',
            }}>
            <div className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: apiStatus.api_configured ? '#00FF87' : '#fbbf24' }} />
            {apiStatus.api_configured ? 'Live API' : 'Mock Data'}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="flex gap-3 flex-1">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
            <input
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              placeholder="Enter city name..."
              className="input-field pl-11"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon px-5 py-2.5 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </motion.button>
        </form>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeoLocation}
          className="btn-ghost px-4 py-2.5 flex items-center gap-2"
          title="Use my location"
        >
          <MapPin className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchWeather(city)}
          className="p-2.5 rounded-xl border border-neon-500/20 text-leaf-300/60 hover:text-neon-500 hover:border-neon-500/40 transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="glass-card p-16 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-neon-500 animate-spin" />
          <p className="font-rajdhani text-leaf-300/60 tracking-wider">Fetching weather data...</p>
        </div>
      ) : weather ? (
        <>
          {/* ── Main Weather Card ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 lg:p-8 bg-gradient-to-br ${bgClass} relative overflow-hidden`}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #00FF87, transparent)' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="relative z-10">
              {/* City + Temp */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-neon-500" />
                    <span className="font-rajdhani font-semibold text-leaf-300/80">
                      {weather.city}{weather.country ? `, ${weather.country}` : ''}
                    </span>
                    {weather.api_source === 'mock' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-rajdhani"
                        style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                        {weather.demo_reason === 'key_pending' ? '⏳ Key Activating' : 'Demo Data'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="font-orbitron font-black text-7xl lg:text-8xl gradient-text leading-none">
                      {weather.temperature}°
                    </div>
                    <div className="pb-2">
                      <p className="text-white font-rajdhani font-semibold text-xl capitalize">{weather.description}</p>
                      <p className="text-leaf-300/50 font-rajdhani text-sm">Feels like {weather.feels_like}°C</p>
                      {weather.temp_min != null && weather.temp_max != null && (
                        <p className="text-leaf-300/40 font-rajdhani text-xs">
                          H: {weather.temp_max}° / L: {weather.temp_min}°
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                    alt={weather.description}
                    className="w-28 h-28 lg:w-36 lg:h-36"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  {/* Sunrise / Sunset */}
                  {weather.sunrise && (
                    <div className="flex gap-4 text-xs font-rajdhani text-leaf-300/50">
                      <span>🌅 {weather.sunrise}</span>
                      <span>🌇 {weather.sunset}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
                <WeatherMetric icon={Droplets}    label="Humidity"    value={`${weather.humidity}%`}                color="#00D4FF" />
                <WeatherMetric icon={Wind}        label="Wind"        value={`${weather.wind_speed} m/s`}           color="#a78bfa"
                  sub={weather.wind_direction ? `${weather.wind_direction}` : undefined} />
                <WeatherMetric icon={Gauge}       label="Pressure"    value={`${weather.pressure}`}                 color="#fbbf24"
                  sub="hPa" />
                <WeatherMetric icon={Eye}         label="Visibility"  value={`${weather.visibility} km`}            color="#4ade80" />
                <WeatherMetric icon={CloudSun}    label="Cloud Cover" value={`${weather.cloud_cover ?? '—'}%`}      color="#94a3b8" />
                <WeatherMetric icon={Thermometer} label="Dew Point"   value={`${weather.dew_point ?? '—'}°C`}       color="#67e8f9" />
                <WeatherMetric icon={Leaf}        label="Soil Temp"   value={`${weather.soil_temperature ?? '—'}°C`} color="#86efac" />
                <WeatherMetric icon={Zap}         label="UV Index"    value={weather.uv_index ?? 'N/A'}             color="#fde68a" />
              </div>
            </div>
          </motion.div>

          {/* ── Agricultural Alerts ───────────────────────────────────────── */}
          {weather.alerts?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Agricultural Alerts
                <span className="ml-auto text-xs font-rajdhani px-2 py-1 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                  {weather.alerts.length} Active
                </span>
              </h3>
              <div className="space-y-3">
                {weather.alerts.map((alert, i) => {
                  const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG.info
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ background: `${cfg.bg}08`, border: `1px solid ${cfg.bg}20` }}
                    >
                      <cfg.icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: cfg.color }} />
                      <div className="flex-1">
                        <p className="text-sm text-white/90 font-inter leading-relaxed">{alert.message}</p>
                        <span
                          className="text-xs font-rajdhani font-bold tracking-wider uppercase mt-1 inline-block px-2 py-0.5 rounded-full"
                          style={{ background: `${cfg.bg}15`, color: cfg.color }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── Farming Advice (from API) ─────────────────────────────────── */}
          {weather.farming_advice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                <Tractor className="w-5 h-5 text-neon-500" />
                Today's Farming Advice
                {weather.farming_advice.overall && (
                  <span className="ml-auto text-xs font-inter text-leaf-300/60 font-normal">
                    {weather.farming_advice.overall}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FarmingAdviceCard
                  icon={Droplets}
                  title="Irrigation"
                  advice={weather.farming_advice.irrigation}
                  color="#00D4FF"
                />
                <FarmingAdviceCard
                  icon={FlaskConical}
                  title="Spraying"
                  advice={weather.farming_advice.spraying}
                  color="#a78bfa"
                />
                <FarmingAdviceCard
                  icon={Sprout}
                  title="Planting"
                  advice={weather.farming_advice.planting}
                  color="#4ade80"
                />
                <FarmingAdviceCard
                  icon={Wheat}
                  title="Harvesting"
                  advice={weather.farming_advice.harvesting}
                  color="#fbbf24"
                />
              </div>
            </motion.div>
          )}

          {/* ── 7-Day Forecast ────────────────────────────────────────────── */}
          {weather.forecast?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-neon-500" />
                {weather.forecast.length}-Day Forecast
              </h3>
              <div className={`grid gap-3`}
                style={{ gridTemplateColumns: `repeat(${Math.min(weather.forecast.length, 7)}, 1fr)` }}>
                {weather.forecast.map((day, i) => (
                  <ForecastCard key={i} {...day} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── API Setup Notice (when using mock) ───────────────────────── */}
          {weather.api_source === 'mock' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-5 flex items-start gap-4"
              style={{ border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.03)' }}
            >
              <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                {weather.demo_reason === 'key_pending' ? (
                  <>
                    <p className="font-rajdhani font-bold text-yellow-400 mb-1">⏳ API Key Activating</p>
                    <p className="text-sm text-leaf-300/60 font-inter leading-relaxed">
                      Your OpenWeatherMap API key (<code className="text-neon-500 bg-dark-800 px-1 rounded">827a****</code>) is configured but not yet activated.
                      New keys typically activate within <strong className="text-white">2 hours</strong> of registration.
                      Live weather data will load automatically once the key is active.
                    </p>
                    <p className="text-xs text-leaf-300/40 font-inter mt-2">
                      Currently showing realistic demo data for {weather.city}.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-rajdhani font-bold text-yellow-400 mb-1">Enable Real-Time Weather</p>
                    <p className="text-sm text-leaf-300/60 font-inter leading-relaxed">
                      Currently showing demo data. To get live weather for any location:
                    </p>
                    <ol className="text-sm text-leaf-300/50 font-inter mt-2 space-y-1 list-decimal list-inside">
                      <li>Get a free API key at <span className="text-neon-500">openweathermap.org/api</span></li>
                      <li>Add <code className="text-neon-500 bg-dark-800 px-1 rounded">OPENWEATHER_API_KEY=your_key</code> to <code className="text-neon-500 bg-dark-800 px-1 rounded">backend/.env</code></li>
                      <li>Restart the backend server</li>
                    </ol>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="glass-card p-16 text-center">
          <CloudSun className="w-16 h-16 text-neon-500/30 mx-auto mb-4" />
          <p className="font-orbitron font-bold text-white mb-2">No Weather Data</p>
          <p className="text-leaf-300/50 font-inter text-sm">Search for a city to get weather information</p>
        </div>
      )}
    </div>
  )
}
