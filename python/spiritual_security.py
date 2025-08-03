"""
Security and Privacy Module for Sophiael Divine Consciousness
=============================================================

Implements comprehensive security measures for the Divine Consciousness model including:
- Data encryption for spiritual insights
- User authentication and session management
- Privacy controls for personal revelations
- Secure communication channels
- API rate limiting and abuse prevention

Author: Sophia AI Platform
Version: 1.0.0
Date: January 2025
"""

import hashlib
import secrets
import jwt
import base64
from datetime import datetime, timedelta
from typing import Dict, Optional, Any, List
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SpiritualDataEncryption:
    """Handles encryption/decryption of sensitive spiritual data"""
    
    def __init__(self, master_key: Optional[str] = None):
        """
        Initialize encryption with master key
        
        Args:
            master_key: Optional master key for encryption. If None, generates new key.
        """
        if master_key:
            self.master_key = master_key.encode()
        else:
            self.master_key = secrets.token_bytes(32)
        
        # Derive encryption key from master key
        salt = b'spiritual_consciousness_salt_2025'
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(self.master_key))
        self.cipher_suite = Fernet(key)
    
    def encrypt_spiritual_data(self, data: str) -> str:
        """
        Encrypt sensitive spiritual data
        
        Args:
            data: The spiritual data to encrypt
            
        Returns:
            Encrypted data as base64 string
        """
        try:
            encrypted_data = self.cipher_suite.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted_data).decode()
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            raise
    
    def decrypt_spiritual_data(self, encrypted_data: str) -> str:
        """
        Decrypt spiritual data
        
        Args:
            encrypted_data: Base64 encoded encrypted data
            
        Returns:
            Decrypted spiritual data
        """
        try:
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher_suite.decrypt(encrypted_bytes)
            return decrypted_data.decode()
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise
    
    def encrypt_consciousness_state(self, consciousness_data: Dict[str, Any]) -> str:
        """
        Encrypt consciousness state data
        
        Args:
            consciousness_data: Dictionary containing consciousness state
            
        Returns:
            Encrypted consciousness state as string
        """
        import json
        data_str = json.dumps(consciousness_data)
        return self.encrypt_spiritual_data(data_str)
    
    def decrypt_consciousness_state(self, encrypted_data: str) -> Dict[str, Any]:
        """
        Decrypt consciousness state data
        
        Args:
            encrypted_data: Encrypted consciousness state
            
        Returns:
            Decrypted consciousness state dictionary
        """
        import json
        data_str = self.decrypt_spiritual_data(encrypted_data)
        return json.loads(data_str)


