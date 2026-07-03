import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { createPinia } from 'pinia';
import '@mdi/font/css/materialdesignicons.css';

// Importar plugins e integraciones
import App from './App.vue';
import router from './routes';
import './plugins/axios';

/*
 |----------------------------------------------------------------------
 | Tema "Atardecer" — paleta armonizada con background.webp
 | (cielo azul -> dorado -> naranja, montañas slate/plum)
 |----------------------------------------------------------------------
 */
const sunsetTheme = {
    dark: false,
    colors: {
        primary: '#F97316',            // Naranja atardecer (marca / acciones)
        'primary-darken-1': '#EA580C', // Naranja profundo
        'primary-lighten-5': '#FFF7ED',
        secondary: '#0F172A',          // Slate casi negro (montañas / texto fuerte)
        'secondary-lighten-1': '#1E293B',
        accent: '#F59E0B',             // Dorado sol
        info: '#38BDF8',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-variant': '#F8FAFC',
    },
    variables: {
        'border-color': '#E2E8F0',
        'border-opacity': 1,
        'medium-emphasis-opacity': 0.7,
    },
};

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'sunsetTheme',
        themes: {
            sunsetTheme,
        },
    },
    defaults: {
        VBtn: {
            style: 'text-transform: none; letter-spacing: normal;',
            rounded: 'lg',
        },
        VCard: { rounded: 'xl' },
        VTextField: { rounded: 'lg', variant: 'outlined', color: 'primary' },
    },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);

app.mount('#app');
