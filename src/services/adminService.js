import api from './api'

export const adminService = {
  async getAllUsers() {
    const response = await api.get('/admin/users')
    return response.data
  },

  async getPendingKyc() {
    const response = await api.get('/admin/kyc/pending')
    return response.data
  },

  async reviewKyc(id, reviewData) {
    const response = await api.put(`/admin/kyc/review/${id}`, reviewData)
    return response.data
  },

  async getDashboardStats() {
    const response = await api.get('/admin/dashboard')
    return response.data
  }
}