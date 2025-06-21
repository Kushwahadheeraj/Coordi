import express from 'express';
import { fetchOfficialUpdates } from '../services/browseService.js';
import mockAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/disasters/:id/official-updates', mockAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = await fetchOfficialUpdates(id);
    res.json(updates);
  } catch (err) { next(err); }
});

export default router; 