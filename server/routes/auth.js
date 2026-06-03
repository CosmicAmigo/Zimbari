import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../db.js';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user;
    const result = await pool.query('SELECT * FROM users WHERE google_sub = $1', [sub]);

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      const newUser = await pool.query(
        'INSERT INTO users (google_sub, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *',
        [sub, email, name, picture]
      );
      user = newUser.rows[0];
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(400).json({ error: 'Google sign-in failed.' });
  }
});

export default router;