<template>
  <div class="container">
    <h1 class="title">Miniapp Video Service</h1>
    <p class="status">В разработке</p>
    <nav class="navigation">
      <a :href="serviceSettingsRoute.url()" class="link">⚙️ Настройки сервиса</a>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.status {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 2rem;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.link {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .status {
    font-size: 1.25rem;
  }
}
</style>