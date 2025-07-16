// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 验证环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量。请检查 .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'hiking-club'
    }
  }
})

// 导出数据库表名常量
export const TABLES = {
  PROFILES: 'profiles',
  ACTIVITIES: 'activities',
  REGISTRATIONS: 'registrations',
  COMMENTS: 'comments',
  PHOTOS: 'photos'
}

// 导出存储桶名常量
export const BUCKETS = {
  AVATARS: 'avatars',
  ACTIVITY_PHOTOS: 'activity-photos'
}

// 错误处理工具函数
export const handleSupabaseError = (error) => {
  console.error('Supabase 错误:', error)
  
  if (error.code === 'PGRST116') {
    return '找不到请求的数据'
  }
  if (error.code === '23505') {
    return '数据已存在'
  }
  if (error.code === '23503') {
    return '关联数据不存在'
  }
  
  return error.message || '发生未知错误'
}

// 检查用户是否已认证
export const checkAuth = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// 获取当前用户
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}