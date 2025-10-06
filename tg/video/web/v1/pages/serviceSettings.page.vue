<template>
  <div class="container">
    <div class="card">
      <h1 class="title">⚙️ Настройки сервиса</h1>
      
      <form @submit.prevent="handleSave" class="form">
        <div class="form-group">
          <label for="serviceName" class="label">Название сервиса:</label>
          <input
            id="serviceName"
            v-model="form.serviceName"
            type="text"
            class="input"
            placeholder="Miniapp Video Service"
            required
          />
        </div>

        <div class="form-group">
          <label for="logLevel" class="label">Уровень логирования:</label>
          <select
            id="logLevel"
            v-model="form.logLevel"
            class="select"
            required
          >
            <option value="info">Info (подробный)</option>
            <option value="warn">Warn (предупреждения)</option>
            <option value="error">Error (только ошибки)</option>
          </select>
        </div>

        <div class="button-group">
          <button type="submit" class="button button-primary" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <a :href="indexRoute.url()" class="button button-secondary">
            Назад
          </a>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getSettingsRoute, updateSettingsRoute, indexRoute } from '../index';

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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
}

.input,
.select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.button {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  font-family: inherit;
}

.button-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-secondary {
  background: #f5f5f5;
  color: #333;
}

.button-secondary:hover {
  background: #e0e0e0;
}

.message {
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>