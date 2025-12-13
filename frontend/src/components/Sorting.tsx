import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface SortingProps {
  sortBy: 'name' | 'size' | 'date';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'name' | 'size' | 'date') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

function Sorting({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortingProps) {
  return (
    <Box sx={{ display: 'flex',height: '100%', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2 }, alignItems: { xs: 'center' } , justifyContent: { xs: 'center'} }}>
      {/* Sort By Toggle Buttons */}
      <ToggleButtonGroup
        value={sortBy}
        exclusive
        onChange={(_event, newSortBy) => {
          if (newSortBy !== null) {
            onSortByChange(newSortBy);
          }
        }}
        aria-label="sort by"
        size="small"
        sx={{ width: { xs: '100%', sm: 'auto' },justifyContent: { xs: 'space-around'},alignItems: { xs: 'center' } }}
        
      >
        <ToggleButton value="name" aria-label="sort by name">
          <SortByAlphaIcon sx={{ mr: 1 }} />
          Name
        </ToggleButton>
        <ToggleButton value="size" aria-label="sort by size">
          <SortIcon sx={{ mr: 1 }} />
          Size
        </ToggleButton>
        <ToggleButton value="date" aria-label="sort by date">
          <CalendarTodayIcon sx={{ mr: 1 }} />
          Date
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Sort Order Toggle */}
      <ToggleButtonGroup
        value={sortOrder}
        exclusive
        onChange={(_event, newSortOrder) => {
          if (newSortOrder !== null) {
            onSortOrderChange(newSortOrder);
          }
        }}
        aria-label="sort order"
        size="small"
        sx={{ width: { xs: '100%', sm: 'auto' },justifyContent: { xs: 'center'},alignItems: { xs: 'center' }  }}
      >
        <ToggleButton value="asc" aria-label="ascending order">
          <ArrowUpwardIcon />
        </ToggleButton>
        <ToggleButton value="desc" aria-label="descending order">
          <ArrowDownwardIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default Sorting;