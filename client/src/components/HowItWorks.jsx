import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { User, Server, ShieldCheck, Truck, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: User,
    title: 'Citizen Reports',
    description: 'User submits emergency via app — location auto-tagged, photo attached, severity selected.',
    color: '#ef4444',
    details: ['GPS coordinates captured', 'Media attached', 'Severity classified'],
  },
  {
    number: '02',
    icon: Server,
    title: 'System Processes',
    description: 'AI scores priority, verifies report, broadcasts real-time alert to all nearby stakeholders.',
    color: '#f97316',
    details: ['Priority score computed', 'Deduplication check', 'Real-time broadcast'],
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Authorities Alerted',
    description: 'Emergency services receive push notification with full context and recommended actions.',
    color: '#22d3ee',
    details: ['Push notification sent', 'Dashboard updated', 'Resources allocated'],
  },
  {
    number: '04',
    icon: Truck,
    title: 'Response Deployed',
    description: 'Field teams dispatched, volunteers coordinated, status updates flow back to citizens.',
    color: '#22c55e',
    details: ['Teams dispatched', 'Live status updates', 'Resolution confirmed'],
  },
]

const StepCard = ({ step, index, isLast }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = step.icon

  return (
    <div ref={ref} className="flex flex-col lg:flex-row items-start gap-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 relative"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'rgba(13, 21, 64, 0.6)',
            border: `1px solid ${step.color}25`,
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 0% 0%, ${step.color}08 0%, transparent 50%)`,
            }}
          />

          {/* Step number */}
          <div
            className="absolute top-5 right-5 font-display font-bold text-5xl leading-none select-none"
            style={{ color: `${step.color}12` }}
          >
            {step.number}
          </div>

          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
          >
            <Icon size={22} style={{ color: step.color }} />
          </div>

          <h3 className="font-display font-bold text-xl text-white mb-2">{step.title}</h3>
          <p className="font-body text-slate-500 text-sm leading-relaxed mb-4">{step.description}</p>

          {/* Details list */}
          <ul className="space-y-1.5">
            {step.details.map((detail, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.15 + i * 0.08 + 0.3 }}
                className="flex items-center gap-2 font-mono text-xs"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: step.color }}
                />
                <span className="text-slate-400">{detail}</span>
              </motion.li>
            ))}
          </ul>

          {/* Bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
            style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
          />
        </div>
      </motion.div>

      {/* Arrow connector */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.5 }}
          className="hidden lg:flex items-center self-center shrink-0 mt-2"
        >
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowRight size={22} className="text-slate-700" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="how-it-works" className="py-32 px-6 lg:px-8">
      <div className="divider mb-24" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="section-tag mx-auto w-fit">
              <ArrowRight size={12} />
              RESPONSE WORKFLOW
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-display font-bold text-4xl lg:text-5xl text-white mt-4 mb-4 tracking-tight"
          >
            From report to{' '}
            <span className="gradient-text-cyan">resolution</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
            className="font-body text-slate-500 text-lg"
          >
            Four steps. Zero friction. Maximum speed.
          </motion.p>
        </div>

        {/* Steps flow */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* Timeline indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <div className="glass inline-flex items-center gap-3 px-6 py-3 rounded-full">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            <span className="font-mono text-sm text-slate-400">
              Average response initiation:{' '}
              <span className="text-green-400 font-medium">under 4 minutes</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
