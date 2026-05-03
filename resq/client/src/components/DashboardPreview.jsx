import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Users, Activity, Bell } from 'lucide-react'

const incidents = [
  { id: 'INC-0291', type: 'Earthquake', location: 'Kathmandu, Nepal', severity: 'critical', status: 'active', volunteers: 12, time: '2m ago' },
  { id: 'INC-0290', type: 'Flood', location: 'Mumbai, India', severity: 'high', status: 'assigned', volunteers: 8, time: '14m ago' },
  { id: 'INC-0289', type: 'Wildfire', location: 'Ankara, Turkey', severity: 'high', status: 'active', volunteers: 15, time: '27m ago' },
  { id: 'INC-0288', type: 'Cyclone', location: 'Dhaka, Bangladesh', severity: 'medium', status: 'monitoring', volunteers: 5, time: '1h ago' },
  { id: 'INC-0287', type: 'Landslide', location: 'Manali, India', severity: 'medium', status: 'resolved', volunteers: 7, time: '2h ago' },
]

const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 font-mono text-xs text-green-400">
            <TrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
      <div className="font-display font-bold text-2xl text-white mb-0.5">{value}</div>
      <div className="font-body text-xs text-slate-500">{label}</div>
    </motion.div>
  )
}

const SeverityBadge = ({ severity }) => {
  const config = {
    critical: { label: 'CRITICAL', class: 'badge-critical' },
    high: { label: 'HIGH', class: 'badge-high' },
    medium: { label: 'MEDIUM', class: 'badge-medium' },
    low: { label: 'LOW', class: 'badge-low' },
  }
  const c = config[severity] || config.low
  return (
    <span className={`badge ${c.class}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {c.label}
    </span>
  )
}

const StatusBadge = ({ status }) => {
  const config = {
    active: { label: 'ACTIVE', cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
    assigned: { label: 'ASSIGNED', cls: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
    monitoring: { label: 'MONITORING', cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    resolved: { label: 'RESOLVED', cls: 'text-green-400 bg-green-400/10 border-green-400/20' },
  }
  const c = config[status] || config.monitoring
  return (
    <span className={`badge ${c.cls} border`}>{c.label}</span>
  )
}

// Simple bar chart
const BarChart = () => {
  const bars = [
    { label: 'Mon', value: 45, color: '#22d3ee' },
    { label: 'Tue', value: 72, color: '#22d3ee' },
    { label: 'Wed', value: 58, color: '#22d3ee' },
    { label: 'Thu', value: 91, color: '#ef4444' },
    { label: 'Fri', value: 63, color: '#22d3ee' },
    { label: 'Sat', value: 38, color: '#22d3ee' },
    { label: 'Sun', value: 52, color: '#f97316' },
  ]

  return (
    <div className="flex items-end gap-2 h-24">
      {bars.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.08 + 0.3, duration: 0.5, ease: 'easeOut' }}
            className="w-full rounded-sm origin-bottom"
            style={{ height: `${bar.value * 0.9}%`, background: bar.color, opacity: 0.8 }}
          />
          <span className="font-mono text-[9px] text-slate-600">{bar.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('all')

  return (
    <section id="dashboard" className="py-32 px-6 lg:px-8">
      <div className="divider mb-24" />
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="section-tag mx-auto w-fit">
              <Activity size={12} />
              AUTHORITY COMMAND CENTER
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-display font-bold text-4xl lg:text-5xl text-white mt-4 tracking-tight"
          >
            Full situational{' '}
            <span className="gradient-text">awareness</span>
          </motion.h2>
        </div>

        {/* Dashboard mock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl overflow-hidden border border-cyan-500/10"
          style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 60px rgba(34,211,238,0.04)' }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="font-mono text-xs text-slate-600 ml-3">ResQ Authority Dashboard — v2.4</span>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 font-mono text-xs text-green-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                LIVE
              </motion.div>
              <Bell size={15} className="text-slate-500" />
            </div>
          </div>

          <div className="p-6 grid lg:grid-cols-4 gap-5">
            {/* Stats row */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={AlertTriangle} label="Active Incidents" value="23" trend="+3 today" color="#ef4444" delay={0.1} />
              <StatCard icon={Users} label="Volunteers Deployed" value="148" trend="+12" color="#22c55e" delay={0.2} />
              <StatCard icon={MapPin} label="Areas Covered" value="67" trend="" color="#22d3ee" delay={0.3} />
              <StatCard icon={CheckCircle} label="Resolved Today" value="31" trend="" color="#f97316" delay={0.4} />
            </div>

            {/* Incident table */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 mb-4 p-1 glass rounded-xl w-fit">
                {['all', 'active', 'assigned', 'resolved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-lg capitalize transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden border border-white/5">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left font-mono text-[10px] text-slate-600 px-4 py-3 uppercase tracking-wider">ID</th>
                      <th className="text-left font-mono text-[10px] text-slate-600 px-4 py-3 uppercase tracking-wider">Type</th>
                      <th className="text-left font-mono text-[10px] text-slate-600 px-4 py-3 uppercase tracking-wider hidden md:table-cell">Location</th>
                      <th className="text-left font-mono text-[10px] text-slate-600 px-4 py-3 uppercase tracking-wider">Severity</th>
                      <th className="text-left font-mono text-[10px] text-slate-600 px-4 py-3 uppercase tracking-wider hidden lg:table-cell">Status</th>
                      <th className="text-right font-mono text-[10px] text-slate-600 px-4 py-3 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((inc, i) => (
                      <motion.tr
                        key={inc.id}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-cyan-400">{inc.id}</td>
                        <td className="px-4 py-3 font-body text-sm text-slate-300">{inc.type}</td>
                        <td className="px-4 py-3 font-body text-xs text-slate-500 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={10} className="text-slate-600" />
                            {inc.location}
                          </div>
                        </td>
                        <td className="px-4 py-3"><SeverityBadge severity={inc.severity} /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><StatusBadge status={inc.status} /></td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Clock size={10} />
                            {inc.time}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side chart */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-semibold text-sm text-white">Weekly Incidents</span>
                  <Activity size={14} className="text-cyan-400" />
                </div>
                <BarChart />
              </div>

              {/* Alert feed */}
              <div className="glass rounded-xl p-4 flex-1">
                <div className="font-display font-semibold text-sm text-white mb-3 flex items-center gap-2">
                  <Bell size={14} className="text-yellow-400" />
                  Live Alerts
                </div>
                <div className="space-y-2">
                  {[
                    { msg: 'New report: Flood in Assam', time: 'just now', color: '#ef4444' },
                    { msg: 'Volunteer Team-7 deployed', time: '2m ago', color: '#22c55e' },
                    { msg: 'Resources dispatched to INC-0291', time: '5m ago', color: '#22d3ee' },
                    { msg: 'Weather alert: Cyclone track updated', time: '8m ago', color: '#f97316' },
                  ].map((alert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-2 py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: alert.color }} />
                      <div>
                        <p className="font-body text-xs text-slate-300 leading-tight">{alert.msg}</p>
                        <p className="font-mono text-[10px] text-slate-600 mt-0.5">{alert.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
