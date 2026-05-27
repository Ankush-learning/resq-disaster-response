import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function Globe({ mouseX, mouseY }) {
  const [rotation, setRotation] = useState(0)
  const [tilt, setTilt] = useState(-10)
  const rotRef = useRef(0)
  const tiltRef = useRef(-10)
  const animRef = useRef(null)
  const autoAngle = useRef(0)

  useEffect(() => {
    const animate = () => {
      autoAngle.current += 0.12
      const mx = (mouseX?.current || 0) * 55
      const my = (mouseY?.current || 0) * 12
      const targetRot = autoAngle.current + mx
      const targetTilt = -10 + my
      rotRef.current += (targetRot - rotRef.current) * 0.05
      tiltRef.current += (targetTilt - tiltRef.current) * 0.05
      setRotation(rotRef.current)
      setTilt(tiltRef.current)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const texOffset = ((rotation % 360) + 360) % 360
  const cloudOffset = ((rotation * 0.6) % 360 + 360) % 360

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
      <div style={{ position: 'relative', width: 400, height: 400, overflow: 'visible' }}>

        {/* Glow behind globe */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 480, height: 480,
          marginTop: -240, marginLeft: -240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 65%)',
          filter: 'blur(20px)', pointerEvents: 'none',
        }}/>

        {/* Orbital rings */}
        {[
          { w: 480, tX: 70, tZ: 15, color: '#22d3ee', op: 0.3, dur: 8 },
          { w: 530, tX: 110, tZ: 40, color: '#f97316', op: 0.2, dur: 13 },
          { w: 580, tX: 50, tZ: -25, color: '#818cf8', op: 0.15, dur: 18 },
        ].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: r.w, height: r.w,
            marginTop: -r.w / 2, marginLeft: -r.w / 2,
            borderRadius: '50%',
            border: `1px solid ${r.color}`,
            opacity: r.op,
            transform: `rotateX(${r.tX}deg) rotateZ(${r.tZ}deg)`,
            pointerEvents: 'none',
          }}>
            {/* Satellite dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: r.dur, repeat: Infinity, ease: 'linear' }}
              style={{ width: '100%', height: '100%', borderRadius: '50%', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', top: -5, left: '50%', marginLeft: -5,
                width: 10, height: 10, borderRadius: '50%',
                background: r.color, boxShadow: `0 0 10px ${r.color}`,
              }}/>
            </motion.div>
          </div>
        ))}

        {/* Globe sphere */}
        <div style={{
          width: 400, height: 400, borderRadius: '50%',
          overflow: 'hidden', position: 'relative',
          transform: `rotateX(${tilt}deg)`,
          boxShadow: `
            0 0 80px rgba(34,211,238,0.15),
            inset -50px -25px 100px rgba(0,0,0,0.7),
            inset 25px 12px 50px rgba(34,211,238,0.04)
          `,
        }}>
          {/* Ocean */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 45%, #075985 75%, #0c3a5a 100%)',
          }}/>

          {/* Continents - scrolling SVG */}
          <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"
            style={{
              position: 'absolute', top: 0, width: '200%', height: '100%',
              transform: `translateX(-${(texOffset / 360) * 50}%)`,
            }}
          >
            {/* North America */}
            <ellipse cx="130" cy="130" rx="65" ry="52" fill="#16a34a"/>
            <ellipse cx="115" cy="118" rx="42" ry="33" fill="#22c55e"/>
            <ellipse cx="148" cy="165" rx="38" ry="28" fill="#15803d"/>
            <ellipse cx="140" cy="200" rx="22" ry="18" fill="#16a34a"/>
            {/* Greenland */}
            <ellipse cx="230" cy="72" rx="26" ry="18" fill="#bfdbfe"/>
            {/* South America */}
            <ellipse cx="195" cy="268" rx="42" ry="66" fill="#15803d"/>
            <ellipse cx="190" cy="310" rx="28" ry="48" fill="#14532d"/>
            {/* Europe */}
            <ellipse cx="398" cy="108" rx="42" ry="33" fill="#16a34a"/>
            <ellipse cx="415" cy="122" rx="28" ry="22" fill="#22c55e"/>
            {/* Africa */}
            <ellipse cx="415" cy="228" rx="52" ry="76" fill="#15803d"/>
            <ellipse cx="410" cy="258" rx="38" ry="56" fill="#166534"/>
            <ellipse cx="428" cy="208" rx="32" ry="18" fill="#d97706" opacity="0.75"/>
            {/* Middle East */}
            <ellipse cx="468" cy="168" rx="28" ry="22" fill="#d97706" opacity="0.65"/>
            {/* Asia */}
            <ellipse cx="548" cy="112" rx="95" ry="56" fill="#16a34a"/>
            <ellipse cx="578" cy="138" rx="65" ry="42" fill="#15803d"/>
            <ellipse cx="528" cy="92" rx="55" ry="32" fill="#22c55e"/>
            {/* Siberia snow */}
            <ellipse cx="560" cy="68" rx="55" ry="22" fill="#e2e8f0" opacity="0.4"/>
            {/* Southeast Asia */}
            <ellipse cx="635" cy="188" rx="42" ry="28" fill="#16a34a"/>
            <ellipse cx="655" cy="205" rx="28" ry="20" fill="#22c55e"/>
            {/* Japan */}
            <ellipse cx="678" cy="132" rx="10" ry="20" fill="#16a34a"/>
            {/* Australia */}
            <ellipse cx="662" cy="305" rx="52" ry="36" fill="#d97706"/>
            <ellipse cx="650" cy="298" rx="32" ry="24" fill="#b45309"/>
            {/* Antarctica */}
            <rect x="0" y="375" width="800" height="25" fill="#e2e8f0" rx="4" opacity="0.8"/>
            {/* City lights */}
            {[[130,145],[195,175],[268,165],[398,125],[435,180],[552,145],[612,162],[678,142],[652,312],[192,278]].map(([x,y],i)=>(
              <g key={i}>
                <circle cx={x} cy={y} r="2.5" fill="rgba(34,211,238,0.95)"/>
                <circle cx={x} cy={y} r="6" fill="rgba(34,211,238,0.2)"/>
              </g>
            ))}

            {/* === REPEAT for seamless scroll === */}
            <ellipse cx="930" cy="130" rx="65" ry="52" fill="#16a34a"/>
            <ellipse cx="915" cy="118" rx="42" ry="33" fill="#22c55e"/>
            <ellipse cx="948" cy="165" rx="38" ry="28" fill="#15803d"/>
            <ellipse cx="1030" cy="72" rx="26" ry="18" fill="#bfdbfe"/>
            <ellipse cx="995" cy="268" rx="42" ry="66" fill="#15803d"/>
            <ellipse cx="1198" cy="108" rx="42" ry="33" fill="#16a34a"/>
            <ellipse cx="1215" cy="228" rx="52" ry="76" fill="#15803d"/>
            <ellipse cx="1228" cy="208" rx="32" ry="18" fill="#d97706" opacity="0.75"/>
            <ellipse cx="1348" cy="112" rx="95" ry="56" fill="#16a34a"/>
            <ellipse cx="1378" cy="138" rx="65" ry="42" fill="#15803d"/>
            <ellipse cx="1435" cy="188" rx="42" ry="28" fill="#16a34a"/>
            <ellipse cx="1478" cy="132" rx="10" ry="20" fill="#16a34a"/>
            <ellipse cx="1462" cy="305" rx="52" ry="36" fill="#d97706"/>
            <rect x="800" y="375" width="800" height="25" fill="#e2e8f0" rx="4" opacity="0.8"/>
          </svg>

          {/* Cloud layer */}
          <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"
            style={{
              position: 'absolute', top: 0, width: '200%', height: '100%',
              opacity: 0.4,
              transform: `translateX(-${(cloudOffset / 360) * 50}%)`,
            }}
          >
            {[[95,75,52,22],[242,58,65,18],[365,95,58,20],[488,72,75,26],[605,52,62,22],[718,88,52,18],
              [142,292,65,22],[392,315,58,20],[588,282,72,26],[895,75,52,22],[1042,58,65,18],[1165,95,58,20],
              [1288,72,75,26],[1405,52,62,22],[1518,88,52,18]
            ].map(([x,y,rx,ry],i)=>(
              <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="white"/>
            ))}
          </svg>

          {/* Sunlight shimmer */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 32%, rgba(255,255,255,0.07) 0%, transparent 48%)', pointerEvents:'none' }}/>
          {/* Night shadow */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 78% 68%, rgba(0,0,0,0.6) 0%, transparent 52%)', pointerEvents:'none' }}/>
        </div>

        {/* Outer atmosphere ring */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          width:420, height:420, marginTop:-210, marginLeft:-210,
          borderRadius:'50%',
          boxShadow:'0 0 40px rgba(34,211,238,0.18), inset 0 0 40px rgba(34,211,238,0.06)',
          pointerEvents:'none',
        }}/>
      </div>
    </div>
  )
}
