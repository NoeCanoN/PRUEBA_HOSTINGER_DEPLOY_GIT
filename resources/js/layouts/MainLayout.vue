<template>
  <div class="app-shell">
    <!-- Fondo a pantalla completa (atardecer de montañas) + scrim sutil -->
    <div class="app-bg" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="app-bg-scrim"></div>
    </div>

    <!-- ============================================================
         HEADER
         ============================================================ -->
    <v-app-bar flat class="cn-header" height="72">
      <v-app-bar-nav-icon
        color="primary"
        variant="text"
        class="mr-1"
        @click="toggleDrawer"
      />

      <div class="cn-page-heading">
        <h1 class="cn-page-title">{{ pageTitle }}</h1>
        <p class="cn-page-sub">{{ pageSubtitle }}</p>
      </div>

      <v-spacer />

      <!-- Buscador (escritorio) -->
      <div class="cn-search d-none d-md-flex align-center">
        <v-icon icon="mdi-magnify" size="small" color="grey-darken-1" class="ml-3" />
        <input type="text" placeholder="Buscar..." class="cn-search-input" />
        <span class="cn-search-kbd">⌘K</span>
      </div>

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

    <!-- ============================================================
         SIDEBAR
         ============================================================ -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      :permanent="!display.mobile.value"
      :temporary="display.mobile.value"
      floating
      :width="280"
      :rail-width="86"
      elevation="0"
      class="cn-sidebar"
    >
      <!-- Marca -->
      <div class="cn-brand" :class="{ 'cn-brand--rail': rail }">
        <div class="cn-brand-mark">
          <v-icon icon="mdi-leaf" size="large" color="white" />
        </div>
        <transition name="fade-x">
          <div v-if="!rail" class="cn-brand-text">
            <span class="cn-brand-title">Club Nutricional</span>
            <span class="cn-brand-sub">Bienestar & Salud</span>
          </div>
        </transition>
      </div>

      <div class="cn-section-label" v-if="!rail">Menú</div>

      <!-- Navegación -->
      <v-list nav density="comfortable" class="cn-nav">
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          exact
          rounded="xl"
          class="cn-nav-item"
          active-class="cn-nav-item--active"
        />
      </v-list>

      <!-- Tarjeta de plan (solo expandido) -->
      <template v-if="!rail" #append>
        <div class="cn-upgrade-card">
          <div class="cn-upgrade-glow"></div>
          <v-icon icon="mdi-seed-outline" color="white" class="mb-2" />
          <div class="cn-upgrade-title">Plan Premium</div>
          <div class="cn-upgrade-text">Desbloquea planes y seguimiento avanzado.</div>
          <v-btn block color="white" size="small" class="cn-upgrade-btn mt-3" prepend-icon="mdi-star-outline">
            Mejorar
          </v-btn>
        </div>
      </template>

      <!-- Botón colapsar (rail) -->
      <template v-else #append>
        <div class="cn-rail-toggle">
          <v-btn
            variant="text"
            color="primary"
            icon="mdi-chevron-double-right"
            @click="rail = false"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- ============================================================
         MAIN
         ============================================================ -->
    <v-main class="cn-main">
      <v-container fluid class="cn-container">
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
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useDisplay } from 'vuetify';
import gsap from 'gsap';
import bgImage from '../assets/background.webp';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const display = useDisplay();

const drawer = ref(true);
const rail = ref(false);
const logoutLoading = ref(false);

// Menú de navegación (filtrado por permisos)
const menuItems = computed(() => {
  const base = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', value: 'dashboard', route: '/dashboard' },
    { title: 'Planes Dietéticos', icon: 'mdi-food-apple-outline', value: 'diet', route: '/dashboard/planes' },
    { title: 'Seguimiento', icon: 'mdi-chart-line', value: 'progress', route: '/dashboard/progreso' },
    { title: 'Miembros', icon: 'mdi-account-group-outline', value: 'members', route: '/dashboard/miembros' },
  ];

  if (authStore.user?.email === 'admin@clubnutricional.com') {
    base.push({ title: 'Consola Artisan', icon: 'mdi-console', value: 'console', route: '/dashboard/consola' });
  }

  base.push({ title: 'Ajustes', icon: 'mdi-cog-outline', value: 'settings', route: '/dashboard/ajustes' });
  return base;
});

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

