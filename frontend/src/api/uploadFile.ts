import { apiRequest } from "./apiRequest"
import type { FileType } from "../types/File"

export interface UploadResponse {
  message: string
  file: FileType
}

export interface UploadError {
  error: {
    code: string
    message: string
  }
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiRequest.post('/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } }
      if (axiosError.response?.data?.error?.message) {
        throw new Error(axiosError.response.data.error.message)
      }
    }
    throw new Error('Upload failed')
  }
}