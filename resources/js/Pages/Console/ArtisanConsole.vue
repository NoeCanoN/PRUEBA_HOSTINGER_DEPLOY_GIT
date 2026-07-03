<template>
  <NotificacionToast
    v-model:show="showToast"
    :message="toastMessage"
    :type="toastType"
  />

  <div class="console-page">
    <!-- Restricción de Seguridad en UI -->
    <v-alert
      v-if="!isAuthorized"
      type="error"
      variant="elevated"
      class="rounded-xl pa-6 text-center"
      elevation="4"
    >
      <v-icon icon="mdi-shield-lock" size="x-large" class="mb-2"></v-icon>
      <h3 class="text-h5 font-weight-bold mb-2">Acceso No Autorizado</h3>
      <p>Por razones de seguridad, solo el administrador principal (@admin) tiene permisos para interactuar con la consola de producción.</p>
    </v-alert>

    <div v-else class="console-layout">
      <!-- Sección superior: Acciones Rápidas -->
      <v-card class="mb-6 rounded-xl border bg-white" elevation="2">
        <v-card-item class="bg-orange text-white py-4">
          <v-card-title class="font-weight-bold d-flex align-center ga-2">
            <v-icon icon="mdi-flash-outline"></v-icon>
            Acciones Rápidas (Artisan)
          </v-card-title>
          <v-card-subtitle class="text-white-opacity-80">
            Ejecuta las tareas de mantenimiento más comunes con un solo clic
          </v-card-subtitle>
        </v-card-item>

        <v-card-text class="pa-4">
          <div class="quick-actions-grid">
            <v-btn
              v-for="action in quickActions"
              :key="action.label"
              color="orange-darken-1"
              variant="tonal"
              prepend-icon="mdi-console-line"
              class="text-none py-4 text-body-2 rounded-lg font-weight-bold"
              :loading="loading && activeCommand === action.command"
              :disabled="loading"
              @click="runQuickCommand(action.command)"
            >
              {{ action.label }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Panel de Consola / Terminal -->
      <v-card class="terminal-card rounded-xl" elevation="6">
        <!-- Cabecera de la ventana de la terminal -->
        <div class="terminal-header px-4 py-3 d-flex align-center justify-between">
          <div class="d-flex ga-2">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="terminal-title text-caption font-weight-medium">Consola de Mantenimiento — Producción</span>
          <v-btn
            icon="mdi-delete-sweep-outline"
            variant="text"
            density="compact"
            color="grey-lighten-1"
            title="Limpiar Consola"
            @click="clearConsole"
          ></v-btn>
        </div>

        <!-- Cuerpo de la terminal -->
        <div class="terminal-body pa-4" ref="terminalBodyRef">
          <div class="welcome-msg text-grey-darken-1 mb-4">
            <span>Club Nutricional [Versión 1.0.0]</span><br />
            <span>(c) 2026 Club Nutricional. Todos los derechos reservados.</span><br />
            <span>Consola de ejecución de comandos Artisan autorizados.</span>
          </div>

          <!-- Historial de comandos -->
          <div v-for="(line, index) in consoleHistory" :key="index" class="console-line-group mb-4">
            <div class="command-input-line">
              <span class="prompt-text">club-nutricional@prod:~$</span>
              <span class="command-text ml-2">{{ line.command }}</span>
            </div>
            
            <div :class="['output-box mt-1 pa-2 rounded', line.status]">
              <pre class="output-text">{{ line.output }}</pre>
            </div>
          </div>

          <!-- Indicador de carga -->
          <div v-if="loading" class="d-flex align-center ga-2 text-orange mb-4">
            <v-progress-circular indeterminate size="16" width="2" color="orange"></v-progress-circular>
            <span class="text-caption font-weight-medium italic">Ejecutando php artisan {{ activeCommand }}...</span>
          </div>
        </div>

        <!-- Entrada del comando manual -->
        <div class="terminal-input-bar border-top pa-3 bg-grey-darken-4">
          <v-form @submit.prevent="runManualCommand" class="d-flex align-center w-100 flex-row">
            <span class="prompt-text font-weight-bold mr-2">php artisan</span>
            <input
              ref="inputRef"
              v-model="manualCommand"
              type="text"
              placeholder="escribe un comando autorizado (ej: migrate:status)"
              class="manual-cmd-input"
              :disabled="loading"
              autofocus
            />
            <v-btn
              type="submit"
              color="orange"
              variant="flat"
              density="comfortable"
              class="text-none ml-2 rounded-lg"
              :disabled="loading || !manualCommand.trim()"
            >
              Ejecutar
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';
import NotificacionToast from '../../components/Auth/NotificacionToast.vue';

const authStore = useAuthStore();

const manualCommand = ref('');
const loading = ref(false);
const activeCommand = ref('');
const consoleHistory = ref([]);
const terminalBodyRef = ref(null);
const inputRef = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// Verificar si el usuario actual es el administrador principal
const isAuthorized = computed(() => {
  return authStore.user?.email === 'admin@clubnutricional.com';
});

// Comandos de acceso rápido
const quickActions = [
  { label: 'Verificar Migraciones', command: 'migrate:status' },
  { label: 'Ejecutar Migraciones (Force)', command: 'migrate --force' },
  { label: 'Sembrar Semillas (Seeders)', command: 'db:seed' },
  { label: 'Limpiar Caché del Sistema', command: 'optimize:clear' },
  { label: 'Información de Laravel', command: 'about' }
];

// Limpiar la pantalla de la terminal
const clearConsole = () => {
  consoleHistory.value = [];
};

// Auto scroll al fondo de la terminal
const scrollToBottom = async () => {
  await nextTick();
  if (terminalBodyRef.value) {
    terminalBodyRef.value.scrollTop = terminalBodyRef.value.scrollHeight;
  }
};

// Enviar comandos
const executeCommand = async (commandToRun) => {
  if (loading.value) return;

  loading.value = true;
  activeCommand.value = commandToRun;

  try {
    const response = await axios.post('/api/console/execute', { command: commandToRun });
    const data = response.data;

    consoleHistory.value.push({
      command: `php artisan ${commandToRun}`,
      output: data.output,
      status: data.status // 'success' | 'warning' | 'error'
    });

    toastMessage.value = 'Comando ejecutado con éxito.';
    toastType.value = 'success';
    showToast.value = true;
  } catch (error) {
    let errorOutput = 'Ocurrió un error al procesar el comando.';
    
    if (error.response && error.response.data) {
      errorOutput = error.response.data.message || error.response.data.error || errorOutput;
    }

    consoleHistory.value.push({
      command: `php artisan ${commandToRun}`,
      output: errorOutput,
      status: 'error'
    });

    toastMessage.value = 'Error al ejecutar el comando.';
    toastType.value = 'error';
    showToast.value = true;
  } finally {
    loading.value = false;
    activeCommand.value = '';
    scrollToBottom();
    focusInput();
  }
};

// Re-enfocar el cursor en la terminal de forma automática
const focusInput = () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

// Acciones rápidas
const runQuickCommand = (command) => {
  executeCommand(command);
};

// Comando manual
const runManualCommand = () => {
  const cmd = manualCommand.value.trim();
  if (!cmd) return;
  
  executeCommand(cmd);
  manualCommand.value = '';
};

onMounted(() => {
  scrollToBottom();
  focusInput();
});
</script>

<style scoped>
.console-page {
  font-family: 'Outfit', 'Fira Code', 'Courier New', monospace;
}

.text-white-opacity-80 {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Rejilla de botones rápidos */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Diseño de Terminal */
.terminal-card {
  background-color: #1e293b !important; /* Fondo slate oscuro moderno */
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  display: flex;
  flex-direction: column;
  height: 500px;
  overflow: hidden;
}

.terminal-header {
  background-color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.dot.red { background-color: #ef4444; }
.dot.yellow { background-color: #eab308; }
.dot.green { background-color: #22c55e; }

.terminal-title {
  color: #94a3b8;
}

/* Cuerpo del Terminal */
.terminal-body {
  flex-grow: 1;
  overflow-y: auto;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.875rem;
  color: #e2e8f0;
  background-color: #0f172a;
  scrollbar-width: thin;
}

.welcome-msg {
  border-left: 3px solid #f97316;
  padding-left: 0.5rem;
}

.prompt-text {
  color: #38bdf8; /* Color azul cian */
}

.command-text {
  color: #ffffff;
  font-weight: bold;
}

/* Formato de la salida de consola */
.output-box {
  background-color: rgba(15, 23, 42, 0.5);
  border-left: 3px solid #64748b;
  overflow-x: auto;
}

.output-box.success {
  border-left-color: #22c55e;
}

.output-box.warning {
  border-left-color: #eab308;
}

.output-box.error {
  border-left-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}

.output-text {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #cbd5e1;
  font-family: inherit;
  font-size: 0.825rem;
}

.output-box.error .output-text {
  color: #fca5a5;
}

/* Barra de Entrada del terminal */
.terminal-input-bar {
  background-color: #0b0f19;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
}

.terminal-input-bar .prompt-text {
  color: #f97316; /* Naranja en entrada */
}

.manual-cmd-input {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  color: #ffffff !important;
  font-family: 'Fira Code', 'Courier New', monospace !important;
  font-size: 0.875rem !important;
  flex-grow: 1 !important;
  padding: 4px 8px !important;
  caret-color: #f97316 !important;
}

.manual-cmd-input::placeholder {
  color: #475569 !important;
  opacity: 0.8 !important;
}
</style>
