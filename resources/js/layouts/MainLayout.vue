<template>
  <div class="app-shell">
    <!-- Fondo a pantalla completa (atardecer de montañas) + scrim sutil -->
    <div class="app-bg" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="app-bg-scrim"></div>
    </div>

    <!-- SIDEBAR -->
    <Sidebar v-model:drawer="drawer" v-model:rail="rail" />

    <!-- HEADER -->
    <Header @toggle-drawer="toggleDrawer" />

    <!-- MAIN -->
    <MainContent />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import bgImage from '../assets/background.webp';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import MainContent from './components/MainContent.vue';

const display = useDisplay();
const drawer = ref(true);
const rail = ref(false);

// Comportamiento del drawer / rail según dispositivo
const toggleDrawer = () => {
  if (display.mobile.value) {
    drawer.value = !drawer.value;
  } else {
    rail.value = !rail.value;
  }
};
</script>

<style scoped>
/* ============================================================
   Fondo a pantalla completa
   ============================================================ */
.app-shell {
  position: relative;
  height: 100vh;
  overflow: hidden;
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
</style>
