const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Earthquake', 'Flood', 'Cyclone / Hurricane', 'Wildfire', 'Landslide',
           'Tsunami', 'Industrial Accident', 'Building Collapse', 'Chemical Spill', 'Other'],
  },
  severity: {
    type: String,
    required: true,
    enum: ['critical', 'high', 'medium', 'low'],
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  location: {
    address: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
  },
  images: [{ type: String }], // URLs
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'assigned', 'monitoring', 'resolved', 'false_alarm'],
    default: 'pending',
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Priority scoring
  priorityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  // Duplicate report tracking
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    default: null,
  },
  relatedReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
  }],
  // Weather context at time of report
  weatherContext: {
    condition: String,
    temperature: Number,
    windSpeed: Number,
  },
  // Admin verification
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  statusHistory: [{
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
})

reportSchema.index({ 'location.coordinates': '2dsphere' })
reportSchema.index({ severity: 1, status: 1 })
reportSchema.index({ priorityScore: -1 })
reportSchema.index({ incidentId: 1 })
reportSchema.index({ createdAt: -1 })

// Auto-generate incidentId
reportSchema.pre('save', async function (next) {
  if (!this.incidentId) {
    const count = await mongoose.model('Report').countDocuments()
    this.incidentId = `INC-${String(count + 1).padStart(4, '0')}`
  }
  // Compute priority score: severity weight + time decay
  const severityWeight = { critical: 40, high: 30, medium: 20, low: 10 }
  const base = severityWeight[this.severity] || 10
  const relatedCount = this.relatedReports?.length || 0
  this.priorityScore = Math.min(100, base + relatedCount * 5)
  next()
})

module.exports = mongoose.model('Report', reportSchema)
