import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isAdmin = computed(() => authStore.isAdmin)

  const handleLogin = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      await authStore.login(credentials)
      router.push(authStore.isAdmin ? '/dashboard' : '/kyc/status')
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const handleRegister = async (userData) => {
    try {
      loading.value = true
      error.value = null
      await authStore.register(userData)
      router.push('/kyc/submit')
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const handleLogout = async () => {
    try {
      loading.value = true
      await authStore.logout()
      router.push('/auth/login')
    } catch (err) {
      error.value = err.response?.data?.message || 'Logout failed'
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      if (authStore.token && !authStore.user) {
        await authStore.fetchProfile()
      }
    } catch (err) {
      handleLogout()
    }
  }

  return {
    isAuthenticated,
    user,
    isAdmin,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    checkAuth
  }
}