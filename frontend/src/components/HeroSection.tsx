import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      color: 'white',
      py: 8,
      mb: 6,
      borderRadius: 0,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      },
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Your Files, Beautifully Organized
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              mb: 4,
              fontWeight: 400,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '1rem', md: '1.125rem' },
            }}
          >
            Access, manage, and download your files with an intuitive interface
          </Typography>
          
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;