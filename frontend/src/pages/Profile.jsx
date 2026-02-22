import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, MapPin, FileText, Camera, Save, Loader2,
  Shield, Bell, Palette, LogOut, Leaf, Edit3, CheckCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AVATAR_COLORS = [
  'linear-gradient(135deg, #00FF87, #00D4FF)',
  'linear-gradient(135deg, #f87171, #f97316)',
  'linear-gradient(135deg, #a78bfa, #7c3aed)',
  'linear-gradient(135deg, #fbbf24, #f97316)',
  'linear-gradient(135deg, #4ade80, #22c55e)',
  'linear-gradient(135deg, #60a5fa, #3b82f6)',
]

function StatBadge({ label, value, color }) {
  return (
    <div className="text-center p-4 rounded-2xl"
      style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
      <div className="font-orbitron font-bold text-2xl text-white mb-1">{value}</div>
      <div className="text-xs text-leaf-300/50 font-rajdhani tracking-wider uppercase">{label}</div>
    </div>
  )
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatarColor, setAvatarColor] = useState(0)
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    location: user?.location || '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
      setEditing(false)
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-orbitron font-bold text-3xl gradient-text mb-1">Profile</h1>
        <p className="text-leaf-300/60 font-inter text-sm">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-dark-900 font-orbitron font-black text-3xl cursor-pointer"
              style={{ background: AVATAR_COLORS[avatarColor], boxShadow: '0 0 30px rgba(0,255,135,0.3)' }}
              whileHover={{ scale: 1.05 }}
              animate={{ boxShadow: ['0 0 20px rgba(0,255,135,0.3)', '0 0 40px rgba(0,255,135,0.5)', '0 0 20px rgba(0,255,135,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </motion.div>
            <button
              onClick={() => setAvatarColor((avatarColor + 1) % AVATAR_COLORS.length)}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-dark-700 border border-neon-500/30 text-neon-500 hover:bg-dark-600 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="font-orbitron font-bold text-2xl text-white mb-1">
              {user?.full_name || user?.username}
            </h2>
            <p className="text-leaf-300/60 font-rajdhani mb-1">@{user?.username}</p>
            <p className="text-leaf-300/40 font-inter text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
              <span className="text-xs text-neon-500 font-rajdhani tracking-wider">ACTIVE FARMER</span>
            </div>
          </div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-ghost py-2.5 px-5 flex items-center gap-2' : 'btn-neon py-2.5 px-5 flex items-center gap-2'}
          >
            <Edit3 className="w-4 h-4" />
            {editing ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatBadge label="Diagnoses" value="24" color="#f87171" />
          <StatBadge label="Posts"     value="7"  color="#a78bfa" />
          <StatBadge label="Days Active" value="30" color="#00FF87" />
        </div>

        {/* Profile Form */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
              <input
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                disabled={!editing}
                placeholder="Your full name"
                className="input-field pl-11"
                style={{ opacity: editing ? 1 : 0.7 }}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
              <input
                value={user?.email || ''}
                disabled
                className="input-field pl-11 opacity-50 cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Shield className="w-4 h-4 text-neon-500/60" />
              </div>
            </div>
            <p className="text-xs text-leaf-300/30 font-rajdhani mt-1">Email cannot be changed</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                disabled={!editing}
                placeholder="Your farm location"
                className="input-field pl-11"
                style={{ opacity: editing ? 1 : 0.7 }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">
              Bio
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-leaf-300/40" />
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                disabled={!editing}
                placeholder="Tell the community about your farm..."
                rows={3}
                className="input-field pl-11 resize-none"
                style={{ opacity: editing ? 1 : 0.7 }}
              />
            </div>
          </div>

          {/* Save Button */}
          {editing && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="btn-neon w-full py-3.5 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Avatar Color Picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-neon-500" />
          Avatar Color
        </h3>
        <div className="flex gap-3 flex-wrap">
          {AVATAR_COLORS.map((color, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAvatarColor(i)}
              className="w-10 h-10 rounded-xl relative"
              style={{ background: color }}
            >
              {avatarColor === i && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6"
      >
        <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-neon-500" />
          Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Weather Alerts', desc: 'Get notified about critical weather conditions', enabled: true },
            { label: 'Disease Alerts', desc: 'Notifications when new diseases are detected in your region', enabled: true },
            { label: 'Community Updates', desc: 'New posts and replies in the community', enabled: false },
            { label: 'Weekly Reports', desc: 'Weekly summary of your farm activity', enabled: true },
          ].map((pref, i) => (
            <div key={pref.label} className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.08)' }}>
              <div>
                <p className="font-rajdhani font-semibold text-white text-sm">{pref.label}</p>
                <p className="text-xs text-leaf-300/50 font-inter mt-0.5">{pref.desc}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                style={{ background: pref.enabled ? 'linear-gradient(135deg, #00FF87, #00D4FF)' : 'rgba(15,45,28,0.8)' }}
                onClick={() => toast('Preferences saved!')}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ left: pref.enabled ? '26px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-500" />
          Account Security
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.08)' }}>
            <div>
              <p className="font-rajdhani font-semibold text-white text-sm">Member Since</p>
              <p className="text-xs text-leaf-300/50 font-inter mt-0.5">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <Leaf className="w-5 h-5 text-neon-500" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.08)' }}>
            <div>
              <p className="font-rajdhani font-semibold text-white text-sm">Account Status</p>
              <p className="text-xs text-neon-500 font-rajdhani mt-0.5">✓ Active & Verified</p>
            </div>
            <CheckCircle className="w-5 h-5 text-neon-500" />
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-6"
        style={{ borderColor: 'rgba(248,113,113,0.15)' }}
      >
        <h3 className="font-orbitron font-bold text-red-400 mb-4">Danger Zone</h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-rajdhani font-semibold tracking-wider text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out of LeafScan
        </motion.button>
      </motion.div>
    </div>
  )
}
