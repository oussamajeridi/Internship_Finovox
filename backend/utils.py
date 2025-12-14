"""
Simplified utility functions for file operations.
"""

import logging
import os
from datetime import datetime
from pathlib import Path


def format_file_size(size_bytes):
    """Convert file size to human-readable format."""
    if size_bytes == 0:
        return "0 B"
    
    sizes = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(sizes) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {sizes[i]}"


def is_safe_filename(filename):
    """Check if filename is safe (no path traversal)."""
    if not filename or filename.startswith('.'):
        return False
    
    # Check for path traversal
    if '..' in filename or '/' in filename or '\\' in filename:
        return False
    
    # Check for absolute paths
    if os.path.isabs(filename) or filename.startswith('\\') or (len(filename) > 2 and filename[1] == ':'):
        return False
    
    # Check for invalid characters
    invalid_chars = ['<', '>', ':', '"', '|', '?', '*']
    return not any(char in filename for char in invalid_chars)


def sanitize_filename(filename):
    """Get safe filename by removing path components."""
    return os.path.basename(filename).replace('/', '').replace('\\', '')


def get_file_info(file_path):
    """Get file metadata."""
    try:
        stat = file_path.stat()
        return {
            'name': file_path.name,
            'size': stat.st_size,
            'last_modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'type': file_path.suffix.lower() or 'no-extension'
        }
    except:
        return None