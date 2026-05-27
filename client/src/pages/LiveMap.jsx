import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, AlertTriangle, X, Clock, Layers, RefreshCw, Wifi, WifiOff, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const severityColor = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' }
const magToSeverity = (m) => m >= 6.5 ? 'critical' : m >= 5.5 ? 'high' : m >= 4.5 ? 'medium' : 'low'

const shelters = [
  { id:'SH-01', lat:28.6, lng:77.2,   name:'Delhi Relief Camp',       capacity:500,  filled:340 },
  { id:'SH-02', lat:19.0, lng:72.8,   name:'Mumbai Aid Hub',           capacity:800,  filled:420 },
  { id:'SH-03', lat:22.6, lng:88.4,   name:'Kolkata Shelter',          capacity:300,  filled:120 },
  { id:'SH-04', lat:35.7, lng:139.7,  name:'Tokyo Emergency Centre',   capacity:2000, filled:850 },
  { id:'SH-05', lat:1.3,  lng:103.8,  name:'Singapore Aid Centre',     capacity:1000, filled:200 },
]

function getTimeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function LiveMap() {
  const svgRef    = useRef(null)
  const gRef      = useRef(null)   // group for zoom
  const projRef   = useRef(null)
  const zoomRef   = useRef(null)

  const [quakes,    setQuakes]    = useState([])
  const [world,     setWorld]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [lastFetch, setLastFetch] = useState(null)
  const [selected,  setSelected]  = useState(null)
  const [hovered,   setHovered]   = useState(null)
  const [tooltip,   setTooltip]   = useState({ visible:false, x:0, y:0, q:null })
  const [filterSev, setFilterSev] = useState('all')
  const [layers,    setLayers]    = useState({ earthquakes:true, shelters:true })
  const [online,    setOnline]    = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)

  // ── Fetch TopoJSON world atlas ─────────────────────────────────────────
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo => setWorld(topo))
      .catch(() => console.error('Failed to load world atlas'))
  }, [])

  // ── Fetch USGS earthquakes ─────────────────────────────────────────────
  const fetchQuakes = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
      const data = await res.json()
      const formatted = data.features.slice(0, 60).map(f => ({
        id:        f.id,
        magnitude: Math.round(f.properties.mag * 10) / 10,
        severity:  magToSeverity(f.properties.mag),
        location:  f.properties.place,
        lat:       f.geometry.coordinates[1],
        lng:       f.geometry.coordinates[0],
        depth:     Math.round(f.geometry.coordinates[2]),
        time:      new Date(f.properties.time).toLocaleString(),
        timeAgo:   getTimeAgo(f.properties.time),
        url:       f.properties.url,
        felt:      f.properties.felt,
      }))
      setQuakes(formatted)
      setLastFetch(new Date())
      setOnline(true)
    } catch {
      setOnline(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuakes()
    const iv = setInterval(fetchQuakes, 5 * 60 * 1000)
    return () => clearInterval(iv)
  }, [fetchQuakes])

  // ── Build D3 map ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!world || !svgRef.current) return

    const el    = svgRef.current
    const W     = el.clientWidth  || 900
    const H     = el.clientHeight || 500

    const svg = d3.select(el)
    svg.selectAll('*').remove()

    // Ocean background
    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#071428')

    const projection = d3.geoNaturalEarth1()
      .scale(W / 6.1)
      .translate([W / 2, H / 2])
    projRef.current = projection

    const path = d3.geoPath().projection(projection)
    const g    = svg.append('g')
    gRef.current = g

    // Graticule
    const graticule = d3.geoGraticule()()
    g.append('path')
      .datum(graticule)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(34,211,238,0.06)')
      .attr('stroke-width', 0.5)

    // Countries
    const countries = topojson.feature(world, world.objects.countries)
    g.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', path)
      .attr('fill', '#1a3a5c')
      .attr('stroke', 'rgba(34,211,238,0.22)')
      .attr('stroke-width', 0.5)
      .attr('stroke-linejoin', 'round')

    // Country borders
    g.append('path')
      .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(34,211,238,0.1)')
      .attr('stroke-width', 0.3)

    // Zoom behaviour
    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setZoomLevel(Math.round(event.transform.k * 10) / 10)
      })
    zoomRef.current = zoom
    svg.call(zoom)

  }, [world])

  // ── Overlay earthquake dots & shelters (re-runs on data / filter change) ─
  useEffect(() => {
    if (!gRef.current || !projRef.current) return

    const g    = gRef.current
    const proj = projRef.current

    // Remove previous overlays
    g.selectAll('.eq-layer').remove()
    g.selectAll('.shelter-layer').remove()

    const filtered = quakes.filter(q => filterSev === 'all' || q.severity === filterSev)

    // ── Earthquakes ────────────────────────────────────────────────────
    if (layers.earthquakes) {
      const eqG = g.append('g').attr('class', 'eq-layer')

      filtered.forEach(q => {
        const [px, py] = proj([q.lng, q.lat])
        const color  = severityColor[q.severity]
        const r      = q.severity === 'critical' ? 8 : q.severity === 'high' ? 6 : 5

        const dot = eqG.append('g')
          .attr('transform', `translate(${px},${py})`)
          .style('cursor', 'pointer')

        // Pulse ring for critical/high
        if (q.severity === 'critical' || q.severity === 'high') {
          const pulse = dot.append('circle')
            .attr('r', r)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.6)

          pulse.append('animate')
            .attr('attributeName', 'r')
            .attr('from', r).attr('to', r * 4)
            .attr('dur', '2.5s').attr('repeatCount', 'indefinite')

          pulse.append('animate')
            .attr('attributeName', 'opacity')
            .attr('from', 0.6).attr('to', 0)
            .attr('dur', '2.5s').attr('repeatCount', 'indefinite')
        }

        // Main dot
        dot.append('circle')
          .attr('r', r)
          .attr('fill', color)
          .attr('fill-opacity', 0.9)
          .attr('stroke', 'rgba(255,255,255,0.3)')
          .attr('stroke-width', 0.8)

        // Inner highlight
        dot.append('circle')
          .attr('r', r * 0.35)
          .attr('fill', 'white')
          .attr('opacity', 0.5)

        dot
          .on('mouseenter', function(event) {
            d3.select(this).select('circle').attr('r', r + 3)
            const svgRect = svgRef.current.getBoundingClientRect()
            setTooltip({ visible:true, x: event.clientX - svgRect.left, y: event.clientY - svgRect.top, q })
            setHovered(q.id)
          })
          .on('mouseleave', function() {
            d3.select(this).select('circle').attr('r', r)
            setTooltip(t => ({ ...t, visible:false }))
            setHovered(null)
          })
          .on('click', () => setSelected(prev => prev?.id === q.id ? null : q))
      })
    }

    // ── Shelters ───────────────────────────────────────────────────────
    if (layers.shelters) {
      const shG = g.append('g').attr('class', 'shelter-layer')

      shelters.forEach(s => {
        const [px, py] = proj([s.lng, s.lat])
        const sh = shG.append('g').attr('transform', `translate(${px},${py})`).style('cursor','pointer')

        sh.append('circle').attr('r', 9).attr('fill', 'rgba(34,197,94,0.15)').attr('stroke', '#22c55e').attr('stroke-width', 1.5)
        sh.append('text').attr('text-anchor','middle').attr('dominant-baseline','middle').attr('font-size', 10).attr('fill', '#22c55e').attr('font-weight','bold').text('+')
      })
    }

  }, [quakes, world, filterSev, layers])

  const filtered = quakes.filter(q => filterSev === 'all' || q.severity === filterSev)

  const zoomIn  = () => { if (svgRef.current && zoomRef.current) d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.6) }
  const zoomOut = () => { if (svgRef.current && zoomRef.current) d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.625) }
  const resetZoom = () => { if (svgRef.current && zoomRef.current) d3.select(svgRef.current).transition().call(zoomRef.current.transform, d3.zoomIdentity) }

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ background:'#020817' }}>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 glass">
        <div className="flex items-center gap-3">
          <div className="section-tag !mb-0">
            <motion.div animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.5 }}
              className="w-2 h-2 rounded-full bg-red-400"/>
            LIVE MAP
          </div>
          <span className="font-mono text-xs text-slate-500 hidden sm:block">
            {loading ? 'Fetching USGS data…' : `${filtered.length} earthquakes · USGS live feed`}
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
          <motion.button whileTap={{ rotate:180 }} transition={{ duration:0.4 }} onClick={fetchQuakes}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── Map canvas ─────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">

          {/* Loading overlay */}
          {(!world || loading) && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="glass rounded-2xl px-8 py-5 flex items-center gap-4">
                <RefreshCw size={18} className="animate-spin text-cyan-400"/>
                <span className="font-mono text-sm text-cyan-400">
                  {!world ? 'Loading world map…' : 'Fetching live earthquake data…'}
                </span>
              </div>
            </div>
          )}

          {/* D3 SVG */}
          <svg ref={svgRef} className="w-full h-full" style={{ display:'block' }}/>

          {/* Tooltip */}
          <AnimatePresence>
            {tooltip.visible && tooltip.q && (
              <motion.div
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                className="absolute glass rounded-xl p-3 pointer-events-none z-30 max-w-[220px]"
                style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
              >
                <p className="font-bold text-sm text-white">M{tooltip.q.magnitude} Earthquake</p>
                <p className="font-mono text-xs text-slate-400 mt-0.5 leading-snug">{tooltip.q.location}</p>
                <p className="font-mono text-xs text-slate-600 mt-1">Depth {tooltip.q.depth}km · {tooltip.q.timeAgo}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data source badge */}
          <div className="absolute top-4 right-4 glass rounded-xl px-3 py-2 flex items-center gap-2 z-10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="font-mono text-xs text-slate-400">USGS Real-time Feed</span>
            {lastFetch && <span className="font-mono text-xs text-slate-600">· {lastFetch.toLocaleTimeString()}</span>}
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
            <button onClick={zoomIn}  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"><ZoomIn  size={14}/></button>
            <button onClick={zoomOut} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"><ZoomOut size={14}/></button>
            {zoomLevel > 1.05 && (
              <button onClick={resetZoom} className="glass rounded-xl px-2 py-1 font-mono text-[10px] text-slate-500 hover:text-slate-300 transition-colors">Reset</button>
            )}
          </div>

          {/* Legend + layer controls */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-4 z-10">
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

        {/* ── Sidebar ────────────────────────────────────────────────── */}
        <div className="w-80 border-l border-white/5 hidden lg:flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400"/>
              Live Earthquakes
              <span className="ml-auto font-mono text-xs text-slate-500">{filtered.length}</span>
            </h3>

            {loading && !quakes.length && Array.from({length:6}).map((_,i) => (
              <div key={i} className="skeleton h-20 rounded-xl"/>
            ))}

            {filtered.map(q => (
              <motion.div key={q.id}
                onClick={() => setSelected(q.id===selected?.id ? null : q)}
                whileHover={{ x:3 }}
                className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  border:`1px solid ${selected?.id===q.id ? severityColor[q.severity]+'50' : 'rgba(255,255,255,0.05)'}`,
                  background: selected?.id===q.id ? `${severityColor[q.severity]}08` : 'rgba(13,21,64,0.4)'
                }}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="font-bold text-sm text-white">M{q.magnitude} Earthquake</p>
                    <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color:severityColor[q.severity] }}>{q.severity}</span>
                  </div>
                  <span className="font-black text-2xl" style={{ color:severityColor[q.severity], opacity:0.25 }}>{q.magnitude}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1 truncate">
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
                    <h4 className="font-bold text-white">M{selected.magnitude} Details</h4>
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
