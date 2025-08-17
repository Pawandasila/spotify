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
import DatabaseConnect from "./config/database.config.js";
import UserRoute from './route/route.js';

const app = express();

const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000', 
      Env.FRONTEND_ORIGIN
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));


app.get(
  "/",
  AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // throw new NotFoundException();
    const date = new Date();

    res.status(HTTPSTATUS.OK).json({
      message: "Hello World",
      date
    });
  })
);

app.use(`${BASE_PATH}/v1/users`, UserRoute);

app.use(ErrorHandler);

// Initialize database connection
const initializeApp = async () => {
  try {
    await DatabaseConnect();
    console.log(`Database connected in ${Env.NODE_ENV} mode.`);
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

app.listen(Env.PORT, async () => {
  await initializeApp();
  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});


export default app;