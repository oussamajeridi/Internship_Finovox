import { apiRequest } from './client'
import type { FileType } from '../types/File'

export interface UploadResponse {
  message: string
  file: FileType
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest.post<UploadResponse>('/api/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}