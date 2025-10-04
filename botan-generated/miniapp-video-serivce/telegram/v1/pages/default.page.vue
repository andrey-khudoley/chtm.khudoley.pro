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
    <p class="status">В разработке</p>
    
    <nav class="navigation">
      <a :href="serviceSettingsRoute.url()" class="link">⚙️ Настройки сервиса</a>
    </nav>
  </div>
</template>

<script setup>
import { serviceSettingsRoute } from './index';

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
  padding: 0;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem 2rem;
  background: linear-gradient(180deg, var(--tg-theme-secondary-bg-color, #f4f4f5) 0%, var(--tg-theme-bg-color, #ffffff) 100%);
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--tg-theme-text-color, #000000);
}

.status {
  font-size: 1rem;
  color: var(--tg-theme-hint-color, #999999);
  text-align: center;
}

.navigation {
  padding: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  color: var(--tg-theme-text-color, #000000);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.nav-item:active {
  transform: scale(0.98);
  opacity: 0.8;
}

.nav-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.nav-text {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
}

.nav-arrow {
  font-size: 1.5rem;
  color: var(--tg-theme-hint-color, #999999);
}

.user-info {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--tg-theme-secondary-bg-color, rgba(255, 255, 255, 0.1));
  padding: 8px 14px;
  border-radius: 50px;
  border: 1px solid var(--tg-theme-hint-color, rgba(255, 255, 255, 0.2));
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

.logout-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.logout-btn:active {
  transform: scale(0.98);
}

@media (prefers-color-scheme: dark) {
  .container {
    background: #000000;
    color: #ffffff;
  }
  
  .header {
    background: linear-gradient(180deg, #1a1a1a 0%, #000000 100%);
  }
  
  .nav-item {
    background: #1a1a1a;
    color: #ffffff;
  }

  .user-info {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .user-avatar {
    color: #3390ec;
  }

  .user-name {
    color: #ffffff;
  }

  .logout-btn {
    background: #3390ec;
    color: #ffffff;
  }
}

@media (max-width: 768px) {
  .user-info {
    position: static;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .title {
    font-size: 1.75rem;
  }
}
</style>