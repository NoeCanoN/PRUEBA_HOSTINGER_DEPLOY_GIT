import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { createPinia } from 'pinia';
import '@mdi/font/css/materialdesignicons.css';

// Importar plugins e integraciones
import App from './App.vue';
import router from './routes';
import './plugins/axios';

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'lightTheme',
        themes: {
            lightTheme: {
                colors: {
                    primary: '#1867C0',
                    secondary: '#5CBBF6',
                    orange: '#f97316',
                },
            },
        },
    },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);

app.mount('#app');

