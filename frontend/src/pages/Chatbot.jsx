import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Loader2, User, Sparkles, Mic, MicOff } from 'lucide-react'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'

// LiAn Avatar SVG
function LiAnAvatar({ size = 'md', pulse = false }) {
  const s = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  return (
    <motion.div
      className={`${s} rounded-2xl flex items-center justify-center flex-shrink-0 relative`}
      style={{ background: 'linear-gradient(135deg, #00FF87 0%, #00D4FF 50%, #7c3aed 100%)', boxShadow: pulse ? '0 0 20px rgba(0,255,135,0.5)' : '0 0 12px rgba(0,255,135,0.3)' }}
      animate={pulse ? { boxShadow: ['0 0 12px rgba(0,255,135,0.3)', '0 0 28px rgba(0,255,135,0.6)', '0 0 12px rgba(0,255,135,0.3)'] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="font-orbitron font-black text-dark-900" style={{ fontSize: size === 'lg' ? '1.1rem' : size === 'sm' ? '0.6rem' : '0.75rem' }}>Li</span>
      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-500 border-2 border-dark-900" />
    </motion.div>
  )
}

// Simple markdown renderer
function MsgContent({ content }) {
  const lines = content.split('\n')
  return (
    <div className="text-sm space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-white mt-1">{line.replace(/\*\*/g, '')}</p>
        }
        if (line.match(/^[-•]\s/)) {
          const text = line.replace(/^[-•]\s/, '')
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-neon-500 flex-shrink-0 mt-0.5">▸</span>
              <span style={{ color: 'rgba(200,230,201,0.9)' }} dangerouslySetInnerHTML={{ __html: inlineFmt(text) }} />
            </div>
          )
        }
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\./)[1]
          const text = line.replace(/^\d+\.\s/, '')
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-neon-500 font-bold flex-shrink-0 w-5">{num}.</span>
              <span style={{ color: 'rgba(200,230,201,0.9)' }} dangerouslySetInnerHTML={{ __html: inlineFmt(text) }} />
            </div>
          )
        }
        return <p key={i} className="leading-relaxed" style={{ color: 'rgba(200,230,201,0.9)' }} dangerouslySetInnerHTML={{ __html: inlineFmt(line) }} />
      })}
    </div>
  )
}

