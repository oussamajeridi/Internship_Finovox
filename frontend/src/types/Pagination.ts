export interface PaginationMetadata {
  page: number
  per_page: number
  total_files: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface PaginatedResponse<T> {
  files: T[]
  pagination: PaginationMetadata
}

export interface PaginationParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: 'name' | 'size' | 'modified' | 'type'
  sort_order?: 'asc' | 'desc'
  date_from?: string
  date_to?: string
}