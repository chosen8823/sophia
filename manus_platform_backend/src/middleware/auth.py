"""
Authentication middleware for JWT token handling
"""
import jwt
import functools
from datetime import datetime, timedelta
from flask import request, jsonify, current_app, g
from src.models.user import User, db

class AuthMiddleware:
    @staticmethod
    def generate_token(user_id, username):
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=24),  # Token expires in 24 hours
            'iat': datetime.utcnow()
        }
        
        return jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
    
    @staticmethod
    def decode_token(token):
        """Decode JWT token"""
        try:
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def get_token_from_request():
        """Extract token from request headers"""
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
                return token
            except IndexError:
                return None
        return None
    
    @staticmethod
    def authenticate_user():
        """Authenticate user from JWT token"""
        token = AuthMiddleware.get_token_from_request()
        if not token:
            return None
            
        payload = AuthMiddleware.decode_token(token)
        if not payload:
            return None
            
        user = User.query.get(payload['user_id'])
        if not user or not user.is_active:
            return None
            
        return user

def require_auth(f):
    """Decorator to require authentication"""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = AuthMiddleware.authenticate_user()
        if not user:
            return jsonify({
                'error': 'Authentication required',
                'code': 'UNAUTHORIZED'
            }), 401
        
        g.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function

def require_admin(f):
    """Decorator to require admin privileges"""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = AuthMiddleware.authenticate_user()
        if not user:
            return jsonify({
                'error': 'Authentication required',
                'code': 'UNAUTHORIZED'
            }), 401
        
        if not user.is_admin:
            return jsonify({
                'error': 'Admin privileges required',
                'code': 'FORBIDDEN'
            }), 403
        
        g.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function

def optional_auth(f):
    """Decorator to optionally authenticate user"""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = AuthMiddleware.authenticate_user()
        g.current_user = user  # Can be None
        return f(*args, **kwargs)
    
    return decorated_function