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
        <h1 class="title">Мои видео</h1>
        <a :href="addVideoRoute.url()" class="add-btn">
          <i class="fas fa-plus"></i>
        </a>
      </div>
      
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> Загрузка...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else-if="videos.length === 0" class="empty-state">
        <i class="fas fa-video fa-3x"></i>
        <p>У вас пока нет добавленных видео</p>
        <a :href="addVideoRoute.url()" class="empty-add-btn">
          <i class="fas fa-plus"></i> Добавить первое видео
        </a>
      </div>
      
      <div v-else class="videos-list">
        <div v-for="video in videos" :key="video.id" class="video-card">
          <div class="video-preview">
            <iframe 
              :src="video.embedUrl" 
              frameborder="0" 
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <div class="video-actions">
              <a :href="watchVideoRoute({ id: video.videoId }).url()" class="action-btn watch" target="_blank">
                <i class="fas fa-play"></i> Смотреть
              </a>
              <button @click="deleteVideo(video.videoId)" class="action-btn delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { indexRoute, addVideoRoute, getVideosApiRoute, deleteVideoApiRoute } from '../index';
import { watchVideoRoute } from '../index';

const videos = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(() => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
  loadVideos();
});

async function loadVideos() {
  loading.value = true;
  error.value = '';
  
  try {
    videos.value = await getVideosApiRoute.run(ctx);
  } catch (e) {
    error.value = 'Ошибка при загрузке видео';
    console.error('Ошибка:', e);
  } finally {
    loading.value = false;
  }
}

async function deleteVideo(id) {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showConfirm('Вы уверены, что хотите удалить это видео?', async (confirmed) => {
      if (confirmed) {
        try {
          await deleteVideoApiRoute({ id }).run(ctx);
          await loadVideos();
        } catch (e) {
          window.Telegram.WebApp.showAlert('Ошибка при удалении видео');
          console.error('Ошибка:', e);
        }
      }
    });
  } else {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) {
      return;
    }
    try {
      await deleteVideoApiRoute({ id }).run(ctx);
      await loadVideos();
    } catch (e) {
      alert('Ошибка при удалении видео');
      console.error('Ошибка:', e);
    }
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
  font-weight: 500;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 60px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--tg-theme-button-color, #3390ec);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 8px 12px;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-radius: 8px;
}

.title {
  flex: 1;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000000);
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
  text-decoration: none;
  border-radius: 50%;
  font-size: 1.25rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--tg-theme-hint-color, #999999);
  font-size: 1.25rem;
}

.error-message {
  padding: 1rem;
  background: rgba(255, 50, 50, 0.1);
  border: 1px solid rgba(255, 50, 50, 0.3);
  border-radius: 12px;
  color: #c33;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-radius: 12px;
}

.empty-state i {
  color: var(--tg-theme-hint-color, #ccc);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--tg-theme-hint-color, #666);
  margin-bottom: 1.5rem;
}

.empty-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.videos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-card {
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-radius: 12px;
  overflow: hidden;
}

.video-preview {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #000;
}

.video-preview iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-info {
  padding: 1rem;
}

.video-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn.watch {
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
}

.action-btn.delete {
  flex: 0 0 auto;
  width: 40px;
  background: #f44336;
  color: white;
}

.action-btn:active {
  opacity: 0.7;
}
</style>