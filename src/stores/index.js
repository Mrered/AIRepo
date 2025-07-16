import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    title: '徒步俱乐部',
    user: null,
    loading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  
  actions: {
    setLoading(loading) {
      this.loading = loading
    },
    
    setUser(user) {
      this.user = user
    },
    
    logout() {
      this.user = null
    }
  }
})

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [],
    currentActivity: null,
    loading: false
  }),
  
  getters: {
    upcomingActivities: (state) => {
      return state.activities.filter(activity => 
        new Date(activity.date) > new Date()
      ).sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    
    pastActivities: (state) => {
      return state.activities.filter(activity => 
        new Date(activity.date) <= new Date()
      ).sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  
  actions: {
    setActivities(activities) {
      this.activities = activities
    },
    
    addActivity(activity) {
      this.activities.push(activity)
    },
    
    setCurrentActivity(activity) {
      this.currentActivity = activity
    },
    
    setLoading(loading) {
      this.loading = loading
    }
  }
})