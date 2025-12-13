import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

function SearchBar({ searchTerm, onSearchChange, placeholder = "Search files..." }: SearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={localSearchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'primary.main', transition: 'color 0.2s ease' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <AnimatePresence>
              {localSearchTerm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClear}
                      edge="end"
                      size="small"
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'rotate(90deg)',
                        },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                </motion.div>
              )}
            </AnimatePresence>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          },
          '& .MuiOutlinedInput-input': {
            py: 1.5,
            fontSize: '1rem',
          },
        }}
      />
    </Box>
  );
}

export default SearchBar;