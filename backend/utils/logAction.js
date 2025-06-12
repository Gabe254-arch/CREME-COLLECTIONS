// 📦 Log Admin, ShopManager, or System Actions
const ActionLog = require('../models/ActionLog');

/**
 * Logs any backend action tied to a user — admin, superadmin, shopmanager, etc.
 *
 * @param {Object} options
 * @param {Object} options.req - Express request object (optional but preferred)
 * @param {string} options.adminId - ID of user performing the action (required)
 * @param {string} [options.targetUserId] - Affected user (if any)
 * @param {string} [options.targetProductId] - Affected product (if any)
 * @param {string} [options.targetOrderId] - Affected order (if any)
 * @param {string} options.action - Action type string
 * @param {string} [options.notes] - Extra notes or description
 * @param {string} [options.ip] - IP override (optional)
 * @param {string[]} [options.tags] - Custom tags for search/classification
 */
const logAdminAction = async ({
  req = {},
  adminId,
  targetUserId = null,
  targetProductId = null,
  targetOrderId = null,
  action,
  notes = '',
  ip = '',
  tags = [],
}) => {
  try {
    const userAgent = req.get?.('User-Agent') || '';
    const location = req.headers?.['x-geo-location'] || '';
    const ipAddress =
      ip ||
      req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      req?.ip ||
      'unknown';

    // 🔍 Auto-tag role if available
    let roleTag = 'unknown';
    if (req.user?.role) roleTag = req.user.role;

    await ActionLog.create({
      adminId,
      targetUserId,
      targetProductId,
      targetOrderId,
      action,
      notes,
      ipAddress,
      userAgent,
      location,
      tags: [...tags, roleTag], // e.g., ['shopmanager', 'product']
    });
  } catch (err) {
    console.error('⚠️ Failed to log admin/shopmanager action:', err.message);
  }
};

module.exports = logAdminAction;
