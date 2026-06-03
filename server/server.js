import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import billsRouter from './routes/bills.js';
import businessesRouter from './routes/businesses.js';
import goalsRouter from './routes/goals.js';
import transactionsRouter from './routes/transactions.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', dashboardRouter);
app.use('/api/bills', billsRouter);
app.use('/api/businesses', businessesRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/transactions', transactionsRouter);

// Serve static files
const staticPath = path.join(__dirname, '..', 'dist');
app.use(express.static(staticPath));

// Catch-all to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
