# Frontend Documentation

## Overview

The frontend is a modern React-based web application built with TypeScript, providing an intuitive interface for browsing and downloading files. It features a responsive design with Material-UI components, advanced filtering capabilities, and smooth animations.

## Architecture

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Material-UI (MUI) v5 with Emotion styling
- **State Management**: Zustand for lightweight state management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: React Router v7 for navigation
- **Date Handling**: Date-fns for date manipulation and formatting
- **Animations**: Framer Motion and GSAP for smooth animations

### Project Structure
```
frontend/
├── src/
│   ├── api/              # API service functions
│   │   ├── apiRequest.tsx
│   │   ├── downloadFile.ts
│   │   └── getFiles.ts
│   ├── assets/           # Static assets (images, icons)
│   ├── components/       # Reusable UI components
│   │   ├── DateRangeFilter.tsx
│   │   ├── EnhancedEmptyState.tsx
│   │   ├── FileCard.tsx
│   │   ├── FileFilter.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── Sorting.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useGetFiles.ts
│   ├── pages/            # Page components
│   │   └── ListFiles.tsx
│   ├── shared/           # Shared utilities and configurations
│   │   └── theme.tsx
│   ├── store/            # Zustand state management
│   │   └── filesStore.ts
│   ├── types/            # TypeScript type definitions
│   │   └── File.tsx
│   ├── utils/            # Utility functions
│   │   └── formatFileSize.ts
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Public assets
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Core Components

### 1. Application Architecture (App.tsx)

The main application component sets up the core providers and routing:

- **QueryClientProvider**: Manages server state with React Query
- **ThemeProvider**: Provides Material-UI theming throughout the app
- **CssBaseline**: Normalizes CSS across browsers
- **React Router**: Handles application routing

### 2. File Management System

#### State Management (store/filesStore.ts)
Uses Zustand for managing application state with the following features:

- **File Storage**: Centralized file data management
- **Search Functionality**: Real-time file filtering by name
- **Sorting Options**: Sort by name, size, or date with ascending/descending order
- **Date Range Filtering**: Filter files by modification date range
- **Computed Properties**: Automatically filtered and sorted file lists

#### Key State Properties:
```typescript
files: FileType[]              // Array of all files
searchTerm: string             // Current search query
sortBy: 'name' | 'size' | 'date'  // Sorting criteria
sortOrder: 'asc' | 'desc'     // Sorting direction
startDate: Date | null         // Date range start
endDate: Date | null            // Date range end
```

### 3. Data Fetching (hooks/useGetFiles.ts)

Custom hook that leverages React Query for efficient data management:

- **Automatic Caching**: Files are cached and only refetched when necessary
- **Loading States**: Built-in loading and error handling
- **Background Refetching**: Automatic data synchronization
- **Query Key**: Uses 'files' as the query key for caching

### 4. Main Page (pages/ListFiles.tsx)

The primary interface component that orchestrates the file browsing experience:

#### Features:
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Loading Skeletons**: Smooth loading experience with skeleton cards
- **Error Handling**: User-friendly error messages
- **Empty States**: Contextual messages for no results
- **Real-time Updates**: Immediate feedback on filter changes

### 5. UI Components

#### FileCard Component
Advanced file card with rich interactions:

- **Visual Design**: Professional card layout with file preview image
- **File Information**: Displays name, size, and modification date
- **Download Functionality**: Secure file download with visual feedback
- **Animations**: Smooth hover effects and download animations
- **Success States**: Visual confirmation of successful downloads
- **Error Handling**: User-friendly error messages

#### FileFilter Component
Comprehensive filtering interface:

- **Search Bar**: Real-time file name search
- **Sorting Controls**: Dropdown for sort criteria and order
- **Date Range Picker**: Calendar-based date range selection
- **Filter Summary**: Shows total and filtered file counts
- **Responsive Design**: Adapts to mobile and desktop layouts

#### HeroSection Component
Landing page hero section:

- **File Count Display**: Shows total number of files available
- **Welcome Message**: Engaging introduction to the application
- **Responsive Layout**: Adapts to different screen sizes

#### EnhancedEmptyState Component
User-friendly empty state handling:

- **Contextual Messages**: Different messages based on filter state
- **Search Results**: Specific message for no search results
- **Date Range**: Specific message for date range filtering
- **General Empty**: Default message for no files

#### SkeletonCard Component
Loading state placeholder:

- **Card Layout**: Matches the FileCard structure
- **Animated Loading**: Smooth loading animation
- **Responsive Design**: Adapts to grid layout

## API Integration

### API Service (api/getFiles.ts)
Fetches file data from the backend:

```typescript
export const getFiles = async (): Promise<FileType[]> => {
  const response = await apiRequest.get('/api/files');
  return response.data;
};
```

### Download Service (api/downloadFile.ts)
Handles secure file downloads:

- **Direct Download**: Uses browser navigation for downloads
- **Error Handling**: Proper error state management
- **Loading States**: Visual feedback during download

### Base API Configuration (api/apiRequest.tsx)
Axios instance with base configuration:

- **Base URL**: Configurable via environment variables
- **Timeout**: Request timeout settings
- **Error Handling**: Centralized error handling

## Styling and Theming

### Material-UI Theme (shared/theme.tsx)
Custom theme configuration providing:

- **Color Palette**: Consistent brand colors
- **Typography**: Professional font hierarchy
- **Spacing**: Consistent spacing system
- **Breakpoints**: Responsive design breakpoints
- **Component Overrides**: Custom component styling

### Global Styles (index.css)
Base CSS styles including:

- **CSS Reset**: Normalize browser defaults
- **Font Loading**: Google Fonts integration
- **Base Typography**: Global text styling
- **Utility Classes**: Common styling utilities

## Utility Functions

### File Size Formatting (utils/formatFileSize.ts)
Converts bytes to human-readable format:

```typescript
formatFileSize(1024); // Returns "1.0 KB"
formatFileSize(1048576); // Returns "1.0 MB"
```

## Development

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint for code quality

### Environment Variables
Create a `.env` file in the frontend root:

```bash
VITE_API_URL=http://localhost:5000
```

### TypeScript Configuration
- Strict type checking enabled
- Modern ES modules support
- React-specific type definitions
- Path mapping for clean imports

## Build and Deployment

### Production Build
- Optimized bundle with Vite
- Code splitting for better performance
- Asset optimization and minification
- TypeScript compilation

### Deployment Options
- Static hosting (Netlify, Vercel, GitHub Pages)
- CDN distribution for global performance
- Containerized deployment with Docker
- Integration with CI/CD pipelines

## Performance Features

### Optimization Strategies
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized file preview images
- **Memoization**: Prevents unnecessary re-renders
- **Virtual Scrolling**: Efficient handling of large file lists
- **Caching**: Intelligent data caching with React Query

### Bundle Size Optimization
- Tree shaking for unused code elimination
- Dynamic imports for code splitting
- Optimized dependencies selection
- Production build minification

## Accessibility

### WCAG Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: High contrast color ratios
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper HTML structure

## Browser Support

### Modern Browser Support
- Chrome/Chromium (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Progressive Enhancement
- Graceful degradation for older browsers
- Feature detection for modern APIs
- Fallback options for unsupported features

## Error Handling

### User Experience
- **Graceful Error Messages**: User-friendly error notifications
- **Retry Mechanisms**: Automatic retry for failed requests
- **Fallback States**: Alternative content when features fail
- **Loading States**: Clear loading indicators

### Development Error Handling
- **TypeScript**: Compile-time error detection
- **ESLint**: Code quality and error prevention
- **Error Boundaries**: React error boundary components
- **Console Logging**: Development error logging