"""
Simplified Flask application factory.
"""

from flask import Flask
from flask_cors import CORS
from config import config
from routes import bp as api_blueprint


def create_app(config_name='development'):
    """Create and configure Flask app."""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    
    # Configure CORS
    CORS(app, 
         origins=app.config['CORS_ORIGINS'],
         methods=['GET', 'POST', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type'])
    
    # Register blueprints
    app.register_blueprint(api_blueprint)
    
    return app