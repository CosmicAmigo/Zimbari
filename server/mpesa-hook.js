import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

app.post('/api/mpesa-hook', async (req, res) => {
  const { amount, reference, source, description } = req.body;
  if (!amount || !reference) {
    return res.status(400).json({ error: 'Missing required transaction fields.' });
  }

  try {
    await query(
      `INSERT INTO transactions (transaction_id, amount, reference, source, description, category, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [reference, amount, reference, source || 'mpesa-hook', description || 'M-Pesa webhook transaction', 'Business']
    );

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook save failed:', error);
    res.status(500).json({ error: 'Unable to save transaction.' });
  }
});

async function verifyGoogleCredential(token) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is required for Google sign-in.');
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
  if (!response.ok) {
    throw new Error('Google token verification failed.');
  }

  const profile = await response.json();
  if (profile.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error('Google token audience does not match GOOGLE_CLIENT_ID.');
  }

  return profile;
}

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing credential' });

  try {
    const profile = await verifyGoogleCredential(credential);
    const result = await query(
      `INSERT INTO users (google_sub, email, name, picture)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_sub)
       DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, picture = EXCLUDED.picture
       RETURNING id, email, name, picture, google_sub`,
      [profile.sub, profile.email, profile.name, profile.picture || null]
    );
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Invalid Google token' });
  }
});

app.get('/api/users/:googleSub/dashboard', async (req, res) => {
  try {
    const userResult = await query(
      'SELECT id, email, name, picture, google_sub FROM users WHERE google_sub = $1',
      [req.params.googleSub]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [transactions, bills, goals, businesses] = await Promise.all([
      query('SELECT id, transaction_id, amount, reference, source, description, category, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [user.id]),
      query('SELECT id, name, amount, due_date, status, created_at FROM bills WHERE user_id = $1 ORDER BY created_at DESC', [user.id]),
      query('SELECT id, name, amount, progress, created_at FROM goals WHERE user_id = $1 ORDER BY created_at DESC', [user.id]),
      query('SELECT id, name, business_type, balance, created_at FROM businesses WHERE user_id = $1 ORDER BY created_at DESC', [user.id])
    ]);

    res.json({
      user,
      transactions: transactions.rows,
      bills: bills.rows,
      goals: goals.rows,
      businesses: businesses.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve user dashboard data' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { id, amount, description, category, date, userGoogleSub } = req.body;
  if (amount === undefined) return res.status(400).json({ error: 'amount is required' });
  try {
    let userId = null;
    if (userGoogleSub) {
      const user = await query('SELECT id FROM users WHERE google_sub = $1', [userGoogleSub]);
      userId = user.rows[0]?.id || null;
    }
    await query(
      `INSERT INTO transactions (transaction_id, user_id, amount, reference, source, description, category, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (transaction_id) DO NOTHING`,
      [id || `tx-${Date.now()}`, userId, amount, id || null, 'app', description || 'manual transaction', category || 'Personal', date || new Date().toISOString()]
    );
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to sync transaction' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Zimbari webhook is healthy' });
});

app.listen(port, () => {
  console.log(`Zimbari server listening on port ${port}`);
});
