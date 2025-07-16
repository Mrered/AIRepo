<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">关于我们</h1>
        <p class="text-lg text-gray-600 mb-8">让每一次徒步都成为难忘的回忆</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- 关于我们内容 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">关于徒步俱乐部</h2>
          <p class="text-gray-600 mb-4">
            我们是一个专注于户外徒步活动的社区平台，致力于连接热爱自然、热爱运动的户外爱好者。
            无论你是经验丰富的徒步达人，还是刚刚起步的新手，都能在这里找到适合自己的活动。
          </p>
          <p class="text-gray-600 mb-6">
            自2020年成立以来，我们已经组织了超过200场徒步活动，
            带领5000+户外爱好者探索了祖国的大好河山，从黄山云海到莫干山竹海，
            从西湖群山到武功山草甸，每一次活动都充满了欢笑与感动。
          </p>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">专业领队</h3>
                <p class="text-gray-600 text-sm">所有活动均由经验丰富的专业户外领队带队</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">安全保障</h3>
                <p class="text-gray-600 text-sm">完善的安全预案和急救措施，确保活动安全</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">精选路线</h3>
                <p class="text-gray-600 text-sm">精心挑选风景优美、难度适中的徒步路线</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">我们的数据</h3>
          
          <div class="space-y-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">200+</div>
              <div class="text-sm text-gray-600">组织活动场次</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">5000+</div>
              <div class="text-sm text-gray-600">参与人次</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">98%</div>
              <div class="text-sm text-gray-600">用户满意度</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">0</div>
              <div class="text-sm text-gray-600">安全事故</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 团队介绍 -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">核心团队</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl font-bold">李</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">李明</h3>
            <p class="text-primary-600 text-sm">创始人 & 主领队</p>
            <p class="text-gray-600 text-sm mt-2">10年户外经验，中国登山协会认证领队</p>
          </div>
          
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl font-bold">王</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">王芳</h3>
            <p class="text-primary-600 text-sm">运营总监</p>
            <p class="text-gray-600 text-sm mt-2">5年户外俱乐部运营经验，擅长路线规划</p>
          </div>
          
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl font-bold">张</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">张强</h3>
            <p class="text-primary-600 text-sm">安全官</p>
            <p class="text-gray-600 text-sm mt-2">红十字会急救员，户外运动安全专家</p>
          </div>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="mt-16 bg-primary-50 rounded-lg p-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">联系我们</h2>
          <p class="text-gray-600 mb-6">有任何问题或建议？我们随时欢迎你的联系</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900">邮箱</h3>
              <p class="text-gray-600">hello@hikingclub.com</p>
            </div>
            
            <div>
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900">电话</h3>
              <p class="text-gray-600">+86 400-123-4567</p>
            </div>
            
            <div>
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900">地址</h3>
              <p class="text-gray-600">杭州市西湖区文三路478号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('About page mounted')
})
</script>