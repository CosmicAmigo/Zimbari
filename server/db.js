
const pg = require("pg");

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

async function findOrCreateUser(profile) {
  const { sub, name, email, picture } = profile;
  const findQuery = "SELECT * FROM users WHERE google_sub = $1";
  const insertQuery =
    "INSERT INTO users (google_sub, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *";

  try {
    const { rows } = await client.query(findQuery, [sub]);
    if (rows.length > 0) {
      return rows[0];
    }

    const newUsers = await client.query(insertQuery, [sub, name, email, picture]);
    return newUsers.rows[0];
  } catch (error) {
    console.error("Error finding or creating user:", error);
    throw error;
  }
}

async function getGoals(userId) {
  const query = "SELECT * FROM goals WHERE user_id = $1";
  try {
    const { rows } = await client.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Error getting goals:", error);
    throw error;
  }
}

async function createGoal(userId, goal) {
  const { name, amount } = goal;
  const query =
    "INSERT INTO goals (user_id, name, amount) VALUES ($1, $2, $3) RETURNING *";
  try {
    const { rows } = await client.query(query, [userId, name, amount]);
    return rows[0];
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
}

async function getBills(userId) {
    const query = "SELECT * FROM bills WHERE user_id = $1";
    try {
        const { rows } = await client.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error("Error getting bills:", error);
        throw error;
    }
}

async function createBill(userId, bill) {
    const { name, amount, due_date } = bill;
    const query = "INSERT INTO bills (user_id, name, amount, due_date) VALUES ($1, $2, $3, $4) RETURNING *";
    try {
        const { rows } = await client.query(query, [userId, name, amount, due_date]);
        return rows[0];
    } catch (error) {
        console.error("Error creating bill:", error);
        throw error;
    }
}

async function getBusinesses(userId) {
    const query = "SELECT * FROM businesses WHERE user_id = $1";
    try {
        const { rows } = await client.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error("Error getting businesses:", error);
        throw error;
    }
}

async function createBusiness(userId, business) {
    const { name, business_type, balance } = business;
    const query = "INSERT INTO businesses (user_id, name, business_type, balance) VALUES ($1, $2, $3, $4) RETURNING *";
    try {
        const { rows } = await client.query(query, [userId, name, business_type, balance]);
        return rows[0];
    } catch (error) {
        console.error("Error creating business:", error);
        throw error;
    }
}

async function getTransactions(userId) {
    const query = "SELECT * FROM transactions WHERE user_id = $1";
    try {
        const { rows } = await client.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error("Error getting transactions:", error);
        throw error;
    }
}

module.exports = {
  findOrCreateUser,
  getGoals,
  createGoal,
  getBills,
  createBill,
  getBusinesses,
  createBusiness,
  getTransactions
};
