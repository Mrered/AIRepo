<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              徒步俱乐部
            </router-link>
          </div>
          
          <div class="flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary-600"
            >
              首页
            </router-link>
            <router-link 
              to="/activities" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary-600"
            >
              活动
            </router-link>
            <router-link 
              to="/about" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary-600"
            >
              关于我们
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 这里可以添加全局逻辑
</script>

<style scoped>
.router-link-active {
  @apply text-primary-600;
}
</style>