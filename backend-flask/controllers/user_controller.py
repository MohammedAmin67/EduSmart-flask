from flask import request, jsonify
from models.user import User
from middlewares.auth_middleware import auth_required
import cloudinary
import cloudinary.uploader

@auth_required
def get_profile():
    """Get user profile"""
    try:
        user = User.find_by_id(request.user['id'])
        if not user:
            return jsonify({'msg': 'User not found'}), 404
        
        # Remove password from response
        user_data = {k: v for k, v in user.items() if k != 'password'}
        return jsonify(user_data), 200
    
    except Exception as e:
        print(f"Get profile error: {str(e)}")
        return jsonify({'msg': 'Server error', 'error': str(e)}), 500

@auth_required
def upload_avatar():
    """Upload user avatar to Cloudinary"""
    try:
        if 'avatar' not in request.files:
            return jsonify({'msg': 'No file uploaded'}), 400
        
        file = request.files['avatar']
        
        # Check if file is empty
        if file.filename == '':
            return jsonify({'msg': 'No file selected'}), 400
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            return jsonify({'msg': 'Only image files are allowed'}), 400
        
        print(f"📤 Uploading avatar for user {request.user['id']}")
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file,
            folder='avatars',
            transformation=[
                {'width': 400, 'height': 400, 'crop': 'fill'},
                {'quality': 'auto'}
            ]
        )
        
        print(f"✅ Upload successful: {result['secure_url']}")
        
        # Update user
        user = User.update(request.user['id'], avatar=result['secure_url'])
        user_data = {k: v for k, v in user.items() if k != 'password'}
        
        return jsonify({
            'msg': 'Avatar uploaded successfully',
            'user': user_data,
            'avatarUrl': result['secure_url']
        }), 200
    
    except Exception as e:
        print(f"❌ Upload avatar error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'msg': 'Server error', 'error': str(e)}), 500