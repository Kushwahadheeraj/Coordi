import express from 'express';
import { verifyImage } from '../services/geminiService.js';
import mockAuth from '../middleware/auth.js';

const router = express.Router();

router.post('/disasters/:id/verify-image', mockAuth, async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const result = await verifyImage(imageUrl);
    res.json({ result });
  } catch (err) { next(err); }
});

export default router; 