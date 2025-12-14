"""
Application entry point - simplified version.
"""

from main import create_app
import os

if __name__ == '__main__':
    config_name = os.environ.get('FLASK_ENV', 'development')
    app = create_app(config_name)
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=app.config['DEBUG']
    )