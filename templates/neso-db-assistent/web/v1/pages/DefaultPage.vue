<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Neso Assistant</h1>
      <p class="text-xl text-gray-600 mb-8">В разработке</p>
      
      <div class="space-y-4">
        <div>
          <a :href="webV1Route.query({ view: 'products' }).url()" 
             class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Таблица продуктов
          </a>
        </div>
        
        <div>
          <a :href="webV1Route.query({ view: 'currency-rates' }).url()" 
             class="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Курсы валют
          </a>
        </div>
        
        <div>
          <a :href="webV1Route.query({ settings: 'project' }).url()" 
             class="inline-block bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Настройки проекта
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { webV1Route } from "../index";
</script>