
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:userId/transactions', async (req, res) => {
    try {
        const transactions = await db.getTransactions(req.params.userId);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
