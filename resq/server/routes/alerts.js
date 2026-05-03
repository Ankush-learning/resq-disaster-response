// routes/alerts.js
const router = require('express').Router()
const { protect, authorize } = require('../middleware/auth')

// Send a broadcast alert (authority only)
router.post('/broadcast', protect, authorize('authority', 'admin'), async (req, res, next) => {
  try {
    const { title, message, severity, area } = req.body
    const io = req.app.get('io')

    const alert = {
      id: Date.now().toString(),
      title,
      message,
      severity,
      area,
      sentBy: req.user.name,
      timestamp: new Date().toISOString(),
    }

    if (io) io.emit('broadcast_alert', alert)
    res.json({ success: true, data: alert })
  } catch (err) {
    next(err)
  }
})

module.exports = router
