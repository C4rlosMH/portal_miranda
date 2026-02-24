import axios from 'axios';

const api = axios.create({
    // Vite usa import.meta.env para leer el archivo .env
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: Si hay un token guardado, lo adjunta a todas las peticiones futuras
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('portal_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;