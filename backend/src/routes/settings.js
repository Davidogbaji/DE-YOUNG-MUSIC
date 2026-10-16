import express from 'express';
import { store } from '../db/store.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const settings = store.getSettings();
    return res.json({
      success: true,
      settings
    });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to fetch settings.' } });
  }
});

router.put('/', requireAdmin, (req, res) => {
  try {
    const updated = store.updateSettings(req.body);
    return res.json({
      success: true,
      message: 'Store settings updated successfully.',
      settings: updated
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ error: { message: 'Failed to update settings.' } });
  }
});

export default router;
