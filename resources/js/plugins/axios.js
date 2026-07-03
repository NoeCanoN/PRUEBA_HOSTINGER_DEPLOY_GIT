import axios from 'axios';
import Cookies from 'js-cookie';

// Configurar URL base por defecto (opcional)
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Interceptor de solicitudes para inyectar el Bearer Token de las Cookies
axios.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuestas para gestionar la expiración de sesión (401)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Eliminar token caducado o inválido
            Cookies.remove('auth_token');
            
            // Redirigir al Login si no estamos en la página de Login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
