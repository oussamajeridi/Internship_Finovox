from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from pathlib import Path
from config import config
from utils import setup_logging, format_file_size, is_safe_filename, sanitize_filename, get_file_info

def create_app(config_name='development'):
    """Application factory pattern."""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    
    # Setup logging
    logger = setup_logging(app.config['LOG_LEVEL'])
    
    # Configure CORS
    CORS(app, origins=app.config['CORS_ORIGINS'], methods=['GET', 'POST', 'OPTIONS', 'DELETE'], allow_headers=['Content-Type'])
    
    @app.route('/api/files/<path:filename>', methods=['DELETE'])
    def delete_file(filename):
        """
        Delete a specific file.
        
        Args:
            filename: Name of the file to delete
            
        Returns:
            JSON response with deletion status
        """
        try:
            # Validate filename
            if not is_safe_filename(filename):
                logger.warning(f"Invalid filename attempt: {filename}")
                return jsonify({'error': {'code': 'INVALID_FILENAME', 'message': 'Invalid filename'}}), 400
            
            # Sanitize filename
            safe_filename = sanitize_filename(filename)
            
            # Construct full file path
            files_directory = Path(app.config['FILES_DIRECTORY'])
            file_path = files_directory / safe_filename
            
            # Verify file exists and is within the allowed directory
            try:
                file_path = file_path.resolve()
                if not str(file_path).startswith(str(files_directory.resolve())):
                    logger.warning(f"Path traversal attempt: {filename}")
                    return jsonify({'error': {'code': 'ACCESS_DENIED', 'message': 'Access denied'}}), 403
            except (OSError, RuntimeError):
                logger.warning(f"Invalid file path: {filename}")
                return jsonify({'error': {'code': 'INVALID_PATH', 'message': 'Invalid file path'}}), 400
            
            if not file_path.exists():
                logger.warning(f"File not found: {safe_filename}")
                return jsonify({'error': {'code': 'FILE_NOT_FOUND', 'message': 'File not found'}}), 404
            
            if not file_path.is_file():
                logger.warning(f"Path is not a file: {safe_filename}")
                return jsonify({'error': {'code': 'NOT_A_FILE', 'message': 'Path is not a file'}}), 400
            
            # Get file info before deletion for logging
            file_info = get_file_info(file_path)
            
            # Delete the file
            file_path.unlink()
            
            logger.info(f"Successfully deleted file: {safe_filename}")
            return jsonify({
                'message': 'File deleted successfully',
                'file': file_info
            }), 200
            
        except Exception as e:
            logger.error(f"Error deleting file {filename}: {str(e)}")
            return jsonify({'error': {'code': 'DELETE_ERROR', 'message': 'Failed to delete file'}}), 500
    
    @app.route('/api/files', methods=['POST'])
    def upload_file():
        """
        Upload a file to the server.
        
        Returns:
            JSON response with upload status and file metadata
        """
        try:
            # Check if the post request has the file part
            if 'file' not in request.files:
                logger.warning("No file part in the request")
                return jsonify({'error': {'code': 'NO_FILE_PART', 'message': 'No file part in the request'}}), 400
            
            file = request.files['file']
            
            # If user does not select file, browser submits an empty part
            if file.filename == '':
                logger.warning("No selected file")
                return jsonify({'error': {'code': 'NO_SELECTED_FILE', 'message': 'No selected file'}}), 400
            
            # Validate filename
            if not is_safe_filename(file.filename):
                logger.warning(f"Invalid filename: {file.filename}")
                return jsonify({'error': {'code': 'INVALID_FILENAME', 'message': 'Invalid filename'}}), 400
            
            # Sanitize filename
            safe_filename = sanitize_filename(file.filename)
            
            # Get file size from stream
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)  # Reset stream position
            
            # Check file size against maximum allowed
            max_size = app.config['MAX_FILE_SIZE']
            if file_size > max_size:
                logger.warning(f"File too large: {safe_filename} ({file_size} bytes)")
                return jsonify({'error': {'code': 'FILE_TOO_LARGE', 'message': f'File size exceeds maximum allowed size of {format_file_size(max_size)}'}}), 400
            
            # Ensure files directory exists
            files_directory = Path(app.config['FILES_DIRECTORY'])
            files_directory.mkdir(parents=True, exist_ok=True)
            
            # Construct full file path
            file_path = files_directory / safe_filename
            
            # Check if file already exists
            if file_path.exists():
                logger.warning(f"File already exists: {safe_filename}")
                return jsonify({'error': {'code': 'FILE_EXISTS', 'message': 'File already exists'}}), 409
            
            # Save the file
            file.save(file_path)
            
            # Get file info for response
            file_info = get_file_info(file_path)
            
            logger.info(f"Successfully uploaded file: {safe_filename} ({format_file_size(file_size)})")
            return jsonify({
                'message': 'File uploaded successfully',
                'file': file_info
            }), 201
            
        except Exception as e:
            logger.error(f"Error uploading file: {str(e)}")
            return jsonify({'error': {'code': 'UPLOAD_ERROR', 'message': 'Failed to upload file'}}), 500
        

    @app.route('/api/files', methods=['GET'])
    def get_files():
        """
        Get list of available files with metadata.
        
        Returns:
            JSON array of file objects with name, size, and last_modified
        """
        try:
            files_directory = Path(app.config['FILES_DIRECTORY'])
            
            if not files_directory.exists():
                logger.error(f"Files directory does not exist: {files_directory}")
                return jsonify({'error': {'code': 'DIRECTORY_NOT_FOUND', 'message': 'Files directory not found'}}), 500
            
            if not files_directory.is_dir():
                logger.error(f"Files path is not a directory: {files_directory}")
                return jsonify({'error': {'code': 'INVALID_DIRECTORY', 'message': 'Files path is not a directory'}}), 500
            
            files = []
            for file_path in files_directory.iterdir():
                # Skip directories and hidden files
                if file_path.is_file() and not file_path.name.startswith('.'):
                    file_info = get_file_info(file_path)
                    if file_info:
                        files.append(file_info)
            
            # Sort files alphabetically by name
            files.sort(key=lambda x: x['name'].lower())
            
            logger.info(f"Successfully retrieved {len(files)} files")
            return jsonify(files), 200
            
        except Exception as e:
            logger.error(f"Error retrieving files: {str(e)}")
            return jsonify({'error': {'code': 'INTERNAL_ERROR', 'message': 'Failed to retrieve files'}}), 500
    
    @app.route('/download/<path:filename>', methods=['GET'])
    def download_file(filename):
        """
        Download a specific file.
        
        Args:
            filename: Name of the file to download
            
        Returns:
            File download response or error
        """
        try:
            # Validate filename
            if not is_safe_filename(filename):
                logger.warning(f"Invalid filename attempt: {filename}")
                return jsonify({'error': {'code': 'INVALID_FILENAME', 'message': 'Invalid filename'}}), 400
            
            # Sanitize filename
            safe_filename = sanitize_filename(filename)
            
            # Construct full file path
            files_directory = Path(app.config['FILES_DIRECTORY'])
            file_path = files_directory / safe_filename
            
            # Verify file exists and is within the allowed directory
            try:
                file_path = file_path.resolve()
                if not str(file_path).startswith(str(files_directory.resolve())):
                    logger.warning(f"Path traversal attempt: {filename}")
                    return jsonify({'error': {'code': 'ACCESS_DENIED', 'message': 'Access denied'}}), 403
            except (OSError, RuntimeError):
                logger.warning(f"Invalid file path: {filename}")
                return jsonify({'error': {'code': 'INVALID_PATH', 'message': 'Invalid file path'}}), 400
            
            if not file_path.exists():
                logger.warning(f"File not found: {safe_filename}")
                return jsonify({'error': {'code': 'FILE_NOT_FOUND', 'message': 'File not found'}}), 404
            
            if not file_path.is_file():
                logger.warning(f"Path is not a file: {safe_filename}")
                return jsonify({'error': {'code': 'NOT_A_FILE', 'message': 'Path is not a file'}}), 400
            
            # Check file size
            file_size = file_path.stat().st_size
            max_size = app.config['MAX_FILE_SIZE']
            
            if file_size > max_size:
                logger.warning(f"File too large: {safe_filename} ({file_size} bytes)")
                return jsonify({'error': {'code': 'FILE_TOO_LARGE', 'message': f'File size exceeds maximum allowed size of {format_file_size(max_size)}'}}), 400
            
            logger.info(f"Serving file: {safe_filename} ({format_file_size(file_size)})")
            
            # Send file with proper headers
            return send_file(
                file_path,
                as_attachment=True,
                download_name=safe_filename,
                mimetype=None  # Let Flask determine MIME type
            )
            
        except Exception as e:
            logger.error(f"Error downloading file {filename}: {str(e)}")
            return jsonify({'error': {'code': 'DOWNLOAD_ERROR', 'message': 'Failed to download file'}}), 500
    
   
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors."""
        return jsonify({'error': {'code': 'NOT_FOUND', 'message': 'Endpoint not found'}}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle 405 errors."""
        return jsonify({'error': {'code': 'METHOD_NOT_ALLOWED', 'message': 'Method not allowed'}}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors."""
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({'error': {'code': 'INTERNAL_ERROR', 'message': 'Internal server error'}}), 500
    
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200
    
    return app

if __name__ == '__main__':
    # Create app with development config
    app = create_app('development')
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )