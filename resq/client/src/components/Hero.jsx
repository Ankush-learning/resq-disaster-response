import { useRef, useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { AlertTriangle, Map, Shield, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Globe from './Globe'

const LiveStat = ({ value, label, color }) => {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    const target = parseInt(value)
    const step = Math.ceil(target / 50)
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setDisplayed(cur)
      if (cur >= target) clearInterval(t)
    }, 30)
    return () => clearInterval(t)
  }, [value])
  const colors = { cyan:'text-cyan-400', green:'text-green-400', orange:'text-orange-400' }
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-display font-bold text-2xl tabular-nums ${colors[color]}`}>{displayed.toLocaleString()}</span>
      <span className="font-body text-xs text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  )
}

const FloatingAlert = ({ top, left, right, bottom, type, text, delay }) => {
  const icons = { critical:'🔴', warning:'🟡', info:'🔵', success:'🟢' }
  const colors = {
    critical:'border-red-500/30 bg-red-500/5', warning:'border-orange-500/30 bg-orange-500/5',
    info:'border-cyan-500/30 bg-cyan-500/5', success:'border-green-500/30 bg-green-500/5',
  }
  return (
    <motion.div
      initial={{ opacity:0, x: left !== undefined ? -20 : 20, scale:0.9 }}
      animate={{ opacity:1, x:0, scale:1 }}
      transition={{ delay, duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ top, left, right, bottom }}
      className={`absolute glass border ${colors[type]} rounded-xl px-4 py-3 flex items-center gap-3 min-w-[190px] z-20`}
    >
      <motion.div animate={{ scale:[1,1.2,1] }} transition={{ repeat:Infinity, duration:2, delay }}
        className="text-lg shrink-0">{icons[type]}</motion.div>
      <div>
        <p className="text-xs font-body font-medium text-slate-200 leading-tight">{text}</p>
        <p className="text-xs font-mono text-slate-500 mt-0.5">just now</p>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const containerRef = useRef(null)
  const springX = useSpring(0, { stiffness:60, damping:20 })
  const springY = useSpring(0, { stiffness:60, damping:20 })

  useEffect(() => {
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      mouseX.current = x
      mouseY.current = y
      springX.set(x / 2)
      springY.set(y / 2)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [springX, springY])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-visible"
      style={{ background:'linear-gradient(135deg, #020817 0%, #0a0f2e 40%, #040c1e 100%)' }}
    >
      {/* Nebula */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background:'radial-gradient(circle, #0ea5e9, #0c4a6e 40%, transparent 70%)', top:'-200px', right:'-200px', filter:'blur(80px)' }}/>
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background:'radial-gradient(circle, #4338ca, transparent 70%)', bottom:'-100px', left:'-100px', filter:'blur(80px)' }}/>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage:'linear-gradient(#22d3ee 1px,transparent 1px),linear-gradient(90deg,#22d3ee 1px,transparent 1px)', backgroundSize:'60px 60px' }}/>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-32">

          {/* LEFT */}
          <div className="order-2 lg:order-1">
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="section-tag">
                <motion.div animate={{ scale:[1,1.4,1] }} transition={{ repeat:Infinity, duration:1.5 }}
                  className="w-2 h-2 rounded-full bg-red-400"/>
                LIVE SYSTEM
              </div>
              <span className="font-mono text-xs text-slate-500">v2.4.1 · Active</span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.35, duration:0.8, ease:[0.16,1,0.3,1] }}
              className="font-display font-black text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-white">Disaster</span>{' '}
              <span className="gradient-text">Response</span>
              <br/>
              <span className="text-white">& Relief</span>
              <br/>
              <span className="text-white/70 text-4xl lg:text-5xl font-bold">Coordination System</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              className="font-body text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Real-time coordination. Faster response.{' '}
              <span className="text-cyan-400 font-semibold">Saving lives.</span>{' '}
              Connect citizens, volunteers, and authorities in the moments that matter most.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                <Link to="/report" className="btn-danger flex items-center gap-2 text-sm">
                  <AlertTriangle size={18}/> Report Emergency
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                <Link to="/map" className="btn-secondary flex items-center gap-2 text-sm">
                  <Map size={18}/> View Live Map
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                <Link to="/dashboard" className="btn-secondary flex items-center gap-2 text-sm">
                  <Shield size={18}/> Authority Hub
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}
              className="glass rounded-2xl p-5 inline-flex gap-8 divide-x divide-white/10"
            >
              <LiveStat value={1247} label="Incidents Tracked" color="cyan"/>
              <div className="pl-8"><LiveStat value={382} label="Volunteers Active" color="green"/></div>
              <div className="pl-8"><LiveStat value={94} label="Lives Saved" color="orange"/></div>
            </motion.div>
          </div>

          {/* RIGHT — Globe */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center h-[500px] lg:h-[680px]" style={{ overflow:'visible' }}>
            <motion.div
              initial={{ opacity:0, scale:0.7 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.3, duration:1.2, ease:[0.16,1,0.3,1] }}
              style={{ width:'100%', height:'100%', overflow:'visible' }}
            >
              <Globe mouseX={mouseX} mouseY={mouseY}/>
            </motion.div>

            <FloatingAlert top="15%" left="-2%" type="critical" text="M6.2 Earthquake · Turkey" delay={1.2}/>
            <FloatingAlert top="40%" right="-2%" type="warning" text="Flash flood · India" delay={1.5}/>
            <FloatingAlert top="70%" left="5%" type="success" text="Rescue complete · Japan" delay={1.8}/>
            <FloatingAlert top="8%" right="5%" type="info" text="Shelter open · Bangladesh" delay={2.1}/>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.4 }}
              className="absolute bottom-14 right-0 font-mono text-xs text-slate-600 text-right"
            >
              <div>28.6139° N, 77.2090° E</div>
              <div className="flex items-center justify-end gap-1 mt-1">
                <motion.div animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:2 }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400"/>
                <span className="text-green-400">MONITORING ACTIVE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => window.scrollTo({ top:window.innerHeight, behavior:'smooth' })}
      >
        <span className="font-mono text-xs text-slate-600 tracking-widest">EXPLORE</span>
        <motion.div animate={{ y:[0,6,0] }} transition={{ repeat:Infinity, duration:1.5 }}>
          <ChevronDown size={18} className="text-slate-600"/>
        </motion.div>
      </motion.div>
    </section>
  )
}
