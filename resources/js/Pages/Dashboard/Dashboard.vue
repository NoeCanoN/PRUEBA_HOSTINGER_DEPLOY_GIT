<template>
  <div class="cn-dash">
    <!-- ============================================================
         HERO de bienvenida
         ============================================================ -->
    <section class="cn-hero">
      <div class="cn-hero-glow"></div>
      <div class="cn-hero-content">
        <div class="cn-hero-text">
          <span class="cn-hero-badge">
            <v-icon icon="mdi-white-balance-sunny" size="14" /> {{ todayLabel }}
          </span>
          <h2 class="cn-hero-title">
            Hola, {{ firstName }} <span class="cn-wave">👋</span>
          </h2>
          <p class="cn-hero-sub">
            Este es tu resumen diario. Mantente al día con tus metas de nutrición y bienestar.
          </p>
          <div class="cn-hero-actions">
            <v-btn color="white" size="large" class="cn-hero-btn" prepend-icon="mdi-plus">
              Registrar comida
            </v-btn>
            <v-btn variant="outlined" color="white" size="large" class="cn-hero-btn-ghost" prepend-icon="mdi-chart-line">
              Ver progreso
            </v-btn>
          </div>
        </div>

        <!-- Anillo de progreso diario -->
        <div class="cn-ring">
          <v-progress-circular
            :model-value="72"
            :size="140"
            :width="12"
            color="white"
            bg-color="rgba(255,255,255,0.22)"
            rounded
          >
            <div class="cn-ring-inner">
              <span class="cn-ring-value">72%</span>
              <span class="cn-ring-label">Meta diaria</span>
            </div>
          </v-progress-circular>
        </div>
      </div>
    </section>

    <!-- ============================================================
         KPIs del día
         ============================================================ -->
    <section class="cn-kpis">
      <div v-for="kpi in kpis" :key="kpi.label" class="cn-kpi">
        <div class="cn-kpi-icon" :style="{ background: kpi.gradient }">
          <v-icon :icon="kpi.icon" color="white" />
        </div>
        <div class="cn-kpi-body">
          <span class="cn-kpi-value">{{ kpi.value }}</span>
          <span class="cn-kpi-label">{{ kpi.label }}</span>
        </div>
        <span class="cn-kpi-trend" :class="kpi.trendClass">
          <v-icon size="12" :icon="kpi.trendIcon" />
          {{ kpi.trend }}
        </span>
      </div>
    </section>

    <!-- ============================================================
         Grid principal: detalles + tips
         ============================================================ -->
    <section class="cn-grid">
      <!-- Detalles de la cuenta -->
      <article class="cn-card cn-card--details">
        <header class="cn-card-head">
          <div>
            <h3 class="cn-card-title">Detalles de la cuenta</h3>
            <p class="cn-card-sub">Información de tu sesión activa</p>
          </div>
          <span class="cn-status-dot">
            <v-icon icon="mdi-shield-check" size="14" /> Seguro
          </span>
        </header>

        <ul class="cn-detail-list">
          <li>
            <span class="cn-detail-icon"><v-icon icon="mdi-account-circle-outline" /></span>
            <div class="cn-detail-text">
              <span class="cn-detail-key">Nombre</span>
              <span class="cn-detail-val">{{ authStore.user?.name || 'N/A' }}</span>
            </div>
          </li>
          <li>
            <span class="cn-detail-icon"><v-icon icon="mdi-email-outline" /></span>
            <div class="cn-detail-text">
              <span class="cn-detail-key">Correo</span>
              <span class="cn-detail-val text-truncate">{{ authStore.user?.email || 'N/A' }}</span>
            </div>
          </li>
          <li>
            <span class="cn-detail-icon cn-detail-icon--green"><v-icon icon="mdi-shield-key-outline" /></span>
            <div class="cn-detail-text">
              <span class="cn-detail-key">Token Sanctum</span>
              <span class="cn-detail-val cn-detail-val--success">Activo · cookie segura</span>
            </div>
          </li>
        </ul>

        <v-alert
          type="info"
          variant="tonal"
          color="primary"
          icon="mdi-information-outline"
          class="cn-alert"
          density="comfortable"
        >
          Sesión protegida con Laravel Sanctum. Si recargas, tu perfil se carga automáticamente.
        </v-alert>
      </article>

      <!-- Consejos / próximas comidas -->
      <article class="cn-card cn-card--side">
        <header class="cn-card-head">
          <div>
            <h3 class="cn-card-title">Próximas comidas</h3>
            <p class="cn-card-sub">Tu plan de hoy</p>
          </div>
          <v-icon icon="mdi-food-drumstick-outline" color="primary" />
        </header>

        <ul class="cn-meals">
          <li v-for="meal in meals" :key="meal.name" class="cn-meal">
            <span class="cn-meal-emoji">{{ meal.emoji }}</span>
            <div class="cn-meal-text">
              <span class="cn-meal-name">{{ meal.name }}</span>
              <span class="cn-meal-time">{{ meal.time }}</span>
            </div>
            <span class="cn-meal-kcal">{{ meal.kcal }} kcal</span>
          </li>
        </ul>

        <v-btn variant="flat" color="primary" block class="cn-meal-btn" prepend-icon="mdi-silverware-fork-knife">
          Ver plan completo
        </v-btn>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const firstName = computed(() => (authStore.user?.name || 'Usuario').split(' ')[0]);

const todayLabel = computed(() =>
  new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
);

