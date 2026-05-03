const { validationResult } = require('express-validator')
const Report = require('../models/Report')
const User = require('../models/User')

// @GET /api/reports — list with filters + pagination
exports.getReports = async (req, res, next) => {
  try {
    const { severity, status, type, lat, lng, radius = 50, page = 1, limit = 20, sort = '-createdAt' } = req.query

    const query = {}
    if (severity) query.severity = severity
    if (status) query.status = status
    if (type) query.type = type

    // Geo filter
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000,
        },
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('reportedBy', 'name role')
        .populate('assignedTo', 'name role phone'),
      Report.countDocuments(query),
    ])

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: reports,
    })
  } catch (err) {
    next(err)
  }
}

// @GET /api/reports/:id
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email role phone')
      .populate('assignedTo', 'name role phone')
      .populate('relatedReports', 'incidentId type severity status')

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' })
    res.json({ success: true, data: report })
  } catch (err) {
    next(err)
  }
}

// @POST /api/reports — create new report
exports.createReport = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { type, severity, description, location, lat, lng } = req.body

    // Handle uploaded images
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : []

    const report = await Report.create({
      type,
      severity,
      description,
      location: {
        address: location,
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0],
        },
      },
      images,
      reportedBy: req.user?.id || null,
    })

    // Increment user report count
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { reportsCount: 1 } })
    }

    // Emit real-time update via Socket.IO
    const io = req.app.get('io')
    if (io) {
      io.emit('new_report', {
        id: report._id,
        incidentId: report.incidentId,
        type: report.type,
        severity: report.severity,
        location: report.location,
        priorityScore: report.priorityScore,
        createdAt: report.createdAt,
      })
    }

    res.status(201).json({ success: true, data: report })
  } catch (err) {
    next(err)
  }
}

// @PATCH /api/reports/:id/status — update status (authority only)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body
    const validStatuses = ['pending', 'active', 'assigned', 'monitoring', 'resolved', 'false_alarm']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' })

    report.status = status
    if (status === 'resolved') report.resolvedAt = new Date()
    report.statusHistory.push({ status, updatedBy: req.user.id, note })
    await report.save()

    // Emit status update
    const io = req.app.get('io')
    if (io) {
      io.emit('report_status_update', { id: report._id, incidentId: report.incidentId, status })
    }

    res.json({ success: true, data: report })
  } catch (err) {
    next(err)
  }
}

// @PATCH /api/reports/:id/assign — assign volunteers
exports.assignVolunteers = async (req, res, next) => {
  try {
    const { volunteerIds } = req.body
    if (!Array.isArray(volunteerIds)) {
      return res.status(400).json({ success: false, message: 'volunteerIds must be an array' })
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedTo: { $each: volunteerIds } }, status: 'assigned' },
      { new: true }
    ).populate('assignedTo', 'name role phone')

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' })

    const io = req.app.get('io')
    if (io) io.emit('volunteers_assigned', { reportId: report._id, incidentId: report.incidentId })

    res.json({ success: true, data: report })
  } catch (err) {
    next(err)
  }
}

// @GET /api/reports/stats — dashboard stats
exports.getStats = async (req, res, next) => {
  try {
    const [total, active, resolved, bySeverity, byType] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: { $in: ['active', 'assigned', 'monitoring'] } }),
      Report.countDocuments({ status: 'resolved' }),
      Report.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      Report.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    ])

    res.json({
      success: true,
      data: {
        total,
        active,
        resolved,
        bySeverity: Object.fromEntries(bySeverity.map(s => [s._id, s.count])),
        byType: Object.fromEntries(byType.map(t => [t._id, t.count])),
      },
    })
  } catch (err) {
    next(err)
  }
}
