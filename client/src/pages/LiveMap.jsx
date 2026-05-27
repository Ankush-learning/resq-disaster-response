import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, AlertTriangle, X, Clock, Layers, RefreshCw, Wifi, WifiOff, ExternalLink } from 'lucide-react'

const geoToSvg = (lat, lng) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
})

const severityColor = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' }

const magToSeverity = (m) => m >= 6.5 ? 'critical' : m >= 5.5 ? 'high' : m >= 4.5 ? 'medium' : 'low'

const shelters = [
  { id:'SH-01', lat:28.6, lng:77.2, name:'Delhi Relief Camp', capacity:500, filled:340 },
  { id:'SH-02', lat:19.0, lng:72.8, name:'Mumbai Aid Hub', capacity:800, filled:420 },
  { id:'SH-03', lat:22.6, lng:88.4, name:'Kolkata Shelter', capacity:300, filled:120 },
  { id:'SH-04', lat:35.7, lng:139.7, name:'Tokyo Emergency Centre', capacity:2000, filled:850 },
  { id:'SH-05', lat:1.3, lng:103.8, name:'Singapore Aid Centre', capacity:1000, filled:200 },
]

const continentPaths = [
  { d:'M 95 95 L 130 75 L 185 80 L 215 105 L 220 145 L 200 180 L 165 195 L 150 215 L 135 225 L 120 215 L 108 195 L 98 172 L 83 148 L 88 120 Z' },
  { d:'M 150 215 L 165 195 L 178 215 L 172 238 L 156 242 Z' },
  { d:'M 188 248 L 222 238 L 258 252 L 272 295 L 263 355 L 238 388 L 212 372 L 192 332 L 178 292 L 180 268 Z' },
  { d:'M 428 68 L 482 58 L 522 76 L 512 102 L 492 118 L 460 112 L 444 96 Z' },
  { d:'M 438 152 L 492 142 L 542 158 L 548 212 L 532 272 L 512 322 L 492 342 L 462 328 L 440 278 L 428 222 L 428 182 Z' },
  { d:'M 512 55 L 625 45 L 752 52 L 822 68 L 802 102 L 742 112 L 682 108 L 622 118 L 565 112 L 530 92 Z' },
  { d:'M 518 132 L 572 122 L 602 142 L 592 172 L 558 182 L 520 168 Z' },
  { d:'M 602 152 L 662 142 L 702 162 L 712 202 L 682 232 L 642 238 L 612 212 L 596 188 Z' },
  { d:'M 712 178 L 762 162 L 802 172 L 822 202 L 802 228 L 762 232 L 720 212 Z' },
  { d:'M 732 298 L 802 288 L 852 302 L 862 348 L 842 378 L 792 388 L 742 368 L 718 338 L 722 312 Z' },
  { d:'M 820 112 L 836 102 L 849 112 L 841 132 L 822 130 Z' },
  { d:'M 433 72 L 448 65 L 456 78 L 446 90 L 434 86 Z' },
]

