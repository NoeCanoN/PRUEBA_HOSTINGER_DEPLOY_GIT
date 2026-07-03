<template>
  <v-card class="pa-6 rounded-xl border bg-white" elevation="2">
    <v-card-text class="d-flex flex-column align-center text-center py-10">
      <v-avatar color="orange-lighten-5" size="80" class="mb-4">
        <v-icon icon="mdi-tools" color="orange" size="x-large"></v-icon>
      </v-avatar>
      <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">Sección en Desarrollo</h2>
      <p class="text-body-1 text-grey-darken-1 max-w-sm mb-6">
        Esta sección se encuentra actualmente en fase de construcción. ¡Pronto estará lista con nuevas funciones de salud y nutrición!
      </p>
      <v-btn color="orange" variant="flat" rounded="lg" to="/dashboard">
        Volver al Dashboard
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Placeholder temporal para secciones en desarrollo
</script>

<style scoped>
.max-w-sm {
  max-width: 400px;
}
</style>
