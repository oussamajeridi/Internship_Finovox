// Enhanced File Card with better visual hierarchy and animations
import { Box, Button, Card, CardContent, Typography, CardMedia, Chip, Snackbar, IconButton } from '@mui/material'
import type { File as FileType } from '../types/File'
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import StorageIcon from '@mui/icons-material/Storage';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { formatFileSize } from '../utils/formatFileSize'
import { motion } from 'framer-motion';;
import fileImage from "../assets/file.png"
function FileCard({ file }: { file: FileType }) {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const navigate = useNavigate()



  const handleDownload = async () => {
    try {
      setIsPending(true)
      setError(null)
      
      // Create a download link instead of navigation
      const downloadUrl = `${import.meta.env.VITE_API_URL}/download/${file.name}`
      navigate(downloadUrl)
      
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000) // Reset success state after 3 seconds
    } catch (error) {
      setError(error as Error)
      setIsSuccess(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '& .card-overlay': {
              opacity: 1,
            },
            '& .card-media': {
              transform: 'scale(1.05)',
            },
          },
          border: isSuccess ? '2px solid' : '2px solid transparent',
          borderColor: isSuccess ? 'secondary.main' : 'transparent',
        }}
      >
        <Snackbar
          open={isSuccess}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message="Download successful!"
          sx={{
            '& .MuiSnackbarContent-root': {
              backgroundColor: 'secondary.main',
              color: 'white',
              fontWeight: 600,
            },
          }}
        />

        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          <CardMedia
            component="img"
            height="200"
            image={fileImage}
            alt={file.name}
            loading="lazy"
            className="card-media"
            sx={{
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
          />
          <Box className="card-overlay" sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'flex-end',
            p: 2,
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              {file.name}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textTransform: 'capitalize',
            }}
          >
            {file.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap',justifyContent: { xs: 'space-around'},alignItems: { xs: 'center' } }}>
            <Chip 
              icon={<StorageIcon sx={{ fontSize: 16 }} />}
              label={formatFileSize(file.size)} 
              size="small" 
              variant="outlined"
              color="primary"
              sx={{
                '& .MuiChip-icon': {
                  color: 'primary.main',
                },
              }}
            />
            <Chip 
              icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
              label={new Date(file.last_modified).toLocaleDateString()}
              size="small" 
              variant="outlined"
              color="secondary"
              sx={{
                '& .MuiChip-icon': {
                  color: 'secondary.main',
                },
              }}
            />
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Button 
              variant={isSuccess ? "outlined" : "contained" }
              color={isSuccess ? "secondary" : "primary"} 
              size="large" 
              disabled={isPending}
              onClick={handleDownload}
              fullWidth
              startIcon={isSuccess ? <FileDownloadDoneIcon /> : <DownloadIcon />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                background: isSuccess ? 'transparent' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                '&:hover': {
                  background: isSuccess ? 'transparent' : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'secondary.main',
                  color: 'white'
                }
              }}
            >
              {isPending ? 'Downloading...' : isSuccess ? 'Downloaded!' : 'Download File'}
            </Button>
            
            {error && (
              <Typography 
                variant="caption" 
                color="error"
                sx={{ 
                  display: 'block', 
                  mt: 1,
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                {error.message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )

}

export default FileCard