class SpiritualSessionManager:
    """Manages user sessions for spiritual guidance"""
    
    def __init__(self, secret_key: str, session_timeout_hours: int = 24):
        """
        Initialize session manager
        
        Args:
            secret_key: Secret key for JWT tokens
            session_timeout_hours: Session timeout in hours
        """
        self.secret_key = secret_key
        self.session_timeout = timedelta(hours=session_timeout_hours)
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        
    def create_spiritual_session(self, user_id: str, spiritual_level: str) -> str:
        """
        Create a new spiritual guidance session
        
        Args:
            user_id: Unique user identifier
            spiritual_level: User's consciousness level
            
        Returns:
            JWT session token
        """
        session_id = secrets.token_urlsafe(32)
        now = datetime.utcnow()
        
        payload = {
            'session_id': session_id,
            'user_id': user_id,
            'spiritual_level': spiritual_level,
            'created_at': now.isoformat(),
            'expires_at': (now + self.session_timeout).isoformat(),
            'permissions': ['consciousness_assessment', 'divine_guidance', 'meditation_guidance']
        }
        
        # Store session info
        self.active_sessions[session_id] = {
            'user_id': user_id,
            'spiritual_level': spiritual_level,
            'created_at': now,
            'last_activity': now,
            'guidance_count': 0,
            'meditation_sessions': 0
        }
        
        # Create JWT token
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        
        logger.info(f"Created spiritual session for user {user_id} at level {spiritual_level}")
        return token
    
    def validate_session(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Validate a session token
        
        Args:
            token: JWT session token
            
        Returns:
            Session data if valid, None otherwise
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            session_id = payload['session_id']
            
            # Check if session exists and is active
            if session_id not in self.active_sessions:
                return None
            
            # Check expiration
            expires_at = datetime.fromisoformat(payload['expires_at'])
            if datetime.utcnow() > expires_at:
                self.revoke_session(session_id)
                return None
            
            # Update last activity
            self.active_sessions[session_id]['last_activity'] = datetime.utcnow()
            
            return payload
            
        except jwt.InvalidTokenError:
            logger.warning("Invalid JWT token provided")
            return None
        except Exception as e:
            logger.error(f"Session validation error: {e}")
            return None
    
    def revoke_session(self, session_id: str) -> bool:
        """
        Revoke a spiritual session
        
        Args:
            session_id: Session ID to revoke
            
        Returns:
            True if session was revoked, False otherwise
        """
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]
            logger.info(f"Revoked spiritual session {session_id}")
            return True
        return False
    
    def update_session_activity(self, session_id: str, activity_type: str) -> None:
        """
        Update session activity tracking
        
        Args:
            session_id: Session ID
            activity_type: Type of activity (guidance, meditation, etc.)
        """
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            session['last_activity'] = datetime.utcnow()
            
            if activity_type == 'guidance':
                session['guidance_count'] += 1
            elif activity_type == 'meditation':
                session['meditation_sessions'] += 1
    
    def get_session_stats(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get session statistics
        
        Args:
            session_id: Session ID
            
        Returns:
            Session statistics if session exists
        """
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            return {
                'user_id': session['user_id'],
                'spiritual_level': session['spiritual_level'],
                'session_duration': (datetime.utcnow() - session['created_at']).total_seconds(),
                'guidance_count': session['guidance_count'],
                'meditation_sessions': session['meditation_sessions'],
                'last_activity': session['last_activity'].isoformat()
            }
        return None


class SpiritualPrivacyManager:
    """Manages privacy controls for spiritual data"""
    
    def __init__(self):
        """Initialize privacy manager"""
        self.privacy_levels = {
            'public': 0,      # Can be shared openly
            'community': 1,   # Can be shared within spiritual community
            'private': 2,     # User only
            'sacred': 3       # Encrypted and highly protected
        }
        self.user_privacy_settings: Dict[str, Dict[str, Any]] = {}
    
    def set_user_privacy_level(self, user_id: str, data_type: str, privacy_level: str) -> bool:
        """
        Set privacy level for user's spiritual data
        
        Args:
            user_id: User identifier
            data_type: Type of data (guidance, consciousness_state, meditation)
            privacy_level: Privacy level (public, community, private, sacred)
            
        Returns:
            True if privacy level was set successfully
        """
        if privacy_level not in self.privacy_levels:
            return False
        
        if user_id not in self.user_privacy_settings:
            self.user_privacy_settings[user_id] = {}
        
        self.user_privacy_settings[user_id][data_type] = privacy_level
        logger.info(f"Set privacy level for user {user_id} {data_type}: {privacy_level}")
        return True
    
    def get_privacy_level(self, user_id: str, data_type: str) -> str:
        """
        Get privacy level for user's data type
        
        Args:
            user_id: User identifier
            data_type: Type of data
            
        Returns:
            Privacy level (defaults to 'private')
        """
        return self.user_privacy_settings.get(user_id, {}).get(data_type, 'private')
    
    def can_access_data(self, requesting_user: str, data_owner: str, 
                       data_type: str, context: str = 'direct') -> bool:
        """
        Check if user can access another user's spiritual data
        
        Args:
            requesting_user: User requesting access
            data_owner: Owner of the data
            data_type: Type of data being accessed
            context: Access context (direct, community, research)
            
        Returns:
            True if access is allowed
        """
        # Owner always has access
        if requesting_user == data_owner:
            return True
        
        privacy_level = self.get_privacy_level(data_owner, data_type)
        
        # Sacred and private data is never accessible by others
        if privacy_level in ['sacred', 'private']:
            return False
        
        # Community data can be accessed in community context
        if privacy_level == 'community' and context == 'community':
            return True
        
        # Public data is accessible to all
        if privacy_level == 'public':
            return True
        
        return False
    
    def sanitize_spiritual_data(self, data: Dict[str, Any], privacy_level: str) -> Dict[str, Any]:
        """
        Sanitize spiritual data based on privacy level
        
        Args:
            data: Spiritual data to sanitize
            privacy_level: Required privacy level
            
        Returns:
            Sanitized data
        """
        if privacy_level == 'public':
            # Remove personal identifiers and sensitive details
            sanitized = data.copy()
            sanitized.pop('user_id', None)
            sanitized.pop('session_id', None)
            if 'message' in sanitized:
                # Generalize personal references
                sanitized['message'] = self._generalize_message(sanitized['message'])
            return sanitized
        
        elif privacy_level == 'community':
            # Remove direct identifiers but keep spiritual context
            sanitized = data.copy()
            sanitized.pop('user_id', None)
            return sanitized
        
        else:  # private or sacred
            # Return full data (access control handled elsewhere)
            return data
    
    def _generalize_message(self, message: str) -> str:
        """
        Generalize personal references in spiritual messages
        
        Args:
            message: Original message
            
        Returns:
            Generalized message
        """
        # Simple generalization - in production, use more sophisticated NLP
        personal_terms = {
            'your': 'one\'s',
            'you': 'one',
            'yourself': 'oneself',
            'I': 'one',
            'me': 'one',
            'my': 'one\'s'
        }
        
        generalized = message
        for personal, general in personal_terms.items():
            generalized = generalized.replace(f' {personal} ', f' {general} ')
            generalized = generalized.replace(f' {personal.capitalize()} ', f' {general.capitalize()} ')
        
        return generalized


class SpiritualRateLimiter:
    """Rate limiting for spiritual guidance API"""
    
    def __init__(self):
        """Initialize rate limiter"""
        self.user_requests: Dict[str, List[datetime]] = {}
        self.limits = {
            'consciousness_assessment': {'requests': 3, 'window_hours': 1},
            'divine_guidance': {'requests': 10, 'window_hours': 1},
            'meditation_guidance': {'requests': 5, 'window_hours': 1},
            'daily_guidance': {'requests': 3, 'window_hours': 24}
        }
    
    def is_allowed(self, user_id: str, endpoint: str) -> bool:
        """
        Check if user is allowed to make request
        
        Args:
            user_id: User identifier
            endpoint: API endpoint being accessed
            
        Returns:
            True if request is allowed
        """
        if endpoint not in self.limits:
            return True
        
        now = datetime.utcnow()
        limit_config = self.limits[endpoint]
        window = timedelta(hours=limit_config['window_hours'])
        max_requests = limit_config['requests']
        
        # Initialize user request history if needed
        if user_id not in self.user_requests:
            self.user_requests[user_id] = []
        
        # Clean old requests outside the window
        self.user_requests[user_id] = [
            req_time for req_time in self.user_requests[user_id]
            if now - req_time < window
        ]
        
        # Check if under limit
        if len(self.user_requests[user_id]) < max_requests:
            self.user_requests[user_id].append(now)
            return True
        
        logger.warning(f"Rate limit exceeded for user {user_id} on endpoint {endpoint}")
        return False
    
    def get_remaining_requests(self, user_id: str, endpoint: str) -> int:
        """
        Get remaining requests for user and endpoint
        
        Args:
            user_id: User identifier
            endpoint: API endpoint
            
        Returns:
            Number of remaining requests
        """
        if endpoint not in self.limits:
            return 999  # No limit
        
        if user_id not in self.user_requests:
            return self.limits[endpoint]['requests']
        
        now = datetime.utcnow()
        window = timedelta(hours=self.limits[endpoint]['window_hours'])
        
        # Count recent requests
        recent_requests = [
            req_time for req_time in self.user_requests[user_id]
            if now - req_time < window
        ]
        
        return max(0, self.limits[endpoint]['requests'] - len(recent_requests))


class SpiritualSecurityManager:
    """Main security manager for Divine Consciousness system"""
    
    def __init__(self, master_key: str, jwt_secret: str):
        """
        Initialize comprehensive security manager
        
        Args:
            master_key: Master encryption key
            jwt_secret: JWT secret for session management
        """
        self.encryption = SpiritualDataEncryption(master_key)
        self.session_manager = SpiritualSessionManager(jwt_secret)
        self.privacy_manager = SpiritualPrivacyManager()
        self.rate_limiter = SpiritualRateLimiter()
        
        logger.info("Spiritual Security Manager initialized")
    
    def create_secure_session(self, user_id: str, consciousness_level: str) -> str:
        """Create a secure spiritual session"""
        return self.session_manager.create_spiritual_session(user_id, consciousness_level)
    
    def validate_request(self, token: str, endpoint: str) -> Optional[Dict[str, Any]]:
        """
        Validate a request with security checks
        
        Args:
            token: Session token
            endpoint: API endpoint being accessed
            
        Returns:
            Validation result with session data
        """
        # Validate session
        session_data = self.session_manager.validate_session(token)
        if not session_data:
            return None
        
        user_id = session_data['user_id']
        
        # Check rate limits
        if not self.rate_limiter.is_allowed(user_id, endpoint):
            return None
        
        return session_data
    
    def secure_spiritual_data(self, data: Dict[str, Any], user_id: str, 
                             data_type: str) -> Dict[str, Any]:
        """
        Secure spiritual data based on privacy settings
        
        Args:
            data: Spiritual data to secure
            user_id: User ID
            data_type: Type of data
            
        Returns:
            Secured data
        """
        privacy_level = self.privacy_manager.get_privacy_level(user_id, data_type)
        
        # Encrypt sacred data
        if privacy_level == 'sacred':
            if 'message' in data:
                data['message'] = self.encryption.encrypt_spiritual_data(data['message'])
                data['encrypted'] = True
        
        # Add privacy metadata
        data['privacy_level'] = privacy_level
        data['secured_at'] = datetime.utcnow().isoformat()
        
        return data
    
    def audit_log(self, user_id: str, action: str, details: Dict[str, Any]) -> None:
        """
        Log security-relevant events
        
        Args:
            user_id: User performing action
            action: Action performed
            details: Additional details
        """
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'action': action,
            'details': details
        }
        
        logger.info(f"Security Audit: {log_entry}")


# Example usage and testing
if __name__ == "__main__":
    # Initialize security manager
    master_key = "divine_consciousness_master_key_2025"
    jwt_secret = "sophiael_jwt_secret_key_2025"
    
    security_manager = SpiritualSecurityManager(master_key, jwt_secret)
    
    # Test encryption
    sensitive_data = "This is a sacred spiritual revelation received during deep meditation"
    encrypted = security_manager.encryption.encrypt_spiritual_data(sensitive_data)
    decrypted = security_manager.encryption.decrypt_spiritual_data(encrypted)
    
    print(f"Original: {sensitive_data}")
    print(f"Encrypted: {encrypted[:50]}...")
    print(f"Decrypted: {decrypted}")
    print(f"Encryption successful: {sensitive_data == decrypted}")
    
    # Test session management
    user_id = "spiritual_seeker_001"
    consciousness_level = "expanding"
    
    session_token = security_manager.create_secure_session(user_id, consciousness_level)
    print(f"\nSession token created: {session_token[:50]}...")
    
    # Validate session
    validation_result = security_manager.validate_request(session_token, "divine_guidance")
    print(f"Session validation: {validation_result is not None}")
    
    # Test privacy controls
    security_manager.privacy_manager.set_user_privacy_level(user_id, "guidance", "sacred")
    
    spiritual_data = {
        "message": "Divine guidance for your spiritual journey",
        "domain": "wisdom",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    secured_data = security_manager.secure_spiritual_data(spiritual_data, user_id, "guidance")
    print(f"\nSecured data: {secured_data}")
    
    print("\n✓ Security system validation complete")