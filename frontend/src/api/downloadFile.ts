
import { apiRequest } from "./apiRequest"

export const downloadFile = async (fileId: string) : Promise<Blob> => {
    const response = await apiRequest.get(`/download/${fileId}`, {
        responseType: 'blob',
    })
    return response.data
}
