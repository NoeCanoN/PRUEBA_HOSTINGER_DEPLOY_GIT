<template>
  <div class="dashboard-container">
    <div class="background-overlay"></div>

    <div class="dashboard-card-wrapper">
      <v-card class="mx-auto dashboard-card" max-width="600" elevation="10" rounded="xl">
        <!-- Encabezado del perfil -->
        <v-card-item class="bg-orange text-white py-6">
          <div class="d-flex align-center justify-between w-100">
            <div class="d-flex align-center ga-3">
              <v-avatar color="white" size="48">
                <v-icon icon="mdi-account" color="orange" size="large"></v-icon>
              </v-avatar>
              <div>
                <v-card-title class="text-h5 font-weight-bold leading-tight">
                  ¡Hola, {{ authStore.user?.name || 'Usuario' }}!
                </v-card-title>
                <v-card-subtitle class="text-white-opacity-80">
                  Bienvenido a tu panel de control
                </v-card-subtitle>
              </div>
            </div>
            <!-- Botón de Logout en cabecera -->
            <v-btn
              icon="mdi-logout"
              variant="text"
              color="white"
              :loading="logoutLoading"
              @click="handleLogout"
            ></v-btn>
          </div>
        </v-card-item>

        <!-- Contenido principal del dashboard de prueba -->
        <v-card-text class="pa-6">
          <p class="text-body-1 text-grey-darken-3 mb-6">
            Te has autenticado correctamente en el sistema utilizando <strong>Laravel Sanctum</strong>
            y <strong>Vue 3 (Composition API)</strong> con <strong>Vuetify</strong>.
          </p>

          <!-- Tarjeta de Detalles del Usuario -->
          <v-list lines="two" subheader class="rounded-lg border mb-6 bg-grey-lighten-5">
            <v-list-subheader class="font-weight-bold text-orange text-uppercase">
              Detalles de la Cuenta
            </v-list-subheader>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-account-circle" color="orange" size="large" class="mr-3"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">Nombre Completo</v-list-item-title>
              <v-list-item-subtitle>{{ authStore.user?.name || 'N/A' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-email" color="orange" size="large" class="mr-3"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">Correo Electrónico</v-list-item-title>
              <v-list-item-subtitle>{{ authStore.user?.email || 'N/A' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-key-chain" color="orange" size="large" class="mr-3"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">Estado del Token</v-list-item-title>
              <v-list-item-subtitle class="text-success font-weight-medium">
                Activo y Almacenado en Cookie Segura
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-alert
            type="info"
            variant="tonal"
            color="blue"
            icon="mdi-check-circle"
            class="rounded-lg"
          >
            Tu sesión es completamente segura. Si refrescas la página, se cargará automáticamente tu perfil gracias al middleware de enrutamiento.
          </v-alert>
        </v-card-text>

        <!-- Acciones inferiores -->
        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-grey-lighten-4 d-flex justify-end">
          <v-btn
            color="grey-darken-1"
            variant="flat"
            class="px-4"
            prepend-icon="mdi-logout"
            :loading="logoutLoading"
            @click="handleLogout"
          >
            Cerrar Sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const logoutLoading = ref(false);

const handleLogout = async () => {
  logoutLoading.value = true;
  try {
    await authStore.logout();
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    logoutLoading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #0f172a;
  overflow: hidden;
  font-family: 'Outfit', 'Inter', sans-serif;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f172a 30%, #1e293b 70%);
  z-index: 1;
}

.dashboard-card-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 1.5rem;
}

.dashboard-card {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  background-color: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  overflow: hidden;
}

.text-white-opacity-80 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.w-100 {
  width: 100%;
}
</style>
