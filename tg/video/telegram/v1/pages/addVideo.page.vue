<template>
  <div class="container">
    <div class="user-info">
      <div class="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-details">
        <span class="user-name">{{ ctx.user.displayName }}</span>
        <button @click="handleLogout" class="logout-btn">Выйти</button>
      </div>
    </div>
    
    <div class="content">
      <div class="header">
        <a :href="indexRoute.url()" class="back-btn">
          <i class="fas fa-arrow-left"></i> Назад
        </a>
        <h1 class="title">Добавить видео</h1>
      </div>
      
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Название видео</label>
            <input 
              type="text" 
              id="title" 
              v-model="form.title" 
              placeholder="Введите название"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="iframe">Код iframe</label>
            <textarea 
              id="iframe" 
              v-model="form.iframeCode" 
              placeholder='<iframe src="https://muuvee.ru/embeded~Y0BK4WKi7VbatLySIMY0muuve?autoplay=0&muted=0&controls=1&showMuuveeLink=1&start=0" frameborder="0" allowfullscreen></iframe>'
              rows="4"
              required
            ></textarea>
            <small class="hint">Вставьте полный код iframe для встраивания видео</small>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="success" class="success-message">
            Видео успешно добавлено! <a :href="videoListRoute.url()">Перейти к списку</a>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <i class="fas fa-plus"></i> {{ loading ? 'Добавление...' : 'Добавить видео' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { indexRoute, videoListRoute, addVideoApiRoute } from '../index';

const form = ref({
  title: '',
  iframeCode: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

onMounted(() => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
});

async function handleSubmit() {
  loading.value = true;
  error.value = '';
  success.value = false;
  
  try {
    const result = await addVideoApiRoute.run(ctx, {
      title: form.value.title,
      iframeCode: form.value.iframeCode
    });
    
    if (result.success) {
      success.value = true;
      form.value = { title: '', iframeCode: '' };
      
      setTimeout(() => {
        window.location.href = videoListRoute.url();
      }, 2000);
    } else {
      error.value = result.error || 'Ошибка при добавлении видео';
    }
  } catch (e) {
    error.value = 'Произошла ошибка при добавлении видео';
    console.error('Ошибка:', e);
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  try {
    await fetch('/s/auth/sign-out', {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/';
  } catch (error) {
    console.error('Ошибка при выходе:', error);
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
  padding: 16px;
}

.user-info {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--tg-theme-secondary-bg-color, rgba(0, 0, 0, 0.05));
  padding: 8px 14px;
  border-radius: 50px;
  border: 1px solid var(--tg-theme-hint-color, rgba(0, 0, 0, 0.1));
  z-index: 10;
}

.user-avatar {
  font-size: 1.75rem;
  color: var(--tg-theme-button-color, #3390ec);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.user-name {
  color: var(--tg-theme-text-color, #000000);
  font-size: 0.85rem;
  font-weight: 600;
}

.logout-btn {
  background: var(--tg-theme-button-color, #3390ec);
  border: none;
  color: var(--tg-theme-button-text-color, #ffffff);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 60px;
}

.header {
  margin-bottom: 1.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--tg-theme-button-color, #3390ec);
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 8px 12px;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-btn:active {
  opacity: 0.7;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000000);
}

.form-container {
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--tg-theme-hint-color, #d0d0d0);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: monospace;
}

.hint {
  display: block;
  margin-top: 0.5rem;
  color: var(--tg-theme-hint-color, #999999);
  font-size: 0.85rem;
}

.submit-btn {
  width: 100%;
  padding: 14px 20px;
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:active:not(:disabled) {
  opacity: 0.8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message {
  padding: 12px;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 8px;
  color: #3c3;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message a {
  color: #3c3;
  font-weight: 600;
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .error-message {
    background: rgba(255, 50, 50, 0.2);
    border-color: rgba(255, 50, 50, 0.4);
  }
  
  .success-message {
    background: rgba(50, 255, 50, 0.2);
    border-color: rgba(50, 255, 50, 0.4);
  }
}
</style>