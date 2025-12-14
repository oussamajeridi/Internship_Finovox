import { Card, CardContent, Skeleton, Box } from '@mui/material'

function SkeletonCard() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%', mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={100} height={24} />
        </Box>
        <Skeleton variant="rectangular" height={36} />
      </CardContent>
    </Card>
  )
}

export default SkeletonCard