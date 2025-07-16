// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  // 状态
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userId = computed(() => user.value?.id || '')

  // 初始化用户状态
  const initAuth = async () => {
    try {
      loading.value = true
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
    } catch (err) {
      error.value = err.message
      console.error('初始化认证失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 监听认证状态变化
  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        user.value = session?.user ?? null
        console.log('认证状态变化:', event, session?.user?.email)
      }
    )
    
    return subscription
  }

  // 登录
  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      
      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      console.error('登录失败:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const signUp = async (email, password, metadata = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName || '',
            avatar_url: metadata.avatarUrl || '',
            ...metadata
          }
        }
      })
      
      if (signUpError) throw signUpError
      
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      console.error('注册失败:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('登出失败:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (email) => {
    try {
      loading.value = true
      error.value = null
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (resetError) throw resetError
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('重置密码失败:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 更新用户资料
  const updateProfile = async (updates) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (updateError) throw updateError
      
      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      console.error('更新用户资料失败:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    user,
    loading,
    error,
    
    // 计算属性
    isAuthenticated,
    userEmail,
    userId,
    
    // 方法
    initAuth,
    setupAuthListener,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  }
}