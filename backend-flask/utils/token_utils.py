import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv('JWT_SECRET')
if not JWT_SECRET:
    raise ValueError("JWT_SECRET must be set in environment variables")

print(f"Using JWT_SECRET from environment.")

def generate_token(user):
    """Generate JWT token for user"""
    payload = {
        'user_id': user['id'],  # ✅ Changed to user_id for consistency
        'id': user['id'],        # Keep 'id' for backward compatibility
        'name': user['name'],
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    print(f"🔑 Generated token for user {user['id']}: {token[:20]}...")
    return token


def verify_token(token):
    """Verify and decode JWT token"""
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        print(f"✅ Token verified for user: {decoded.get('id') or decoded.get('user_id')}")
        return decoded
    except jwt.ExpiredSignatureError:
        print("❌ Token expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"❌ Invalid token: {str(e)}")
        return None