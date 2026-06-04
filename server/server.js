const express = require('express');
const path = require('path');
const goalsRouter = require('./routes/goals');
const billsRouter = require('./routes/bills');
const businessesRouter = require('./routes/businesses');
const transactionsRouter = require('./routes/transactions');
const { findOrCreateUser } = require('./db');

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
