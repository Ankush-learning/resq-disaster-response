import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, MapPin, Filter, Loader2 } from 'lucide-react'
import api from '../services/api'

const statusColor = {
  available: '#22c55e',
  in_use: '#eab308',
  depleted: '#ef4444',
  reserved: '#f97316',
}

export default function Resources() {
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', quantity: '', unit: 'units', location: '', category: 'food', organization: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchResources = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filter !== 'all') params.category = filter
      const res = await api.get('/resources', { params })
      setResources(res.data.data || [])
    } catch (err) {
      setError('Failed to load resources.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchResources() }, [filter])

  const handleAddResource = async () => {
    if (!formData.name || !formData.quantity || !formData.location) {
      setFormError('Name, quantity and location are required.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      await api.post('/resources', formData)
      setFormData({ name: '', quantity: '', unit: 'units', location: '', category: 'food', organization: '' })
      setShowForm(false)
      fetchResources()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add resource.')
    }
    setSubmitting(false)
  }

  const filtered = resources

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
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Resource Name *</label>
                <input className="input-field" placeholder="e.g. Food Packets" value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}/></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Quantity *</label>
                <input className="input-field" placeholder="e.g. 500" type="number" min="0" value={formData.quantity}
                  onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))}/></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Unit</label>
                <input className="input-field" placeholder="kg / units / boxes" value={formData.unit}
                  onChange={e => setFormData(f => ({ ...f, unit: e.target.value }))}/></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Location *</label>
                <input className="input-field" placeholder="City or address" value={formData.location}
                  onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}/></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Category</label>
                <select className="input-field" value={formData.category}
                  onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>
                  {['food','water','medicine','clothing','shelter','equipment','vehicles','personnel','other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select></div>
              <div><label className="font-body text-xs text-slate-400 mb-1 block">Organization</label>
                <input className="input-field" placeholder="e.g. Red Cross" value={formData.organization}
                  onChange={e => setFormData(f => ({ ...f, organization: e.target.value }))}/></div>
            </div>
            {formError && <p className="font-body text-sm text-red-400 mb-3">{formError}</p>}
            <div className="flex gap-3">
              <button onClick={handleAddResource} disabled={submitting} className="btn-primary text-sm !py-2.5 !px-6 flex items-center gap-2">
                {submitting && <Loader2 size={14} className="animate-spin"/>}
                Submit Resource
              </button>
              <button onClick={() => { setShowForm(false); setFormError('') }} className="btn-secondary text-sm !py-2.5 !px-6">Cancel</button>
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

        {loading && <p className="font-body text-slate-500 text-center py-12">Loading resources...</p>}
        {error && <p className="font-body text-red-400 text-center py-12">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="font-body text-slate-500 text-center py-12">No resources found.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r,i) => {
            const color = statusColor[r.status] || '#94a3b8'
            return (
              <motion.div key={r._id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:`${color}15`, border:`1px solid ${color}30` }}>
                    <Package size={18} style={{ color }}/>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full capitalize"
                    style={{ background:`${color}15`, color, border:`1px solid ${color}25` }}>
                    {r.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-display font-black text-3xl text-white mb-1">{r.quantity} {r.unit}</div>
                <div className="font-body text-slate-300 font-medium mb-2">{r.name}</div>
                <div className="flex items-center gap-1 font-mono text-xs text-slate-500">
                  <MapPin size={10}/> {r.organization || r.location?.address || 'Unknown'}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
