import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { store } from './db/store.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
app.use('/uploads', express.static(config.uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'De Young Musical and City Spot API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// If frontend build exists, serve static React build (Single-Host Deployment)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log('[Server] Serving compiled frontend from:', frontendDistPath);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error occurred.'
    }
  });
});

// Initialize database and start server
async function startServer() {
  await store.init();

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🎵 De Young Musical API Server running!`);
    console.log(`📡 URL: http://localhost:${config.port}`);
    console.log(`🔑 Admin Login Email: ${config.adminEmail}`);
    console.log(`🔑 Default Admin Password: ${config.adminPassword}`);
    console.log(`⚡ Mode: ${config.nodeEnv}`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
