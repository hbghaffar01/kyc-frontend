import { ref, computed } from 'vue'
import { useAdminStore } from '../stores/admin'

export function useAdmin() {
  const adminStore = useAdminStore()
  const loading = ref(false)
  const error = ref(null)

  const users = computed(() => adminStore.users)
  const pendingKyc = computed(() => adminStore.pendingKyc)
  const dashboardStats = computed(() => adminStore.dashboardStats)
  const currentPage = computed(() => adminStore.currentPage)
  const totalPages = computed(() => adminStore.totalPages)

  const fetchDashboardData = async () => {
    try {
      loading.value = true
      error.value = null
      await Promise.all([
        adminStore.fetchDashboardStats(),
        adminStore.fetchPendingKyc()
      ])
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard data'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = null
      await adminStore.fetchAllUsers()
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  const reviewKyc = async (kycId, decision, remarks = '') => {
    try {
      loading.value = true
      error.value = null
      await adminStore.reviewKyc(kycId, {
        status: decision,
        remarks
      })
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to review KYC'
      throw err
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page) => {
    adminStore.setPage(page)
    fetchUsers()
  }

  return {
    users,
    pendingKyc,
    dashboardStats,
    currentPage,
    totalPages,
    loading,
    error,
    fetchDashboardData,
    fetchUsers,
    reviewKyc,
    handlePageChange
  }
}