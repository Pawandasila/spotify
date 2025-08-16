import mongoose from "mongoose";
import { Env } from "./env.config.js";

const DatabaseConnect = async () => {
  try {
    // Different connection options for local vs cloud MongoDB
    const isLocalMongo = Env.MONGO_URI.includes('localhost') || Env.MONGO_URI.includes('127.0.0.1');
    
    const connectionOptions = isLocalMongo ? {
      // Local MongoDB options (simpler, no TLS)
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    } : {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    };

    await mongoose.connect(Env.MONGO_URI, connectionOptions);

    console.log(`Database connected successfully to ${isLocalMongo ? 'LOCAL' : 'CLOUD'} MongoDB`);
  } catch (error) {
    console.error("Database connection failed:", error);
    
    // More specific error handling
    if (error instanceof mongoose.Error) {
      console.error("Mongoose error details:", error.message);
    }
    
    if (Env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log("Retrying database connection in 5 seconds...");
      setTimeout(() => DatabaseConnect(), 5000);
    }
  }
};

export default DatabaseConnect;