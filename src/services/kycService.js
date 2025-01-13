import api from "./api";

export const kycService = {
  async submitKyc(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "document") {
        formData.append(key, data[key]);
      }
    });
    if (data.document) {
      formData.append("document", data.document);
    }

    const response = await api.post("/kyc/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getKycStatus(email) {
    try {
      const response = await api.post("/kyc/status", { email });
      return response.data;
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      throw error;
    }
  },

  async updateKyc(id, data) {
    const response = await api.put(`/kyc/update/${id}`, data);
    return response.data;
  },

  async getAllKycs() {
    const response = await api.get("/kyc/submissions");
    return response.data;
  },
};
