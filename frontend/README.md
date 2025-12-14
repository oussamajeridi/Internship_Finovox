# 📁 File Manager Frontend

A modern React application for managing and organizing files with search, filtering, and upload capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Setup & Run
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Environment Setup
Create a `.env` file in the frontend root:
```bash
VITE_API_URL=http://localhost:5000
```

## 🏗️ Architecture Overview

### Tech Stack
- **React 19** with TypeScript
- **Material-UI** for components
- **Zustand** for state management
- **TanStack Query** for data fetching
- **Vite** for building

### Project Structure
```
src/
├── api/           # API calls (files, upload, download)
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Main page components
├── store/         # State management
├── types/         # TypeScript definitions
└── utils/         # Helper functions
```

## 🔧 Key Features

### File Management
- 📤 Upload files with drag & drop
- 🔍 Search and filter files
- 📅 Date range filtering
- 📊 Sort by name, size, type, or date
- 📄 Pagination support
- 💾 Download files
- 🗑️ Delete files

### State Management
- Centralized file store with Zustand
- Automatic filtering and sorting
- Pagination control
- Search term management

### API Integration
- RESTful API endpoints
- Automatic error handling
- Loading states
- Optimistic updates

## 🎨 UI Components

- **FileCard**: Display individual files
- **FileFilter**: Search and filter controls
- **UploadComponent**: File upload interface
- **Pagination**: Page navigation
- **SkeletonCard**: Loading placeholders

## 🔄 Data Flow

1. **File Loading**: ListFiles → API → Backend
2. **User Actions**: Filter → Store → UI Update
3. **File Upload**: Upload → API → Store → UI

## 🚀 Deployment

```bash
# Build for production
pnpm build

# Preview build
pnpm preview
```

Built files are in the `dist/` directory, ready for static hosting.

## 🆘 Common Issues

1. **API not working**: Check `VITE_API_URL` in `.env`
2. **Build fails**: Run `pnpm install` to ensure dependencies
3. **Type errors**: Run `pnpm build` to check TypeScript
4. **Lint errors**: Run `pnpm lint` to fix code style

## 📚 Documentation

- [React Docs](https://react.dev/)
- [Material-UI](https://mui.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs/)

---
