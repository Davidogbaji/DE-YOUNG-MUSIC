import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ensure upload directory exists
if (!fs.existsSync(config.uploadsDir)) {
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
    const uniqueName = `${cleanBase}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed.'));
    }
  }
});

router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No image file uploaded.' } });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Also generate a Base64 data URI fallback for ephemeral hosting
    let base64Fallback = null;
    try {
      if (req.file.size < 2 * 1024 * 1024) { // Under 2MB
        const fileBuffer = fs.readFileSync(req.file.path);
        base64Fallback = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      }
    } catch (e) {
      // Ignore base64 error if fails
    }

    return res.json({
      success: true,
      url: fileUrl,
      base64: base64Fallback,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: { message: 'Failed to process image upload.' } });
  }
});

export default router;
