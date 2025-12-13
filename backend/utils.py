import logging
import os
from datetime import datetime
from pathlib import Path

# Configure logging
def setup_logging(log_level='INFO'):
    """Set up application logging."""
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format='[%(asctime)s] %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    return logging.getLogger(__name__)

def format_file_size(size_bytes):
    """Format file size in human-readable format."""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

def is_safe_filename(filename):
    """Check if filename is safe (no path traversal)."""
    if not filename or filename.startswith('.') or '..' in filename:
        return False
    
    # Check for absolute paths (Unix and Windows)
    if os.path.isabs(filename) or filename.startswith('\\') or len(filename) > 2 and filename[1] == ':':
        return False
    
    # Check for path separators
    if '/' in filename or '\\' in filename:
        return False
    
    # Check for invalid characters
    invalid_chars = ['<', '>', ':', '"', '|', '?', '*']
    if any(char in filename for char in invalid_chars):
        return False
    
    return True

def sanitize_filename(filename):
    """Sanitize filename to prevent security issues."""
    # Get just the basename to prevent path traversal
    safe_name = os.path.basename(filename)
    
    # Remove any remaining path separators
    safe_name = safe_name.replace('/', '').replace('\\', '')
    
    return safe_name

def get_file_info(file_path):
    """Get file information including metadata."""
    try:
        stat = file_path.stat()
        return {
            'name': file_path.name,
            'size': stat.st_size,
            'last_modified': datetime.fromtimestamp(stat.st_mtime).isoformat() + 'Z'
        }
    except (OSError, IOError) as e:
        logging.error(f"Error getting file info for {file_path}: {e}")
        return None