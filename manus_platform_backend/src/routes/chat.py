"""
Chat management routes
"""
from flask import Blueprint, request, jsonify, g
from datetime import datetime
from src.models.user import db, Chat, ChatMessage
from src.middleware.auth import require_auth
from src.middleware.rate_limit import chat_rate_limit, api_rate_limit

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chats', methods=['GET'])
@require_auth
@api_rate_limit
def get_chats():
    """Get user's chats"""
    try:
        user = g.current_user
        chats = Chat.query.filter_by(user_id=user.id).order_by(Chat.updated_at.desc()).all()
        
        return jsonify({
            'chats': [chat.to_dict() for chat in chats]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@chat_bp.route('/chats', methods=['POST'])
@require_auth
@api_rate_limit
def create_chat():
    """Create a new chat"""
    try:
        data = request.get_json()
        user = g.current_user
        
        title = data.get('title', 'New Chat').strip()
        if not title:
            title = 'New Chat'
        
        chat = Chat(user_id=user.id, title=title)
        db.session.add(chat)
        db.session.commit()
        
        return jsonify({
            'message': 'Chat created successfully',
            'chat': chat.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@chat_bp.route('/chats/<int:chat_id>', methods=['GET'])
@require_auth
@api_rate_limit
def get_chat(chat_id):
    """Get a specific chat with messages"""
    try:
        user = g.current_user
        chat = Chat.query.filter_by(id=chat_id, user_id=user.id).first()
        
        if not chat:
            return jsonify({
                'error': 'Chat not found',
                'code': 'CHAT_NOT_FOUND'
            }), 404
        
        messages = ChatMessage.query.filter_by(chat_id=chat.id).order_by(ChatMessage.created_at.asc()).all()
        
        return jsonify({
            'chat': chat.to_dict(),
            'messages': [message.to_dict() for message in messages]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@chat_bp.route('/chats/<int:chat_id>/messages', methods=['POST'])
@require_auth
@chat_rate_limit
def add_message(chat_id):
    """Add a message to a chat"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Validate required fields
        if not data.get('content'):
            return jsonify({
                'error': 'Message content is required',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        role = data.get('role', 'user')
        if role not in ['user', 'assistant']:
            return jsonify({
                'error': 'Invalid role. Must be "user" or "assistant"',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # Check if chat exists and belongs to user
        chat = Chat.query.filter_by(id=chat_id, user_id=user.id).first()
        if not chat:
            return jsonify({
                'error': 'Chat not found',
                'code': 'CHAT_NOT_FOUND'
            }), 404
        
        # Create message
        message = ChatMessage(
            chat_id=chat.id,
            role=role,
            content=data['content'].strip()
        )
        db.session.add(message)
        
        # Update chat's updated_at timestamp
        chat.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Message added successfully',
            'chat_message': message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@chat_bp.route('/chats/<int:chat_id>', methods=['PUT'])
@require_auth
@api_rate_limit
def update_chat(chat_id):
    """Update chat (e.g., change title)"""
    try:
        data = request.get_json()
        user = g.current_user
        
        chat = Chat.query.filter_by(id=chat_id, user_id=user.id).first()
        if not chat:
            return jsonify({
                'error': 'Chat not found',
                'code': 'CHAT_NOT_FOUND'
            }), 404
        
        # Update title if provided
        if 'title' in data:
            title = data['title'].strip()
            if title:
                chat.title = title
                chat.updated_at = datetime.utcnow()
                db.session.commit()
        
        return jsonify({
            'message': 'Chat updated successfully',
            'chat': chat.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@chat_bp.route('/chats/<int:chat_id>', methods=['DELETE'])
@require_auth
@api_rate_limit
def delete_chat(chat_id):
    """Delete a chat and all its messages"""
    try:
        user = g.current_user
        chat = Chat.query.filter_by(id=chat_id, user_id=user.id).first()
        
        if not chat:
            return jsonify({
                'error': 'Chat not found',
                'code': 'CHAT_NOT_FOUND'
            }), 404
        
        db.session.delete(chat)
        db.session.commit()
        
        return jsonify({
            'message': 'Chat deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@chat_bp.route('/chats/<int:chat_id>/messages/<int:message_id>', methods=['DELETE'])
@require_auth
@api_rate_limit
def delete_message(chat_id, message_id):
    """Delete a specific message"""
    try:
        user = g.current_user
        
        # Check if chat exists and belongs to user
        chat = Chat.query.filter_by(id=chat_id, user_id=user.id).first()
        if not chat:
            return jsonify({
                'error': 'Chat not found',
                'code': 'CHAT_NOT_FOUND'
            }), 404
        
        # Check if message exists and belongs to the chat
        message = ChatMessage.query.filter_by(id=message_id, chat_id=chat.id).first()
        if not message:
            return jsonify({
                'error': 'Message not found',
                'code': 'MESSAGE_NOT_FOUND'
            }), 404
        
        db.session.delete(message)
        
        # Update chat's updated_at timestamp
        chat.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Message deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500