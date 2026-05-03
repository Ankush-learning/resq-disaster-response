const router = require('express').Router()
const { body } = require('express-validator')
const multer = require('multer')
const path = require('path')
const {
  getReports, getReport, createReport,
  updateStatus, assignVolunteers, getStats,
} = require('../controllers/reportController')
const { protect, authorize, optionalAuth } = require('../middleware/auth')

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/
    cb(null, allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase()))
  },
})

const reportRules = [
  body('type').notEmpty().withMessage('Disaster type required'),
  body('severity').isIn(['critical', 'high', 'medium', 'low']).withMessage('Invalid severity'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description 10-2000 chars'),
  body('location').notEmpty().withMessage('Location required'),
]

router.get('/', getReports)
router.get('/stats', getStats)
router.get('/:id', getReport)
router.post('/', optionalAuth, upload.array('images', 5), reportRules, createReport)
router.patch('/:id/status', protect, authorize('authority', 'admin'), updateStatus)
router.patch('/:id/assign', protect, authorize('authority', 'admin'), assignVolunteers)

module.exports = router
