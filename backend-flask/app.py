from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import secrets

from config.database import init_db
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp

# Load environment variables
load_dotenv()

# Generate JWT_SECRET if not provided
if not os.getenv('JWT_SECRET'):
    os.environ['JWT_SECRET'] = secrets.token_hex(32)
    print('Generated random JWT_SECRET for this session.')
else:
    print('Using JWT_SECRET from environment.')

# Initialize Flask app
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Configure CORS
CORS(app, 
     origins=[os.getenv('CLIENT_URL', 'http://localhost:5173')],
     supports_credentials=True)

# Initialize database
init_db()

# ==================== ROUTES ====================

@app.route('/', methods=['GET'])
def home():
    """API home route"""
    return jsonify({
        'message': 'EduSmart Flask API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/health',
            'auth_signup': '/api/auth/signup',
            'auth_login': '/api/auth/login',
            'auth_logout': '/api/auth/logout',
            'user_profile': '/api/users/me'
        }
    }), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'EduSmart Flask Backend',
        'database': 'connected'
    }), 200

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        'msg': 'Route not found',
        'error': '404 Not Found',
        'available_routes': [
            '/',
            '/health',
            '/api/auth/signup',
            '/api/auth/login',
            '/api/auth/logout',
            '/api/users/me'
        ]
    }), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    print(f"Server error: {str(e)}")
    return jsonify({
        'msg': 'Server error',
        'error': str(e)
    }), 500

# ==================== MAIN ====================

if __name__ == '__main__':
    PORT = int(os.getenv('PORT', 5002))
    DEBUG = os.getenv('FLASK_ENV') != 'production'
    
    print("\n" + "="*60)
    print("🚀 EduSmart Flask Backend Starting...")
    print("="*60)
    print(f"📍 Server URL: http://localhost:{PORT}")
    print(f"🌍 Network URL: http://192.168.1.89:{PORT}")
    print("\n📋 Available Endpoints:")
    print(f"   GET  http://localhost:{PORT}/")
    print(f"   GET  http://localhost:{PORT}/health")
    print(f"   POST http://localhost:{PORT}/api/auth/signup")
    print(f"   POST http://localhost:{PORT}/api/auth/login")
    print(f"   POST http://localhost:{PORT}/api/auth/logout")
    print(f"   GET  http://localhost:{PORT}/api/users/me")
    print(f"   PUT  http://localhost:{PORT}/api/users/me")
    print(f"   PUT  http://localhost:{PORT}/api/users/me/avatar")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=PORT, debug=True)