import { defineStore } from "pinia";
import { kycService } from "../services/kycService";
import { setLoading } from "@/composables/loadingState";

export const useKycStore = defineStore("kyc", {
  state: () => ({
    kycs: [],
    kycStatus: null,
    kycData: null,
    loading: false,
    error: null,
    submitSuccess: false,
  }),

  getters: {
    isKycSubmitted: (state) => !!state.kycData,
    kycStatusText: (state) => {
      if (!state.kycStatus) return "Not Submitted";
      return state.kycStatus.charAt(0).toUpperCase() + state.kycStatus.slice(1);
    },
    isPending: (state) => state.kycStatus === "pending",
    isApproved: (state) => state.kycStatus === "approved",
    isRejected: (state) => state.kycStatus === "rejected",
  },

  actions: {
    async getKycsList() {
      try {
        setLoading(true);
        this.error = null;
        const response = await kycService.getAllKycs();

        if (response) {
          const flattenedResponse = response.map((item) => {
            return {
              fullName: `${item.user.firstName} ${item.user.lastName}`,
              ...item,
              ...item.user,
              user: undefined,
            };
          });
          this.kycs = flattenedResponse;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch KYC list";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    async submitKyc(kycData) {
      try {
        setLoading(true);
        this.error = null;
        const response = await kycService.submitKyc(kycData);
        this.kycData = response;
        this.kycStatus = response.status;
        this.submitSuccess = true;
        setLoading(false);
        return response;
      } catch (error) {
        this.error = error.response?.message || "KYC submission failed";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    async fetchKycStatus(email) {
      try {
        setLoading(true);
        this.error = null;
        const response = await kycService.getKycStatus(email);
        this.kycData = response;
        this.kycStatus = response.status;
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch KYC status";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    async updateKyc(kycId, updateData) {
      try {
        setLoading(true);
        this.error = null;
        const response = await kycService.updateKyc(kycId, updateData);
        this.kycData = response;
        this.kycStatus = response?.status;
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to update KYC";
        throw error;
      } finally {
        setLoading(false);
      }
    },

    resetState() {
      this.kycStatus = null;
      this.kycData = null;
      this.error = null;
      this.submitSuccess = false;
    },
  },
});
