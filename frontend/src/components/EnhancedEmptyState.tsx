import { Box, Typography, Button, Chip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

interface EnhancedEmptyStateProps {
  searchTerm?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  onClearSearch: () => void;
  onClearFilters: () => void;
}

const EnhancedEmptyState = ({ 
  searchTerm, 
  startDate, 
  endDate, 
  onClearSearch, 
  onClearFilters 
}: EnhancedEmptyStateProps) => {
  const hasActiveFilters = searchTerm || startDate || endDate;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
        borderRadius: 4,
        backgroundColor: 'background.secondary',
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: 500,
        mx: 'auto',
      }}>
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9,
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
          }}>
            <FolderOpenIcon sx={{ fontSize: 60, color: 'white' }} />
          </Box>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            {searchTerm ? 'No files found' : 'No files available'}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            {searchTerm 
              ? `We couldn't find any files matching "${searchTerm}"`
              : startDate || endDate
              ? 'No files found in the selected date range'
              : 'Try adjusting your search or filters to find what you\'re looking for'
            }
          </Typography>
          
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {searchTerm && (
                <Button
                  variant="outlined"
                  onClick={onClearSearch}
                  startIcon={<SearchIcon />}
                  sx={{ 
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Clear Search
                </Button>
              )}
              
              {(startDate || endDate) && (
                <Button
                  variant="outlined"
                  onClick={onClearFilters}
                  startIcon={<RefreshIcon />}
                  sx={{ 
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Chip
              label="💡 Pro tip: Try using different keywords or adjusting the date range"
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                borderColor: 'primary.light',
                color: 'primary.dark',
                fontWeight: 500,
              }}
            />
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default EnhancedEmptyState;