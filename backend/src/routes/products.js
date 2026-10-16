import express from 'express';
import { store } from '../db/store.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// List products
router.get('/', (req, res) => {
  try {
    const {
      q,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort,
      admin
    } = req.query;

    const products = store.getProducts({
      search: q || search,
      category,
      brand,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock,
      featured,
      sort,
      admin: admin === 'true'
    });

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: { message: 'Failed to fetch products.' } });
  }
});

// Single product
router.get('/:idOrSlug', (req, res) => {
  try {
    const product = store.getProductByIdOrSlug(req.params.idOrSlug);
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    // Get 4 related products from the same category
    const related = store
      .getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 4);

    return res.json({
      success: true,
      product,
      related
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: { message: 'Failed to fetch product details.' } });
  }
});

// Create product (Admin)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, category, brand, price, comparePrice, stock, image, description, specs, featured, status } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: { message: 'Product name and price are required.' } });
    }

    const newProduct = store.createProduct({
      name,
      category,
      brand,
      price,
      comparePrice,
      stock,
      image,
      description,
      specs,
      featured,
      status
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: { message: 'Failed to create product.' } });
  }
});

// Update product (Admin)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const updated = store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: { message: 'Failed to update product.' } });
  }
});

// Quick stock update (Admin)
router.patch('/:id/stock', requireAdmin, (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(stock)) {
      return res.status(400).json({ error: { message: 'Valid stock number is required.' } });
    }

    const updated = store.updateStock(req.params.id, stock);
    if (!updated) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    return res.json({
      success: true,
      message: 'Stock updated successfully.',
      product: updated
    });
  } catch (err) {
    console.error('Error updating stock:', err);
    return res.status(500).json({ error: { message: 'Failed to update stock.' } });
  }
});

// Delete product (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const success = store.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: { message: 'Failed to delete product.' } });
  }
});

// Reset demo products (Admin)
router.post('/reset-demo', requireAdmin, (req, res) => {
  try {
    store.resetDemoData();
    return res.json({
      success: true,
      message: 'Demo products and categories restored successfully.'
    });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to reset demo data.' } });
  }
});

export default router;
