import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Env } from '../config/env.config.js';
import * as schema from './schema.js';

const client = neon(Env.DB_URL as string);
export const db = drizzle(client, { schema });

export const InitDB = async () => {
  try {
    console.log("Database initialized successfully with Drizzle ORM");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};
