import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Login from '../Pages/Auth/Login.vue';
import Dashboard from '../Pages/Dashboard/Dashboard.vue';
import MainLayout from '../layouts/MainLayout.vue';
import Placeholder from '../Pages/Placeholder.vue';
import ArtisanConsole from '../Pages/Console/ArtisanConsole.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { requiresGuest: true }
    },
    {
        path: '/dashboard',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: Dashboard
            },
            {
                path: 'consola',
                name: 'dashboard.consola',
                component: ArtisanConsole
            },
            {
                path: 'planes',
                name: 'dashboard.planes',
                component: Placeholder
            },
            {
                path: 'progreso',
                name: 'dashboard.progreso',
                component: Placeholder
            },
            {
                path: 'miembros',
                name: 'dashboard.miembros',
                component: Placeholder
            },
            {
                path: 'ajustes',
                name: 'dashboard.ajustes',
                component: Placeholder
            }
        ]
    },
    // Captura de rutas no encontradas
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Si hay un token pero no se ha cargado la información del usuario, la recuperamos
    if (authStore.token && !authStore.user) {
        await authStore.fetchUser();
    }

    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Si la ruta requiere autenticación y el usuario no está logueado, va al login
        next({ name: 'login' });
    } else if (to.meta.requiresGuest && isAuthenticated) {
        // Si la ruta es solo para invitados y el usuario ya inició sesión, va al dashboard
        next({ name: 'dashboard' });
    } else {
        next();
    }
});

export default router;
