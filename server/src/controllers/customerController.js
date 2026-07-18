const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

exports.listCustomers = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const customers = await Customer.find({ businessId }).sort({ createdAt: -1 }).lean();
  const insights = await Order.aggregate([
    { $match: { businessId } },
    { $group: { _id: "$customerId", orders: { $sum: 1 }, spent: { $sum: "$total" } } },
  ]);
  const map = new Map(insights.map((i) => [String(i._id), i]));
  res.json(customers.map((c) => ({ ...c, orders: map.get(String(c._id))?.orders || 0, spent: map.get(String(c._id))?.spent || 0 })));
});
