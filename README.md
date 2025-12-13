# File Browser Application

A modern, full-stack file browser application with a Flask backend and React frontend. The application provides a secure and intuitive interface for browsing and downloading files with advanced filtering, sorting, and search capabilities.

## 🚀 Features

### Backend (Flask)
- **RESTful API**: Clean and well-documented endpoints
- **Secure File Downloads**: Path traversal protection and input validation
- **File Metadata**: Comprehensive file information (name, size, modification date)
- **CORS Support**: Configurable cross-origin resource sharing
- **Environment Configuration**: Multiple environment support (development, production, testing)
- **Comprehensive Logging**: Structured logging with configurable levels
- **Health Monitoring**: Built-in health check endpoint

### Frontend (React + TypeScript)
- **Modern UI**: Material-UI components with professional design
- **Advanced Filtering**: Search by name, sort by multiple criteria, date range filtering
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Framer Motion and GSAP for engaging interactions
- **Real-time Updates**: Instant feedback on user interactions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Efficient state management and caching strategies

## 📁 Project Structure

```
├── backend/                 # Flask backend application
│   ├── main.py             # Main Flask application with API endpoints
│   ├── config.py           # Configuration management
│   ├── utils.py            # Utility functions (logging, file operations, security)
│   ├── test_app.py         # Unit tests
│   └── README.md           # Backend documentation
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── api/            # API service functions
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── package.json        # Dependencies and scripts
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🛠 Technology Stack

### Backend
- **Framework**: Flask (Python)
- **CORS**: Flask-CORS
- **Logging**: Python logging module
- **Configuration**: Environment-based configuration
- **Security**: Input validation and sanitization

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Styling**: Emotion (CSS-in-JS)
- **Animations**: Framer Motion, GSAP
- **Date Handling**: Date-fns

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.7+, pip
- **Frontend**: Node.js 16+, npm or pnpm

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a files directory and add some files:
   ```bash
   mkdir files
   # Add your files to the files/ directory
   ```

4. Run the Flask application:
   ```bash
   python main.py
   ```

The backend will start on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file:
   ```bash
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

The frontend will start on `http://localhost:5173`

## 📖 API Documentation

### Endpoints

#### Get Files List
```http
GET /api/files
```

Returns an array of file objects with metadata:
```json
[
  {
    "name": "document.pdf",
    "size": 1048576,
    "last_modified": "2024-01-15T10:30:00Z"
  }
]
```

#### Download File
```http
GET /download/{filename}
```

Downloads the specified file securely with proper headers.

#### Health Check
```http
GET /health
```

Returns application health status:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔧 Configuration

### Backend Configuration
Set environment variables in your shell or create a `.env` file:

```bash
# Flask settings
FLASK_DEBUG=True
SECRET_KEY=your-secret-key

# File settings
FILES_DIRECTORY=./files
MAX_FILE_SIZE=104857600  # 100MB

# CORS settings
CORS_ORIGINS=http://localhost:5173

# Logging
LOG_LEVEL=INFO
```

### Frontend Configuration
Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest test_app.py
```

### Frontend Testing
```bash
cd frontend
npm run lint  # Code quality check
```

## 🏗️ Building for Production

### Backend Production
1. Set production environment variables:
   ```bash
   export FLASK_DEBUG=False
   export SECRET_KEY=your-production-secret-key
   export CORS_ORIGINS=https://your-frontend-domain.com
   ```

2. Run with production WSGI server (e.g., Gunicorn):
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 main:create_app()
   ```

### Frontend Production
```bash
cd frontend
npm run build
```

The built files will be in `dist/` directory, ready for deployment to any static hosting service.

## 🌐 Deployment

### Backend Deployment Options
- **Traditional VPS**: Deploy with Gunicorn and Nginx
- **Docker**: Containerized deployment
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **PaaS**: Heroku, PythonAnywhere

### Frontend Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **Container**: Docker with nginx
- **Integration**: CI/CD pipelines with GitHub Actions, GitLab CI

## 🔒 Security Features

### Backend Security
- **Path Traversal Protection**: Validates and sanitizes file paths
- **File Size Limits**: Prevents abuse with configurable size limits
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Restricted cross-origin access
- **Error Handling**: Secure error messages without system exposure

### Frontend Security
- **TypeScript**: Compile-time error detection
- **Input Validation**: Client-side validation with server verification
- **Secure Downloads**: Proper file handling and download security
- **XSS Protection**: Safe DOM manipulation and user input handling

## 📊 Performance Optimization

### Backend Performance
- **Efficient File Operations**: Optimized file system access
- **Memory Management**: Streaming file downloads
- **Caching**: Appropriate caching headers for static files
- **Logging**: Structured logging without performance impact

### Frontend Performance
- **Code Splitting**: Dynamic imports and lazy loading
- **Image Optimization**: Optimized file preview images
- **State Management**: Efficient state updates with Zustand
- **Caching**: Intelligent data caching with React Query
- **Bundle Optimization**: Tree shaking and minification

## 🎯 Key Features

### File Browsing
- **Grid Layout**: Responsive card-based file display
- **File Information**: Name, size, and modification date
- **Visual Feedback**: Loading states and animations
- **Empty States**: Contextual messages for no results

### Advanced Filtering
- **Search**: Real-time file name search
- **Sorting**: Sort by name, size, or date
- **Date Range**: Filter by modification date range
- **Filter Summary**: Shows filtered vs total file counts

### User Experience
- **Smooth Animations**: Framer Motion and GSAP animations
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first approach

## 📝 Detailed Documentation

For detailed documentation on each component:

- **[Backend Documentation](backend/README.md)** - Complete API documentation, configuration options, and development guide
- **[Frontend Documentation](frontend/README.md)** - Component details, state management, styling, and deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the detailed documentation in `backend/README.md` and `frontend/README.md`
- Review the API documentation in this README
- Check the configuration examples
- Ensure all prerequisites are installed correctly

## 🏷️ Version History

- **v1.0.0** - Initial release with core file browsing functionality
  - Flask backend with secure file downloads
  - React frontend with Material-UI design
  - Advanced filtering and search capabilities
  - Responsive design and accessibility features