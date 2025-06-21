import express from 'express';
import { fetchSocialMedia } from '../services/socialService.js';
import mockAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/disasters/:id/social-media', mockAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await fetchSocialMedia(id);
    res.json(posts);
    req.app.get('io')?.emit('social_media_updated', { disasterId: id, posts });
  } catch (err) { next(err); }
});

export default router; 