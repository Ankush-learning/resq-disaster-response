import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  AlertTriangle, Map, Package, ShieldCheck,
  Bell, Wifi, Activity, Users
} from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Emergency Reporting',
    description: 'Instantly report disasters with GPS location, photo evidence, and severity classification. Every second counts.',
    color: 'red',
    accent: '#ef4444',
    badge: 'CRITICAL',
    stat: '< 30s',
    statLabel: 'avg report time',
  },
  {
    icon: Map,
    title: 'Live Disaster Map',
    description: 'Real-time map showing all active incidents, shelters, hospitals, and resource centers updated via Socket.IO.',
    color: 'cyan',
    accent: '#22d3ee',
    badge: 'LIVE',
    stat: '2.4k',
    statLabel: 'active pins',
  },
  {
    icon: Package,
    title: 'Resource Coordination',
    description: 'Track food, medicine, and supplies across volunteer networks. Prevent duplication, maximize impact.',
    color: 'orange',
    accent: '#f97316',
    badge: 'SMART',
    stat: '380+',
    statLabel: 'resources tracked',
  },
  {
    icon: ShieldCheck,
    title: 'Authority Dashboard',
    description: 'Command center for emergency authorities. Filter, prioritize, assign, and monitor all response operations.',
    color: 'purple',
    accent: '#818cf8',
    badge: 'SECURE',
    stat: '99.9%',
    statLabel: 'uptime SLA',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'Push notifications via Firebase Cloud Messaging reach affected citizens and first responders instantly.',
    color: 'yellow',
    accent: '#eab308',
    badge: 'PUSH',
    stat: '< 1s',
    statLabel: 'notify latency',
  },
  {
    icon: Wifi,
    title: 'Offline PWA Support',
    description: 'Service workers cache critical data. Submit reports offline — they sync automatically when connectivity returns.',
    color: 'green',
    accent: '#22c55e',
    badge: 'PWA',
    stat: '100%',
    statLabel: 'offline capable',
  },
  {
    icon: Activity,
    title: 'Priority Scoring',
    description: 'ML-inspired priority algorithm: severity × report frequency. High-risk situations surface automatically.',
    color: 'red',
    accent: '#ef4444',
    badge: 'AI-POWERED',
    stat: '94%',
    statLabel: 'accuracy rate',
  },
  {
    icon: Users,
    title: 'Volunteer Network',
    description: 'Manage and dispatch volunteers by skill, proximity, and availability. Coordinate teams in real-time.',
    color: 'cyan',
    accent: '#22d3ee',
    badge: 'NETWORK',
    stat: '1.2k',
    statLabel: 'volunteers ready',
  },
]

const colorClasses = {
  red: 'group-hover:border-red-500/40 group-hover:shadow-red-500/10',
  cyan: 'group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10',
  orange: 'group-hover:border-orange-500/40 group-hover:shadow-orange-500/10',
  purple: 'group-hover:border-purple-500/40 group-hover:shadow-purple-500/10',
  yellow: 'group-hover:border-yellow-500/40 group-hover:shadow-yellow-500/10',
  green: 'group-hover:border-green-500/40 group-hover:shadow-green-500/10',
}

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 4) * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group card p-6 cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${colorClasses[feature.color]}`}
      whileHover={{ y: -6 }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${feature.accent}10 0%, transparent 60%)`,
        }}
      />

      {/* Badge */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${feature.accent}15`, border: `1px solid ${feature.accent}30` }}
        >
          <Icon size={20} style={{ color: feature.accent }} />
        </div>
        <span
          className="font-mono text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wider"
          style={{
            background: `${feature.accent}12`,
            color: feature.accent,
            border: `1px solid ${feature.accent}25`,
          }}
        >
          {feature.badge}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight">
        {feature.title}
      </h3>
      <p className="font-body text-slate-500 text-sm leading-relaxed mb-5">
        {feature.description}
      </p>

      {/* Stat */}
      <div className="flex items-end gap-2 pt-4 border-t border-white/5">
        <span className="font-display font-bold text-2xl" style={{ color: feature.accent }}>
          {feature.stat}
        </span>
        <span className="font-mono text-xs text-slate-600 mb-0.5">{feature.statLabel}</span>
      </div>

      {/* Animated corner accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 100% 100%, ${feature.accent}20 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="features" className="relative py-32 px-6 lg:px-8">
      {/* Section divider top */}
      <div className="divider mb-24" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="section-tag mx-auto w-fit">
              <Activity size={12} />
              PLATFORM CAPABILITIES
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-display font-bold text-4xl lg:text-5xl text-white mt-4 mb-4 tracking-tight"
          >
            Everything you need to{' '}
            <span className="gradient-text">respond faster</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="font-body text-slate-500 text-lg max-w-xl mx-auto"
          >
            A complete stack for disaster management — from initial report to full resolution.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
