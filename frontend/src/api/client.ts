import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const apiRequest = {
  get: async <T>(url: string, config = {}) => {
    const response = await apiClient.get<T>(url, config)
    return response.data
  },

  post: async <T>(url: string, data = {}, config = {}) => {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  },

  delete: async <T>(url: string, config = {}) => {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  },

  put: async <T>(url: string, data = {}, config = {}) => {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  },
}

export default apiRequest