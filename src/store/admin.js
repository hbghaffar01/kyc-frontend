import { defineStore } from "pinia";
import { adminService } from "../services/adminService";
import { setLoading } from "@/composables/loadingState";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    users: [],
    pendingKyc: [],
    dashboardStats: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  }),

  getters: {
    totalUsers: (state) => state.dashboardStats?.totalUsers || 0,
    approvedKyc: (state) => state.dashboardStats?.approvedKyc || 0,
    pendingKycCount: (state) => state.dashboardStats?.pendingKyc || 0,
    rejectedKyc: (state) => state.dashboardStats?.rejectedKyc || 0,
  },

  actions: {
    async fetchAllUsers() {
      setLoading(true);
      try {
        this.error = null;
        const response = await adminService.getAllUsers();
        this.users = response;
        setLoading(false);
        return response;
      } catch (error) {
        setLoading(false);
        this.error = error.response?.data?.message || "Failed to fetch users";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    async fetchPendingKyc() {
      try {
        setLoading(true);
        this.error = null;
        const response = await adminService.getPendingKyc();
        this.pendingKyc = response.data;
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch pending KYC";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    async reviewKyc(kycId, reviewData) {
      try {
        setLoading(true);
        this.error = null;
        const response = await adminService.reviewKyc(kycId, reviewData);
        await this.fetchPendingKyc();
        await this.fetchDashboardStats();
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to review KYC";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    async fetchDashboardStats() {
      try {
        setLoading(true);
        this.error = null;
        const response = await adminService.getDashboardStats();
        this.dashboardStats = response;
        return response;
      } catch (error) {
        this.error =
          error.response?.message || "Failed to fetch dashboard stats";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    setPage(page) {
      this.currentPage = page;
    },

    resetState() {
      this.users = [];
      this.pendingKyc = [];
      this.dashboardStats = null;
      this.error = null;
      this.currentPage = 1;
      this.totalPages = 1;
    },
  },
});
