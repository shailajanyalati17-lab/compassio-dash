import crypto from "node:crypto";
import { connectDB } from "../config/db";
import { User, type UserRole } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { issueAuthCookie, clearAuthCookie, getCurrentPayload } from "../middleware/auth";
import { badRequest, unauthorized, notFound } from "../utils/apiError";
import { toDTO } from "../utils/serialize";

function publicUser(doc: any) {
  const dto = toDTO(doc);
  delete dto.password;
  delete dto.resetPasswordToken;
  delete dto.resetPasswordExpires;
  return dto;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  company?: string;
  role?: UserRole;
}) {
  await connectDB();
  const email = input.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) throw badRequest("An account with this email already exists");

  const password = await hashPassword(input.password);
  const user = await User.create({
    name: input.name.trim(),
    email,
    password,
    company: input.company || "Compassio Inc.",
    role: input.role || "owner",
  });

  issueAuthCookie({ sub: user._id.toString(), email: user.email, role: user.role });
  return publicUser(user);
}

export async function loginUser(input: { email: string; password: string }) {
  await connectDB();
  const email = input.email.toLowerCase().trim();
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw unauthorized("Invalid email or password");

  const ok = await comparePassword(input.password, user.password);
  if (!ok) throw unauthorized("Invalid email or password");

  issueAuthCookie({ sub: user._id.toString(), email: user.email, role: user.role });
  return publicUser(user);
}

export function logoutUser() {
  clearAuthCookie();
  return { success: true };
}

export async function getSessionUser() {
  const payload = getCurrentPayload();
  if (!payload) return null;
  await connectDB();
  const user = await User.findById(payload.sub);
  if (!user) return null;
  return publicUser(user);
}

export async function updateProfile(
  userId: string,
  patch: { name?: string; company?: string; avatar?: string },
) {
  await connectDB();
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: patch },
    { new: true, runValidators: true },
  );
  if (!user) throw notFound("User not found");
  return publicUser(user);
}

export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string },
) {
  await connectDB();
  const user = await User.findById(userId).select("+password");
  if (!user) throw notFound("User not found");
  const ok = await comparePassword(input.currentPassword, user.password);
  if (!ok) throw badRequest("Current password is incorrect");
  user.password = await hashPassword(input.newPassword);
  await user.save();
  return { success: true };
}

// Generates a reset token (returned so the UI can display / simulate email delivery).
export async function forgotPassword(email: string) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  // Always respond success to avoid leaking which emails exist.
  if (!user) return { success: true, token: null };

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await user.save();
  return { success: true, token };
}

export async function resetPassword(input: { token: string; newPassword: string }) {
  await connectDB();
  const hashed = crypto.createHash("sha256").update(input.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password +resetPasswordToken +resetPasswordExpires");
  if (!user) throw badRequest("Reset link is invalid or has expired");

  user.password = await hashPassword(input.newPassword);
  user.resetPasswordToken = undefined as any;
  user.resetPasswordExpires = undefined as any;
  await user.save();
  return { success: true };
}

export async function listUsers() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(publicUser);
}
