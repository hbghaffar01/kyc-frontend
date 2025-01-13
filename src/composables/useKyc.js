import { ref, computed } from 'vue'
import { useKycStore } from '../stores/kyc'
import { useRouter } from 'vue-router'

export function useKyc() {
  const kycStore = useKycStore()
  const router = useRouter()
  const loading = ref(false)
  const error = ref(null)
  const filePreview = ref(null)

  const kycStatus = computed(() => kycStore.kycStatus)
  const isSubmitted = computed(() => kycStore.isKycSubmitted)
  const isPending = computed(() => kycStore.isPending)
  const isApproved = computed(() => kycStore.isApproved)
  const isRejected = computed(() => kycStore.isRejected)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      filePreview.value = URL.createObjectURL(file)
      return file
    }
    return null
  }

  const submitKyc = async (formData) => {
    try {
      loading.value = true
      error.value = null
      await kycStore.submitKyc(formData)
      router.push('/kyc/status')
    } catch (err) {
      error.value = err.response?.data?.message || 'KYC submission failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkKycStatus = async () => {
    try {
      loading.value = true
      error.value = null
      await kycStore.fetchKycStatus()
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch KYC status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearFilePreview = () => {
    if (filePreview.value) {
      URL.revokeObjectURL(filePreview.value)
      filePreview.value = null
    }
  }

  return {
    kycStatus,
    isSubmitted,
    isPending,
    isApproved,
    isRejected,
    loading,
    error,
    filePreview,
    handleFileSelect,
    submitKyc,
    checkKycStatus,
    clearFilePreview
  }
}