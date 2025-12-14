import { 
  Box, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Stack
} from '@mui/material'
import { 
  KeyboardArrowLeft, 
  KeyboardArrowRight,
  FirstPage,
  LastPage 
} from '@mui/icons-material'

interface PaginationComponentProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export const PaginationComponent = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  hasNext,
  hasPrev,
  onPageChange,
  onItemsPerPageChange
}: PaginationComponentProps) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const handleItemsPerPageChange = (event: any) => {
    const newItemsPerPage = parseInt(event.target.value, 10)
    onItemsPerPageChange(newItemsPerPage)
  }

  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            label="Items per page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          {startItem}-{endItem} of {totalItems}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          size="small"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          startIcon={<FirstPage />}
        >
          First
        </Button>
        
        <Button
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrev}
          startIcon={<KeyboardArrowLeft />}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                size="small"
                variant={pageNum === currentPage ? 'contained' : 'outlined'}
                onClick={() => handlePageChange(pageNum)}
                disabled={pageNum < 1 || pageNum > totalPages}
                sx={{ minWidth: '32px', padding: '4px 8px' }}
              >
                {pageNum}
              </Button>
            )
          })}
        </Box>

        <Button
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          endIcon={<KeyboardArrowRight />}
        >
          Next
        </Button>
        
        <Button
          size="small"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          endIcon={<LastPage />}
        >
          Last
        </Button>
      </Stack>
    </Box>
  )
}