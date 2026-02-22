import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API } from '../context/AuthContext'
import {
  FlaskConical, Calculator, Leaf, AlertTriangle,
  CheckCircle2, ChevronDown, Info, BookOpen
} from 'lucide-react'

const SOIL_TYPES = ['Sandy', 'Loamy', 'Clay', 'Silty', 'Peaty', 'Chalky']
const OM_LEVELS = ['low', 'medium', 'high']

export default function FertilizerCalc() {
  const [crops, setCrops] = useState([])
  const [soilGuide, setSoilGuide] = useState(null)
  const [activeTab, setActiveTab] = useState('calculator') // calculator | guide
  const [form, setForm] = useState({
    crop: '',
    area_hectares: 1,
    soil_type: 'Loamy',
    soil_ph: 6.5,
    organic_matter: 'medium',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropsRes, guideRes] = await Promise.all([
          API.get('/calculator/crops'),
          API.get('/calculator/soil-guide'),
        ])
        setCrops(cropsRes.data)
        setSoilGuide(guideRes.data)
        if (cropsRes.data.length > 0) setForm(f => ({ ...f, crop: cropsRes.data[0].crop }))
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const handleCalculate = async () => {
    if (!form.crop) { setError('Please select a crop'); return }
    if (form.area_hectares <= 0) { setError('Area must be greater than 0'); return }
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/calculator/calculate', {
        ...form,
        area_hectares: parseFloat(form.area_hectares),
        soil_ph: parseFloat(form.soil_ph),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const phColor = (ph) => {
    if (ph < 5.5) return 'text-red-400'
    if (ph < 6.0) return 'text-orange-400'
    if (ph <= 7.0) return 'text-neon-500'
    if (ph <= 7.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const phLabel = (ph) => {
    if (ph < 5.5) return 'Very Acidic'
    if (ph < 6.0) return 'Acidic'
    if (ph <= 7.0) return 'Optimal'
    if (ph <= 7.5) return 'Neutral'
    return 'Alkaline'
  }

  if (loadingData) {
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
          Fertilizer <span className="gradient-text">Calculator</span>
        </h1>
        <p className="text-leaf-300/60 font-rajdhani mt-1">
          Calculate precise NPK fertilizer requirements for your crops
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'calculator', label: '🧪 Calculator' },
          { id: 'guide', label: '📚 Soil & Deficiency Guide' },
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

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="font-orbitron font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-neon-500" />
              Input Parameters
            </h2>

            {/* Crop Select */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase mb-2">
                Crop Type
              </label>
              <div className="relative">
                <select
                  value={form.crop}
                  onChange={e => setForm(f => ({ ...f, crop: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-neon-500/20 rounded-xl text-white font-rajdhani appearance-none focus:outline-none focus:border-neon-500/50 transition-colors"
                >
                  {crops.map(c => (
                    <option key={c.crop} value={c.crop}>{c.emoji || '🌱'} {c.crop}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-300/40 pointer-events-none" />
              </div>
              {form.crop && crops.find(c => c.crop === form.crop) && (
                <p className="text-xs text-leaf-300/40 font-rajdhani mt-1">
                  Expected yield: {crops.find(c => c.crop === form.crop)?.expected_yield}
                </p>
              )}
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase mb-2">
                Farm Area (Hectares)
              </label>
              <input
                type="number"
                min="0.1"
                max="10000"
                step="0.1"
                value={form.area_hectares}
                onChange={e => setForm(f => ({ ...f, area_hectares: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-700 border border-neon-500/20 rounded-xl text-white font-rajdhani focus:outline-none focus:border-neon-500/50 transition-colors"
              />
              <p className="text-xs text-leaf-300/40 font-rajdhani mt-1">
                1 hectare = 10,000 m² = 2.47 acres
              </p>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase mb-2">
                Soil Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SOIL_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setForm(f => ({ ...f, soil_type: type }))}
                    className={`py-2 px-3 rounded-xl text-sm font-rajdhani transition-all ${
                      form.soil_type === type
                        ? 'bg-neon-500/20 border border-neon-500/50 text-neon-500'
                        : 'bg-dark-700/50 border border-neon-500/10 text-leaf-300/60 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil pH */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase mb-2">
                Soil pH: <span className={`font-bold ${phColor(form.soil_ph)}`}>{form.soil_ph} ({phLabel(form.soil_ph)})</span>
              </label>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.1"
                value={form.soil_ph}
                onChange={e => setForm(f => ({ ...f, soil_ph: parseFloat(e.target.value) }))}
                className="w-full accent-neon-500"
              />
              <div className="flex justify-between text-xs text-leaf-300/40 font-rajdhani mt-1">
                <span>4.0 (Very Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            {/* Organic Matter */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest text-leaf-300/40 uppercase mb-2">
                Organic Matter Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {OM_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setForm(f => ({ ...f, organic_matter: level }))}
                    className={`py-2 px-3 rounded-xl text-sm font-rajdhani capitalize transition-all ${
                      form.organic_matter === level
                        ? 'bg-neon-500/20 border border-neon-500/50 text-neon-500'
                        : 'bg-dark-700/50 border border-neon-500/10 text-leaf-300/60 hover:text-white'
                    }`}
                  >
                    {level === 'low' ? '🟡 Low' : level === 'medium' ? '🟢 Medium' : '🔵 High'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p className="font-rajdhani text-sm">{error}</p>
              </div>
            )}

            <motion.button
              onClick={handleCalculate}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-orbitron font-bold text-dark-900 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                  Calculating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  Calculate Fertilizer Needs
                </span>
              )}
            </motion.button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${result.crop}-${result.area_hectares}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Summary */}
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{result.emoji}</span>
                      <div>
                        <h3 className="font-orbitron font-bold text-white">{result.crop} — {result.area_hectares} ha</h3>
                        <p className="text-leaf-300/60 font-rajdhani text-sm">Expected yield: {result.expected_yield}</p>
                      </div>
                    </div>

                    {/* pH Note */}
                    {result.ph_note && (
                      <div className={`p-3 rounded-xl mb-4 text-sm font-rajdhani ${
                        result.ph_note.includes('✅') ? 'bg-neon-500/10 border border-neon-500/20 text-neon-500' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                      }`}>
                        {result.ph_note}
                      </div>
                    )}

                    {/* NPK Requirements */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Nitrogen (N)', value: result.npk_requirements.N_kg, color: '#4ade80', desc: 'Leaf growth' },
                        { label: 'Phosphorus (P)', value: result.npk_requirements.P_kg, color: '#60a5fa', desc: 'Root & flower' },
                        { label: 'Potassium (K)', value: result.npk_requirements.K_kg, color: '#f97316', desc: 'Plant health' },
                      ].map(n => (
                        <div key={n.label} className="bg-dark-700/50 rounded-xl p-3 text-center">
                          <p className="font-orbitron font-bold text-xl" style={{ color: n.color }}>{n.value}</p>
                          <p className="text-xs text-white font-rajdhani">kg</p>
                          <p className="text-xs text-leaf-300/40 font-rajdhani mt-1">{n.label}</p>
                          <p className="text-xs text-leaf-300/30 font-rajdhani">{n.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total Cost */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neon-500/10 border border-neon-500/20">
                      <span className="font-rajdhani text-leaf-300/60">Total Estimated Cost</span>
                      <span className="font-orbitron font-bold text-neon-500 text-lg">${result.total_estimated_cost_usd}</span>
                    </div>
                    <p className="text-xs text-leaf-300/40 font-rajdhani text-right mt-1">
                      ${result.cost_per_hectare_usd}/hectare
                    </p>
                  </div>

                  {/* Fertilizer Recommendations */}
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-orbitron font-bold text-white mb-4">💊 Fertilizer Recommendations</h3>
                    <div className="space-y-3">
                      {result.fertilizer_recommendations.map((rec, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-dark-700/50 rounded-xl p-4 border border-neon-500/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-rajdhani font-bold text-white">{rec.fertilizer}</p>
                              <p className="text-xs text-leaf-300/40 font-rajdhani">{rec.purpose}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-orbitron font-bold text-neon-500">{rec.quantity_kg} kg</p>
                              <p className="text-xs text-leaf-300/40 font-rajdhani">{rec.quantity_bags_50kg} bags (50kg)</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs font-rajdhani">
                            <span className="text-leaf-300/60">{rec.application}</span>
                            <span className="text-yellow-400">${rec.estimated_cost_usd}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Application Schedule */}
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-orbitron font-bold text-white mb-4">📅 Application Schedule</h3>
                    <div className="space-y-2">
                      {result.application_schedule.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-dark-700/30">
                          <div className="w-6 h-6 rounded-full bg-neon-500/20 border border-neon-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-orbitron text-neon-500">{i + 1}</span>
                          </div>
                          <div>
                            <p className="font-rajdhani font-semibold text-neon-500 text-sm">{s.timing}</p>
                            <p className="font-rajdhani text-white text-sm">{s.apply}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Organic Alternative */}
                  <div className="glass-card rounded-2xl p-5 border border-neon-500/10">
                    <h3 className="font-orbitron font-bold text-white mb-3">🌿 Organic Alternatives</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-dark-700/50 rounded-xl p-3 text-center">
                        <p className="font-orbitron font-bold text-neon-500 text-lg">{result.organic_alternative.compost_tonnes}</p>
                        <p className="text-xs text-leaf-300/40 font-rajdhani">tonnes of Compost</p>
                      </div>
                      <div className="bg-dark-700/50 rounded-xl p-3 text-center">
                        <p className="font-orbitron font-bold text-neon-500 text-lg">{result.organic_alternative.farmyard_manure_tonnes}</p>
                        <p className="text-xs text-leaf-300/40 font-rajdhani">tonnes of FYM</p>
                      </div>
                    </div>
                    <p className="text-xs text-leaf-300/40 font-rajdhani">{result.organic_alternative.note}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <FlaskConical className="w-16 h-16 text-neon-500/20 mx-auto mb-4" />
                <p className="font-orbitron font-bold text-white mb-2">Ready to Calculate</p>
                <p className="font-rajdhani text-leaf-300/40 text-sm">
                  Fill in the parameters on the left and click Calculate to get your fertilizer recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Soil Guide Tab */}
      {activeTab === 'guide' && soilGuide && (
        <div className="space-y-6">
          {/* pH Guide */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-neon-500" />
              Soil pH Guide
            </h2>
            <div className="space-y-2">
              {soilGuide.ph_guide.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-dark-700/30 hover:bg-dark-700/60 transition-colors"
                >
                  <div>
                    <p className="font-orbitron font-bold text-neon-500 text-sm">{item.range}</p>
                    <p className="text-xs text-leaf-300/40 font-rajdhani">{item.status}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-white font-rajdhani">{item.effect}</p>
                  </div>
                  <div>
                    <p className="text-xs text-leaf-300/60 font-rajdhani">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deficiency Symptoms */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Nutrient Deficiency Symptoms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {soilGuide.deficiency_symptoms.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-dark-700/50 rounded-xl p-4 border border-yellow-500/10"
                >
                  <p className="font-orbitron font-bold text-yellow-400 text-sm mb-2">{item.nutrient}</p>
                  <p className="text-sm text-white font-rajdhani mb-1">🔍 {item.symptom}</p>
                  <p className="text-xs text-neon-500 font-rajdhani">💊 {item.fix}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
