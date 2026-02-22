import { motion } from 'framer-motion'

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Outer ring */}
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full border-2 border-transparent`}
          style={{ borderTopColor: '#00FF87', borderRightColor: 'rgba(0,255,135,0.3)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: '#00D4FF', borderLeftColor: 'rgba(0,212,255,0.3)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-neon-500" />
        </motion.div>
      </div>

      {fullScreen && (
        <motion.p
          className="font-orbitron text-sm text-neon-500 tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          LEAFSCAN
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
        <div className="bg-grid absolute inset-0 opacity-30" />
        {spinner}
      </div>
    )
  }

  return spinner
}
