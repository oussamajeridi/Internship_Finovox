import { apiRequest } from "./apiRequest";

/**
 * Delete a file from the server
 * @param filename - Name of the file to delete
 */
export async function deleteFile(filename: string) : Promise<void> {
    try {
      const response = await apiRequest(`/api/files/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status !== 200) {
        const errorData = await response.data
        if (errorData.error) {
          throw new Error(errorData.error.message)
        }
        throw new Error('Failed to delete file')
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to delete file')
    }
    
}