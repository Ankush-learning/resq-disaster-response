const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['food', 'water', 'medicine', 'clothing', 'shelter', 'equipment', 'vehicles', 'personnel', 'other'],
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'units' },
  status: {
    type: String,
    enum: ['available', 'in_use', 'depleted', 'reserved'],
    default: 'available',
  },
  location: {
    address: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
  },
  providedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  expiryDate: Date,
  notes: String,
}, { timestamps: true })

resourceSchema.index({ 'location.coordinates': '2dsphere' })
resourceSchema.index({ category: 1, status: 1 })

module.exports = mongoose.model('Resource', resourceSchema)
