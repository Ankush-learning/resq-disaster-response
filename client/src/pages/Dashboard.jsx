import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Filter, RefreshCw, Bell, Activity, Shield, TrendingUp } from 'lucide-react'

const mockReports = [
  { id: 'INC-0291', type: 'Earthquake', location: 'Kathmandu, Nepal', severity: 'critical', status: 'active', volunteers: 12, time: '2m ago', priority: 98, lat: 27.7, lng: 85.3 },
  { id: 'INC-0290', type: 'Flood', location: 'Mumbai, India', severity: 'high', status: 'assigned', volunteers: 8, time: '14m ago', priority: 85, lat: 19.0, lng: 72.8 },
  { id: 'INC-0289', type: 'Wildfire', location: 'Ankara, Turkey', severity: 'high', status: 'active', volunteers: 15, time: '27m ago', priority: 79, lat: 39.9, lng: 32.9 },
  { id: 'INC-0288', type: 'Cyclone', location: 'Dhaka, Bangladesh', severity: 'medium', status: 'monitoring', volunteers: 5, time: '1h ago', priority: 61, lat: 23.8, lng: 90.4 },
  { id: 'INC-0287', type: 'Landslide', location: 'Manali, India', severity: 'medium', status: 'resolved', volunteers: 7, time: '2h ago', priority: 44, lat: 32.2, lng: 77.1 },
  { id: 'INC-0286', type: 'Tsunami', location: 'Sendai, Japan', severity: 'critical', status: 'active', volunteers: 23, time: '3h ago', priority: 96, lat: 38.3, lng: 140.9 },
]

const severityColor = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' }
const statusIcon = {
  active: <AlertTriangle size={12} className="text-red-400" />,
  assigned: <Clock size={12} className="text-cyan-400" />,
  monitoring: <Activity size={12} className="text-yellow-400" />,
  resolved: <CheckCircle size={12} className="text-green-400" />,
}

export default function Dashboard() {
  const [reports, setReports] = useState(mockReports)
  const [filter, setFilter] = useState('all')
  const [liveUpdates, setLiveUpdates] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (!liveUpdates) return
    const interval = setInterval(() => setLastUpdate(new Date()), 5000)
    return () => clearInterval(interval)
  }, [liveUpdates])

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter || r.severity === filter)

  return (
    <div className="min-h-screen pt-20 pb-12 px-6" style={{ background: '#020817' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8">
          <div>
            <div className="section-tag w-fit mb-3">
              <Shield size={12} />
              AUTHORITY DASHBOARD
            </div>
            <h1 className="font-display font-bold text-3xl text-white">Command Center</h1>
            <p className="font-body text-slate-500 text-sm mt-1">
              Logged in as: <span className="text-cyan-400">authority@resq.org</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`btn-secondary flex items-center gap-2 text-sm !py-2.5 !px-4 ${liveUpdates ? '!border-green-500/40 !text-green-400' : ''}`}
            >
              <motion.div animate={{ rotate: liveUpdates ? 360 : 0 }} transition={{ repeat: liveUpdates ? Infinity : 0, duration: 2, ease: 'linear' }}>
                <RefreshCw size={14} />
              </motion.div>
              {liveUpdates ? 'Live' : 'Paused'}
            </button>
            <button className="btn-primary flex items-center gap-2 text-sm !py-2.5 !px-4">
              <Bell size={14} />
              Send Alert
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Incidents', value: reports.filter(r => r.status === 'active').length, icon: AlertTriangle, color: '#ef4444', trend: '+2' },
            { label: 'Total Volunteers', value: reports.reduce((a, r) => a + r.volunteers, 0), icon: Users, color: '#22c55e', trend: '+15' },
            { label: 'Avg Priority', value: Math.round(reports.reduce((a, r) => a + r.priority, 0) / reports.length), icon: TrendingUp, color: '#f97316', trend: '' },
            { label: 'Resolved Today', value: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle, color: '#22d3ee', trend: '+1' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  {stat.trend && <span className="font-mono text-xs text-green-400 flex items-center gap-1"><TrendingUp size={10} />{stat.trend}</span>}
                </div>
                <div className="font-display font-bold text-3xl text-white mb-0.5">{stat.value}</div>
                <div className="font-body text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Main table */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-white/5">
            <h2 className="font-display font-bold text-lg text-white">Incident Reports</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-500" />
              {['all', 'active', 'assigned', 'monitoring', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-mono text-xs px-3 py-1.5 rounded-lg capitalize transition-all duration-200 ${
                    filter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['ID', 'Type', 'Location', 'Severity', 'Status', 'Priority', 'Volunteers', 'Time', 'Actions'].map(h => (
                    <th key={h} className="text-left font-mono text-[10px] text-slate-600 px-5 py-3 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((report, i) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-cyan-400">{report.id}</td>
                    <td className="px-5 py-4 font-body text-sm text-slate-200 whitespace-nowrap">{report.type}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-body text-xs text-slate-400 whitespace-nowrap">
                        <MapPin size={10} className="text-slate-600" /> {report.location}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 font-mono text-xs capitalize" style={{ color: severityColor[report.severity] }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: severityColor[report.severity] }} />
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 font-mono text-xs capitalize text-slate-400">
                        {statusIcon[report.status]} {report.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 w-16">
                          <div className="h-full rounded-full" style={{ width: `${report.priority}%`, background: report.priority > 80 ? '#ef4444' : report.priority > 60 ? '#f97316' : '#22d3ee' }} />
                        </div>
                        <span className="font-mono text-xs text-slate-400">{report.priority}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">{report.volunteers}</td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1"><Clock size={10} />{report.time}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-display font-semibold bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 transition-colors">Assign</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-display font-semibold bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">View</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-600">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <span className="font-mono text-xs text-slate-600">
              Showing {filtered.length} of {reports.length} incidents
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
