from flask import request, jsonify, make_response
from models.user import User
from utils.token_utils import generate_token
import re
import os


def signup():
    """Handle user signup"""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Validate email
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return jsonify({'msg': 'Invalid email format'}), 400

        # Check if user exists
        if User.find_by_email(email):
            return jsonify({'msg': 'Email already exists'}), 400

        # Create user
        user = User.create(name, email, password)

        # Generate token
        token = generate_token(user)

        # Create response
        response = make_response(jsonify({
            'msg': 'User created successfully',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'avatar': user['avatar']
            },
            'token': token
        }), 201)

        # Set cookie
        is_production = os.getenv('NODE_ENV') == 'production'
        response.set_cookie(
            'token',
            token,
            httponly=True,
            samesite='Strict',
            secure=is_production,
            max_age=24 * 60 * 60
        )

        return response

    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'msg': str(e) or 'Server error'}), 500


def login():
    """Handle user login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Find user
        user = User.find_by_email(email)
        if not user:
            return jsonify({'msg': 'Invalid email or password'}), 400

        # Check password
        if not User.check_password(password, user['password']):
            return jsonify({'msg': 'Invalid email or password'}), 400

        # Generate token
        token = generate_token(user)

        # Create response
        response = make_response(jsonify({
            'msg': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'avatar': user['avatar']
            },
            'token': token
        }), 200)

        # Set cookie
        is_production = os.getenv('NODE_ENV') == 'production'
        response.set_cookie(
            'token',
            token,
            httponly=True,
            samesite='Strict',
            secure=is_production,
            max_age=24 * 60 * 60
        )

        return response

    except Exception as e:
        return jsonify({'msg': 'Error logging in', 'error': str(e)}), 500


def logout():
    """Handle user logout"""
    response = make_response(jsonify({'msg': 'Logout successful'}), 200)
    response.set_cookie('token', '', expires=0)
    return response
