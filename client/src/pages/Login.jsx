import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Mail, Lock, User, Eye, EyeOff, Loader2, Shield, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const roles = [
  { value: 'citizen', label: 'Citizen', icon: User, desc: 'Report emergencies' },
  { value: 'volunteer', label: 'Volunteer', icon: Users, desc: 'Assist response teams' },
  { value: 'authority', label: 'Authority', icon: Shield, desc: 'Manage operations' },
]

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('citizen')
  const [form, setForm] = useState({ email: '', password: '', name: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    // Would navigate to dashboard on success
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-24 relative"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #0d1540 0%, #020817 60%)' }}
    >
      {/* BG decoration */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #22d3ee, transparent 60%)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-8 w-full max-w-md"
        style={{ border: '1px solid rgba(34,211,238,0.15)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white">
            Res<span className="text-cyan-400">Q</span>
          </span>
        </div>

        {/* Tab toggle */}
        <div className="flex p-1 glass rounded-xl mb-6">
          {['Sign In', 'Register'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setIsLogin(i === 0)}
              className={`flex-1 py-2.5 rounded-lg font-display font-semibold text-sm transition-all duration-200 ${
                isLogin === (i === 0)
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="font-body text-sm text-slate-400 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="Your full name"
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="font-body text-sm text-slate-400 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-body text-sm text-slate-400 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pl-10 pr-12"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="font-body text-sm text-slate-400 mb-3 block">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => {
                  const Icon = r.icon
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                        role === r.value
                          ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                          : 'border-white/10 bg-white/[0.02] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Icon size={18} className="mx-auto mb-1.5" />
                      <div className="font-display font-semibold text-xs">{r.label}</div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <p className="font-body text-sm text-slate-600 text-center mt-5">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:text-cyan-300">
            {isLogin ? 'Register' : 'Sign in'}
          </button>
        </p>

        <div className="divider mt-6 mb-5" />
        <p className="font-mono text-xs text-slate-600 text-center">
          Protected by JWT authentication + rate limiting
        </p>
      </motion.div>
    </div>
  )
}
