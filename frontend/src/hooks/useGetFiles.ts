import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getFiles } from "../api/getFiles"
import type { FileType } from "../types/File"

export const useGetFiles = () : UseQueryResult<FileType[]> => {
    return useQuery({
        queryKey: ['files'],
        queryFn: getFiles,
    })
}