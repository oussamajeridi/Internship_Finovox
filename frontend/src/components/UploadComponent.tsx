import { useState, useRef } from 'react'
import { Box, Typography, CircularProgress, Paper } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { uploadFile } from '../api/upload'
import type { FileType } from '../types/File'
import { useNotificationStore } from '../store/notificationStore'

interface UploadComponentProps {
  onUploadSuccess?: (file: FileType) => void
  onUploadError?: (error: Error) => void
}

function UploadComponent({ onUploadSuccess, onUploadError }: UploadComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotificationStore()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    await uploadSingleFile(file)
  }

  const uploadSingleFile = async (file: File) => {
    setIsUploading(true)

    try {
      const response = await uploadFile(file)
      addNotification({
        message: `Successfully uploaded ${file.name}`,
        severity: 'success',
        autoHideDuration: 3000
      })
      onUploadSuccess?.(response.file)
      setIsUploading(false)
    } catch (err: unknown) {
      setIsUploading(false)
      
      if (err instanceof Error) {
        addNotification({
          message: `Upload failed: ${err.message}`,
          severity: 'error',
          autoHideDuration: 5000
        })
        onUploadError?.(err)
      } else {
        addNotification({
          message: 'Upload failed',
          severity: 'error',
          autoHideDuration: 5000
        })
        onUploadError?.(new Error('Upload failed'))
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Messages are now handled by notification system
  // const clearMessages = () => {
  //   // Messages are now handled by notification system
  // }

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        elevation={isDragging ? 4 : 1}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          cursor: 'pointer',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
        />
        
        <Box sx={{ textAlign: 'center' }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse
          </Typography>
        </Box>

        {isUploading && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Uploading...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Notifications are now handled by NotificationContainer */}
    </Box>
  )
}

export default UploadComponent