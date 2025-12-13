import './App.css'
import { Route, Routes } from 'react-router'
import ListFiles from './pages/ListFiles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline, Container } from '@mui/material'
import { theme } from './shared/theme'
import HeroSection from './components/HeroSection'

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>  
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding:0
        }}>
          <HeroSection fileCount={1000} />
          <Routes>
            <Route index element={<ListFiles />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
