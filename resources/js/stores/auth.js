import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(Cookies.get('auth_token') || null);

    const isAuthenticated = computed(() => !!token.value);
    const getUser = computed(() => user.value);

    /**
     * Iniciar sesión en el backend.
     */
    async function login(email, password) {
        try {
            const response = await axios.post('/api/login', { email, password });
            const data = response.data;

            if (data.access_token) {
                token.value = data.access_token;
                user.value = data.user;

                // Guardar el token en cookies por 1 día
                Cookies.set('auth_token', data.access_token, { expires: 1, secure: true, sameSite: 'strict' });
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener el perfil del usuario autenticado actual.
     */
    async function fetchUser() {
        if (!token.value) return;
        try {
            const response = await axios.get('/api/user');
            user.value = response.data.user;
        } catch (error) {
            clearAuth();
        }
    }

    /**
     * Cerrar sesión en el backend y limpiar cliente.
     */
    async function logout() {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Error al cerrar sesión en el servidor:', error);
        } finally {
            clearAuth();
        }
    }

    /**
     * Limpiar estado de autenticación.
     */
    function clearAuth() {
        user.value = null;
        token.value = null;
        Cookies.remove('auth_token');
    }

    return {
        user,
        token,
        isAuthenticated,
        getUser,
        login,
        fetchUser,
        logout,
        clearAuth
    };
});
