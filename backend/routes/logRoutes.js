// ---------------------------------------------
// 📜 Admin Action Logs Route (Enterprise-Grade Logging System)
// ---------------------------------------------

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ActionLog = require('../models/ActionLog');

// ---------------------------------------------
// 🔍 GET /api/logs
// - Fetch logs with optional filters:
//   - action (string)
//   - role (string) [future enhancement]
//   - startDate, endDate (ISO date strings)
//   - keyword (matches notes or details)
//   - page (number), limit (number)
// ---------------------------------------------
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      action,
      role, // (reserved for future enhancements)
      startDate,
      endDate,
      keyword,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // 🔍 Filter: Action Type
    if (action) {
      query.action = { $regex: action, $options: 'i' };
    }

    // 🗓️ Filter: Date Range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // 🔎 Search: notes or metadata
    if (keyword) {
      query.$or = [
        { notes: { $regex: keyword, $options: 'i' } },
        { action: { $regex: keyword, $options: 'i' } },
      ];
    }

    // 🔢 Pagination math
    const skip = (Number(page) - 1) * Number(limit);

    // 📦 Query logs with pagination
    const logs = await ActionLog.find(query)
      .populate('adminId', 'name email role')
      .populate('targetUserId', 'name email role')
      .populate('targetOrderId', 'orderId status')
      .populate('targetProductId', 'name brand')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalLogs = await ActionLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      total: totalLogs,
      page: Number(page),
      pages: Math.ceil(totalLogs / limit),
      logs,
    });
  } catch (error) {
    console.error('❌ Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: '❌ Internal Server Error while fetching logs',
      error: error.message,
    });
  }
});

// ---------------------------------------------
// 📝 POST /api/logs (optional future use)
// - Manually log admin actions from frontend or services
// ---------------------------------------------
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      targetUserId,
      targetOrderId,
      targetProductId,
      action,
      notes,
      tags,
    } = req.body;

    const newLog = await ActionLog.create({
      adminId: req.user._id,
      targetUserId,
      targetOrderId,
      targetProductId,
      action,
      notes,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.get('User-Agent') || '',
      location: req.headers['x-geo-location'] || '',
      tags,
    });

    res.status(201).json({
      success: true,
      message: '✅ Log successfully created.',
      log: newLog,
    });
  } catch (error) {
    console.error('❌ Error saving log:', error);
    res.status(500).json({
      success: false,
      message: '❌ Internal Server Error while saving log',
      error: error.message,
    });
  }
});

module.exports = router;
