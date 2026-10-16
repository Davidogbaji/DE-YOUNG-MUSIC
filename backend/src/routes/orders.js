import express from 'express';
import { store } from '../db/store.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create new order (Public)
router.post('/', (req, res) => {
  try {
    const { customer, items, paymentMethod, deliveryFee, subtotal, total } = req.body;

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ error: { message: 'Customer name and phone number are required.' } });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: { message: 'Order must contain at least one item.' } });
    }

    // Verify stock availability
    for (const item of items) {
      const prod = store.getProductByIdOrSlug(item.id);
      if (prod && prod.stock < item.quantity) {
        return res.status(400).json({
          error: {
            message: `Not enough stock available for ${prod.name}. Currently available: ${prod.stock}`
          }
        });
      }
    }

    const order = store.createOrder({
      customer,
      items,
      paymentMethod,
      deliveryFee,
      subtotal,
      total
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: { message: 'Failed to process order.' } });
  }
});

// List orders (Admin)
router.get('/', requireAdmin, (req, res) => {
  try {
    const { status, search } = req.query;
    const orders = store.getOrders({ status, search });

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: { message: 'Failed to fetch orders.' } });
  }
});

// Single order by orderNumber (Public or Admin, with order number)
router.get('/:orderNumber', (req, res) => {
  try {
    const order = store.data.orders.find(o => o.orderNumber === req.params.orderNumber || o.id === req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found.' } });
    }

    return res.json({
      success: true,
      order
    });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to fetch order.' } });
  }
});

// Update order status (Admin)
router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: { message: 'Status is required.' } });
    }

    const updated = store.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: { message: 'Order not found.' } });
    }

    return res.json({
      success: true,
      message: 'Order status updated successfully.',
      order: updated
    });
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: { message: 'Failed to update order status.' } });
  }
});

export default router;
