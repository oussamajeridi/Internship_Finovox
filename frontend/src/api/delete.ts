import { apiRequest } from './client'

export const deleteFile = async (filename: string): Promise<void> => {
  return apiRequest.delete(`/api/files/${encodeURIComponent(filename)}`)
}