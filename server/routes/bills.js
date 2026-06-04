import express from 'express';
import * as db from '../db.js';

const router = express.Router();

router.get('/:userId/bills', async (req, res) => {
    try {
        const bills = await db.getBills(req.params.userId);
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId/bills', async (req, res) => {
    try {
        const newBill = await db.createBill(req.params.userId, req.body);
        res.status(201).json(newBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
