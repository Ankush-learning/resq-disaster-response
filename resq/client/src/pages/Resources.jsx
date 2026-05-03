import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, MapPin, Filter } from 'lucide-react'

const mockResources = [
  { id:1, label:'Food Supplies', qty:'12,400 kg', status:'Available', color:'#22c55e', category:'food', org:'Red Cross India' },
  { id:2, label:'Medical Kits', qty:'840 units', status:'Partially Used', color:'#f97316', category:'medicine', org:'WHO India' },
  { id:3, label:'Blankets', qty:'3,200 units', status:'Available', color:'#22d3ee', category:'clothing', org:'NDRF' },
  { id:4, label:'Water Purifiers', qty:'156 units', status:'Critical Low', color:'#ef4444', category:'water', org:'UNICEF' },
  { id:5, label:'Tents', qty:'520 units', status:'Available', color:'#22c55e', category:'shelter', org:'Army Relief' },
  { id:6, label:'Generators', qty:'48 units', status:'In Use', color:'#eab308', category:'equipment', org:'NDRF' },
  { id:7, label:'Rescue Boats', qty:'32 units', status:'Deployed', color:'#f97316', category:'vehicles', org:'Coast Guard' },
  { id:8, label:'Search Dogs', qty:'12 teams', status:'Available', color:'#22c55e', category:'personnel', org:'NDRF K9' },
  { id:9, label:'Ambulances', qty:'28 units', status:'In Use', color:'#eab308', category:'vehicles', org:'108 Services' },
]

export default function Resources() {
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filtered = filter === 'all' ? mockResources : mockResources.filter(r => r.category === filter)

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background:'#020817' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="section-tag w-fit mb-3"><Package size={12}/> RESOURCE NETWORK</div>
            <h1 className="font-display font-black text-4xl text-white mb-2">Resource Coordination</h1>
            <p className="font-body text-slate-500">Track and allocate relief resources across the network.</p>
          </div>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={16}/> Add Resource
          </motion.button>
        </div>

        {/* Add form */}
        {showForm && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
            className="glass rounded-2xl p-6 mb-8 border border-cyan-500/20"
          >
            <h3 className="font-display font-bold text-white mb-4">Register New Resource</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Resource Name</label>
                <input className="input-field" placeholder="e.g. Food Packets"/></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Quantity</label>
                <input className="input-field" placeholder="e.g. 500 kg"/></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Location</label>
                <input className="input-field" placeholder="City or address"/></div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary text-sm !py-2.5 !px-6">Submit Resource</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm !py-2.5 !px-6">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} className="text-slate-500"/>
          {['all','food','medicine','water','shelter','equipment','vehicles','personnel'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`font-mono text-xs px-3 py-1.5 rounded-lg capitalize transition-all ${filter===f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
            >{f}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r,i) => (
            <motion.div key={r.id}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:`${r.color}15`, border:`1px solid ${r.color}30` }}>
                  <Package size={18} style={{ color:r.color }}/>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full"
                  style={{ background:`${r.color}15`, color:r.color, border:`1px solid ${r.color}25` }}>
                  {r.status}
                </span>
              </div>
              <div className="font-display font-black text-3xl text-white mb-1">{r.qty}</div>
              <div className="font-body text-slate-300 font-medium mb-2">{r.label}</div>
              <div className="flex items-center gap-1 font-mono text-xs text-slate-500">
                <MapPin size={10}/> {r.org}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
