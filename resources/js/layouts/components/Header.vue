<template>
  <v-app-bar flat class="cn-header" height="72">
    <!-- El botón para abrir/cerrar drawer en móvil se queda en el header -->
    <v-app-bar-nav-icon
      v-if="display.mobile.value"
      color="primary"
      variant="text"
      class="mr-1"
      @click="$emit('toggle-drawer')"
    />

    <div class="cn-page-heading">
      <h1 class="cn-page-title">{{ pageTitle }}</h1>
      <p class="cn-page-sub">{{ pageSubtitle }}</p>
    </div>

    <v-spacer />

    <!-- Notificaciones -->
    <v-btn variant="text" color="primary" icon="mdi-bell-outline" class="ml-1" />

    <!-- Menú de usuario -->
    <v-menu min-width="240" location="bottom end" transition="scale-transition" origin="top end">
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="cn-user-chip">
          <v-avatar size="40" class="cn-user-avatar">
            <span class="text-white font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
          <div class="cn-user-meta d-none d-sm-block">
            <div class="cn-user-name">{{ authStore.user?.name || 'Usuario' }}</div>
            <div class="cn-user-role">{{ userRole }}</div>
          </div>
          <v-icon icon="mdi-chevron-down" size="small" color="grey-darken-2" class="d-none d-sm-block" />
        </div>
      </template>

      <v-card class="cn-user-menu pa-2" elevation="12">
        <div class="cn-user-menu-head">
          <v-avatar size="44" class="cn-user-avatar">
            <span class="text-white font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
          <div class="ml-3 overflow-hidden">
            <div class="font-weight-bold text-truncate">{{ authStore.user?.name || 'Usuario' }}</div>
            <div class="text-caption text-grey-darken-1 text-truncate">{{ authStore.user?.email || '—' }}</div>
          </div>
        </div>
        <v-divider class="my-2" />
        <v-list density="compact" nav class="pa-0">
          <v-list-item prepend-icon="mdi-account-outline" title="Mi Perfil" value="profile" color="primary" rounded="lg" />
          <v-list-item prepend-icon="mdi-cog-outline" title="Configuración" value="settings" color="primary" rounded="lg" />
          <v-divider class="my-2" />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar Sesión"
            value="logout"
            base-color="error"
            color="error"
            rounded="lg"
            :loading="logoutLoading"
            @click="handleLogout"
          />
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useDisplay } from 'vuetify';
import gsap from 'gsap';

defineEmits(['toggle-drawer']);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const display = useDisplay();

const logoutLoading = ref(false);

// Título dinámico según la ruta activa
const routeMeta = {
  dashboard: { title: 'Dashboard', sub: 'Resumen general de tu progreso' },
  'dashboard.planes': { title: 'Planes Dietéticos', sub: 'Gestiona tus planes de nutrición' },
  'dashboard.progreso': { title: 'Seguimiento', sub: 'Mide tu evolución semana a semana' },
  'dashboard.miembros': { title: 'Miembros', sub: 'Administra los miembros del club' },
  'dashboard.consola': { title: 'Consola Artisan', sub: 'Herramientas avanzadas de sistema' },
  'dashboard.ajustes': { title: 'Ajustes', sub: 'Configura tu cuenta y preferencias' },
};
const pageTitle = computed(() => routeMeta[route.name]?.title || 'Dashboard');
const pageSubtitle = computed(() => routeMeta[route.name]?.sub || 'Bienvenido de vuelta');

// Rol ficticio (basado en el email de admin)
const userRole = computed(() =>
  authStore.user?.email === 'admin@clubnutricional.com' ? 'Administrador' : 'Miembro'
);

// Iniciales del avatar
const userInitials = computed(() => {
  const name = authStore.user?.name || '';
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
});

// Logout
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

onMounted(() => {
  gsap.from('.cn-header', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
  gsap.from('.cn-page-heading', { y: 16, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
});
</script>

<style scoped>
/* ============================================================
   HEADER — glassmorphism
   ============================================================ */
.cn-header {
  background: rgba(255, 255, 255, 0.62) !important;
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05) !important;
}

.cn-page-heading {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  margin-left: 30px;
}

.cn-page-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0;
}

.cn-page-sub {
  font-size: 0.78rem;
  color: #64748B;
  margin: 0;
}

/* Buscador */
.cn-search {
  height: 42px;
  width: 240px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.cn-search:focus-within {
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12);
}

.cn-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  color: #0F172A;
  padding: 0 8px;
  min-width: 0;
}

.cn-search-kbd {
  margin: 0 8px;
  padding: 2px 7px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748B;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 6px;
}

/* Chip de usuario */
.cn-user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: 999px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.cn-user-chip:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

.cn-user-avatar {
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%) !important;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

.cn-user-meta {
  line-height: 1.1;
  max-width: 150px;
}

.cn-user-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cn-user-role {
  font-size: 0.72rem;
  color: #64748B;
}

/* Menú desplegable de usuario */
.cn-user-menu {
  border-radius: 18px !important;
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
}

.cn-user-menu-head {
  display: flex;
  align-items: center;
  padding: 6px 6px 10px;
}

@media (max-width: 600px) {
  .cn-page-title {
    font-size: 1.05rem;
  }

  .cn-page-sub {
    display: none;
  }
}
</style>
