
const express = import('express');
const path = import('path');
const goalsRouter = import('./routes/goals');
const billsRouter = import('./routes/bills');
const businessesRouter = import('./routes/businesses');
const transactionsRouter = import('./routes/transactions');
const { findOrCreateUser } = import('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
