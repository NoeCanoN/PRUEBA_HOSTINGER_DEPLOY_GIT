<template>
  <v-snackbar
    v-model="showSnackbar"
    :color="snackbarColor"
    :timeout="duration"
    location="top center"
    elevation="12"
    rounded="lg"
    :multi-line="message?.length > 50"
    class="custom-toast"
  >
    <div class="d-flex align-center py-1">
      <v-icon v-if="snackbarIcon" class="mr-3 text-h5">
        {{ snackbarIcon }}
      </v-icon>
      <span class="text-subtitle-2 font-weight-medium">{{ message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        density="comfortable"
        color="white"
        @click="close"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 4000
  }
});

const emit = defineEmits(['update:show']);

const showSnackbar = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

const snackbarColor = computed(() => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  return colors[props.type] || 'info';
});

const snackbarIcon = computed(() => {
  const icons = {
    success: 'mdi-check-circle-outline',
    error: 'mdi-alert-circle-outline',
    warning: 'mdi-alert-outline',
    info: 'mdi-information-outline'
  };
  return icons[props.type] || icons.info;
});

const close = () => {
  emit('update:show', false);
};
</script>

<style scoped>
.custom-toast :deep(.v-overlay__content) {
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}
</style>
