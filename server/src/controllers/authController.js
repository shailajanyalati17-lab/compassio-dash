const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Business = require("../models/Business");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, businessName } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: "owner" });
  const business = await Business.create({ name: businessName || `${name}'s Business`, ownerId: user._id });
  user.businessId = business._id;
  await user.save();

  const token = generateToken(user);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, businessId: business._id },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = generateToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, businessId: user.businessId },
  });
});
