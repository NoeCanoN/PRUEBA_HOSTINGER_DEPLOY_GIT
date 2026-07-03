<template>
  <!-- Notificación Toast -->
  <NotificacionToast
    v-model:show="showToast"
    :message="toastMessage"
    :type="toastType"
  />

  <div class="login-container">
    <!-- Capa de fondo con degradado premium -->
    <div class="background-overlay"></div>
    <div class="glow-dots">
      <div class="glow-dot dot-1"></div>
      <div class="glow-dot dot-2"></div>
    </div>

    <!-- Contenedor del contenido principal -->
    <div class="login-wrapper">
      <!-- Sección Izquierda: Branding e Inspiración (sólo visible en pantallas grandes) -->
      <div class="branding-section">
        <div class="branding-content">
          <div class="brand-logo-container">
            <v-icon icon="mdi-leaf" class="brand-icon" size="large"></v-icon>
            <span class="brand-name">Club Nutricional</span>
          </div>
          <h1 class="branding-title">Tu camino hacia un estilo de vida saludable</h1>
          <p class="branding-subtitle">
            Gestiona tus planes nutricionales, haz seguimiento de tus progresos y conecta con expertos en un solo lugar.
          </p>
          <div class="branding-features">
            <div class="feature-item">
              <v-icon icon="mdi-check-circle" color="orange-lighten-2" class="mr-2"></v-icon>
              <span>Planes 100% personalizados</span>
            </div>
            <div class="feature-item">
              <v-icon icon="mdi-check-circle" color="orange-lighten-2" class="mr-2"></v-icon>
              <span>Monitoreo en tiempo real</span>
            </div>
            <div class="feature-item">
              <v-icon icon="mdi-check-circle" color="orange-lighten-2" class="mr-2"></v-icon>
              <span>Recetas y soporte constante</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Derecha: Formulario de Login -->
      <div class="form-section">
        <div class="form-card">
          <!-- Encabezado del login -->
          <div class="form-header">
            <div class="mobile-logo mb-4">
              <v-icon icon="mdi-leaf" color="orange" size="x-large"></v-icon>
              <h2 class="mobile-brand-name">Club Nutricional</h2>
            </div>
            <h2 class="form-title">Bienvenido de nuevo</h2>
            <p class="form-subtitle">Ingresa tus credenciales para acceder a tu panel</p>
          </div>

          <!-- Formulario -->
          <v-form @submit.prevent="handleLogin" class="mt-6">
            <div class="input-group">
              <label class="input-label">Correo Electrónico</label>
              <v-text-field
                v-model="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                color="orange"
                :rules="emailRules"
                hide-details="auto"
                class="custom-input mb-4"
              ></v-text-field>
            </div>

            <div class="input-group">
              <label class="input-label">Contraseña</label>
              <v-text-field
                v-model="password"
                :type="visible ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="comfortable"
                color="orange"
                @click:append-inner="visible = !visible"
                :rules="passwordRules"
                hide-details="auto"
                class="custom-input mb-4"
              ></v-text-field>
            </div>

            <!-- Recordarme -->
            <div class="d-flex align-center justify-between mb-4">
              <v-checkbox
                v-model="rememberMe"
                color="orange"
                hide-details
                density="compact"
                class="custom-checkbox"
              >
                <template v-slot:label>
                  <span class="checkbox-label text-grey-darken-3">Recordarme en este equipo</span>
                </template>
              </v-checkbox>
            </div>

            <!-- Alerta de error -->
            <v-alert
              v-if="msg"
              type="error"
              variant="tonal"
              density="comfortable"
              rounded="lg"
              class="mb-4"
            >
              {{ msg }}
            </v-alert>

            <!-- Botón de Envío con micro-animaciones -->
            <v-btn
              type="submit"
              color="orange-darken-1"
              size="large"
              block
              :loading="loading"
              class="submit-button font-weight-bold"
              elevation="2"
            >
              Iniciar Sesión
            </v-btn>
          </v-form>

          <!-- Botón de Consola de Mantenimiento Temporal -->
          <div class="text-center mt-6">
            <v-btn
              variant="outlined"
              color="orange-lighten-2"
              size="small"
              class="text-none"
              prepend-icon="mdi-console"
              @click="showConsoleDialog = true"
            >
              Mantenimiento de Consola (Temporal)
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Diálogo Modal para la Consola Artisan -->
  <v-dialog v-model="showConsoleDialog" max-width="900" scrollable>
    <v-card class="bg-grey-darken-4 rounded-xl border border-grey-800">
      <v-card-title class="d-flex align-center justify-between bg-grey-darken-3 text-white px-4 py-3">
        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-console" color="orange"></v-icon>
          <span class="font-weight-bold text-subtitle-1">Consola de Mantenimiento Inicial (Temporal)</span>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="showConsoleDialog = false"></v-btn>
      </v-card-title>
      <v-card-text class="pa-4 bg-grey-darken-4">
        <ArtisanConsole temporary />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import NotificacionToast from '../../components/Auth/NotificacionToast.vue';
