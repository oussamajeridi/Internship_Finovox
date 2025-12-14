import { useQuery } from "@tanstack/react-query"
import { getFiles } from "../api"
import type { PaginationParams } from "../types"

export const useGetFiles = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => getFiles(params),
  })
}