import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { verifyToken, signToken, type JwtPayload } from "../utils/jwt";
import { unauthorized, forbidden } from "../utils/apiError";
import { env } from "../config/env";

export const AUTH_COOKIE = "compassio_token";

export function issueAuthCookie(payload: JwtPayload) {
  const token = signToken(payload);
  setCookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return token;
}

export function clearAuthCookie() {
  deleteCookie(AUTH_COOKIE, { path: "/" });
}

// Returns the JWT payload or null (no throw).
export function getCurrentPayload(): JwtPayload | null {
  const token = getCookie(AUTH_COOKIE);
  if (!token) return null;
  return verifyToken(token);
}

// Throws if not authenticated.
export function requireAuth(): JwtPayload {
  const payload = getCurrentPayload();
  if (!payload) throw unauthorized();
  return payload;
}

// Throws if the user's role is not in the allowed list.
export function requireRole(...roles: string[]): JwtPayload {
  const payload = requireAuth();
  if (roles.length && !roles.includes(payload.role)) {
    throw forbidden("You do not have permission to perform this action");
  }
  return payload;
}
