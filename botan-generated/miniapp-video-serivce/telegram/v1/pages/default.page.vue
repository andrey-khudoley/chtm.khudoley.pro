<template>
  <div class="container">
    <div class="header">
      <div class="icon">🎬</div>
      <h1 class="title">Miniapp Video Service</h1>
      <p class="status">В разработке</p>
    </div>
    
    <nav class="navigation">
      <a :href="serviceSettingsRoute.url()" class="nav-item">
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">Настройки сервиса</span>
        <span class="nav-arrow">›</span>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { serviceSettingsRoute } from './index';
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
  font-size: 1.75rem;
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
}
</style>