// Comportamiento del drawer / rail según dispositivo
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

// Animaciones de entrada
onMounted(() => {
  gsap.from('.cn-sidebar', { x: -300, opacity: 0, duration: 0.7, ease: 'power3.out' });
  gsap.from('.cn-header', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
  gsap.from('.cn-nav-item', { x: -24, opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.25, ease: 'power2.out' });
  gsap.from('.cn-page-heading', { y: 16, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
  gsap.from('.cn-container', { y: 24, opacity: 0, duration: 0.7, delay: 0.35, ease: 'power2.out' });
});
</script>

<style scoped>
/* ============================================================
   Fondo a pantalla completa
   ============================================================ */
.app-shell {
  position: relative;
  min-height: 100vh;
}

.app-bg {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.app-bg-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.12) 30%, rgba(15, 23, 42, 0.45) 100%);
}

/* ============================================================
   SIDEBAR — glassmorphism
   ============================================================ */
.cn-sidebar {
  background: rgba(255, 255, 255, 0.62) !important;
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-right: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 8px 0 40px rgba(15, 23, 42, 0.08) !important;
  border-radius: 0 !important;
  margin: 0 !important;
  height: calc(100vh - 72px) !important;
}

/* Marca */
.cn-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px 14px;
}

.cn-brand--rail {
  justify-content: center;
  padding: 18px 0;
}

.cn-brand-mark {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #F97316 0%, #EA580C 60%, #F59E0B 100%);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.45);
}

.cn-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  overflow: hidden;
}

.cn-brand-title {
  font-weight: 800;
  font-size: 1.05rem;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.cn-brand-sub {
  font-size: 0.72rem;
  font-weight: 500;
  color: #EA580C;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cn-section-label {
  padding: 8px 22px 6px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94A3B8;
}

/* Items de navegación */
.cn-nav {
  padding: 4px 12px !important;
}

.cn-nav-item {
  color: #334155 !important;
  font-weight: 600 !important;
  margin-bottom: 4px !important;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.25s ease, color 0.25s ease !important;
}

.cn-nav-item :deep(.v-list-item__spacer) {
  width: 14px !important;
}

.cn-nav-item:hover {
  transform: translateX(4px);
}

.cn-nav-item :deep(.v-list-item__overlay) {
  background: rgba(249, 115, 22, 0.08) !important;
}

/* Item activo */
.cn-nav-item--active {
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 22px rgba(249, 115, 22, 0.4) !important;
  transform: translateX(0) !important;
}

.cn-nav-item--active :deep(.v-icon) {
  color: #ffffff !important;
}

.cn-nav-item--active :deep(.v-list-item-title) {
  color: #ffffff !important;
  font-weight: 700 !important;
}

.cn-nav-item--active :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

/* Tarjeta de upgrade */
.cn-upgrade-card {
  position: relative;
  overflow: hidden;
  margin: 12px;
  padding: 18px;
  border-radius: 20px;
  color: #fff;
  text-align: center;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cn-upgrade-glow {
  position: absolute;
  inset: -40% -20% auto auto;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.55), transparent 70%);
  filter: blur(10px);
}

.cn-upgrade-title {
  font-weight: 800;
  font-size: 1rem;
}

.cn-upgrade-text {
  font-size: 0.75rem;
  opacity: 0.75;
  margin-top: 2px;
  line-height: 1.35;
}

.cn-upgrade-btn {
  color: #EA580C !important;
  font-weight: 700;
  text-transform: none;
}

.cn-rail-toggle {
  display: flex;
  justify-content: center;
  padding: 12px 0 18px;
}

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
  margin-left: 4px;
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

/* ============================================================
   MAIN
   ============================================================ */
.cn-main {
  background: transparent !important;
  padding-top: 88px !important;
  min-height: 100vh;
}

.cn-container {
  max-width: 1320px;
  padding: 8px 24px 40px !important;
}

/* ============================================================
   Transiciones
   ============================================================ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-x-enter-active,
.fade-x-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-x-enter-from,
.fade-x-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 960px) {
  .cn-sidebar {
    margin: 0;
    border-radius: 0 !important;
    height: 100vh !important;
  }

  .cn-main {
    padding-top: 88px !important;
  }

  .cn-container {
    padding: 8px 16px 32px !important;
  }
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
