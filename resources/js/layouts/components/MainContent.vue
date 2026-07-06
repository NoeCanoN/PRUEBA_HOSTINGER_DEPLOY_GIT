<template>
  <v-main class="cn-main">
    <v-container fluid class="cn-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>

<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';

onMounted(() => {
  gsap.from('.cn-container', { y: 24, opacity: 0, duration: 0.7, delay: 0.35, ease: 'power2.out' });
});
</script>

<style scoped>
/* ============================================================
   MAIN
   ============================================================ */
.cn-main {
  background: transparent !important;
  height: calc(100vh - var(--v-layout-top)) !important;
  margin-top: var(--v-layout-top) !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  overflow-y: auto !important;
}

.cn-container {
  max-width: calc(100% - 60px);
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

@media (max-width: 960px) {
  .cn-container {
    padding: 8px 16px 32px !important;
  }
}
</style>
