import redis from "redis";
import { Env } from "./env.config.js";

export const redisClient = redis.createClient({
  password: Env.REDIS_PASSWORD,
  socket: {
    host: Env.REDIS_HOST,
    port: parseInt(Env.REDIS_PORT, 10),
  },
});

redisClient.on("connect", () => {});

redisClient.on("ready", () => {});

redisClient.on("error", (err) => {
  console.error("❌ Redis client error:", err);
});

redisClient.on("end", () => {});

// Connect to Redis
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    throw error;
  }
};

// Cache utility functions
export const cacheHelper = {
  set: async (
    key: string,
    value: any,
    ttlSeconds: number = parseInt(Env.CACHE_EXPIRE)
  ) => {
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttlSeconds, serializedValue);
    } catch (error) {
      console.error(`❌ Cache set error for ${key}:`, error);
    }
  },

  // Get cache
  get: async (key: string) => {
    try {
      const cachedValue = await redisClient.get(key);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }

      return null;
    } catch (error) {
      console.error(`❌ Cache get error for ${key}:`, error);
      return null;
    }
  },

  // Delete cache
  del: async (key: string) => {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`❌ Cache delete error for ${key}:`, error);
    }
  },

  // Delete cache pattern
  delPattern: async (pattern: string) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`❌ Cache pattern delete error for ${pattern}:`, error);
    }
  },

  // Check if key exists
  exists: async (key: string) => {
    try {
      return await redisClient.exists(key);
    } catch (error) {
      console.error(`❌ Cache exists error for ${key}:`, error);
      return false;
    }
  },

  // Get TTL
  ttl: async (key: string) => {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error(`❌ Cache TTL error for ${key}:`, error);
      return -1;
    }
  },
};

export default redisClient;
