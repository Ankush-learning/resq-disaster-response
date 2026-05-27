const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  })
}

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, email, password, role, phone, organization } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    // Restrict authority registration
    const allowedRoles = ['citizen', 'volunteer']
    const assignedRole = allowedRoles.includes(role) ? role : 'citizen'

    const user = await User.create({ name, email, password, role: assignedRole, phone, organization })
    sendToken(user, 201, res)
  } catch (err) {
    next(err)
  }
}

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated' })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    sendToken(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

// @PATCH /api/auth/fcm-token
exports.updateFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body
    await User.findByIdAndUpdate(req.user.id, { fcmToken })
    res.json({ success: true, message: 'FCM token updated' })
  } catch (err) {
    next(err)
  }
}
