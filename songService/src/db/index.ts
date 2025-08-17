import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Env } from '../config/env.config.js';
import * as schema from './schema.js';

const client = neon(Env.DB_URL as string);
export const db = drizzle(client, { schema });

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔄 Testing database connection...');
    
    const result = await db.execute('SELECT NOW() as current_time');
    
    if (result.rows && result.rows.length > 0) {
      console.log('✅ Database connection successful');
      console.log(`📅 Database time: ${result.rows[0]?.current_time || 'Unknown'}`);
      return true;
    } else {
      console.log('❌ Database connection failed - no data returned');
      return false;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export const waitForDatabase = async (maxRetries: number = 5, retryDelay: number = 2000): Promise<void> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const isConnected = await testDatabaseConnection();
      if (isConnected) {
        return;
      }
    } catch (error) {
      console.error(`Database connection attempt ${attempt}/${maxRetries} failed:`, error);
    }
    
    if (attempt < maxRetries) {
      console.log(`⏳ Retrying database connection in ${retryDelay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw new Error(`Failed to connect to database after ${maxRetries} attempts`);
};

