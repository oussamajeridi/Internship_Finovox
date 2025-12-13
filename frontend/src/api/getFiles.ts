import { apiRequest } from "./apiRequest"
import type {File as FileType} from "../types/File"
export const getFiles = async () : Promise<FileType[]> => {
    const response = await apiRequest.get('/api/files')
    return response.data
}