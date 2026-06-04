import express from 'express';
import * as db from '../db.js';

const router = express.Router();

router.get('/:userId/goals', async (req, res) => {
    try {
        const goals = await db.getGoals(req.params.userId);
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId/goals', async (req, res) => {
    try {
        const newGoal = await db.createGoal(req.params.userId, req.body);
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