function inlineFmt(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#00FF87">$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(0,255,135,0.1);padding:1px 4px;border-radius:4px;color:#00FF87;font-size:0.8em">$1</code>')
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <LiAnAvatar size="sm" />
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(10,31,20,0.9)', border: '1px solid rgba(0,255,135,0.15)' }}>
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-neon-500"
              animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Message({ msg, isNew }) {
  const isBot = msg.role === 'assistant'
  const time = msg.timestamp || msg.created_at
    ? new Date(msg.timestamp || msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot
        ? <LiAnAvatar size="sm" />
        : (
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 mb-1"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
            <User className="w-4 h-4 text-white" />
          </div>
        )
      }
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl font-inter ${isBot ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
        style={isBot ? {
          background: 'rgba(10,31,20,0.95)',
          border: '1px solid rgba(0,255,135,0.12)',
        } : {
          background: 'linear-gradient(135deg, rgba(0,255,135,0.18), rgba(0,212,255,0.12))',
          border: '1px solid rgba(0,255,135,0.3)',
          color: '#ffffff',
        }}>
        {isBot ? <MsgContent content={msg.content} /> : <p className="text-sm leading-relaxed text-white">{msg.content}</p>}
        {time && <p className="text-xs mt-1.5 font-rajdhani" style={{ color: 'rgba(129,199,132,0.3)' }}>{time}</p>}
      </div>
    </motion.div>
  )
}

const QUICK_QUESTIONS = [
  { emoji: '🍅', text: 'How do I treat tomato late blight?' },
  { emoji: '🌾', text: 'What diseases affect rice crops?' },
  { emoji: '🎋', text: 'How to manage sugarcane red rot?' },
  { emoji: '💧', text: 'How often should I water my crops?' },
  { emoji: '🐛', text: 'How do I control aphids organically?' },
  { emoji: '🌿', text: 'What fertilizer is best for potatoes?' },
]

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [lianStatus, setLianStatus] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    // Load chat history
    API.get('/chatbot/history')
      .then(res => {
        setMessages(res.data.map(m => ({ ...m, isNew: false })))
        setHistoryLoaded(true)
      })
      .catch(() => setHistoryLoaded(true))

    // Check LiAn engine status (Groq vs KB)
    API.get('/chatbot/status')
      .then(res => setLianStatus(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '48px'

    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString(), isNew: true }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setTyping(true)

    try {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 600))
      const res = await API.post('/chatbot/message', { message: msg })
      setTyping(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply,
        timestamp: res.data.timestamp,
        isNew: true,
      }])
    } catch {
      setTyping(false)
      toast.error('LiAn is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    try {
      await API.delete('/chatbot/history')
      setMessages([])
      toast.success('Conversation cleared')
    } catch {
      toast.error('Failed to clear conversation')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
      {/* Header */}
        <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <LiAnAvatar size="lg" pulse />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-black text-white text-2xl">LiAn</h2>
              <span className="text-xs font-rajdhani font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,255,135,0.15)', color: '#00FF87', border: '1px solid rgba(0,255,135,0.3)' }}>
                AI ASSISTANT
              </span>
              {lianStatus && (
                <span className="text-xs font-rajdhani font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: lianStatus.gemini ? 'rgba(0,212,255,0.15)' : lianStatus.groq ? 'rgba(124,58,237,0.2)' : 'rgba(251,191,36,0.1)',
                    color: lianStatus.gemini ? '#00D4FF' : lianStatus.groq ? '#a78bfa' : '#fbbf24',
                    border: `1px solid ${lianStatus.gemini ? 'rgba(0,212,255,0.4)' : lianStatus.groq ? 'rgba(124,58,237,0.4)' : 'rgba(251,191,36,0.3)'}`,
                  }}>
                  {lianStatus.gemini ? '✨ Gemini 2.5' : lianStatus.groq ? '⚡ Groq LLM' : '🧠 KB Engine'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
              <span className="text-xs text-neon-500 font-rajdhani tracking-widest">
                ONLINE • {lianStatus?.gemini ? 'GEMINI 2.5 FLASH POWERED' : lianStatus?.groq ? 'LLAMA3-70B POWERED' : 'AGRICULTURAL INTELLIGENCE'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={clearHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-rajdhani text-sm transition-all"
          style={{ color: 'rgba(248,113,113,0.6)', border: '1px solid rgba(248,113,113,0.1)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.6)'; e.currentTarget.style.background = 'transparent' }}>
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'rgba(5,13,10,0.85)', border: '1px solid rgba(0,255,135,0.1)' }}>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5">
          {/* Welcome Screen */}
          {messages.length === 0 && historyLoaded && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <LiAnAvatar size="lg" pulse />
              <div className="mt-5 mb-2">
                <h3 className="font-orbitron font-black text-white text-2xl mb-1">Hi! I am LiAn</h3>
                <p className="text-neon-500 font-rajdhani text-lg font-semibold">share me your problems</p>
              </div>
              <p className="text-leaf-300/60 font-inter text-sm max-w-md mx-auto mt-3 leading-relaxed">
                I'm your intelligent agricultural assistant. I can help with plant diseases, crop cultivation, fertilizers, pest management, weather impacts, and much more.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {QUICK_QUESTIONS.map(q => (
                  <motion.button key={q.text} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(q.text)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-rajdhani font-medium transition-all"
                    style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.15)', color: '#a7f3d0' }}>
                    <span className="mr-2">{q.emoji}</span>{q.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => <Message key={msg.id || i} msg={msg} isNew={msg.isNew} />)}
          </AnimatePresence>

          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 lg:p-5" style={{ borderColor: 'rgba(0,255,135,0.08)' }}>
          {messages.length > 0 && messages.length < 4 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {QUICK_QUESTIONS.slice(0, 3).map(q => (
                <button key={q.text} onClick={() => sendMessage(q.text)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full font-rajdhani flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: 'rgba(0,255,135,0.07)', border: '1px solid rgba(0,255,135,0.15)', color: '#86efac' }}>
                  {q.emoji} {q.text}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask LiAn about plant diseases, crop tips, fertilizers..."
                rows={1}
                className="w-full px-4 py-3 rounded-xl text-sm font-inter resize-none outline-none transition-all"
                style={{
                  minHeight: '48px', maxHeight: '120px',
                  background: 'rgba(10,31,20,0.8)',
                  border: '1px solid rgba(0,255,135,0.2)',
                  color: '#e8f5e9',
                  caretColor: '#00FF87',
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: input.trim() && !loading ? 'linear-gradient(135deg, #00FF87, #00D4FF)' : 'rgba(0,255,135,0.08)',
                boxShadow: input.trim() && !loading ? '0 0 20px rgba(0,255,135,0.4)' : 'none',
                border: '1px solid rgba(0,255,135,0.2)',
              }}>
              {loading
                ? <Loader2 className="w-5 h-5 text-dark-900 animate-spin" />
                : <Send className="w-5 h-5" style={{ color: input.trim() ? '#050D0A' : 'rgba(0,255,135,0.3)' }} />
              }
            </motion.button>
          </div>
          <p className="text-xs text-center mt-2 font-rajdhani" style={{ color: 'rgba(129,199,132,0.3)' }}>
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
