<template>
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
      <div class="d-flex align-center justify-space-between w-100" v-if="!rail">
        <v-btn
          v-if="!display.mobile.value"
          variant="text"
          color="primary"
          icon="mdi-menu"
          @click="rail = !rail"
        />
      </div>

      <div class="d-flex flex-column align-center w-100" style="gap: 12px;" v-else>
        <v-btn
          v-if="!display.mobile.value"
          variant="text"
          color="primary"
          icon="mdi-menu"
          @click="rail = !rail"
        />
      </div>
      <div class="cn-section-label" v-if="!rail">Menú</div>
    </div>


    <!-- Navegación -->
    <v-list nav density="comfortable" class="cn-nav">
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :to="item.route"
        :prepend-icon="item.icon"
        :value="item.value"
        exact
        rounded="xl"
        class="cn-nav-item"
        active-class="cn-nav-item--active"
      >
        <v-list-item-title v-if="!rail">{{ item.title }}</v-list-item-title>
        
        <v-tooltip
          v-if="rail"
          activator="parent"
          location="right"
          transition="scale-transition"
          content-class="cn-tooltip"
        >
          {{ item.title }}
        </v-tooltip>
      </v-list-item>
    </v-list>

    <!-- Tarjeta de plan (solo cuando no está colapsado) -->
    <!-- <template #append>
      <div v-if="!rail" class="cn-upgrade-card">
        <div class="cn-upgrade-glow"></div>
        <v-icon icon="mdi-seed-outline" color="white" class="mb-2" />
        <div class="cn-upgrade-title">Plan Premium</div>
        <div class="cn-upgrade-text">Desbloquea planes y seguimiento avanzado.</div>
        <v-btn block color="white" size="small" class="cn-upgrade-btn mt-3" prepend-icon="mdi-star-outline">
          Mejorar
        </v-btn>
      </div>
    </template> -->
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useDisplay } from 'vuetify';

const drawer = defineModel('drawer', { type: Boolean, default: true });
const rail = defineModel('rail', { type: Boolean, default: false });

const authStore = useAuthStore();
const display = useDisplay();

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

</script>

<style scoped>
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
  height: 100vh !important;
}

/* Marca */
.cn-brand {
  display: flex;
  align-items: center;
  padding: 13px;
}

.cn-brand--rail {
  justify-content: center;
  padding: 13px 0;
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
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #000000;
}

/* Items de navegación */
.cn-nav {
  padding: 4px 12px !important;
  background: transparent !important;
}

.cn-nav-item {
  color: #334155 !important;
  font-weight: 600 !important;
  margin-bottom: 6px !important;
  border-radius: 12px !important; /* Estilo redondeado inicial y orgánico */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.cn-nav-item :deep(.v-list-item__spacer) {
  width: 14px !important;
}

.cn-nav-item:hover {
  transform: translateX(4px);
  border-radius: 16px 8px 16px 16px !important; /* Transición orgánica suave al pasar el cursor */
}

.cn-nav-item :deep(.v-list-item__overlay) {
  background: rgba(249, 115, 22, 0.08) !important;
}

/* Estilos para la versión compacta (rail) */
.cn-sidebar.v-navigation-drawer--rail :deep(.cn-nav) {
  padding: 4px 8px !important;
}

.cn-sidebar.v-navigation-drawer--rail :deep(.cn-nav-item) {
  width: 48px !important;
  height: 48px !important;
  margin-inline: auto !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border-radius: 12px !important; /* Squircle orgánico en vez de círculo perfecto */
  margin-bottom: 8px !important;
}

.cn-sidebar.v-navigation-drawer--rail :deep(.cn-nav-item:hover) {
  transform: scale(1.08) !important; /* Micro-animación de escala en vez de traslación */
  border-radius: 16px 8px 16px 16px !important;
}

.cn-sidebar.v-navigation-drawer--rail :deep(.v-list-item__prepend) {
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}

.cn-sidebar.v-navigation-drawer--rail :deep(.v-list-item__prepend .v-icon) {
  margin: 0 !important;
}

.cn-sidebar.v-navigation-drawer--rail :deep(.v-list-item__content) {
  display: none !important;
}

.cn-sidebar.v-navigation-drawer--rail :deep(.cn-nav-item--active) {
  transform: scale(1.05) !important; /* Escala sutil en modo rail en vez de traslación */
  border-radius: 16px 6px 16px 16px !important; /* Estilo orgánico compacto */
}

/* Item activo */
.cn-nav-item--active {
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%) !important;
  color: #ffffff !important;
  border-radius: 20px 6px 20px 20px !important; /* Forma de hoja/pebble orgánica y muy redondeada */
  box-shadow: 0 10px 22px rgba(249, 115, 22, 0.35) !important;
  transform: translateX(4px) !important; /* Sobresale sutilmente cuando está activo */
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

/* Botón toggle en la marca */
.cn-brand-toggle {
  margin-left: auto;
}

@media (max-width: 960px) {
  .cn-sidebar {
    margin: 0;
    border-radius: 0 !important;
    height: 100vh !important;
  }
}
</style>
