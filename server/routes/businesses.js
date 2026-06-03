
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:userId/businesses', async (req, res) => {
    try {
        const businesses = await db.getBusinesses(req.params.userId);
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId/businesses', async (req, res) => {
    try {
        const newBusiness = await db.createBusiness(req.params.userId, req.body);
        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
