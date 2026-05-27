require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')

const authRoutes = require('./routes/auth')
const reportRoutes = require('./routes/reports')
const resourceRoutes = require('./routes/resources')
const alertRoutes = require('./routes/alerts')
const weatherRoutes = require('./routes/weather')
const { initSocketHandlers } = require('./socket/handlers')

const app = express()
const httpServer = http.createServer(app)

// ── Socket.IO ──────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
initSocketHandlers(io)
app.set('io', io) // make io available in routes

// ── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// ── Rate Limiting ──────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts.' },
})

const reportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many reports submitted. Please wait.' },
})

app.use(globalLimiter)
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Static uploads ─────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/reports', reportLimiter, reportRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/weather', weatherRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack)
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ── MongoDB Connection ─────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'resq',
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 ResQ Server running on port ${PORT}`)
    console.log(`📡 Socket.IO enabled`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
})

module.exports = { app, io }
