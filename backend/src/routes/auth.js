import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';
import { config } from '../config.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required.' }
      });
    }

    const admin = store.getAdminByEmail(email.trim().toLowerCase());
    if (!admin) {
      return res.status(401).json({
        error: { message: 'Invalid email or password.' }
      });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        error: { message: 'Invalid email or password.' }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: { message: 'Server error during login. Please try again.' }
    });
  }
});

// Verify current token
router.get('/me', requireAdmin, (req, res) => {
  return res.json({
    user: req.user
  });
});

// Change admin password
router.post('/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        error: { message: 'New password must be at least 6 characters long.' }
      });
    }

    const admin = store.getAdminByEmail(req.user.email);
    if (!admin) {
      return res.status(404).json({ error: { message: 'Admin not found.' } });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ error: { message: 'Current password does not match.' } });
      }
    }

    await store.updateAdminPassword(admin.email, newPassword);

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: { message: 'Failed to update password.' } });
  }
});

export default router;
