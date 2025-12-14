import { Box, Container, Typography } from '@mui/material';

const HeroSection = () => {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      color: 'white',
      py: 6,
      mb: 4,
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Your Files, Beautifully Organized
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ opacity: 0.9, mb: 2 }}
        >
          Access, manage, and download your files with an intuitive interface
        </Typography>
      </Container>
    </Box>
  );
};

export default HeroSection;