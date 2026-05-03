const jwt = require('jsonwebtoken')
const Report = require('../models/Report')

const initSocketHandlers = (io) => {
  // Auth middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        socket.userId = decoded.id
        socket.authenticated = true
      } catch {
        socket.authenticated = false
      }
    }
    next()
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id} | auth: ${socket.authenticated}`)

    // Join geo-based rooms (lat/lng grid for area broadcasts)
    socket.on('join_area', ({ lat, lng }) => {
      if (lat && lng) {
        const gridKey = `area_${Math.floor(lat)}_${Math.floor(lng)}`
        socket.join(gridKey)
        socket.areaRoom = gridKey
        console.log(`📍 Socket ${socket.id} joined area room: ${gridKey}`)
      }
    })

    // Subscribe to a specific incident's updates
    socket.on('subscribe_incident', (incidentId) => {
      socket.join(`incident_${incidentId}`)
    })

    socket.on('unsubscribe_incident', (incidentId) => {
      socket.leave(`incident_${incidentId}`)
    })

    // Volunteer location update (only auth'd volunteers)
    socket.on('volunteer_location', async ({ lat, lng }) => {
      if (!socket.authenticated) return
      socket.broadcast.emit('volunteer_moved', {
        volunteerId: socket.userId,
        lat,
        lng,
        timestamp: Date.now(),
      })
    })

    // Typing indicator for incident chat (future feature)
    socket.on('incident_typing', ({ incidentId }) => {
      socket.to(`incident_${incidentId}`).emit('user_typing', {
        userId: socket.userId,
        incidentId,
      })
    })

    // Dashboard heartbeat — authorities poll for stats
    socket.on('request_stats', async () => {
      try {
        const [active, resolved, total] = await Promise.all([
          Report.countDocuments({ status: { $in: ['active', 'assigned'] } }),
          Report.countDocuments({ status: 'resolved' }),
          Report.countDocuments(),
        ])
        socket.emit('stats_update', { active, resolved, total, timestamp: Date.now() })
      } catch (err) {
        console.error('Stats fetch error:', err)
      }
    })

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} — ${reason}`)
    })

    socket.on('error', (err) => {
      console.error(`Socket error for ${socket.id}:`, err)
    })
  })
}

module.exports = { initSocketHandlers }
