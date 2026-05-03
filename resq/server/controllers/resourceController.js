const Resource = require('../models/Resource')

exports.getResources = async (req, res, next) => {
  try {
    const { category, status, lat, lng, radius = 30 } = req.query
    const query = {}
    if (category) query.category = category
    if (status) query.status = status

    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000,
        },
      }
    }

    const resources = await Resource.find(query)
      .populate('providedBy', 'name organization')
      .sort('-createdAt')
      .limit(100)

    res.json({ success: true, count: resources.length, data: resources })
  } catch (err) {
    next(err)
  }
}

exports.createResource = async (req, res, next) => {
  try {
    const { name, category, quantity, unit, location, lat, lng, organization, notes, expiryDate } = req.body

    const resource = await Resource.create({
      name,
      category,
      quantity,
      unit,
      location: {
        address: location,
        coordinates: { type: 'Point', coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0] },
      },
      providedBy: req.user.id,
      organization,
      notes,
      expiryDate,
    })

    const io = req.app.get('io')
    if (io) io.emit('resource_added', { id: resource._id, category: resource.category, quantity: resource.quantity })

    res.status(201).json({ success: true, data: resource })
  } catch (err) {
    next(err)
  }
}

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, providedBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' })
    res.json({ success: true, data: resource })
  } catch (err) {
    next(err)
  }
}

exports.deleteResource = async (req, res, next) => {
  try {
    await Resource.findOneAndDelete({ _id: req.params.id, providedBy: req.user.id })
    res.json({ success: true, message: 'Resource removed' })
  } catch (err) {
    next(err)
  }
}
