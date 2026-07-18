const mongoose = require("mongoose");
const Inventory = require("../models/Inventory");
const asyncHandler = require("../utils/asyncHandler");

exports.listInventory = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const rows = await Inventory.find({ businessId }).populate("productId", "name sku price").lean();
  res.json(rows.map((r) => ({ ...r, lowStock: r.quantity <= r.reorderLevel })));
});