export default function LiveMap() {
  const [quakes, setQuakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState(null)
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [filterSev, setFilterSev] = useState('all')
  const [layers, setLayers] = useState({ earthquakes:true, shelters:true })
  const [online, setOnline] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
      const data = await res.json()
      const formatted = data.features.slice(0, 50).map(f => ({
        id: f.id,
        magnitude: Math.round(f.properties.mag * 10) / 10,
        severity: magToSeverity(f.properties.mag),
        location: f.properties.place,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        depth: Math.round(f.geometry.coordinates[2]),
        time: new Date(f.properties.time).toLocaleString(),
        timeAgo: getTimeAgo(f.properties.time),
        url: f.properties.url,
        felt: f.properties.felt,
        status: 'active',
      }))
      setQuakes(formatted)
      setLastFetch(new Date())
      setOnline(true)
    } catch {
      setOnline(false)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (ts) => {
    const mins = Math.floor((Date.now() - ts) / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filtered = quakes.filter(q => filterSev === 'all' || q.severity === filterSev)

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ background:'#020817' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 glass">
        <div className="flex items-center gap-3">
          <div className="section-tag !mb-0">
            <motion.div animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.5 }}
              className="w-2 h-2 rounded-full bg-red-400"/>
            LIVE MAP
          </div>
          <span className="font-mono text-xs text-slate-500 hidden sm:block">
            {loading ? 'Fetching USGS data...' : `${filtered.length} real earthquakes · USGS live feed`}
          </span>
          <span className={`flex items-center gap-1 font-mono text-xs ${online ? 'text-green-400' : 'text-red-400'}`}>
            {online ? <Wifi size={10}/> : <WifiOff size={10}/>}
            {online ? 'Live' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 p-1 glass rounded-xl">
            {['all','critical','high','medium','low'].map(s => (
              <button key={s} onClick={() => setFilterSev(s)}
                className={`font-mono text-xs px-3 py-1.5 rounded-lg capitalize transition-all ${filterSev===s ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}`}
              >{s}</button>
            ))}
          </div>
          <motion.button whileTap={{ rotate:180 }} transition={{ duration:0.4 }} onClick={fetchData}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:'linear-gradient(rgba(34,211,238,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,1) 1px,transparent 1px)', backgroundSize:'50px 50px' }}/>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="glass rounded-2xl px-8 py-5 flex items-center gap-4">
                <RefreshCw size={18} className="animate-spin text-cyan-400"/>
                <span className="font-mono text-sm text-cyan-400">Fetching live earthquake data from USGS...</span>
              </div>
            </div>
          )}

          <svg viewBox="0 0 1000 500" className="w-full h-full"
            style={{ background:'radial-gradient(ellipse at 50% 40%, #071428 0%, #020817 100%)' }}
          >
            {/* Grid */}
            {[-60,-30,0,30,60].map(lat => {
              const y = ((90-lat)/180)*500
              return <line key={lat} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(34,211,238,0.05)" strokeWidth="0.5"/>
            })}
            {[-120,-60,0,60,120].map(lng => {
              const x = ((lng+180)/360)*1000
              return <line key={lng} x1={x} y1="0" x2={x} y2="500" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5"/>
            })}

            {/* Continents */}
            {continentPaths.map((p,i) => (
              <path key={i} d={p.d} fill="#1a3a5c" stroke="rgba(34,211,238,0.2)" strokeWidth="0.8"/>
            ))}

            {/* Tectonic plate hints */}
            <path d="M 800 80 Q 840 150 820 240 Q 800 300 780 250" fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="2" strokeDasharray="8,5"/>
            <path d="M 550 70 Q 680 85 740 160 Q 710 210 650 190" fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="2" strokeDasharray="8,5"/>

            {/* Shelters */}
            {layers.shelters && shelters.map(s => {
              const pos = geoToSvg(s.lat, s.lng)
              return (
                <g key={s.id} title={s.name}>
                  <circle cx={pos.x} cy={pos.y} r="7" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
                  <text x={pos.x} y={pos.y+1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#22c55e" fontWeight="bold">+</text>
                </g>
              )
            })}

            {/* Earthquake dots */}
            {layers.earthquakes && filtered.map(q => {
              const pos = geoToSvg(q.lat, q.lng)
              const color = severityColor[q.severity]
              const r = q.severity === 'critical' ? 7 : q.severity === 'high' ? 6 : 5
              const isSelected = selected?.id === q.id

              return (
                <g key={q.id} style={{ cursor:'pointer' }}
                  onClick={() => setSelected(q.id === selected?.id ? null : q)}
                  onMouseEnter={() => setHovered(q.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {(q.severity === 'critical' || q.severity === 'high') && (
                    <circle cx={pos.x} cy={pos.y} r={r} fill="none" stroke={color} strokeWidth="1" opacity="0.4">
                      <animate attributeName="r" from={r} to={r*3.5} dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  <circle cx={pos.x} cy={pos.y}
                    r={isSelected || hovered === q.id ? r+2.5 : r}
                    fill={color} opacity={0.9}
                    style={{ transition:'r 0.2s' }}
                  />
                  <circle cx={pos.x} cy={pos.y} r="2" fill="white" opacity="0.6"/>
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r={r+6} fill="none" stroke={color} strokeWidth="2" opacity="0.5"/>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hovered && (() => {
              const q = quakes.find(i => i.id === hovered)
              return q ? (
                <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  className="absolute top-4 left-4 glass rounded-xl p-3 pointer-events-none z-10"
                >
                  <p className="font-display font-bold text-sm text-white">M{q.magnitude} Earthquake</p>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">{q.location}</p>
                  <p className="font-mono text-xs text-slate-600">Depth: {q.depth}km · {q.timeAgo}</p>
                </motion.div>
              ) : null
            })()}
          </AnimatePresence>

          {/* Data source badge */}
          <div className="absolute top-4 right-4 glass rounded-xl px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="font-mono text-xs text-slate-400">USGS Real-time Feed</span>
            {lastFetch && <span className="font-mono text-xs text-slate-600">· {lastFetch.toLocaleTimeString()}</span>}
          </div>

          {/* Layer controls */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-4">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers size={10}/> Layers
            </p>
            {Object.entries(layers).map(([k,v]) => (
              <button key={k} onClick={() => setLayers(l => ({ ...l,[k]:!l[k] }))}
                className={`flex items-center gap-2 font-mono text-xs capitalize w-full mb-1 transition-colors ${v ? 'text-cyan-400' : 'text-slate-600'}`}
              >
                <div className={`w-3 h-3 rounded-sm border transition-all ${v ? 'bg-cyan-500/30 border-cyan-500' : 'border-slate-700'}`}/>
                {k}
              </button>
            ))}
            <div className="divider mt-2 mb-2"/>
            {Object.entries(severityColor).map(([s,c]) => (
              <div key={s} className="flex items-center gap-2 font-mono text-xs capitalize text-slate-500 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background:c }}/>
                M{s==='critical'?'6.5+':s==='high'?'5.5+':s==='medium'?'4.5+':'<4.5'} — {s}
              </div>
            ))}
            <div className="flex items-center gap-2 font-mono text-xs text-green-400 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"/>Relief Shelter
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-white/5 hidden lg:flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400"/>
              Live Earthquakes
              <span className="ml-auto font-mono text-xs text-slate-500">{filtered.length}</span>
            </h3>

            {loading && Array.from({length:6}).map((_,i) => (
              <div key={i} className="skeleton h-20 rounded-xl"/>
            ))}

            {!loading && filtered.map(q => (
              <motion.div key={q.id}
                onClick={() => setSelected(q.id===selected?.id ? null : q)}
                whileHover={{ x:3 }}
                className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{ border:`1px solid ${selected?.id===q.id ? severityColor[q.severity]+'50' : 'rgba(255,255,255,0.05)'}`, background: selected?.id===q.id ? `${severityColor[q.severity]}08` : 'rgba(13,21,64,0.4)' }}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="font-display font-bold text-sm text-white">M{q.magnitude} Earthquake</p>
                    <span className="font-mono text-[10px] capitalize" style={{ color:severityColor[q.severity] }}>{q.severity}</span>
                  </div>
                  <span className="font-display font-black text-2xl" style={{ color:severityColor[q.severity], opacity:0.25 }}>{q.magnitude}</span>
                </div>
                <p className="font-body text-xs text-slate-500 mb-1 flex items-center gap-1 truncate">
                  <MapPin size={9}/> {q.location}
                </p>
                <div className="flex justify-between font-mono text-xs text-slate-600">
                  <span>Depth: {q.depth}km</span>
                  <span className="flex items-center gap-1"><Clock size={9}/>{q.timeAgo}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                className="border-t border-white/5 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-bold text-white">M{selected.magnitude} Details</h4>
                    <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white"><X size={16}/></button>
                  </div>
                  <div className="space-y-2 font-mono text-xs mb-4">
                    <div className="flex justify-between gap-2"><span className="text-slate-500">Location</span><span className="text-slate-300 text-right">{selected.location}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Magnitude</span><span className="text-white font-bold">{selected.magnitude}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Depth</span><span className="text-slate-300">{selected.depth} km</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="text-slate-300">{selected.timeAgo}</span></div>
                    {selected.felt && <div className="flex justify-between"><span className="text-slate-500">Felt reports</span><span className="text-slate-300">{selected.felt}</span></div>}
                  </div>
                  <div className="flex gap-2">
                    <Link to="/report" className="btn-danger flex-1 text-xs !py-2.5 text-center">Report Impact</Link>
                    {selected.url && (
                      <a href={selected.url} target="_blank" rel="noopener noreferrer"
                        className="btn-secondary flex-1 text-xs !py-2.5 flex items-center justify-center gap-1"
                      >USGS <ExternalLink size={10}/></a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
