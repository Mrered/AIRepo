<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">徒步活动</h1>
        <p class="text-lg text-gray-600 mb-8">发现精彩的户外徒步活动，开启你的探险之旅</p>
      </div>

      <!-- 活动筛选 -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex gap-2">
            <button 
              @click="filterType = 'all'"
              :class="['btn', filterType === 'all' ? 'btn-primary' : 'btn-secondary']"
            >
              全部
            </button>
            <button 
              @click="filterType = 'upcoming'"
              :class="['btn', filterType === 'upcoming' ? 'btn-primary' : 'btn-secondary']"
            >
              即将开始
            </button>
            <button 
              @click="filterType = 'past'"
              :class="['btn', filterType === 'past' ? 'btn-primary' : 'btn-secondary']"
            >
              已结束
            </button>
          </div>
          
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索活动..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id"
          class="card hover:shadow-lg transition-shadow duration-300"
        >
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <div 
              class="w-full h-48 rounded-lg flex items-center justify-center text-white font-semibold"
              :class="activity.imageClass"
            >
              {{ activity.title.substring(0, 4) }}
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ activity.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ activity.description }}</p>
          
          <div class="space-y-2 text-sm">
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(activity.date) }}
            </div>
            
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ activity.location }}
            </div>
            
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {{ activity.participants }}/{{ activity.maxParticipants }} 人
            </div>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <span class="text-primary-600 font-semibold">¥{{ activity.price }}</span>
            <button class="btn btn-primary text-sm">
              {{ new Date(activity.date) > new Date() ? '立即报名' : '查看详情' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredActivities.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.811-6.264-2.168C7.262 11.249 8.603 11 10 11h4c1.397 0 2.738.249 4.264.832z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">没有找到活动</h3>
        <p class="mt-1 text-sm text-gray-500">请尝试调整筛选条件</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useActivityStore } from '@/stores'

const activityStore = useActivityStore()
const filterType = ref('all')
const searchQuery = ref('')

// 模拟活动数据
const mockActivities = [
  {
    id: 1,
    title: '黄山三日徒步',
    description: '体验"五岳归来不看山，黄山归来不看岳"的壮丽景色',
    date: '2024-12-15',
    location: '安徽省黄山市',
    price: 599,
    participants: 12,
    maxParticipants: 20,
    imageClass: 'bg-gradient-to-r from-primary-400 to-primary-600'
  },
  {
    id: 2,
    title: '莫干山竹林徒步',
    description: '漫步竹海，感受"江南第一山"的清新空气',
    date: '2024-12-20',
    location: '浙江省湖州市德清县',
    price: 299,
    participants: 8,
    maxParticipants: 15,
    imageClass: 'bg-gradient-to-r from-green-400 to-green-600'
  },
  {
    id: 3,
    title: '西湖群山穿越',
    description: '俯瞰西湖全景，感受杭州最美徒步路线',
    date: '2024-12-23',
    location: '浙江省杭州市西湖区',
    price: 199,
    participants: 15,
    maxParticipants: 25,
    imageClass: 'bg-gradient-to-r from-purple-400 to-purple-600'
  },
  {
    id: 4,
    title: '武功山徒步',
    description: '徒步高山草甸，观日出云海，体验户外露营',
    date: '2024-12-28',
    location: '江西省萍乡市芦溪县',
    price: 699,
    participants: 5,
    maxParticipants: 12,
    imageClass: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  },
  {
    id: 5,
    title: '雁荡山徒步',
    description: '探索"东南第一山"的奇峰怪石和飞瀑流泉',
    date: '2025-01-05',
    location: '浙江省温州市乐清市',
    price: 399,
    participants: 0,
    maxParticipants: 18,
    imageClass: 'bg-gradient-to-r from-blue-400 to-blue-600'
  },
  {
    id: 6,
    title: '三清山徒步',
    description: '世界自然遗产，道教名山，花岗岩峰林地貌',
    date: '2025-01-12',
    location: '江西省上饶市玉山县',
    price: 499,
    participants: 3,
    maxParticipants: 16,
    imageClass: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
  }
]

const filteredActivities = computed(() => {
  let activities = mockActivities
  
  if (filterType.value === 'upcoming') {
    activities = activities.filter(a => new Date(a.date) > new Date())
  } else if (filterType.value === 'past') {
    activities = activities.filter(a => new Date(a.date) <= new Date())
  }
  
  if (searchQuery.value) {
    activities = activities.filter(a => 
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return activities
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

onMounted(() => {
  activityStore.setActivities(mockActivities)
})
</script>