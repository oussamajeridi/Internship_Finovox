"""
Simplified route handlers for the Flask application.
"""

from flask import Blueprint, jsonify, send_file, request, current_app
from datetime import datetime
from pathlib import Path
import os

from utils import format_file_size, get_file_info, is_safe_filename, sanitize_filename

bp = Blueprint('api', __name__)


def get_files_dir():
    """Get files directory path."""
    return Path(current_app.config['FILES_DIRECTORY'])


def validate_file_path(filename):
    """Validate and return safe file path."""
    if not is_safe_filename(filename):
        return None
    
    safe_name = sanitize_filename(filename)
    file_path = get_files_dir() / safe_name
    
    try:
        # Ensure path is within files directory
        if not str(file_path.resolve()).startswith(str(get_files_dir().resolve())):
            return None
        return file_path
    except:
        return None


def error_response(code, message):
    """Create standardized error response."""
    return jsonify({'error': {'code': code, 'message': message}})


@bp.route('/api/files', methods=['GET'])
def list_files():
    """Get list of files with basic filtering and pagination."""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '').lower()
        sort_by = request.args.get('sort_by', 'name')
        sort_order = request.args.get('sort_order', 'asc')
        
        # Validate parameters
        if page < 1 or per_page < 1 or per_page > 100:
            return error_response('INVALID_PAGINATION', 'Invalid pagination parameters'), 400
        
        if sort_by not in ['name', 'size', 'modified', 'type']:
            return error_response('INVALID_SORT_FIELD', 'Invalid sort field'), 400
        
        if sort_order not in ['asc', 'desc']:
            return error_response('INVALID_SORT_ORDER', 'Invalid sort order'), 400
        
        # Get files directory
        files_dir = get_files_dir()
        if not files_dir.exists():
            return jsonify({'files': [], 'pagination': {'total_files': 0, 'page': 1, 'total_pages': 1, 'per_page': per_page}}), 200
        
        # Collect files
        files = []
        for file_path in files_dir.iterdir():
            if file_path.is_file() and not file_path.name.startswith('.'):
                file_info = get_file_info(file_path)
                if file_info:
                    files.append(file_info)
        
        # Apply search filter
        if search:
            files = [f for f in files if search in f['name'].lower()]
        
        # Sort files
        reverse = sort_order == 'desc'
        if sort_by == 'name':
            files.sort(key=lambda x: x['name'].lower(), reverse=reverse)
        elif sort_by == 'size':
            files.sort(key=lambda x: x['size'], reverse=reverse)
        elif sort_by == 'modified':
            files.sort(key=lambda x: x['last_modified'], reverse=reverse)
        elif sort_by == 'type':
            files.sort(key=lambda x: x['type'].lower(), reverse=reverse)
        
        # Paginate
        total = len(files)
        pages = (total + per_page - 1) // per_page
        start = (page - 1) * per_page
        end = start + per_page
        
        return jsonify({'files': files[start:end],
            'pagination': {
                'total_files': total,
                'page': page,
                'total_pages': pages,
                'per_page': per_page
            }
        }), 200
        
    except:
        return error_response('INTERNAL_ERROR', 'Failed to list files'), 500


@bp.route('/api/files', methods=['POST'])
def upload_file():
    """Upload a file."""
    try:
        if 'file' not in request.files:
            return error_response('NO_FILE_PART', 'No file part in the request'), 400
        
        file = request.files['file']
        if file.filename == '':
            return error_response('NO_SELECTED_FILE', 'No selected file'), 400
        
        if not is_safe_filename(file.filename):
            return error_response('INVALID_FILENAME', 'Invalid filename'), 400
        
        safe_name = sanitize_filename(file.filename)
        files_dir = get_files_dir()
        files_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = files_dir / safe_name
        
        if file_path.exists():
            return error_response('FILE_EXISTS', 'File already exists'), 409
        
        # Check file size
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        
        max_size = current_app.config['MAX_FILE_SIZE']
        if size > max_size:
            return error_response('FILE_TOO_LARGE', f'File size exceeds maximum allowed size of {format_file_size(max_size)}'), 400
        
        file.save(file_path)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file': get_file_info(file_path)
        }), 201
        
    except:
        return error_response('UPLOAD_ERROR', 'Failed to upload file'), 500


@bp.route('/api/files/<path:filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete a file."""
    try:
        file_path = validate_file_path(filename)
        if not file_path:
            return error_response('INVALID_FILENAME', 'Invalid filename'), 400
        
        if not file_path.exists():
            return error_response('FILE_NOT_FOUND', 'File not found'), 404
        
        file_info = get_file_info(file_path)
        file_path.unlink()
        
        return jsonify({
            'message': 'File deleted successfully',
            'file': file_info
        }), 200
        
    except:
        return error_response('DELETE_ERROR', 'Failed to delete file'), 500


@bp.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    """Download a file."""
    try:
        file_path = validate_file_path(filename)
        if not file_path:
            return error_response('INVALID_FILENAME', 'Invalid filename'), 400
        
        if not file_path.exists():
            return error_response('FILE_NOT_FOUND', 'File not found'), 404
        
        return send_file(file_path, as_attachment=True, download_name=file_path.name)
        
    except:
        return error_response('DOWNLOAD_ERROR', 'Failed to download file'), 500


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200


# Error handlers
@bp.app_errorhandler(404)
def not_found(error):
    return error_response('NOT_FOUND', 'Endpoint not found'), 404


@bp.app_errorhandler(405)
def method_not_allowed(error):
    return error_response('METHOD_NOT_ALLOWED', 'Method not allowed'), 405


@bp.app_errorhandler(500)
def internal_error(error):
    return error_response('INTERNAL_ERROR', 'Internal server error'), 500