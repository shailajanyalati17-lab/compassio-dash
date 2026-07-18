const mongoose = require("mongoose");
const Order = require("../models/Order");
const Sale = require("../models/Sale");
const asyncHandler = require("../utils/asyncHandler");

exports.listOrders = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const orders = await Order.find({ businessId }).sort({ createdAt: -1 }).populate("customerId", "name email").lean();
  res.json(orders);
});

exports.createOrder = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const order = await Order.create({ ...req.body, businessId });
  if (order.status === "paid") {
    await Sale.create({ businessId, orderId: order._id, amount: order.total, date: new Date() });
  }
  res.status(201).json(order);
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const order = await Order.findOneAndUpdate({ _id: req.params.id, businessId }, req.body, { new: true });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});
