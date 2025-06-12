const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const logAdminAction = require('../utils/logAction'); // ✅ Logging utility

// ---------------------------------------------
// 🔐 Generate JWT Token
// ---------------------------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ---------------------------------------------
// 📝 Register New User
// ---------------------------------------------
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    token: generateToken(user),
  });
});

// ---------------------------------------------
// 🔓 Login User
// ---------------------------------------------
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    token: generateToken(user),
  });
});

// ---------------------------------------------
// 🙋‍♂️ Get Logged-in User Profile
// ---------------------------------------------
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// ---------------------------------------------
// ✏️ Update Logged-in User Profile
// ---------------------------------------------
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token: generateToken(updatedUser),
  });
});

// ---------------------------------------------
// 👑 Admin: Get All Users
// ---------------------------------------------
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
});

// ---------------------------------------------
// 👑 Admin: Update User Role
// ---------------------------------------------
exports.updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = req.body.role || user.role;
  const updated = await user.save();

  // ✅ Log role change
  await logAdminAction({
    adminId: req.user._id,
    targetUserId: user._id,
    action: 'change-role',
    notes: `Changed role to ${user.role}`,
    req,
  });

  res.status(200).json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    updatedAt: updated.updatedAt,
  });
});

// ---------------------------------------------
// 🗑️ Admin: Delete User
// ---------------------------------------------
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.user._id.toString() === user._id.toString()) {
    return res.status(403).json({ message: 'You cannot delete your own account' });
  }

  await User.findByIdAndDelete(req.params.id);

  // ✅ Log deletion
  await logAdminAction({
    adminId: req.user._id,
    targetUserId: user._id,
    action: 'delete',
    notes: `User deleted`,
    req,
  });

  res.status(200).json({ message: 'User deleted successfully' });
});

// ---------------------------------------------
// 🔁 Admin: Reset User Password
// ---------------------------------------------
exports.resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = newPassword;
  user.resetPasswordRequired = false;
  await user.save();

  // ✅ Log password reset
  await logAdminAction({
    adminId: req.user._id,
    targetUserId: user._id,
    action: 'reset-password',
    notes: 'Password reset by admin',
    req,
  });

  res.json({ message: `✅ Password reset for ${user.email}` });
});

// ---------------------------------------------
// ✏️ Admin: Update User Info (Name/Email)
// ---------------------------------------------
exports.updateUserInfo = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  await user.save();

  res.json({ message: `✅ Updated profile for ${user.email}` });
});

// ---------------------------------------------
// 🛑 Admin: Suspend & Activate User
// ---------------------------------------------
exports.suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isSuspended = true;
  await user.save();

  // ✅ Log suspension
  await logAdminAction({
    adminId: req.user._id,
    targetUserId: user._id,
    action: 'suspend',
    notes: 'Account suspended',
    req,
  });

  res.json({ message: `🚫 Suspended ${user.email}` });
});

exports.activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isSuspended = false;
  await user.save();

  // ✅ Log reactivation
  await logAdminAction({
    adminId: req.user._id,
    targetUserId: user._id,
    action: 'activate',
    notes: 'Account reactivated',
    req,
  });

  res.json({ message: `✅ Activated ${user.email}` });
});

// 🚚 GET Logged-in User Addresses
exports.getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.addresses || []);
});

// ✏️ UPDATE Logged-in User Addresses
exports.updateUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.addresses = req.body.addresses || [];
  await user.save();

  await logAdminAction({
  adminId: req.user._id,
  targetUserId: user._id,
  action: 'update-address',
  notes: `Updated delivery addresses`,
  req,
});

  res.json({ message: '✅ Addresses updated', addresses: user.addresses });
});
