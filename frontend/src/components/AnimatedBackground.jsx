import { motion } from 'framer-motion'

// Leaf SVG icon
const LeafIcon = ({ size = 24, color = '#00FF87' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"
      fill={color}
    />
  </svg>
)

// All random values pre-computed at module load — NEVER inside render/animate
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.3 + 0.1,
  xOffset: Math.random() * 16 - 8,   // number, not string
  yOffset: -(Math.random() * 20 + 15), // number, not string
}))

const LEAVES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 20 + 12,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 6,
  rotate: Math.random() * 360,
}))

export default function AnimatedBackground({ variant = 'default' }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

      {/* Base radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: variant === 'auth'
            ? 'radial-gradient(ellipse at 30% 50%, rgba(0,255,135,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.06) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 20% 80%, rgba(0,255,135,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Floating particles — all keyframes are pure numbers */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#00D4FF' : '#00FF87',
            boxShadow: `0 0 ${p.size * 3}px ${p.id % 3 === 0 ? 'rgba(0,212,255,0.6)' : 'rgba(0,255,135,0.6)'}`,
          }}
          animate={{
            y: [0, p.yOffset, 0],
            x: [0, p.xOffset, 0],
            opacity: [p.opacity, Math.min(p.opacity * 1.4, 0.9), p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating leaves — all keyframes are pure numbers */}
      {LEAVES.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{ left: `${leaf.x}%`, top: `${leaf.y}%` }}
          animate={{
            y: [0, -25, 0],
            rotate: [leaf.rotate, leaf.rotate + 15, leaf.rotate],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <LeafIcon size={leaf.size} color={leaf.id % 2 === 0 ? '#00FF87' : '#00D4FF'} />
        </motion.div>
      ))}

      {/* Glowing orb top-right */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Glowing orb bottom-left */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
          bottom: '-5%',
          left: '-5%',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Scan line — pure CSS animation (avoids Framer Motion unit-mixing error) */}
      <div
        className="absolute left-0 right-0 h-px animate-scan"
        style={{
          top: 0,
          background: 'linear-gradient(90deg, transparent, rgba(0,255,135,0.35), transparent)',
        }}
      />
    </div>
  )
}
