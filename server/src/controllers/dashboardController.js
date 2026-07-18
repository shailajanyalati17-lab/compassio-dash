const mongoose = require("mongoose");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");

exports.getDashboard = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);

  const [revenueAgg, orderCount, customerCount, bestSellers, recentOrders] = await Promise.all([
    Order.aggregate([
      { $match: { businessId, status: { $in: ["paid", "shipped"] } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ businessId }),
    Customer.countDocuments({ businessId }),
    Order.aggregate([
      { $match: { businessId } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          qty: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, productId: "$_id", qty: 1, revenue: 1, name: "$product.name" } },
    ]),
    Order.find({ businessId }).sort({ createdAt: -1 }).limit(10).populate("customerId", "name").lean(),
  ]);

  res.json({
    totalRevenue: revenueAgg[0]?.total || 0,
    totalOrders: orderCount,
    totalCustomers: customerCount,
    bestSellers,
    recentOrders,
  });
});
