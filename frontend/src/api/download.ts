import { apiRequest } from './client'

export const downloadFile = async (filename: string): Promise<Blob> => {
  return apiRequest.get<Blob>(`/download/${filename}`, {
    responseType: 'blob',
  })
}