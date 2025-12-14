"""
Test suite for the Flask file management application.

This module contains comprehensive tests for all API endpoints and utility functions,
organized by functionality for better maintainability.
"""

import pytest
import tempfile
import os
from pathlib import Path
from io import BytesIO

from main import create_app
from utils import is_safe_filename, sanitize_filename, format_file_size, get_file_info


@pytest.fixture
def app():
    """Create and configure a test app instance with temporary files directory."""
    # Create a temporary directory for test files
    test_files_dir = tempfile.mkdtemp()
    
    # Create test app with testing configuration
    app = create_app('testing')
    app.config['FILES_DIRECTORY'] = test_files_dir
    app.config['TESTING'] = True
    
    # Create some test files
    (Path(test_files_dir) / 'test1.txt').write_text('Test content 1')
    (Path(test_files_dir) / 'test2.pdf').write_text('Test content 2')
    (Path(test_files_dir) / 'test3.png').write_text('Test content 3')
    
    yield app
    
    # Cleanup
    import shutil
    try:
        shutil.rmtree(test_files_dir)
    except PermissionError:
        # Handle Windows permission issues
        pass


@pytest.fixture
def client(app):
    """Create a test client for the Flask app."""
    return app.test_client()


class TestFileListingEndpoints:
    """Test cases for file listing and retrieval endpoints."""
    
    def test_get_files_success(self, client):
        """Test successful file listing."""
        response = client.get('/api/files')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'files' in data
        assert 'pagination' in data
        assert len(data['files']) == 3
        
        # Check file structure
        for file_item in data['files']:
            assert 'name' in file_item
            assert 'size' in file_item
            assert 'last_modified' in file_item
            assert file_item['name'] in ['test1.txt', 'test2.pdf', 'test3.png']
    
    def test_get_files_with_pagination(self, client):
        """Test file listing with pagination parameters."""
        response = client.get('/api/files?page=1&per_page=2')
        
        assert response.status_code == 200
        data = response.get_json()
        assert len(data['files']) == 2
        assert data['pagination']['page'] == 1
        assert data['pagination']['per_page'] == 2
        assert data['pagination']['total_files'] == 3
        assert data['pagination']['total_pages'] == 2
    
    def test_get_files_with_search(self, client):
        """Test file listing with search filter."""
        response = client.get('/api/files?search=test1')
        
        assert response.status_code == 200
        data = response.get_json()
        assert len(data['files']) == 1
        assert data['files'][0]['name'] == 'test1.txt'
    
    def test_get_files_with_sorting(self, client):
        """Test file listing with sorting parameters."""
        response = client.get('/api/files?sort_by=name&sort_order=desc')
        
        assert response.status_code == 200
        data = response.get_json()
        assert len(data['files']) == 3
        # Files should be sorted in descending order by name
        names = [f['name'] for f in data['files']]
        assert names == sorted(names, reverse=True)
    
    def test_get_files_empty_directory(self, client, app):
        """Test file listing with empty directory."""
        # Remove all files
        test_dir = Path(app.config['FILES_DIRECTORY'])
        for file_path in test_dir.iterdir():
            if file_path.is_file():
                file_path.unlink()
        
        response = client.get('/api/files')
        
        assert response.status_code == 200
        data = response.get_json()
        assert len(data['files']) == 0
        assert data['pagination']['total_files'] == 0


class TestFileDownloadEndpoints:
    """Test cases for file download endpoints."""
    
    def test_download_file_success(self, client):
        """Test successful file download."""
        response = client.get('/download/test1.txt')
        
        assert response.status_code == 200
        assert response.data == b'Test content 1'
        content_disposition = response.headers['Content-Disposition']
        assert content_disposition in ['attachment; filename="test1.txt"', 'attachment; filename=test1.txt']
    
    def test_download_file_not_found(self, client):
        """Test download of non-existent file."""
        response = client.get('/download/nonexistent.txt')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'FILE_NOT_FOUND'
    
    def test_download_file_path_traversal(self, client):
        """Test path traversal protection in download endpoint."""
        response = client.get('/download/../etc/passwd')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'
    
    def test_download_file_absolute_path(self, client):
        """Test absolute path rejection in download endpoint."""
        response = client.get('/download/C:/Windows/System32/config/SAM')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'


