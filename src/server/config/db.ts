import mongoose from "mongoose";
import { env, assertDbConfigured } from "./env";

// Cache the connection across HMR reloads / serverless invocations to avoid
// exhausting the MongoDB Atlas connection pool.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  __compassioMongoose?: MongooseCache;
};

const cache: MongooseCache =
  globalForMongoose.__compassioMongoose ?? { conn: null, promise: null };

globalForMongoose.__compassioMongoose = cache;

export async function connectDB(): Promise<typeof mongoose> {
  assertDbConfigured();

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      // Reasonable defaults for Atlas.
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