const kpis = [
  { icon: 'mdi-fire', value: '1.840', label: 'Calorías', trend: '+8%', trendIcon: 'mdi-trending-up', trendClass: 'up', gradient: 'linear-gradient(135deg,#F97316,#EA580C)' },
  { icon: 'mdi-shoe-print', value: '8.420', label: 'Pasos', trend: '+12%', trendIcon: 'mdi-trending-up', trendClass: 'up', gradient: 'linear-gradient(135deg,#38BDF8,#0EA5E9)' },
  { icon: 'mdi-water', value: '1.6 L', label: 'Agua', trend: '-4%', trendIcon: 'mdi-trending-down', trendClass: 'down', gradient: 'linear-gradient(135deg,#22C55E,#16A34A)' },
  { icon: 'mdi-sleep', value: '7.5 h', label: 'Sueño', trend: '+3%', trendIcon: 'mdi-trending-up', trendClass: 'up', gradient: 'linear-gradient(135deg,#A78BFA,#7C3AED)' },
];

const meals = [
  { emoji: '🥣', name: 'Desayuno', time: '08:00', kcal: 420 },
  { emoji: '🥗', name: 'Almuerzo', time: '13:30', kcal: 680 },
  { emoji: '🍎', name: 'Snack', time: '17:00', kcal: 180 },
  { emoji: '🍽️', name: 'Cena', time: '20:30', kcal: 560 },
];
</script>

<style scoped>
.cn-dash {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ============================================================
   HERO
   ============================================================ */
.cn-hero {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 36px;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(249, 115, 22, 0.96) 0%, rgba(234, 88, 12, 0.96) 55%, rgba(245, 158, 11, 0.92) 100%);
  box-shadow: 0 24px 50px rgba(234, 88, 12, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.cn-hero-glow {
  position: absolute;
  inset: -50% 10% auto auto;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 65%);
  filter: blur(8px);
  pointer-events: none;
}

.cn-hero-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.cn-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.cn-hero-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  margin: 14px 0 6px;
  letter-spacing: -0.03em;
}

.cn-hero-sub {
  max-width: 460px;
  opacity: 0.92;
  font-size: 0.98rem;
  line-height: 1.5;
  margin: 0 0 22px;
}

.cn-hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cn-hero-btn {
  text-transform: none;
  font-weight: 700;
  color: #EA580C !important;
  border-radius: 12px;
}

.cn-hero-btn-ghost {
  text-transform: none;
  font-weight: 700;
  border-color: rgba(255, 255, 255, 0.7) !important;
  border-radius: 12px;
}

.cn-ring {
  flex-shrink: 0;
}

.cn-ring-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cn-ring-value {
  font-size: 1.6rem;
  font-weight: 800;
}

.cn-ring-label {
  font-size: 0.7rem;
  opacity: 0.85;
}

/* ============================================================
   KPIs
   ============================================================ */
.cn-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.cn-kpi {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cn-kpi:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
}

.cn-kpi-icon {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.15);
}

.cn-kpi-body {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.cn-kpi-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.cn-kpi-label {
  font-size: 0.78rem;
  color: #64748B;
  font-weight: 500;
}

.cn-kpi-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 7px;
}

.cn-kpi-trend.up {
  color: #15803D;
  background: rgba(34, 197, 94, 0.14);
}

.cn-kpi-trend.down {
  color: #B91C1C;
  background: rgba(239, 68, 68, 0.14);
}

/* ============================================================
   GRID principal
   ============================================================ */
.cn-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 22px;
}

.cn-card {
  border-radius: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
}

.cn-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

.cn-card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0;
}

.cn-card-sub {
  font-size: 0.82rem;
  color: #64748B;
  margin: 2px 0 0;
}

.cn-status-dot {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #15803D;
  background: rgba(34, 197, 94, 0.14);
  padding: 4px 10px;
  border-radius: 999px;
}

/* Lista de detalles */
.cn-detail-list {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cn-detail-list li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.7);
  border: 1px solid rgba(226, 232, 240, 0.7);
  transition: transform 0.2s ease;
}

.cn-detail-list li:hover {
  transform: translateX(4px);
}

.cn-detail-icon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: #EA580C;
  background: rgba(249, 115, 22, 0.12);
}

.cn-detail-icon--green {
  color: #16A34A;
  background: rgba(34, 197, 94, 0.12);
}

.cn-detail-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cn-detail-key {
  font-size: 0.72rem;
  color: #94A3B8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cn-detail-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0F172A;
}

.cn-detail-val--success {
  color: #16A34A;
}

.cn-alert {
  border-radius: 14px !important;
}

/* Comidas */
.cn-meals {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cn-meal {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 14px;
  transition: background-color 0.2s ease;
}

.cn-meal:hover {
  background: rgba(249, 115, 22, 0.07);
}

.cn-meal-emoji {
  font-size: 1.4rem;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.8);
}

.cn-meal-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.cn-meal-name {
  font-weight: 700;
  color: #0F172A;
  font-size: 0.92rem;
}

.cn-meal-time {
  font-size: 0.76rem;
  color: #64748B;
}

.cn-meal-kcal {
  font-weight: 700;
  font-size: 0.82rem;
  color: #EA580C;
}

.cn-meal-btn {
  text-transform: none;
  font-weight: 700;
  border-radius: 12px;
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 1100px) {
  .cn-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
  .cn-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .cn-hero {
    padding: 26px 22px;
  }
  .cn-hero-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .cn-ring {
    align-self: center;
  }
}

@media (max-width: 520px) {
  .cn-kpis {
    grid-template-columns: 1fr;
  }
}
</style>
