<template>
  <div class="container">
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    
    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>
    
    <iframe 
      v-else-if="video"
      :src="modifiedEmbedUrl" 
      frameborder="0" 
      allowfullscreen
      allow="autoplay; fullscreen"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getVideoByIdApiRoute } from '../index';

const video = ref(null);
const loading = ref(true);
const error = ref('');

const modifiedEmbedUrl = computed(() => {
  if (!video.value?.embedUrl) return '';
  
  // Убираем префикс @ если он есть
  const cleanUrl = video.value.embedUrl.startsWith('@') 
    ? video.value.embedUrl.substring(1) 
    : video.value.embedUrl;
  
  const url = new URL(cleanUrl);
  url.searchParams.set('showMuuveeLink', '0');
  return url.toString();
});

onMounted(async () => {
  try {
    // Извлекаем ID из пути URL, учитывая формат ~watch/ID
    let videoId = '';
    const pathParts = window.location.pathname.split('/');
    
    // Ищем часть с ~watch и извлекаем ID после неё
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i].includes('~watch')) {
        // ID находится в следующей части после ~watch
        if (i + 1 < pathParts.length) {
          videoId = pathParts[i + 1];
        }
        break;
      }
    }
    
    if (!videoId) {
      error.value = 'ID видео не указан';
      loading.value = false;
      return;
    }
    
    video.value = await getVideoByIdApiRoute({ id: videoId }).run(ctx);
    
    if (!video.value) {
      error.value = 'Видео не найдено';
    }
  } catch (e) {
    error.value = 'Ошибка при загрузке видео';
    console.error('Ошибка:', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 2rem;
  gap: 1rem;
}

.error p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
}
</style>