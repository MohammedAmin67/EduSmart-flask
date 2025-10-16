from flask import Blueprint
from controllers.user_controller import get_profile, upload_avatar

user_bp = Blueprint('users', __name__)

user_bp.route('/me', methods=['GET'])(get_profile)
user_bp.route('/me/avatar', methods=['PUT'])(upload_avatar)