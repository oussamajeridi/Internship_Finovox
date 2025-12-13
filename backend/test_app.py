import pytest
import tempfile
import os
from pathlib import Path
from app import create_app
from utils import is_safe_filename, sanitize_filename, format_file_size, get_file_info

@pytest.fixture
def app():
    """Create and configure a test app instance."""
    # Create a temporary directory for test files
    test_files_dir = tempfile.mkdtemp()
    
    # Create test app with test configuration
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
    """A test client for the app."""
    return app.test_client()

class TestFileEndpoints:
    """Test cases for file endpoints."""
    
    def test_get_files_success(self, client):
        """Test successful file listing."""
        response = client.get('/api/files')
        
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 3
        
        # Check file structure
        for file_item in data:
            assert 'name' in file_item
            assert 'size' in file_item
            assert 'last_modified' in file_item
            assert file_item['name'] in ['test1.txt', 'test2.pdf', 'test3.png']
    
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
        assert isinstance(data, list)
        assert len(data) == 0
    
    def test_download_file_success(self, client):
        """Test successful file download."""
        response = client.get('/download/test1.txt')
        
        assert response.status_code == 200
        assert response.data == b'Test content 1'
        # Flask may format Content-Disposition differently, so check for both formats
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
        """Test path traversal protection."""
        response = client.get('/download/../etc/passwd')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'
    
    def test_download_file_absolute_path(self, client):
        """Test absolute path rejection."""
        response = client.get('/download/C:/Windows/System32/config/SAM')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error']['code'] == 'INVALID_FILENAME'
    
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

class TestUtilityFunctions:
    """Test utility functions."""
    
    def test_is_safe_filename_valid(self):
        """Test valid filenames."""
        assert is_safe_filename('test.txt') is True
        assert is_safe_filename('file-name.pdf') is True
        assert is_safe_filename('file_name.doc') is True
    
    def test_is_safe_filename_invalid(self):
        """Test invalid filenames."""
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
        """Test file info extraction."""
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(b'test content')
            tmp_path = tmp.name
        
        try:
            file_info = get_file_info(Path(tmp_path))
            
            assert file_info is not None
            assert file_info['name'] == os.path.basename(tmp_path)
            assert file_info['size'] == 12
            assert 'last_modified' in file_info
        finally:
            os.unlink(tmp_path)