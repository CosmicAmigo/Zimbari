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

app.get('/api/health', (req, res) => {
  res.json({ status: 'Zimbari webhook is healthy' });
});

app.listen(port, () => {
  console.log(`Zimbari server listening on port ${port}`);
});
