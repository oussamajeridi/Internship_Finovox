import { Alert, Container, Grid, Box } from '@mui/material'
import FileCard from '../components/FileCard'
import SkeletonCard from '../components/SkeletonCard'
import FileFilter from '../components/FileFilter'
import UploadComponent from '../components/UploadComponent'
import { PaginationComponent } from '../components/PaginationComponent'
import { useGetFiles } from '../hooks/useGetFiles'
import { useFilesStore } from '../store/filesStore'
import { useEffect } from 'react'
import type { PaginationParams } from '../types'

function ListFiles() {
  const {
    files,
    setFiles,
    addFile,
    searchTerm,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    pagination,
    currentPage,
    itemsPerPage,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setStartDate,
    setEndDate,
    setPagination,
    setItemsPerPage,
    goToPage,
    getBackendSearchParams,
    getFilteredAndSortedFiles
  } = useFilesStore()

  const backendParams = getBackendSearchParams()
  const { data, isLoading, error } = useGetFiles({
    page: currentPage,
    per_page: itemsPerPage,
    ...backendParams as PaginationParams
  })

  useEffect(() => {
    if (data) {
      setFiles(data.files)
      setPagination(data.pagination)
    }
  }, [data, setFiles, setPagination])

  if (error) return <p>Error: {error.message}</p>

  const filteredAndSortedFiles = getFilteredAndSortedFiles()

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    goToPage(1)
  }

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy as any)
    goToPage(1)
  }

  const handleSortOrderChange = (sortOrder: string) => {
    setSortOrder(sortOrder as any)
    goToPage(1)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage)
  }

  const handlePageChange = (page: number) => {
    goToPage(page)
  }

  return (
    <Container sx={{ minHeight: '100vh', padding: 0, paddingBottom: 4 }}>
      <UploadComponent 
        onUploadSuccess={addFile}
        onUploadError={(error) => console.error('Upload error:', error)}
      />
      
      <Box sx={{ mb: 4 }}>
        <FileFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          totalFiles={pagination?.total_files || files.length}
          filteredFiles={filteredAndSortedFiles.length}
        />
      </Box>

      {isLoading ? (
        <Grid container spacing={2} sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      ) : filteredAndSortedFiles.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {searchTerm 
            ? `No files found matching "${searchTerm}"`
            : startDate || endDate
            ? 'No files found in the selected date range'
            : 'No files available'
          }
        </Alert>
      ) : (
        <Grid container spacing={2} sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          {filteredAndSortedFiles.map((file) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={file.name}>
              <FileCard file={file} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {pagination && pagination.total_pages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={itemsPerPage}
          totalItems={pagination.total_files}
          hasNext={pagination.has_next}
          hasPrev={pagination.has_prev}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </Container>
  )
}

export default ListFiles