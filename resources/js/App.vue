<script setup>
import { onMounted } from 'vue';
import { useHealthStore } from './stores/health';

const health = useHealthStore();

onMounted(() => {
    health.check();
});
</script>

<template>
    <v-app>
        <v-main>
            <v-container class="py-10">
                <v-card class="mx-auto" max-width="640" elevation="4">
                    <v-card-item>
                        <v-card-title class="d-flex align-center ga-2">
                            <v-icon icon="mdi-heart-pulse" color="primary" />
                            Club Nutricional — Test de despliegue
                        </v-card-title>
                        <v-card-subtitle>
                            Laravel + Vue 3 + Vuetify + Pinia + Axios
                        </v-card-subtitle>
                    </v-card-item>

                    <v-card-text>
                        <p class="mb-4">
                            Si ves esta tarjeta con estilos de Vuetify, el <strong>build de Vite</strong>
                            funciona. Pulsa el botón para que Pinia + Axios llamen al endpoint
                            <code>/api/health</code> de Laravel:
                        </p>

                        <v-btn
                            color="primary"
                            variant="flat"
                            :loading="health.loading"
                            @click="health.check()"
                        >
                            <v-icon start icon="mdi-check-circle" />
                            Probar /api/health
                        </v-btn>

                        <v-alert
                            v-if="health.error"
                            class="mt-4"
                            type="error"
                            density="comfortable"
                            :text="health.error"
                        />

                        <v-alert
                            v-else-if="health.status"
                            class="mt-4"
                            type="success"
                            density="comfortable"
                        >
                            Estado: <strong>{{ health.status }}</strong>
                            — servicio: <strong>{{ health.service }}</strong>
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>
