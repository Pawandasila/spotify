import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Env } from "./config/env.config.js";
import { AsyncHandler } from "./middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "./config/Https.config.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.middleware.js";
import { waitForDatabase, testDatabaseConnection } from "./db/index.js";
import songRoutes from './routes/song.route.js';
import playlistRoutes from './routes/playlist.route.js';
import { connectRedis, redisClient } from "./config/redis.config.js";

const app = express();

const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      Env.FRONTEND_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get(
  "/",
  AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();

    res.status(HTTPSTATUS.OK).json({
      message: "Song Service is running",
      date,
      service: "spotify-song-service",
    });
  })
);

app.get(
  "/health",
  AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dbStatus = await testDatabaseConnection();
    
    // Check Redis status
    let redisStatus = "disconnected";
    try {
      if (redisClient.isOpen) {
        await redisClient.ping();
        redisStatus = "connected";
      }
    } catch (error) {
      redisStatus = "error";
    }

    res.status(HTTPSTATUS.OK).json({
      service: "Song Service",
      status: "healthy",
      database: dbStatus ? "connected" : "disconnected",
      redis: redisStatus,
      timestamp: new Date().toISOString(),
      port: Env.PORT,
    });
  })
);

//routes
app.use(`${BASE_PATH}/v1/songs`, songRoutes);
app.use(`${BASE_PATH}/v1/playlists`, playlistRoutes);


app.use(ErrorHandler);

const startServer = async () => {
  try {
    console.log("🚀 Starting Song Service...");

    // Initialize database
    await waitForDatabase();

    // Initialize Redis
    await connectRedis();

    app.listen(Env.PORT, () => {
      console.log(
        `✅ Song Service running on port ${Env.PORT} in ${Env.NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.error("🔄 Please check your database and Redis connections and try again");
    process.exit(1);
  }
};

startServer();

export default app;
