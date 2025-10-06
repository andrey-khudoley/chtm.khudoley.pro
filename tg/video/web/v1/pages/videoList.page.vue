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
          <i class="fas fa-plus"></i> Добавить видео
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
      
      <div v-else class="videos-grid">
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
                <i class="fas fa-trash"></i> Удалить
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
import { indexRoute, addVideoRoute, watchVideoRoute, getVideosApiRoute, deleteVideoApiRoute } from '../index';

const videos = ref([]);
const loading = ref(true);
const error = ref('');

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

onMounted(() => {
  loadVideos();
});
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
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 60px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-size: 1rem;
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
  flex: 1;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.loading {
  text-align: center;
  padding: 4rem;
  color: white;
  font-size: 1.5rem;
}

.error-message {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #fcc;
  border-radius: 12px;
  color: #c33;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.empty-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.empty-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.video-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
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
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn.watch {
  background: #667eea;
  color: white;
}

.action-btn.watch:hover {
  background: #5568d3;
}

.action-btn.delete {
  background: #f44336;
  color: white;
}

.action-btn.delete:hover {
  background: #d32f2f;
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
  
  .videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>