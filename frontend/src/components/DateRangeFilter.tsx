import { Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

function DateRangeFilter({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: DateRangeFilterProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Date Range
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: { xs: 1, sm: 2 }, 
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <DatePicker
            label="From Date"
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: { minWidth: { xs: '100%', sm: 120, lg: 140 } }
              }
            }}
            maxDate={endDate || undefined}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            px: { xs: 0, sm: 1 }, 
            textAlign: { xs: 'center', sm: 'left' },
            display: { xs: 'none', sm: 'block' }
          }}>
            to
          </Typography>
          
          <DatePicker
            label="To Date"
            value={endDate}
            onChange={onEndDateChange}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: { minWidth: { xs: '100%', sm: 120, lg: 140 } }
              }
            }}
            minDate={startDate || undefined}
          />
          
          {(startDate || endDate) && (
            <TextField
              size="small"
              variant="outlined"
              onClick={() => {
                onStartDateChange(null);
                onEndDateChange(null);
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: 60, lg: 80 },
                maxWidth: { xs: '100%', sm: 80 },
                cursor: 'pointer',
                '& .MuiInputBase-input': {
                  cursor: 'pointer',
                  textAlign: 'center'
                }
              }}
              InputProps={{
                readOnly: true,
                sx: { 
                  color: 'primary.main',
                  fontSize: '0.875rem'
                }
              }}
              value="Clear"
            />
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default DateRangeFilter;