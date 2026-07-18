const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const asyncHandler = require("../utils/asyncHandler");

exports.listSales = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const period = req.query.period || "day"; // day | week | month
  const unit = period === "month" ? "month" : period === "week" ? "week" : "day";

  const sales = await Sale.aggregate([
    { $match: { businessId } },
    { $group: { _id: { $dateTrunc: { date: "$date", unit } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", total: 1, count: 1 } },
  ]);

  res.json({ period: unit, series: sales });
});

exports.createSale = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const sale = await Sale.create({ ...req.body, businessId });
  res.status(201).json(sale);
});
