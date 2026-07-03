import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { createPinia } from 'pinia';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';

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
                },
            },
        },
    },
});

createApp(App)
    .use(vuetify)
    .use(createPinia())
    .mount('#app');
