import { Card, CardContent, Skeleton, Box } from '@mui/material'
import { motion } from 'framer-motion';

function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Skeleton 
            variant="text" 
            sx={{ 
              fontSize: '1.5rem', 
              mb: 1,
              borderRadius: 2,
            }} 
          />
          <Skeleton 
            variant="text" 
            sx={{ 
              fontSize: '1rem', 
              width: '60%',
              mb: 2,
              borderRadius: 2,
            }} 
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton 
              variant="rectangular"
              width={80}
              height={24}
              sx={{ borderRadius: 3 }}
            />
            <Skeleton 
              variant="rectangular"
              width={100}
              height={24}
              sx={{ borderRadius: 3 }}
            />
          </Box>
          <Skeleton 
            variant="rectangular"
            height={48}
            sx={{ 
              borderRadius: 2,
              mt: 2,
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SkeletonCard