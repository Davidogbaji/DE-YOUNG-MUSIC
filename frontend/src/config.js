// If VITE_API_URL is provided (e.g., https://your-backend.onrender.com), use it.
// Otherwise default to empty string so requests are relative (works on same-origin or with Vite proxy)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const DEFAULT_WHATSAPP = '2348100090843';
