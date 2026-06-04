import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    };

export const pool = new Pool(poolConfig);

export async function findOrCreateUser(userData) {
  try {
    const { email, name, picture } = userData;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return existingUser.rows[0];
    }

    // Create new user
    const newUser = await pool.query(
      'INSERT INTO users (email, name, picture) VALUES ($1, $2, $3) RETURNING *',
      [email, name, picture]
    );

    return newUser.rows[0];
  } catch (error) {
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
}

export async function getGoals(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching goals: ${error.message}`);
  }
}

export async function createGoal(userId, goalData) {
  try {
    const { title, description, targetAmount, deadline } = goalData;
    const result = await pool.query(
      'INSERT INTO goals (user_id, title, description, target_amount, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, description, targetAmount, deadline]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating goal: ${error.message}`);
  }
}

export async function getBills(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM bills WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching bills: ${error.message}`);
  }
}

export async function createBill(userId, billData) {
  try {
    const { name, amount, dueDate, frequency } = billData;
    const result = await pool.query(
      'INSERT INTO bills (user_id, name, amount, due_date, frequency) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, amount, dueDate, frequency]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating bill: ${error.message}`);
  }
}

export async function getBusinesses(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM businesses WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching businesses: ${error.message}`);
  }
}

export async function createBusiness(userId, businessData) {
  try {
    const { name, description, category } = businessData;
    const result = await pool.query(
      'INSERT INTO businesses (user_id, name, description, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, description, category]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating business: ${error.message}`);
  }
}

export async function getTransactions(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
}
