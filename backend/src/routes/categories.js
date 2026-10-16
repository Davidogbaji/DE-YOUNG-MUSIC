import express from 'express';
import { store } from '../db/store.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const categories = store.getCategories();
    const brands = store.getBrands();

    return res.json({
      success: true,
      categories,
      brands
    });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to fetch categories.' } });
  }
});

export default router;
