import { apiRequest } from './client'
import type { FileType } from '../types/File'
import type { PaginatedResponse, PaginationParams } from '../types/Pagination'

export const getFiles = async (params?: PaginationParams): Promise<PaginatedResponse<FileType>> => {
  const queryParams = new URLSearchParams()
  
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  })
  
  const url = `/api/files${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return apiRequest.get<PaginatedResponse<FileType>>(url)
}