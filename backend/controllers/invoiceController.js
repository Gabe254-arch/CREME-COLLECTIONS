// backend/controllers/invoiceController.js
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

// ---------------------------------------------------------
// 📄 generateInvoice()
// Route: GET /api/invoice/:id
// Description: Generates a branded PDF invoice for an order
// ---------------------------------------------------------
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // 🧾 Set headers for PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order-${order._id}-invoice.pdf`);

    // 🔄 Pipe PDF stream
    doc.pipe(res);

    // -----------------------------------------------------
    // 🟠 Brand Header
    // -----------------------------------------------------
    doc
      .fillColor('#F97316')
      .font('Helvetica-Bold')
      .fontSize(22)
      .text('Creme Collections', { align: 'center' })
      .moveDown(0.2)
      .fillColor('#000')
      .fontSize(14)
      .text('OFFICIAL ORDER INVOICE', { align: 'center' })
      .moveDown(1);

    // -----------------------------------------------------
    // 🧑 Customer Details
    // -----------------------------------------------------
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`Invoice To: ${order.customerName}`)
      .text(`Email: ${order.email}`)
      .text(`Phone: ${order.phone}`)
      .text(`Shipping Address: ${order.shippingAddress}`)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .moveDown(1);

    // -----------------------------------------------------
    // 🛒 Order Items
    // -----------------------------------------------------
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Order Items', { underline: true })
      .moveDown(0.5);

    order.orderItems.forEach(item => {
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(
          `${item.qty} × ${item.name} @ Ksh ${item.price.toLocaleString()} = Ksh ${(item.qty * item.price).toLocaleString()}`,
          { indent: 20 }
        );
    });

    doc.moveDown();

    // -----------------------------------------------------
    // 💵 Totals
    // -----------------------------------------------------
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(`Subtotal:`, 350, doc.y, { continued: true })
      .text(`Ksh ${order.itemsPrice.toLocaleString()}`, { align: 'right' });

    doc
      .font('Helvetica-Bold')
      .text(`Delivery:`, 350, doc.y, { continued: true })
      .text(`Ksh ${order.deliveryFee.toLocaleString()}`, { align: 'right' });

    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor('#F97316')
      .text(`Total:`, 350, doc.y, { continued: true })
      .text(`Ksh ${order.totalPrice.toLocaleString()}`, { align: 'right' });

    doc.moveDown(2);

    // -----------------------------------------------------
    // 📦 Footer
    // -----------------------------------------------------
    doc
      .font('Helvetica-Oblique')
      .fontSize(10)
      .fillColor('#555')
      .text('Thank you for shopping with Creme Collections.', { align: 'center' })
      .text('All prices are inclusive of applicable taxes.', { align: 'center' })
      .moveDown(0.5)
      .text('This is a system-generated invoice.', { align: 'center' });

    // ✅ Finalize PDF stream
    doc.end();

  } catch (err) {
    console.error('❌ Invoice generation error:', err.message);
    res.status(500).json({ message: 'Server error while generating invoice' });
  }
};
