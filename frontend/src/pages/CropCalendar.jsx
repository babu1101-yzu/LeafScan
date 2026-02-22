import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API } from '../context/AuthContext'
import {
  CalendarDays, ChevronLeft, ChevronRight, Sprout,
  Droplets, Sun, Users, Leaf, Info, CheckCircle2
} from 'lucide-react'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const MONTH_ICONS = ['❄️','🌱','🌿','🌸','☀️','🌞','🔥','🌾','🍂','🍁','🌧️','🌨️']

export default function CropCalendar() {
  const [crops, setCrops] = useState([])
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [cropDetail, setCropDetail] = useState(null)
  const [monthTasks, setMonthTasks] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [activeTab, setActiveTab] = useState('monthly') // monthly | crop | companion
  const [companion, setCompanion] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [cropsRes, companionRes] = await Promise.all([
          API.get('/calendar'),
          API.get('/calendar/companion-planting'),
        ])
        setCrops(cropsRes.data)
        setCompanion(companionRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  useEffect(() => {
    const fetchMonth = async () => {
      try {
        const res = await API.get(`/calendar/monthly/${currentMonth}`)
        setMonthTasks(res.data)
      } catch (err) { console.error(err) }
    }
    fetchMonth()
  }, [currentMonth])

  const fetchCropDetail = async (cropName) => {
    try {
      const res = await API.get(`/calendar/crop/${cropName}`)
      setCropDetail(res.data)
      setSelectedCrop(cropName)
      setActiveTab('crop')
    } catch (err) { console.error(err) }
  }

  const prevMonth = () => setCurrentMonth(m => m === 1 ? 12 : m - 1)
  const nextMonth = () => setCurrentMonth(m => m === 12 ? 1 : m + 1)

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
      <div>
        <h1 className="font-orbitron font-bold text-2xl text-white">
          Crop <span className="gradient-text">Calendar</span>
        </h1>
        <p className="text-leaf-300/60 font-rajdhani mt-1">
          Planting schedules, seasonal tasks & companion planting guide
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'monthly', label: '📅 Monthly Tasks' },
          { id: 'crop', label: '🌱 Crop Details' },
          { id: 'companion', label: '🤝 Companion Planting' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-rajdhani font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-neon-500 text-dark-900'
                : 'bg-dark-700 border border-neon-500/20 text-leaf-300/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monthly Tasks Tab */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          {/* Month Navigator */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevMonth}
                className="p-2 rounded-xl bg-dark-700 border border-neon-500/20 text-neon-500 hover:bg-neon-500/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="text-center">
                <p className="text-4xl mb-1">{MONTH_ICONS[currentMonth - 1]}</p>
                <h2 className="font-orbitron font-bold text-2xl text-white">{MONTH_NAMES[currentMonth - 1]}</h2>
                {monthTasks && (
                  <p className="text-leaf-300/60 font-rajdhani text-sm mt-1">{monthTasks.general_advice}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="p-2 rounded-xl bg-dark-700 border border-neon-500/20 text-neon-500 hover:bg-neon-500/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mb-6">
              {MONTH_NAMES.map((name, i) => (
                <motion.button
                  key={name}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentMonth(i + 1)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    currentMonth === i + 1
                      ? 'bg-neon-500 text-dark-900'
                      : 'bg-dark-700/50 text-leaf-300/40 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <p className="text-sm">{MONTH_ICONS[i]}</p>
                  <p className="text-xs font-rajdhani">{name.slice(0, 3)}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tasks for Month */}
          {monthTasks && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {monthTasks.crop_tasks.length === 0 ? (
                  <div className="col-span-2 glass-card rounded-2xl p-8 text-center">
                    <p className="text-4xl mb-3">😴</p>
                    <p className="font-rajdhani text-leaf-300/60">No specific crop tasks this month. Rest and plan!</p>
                  </div>
                ) : (
                  monthTasks.crop_tasks.map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-neon-500/30 transition-all cursor-pointer"
                      onClick={() => fetchCropDetail(task.crop)}
                    >
                      <span className="text-2xl">{task.emoji}</span>
                      <div>
                        <p className="font-rajdhani font-semibold text-white">{task.crop}</p>
                        <p className="text-sm text-leaf-300/60 font-rajdhani">{task.task}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-neon-500/40 ml-auto mt-1 flex-shrink-0" />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Crop Details Tab */}
      {activeTab === 'crop' && (
        <div className="space-y-4">
          {/* Crop Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {crops.map(crop => (
              <motion.button
                key={crop.crop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchCropDetail(crop.crop)}
                className={`p-3 rounded-xl text-center transition-all border ${
                  selectedCrop === crop.crop
                    ? 'bg-neon-500/20 border-neon-500/50 text-white'
                    : 'bg-dark-700/50 border-neon-500/10 text-leaf-300/60 hover:text-white hover:border-neon-500/30'
                }`}
              >
                <p className="text-2xl mb-1">{crop.emoji}</p>
                <p className="text-xs font-rajdhani">{crop.crop}</p>
              </motion.button>
            ))}
          </div>

          {/* Crop Detail */}
          {cropDetail && (
            <AnimatePresence mode="wait">
              <motion.div
                key={cropDetail.crop}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Overview */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{cropDetail.emoji}</span>
                    <div>
                      <h2 className="font-orbitron font-bold text-2xl text-white">{cropDetail.crop}</h2>
                      <p className="text-leaf-300/60 font-rajdhani">⏱️ {cropDetail.days_to_maturity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Droplets, label: 'Water Needs', value: cropDetail.water_needs, color: '#00D4FF' },
                      { icon: Sun, label: 'Sunlight', value: cropDetail.sun, color: '#fbbf24' },
                      { icon: Sprout, label: 'Spacing', value: cropDetail.spacing, color: '#4ade80' },
                      { icon: Leaf, label: 'Planting Depth', value: cropDetail.depth, color: '#00FF87' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-dark-700/50 rounded-xl p-3">
                        <stat.icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                        <p className="text-xs text-leaf-300/40 font-rajdhani">{stat.label}</p>
                        <p className="text-sm text-white font-rajdhani font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seasons */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-orbitron font-bold text-white mb-4">🗓️ Growing Seasons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(cropDetail.seasons || {}).map(([season, data]) => (
                      <div key={season} className="bg-dark-700/50 rounded-xl p-4 border border-neon-500/10">
                        <p className="font-orbitron font-bold text-neon-500 text-sm mb-2">{season}</p>
                        <div className="space-y-1 text-sm font-rajdhani">
                          <p><span className="text-leaf-300/40">Plant:</span> <span className="text-white">{data.plant}</span></p>
                          <p><span className="text-leaf-300/40">Harvest:</span> <span className="text-white">{data.harvest}</span></p>
                          <p className="text-leaf-300/60 text-xs mt-2">{data.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Tasks */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-orbitron font-bold text-white mb-4">📋 Year-Round Task Guide</h3>
                  <div className="space-y-2">
                    {(cropDetail.key_tasks || []).map((task, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700/60 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-neon-500/10 border border-neon-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-orbitron text-neon-500">{MONTH_NAMES[task.month - 1].slice(0, 3)}</span>
                        </div>
                        <p className="font-rajdhani text-white text-sm">{task.task}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {!cropDetail && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <CalendarDays className="w-12 h-12 text-neon-500/30 mx-auto mb-4" />
              <p className="font-rajdhani text-leaf-300/60">Select a crop above to view its full calendar</p>
            </div>
          )}
        </div>
      )}

      {/* Companion Planting Tab */}
      {activeTab === 'companion' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-neon-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-neon-500 flex-shrink-0 mt-0.5" />
              <p className="font-rajdhani text-leaf-300/80 text-sm">
                <strong className="text-white">Companion planting</strong> is the practice of growing different plants near each other for mutual benefit — pest control, pollination, space efficiency, and increased yields.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companion.map((item, i) => (
              <motion.div
                key={item.crop}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <h3 className="font-orbitron font-bold text-white">{item.crop}</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-rajdhani text-neon-500/70 uppercase tracking-widest mb-1">✅ Good Companions</p>
                    <div className="flex flex-wrap gap-1">
                      {item.good_companions.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-xs font-rajdhani">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-rajdhani text-red-400/70 uppercase tracking-widest mb-1">❌ Avoid Planting With</p>
                    <div className="flex flex-wrap gap-1">
                      {item.bad_companions.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-rajdhani">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
