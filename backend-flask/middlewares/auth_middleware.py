from functools import wraps
from flask import request, jsonify
from utils.token_utils import verify_token


def auth_required(f):
    """Decorator to protect routes requiring authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Check cookie first
        token = request.cookies.get('token')

        # Check Authorization header
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.replace('Bearer ', '').strip()

        if not token:
            return jsonify({'msg': 'No token, authorization denied'}), 401

        # Verify token
        decoded = verify_token(token)
        if not decoded:
            return jsonify({'msg': 'Token is not valid'}), 401

        # Add user info to request
        request.user = decoded
        return f(*args, **kwargs)

    return decorated_function