import ArtisanConsole from '../Console/ArtisanConsole.vue';

const showConsoleDialog = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const visible = ref(false);
const loading = ref(false);
const msg = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('error');

const emailRules = [
  value => !!value || 'El correo electrónico es requerido.',
  value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'El formato de correo no es válido.'
];

const passwordRules = [
  value => !!value || 'La contraseña es requerida.'
];

const handleLogin = async () => {
  if (!email.value || !password.value) return;
  
  loading.value = true;
  msg.value = null;
  
  try {
    const data = await authStore.login(email.value, password.value);
    
    toastMessage.value = '¡Bienvenido al Club Nutricional!';
    toastType.value = 'success';
    showToast.value = true;
    
    // Redirigir al dashboard tras un breve delay para permitir ver el Toast de bienvenida
    setTimeout(() => {
      router.push({ name: 'dashboard' });
    }, 1000);
  } catch (error) {
    toastType.value = 'error';
    if (error.response && error.response.status === 422) {
      // Tomamos el primer error de validación
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const firstKey = Object.keys(validationErrors)[0];
        msg.value = validationErrors[firstKey][0];
      } else {
        msg.value = error.response.data.message || 'Datos incorrectos.';
      }
      toastMessage.value = 'Error de validación';
    } else if (error.response && error.response.status === 401) {
      msg.value = error.response.data.message || 'Credenciales no coinciden.';
      toastMessage.value = 'Acceso denegado';
    } else {
      msg.value = 'Error al conectar con el servidor de autenticación.';
      toastMessage.value = 'Error de conexión';
    }
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estructura general y fondos */
.login-container {
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
  background: linear-gradient(135deg, #0f172a 30%, #1e1e38 70%);
  z-index: 1;
}

.glow-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.glow-dot {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}

.dot-1 {
  width: 400px;
  height: 400px;
  background-color: #f97316;
  top: -100px;
  right: -100px;
}

.dot-2 {
  width: 500px;
  height: 500px;
  background-color: #3b82f6;
  bottom: -150px;
  left: -150px;
}

/* Wrapper del Login */
.login-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  min-height: 600px;
  display: flex;
  margin: 1.5rem;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Sección Izquierda: Branding */
.branding-section {
  display: none;
  width: 50%;
  background: linear-gradient(180deg, rgba(249, 115, 22, 0.9) 0%, rgba(234, 88, 12, 0.95) 100%);
  padding: 3.5rem;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.branding-section::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.15), transparent);
  pointer-events: none;
}

@media (min-width: 1024px) {
  .branding-section {
    display: flex;
  }
}

.branding-content {
  color: #ffffff;
}

.brand-logo-container {
  display: flex;
  align-center: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.brand-icon {
  font-size: 2rem !important;
  color: #ffffff;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.branding-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.branding-subtitle {
  font-size: 1.05rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2.5rem;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1rem;
}

/* Sección Derecha: Formulario */
.form-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: rgba(30, 41, 59, 0.3);
}

@media (min-width: 1024px) {
  .form-section {
    width: 50%;
  }
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
}

@media (min-width: 1024px) {
  .form-header {
    text-align: left;
  }
}

.mobile-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 1024px) {
  .mobile-logo {
    display: none;
  }
}

.mobile-brand-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f97316;
}

.form-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-top: 0.35rem;
}

/* Personalización de Inputs de Vuetify */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
}

.custom-input :deep(.v-field) {
  border-radius: 12px !important;
  background-color: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  transition: all 0.25s ease !important;
}

.custom-input :deep(.v-field--focused) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
}

.custom-input :deep(.v-field__input) {
  color: #ffffff !important;
}

.custom-input :deep(.v-field__prepend-inner) {
  color: #94a3b8 !important;
}

.custom-input :deep(.v-field__append-inner) {
  color: #94a3b8 !important;
  cursor: pointer;
}

/* Recordarme checkbox */
.custom-checkbox :deep(.v-label) {
  color: #cbd5e1 !important;
  font-size: 0.875rem !important;
  opacity: 1 !important;
}

/* Botón de Login */
.submit-button {
  height: 48px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  letter-spacing: 0.2px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3) !important;
}

.submit-button:active {
  transform: translateY(0);
}
</style>
