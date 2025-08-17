import getEnv from "../utils/getEnv.util.js";


const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),

  PORT: getEnv("PORT", "8000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  DB_URL: getEnv("DB_URL"),

  JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m") as string,
  REDIS_HOST: getEnv("REDIS_HOST", "localhost"),
  REDIS_PORT: getEnv("REDIS_PORT", "6379"),
  REDIS_PASSWORD: getEnv("REDIS_PASSWORD", "your_redis_password"),
  CACHE_EXPIRE: getEnv("CACHE_EXPIRE", "1800"),
  
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
  USER_URL: getEnv("USER_URL", "http://localhost:8000"),
  ADMIN_URL: getEnv("ADMIN_URL", "http://localhost:7000"),
});

export const Env = envConfig();