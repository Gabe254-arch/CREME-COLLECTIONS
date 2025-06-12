const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const InvoiceLog = require('../models/InvoiceLog');

// ---------------------------------------------------
// 🔄 Create a New Order
// ---------------------------------------------------
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    deliveryFee,
    totalPrice,
    customerName,
    phone,
    email,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'Order must contain items' });
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    deliveryFee,
    totalPrice,
    customerName,
    phone,
    email,
  });

  // 🔄 Optional: Decrease stock logic here if needed

  res.status(201).json(order);
});

// ---------------------------------------------------
// 📦 Get Logged-In User’s Orders (Recent First)
// ---------------------------------------------------
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// ---------------------------------------------------
// 📊 Get All Orders (Admin/ShopManager)
// ---------------------------------------------------
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// ---------------------------------------------------
// 🔍 Get Order by ID
// ---------------------------------------------------
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isOwner = order.user.equals(req.user._id);
  const isAdmin = ['admin', 'superadmin', 'shopmanager'].includes(req.user.role);

  if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Access denied' });

  res.json(order);
});

// ---------------------------------------------------
// 💳 Mark Order as Paid
// ---------------------------------------------------
exports.markAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.isPaid) return res.status(400).json({ message: 'Order is already marked as paid' });

  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  await AdminLog.create({
    adminId: req.user._id,
    action: 'order-paid',
    notes: `Marked order #${order._id} as paid`,
    targetOrderId: order._id,
    ipAddress: req.ip,
  });

  res.json({ message: '✅ Order marked as paid' });
});

// ---------------------------------------------------
// 🚚 Mark Order as Delivered
// ---------------------------------------------------
exports.markAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.isDelivered) return res.status(400).json({ message: 'Order is already marked as delivered' });

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();

  await AdminLog.create({
    adminId: req.user._id,
    action: 'order-delivered',
    notes: `Marked order #${order._id} as delivered`,
    targetOrderId: order._id,
    ipAddress: req.ip,
  });

  res.json({ message: '🚚 Order marked as delivered' });
});

// ---------------------------------------------------
// 📄 Generate PDF Invoice
// ---------------------------------------------------
exports.downloadInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isOwner = order.user.equals(req.user._id);
  const isAdmin = ['admin', 'superadmin', 'shopmanager'].includes(req.user.role);
  if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Access denied' });

  await InvoiceLog.create({
    user: req.user._id,
    order: order._id,
    downloadedAt: new Date(),
  });

  const doc = new PDFDocument({ margin: 40 });
  const filename = `order-${order._id}-invoice.pdf`;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  // Header
  doc.fontSize(20).fillColor('#f97316').text('🧾 Creme Collections Invoice', { align: 'center' });
  doc.fontSize(12).fillColor('#444').text(`Order ID: ${order._id}`, { align: 'center' }).moveDown();

  // Customer Info
  doc.fontSize(11).fillColor('#000');
  doc.text(`Customer: ${order.customerName || order.user.name}`);
  doc.text(`Email: ${order.email || order.user.email}`);
  doc.text(`Phone: ${order.phone || 'N/A'}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Payment: ${order.isPaid ? 'Paid ✅' : 'Pending ❌'} | Delivery: ${order.isDelivered ? 'Delivered ✅' : 'In Progress ⏳'}`);
  doc.moveDown();

  // Shipping Address
  doc.fontSize(13).fillColor('#f97316').text('Shipping Address:');
  const s = order.shippingAddress;
  doc.fontSize(11).fillColor('#000').text(`${s}`);
  doc.moveDown();

  // Items
  doc.fontSize(13).fillColor('#f97316').text('Order Items:');
  order.orderItems.forEach((item, i) => {
    doc.fontSize(11).fillColor('#000').text(`${i + 1}. ${item.name} - Ksh ${item.price} x ${item.qty}`);
  });
  doc.moveDown();

  // Total
  doc.fontSize(12).fillColor('#333');
  doc.text(`Subtotal: Ksh ${order.itemsPrice.toLocaleString()}`);
  doc.text(`Delivery Fee: Ksh ${order.deliveryFee?.toLocaleString() || '0'}`);
  doc.text(`Total: Ksh ${order.totalPrice.toLocaleString()}`, { underline: true });
  doc.moveDown();

  // Footer
  doc.fontSize(10).fillColor('gray').text('Thank you for shopping with Creme Collections.', { align: 'center' });

  doc.end();
});

// ---------------------------------------------------
// 📂 Get Invoice Download History
// ---------------------------------------------------
exports.getInvoiceHistory = asyncHandler(async (req, res) => {
  const logs = await InvoiceLog.find({ user: req.user._id })
    .populate('order', 'totalPrice createdAt')
    .sort({ downloadedAt: -1 });

  res.json(logs);
});
