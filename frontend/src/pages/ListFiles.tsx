//  List Page for files
import { Alert, Container, Grid, Box } from '@mui/material'
import FileCard from '../components/FileCard'
import SkeletonCard from '../components/SkeletonCard'
import FileFilter from '../components/FileFilter'
import UploadComponent from '../components/UploadComponent'
import { useGetFiles } from '../hooks/useGetFiles'
import { useFilesStore } from '../store/filesStore'
import { useEffect } from 'react'

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
        setSearchTerm, 
        setSortBy, 
        setSortOrder, 
        setStartDate,
        setEndDate,
        getFilteredAndSortedFiles 
    } = useFilesStore()
    
    const { data, isLoading, error } = useGetFiles()

    // Update store when data is loaded
    useEffect(() => {
        if (data) {
            setFiles(data)
        }
    }, [data, setFiles])

    if (error) return <p>Error: {error.message}</p>

    const filteredAndSortedFiles = getFilteredAndSortedFiles()

    return (
        <Container sx={{minHeight:'100vh',padding:0}}>
            <UploadComponent 
                onUploadSuccess={addFile}
                onUploadError={(error) => console.error('Upload error:', error)}
            />
            
            <Box sx={{ mb: 4 }}>
                
                
                <FileFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortByChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    totalFiles={files.length}
                    filteredFiles={filteredAndSortedFiles.length}
                />
            </Box>

            {isLoading ? (
                <Grid container spacing={2} sx={{ width: '100%',justifyContent:'center',alignItems:'center' }}  >
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
                <Grid container spacing={2} sx={{ width: '100%',justifyContent:'center',alignItems:'center' }} >
                    {filteredAndSortedFiles.map((file) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={file.name}>
                            <FileCard file={file} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default ListFiles
