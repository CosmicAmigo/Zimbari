import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Get all dashboard data for a user
router.get('/:userId/dashboard', async (req, res) => {
  const { userId } = req.params;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE google_sub = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userRes.rows[0];

    const [billsRes, goalsRes, businessesRes, transactionsRes] = await Promise.all([
      pool.query('SELECT * FROM bills WHERE user_id = $1', [user.id]),
      pool.query('SELECT * FROM goals WHERE user_id = $1', [user.id]),
      pool.query('SELECT * FROM businesses WHERE user_id = $1', [user.id]),
      pool.query('SELECT * FROM transactions WHERE user_id = $1', [user.id]),
    ]);

    res.json({
      user,
      bills: billsRes.rows,
      goals: goalsRes.rows,
      businesses: businessesRes.rows,
      transactions: transactionsRes.rows,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new transaction
router.post('/:userId/transactions', async (req, res) => {
  const { userId } = req.params;
  const { amount, reference, description, category } = req.body;

  try {
    const userRes = await pool.query('SELECT id FROM users WHERE google_sub = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userRes.rows[0];

    const newTransaction = await pool.query(
      'INSERT INTO transactions (user_id, amount, reference, description, category, transaction_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.id, amount, reference, description, category, `txn_${Date.now()}`]
    );

    res.status(201).json(newTransaction.rows[0]);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
