const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

exports.listProducts = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  res.json(await Product.find({ businessId }).sort({ createdAt: -1 }).lean());
});

exports.createProduct = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const product = await Product.create({ ...req.body, businessId });
  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const product = await Product.findOneAndUpdate({ _id: req.params.id, businessId }, req.body, { new: true });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const businessId = new mongoose.Types.ObjectId(req.user.businessId);
  const product = await Product.findOneAndDelete({ _id: req.params.id, businessId });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ ok: true });
});
