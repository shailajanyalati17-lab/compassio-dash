const mongoose = require("mongoose");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

exports.getAnalytics = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const unit = req.query.unit === "week" ? "week" : req.query.unit === "day" ? "day" : "month";

  const trend = await Order.aggregate([
    { $match: { businessId } },
    {
      $group: {
        _id: { $dateTrunc: { date: "$createdAt", unit } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", revenue: 1, orders: 1 } },
  ]);

  const totals = await Order.aggregate([
    { $match: { businessId } },
    { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  ]);

  res.json({
    unit,
    trend,
    totals: { revenue: totals[0]?.revenue || 0, orders: totals[0]?.orders || 0 },
  });
});
