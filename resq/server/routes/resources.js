const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { getResources, createResource, updateResource, deleteResource } = require('../controllers/resourceController')

router.get('/', getResources)
router.post('/', protect, createResource)
router.patch('/:id', protect, updateResource)
router.delete('/:id', protect, deleteResource)

module.exports = router
