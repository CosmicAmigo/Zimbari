import express from 'express';
import * as db from '../db.js';

const router = express.Router();

router.get('/:userId/transactions', async (req, res) => {
    try {
        const transactions = await db.getTransactions(req.params.userId);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
