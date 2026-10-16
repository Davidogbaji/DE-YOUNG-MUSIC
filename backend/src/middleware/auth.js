import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'Authentication required. No authorization token provided.' }
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded.role !== 'ADMIN' && decoded.role !== 'STAFF') {
      return res.status(403).json({
        error: { message: 'Access denied. Administrator privileges required.' }
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { message: 'Invalid or expired token. Please log in again.' }
    });
  }
}
