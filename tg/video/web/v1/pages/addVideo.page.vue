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
import { ref } from 'vue';
import { indexRoute, videoListRoute, addVideoApiRoute } from '../index';

const form = ref({
  title: '',
  iframeCode: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
}

.user-info {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 16px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
}

.user-avatar {
  font-size: 2rem;
  color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.user-name {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 60px;
}

.header {
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-4px);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: monospace;
}

.hint {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 16px;
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  color: #c33;
  margin-bottom: 1rem;
}

.success-message {
  padding: 12px 16px;
  background: #efe;
  border: 2px solid #cfc;
  border-radius: 8px;
  color: #3c3;
  margin-bottom: 1rem;
}

.success-message a {
  color: #3c3;
  font-weight: 600;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .user-info {
    position: static;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 300px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
}
</style>