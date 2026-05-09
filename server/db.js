import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const connection = process.env.DATABASE_URL;

if (!connection) {
  throw new Error('DATABASE_URL is required in environment variables.');
}

export const pool = new Pool({
  connectionString: connection,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
