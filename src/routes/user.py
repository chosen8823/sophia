"""
User API routes for the Sophia platform
"""
from flask import Blueprint, request, jsonify
from src.models.user import db, User
import hashlib
import uuid

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def list_users():
    """List all users (admin only)"""
    try:
        users = User.query.all()
        return jsonify({
            "success": True,
            "users": [user.to_dict() for user in users],
            "total_count": len(users)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.username == data.get('username')) | 
            (User.email == data.get('email'))
        ).first()
        
        if existing_user:
            return jsonify({
                "success": False, 
                "error": "User with this username or email already exists"
            }), 400
        
        # Create new user
        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password_hash=hashlib.sha256(data.get('password', '').encode()).hexdigest(),
            preferred_model=data.get('preferred_model', 'microsoft/DialoGPT-medium')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "user": new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        return jsonify({
            "success": True,
            "user": user.to_dict()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/auth/login', methods=['POST'])
def login():
    """Simple login endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"success": False, "error": "Username and password required"}), 400
        
        user = User.query.filter_by(username=username).first()
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        if user and user.password_hash == password_hash and user.is_active:
            # Simple session token (in production, use proper JWT)
            session_token = str(uuid.uuid4())
            return jsonify({
                "success": True,
                "user": user.to_dict(),
                "session_token": session_token
            })
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500