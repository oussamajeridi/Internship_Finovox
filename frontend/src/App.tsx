import { Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import { theme } from './shared/theme'
import ListFiles from './pages/ListFiles'
import HeroSection from './components/HeroSection'
import NotificationContainer from './components/NotificationContainer'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box maxWidth="xl" sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          margin: 0
        }}>
          <HeroSection />
          <Routes>
            <Route index element={<ListFiles />} />
          </Routes>
        </Box>
        <NotificationContainer />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App