import { defineStore } from 'pinia';
import axios from 'axios';

export const useHealthStore = defineStore('health', {
    state: () => ({
        status: null,
        service: null,
        loading: false,
        error: null,
    }),
    actions: {
        async check() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get('/api/health');
                this.status = data.status;
                this.service = data.service;
            } catch (e) {
                this.error = `Error llamando a /api/health: ${e.message}`;
            } finally {
                this.loading = false;
            }
        },
    },
});
