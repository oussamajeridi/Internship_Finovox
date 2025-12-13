# Backend Documentation

## Overview

The backend is a Flask-based REST API that provides file management and download functionality. It serves as the server-side component for a file browser application, handling file listing, metadata retrieval, and secure file downloads.

## Architecture

### Technology Stack
- **Framework**: Flask (Python web framework)
- **CORS**: Flask-CORS for cross-origin resource sharing
- **Logging**: Python logging module
- **Configuration**: Environment-based configuration management
- **Security**: Input validation and sanitization

### Project Structure
```
backend/
├── main.py           # Main Flask application with routes
├── config.py         # Configuration management
├── utils.py          # Utility functions
├── test_app.py       # Unit tests
└── requirements.txt  # Python dependencies
```

## Core Components

### 1. Application Factory (main.py)

The application uses the factory pattern for creating Flask instances, allowing for different configurations based on environment.

#### Key Routes:

- **GET /api/files**
  - Retrieves a list of available files with metadata
  - Returns JSON array containing file name, size, and last modified date
  - Sorts files alphabetically by name
  - Skips directories and hidden files

- **GET /download/<filename>**
  - Downloads a specific file securely
  - Validates filename to prevent path traversal attacks
  - Checks file size limits (configurable, default 100MB)
  - Sanitizes filenames for security

- **GET /health**
  - Health check endpoint for monitoring
  - Returns status and timestamp

#### Error Handling:
- Comprehensive error responses with specific error codes
- Proper HTTP status codes for different scenarios
- Structured error messages with user-friendly descriptions

### 2. Configuration Management (config.py)

Supports multiple environments (development, production, testing) with environment-specific settings.

#### Key Configuration Options:
- **FILES_DIRECTORY**: Directory containing files to serve (default: ./files)
- **MAX_FILE_SIZE**: Maximum allowed file size in bytes (default: 100MB)
- **CORS_ORIGINS**: Allowed CORS origins for frontend communication
- **LOG_LEVEL**: Logging verbosity level
- **SECRET_KEY**: Flask secret key for session management

#### Environment Variables:
```bash
FLASK_DEBUG=True/False
FILES_DIRECTORY=/path/to/files
MAX_FILE_SIZE=104857600
CORS_ORIGINS=http://localhost:5174
LOG_LEVEL=INFO
SECRET_KEY=your-secret-key
```

### 3. Utility Functions (utils.py)

Provides essential helper functions for the application:

#### Logging Setup
- Configures structured logging with timestamps
- Supports different log levels (DEBUG, INFO, WARNING, ERROR)

#### File Operations
- **format_file_size()**: Converts bytes to human-readable format (B, KB, MB, GB, TB)
- **get_file_info()**: Retrieves file metadata including size and modification time

#### Security Functions
- **is_safe_filename()**: Validates filenames to prevent path traversal attacks
- **sanitize_filename()**: Removes potentially dangerous characters and path components

## Security Features

### Input Validation
- Filename validation to prevent directory traversal
- Path resolution checks to ensure files stay within allowed directory
- File size limits to prevent abuse
- Content-Type detection for proper file serving

### Error Handling
- Specific error codes for different failure scenarios
- User-friendly error messages without exposing system details
- Proper logging of security-related events

## API Documentation

### Endpoints

#### Get Files List
```http
GET /api/files
```

**Response:**
```json
[
  {
    "name": "document.pdf",
    "size": 1048576,
    "last_modified": "2024-01-15T10:30:00Z"
  }
]
```

**Error Responses:**
- `500`: Directory not found or internal error
- `500`: Invalid directory path

#### Download File
```http
GET /download/{filename}
```

**Parameters:**
- `filename` (path): Name of the file to download

**Success Response:**
- File download with proper headers

**Error Responses:**
- `400`: Invalid filename
- `403`: Access denied (path traversal attempt)
- `404`: File not found
- `400`: File too large
- `500`: Download error

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Development

### Setup
1. Install Python dependencies: `pip install -r requirements.txt`
2. Create files directory: `mkdir files`
3. Add files to serve in the files directory
4. Run the application: `python main.py`

### Testing
- Unit tests available in `test_app.py`
- Run tests with: `python -m pytest test_app.py`

### Configuration
- Default configuration uses development settings
- Modify environment variables for production deployment
- Ensure proper file permissions on the files directory

## Production Deployment

### Security Considerations
- Change default SECRET_KEY
- Use proper file permissions
- Configure appropriate CORS origins
- Set up proper logging and monitoring
- Consider using a reverse proxy (nginx, Apache)

### Performance
- Application is lightweight and suitable for serving moderate file collections
- File size limits prevent memory issues
- Efficient file system operations

### Monitoring
- Health check endpoint available for monitoring systems
- Structured logging for log aggregation
- Error tracking through proper logging levels