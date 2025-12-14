# 🐍 File Manager Backend

A Flask-based REST API for file management with upload, download, search, and security features.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Setup & Run
```bash
# Install dependencies
pip install -r requirements.txt

# Create files directory
mkdir files

# Run the application
python main.py

# Run tests
python -m pytest test_app.py
```

### Environment Setup
Create a `.env` file in the backend root:
```bash
# Basic configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
FILES_DIRECTORY=./files
MAX_FILE_SIZE=104857600
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=DEBUG
```

## 🏗️ Architecture Overview

### Tech Stack
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin support
- **pytest** - Testing framework
- **pathlib** - Modern file operations

### Project Structure
```
backend/
├── main.py           # Flask app entry point
├── routes.py         # API endpoints
├── config.py         # Configuration
├── utils.py          # Helper functions
├── test_app.py       # Test suite
├── requirements.txt  # Dependencies
└── files/            # File storage
```

## 🔧 Key Features

### File Operations
- 📤 **Upload files** - Secure file upload with validation
- 📥 **Download files** - Safe file downloads
- 🔍 **Search files** - Search by filename
- 📊 **Sort & filter** - Sort by name, size, date, type
- 📅 **Date filtering** - Filter by date range
- 🗑️ **Delete files** - Remove files safely

### Security Features
- 🔒 **Path traversal protection** - Prevents directory attacks
- 📏 **File size limits** - Configurable size restrictions
- 🔤 **Filename validation** - Blocks malicious filenames
- 🌐 **CORS support** - Configurable cross-origin access

### API Features
- 📄 **Pagination** - Paginated file listings
- 🎯 **RESTful design** - Clean API structure
- 📊 **Error handling** - Consistent error responses
- 🏥 **Health check** - Monitor API status

## 🌐 API Endpoints

### File Management
- `GET /api/files` - List files (with search, sort, pagination)
- `POST /api/files` - Upload new file
- `DELETE /api/files/{filename}` - Delete specific file
- `GET /download/{filename}` - Download file
- `GET /health` - Health check

### Example Requests

#### List Files with Basic Pagination
```bash
# Get first page with 10 files
curl "http://localhost:5000/api/files?page=1&per_page=10"
```

#### Search and Filter Files
```bash
# Search for files containing "report"
curl "http://localhost:5000/api/files?search=report"

# Search with pagination
curl "http://localhost:5000/api/files?search=document&page=1&per_page=5"

# Filter by date range (ISO format)
curl "http://localhost:5000/api/files?date_from=2024-01-01&date_to=2024-12-31"

# Combine search and date filtering
curl "http://localhost:5000/api/files?search=report&date_from=2024-01-01&per_page=20"
```

#### Sort Files
```bash
# Sort by name (ascending)
curl "http://localhost:5000/api/files?sort_by=name&sort_order=asc"

# Sort by size (largest first)
curl "http://localhost:5000/api/files?sort_by=size&sort_order=desc"

# Sort by modification date (newest first)
curl "http://localhost:5000/api/files?sort_by=modified&sort_order=desc"

# Sort by file type
curl "http://localhost:5000/api/files?sort_by=type&sort_order=asc"
```

#### Upload Files
```bash
# Upload a single file
curl -X POST -F "file=@document.pdf" http://localhost:5000/api/files

# Upload with custom filename (if supported)
curl -X POST -F "file=@/path/to/myfile.pdf" http://localhost:5000/api/files

# Upload from current directory
curl -X POST -F "file=@report.xlsx" http://localhost:5000/api/files
```

#### Download Files
```bash
# Download file with original filename
curl -O http://localhost:5000/download/document.pdf

# Download to specific location
curl -o /path/to/save/report.pdf http://localhost:5000/download/report.pdf

# Download with resume support
curl -C - -O http://localhost:5000/download/large-file.zip
```

#### Delete Files
```bash
# Delete a specific file
curl -X DELETE http://localhost:5000/api/files/document.pdf

# Delete with response verification
curl -X DELETE http://localhost:5000/api/files/old-report.xlsx
```

#### System Health Check
```bash
# Check API health
curl http://localhost:5000/health

# Health check with timing
curl -w "@curl-format.txt" http://localhost:5000/health
```

#### Advanced Example
```bash
# Complex query: Search for PDFs, sort by size, page 2
curl "http://localhost:5000/api/files?search=.pdf&sort_by=size&sort_order=desc&page=2&per_page=10"

```

## 📋 Response Format

### Success Response
```json
{
  "files": [
    {
      "name": "document.pdf",
      "size": 1048576,
      "last_modified": "2024-01-15T10:30:00Z",
      "type": ".pdf"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total_files": 25,
    "total_pages": 3
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size"
  }
}
```

## ⚙️ Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `'dev-secret-key'` | Flask secret key |
| `FILES_DIRECTORY` | `'./files'` | File storage location |
| `MAX_FILE_SIZE` | `104857600` | Max file size (bytes) |
| `CORS_ORIGINS` | `'http://localhost:5173'` | Allowed frontend URLs |
| `LOG_LEVEL` | `'INFO'` | Logging level |
| `ALLOWED_EXTENSIONS` | `''` | Restrict file types (optional) |

## 🧪 Testing

```bash
# Run all tests
python -m pytest test_app.py

```

## 🆘 Common Issues

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Permission Issues
```bash
# Fix file permissions
chmod 755 ./files
# Or change ownership
chown -R $USER:$USER ./files
```

### CORS Problems
- Check `CORS_ORIGINS` includes your frontend URL
- Ensure frontend is running on allowed port
- Check browser console for CORS errors

### File Upload Failures
- Verify `FILES_DIRECTORY` exists and is writable
- Check file size against `MAX_FILE_SIZE` limit
- Ensure filename doesn't contain invalid characters

