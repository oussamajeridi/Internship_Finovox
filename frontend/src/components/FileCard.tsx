import { Button, Card, CardContent, Typography, CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material'
import type { FileType } from '../types'
import DownloadIcon from '@mui/icons-material/Download'
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone'
import StorageIcon from '@mui/icons-material/Storage'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { formatFileSize } from '../utils/formatFileSize'
import { format } from 'date-fns'
import fileImage from '../assets/file.png'
import { deleteFile } from '../api'
import { useNavigate } from 'react-router'
import { useFilesStore } from '../store/filesStore'
import { useNotificationStore } from '../store/notificationStore'

interface FileCardProps {
  file: FileType
}

function FileCard({ file }: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { deleteFile: deleteFileFromStore } = useFilesStore()
  const { addNotification } = useNotificationStore()

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      setError(null)
      
      const downloadUrl = `${import.meta.env.VITE_API_URL}/download/${file.name}`
      navigate(downloadUrl)
      
      addNotification({
        message: `Download started: ${file.name}`,
        severity: 'success',
        autoHideDuration: 3000
      })
      
      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 3000)
      
    } catch {
      setError('Download failed')
      setIsDownloaded(false)
      addNotification({
        message: `Download failed: ${file.name}`,
        severity: 'error',
        autoHideDuration: 5000
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      
      await deleteFile(file.name)
      deleteFileFromStore(file.name)
      
      addNotification({
        message: `File deleted: ${file.name}`,
        severity: 'success',
        autoHideDuration: 3000
      })
      
      setDeleteDialogOpen(false)
    } catch {
      setError('Delete failed')
      addNotification({
        message: `Delete failed: ${file.name}`,
        severity: 'error',
        autoHideDuration: 5000
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={fileImage}
          alt={file.name}
          loading="lazy"
          sx={{
            objectFit: 'contain',
          }}
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            {file.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip 
              icon={<StorageIcon />}
              label={formatFileSize(file.size)} 
              size="small" 
              variant="outlined"
            />
            <Chip 
              icon={<CalendarTodayIcon />}
              label={format(new Date(file.last_modified), 'MMM dd, yyyy HH:mm')}
              size="small" 
              variant="outlined"
            />
          </Box>
          
          <Box>
            <Button 
              variant={isDownloaded ? "outlined" : "contained"}
              size="small" 
              disabled={isDownloading}
              onClick={handleDownload}
              startIcon={isDownloaded ? <FileDownloadDoneIcon /> : <DownloadIcon />}
            >
              {isDownloading ? 'Downloading...' : isDownloaded ? 'Downloaded!' : 'Download'}
            </Button>
            
            <Button 
              variant="outlined"
              color="error" 
              size="small" 
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(true)}
              startIcon={<DeleteIcon />}
              sx={{ ml: 1 }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete "{file.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FileCard