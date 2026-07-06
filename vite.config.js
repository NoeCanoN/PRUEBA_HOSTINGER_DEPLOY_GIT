import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
    plugins: [
        VueDevTools({
            appendTo: 'resources/js/app.js',
            launchEditor: 'antigravity',
        }),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        // https://vuetifyjs.com/en/features/treeshaking/
        vuetify({ autoImport: true }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
