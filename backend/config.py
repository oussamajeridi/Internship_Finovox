import os
from datetime import datetime
from pathlib import Path

class Config:
    """Application configuration settings."""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    # File settings
    FILES_DIRECTORY = os.environ.get('FILES_DIRECTORY') or './files'
    MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 104857600))  # 100MB default
    
    # CORS settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    # Security
    ALLOWED_EXTENSIONS = set(filter(None, os.environ.get('ALLOWED_EXTENSIONS', '').split(',')))
    
    @staticmethod
    def init_app(app):
        """Initialize application with configuration."""
        # Create files directory if it doesn't exist
        files_path = Path(Config.FILES_DIRECTORY)
        files_path.mkdir(exist_ok=True)
        
        # Ensure files directory is readable
        if not os.access(Config.FILES_DIRECTORY, os.R_OK):
            raise RuntimeError(f"Files directory '{Config.FILES_DIRECTORY}' is not readable")

class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False
    LOG_LEVEL = 'INFO'
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        # Additional production-specific initialization

class TestingConfig(Config):
    """Testing environment configuration."""
    TESTING = True
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    
    @classmethod
    def init_app(cls, app):
        """Initialize application with testing configuration."""
        # Don't create files directory for testing
        pass
        
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}