class TestFileUploadEndpoints:
    """Test cases for file upload endpoints."""
    
    def test_upload_file_success(self, client):
        """Test successful file upload."""
        data = {
            'file': (BytesIO(b'Test upload content'), 'test_upload.txt')
        }
        
        response = client.post('/api/files', data=data, content_type='multipart/form-data')
        
        assert response.status_code == 201
        data = response.get_json()
        assert 'message' in data
        assert data['message'] == 'File uploaded successfully'
        assert 'file' in data
        assert data['file']['name'] == 'test_upload.txt'
        assert data['file']['size'] == 19  # length of 'Test upload content'
    
    def test_upload_no_file_part(self, client):
        """Test upload with no file part in request."""
        response = client.post('/api/files', data={})
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'NO_FILE_PART'
    
    def test_upload_empty_filename(self, client):
        """Test upload with empty filename."""
        data = {
            'file': (BytesIO(b''), '')
        }
        
        response = client.post('/api/files', data=data, content_type='multipart/form-data')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'NO_SELECTED_FILE'
    
    def test_upload_invalid_filename(self, client):
        """Test upload with invalid filename."""
        data = {
            'file': (BytesIO(b'test content'), '../invalid.txt')
        }
        
        response = client.post('/api/files', data=data, content_type='multipart/form-data')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'
    
    def test_upload_file_too_large(self, client, app):
        """Test upload with file exceeding size limit."""
        # Create content larger than max size (100MB)
        max_size = app.config['MAX_FILE_SIZE']
        large_content = b'x' * (max_size + 1)
        
        data = {
            'file': (BytesIO(large_content), 'large_file.txt')
        }
        
        response = client.post('/api/files', data=data, content_type='multipart/form-data')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'FILE_TOO_LARGE'
    
    def test_upload_file_already_exists(self, client):
        """Test upload when file already exists."""
        # First upload
        test_content = b'Test content'
        data1 = {
            'file': (BytesIO(test_content), 'duplicate.txt')
        }
        client.post('/api/files', data=data1, content_type='multipart/form-data')
        
        # Try to upload same file again
        data2 = {
            'file': (BytesIO(test_content), 'duplicate.txt')
        }
        response = client.post('/api/files', data=data2, content_type='multipart/form-data')
        
        assert response.status_code == 409
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'FILE_EXISTS'


class TestFileDeleteEndpoints:
    """Test cases for file deletion endpoints."""
    
    def test_delete_file_success(self, client):
        """Test successful file deletion."""
        # First upload a file
        test_content = b'Test content for deletion'
        data = {
            'file': (BytesIO(test_content), 'delete_test.txt')
        }
        upload_response = client.post('/api/files', data=data, content_type='multipart/form-data')
        assert upload_response.status_code == 201
        
        # Now delete the file
        response = client.delete('/api/files/delete_test.txt')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data
        assert data['message'] == 'File deleted successfully'
        assert 'file' in data
        assert data['file']['name'] == 'delete_test.txt'
        assert data['file']['size'] == len(test_content)
    
    def test_delete_file_not_found(self, client):
        """Test deletion of non-existent file."""
        response = client.delete('/api/files/nonexistent.txt')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'FILE_NOT_FOUND'
    
    def test_delete_file_invalid_filename(self, client):
        """Test deletion with invalid filename."""
        response = client.delete('/api/files/../etc/passwd')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'
    
    def test_delete_file_path_traversal(self, client):
        """Test deletion with path traversal attempt."""
        response = client.delete('/api/files/../../../etc/passwd')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'


class TestSystemEndpoints:
    """Test cases for system and utility endpoints."""
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get('/health')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
    
    def test_404_handler(self, client):
        """Test 404 error handler."""
        response = client.get('/nonexistent-endpoint')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'NOT_FOUND'
    
    def test_405_handler(self, client):
        """Test 405 method not allowed error handler."""
        response = client.post('/health')  # Health endpoint only supports GET
        
        assert response.status_code == 405
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'METHOD_NOT_ALLOWED'


class TestUtilityFunctions:
    """Test cases for utility functions."""
    
    def test_is_safe_filename_valid(self):
        """Test valid filename validation."""
        assert is_safe_filename('test.txt') is True
        assert is_safe_filename('file-name.pdf') is True
        assert is_safe_filename('file_name.doc') is True
    
    def test_is_safe_filename_invalid(self):
        """Test invalid filename validation."""
        assert is_safe_filename('') is False
        assert is_safe_filename('.hidden') is False
        assert is_safe_filename('../test.txt') is False
        assert is_safe_filename('/etc/passwd') is False
        assert is_safe_filename('test<file>.txt') is False
    
    def test_sanitize_filename(self):
        """Test filename sanitization."""
        assert sanitize_filename('test.txt') == 'test.txt'
        assert sanitize_filename('../test.txt') == 'test.txt'
        assert sanitize_filename('/path/to/file.txt') == 'file.txt'
    
    def test_format_file_size(self):
        """Test file size formatting."""
        assert format_file_size(0) == '0 B'
        assert format_file_size(1024) == '1.0 KB'
        assert format_file_size(1048576) == '1.0 MB'
        assert format_file_size(1073741824) == '1.0 GB'
    
    def test_get_file_info(self):
        """Test file metadata extraction."""
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(b'test content')
            tmp_path = tmp.name
        
        try:
            file_info = get_file_info(Path(tmp_path))
            
            assert file_info is not None
            assert file_info['name'] == os.path.basename(tmp_path)
            assert file_info['size'] == 12
            assert 'last_modified' in file_info
            assert 'type' in file_info
        finally:
            os.unlink(tmp_path)