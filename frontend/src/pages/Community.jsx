import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Heart, MessageCircle, Share2, Image,
  X, Send, Loader2, Tag, Search, TrendingUp
} from 'lucide-react'
import { API } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const MOCK_POSTS = [
  {
    id: 1,
    title: 'Successfully treated tomato late blight!',
    content: 'After using LeafScan to diagnose my tomatoes, I applied metalaxyl fungicide and the plants recovered within 2 weeks. Highly recommend early detection!',
    image_url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600',
    tags: 'tomato,disease,success',
    likes_count: 24,
    author: { username: 'FarmerJohn', full_name: 'John Mwangi', avatar_url: null },
    comments: [
      { id: 1, content: 'Great result! What concentration did you use?', author: { username: 'AgriPro' }, created_at: new Date(Date.now() - 3600000).toISOString() },
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    title: 'Corn gray leaf spot spreading fast — need advice',
    content: 'My corn field is showing signs of gray leaf spot. The lesions are rectangular and grayish. Has anyone dealt with this? What fungicides work best?',
    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600',
    tags: 'corn,disease,help',
    likes_count: 12,
    author: { username: 'CornFarmer', full_name: 'Alice Odhiambo', avatar_url: null },
    comments: [],
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    title: 'My apple orchard after proper pruning 🍎',
    content: 'Spent the whole weekend pruning my apple trees. The difference in air circulation is amazing. Hoping this reduces the apple scab problem we had last season.',
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600',
    tags: 'apple,pruning,orchard',
    likes_count: 38,
    author: { username: 'OrchardKing', full_name: 'Peter Kamau', avatar_url: null },
    comments: [],
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
]

function PostCard({ post, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [localLikes, setLocalLikes] = useState(post.likes_count)

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    setLocalLikes(l => l + 1)
    try {
      await API.post(`/community/posts/${post.id}/like`)
    } catch {
      setLiked(false)
      setLocalLikes(l => l - 1)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      await API.post(`/community/posts/${post.id}/comments`, { content: comment })
      setComment('')
      toast.success('Comment added!')
      onComment?.()
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const tags = post.tags?.split(',').filter(Boolean) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Author Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-dark-900 font-orbitron font-bold text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
        >
          {post.author?.username?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-rajdhani font-semibold text-white">{post.author?.full_name || post.author?.username}</p>
          <p className="text-xs text-leaf-300/40 font-rajdhani">
            @{post.author?.username} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <h3 className="font-orbitron font-bold text-white text-base mb-2">{post.title}</h3>
        <p className="text-leaf-300/70 font-inter text-sm leading-relaxed">{post.content}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-rajdhani"
                style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.2)' }}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-neon-500/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-rajdhani font-medium"
          style={{
            color: liked ? '#f87171' : 'rgba(129,199,132,0.6)',
            background: liked ? 'rgba(248,113,113,0.1)' : 'transparent',
          }}
        >
          <Heart className="w-4 h-4" fill={liked ? '#f87171' : 'none'} />
          <span>{localLikes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-rajdhani font-medium text-leaf-300/60 hover:text-neon-500 hover:bg-neon-500/10"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.length || 0}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-rajdhani font-medium text-leaf-300/60 hover:text-cyan-500 hover:bg-cyan-500/10"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neon-500/10 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {post.comments?.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-dark-900 font-bold text-xs flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
                    {c.author?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 bg-dark-800/50 rounded-xl px-3 py-2">
                    <p className="text-xs font-rajdhani font-semibold text-neon-500 mb-0.5">@{c.author?.username}</p>
                    <p className="text-sm text-leaf-300/80 font-inter">{c.content}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="input-field flex-1 py-2 text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}
                >
                  {submitting ? <Loader2 className="w-4 h-4 text-dark-900 animate-spin" /> : <Send className="w-4 h-4 text-dark-900" />}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CreatePostModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', content: '', tags: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content) { toast.error('Title and content are required'); return }
    setLoading(true)
    try {
      await API.post('/community/posts', form)
      toast.success('Post created!')
      onCreated()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron font-bold text-white text-xl">Create Post</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-leaf-300/60 hover:text-white hover:bg-dark-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="What's your post about?"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">Content *</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Share your farming experience, question, or tip..."
              rows={4}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-leaf-300/60 uppercase tracking-wider mb-2">
              <Tag className="w-3 h-3 inline mr-1" />Tags (comma-separated)
            </label>
            <input
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="tomato, disease, tips"
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-3">Cancel</button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-neon flex-1 py-3 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Posting...' : 'Post'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function Community() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await API.get('/community/posts')
      if (res.data.length > 0) setPosts(res.data)
    } catch {
      // Use mock data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-bold text-3xl gradient-text mb-1">Community</h1>
          <p className="text-leaf-300/60 font-inter text-sm">Connect with farmers worldwide</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="btn-neon flex items-center gap-2 py-2.5 px-5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Post
        </motion.button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Posts', value: posts.length, icon: TrendingUp, color: '#00FF87' },
          { label: 'Members', value: '1.2K', icon: Users, color: '#00D4FF' },
          { label: 'Active Today', value: '48', icon: Heart, color: '#f87171' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-3 flex items-center gap-3">
            <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
            <div>
              <div className="font-orbitron font-bold text-white text-lg leading-none">{stat.value}</div>
              <div className="text-xs text-leaf-300/50 font-rajdhani">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf-300/40" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts, tags..."
          className="input-field pl-11"
        />
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Users className="w-12 h-12 text-neon-500/30 mx-auto mb-3" />
            <p className="font-orbitron font-bold text-white mb-2">No posts found</p>
            <p className="text-leaf-300/50 font-inter text-sm">Be the first to share your farming experience!</p>
          </div>
        ) : (
          filtered.map((post, i) => (
            <PostCard key={post.id} post={post} onComment={fetchPosts} />
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreatePostModal onClose={() => setShowCreate(false)} onCreated={fetchPosts} />
        )}
      </AnimatePresence>
    </div>
  )
}
