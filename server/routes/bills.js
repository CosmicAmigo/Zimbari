
const express = require('express');
const router = express.Router();
const db = require('../db');

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

module.exports = router;
