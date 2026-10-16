import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'deyoung-music-super-secret-key-2026-secure',
  nodeEnv: process.env.NODE_ENV || 'development',
  adminEmail: process.env.ADMIN_EMAIL || 'ogidithomasiji43@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadsDir: path.join(__dirname, '../../uploads'),
  dataDir: path.join(__dirname, '../data')
};
