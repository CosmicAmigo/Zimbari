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

function decodeJwt(token) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing credential' });

  try {
    const profile = decodeJwt(credential);
    const result = await query(
      `INSERT INTO users (google_sub, google_token, email, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_sub)
       DO UPDATE SET google_token = EXCLUDED.google_token, email = EXCLUDED.email, name = EXCLUDED.name
       RETURNING id, email, name, google_sub`,
      [profile.sub, credential, profile.email, profile.name]
    );
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: 'Invalid Google token' });
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
