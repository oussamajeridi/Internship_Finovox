import { useState, useRef } from 'react'
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFile } from '../api/uploadFile'
import type { FileType } from '../types/File'

interface UploadComponentProps {
  onUploadSuccess?: (file: FileType) => void
  onUploadError?: (error: Error) => void
}

function UploadComponent({ onUploadSuccess, onUploadError }: UploadComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    await uploadSingleFile(file)
  }

  const uploadSingleFile = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)

    let progressInterval: ReturnType<typeof setInterval> | null = null

    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await uploadFile(file)
      
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setUploadProgress(100)
      
      setSuccess(`Successfully uploaded ${file.name}`)
      onUploadSuccess?.(response.file)
      
      // Reset progress after a delay
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
      
    } catch (err: unknown) {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setIsUploading(false)
      setUploadProgress(0)
      
      if (err instanceof Error) {
        setError(err.message)
        onUploadError?.(err)
      } else {
        setError('Upload failed')
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

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={isDragging ? 8 : 2}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
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
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          </motion.div>
          
          <Typography variant="h6" gutterBottom>
            {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or click to browse
          </Typography>
          
          <Typography variant="caption" color="text.secondary" display="block">
            Maximum file size: 100MB
          </Typography>
        </Box>

        {isUploading && (
          <Box sx={{ mt: 3, mx: 'auto', maxWidth: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress 
                variant="determinate" 
                value={uploadProgress} 
                size={24}
              />
              <Typography variant="body2" color="text.secondary">
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity={error ? 'error' : 'success'}
              sx={{ mt: 2 }}
              action={
                <Tooltip title="Clear">
                  <IconButton size="small" onClick={clearMessages}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
              {error || success}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default UploadComponent