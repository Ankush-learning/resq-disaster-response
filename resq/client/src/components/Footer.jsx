import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Github, Twitter, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 lg:px-8 mt-8">
      <div className="divider mb-16" />
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 no-underline mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Res<span className="text-cyan-400">Q</span>
              </span>
            </Link>
            <p className="font-body text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              Real-time disaster response and relief coordination. Built to save lives when it matters most.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Globe].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2, color: '#22d3ee' }}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 transition-colors"
                >
                  <Icon size={15} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              heading: 'Platform',
              links: ['Live Map', 'Report Emergency', 'Resource Network', 'Alert System'],
            },
            {
              heading: 'Organization',
              links: ['About ResQ', 'Open Source', 'API Docs', 'Contact'],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="font-display font-semibold text-sm text-white mb-4">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-slate-500 hover:text-slate-300 transition-colors no-underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-slate-600">
            © 2025 ResQ. Open source disaster response platform.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
