import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Menu, X, Activity, Shield } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/map', label: 'Live Map' },
  { href: '/report', label: 'Report' },
  { href: '/resources', label: 'Resources' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-6 lg:px-8 transition-all duration-500 ${
            scrolled ? 'glass rounded-2xl mx-4 lg:mx-8' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Res<span className="text-cyan-400">Q</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-xl font-body font-medium text-sm transition-all duration-200 no-underline ${
                    location.pathname === link.href
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="font-body text-sm text-slate-400 hover:text-white transition-colors no-underline px-4 py-2">
                Sign in
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/report"
                  className="btn-danger flex items-center gap-2 text-sm no-underline !py-2.5 !px-5"
                >
                  <AlertTriangle size={14} />
                  Emergency
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-40 glass rounded-2xl p-4 md:hidden"
            style={{ border: '1px solid rgba(34,211,238,0.15)' }}
          >
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl font-body text-sm transition-colors no-underline ${
                    location.pathname === link.href
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="divider mb-4" />
            <div className="flex flex-col gap-2">
              <Link to="/login" className="btn-secondary text-sm text-center no-underline">Sign In</Link>
              <Link to="/report" className="btn-danger text-sm text-center flex items-center justify-center gap-2 no-underline">
                <AlertTriangle size={14} /> Report Emergency
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
