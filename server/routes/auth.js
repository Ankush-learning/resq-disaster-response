const router = require('express').Router()
const { body } = require('express-validator')
const { register, login, getMe, updateFcmToken } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('role').optional().isIn(['citizen', 'volunteer']),
]

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
]

router.post('/register', registerRules, register)
router.post('/login', loginRules, login)
router.get('/me', protect, getMe)
router.patch('/fcm-token', protect, updateFcmToken)

module.exports = router
