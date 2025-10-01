<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Neso Assistant</h1>
      <p class="text-xl text-gray-600 mb-8">В разработке</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <a :href="webV1Route.query({ view: 'products' }).url()" 
           class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center gap-3 text-center group hover:scale-105">
          <span class="text-3xl">📦</span>
          <span class="font-semibold text-gray-800">Таблица продуктов</span>
          <span class="text-sm text-gray-600">Управление продуктами</span>
        </a>
        
        <a :href="webV1Route.query({ view: 'currency-rates' }).url()" 
           class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center gap-3 text-center group hover:scale-105">
          <span class="text-3xl">💱</span>
          <span class="font-semibold text-gray-800">Курсы валют</span>
          <span class="text-sm text-gray-600">Актуальные курсы</span>
        </a>
        
        <a :href="webV1Route.query({ view: 'tariffs' }).url()"
           class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center gap-3 text-center group hover:scale-105">
          <span class="text-3xl">💳</span>
          <span class="font-semibold text-gray-800">Тарифы продуктов</span>
          <span class="text-sm text-gray-600">Управление тарифами</span>
        </a>
        
        <a :href="webV1Route.query({ settings: 'project' }).url()" 
           class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center gap-3 text-center group hover:scale-105 md:col-span-2 lg:col-span-1">
          <span class="text-3xl">⚙️</span>
          <span class="font-semibold text-gray-800">Настройки проекта</span>
          <span class="text-sm text-gray-600">Конфигурация системы</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { webV1Route } from "../index";
</script>