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
    
    <h1 class="title">Miniapp Video Service</h1>
    <p class="status">Сервис для управления видео</p>
    
    <nav class="navigation">
      <a :href="addVideoRoute.url()" class="nav-card add">
        <div class="nav-icon">
          <i class="fas fa-plus-circle"></i>
        </div>
        <div class="nav-content">
          <h3>Добавить видео</h3>
          <p>Загрузите новое видео</p>
        </div>
        <i class="fas fa-chevron-right nav-arrow"></i>
      </a>
      
      <a :href="videoListRoute.url()" class="nav-card list">
        <div class="nav-icon">
          <i class="fas fa-video"></i>
        </div>
        <div class="nav-content">
          <h3>Мои видео</h3>
          <p>Просмотр и управление</p>
        </div>
        <i class="fas fa-chevron-right nav-arrow"></i>
      </a>
      
      <a :href="serviceSettingsRoute.url()" class="nav-card settings">
        <div class="nav-icon">
          <i class="fas fa-cog"></i>
        </div>
        <div class="nav-content">
          <h3>Настройки</h3>
          <p>Конфигурация сервиса</p>
        </div>
        <i class="fas fa-chevron-right nav-arrow"></i>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { serviceSettingsRoute, addVideoRoute, videoListRoute } from '../index';

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.logout-btn:active {
  transform: scale(0.98);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.status {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 3rem;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.nav-card:active {
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.nav-card.add .nav-icon {
  color: #10b981;
}

.nav-card.list .nav-icon {
  color: #667eea;
}

.nav-card.settings .nav-icon {
  color: #f59e0b;
}

.nav-content {
  flex: 1;
}

.nav-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.nav-content p {
  font-size: 0.95rem;
  color: #666;
}

.nav-arrow {
  font-size: 1.25rem;
  color: #ccc;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .user-info {
    position: static;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .status {
    font-size: 1rem;
  }
  
  .nav-card {
    padding: 1.25rem;
  }
  
  .nav-icon {
    font-size: 2rem;
  }
  
  .nav-content h3 {
    font-size: 1.1rem;
  }
  
  .nav-content p {
    font-size: 0.85rem;
  }
}
</style>