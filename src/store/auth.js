import { defineStore } from "pinia";
import { authService } from "../services/authService";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
} from "@/utils/token";
import { jwtDecode } from "jwt-decode";
import { setLoading } from "@/composables/loadingState";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    users: [],
    profile: null,
    accessToken: getAccessToken() || null,
    refreshToken: getRefreshToken() || null,
    loading: false,
    error: null,
    tokenExpiryTime: null,
    refreshTimer: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    userRole: (state) => state.profile?.role || "user",
    isAdmin: (state) => state.profile?.role === "admin",
  },

  actions: {
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;

        const response = await authService.login(credentials);

        this.accessToken = response.data.data.accessToken;
        this.refreshToken = response.data.data.refreshToken;
        this.profile = response.data.data.user;
        setTokens(this.accessToken, this.refreshToken);

        if (this.accessToken) {
          const decodedToken = jwtDecode(this.accessToken);
          this.tokenExpiryTime = decodedToken.exp * 1000;
          this.startTokenRefreshTimer();
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await authService.register(userData);

        this.accessToken = response.data.data.accessToken;
        this.refreshToken = response.data.data.refreshToken;
        this.profile = response.data.user;

        setTokens(this.accessToken, this.refreshToken);

        if (this.accessToken) {
          const decodedToken = jwtDecode(this.accessToken);
          this.tokenExpiryTime = decodedToken.exp * 1000;
          this.startTokenRefreshTimer();
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        const response = await authService.logout();
        if (response.data.success) {
          removeTokens();
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.clearAuthState();
      }
    },

    clearAuthState() {
      this.accessToken = null;
      this.refreshToken = null;
      this.profile = null;
      this.tokenExpiryTime = null;
      removeTokens();
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    },

    async refreshAccessToken() {
      try {
        const response = await authService.refreshToken(this.refreshToken);

        this.accessToken = response.data.data.accessToken;
        setTokens(this.accessToken, this.refreshToken);

        if (this.accessToken) {
          const decodedToken = jwtDecode(this.accessToken);
          this.tokenExpiryTime = decodedToken.exp * 1000;
          this.startTokenRefreshTimer();
        }

        return response.data;
      } catch (error) {
        console.error("Refresh token error:", error);
        this.clearAuthState();
        throw error;
      }
    },

    async getUserProfile() {
      setLoading(true);
      try {
        const response = await authService.getProfile();
        if (response.data.success) {
          this.profile = response.data.data;
          setLoading(false);
        }
      } catch(error) {
        setLoading(false);
        console.error("User profile:", error);
      }
    },

    startTokenRefreshTimer() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        console.log("Cleared existing refresh timer");
      }

      if (!this.tokenExpiryTime) {
        console.log("No token expiry time set, skipping refresh timer");
        return;
      }

      const currentTime = Date.now();
      const timeUntilExpiry = this.tokenExpiryTime - currentTime;
      const refreshIn = Math.max(0, timeUntilExpiry - 15000);

      if (refreshIn > 0) {
        this.refreshTimer = setTimeout(() => {
          this.refreshAccessToken().catch((error) => {
            console.error("Failed to refresh token:", error);
          });
        }, refreshIn);
      } else {
        console.log("Token needs immediate refresh");
        this.refreshAccessToken().catch((error) => {
          console.error("Failed to refresh token:", error);
        });
      }
    },

    async initializeAuth() {
      if (this.accessToken) {
        try {
          const decodedToken = jwtDecode(this.accessToken);
          this.tokenExpiryTime = decodedToken.exp * 1000;

          const timeUntilExpiry = this.tokenExpiryTime - Date.now();
          console.log(
            "Time until token expires:",
            timeUntilExpiry / 1000,
            "seconds"
          );

          if (timeUntilExpiry < 15000) {
            await this.refreshAccessToken();
          } else {
            this.startTokenRefreshTimer();
          }

          const profileResponse = await authService.getProfile();
          this.profile = profileResponse.data.user;
        } catch (error) {
          console.error("Error initializing auth:", error);
          this.clearAuthState();
        }
      }
    },
  },
});
