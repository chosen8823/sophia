"""
Rate limiting middleware
"""
import time
from functools import wraps
from collections import defaultdict, deque
from flask import request, jsonify, g

class RateLimiter:
    def __init__(self):
        self.clients = defaultdict(lambda: deque())
        self.cleanup_interval = 60  # Clean up old entries every 60 seconds
        self.last_cleanup = time.time()
    
    def _cleanup(self):
        """Clean up old entries"""
        current_time = time.time()
        if current_time - self.last_cleanup > self.cleanup_interval:
            # Remove entries older than 1 hour
            cutoff_time = current_time - 3600
            for client_id in list(self.clients.keys()):
                client_requests = self.clients[client_id]
                while client_requests and client_requests[0] < cutoff_time:
                    client_requests.popleft()
                if not client_requests:
                    del self.clients[client_id]
            self.last_cleanup = current_time
    
    def is_allowed(self, client_id, max_requests, window_seconds):
        """Check if request is allowed based on rate limits"""
        self._cleanup()
        
        current_time = time.time()
        client_requests = self.clients[client_id]
        
        # Remove requests outside the window
        cutoff_time = current_time - window_seconds
        while client_requests and client_requests[0] < cutoff_time:
            client_requests.popleft()
        
        # Check if we're under the limit
        if len(client_requests) >= max_requests:
            return False
        
        # Add current request
        client_requests.append(current_time)
        return True
    
    def get_reset_time(self, client_id, window_seconds):
        """Get when the rate limit will reset"""
        client_requests = self.clients[client_id]
        if not client_requests:
            return 0
        
        oldest_request = client_requests[0]
        reset_time = oldest_request + window_seconds
        return max(0, int(reset_time - time.time()))

# Global rate limiter instance
rate_limiter = RateLimiter()

def rate_limit(max_requests=100, window_seconds=3600, per_user=False):
    """
    Rate limiting decorator
    
    Args:
        max_requests: Maximum number of requests allowed
        window_seconds: Time window in seconds
        per_user: If True, limit per authenticated user, otherwise per IP
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Determine client identifier
            if per_user and hasattr(g, 'current_user') and g.current_user:
                client_id = f"user:{g.current_user.id}"
            else:
                client_id = f"ip:{request.remote_addr}"
            
            # Check rate limit
            if not rate_limiter.is_allowed(client_id, max_requests, window_seconds):
                reset_time = rate_limiter.get_reset_time(client_id, window_seconds)
                
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'code': 'RATE_LIMIT_EXCEEDED',
                    'reset_in_seconds': reset_time,
                    'limit': max_requests,
                    'window_seconds': window_seconds
                }), 429
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

# Common rate limit configurations
def api_rate_limit(f):
    """Standard API rate limit: 1000 requests per hour"""
    return rate_limit(max_requests=1000, window_seconds=3600, per_user=True)(f)

def auth_rate_limit(f):
    """Authentication endpoint rate limit: 10 requests per 15 minutes"""
    return rate_limit(max_requests=10, window_seconds=900, per_user=False)(f)

def chat_rate_limit(f):
    """Chat endpoint rate limit: 100 messages per hour per user"""
    return rate_limit(max_requests=100, window_seconds=3600, per_user=True)(f)