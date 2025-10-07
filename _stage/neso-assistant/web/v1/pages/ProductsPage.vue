<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Таблица продуктов</h1>
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

        <div v-else-if="products.length === 0" class="text-center py-8">
          <p class="text-gray-600">Продукты не найдены</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Спикер</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Менеджер</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Валюта</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Запись</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.pid }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ product.speaker || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ product.manager || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ product.price || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ product.currency || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <span v-if="product.is_record" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
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
import { getProductsRoute } from "../handlers/get-products.api";

const products = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    products.value = await getProductsRoute.run(ctx);
  } catch (err) {
    error.value = 'Ошибка при загрузке продуктов';
    console.error('Error loading products:', err);
  } finally {
    loading.value = false;
  }
});
</script>
