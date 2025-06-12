const express = require('express');
const router = express.Router();

// 🔃 Import controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserAddresses,
  updateUserAddresses,
  updateUserRole,
  deleteUser,
  resetUserPassword,
  updateUserInfo,
  suspendUser,
  activateUser,
} = require('../controllers/userController');

// 🔐 Middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ------------------------------
// 🔓 Public Authentication Routes
// ------------------------------
router.post('/register', registerUser);
router.post('/login', loginUser);

// ------------------------------
// 🙍‍♂️ Authenticated User Routes
// ------------------------------
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .get(protect, getUserAddresses)
  .put(protect, updateUserAddresses);

// ------------------------------
// 👑 Admin-Only Routes
// ------------------------------

// Get all users
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllUsers);

// Update user role
router.put('/:id/role', protect, authorizeRoles('admin', 'superadmin'), updateUserRole);

// Delete user
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteUser);

// Admin reset user password
router.put('/:id/reset-password', protect, authorizeRoles('admin', 'superadmin'), resetUserPassword);

// Admin update user profile
router.put('/:id/edit', protect, authorizeRoles('admin', 'superadmin'), updateUserInfo);

// Admin suspend/reactivate users
router.put('/:id/suspend', protect, authorizeRoles('admin', 'superadmin'), suspendUser);
router.put('/:id/activate', protect, authorizeRoles('admin', 'superadmin'), activateUser);

module.exports = router;
