<template>
  <div class="container">
    <div class="header">
      <h1 class="title">⚙️ Настройки</h1>
    </div>
    
    <div class="content">
      <form @submit.prevent="handleSave" class="form">
        <div class="form-section">
          <label class="label">Название сервиса</label>
          <input
            v-model="form.serviceName"
            type="text"
            class="input"
            placeholder="Miniapp Video Service"
            required
          />
        </div>

        <div class="form-section">
          <label class="label">Уровень логирования</label>
          <div class="select-wrapper">
            <select
              v-model="form.logLevel"
              class="select"
              required
            >
              <option value="info">Info (подробный)</option>
              <option value="warn">Warn (предупреждения)</option>
              <option value="error">Error (только ошибки)</option>
            </select>
          </div>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>

        <div class="button-group">
          <button type="submit" class="button button-primary" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <a :href="indexRoute.url()" class="button button-secondary">
            Назад
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getSettingsRoute, updateSettingsRoute, indexRoute } from './index';

const form = ref({
  serviceName: '',
  logLevel: 'info'
});

const loading = ref(false);
const message = ref('');
const messageType = ref('');

onMounted(async () => {
  try {
    const settings = await getSettingsRoute.run(ctx);
    if (settings) {
      form.value.serviceName = settings.serviceName || 'Miniapp Video Service';
      form.value.logLevel = settings.logLevel || 'info';
    }
  } catch (error) {
    console.error('Ошибка загрузки настроек:', error);
    message.value = 'Ошибка загрузки настроек';
    messageType.value = 'error';
  }
});

async function handleSave() {
  loading.value = true;
  message.value = '';
  
  try {
    await updateSettingsRoute.run(ctx, {
      serviceName: form.value.serviceName,
      logLevel: form.value.logLevel
    });
    
    message.value = 'Настройки успешно сохранены!';
    messageType.value = 'success';
    
    setTimeout(() => {
      message.value = '';
    }, 3000);
  } catch (error) {
    console.error('Ошибка сохранения настроек:', error);
    message.value = 'Ошибка при сохранении настроек';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  padding: 1rem 1.5rem;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-bottom: 1px solid var(--tg-theme-section-separator-color, #e4e4e4);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.content {
  padding: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--tg-theme-hint-color, #999999);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input,
.select {
  width: 100%;
  padding: 0.875rem;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  color: var(--tg-theme-text-color, #000000);
  border: 1px solid var(--tg-theme-section-separator-color, #e4e4e4);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: var(--tg-theme-button-color, #3390ec);
  background: var(--tg-theme-bg-color, #ffffff);
}

.select-wrapper {
  position: relative;
}

.select {
  appearance: none;
  padding-right: 2.5rem;
  cursor: pointer;
}

.select-wrapper::after {
  content: '›';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  font-size: 1.5rem;
  color: var(--tg-theme-hint-color, #999999);
  pointer-events: none;
}

.message {
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.message.error {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.button {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
  font-family: inherit;
}

.button-primary {
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
}

.button-primary:active:not(:disabled) {
  transform: scale(0.98);
  opacity: 0.8;
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-secondary {
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  color: var(--tg-theme-text-color, #000000);
}

.button-secondary:active {
  transform: scale(0.98);
  opacity: 0.8;
}

@media (prefers-color-scheme: dark) {
  .container {
    background: #000000;
    color: #ffffff;
  }
  
  .header {
    background: #1a1a1a;
    border-bottom: 1px solid #2a2a2a;
  }
  
  .input,
  .select {
    background: #1a1a1a;
    border-color: #2a2a2a;
    color: #ffffff;
  }
  
  .button-secondary {
    background: #1a1a1a;
    color: #ffffff;
  }
}
</style>