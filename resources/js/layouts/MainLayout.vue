<template>
  <div class="app-layout">
    <!-- Header (V-App-Bar) -->
    <v-app-bar flat class="header-bar px-4" height="64">
      <!-- Icono de Menú para móvil y alternar colapso en PC -->
      <v-app-bar-nav-icon
        color="orange"
        class="mr-2"
        @click="toggleDrawer"
      ></v-app-bar-nav-icon>

      <!-- Logo y Nombre de la Aplicación -->
      <div class="brand-container d-flex align-center ga-2">
        <v-icon icon="mdi-leaf" color="orange" size="large"></v-icon>
        <span class="brand-name text-orange font-weight-black">Club Nutricional</span>
      </div>

      <v-spacer></v-spacer>

      <!-- Información del Usuario y Menú Desplegable -->
      <v-menu min-width="200px" rounded="lg" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="profile-btn text-none d-flex align-center ga-2 py-2"
            rounded="xl"
          >
            <v-avatar color="orange-lighten-5" size="36">
              <span class="text-orange font-weight-bold text-subtitle-1">
                {{ userInitials }}
              </span>
            </v-avatar>
            <div class="text-left d-none d-sm-block">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 leading-tight">
                {{ authStore.user?.name || 'Usuario' }}
              </div>
              <div class="text-caption text-grey-darken-1 leading-none mt-0.5">
                {{ authStore.user?.email || 'email@ejemplo.com' }}
              </div>
            </div>
            <v-icon icon="mdi-chevron-down" color="grey" size="small"></v-icon>
          </v-btn>
        </template>

        <v-card class="pa-2 profile-menu-card" elevation="8">
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-account-outline"
              title="Mi Perfil"
              value="profile"
              color="orange"
              rounded="md"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-cog-outline"
              title="Configuración"
              value="settings"
              color="orange"
              rounded="md"
            ></v-list-item>
            
            <v-divider class="my-2"></v-divider>

            <v-list-item
              prepend-icon="mdi-logout"
              title="Cerrar Sesión"
              value="logout"
              color="red"
              rounded="md"
              :loading="logoutLoading"
              @click="handleLogout"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Sidebar (V-Navigation-Drawer) -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      elevation="0"
      class="sidebar-drawer"
      :width="260"
    >
      <v-list nav class="nav-list mt-4">
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          exact
          color="orange"
          rounded="lg"
          class="nav-item mb-2"
          active-class="nav-item-active"
        ></v-list-item>
      </v-list>

      <!-- Botón inferior para colapsar en PC -->
      <template v-slot:append v-if="!display.mobile">
        <div class="pa-4 d-flex justify-center border-top">
          <v-btn
            variant="tonal"
            color="orange"
            size="small"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            @click="rail = !rail"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Área de Contenido Principal (V-Main) -->
    <v-main class="main-content bg-slate-50">
      <v-container fluid class="pa-6">
        <!-- Transición suave de entrada de componentes -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useDisplay } from 'vuetify';
import gsap from 'gsap';

const router = useRouter();
const authStore = useAuthStore();
const display = useDisplay();

const drawer = ref(true);
const rail = ref(false);
const logoutLoading = ref(false);

// Menú dinámico de navegación (Filtrado por permisos)
const menuItems = computed(() => {
  const baseMenu = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', value: 'dashboard', route: '/dashboard' },
    { title: 'Planes Dietéticos', icon: 'mdi-food-apple-outline', value: 'diet', route: '/dashboard/planes' },
    { title: 'Seguimiento', icon: 'mdi-chart-line', value: 'progress', route: '/dashboard/progreso' },
    { title: 'Miembros', icon: 'mdi-account-group-outline', value: 'members', route: '/dashboard/miembros' }
  ];

  if (authStore.user?.email === 'admin@clubnutricional.com') {
    baseMenu.push({ title: 'Consola Artisan', icon: 'mdi-console', value: 'console', route: '/dashboard/consola' });
  }

  baseMenu.push({ title: 'Ajustes', icon: 'mdi-cog-outline', value: 'settings', route: '/dashboard/ajustes' });
  return baseMenu;
});

// Iniciales del usuario para el avatar
const userInitials = computed(() => {
  const name = authStore.user?.name || '';
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
});

// Controlar comportamiento del drawer/rail
const toggleDrawer = () => {
  if (display.mobile.value) {
    drawer.value = !drawer.value;
  } else {
    rail.value = !rail.value;
  }
};

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

// Animaciones de entrada al montar el Layout
onMounted(() => {
  // Animación del Sidebar
  gsap.from('.sidebar-drawer', {
    x: -260,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Animación del Header
  gsap.from('.header-bar', {
    y: -64,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Animación escalonada para los items del menú de navegación
  gsap.from('.nav-item', {
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    delay: 0.2,
    ease: 'power2.out'
  });
});
</script>

<style scoped>
/* Contenedor principal */
.app-layout {
  min-height: 100vh;
  display: flex;
  background: radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.15) 0px, transparent 50%),
              radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.12) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(249, 115, 22, 0.08) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
              #f8fafc;
}

/* Header Glassmorphism */
.header-bar {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03) !important;
}

.brand-container {
  user-select: none;
}

.brand-name {
  font-size: 1.25rem;
  letter-spacing: -0.5px;
}

.profile-btn {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.25) !important;
  backdrop-filter: blur(4px);
}

.profile-btn:hover {
  background-color: rgba(249, 115, 22, 0.05) !important;
}

.profile-menu-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  min-width: 220px;
}

/* Sidebar Glassmorphism */
.sidebar-drawer {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.02) !important;
}

.nav-list {
  padding-left: 12px;
  padding-right: 12px;
}

.nav-item {
  color: #475569 !important;
  font-weight: 600;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item :deep(.v-list-item__spacer) {
  width: 16px !important;
}

.nav-item:hover {
  background-color: rgba(249, 115, 22, 0.08) !important;
  color: #ea580c !important;
  transform: translateX(4px);
}

/* Item de menú activo con gradiente y sombra naranja suave */
.nav-item-active {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.35) !important;
  opacity: 1 !important;
}

.nav-item-active :deep(.v-icon) {
  color: #ffffff !important;
}

.nav-item-active :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.nav-item-active :deep(.v-list-item-title) {
  color: #ffffff !important;
}

/* Contenido Principal con fondo transparente */
.main-content {
  height: calc(100vh - 64px);
  overflow-y: auto;
  background-color: transparent !important;
}

.border-right {
  border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
