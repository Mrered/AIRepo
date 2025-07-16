<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span class="block">探索自然</span>
          <span class="block text-primary-600">发现户外之美</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          加入我们的徒步俱乐部，与志同道合的户外爱好者一起探索壮丽的自然风光，体验难忘的徒步旅程。
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <router-link
              to="/activities"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              浏览活动
            </router-link>
          </div>
          <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <a
              href="#"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              了解更多
            </a>
          </div>
        </div>
      </div>

      <!-- 特色活动展示 -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">热门活动</h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="card">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
              <div class="w-full h-48 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg font-semibold">黄山徒步</span>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">黄山三日徒步</h3>
            <p class="text-gray-600 text-sm mb-4">体验"五岳归来不看山，黄山归来不看岳"的壮丽景色</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">12月15-17日</span>
              <span class="text-primary-600 font-semibold">¥599</span>
            </div>
          </div>

          <div class="card">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
              <div class="w-full h-48 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg font-semibold">莫干山</span>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">莫干山竹林徒步</h3>
            <p class="text-gray-600 text-sm mb-4">漫步竹海，感受"江南第一山"的清新空气</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">12月20日</span>
              <span class="text-primary-600 font-semibold">¥299</span>
            </div>
          </div>

          <div class="card">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
              <div class="w-full h-48 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg font-semibold">西湖群山</span>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">西湖群山穿越</h3>
            <p class="text-gray-600 text-sm mb-4">俯瞰西湖全景，感受杭州最美徒步路线</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">12月23日</span>
              <span class="text-primary-600 font-semibold">¥199</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useActivityStore } from '@/stores'

const activityStore = useActivityStore()

onMounted(() => {
  // 这里可以加载活动数据
  console.log('Home page mounted')
})
</script>