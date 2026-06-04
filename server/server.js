import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import goalsRouter from './routes/goals.js';
import billsRouter from './routes/bills.js';
import businessesRouter from './routes/businesses.js';
import transactionsRouter from './routes/transactions.js';
import { findOrCreateUser } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/goals', goalsRouter);
app.use('/api/bills', billsRouter);
app.use('/api/businesses', businessesRouter);
app.use('/api/transactions', transactionsRouter);

app.post('/api/auth/google', async (req, res) => {
  try {
    const user = await findOrCreateUser(req.body);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Catch-all route for SPA - must come AFTER all API routes
app.get('/:path(*)', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
