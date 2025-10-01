<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Настройки проекта</h1>
          <a :href="webV1Route.url()" 
             class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <span class="mr-2">←</span>
            Назад
          </a>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Уровень логирования
            </label>
            <select 
              v-model="selectedLogLevel"
              @change="updateLogLevel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div v-if="message" class="p-4 rounded-md" :class="messageClass">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { webV1Route } from "../index";
import { getSettingsRoute, updateSettingsRoute } from "../handlers/settings";

const selectedLogLevel = ref('info');
const message = ref('');
const messageClass = ref('');

onMounted(async () => {
  try {
    const settings = await getSettingsRoute.run(ctx);
    selectedLogLevel.value = settings.logLevel || 'info';
  } catch (error) {
    console.error('Error loading settings:', error);
  }
});

const updateLogLevel = async () => {
  try {
    await updateSettingsRoute.run(ctx, {
      logLevel: selectedLogLevel.value
    });
    
    message.value = 'Настройки успешно сохранены';
    messageClass.value = 'bg-green-100 text-green-800 border border-green-200';
    
    setTimeout(() => {
      message.value = '';
    }, 3000);
  } catch (error) {
    message.value = 'Ошибка при сохранении настроек';
    messageClass.value = 'bg-red-100 text-red-800 border border-red-200';
    console.error('Error updating settings:', error);
  }
};
</script>