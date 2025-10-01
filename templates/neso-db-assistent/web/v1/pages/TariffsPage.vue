<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Таблица тарифов</h1>
          <a :href="webV1Route.url()" 
             class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <span class="mr-2">←</span>
            Назад
          </a>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600">Загрузка...</p>
        </div>

        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-md">
          {{ error }}
        </div>

        <div v-else-if="tariffs.length === 0" class="text-center py-8">
          <p class="text-gray-600">Тарифы не найдены</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tariff in tariffs" :key="tariff.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ tariff.tid }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ tariff.name || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ tariff.pid || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ tariff.price || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { webV1Route } from "../index";
import { getTariffsRoute } from "../handlers/tariffs";

const tariffs = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    tariffs.value = await getTariffsRoute.run(ctx);
  } catch (err) {
    error.value = 'Ошибка при загрузке тарифов';
    console.error('Error loading tariffs:', err);
  } finally {
    loading.value = false;
  }
});
</script>
