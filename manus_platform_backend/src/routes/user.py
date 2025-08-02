"""
User authentication and management routes
"""
from flask import Blueprint, request, jsonify, g
from werkzeug.security import check_password_hash
from datetime import datetime
from src.models.user import db, User
from src.middleware.auth import AuthMiddleware, require_auth, require_admin
from src.middleware.rate_limit import auth_rate_limit, api_rate_limit

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
@auth_rate_limit
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'error': f'{field} is required',
                    'code': 'VALIDATION_ERROR'
                }), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Validate input
        if len(username) < 3:
            return jsonify({
                'error': 'Username must be at least 3 characters long',
                'code': 'VALIDATION_ERROR'
            }), 400
            
        if len(password) < 6:
            return jsonify({
                'error': 'Password must be at least 6 characters long',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({
                'error': 'Username already exists',
                'code': 'USER_EXISTS'
            }), 409
            
        if User.query.filter_by(email=email).first():
            return jsonify({
                'error': 'Email already registered',
                'code': 'EMAIL_EXISTS'
            }), 409
        
        # Create new user
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        token = AuthMiddleware.generate_token(user.id, user.username)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@user_bp.route('/login', methods=['POST'])
@auth_rate_limit
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('username') or not data.get('password'):
            return jsonify({
                'error': 'Username and password are required',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'error': 'Invalid credentials',
                'code': 'INVALID_CREDENTIALS'
            }), 401
        
        if not user.is_active:
            return jsonify({
                'error': 'Account is disabled',
                'code': 'ACCOUNT_DISABLED'
            }), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = AuthMiddleware.generate_token(user.id, user.username)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@user_bp.route('/profile', methods=['GET'])
@require_auth
@api_rate_limit
def get_profile():
    """Get current user profile"""
    try:
        return jsonify({
            'user': g.current_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@user_bp.route('/profile', methods=['PUT'])
@require_auth
@api_rate_limit
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Update allowed fields
        if 'email' in data:
            email = data['email'].strip().lower()
            # Check if email is already taken by another user
            existing_user = User.query.filter(
                User.email == email,
                User.id != user.id
            ).first()
            if existing_user:
                return jsonify({
                    'error': 'Email already registered',
                    'code': 'EMAIL_EXISTS'
                }), 409
            user.email = email
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@user_bp.route('/change-password', methods=['POST'])
@require_auth
@auth_rate_limit
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Validate required fields
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({
                'error': 'Current password and new password are required',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Verify current password
        if not user.check_password(current_password):
            return jsonify({
                'error': 'Current password is incorrect',
                'code': 'INVALID_PASSWORD'
            }), 400
        
        # Validate new password
        if len(new_password) < 6:
            return jsonify({
                'error': 'New password must be at least 6 characters long',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # Update password
        user.set_password(new_password)
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@user_bp.route('/api-key/regenerate', methods=['POST'])
@require_auth
@api_rate_limit
def regenerate_api_key():
    """Regenerate user API key"""
    try:
        user = g.current_user
        user.generate_api_key()
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'API key regenerated successfully',
            'api_key': user.api_key
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@user_bp.route('/validate-token', methods=['POST'])
@api_rate_limit
def validate_token():
    """Validate JWT token"""
    try:
        user = AuthMiddleware.authenticate_user()
        if user:
            return jsonify({
                'valid': True,
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({
                'valid': False
            }), 401
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500