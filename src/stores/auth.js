// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.id || '',
    userProfile: (state) => state.user?.user_metadata || {},
    
    // 获取用户角色
    isAdmin: (state) => {
      return state.user?.user_metadata?.role === 'admin'
    },
    
    // 获取用户显示名称
    displayName: (state) => {
      const metadata = state.user?.user_metadata || {}
      return metadata.full_name || metadata.displayName || state.user?.email?.split('@')[0] || '用户'
    },
    
    // 获取用户头像
    avatarUrl: (state) => {
      return state.user?.user_metadata?.avatar_url || null
    }
  },

  actions: {
    // 初始化认证状态
    async initAuth() {
      if (this.initialized) return
      
      try {
        this.loading = true
        const { data: { user } } = await supabase.auth.getUser()
        this.user = user
        this.initialized = true
        
        // 设置认证状态监听器
        this.setupAuthListener()
      } catch (error) {
        this.error = error.message
        console.error('初始化认证失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 设置认证状态监听器
    setupAuthListener() {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          this.user = session?.user ?? null
          console.log('认证状态变化:', event)
          
          // 触发全局事件
          if (event === 'SIGNED_IN') {
            window.dispatchEvent(new CustomEvent('auth:signed-in', { 
              detail: { user: session?.user } 
            }))
          } else if (event === 'SIGNED_OUT') {
            window.dispatchEvent(new CustomEvent('auth:signed-out'))
          }
        }
      )
      
      return subscription
    },

    // 登录
    async signIn(email, password) {
      try {
        this.loading = true
        this.error = null
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        this.user = data.user
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('登录失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 注册
    async signUp(userData) {
      try {
        this.loading = true
        this.error = null
        
        const { email, password, fullName, displayName, avatarUrl } = userData
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || displayName || '',
              display_name: displayName || fullName || '',
              avatar_url: avatarUrl || '',
              role: 'user'
            }
          }
        })
        
        if (error) throw error
        
        // 注册成功后可能需要邮箱验证
        if (data.user && !data.session) {
          return { 
            success: true, 
            needsEmailVerification: true,
            message: '注册成功！请检查您的邮箱进行验证。'
          }
        }
        
        this.user = data.user
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('注册失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 使用第三方提供商登录
    async signInWithProvider(provider) {
      try {
        this.loading = true
        this.error = null
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) throw error
        
        return { success: true, url: data.url }
      } catch (error) {
        this.error = error.message
        console.error('第三方登录失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 登出
    async signOut() {
      try {
        this.loading = true
        this.error = null
        
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        this.user = null
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('登出失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 更新用户资料
    async updateProfile(updates) {
      try {
        this.loading = true
        this.error = null
        
        const { data, error } = await supabase.auth.updateUser({
          data: updates
        })
        
        if (error) throw error
        
        this.user = data.user
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('更新用户资料失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 更新密码
    async updatePassword(newPassword) {
      try {
        this.loading = true
        this.error = null
        
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        })
        
        if (error) throw error
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('更新密码失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 重置密码
    async resetPassword(email) {
      try {
        this.loading = true
        this.error = null
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        })
        
        if (error) throw error
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('重置密码失败:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // 刷新用户信息
    async refreshUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        this.user = user
        return { success: true }
      } catch (error) {
        console.error('刷新用户信息失败:', error)
        return { success: false, error: error.message }
      }
    },

    // 清除错误
    clearError() {
      this.error = null
    }
  }
})