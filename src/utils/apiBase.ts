// URL base del backend Express.
// En desarrollo web (npm run dev), déjalo vacío y Vite hace el proxy automáticamente.
// En la APK del teléfono, setea VITE_API_URL=http://TU_IP:5000 en el archivo .env
export const API_BASE = import.meta.env.VITE_API_URL ?? '';
