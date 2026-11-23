const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.patch('/:id/role', protect, authorize('Admin'), updateUserRole);

module.exports = router;
