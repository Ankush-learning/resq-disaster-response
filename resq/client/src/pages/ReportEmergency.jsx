import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Camera, Upload, Send, ChevronDown, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const disasterTypes = [
  'Earthquake', 'Flood', 'Cyclone / Hurricane', 'Wildfire', 'Landslide',
  'Tsunami', 'Industrial Accident', 'Building Collapse', 'Chemical Spill', 'Other'
]

const severityLevels = [
  { value: 'critical', label: 'Critical', desc: 'Immediate life threat', color: '#ef4444' },
  { value: 'high', label: 'High', desc: 'Serious injuries possible', color: '#f97316' },
  { value: 'medium', label: 'Medium', desc: 'Moderate risk', color: '#eab308' },
  { value: 'low', label: 'Low', desc: 'Minor impact', color: '#22c55e' },
]

export default function ReportEmergency() {
  const [form, setForm] = useState({
    type: '',
    severity: '',
    description: '',
    location: '',
    lat: '',
    lng: '',
    images: [],
  })
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const fileRef = useRef(null)

  const getLocation = () => {
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }))
        setGpsLoading(false)
      },
      () => { setGpsLoading(false); alert('Unable to get location. Please enter manually.') }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1500)) // Simulate API call
      // await api.post('/reports', form)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'radial-gradient(circle at 50% 40%, #0a0f2e 0%, #020817 70%)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass rounded-3xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle size={28} className="text-green-400" />
          </motion.div>
          <h2 className="font-display font-bold text-2xl text-white mb-3">Report Submitted</h2>
          <p className="font-body text-slate-400 mb-2">Your emergency report has been received.</p>
          <p className="font-mono text-sm text-cyan-400 mb-8">ID: INC-{Math.floor(Math.random()*9000+1000)}</p>
          <p className="font-body text-slate-500 text-sm mb-8">
            Authorities have been notified. Track the status on the live map.
          </p>
          <div className="flex gap-3">
            <Link to="/map" className="btn-primary flex-1 text-center no-underline text-sm">View Live Map</Link>
            <button onClick={() => { setSubmitted(false); setForm({ type:'',severity:'',description:'',location:'',lat:'',lng:'',images:[] }); setStep(1) }} className="btn-secondary flex-1 text-sm">Report Another</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'radial-gradient(circle at 30% 20%, #0a0f2e 0%, #020817 70%)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="section-tag w-fit">
            <AlertTriangle size={12} />
            EMERGENCY REPORT
          </div>
          <h1 className="font-display font-bold text-4xl text-white mt-4 mb-2">Report an Emergency</h1>
          <p className="font-body text-slate-500">Provide as much detail as possible. Every detail helps first responders.</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${
                step > s ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                step === s ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                'bg-white/5 text-slate-600 border border-white/10'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-px transition-all duration-300 ${step > s ? 'bg-green-500/40' : 'bg-white/10'}`} style={{ width: 40 }} />}
            </div>
          ))}
          <span className="font-mono text-xs text-slate-500 ml-2">Step {step} of 3</span>
        </div>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {/* Step 1: Type & Severity */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-display font-semibold text-white">Incident Details</h3>

                {/* Disaster type */}
                <div>
                  <label className="font-body text-sm text-slate-400 mb-2 block">Disaster Type *</label>
                  <div className="relative">
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="input-field appearance-none"
                      required
                    >
                      <option value="">Select disaster type...</option>
                      {disasterTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="font-body text-sm text-slate-400 mb-3 block">Severity Level *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {severityLevels.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, severity: level.value }))}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          form.severity === level.value
                            ? 'border-opacity-60 bg-opacity-10'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                        }`}
                        style={form.severity === level.value ? {
                          borderColor: level.color,
                          background: `${level.color}12`,
                        } : {}}
                      >
                        <div className="font-display font-semibold text-sm mb-0.5" style={form.severity === level.value ? { color: level.color } : { color: '#94a3b8' }}>
                          {level.label}
                        </div>
                        <div className="font-body text-xs text-slate-600">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { if (!form.type || !form.severity) return alert('Please fill all fields'); setStep(2) }}
                className="btn-primary w-full"
              >
                Next: Location Details →
              </button>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-display font-semibold text-white">Location Details</h3>

                <div>
                  <label className="font-body text-sm text-slate-400 mb-2 block">Address / Description *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="input-field"
                    placeholder="Enter address or landmark..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="font-body text-sm text-slate-400 mb-2 block">Latitude</label>
                    <input type="text" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} className="input-field" placeholder="28.6139" />
                  </div>
                  <div className="flex-1">
                    <label className="font-body text-sm text-slate-400 mb-2 block">Longitude</label>
                    <input type="text" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} className="input-field" placeholder="77.2090" />
                  </div>
                </div>

                <button type="button" onClick={getLocation} disabled={gpsLoading} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  {gpsLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                  {gpsLoading ? 'Getting location...' : 'Use My GPS Location'}
                </button>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                <button type="button" onClick={() => { if (!form.location) return alert('Enter a location'); setStep(3) }} className="btn-primary flex-1">Next: Description →</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Description & Media */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-display font-semibold text-white">Description & Evidence</h3>

                <div>
                  <label className="font-body text-sm text-slate-400 mb-2 block">Describe the situation *</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="input-field h-36 resize-none"
                    placeholder="Describe what you see, how many people are affected, immediate dangers..."
                    required
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="font-body text-sm text-slate-400 mb-2 block">Upload Photos</label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/10 hover:border-cyan-500/30 rounded-xl p-8 flex flex-col items-center gap-3 transition-all duration-200 hover:bg-cyan-500/5"
                  >
                    <Upload size={24} className="text-slate-600" />
                    <span className="font-body text-sm text-slate-500">Click to upload images</span>
                    <span className="font-mono text-xs text-slate-600">PNG, JPG up to 10MB each</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => setForm(f => ({ ...f, images: Array.from(e.target.files) }))} />
                  {form.images.length > 0 && (
                    <p className="font-mono text-xs text-cyan-400 mt-2">{form.images.length} file(s) selected</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="glass rounded-xl p-4 border border-cyan-500/15">
                <h4 className="font-display font-semibold text-sm text-white mb-3">Report Summary</h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="text-slate-300">{form.type}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Severity</span><span className="text-slate-300 capitalize">{form.severity}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-slate-300 truncate ml-4 max-w-[180px]">{form.location}</span></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
                <button type="submit" disabled={submitting} className="btn-danger flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? 'Submitting...' : 'Submit Emergency Report'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.form>
      </div>
    </div>
  )
}
