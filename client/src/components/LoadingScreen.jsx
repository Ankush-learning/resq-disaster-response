import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CartoonEarth = () => (
  <motion.svg width="190" height="190" viewBox="0 0 190 190"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    style={{ filter: 'drop-shadow(0 0 28px rgba(34,211,238,0.5))' }}
  >
    <circle cx="95" cy="95" r="84" fill="#0369a1"/>
    <ellipse cx="70" cy="70" rx="30" ry="24" fill="#16a34a"/>
    <ellipse cx="62" cy="64" rx="17" ry="13" fill="#22c55e"/>
    <ellipse cx="118" cy="80" rx="34" ry="26" fill="#15803d"/>
    <ellipse cx="132" cy="70" rx="18" ry="14" fill="#16a34a"/>
    <ellipse cx="84" cy="118" rx="22" ry="17" fill="#22c55e"/>
    <ellipse cx="95" cy="158" rx="40" ry="13" fill="#e2e8f0"/>
    <ellipse cx="112" cy="88" rx="11" ry="7" fill="#d97706" opacity="0.7"/>
    {/* Eyes */}
    <circle cx="76" cy="85" r="13" fill="white"/>
    <circle cx="114" cy="85" r="13" fill="white"/>
    <motion.circle cx="79" cy="88" r="6" fill="#1e1b4b"
      animate={{ cx:[79,81,77,79], cy:[88,86,89,88] }}
      transition={{ duration: 4, repeat: Infinity, ease:'easeInOut' }}
    />
    <motion.circle cx="117" cy="88" r="6" fill="#1e1b4b"
      animate={{ cx:[117,119,115,117], cy:[88,86,89,88] }}
      transition={{ duration: 4, repeat: Infinity, ease:'easeInOut', delay:0.5 }}
    />
    <circle cx="77" cy="85" r="2.5" fill="white"/>
    <circle cx="115" cy="85" r="2.5" fill="white"/>
    {/* Smile */}
    <path d="M 74 108 Q 95 124 116 108" stroke="#1e1b4b" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    {/* Cheeks */}
    <ellipse cx="64" cy="106" rx="10" ry="6.5" fill="#f97316" opacity="0.5"/>
    <ellipse cx="126" cy="106" rx="10" ry="6.5" fill="#f97316" opacity="0.5"/>
    {/* Outline */}
    <circle cx="95" cy="95" r="84" fill="none" stroke="#22d3ee" strokeWidth="3"/>
    <circle cx="95" cy="95" r="90" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.25"/>
  </motion.svg>
)

const FloatingCard = ({ icon, text, color, delay, style }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
    transition={{
      scale: { delay, duration: 0.5, ease: [0.16,1,0.3,1] },
      opacity: { delay, duration: 0.5 },
      y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 }
    }}
    style={{
      position: 'absolute', display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 12,
      background: `${color}18`, border: `2px solid ${color}55`,
      backdropFilter: 'blur(8px)', whiteSpace: 'nowrap', ...style
    }}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    <span style={{ color, fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{text}</span>
  </motion.div>
)

const steps = [
  { text: 'Booting ResQ systems...', pct: 0 },
  { text: 'Connecting to disaster feeds...', pct: 25 },
  { text: 'Loading real-time incident data...', pct: 55 },
  { text: 'Calibrating response network...', pct: 80 },
  { text: 'All systems operational ✓', pct: 100 },
]

export default function LoadingScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => setStep(i), i * 650))
    const exitTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 700)
    }, steps.length * 650 + 300)
    return () => { timers.forEach(clearTimeout); clearTimeout(exitTimer) }
  }, [onComplete])

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: `${(i * 17.3) % 100}%`, y: `${(i * 13.7) % 100}%`,
    size: (i % 3) + 1, delay: (i % 10) * 0.3,
  }))

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.7 }}
          style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 50% 40%, #0d1540 0%, #020817 70%)', overflow:'hidden' }}
        >
          {/* Stars */}
          {stars.map(s => (
            <motion.div key={s.id}
              style={{ position:'absolute', left:s.x, top:s.y, width:s.size, height:s.size, borderRadius:'50%', background:'white' }}
              animate={{ opacity:[0.1,0.9,0.1] }}
              transition={{ duration:2+s.delay, repeat:Infinity, delay:s.delay }}
            />
          ))}

          {/* Nebula glow */}
          <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(34,211,238,0.07), transparent 60%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', filter:'blur(40px)', pointerEvents:'none' }}/>

          {/* Scene */}
          <div style={{ position:'relative', width:500, height:380, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FloatingCard icon="🚨" text="M6.2 Earthquake · Turkey" color="#ef4444" delay={1.0} style={{ top:30, left:0 }}/>
            <FloatingCard icon="🌊" text="Flood warning · India" color="#f97316" delay={1.3} style={{ top:55, right:0 }}/>
            <FloatingCard icon="✅" text="Rescue complete · Japan" color="#22c55e" delay={1.6} style={{ bottom:70, left:10 }}/>
            <FloatingCard icon="🏠" text="Shelter open · Bangladesh" color="#22d3ee" delay={1.9} style={{ bottom:55, right:10 }}/>
            <CartoonEarth />
          </div>

          {/* Logo */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}
          >
            <div style={{ width:50, height:50, borderRadius:14, background:'linear-gradient(135deg,#22d3ee,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, boxShadow:'0 0 28px rgba(34,211,238,0.4)' }}>🆘</div>
            <div>
              <div style={{ fontFamily:'Syne', fontWeight:900, fontSize:38, color:'white', lineHeight:1, letterSpacing:'-1px' }}>
                Res<span style={{ color:'#22d3ee' }}>Q</span>
              </div>
              <div style={{ fontFamily:'JetBrains Mono', fontSize:10, color:'#64748b', letterSpacing:'0.18em', textTransform:'uppercase' }}>Disaster Response System</div>
            </div>
          </motion.div>

          {/* Progress */}
          <div style={{ width:280, marginBottom:14 }}>
            <div style={{ height:5, borderRadius:99, background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.2)', overflow:'hidden' }}>
              <motion.div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#22d3ee,#818cf8,#f97316)' }}
                animate={{ width:`${steps[step].pct}%` }} transition={{ duration:0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p key={step}
              initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
              transition={{ duration:0.3 }}
              style={{ fontFamily:'JetBrains Mono', fontSize:12, color:'#22d3ee', letterSpacing:'0.05em' }}
            >
              {steps[step].text}
            </motion.p>
          </AnimatePresence>

          <div style={{ display:'flex', gap:8, marginTop:18 }}>
            {steps.map((_,i) => (
              <motion.div key={i} style={{ width:7, height:7, borderRadius:'50%' }}
                animate={{ background: i<=step ? '#22d3ee' : 'rgba(34,211,238,0.18)', scale: i===step ? 1.4 : 1 }}
              />
            ))}
          </div>

          <p style={{ position:'absolute', bottom:18, fontFamily:'JetBrains Mono', fontSize:11, color:'#1e293b' }}>
            v2.4.1 · Real-time Disaster Coordination Platform
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
