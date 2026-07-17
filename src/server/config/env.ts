// Centralized environment configuration for the Compassio backend.
// All server-only secrets are read here so the rest of the code has a single source of truth.

export const env = {
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "compassio-dev-insecure-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export function assertDbConfigured() {
  if (!env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it in Project Settings → Vars (your MongoDB Atlas connection string).",
    );
  }
}
