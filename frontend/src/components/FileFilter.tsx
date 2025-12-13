import { Grid, Paper, Typography, Box, Chip } from '@mui/material';
import SearchBar from './SearchBar';
import Sorting from './Sorting';
import DateRangeFilter from './DateRangeFilter';
import { motion } from 'framer-motion';

interface FileFilterProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  sortBy: 'name' | 'size' | 'date';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'name' | 'size' | 'date') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  totalFiles: number;
  filteredFiles: number;
}

function FileFilter({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  sortOrder, 
  onSortByChange, 
  onSortOrderChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  totalFiles,
  filteredFiles
}: FileFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 0,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Grid container spacing={3}>
          {/* Search Section */}
          <Grid size={{ xs: 12 }}>
            <Typography
              component="label"
              variant="subtitle2"
              sx={{ 
                mb: 1, 
                display: 'block', 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Search Files
            </Typography>
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Search by file name..."
            />
          </Grid>
          
          {/* Date Range Section */}
          <Grid size={{ xs: 12, lg: 6  }}>
            <Typography
              component="label"
              variant="subtitle2"
              sx={{ 
                mb: 1, 
                display: 'block', 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Date Range
            </Typography>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
          </Grid>

          {/* Sort Section */}
          <Grid size={{ xs: 12, lg: 6 }} flex={1} flexDirection={{ xs: 'column'}}  alignItems={'end'} justifyContent={'flex-end'} >
            <Typography
              component="label"
              variant="subtitle2"
              sx={{ 
                mb: 1, 
                display: 'block', 
                fontWeight: 600,
                color: 'text.primary'
              
              }}
            >
              Sort By
            </Typography>
            <Sorting 
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={onSortByChange}
              onSortOrderChange={onSortOrderChange}
            />
          </Grid>
        </Grid>

        {/* Results Summary */}
        <Box sx={{ 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Showing {filteredFiles} of {totalFiles} files
            {searchTerm && ` (filtered by "${searchTerm}")`}
            {(startDate || endDate) && (
              <span>
                {' '}(date range: 
                {startDate && new Date(startDate).toLocaleDateString()}
                {startDate && endDate && ' - '}
                {endDate && new Date(endDate).toLocaleDateString()}
                )
              </span>
            )}
          </Typography>
          
          {(searchTerm || startDate || endDate) && (
            <Chip
              label="Clear filters"
              onClick={() => {
                onSearchChange('');
                onStartDateChange(null);
                onEndDateChange(null);
              }}
              size="small"
              variant="outlined"
              sx={{
                cursor: 'pointer',
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default FileFilter;