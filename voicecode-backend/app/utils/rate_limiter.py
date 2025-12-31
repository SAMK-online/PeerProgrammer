"""
Simple Rate Limiter - IP-based Request Limiting

Prevents API abuse without requiring user authentication.

How it works:
- Tracks requests per IP address
- Rejects requests if limit exceeded
- Uses in-memory storage (resets on server restart)

Limitations (acceptable for MVP):
- Not distributed (won't work with multiple servers)
- Resets on restart
- Can be bypassed with VPN/proxy

For production with auth:
- Use Redis for distributed rate limiting
- Rate limit by user ID instead of IP
- Implement token bucket algorithm
"""

from fastapi import HTTPException, Request
from functools import wraps
from datetime import datetime, timedelta
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


class SimpleRateLimiter:
    """
    In-memory rate limiter using sliding window.
    
    Tracks requests per IP address in a time window.
    """
    
    def __init__(self):
        """
        Initialize rate limiter.
        
        Data structure:
        {
            "192.168.1.1": [timestamp1, timestamp2, timestamp3],
            "10.0.0.1": [timestamp1]
        }
        """
        # Dictionary to store request timestamps per IP
        self.requests = defaultdict(list)
        
        # Clean up old entries every 100 requests
        self.request_count = 0
        self.cleanup_threshold = 100
    
    
    def check_rate_limit(
        self,
        identifier: str,
        max_requests: int = 10,
        window_seconds: int = 60
    ) -> tuple[bool, int]:
        """
        Check if identifier (IP address) is within rate limit.
        
        Args:
            identifier: IP address or user ID
            max_requests: Maximum requests allowed
            window_seconds: Time window in seconds
        
        Returns:
            Tuple of (is_allowed, retry_after_seconds)
            - (True, 0): Request allowed
            - (False, 45): Rate limited, retry after 45 seconds
        """
        
        now = datetime.now()
        window_start = now - timedelta(seconds=window_seconds)
        
        # Get requests for this identifier
        request_times = self.requests[identifier]
        
        # Remove old requests (outside the window)
        # Only keep requests within the last 60 seconds (or whatever window)
        recent_requests = [
            req_time for req_time in request_times
            if req_time > window_start
        ]
        
        # Update stored requests
        self.requests[identifier] = recent_requests
        
        # Check if limit exceeded
        if len(recent_requests) >= max_requests:
            # Calculate how long to wait
            oldest_request = min(recent_requests)
            retry_after = (oldest_request + timedelta(seconds=window_seconds) - now).seconds
            
            logger.warning(
                f"⚠️ Rate limit exceeded for {identifier}: "
                f"{len(recent_requests)}/{max_requests} in {window_seconds}s"
            )
            
            return False, retry_after
        
        # Add current request
        recent_requests.append(now)
        self.requests[identifier] = recent_requests
        
        # Periodic cleanup
        self.request_count += 1
        if self.request_count >= self.cleanup_threshold:
            self._cleanup_old_entries(window_start)
            self.request_count = 0
        
        return True, 0
    
    
    def _cleanup_old_entries(self, cutoff_time: datetime):
        """
        Remove entries with no recent requests.
        
        Prevents memory from growing indefinitely.
        """
        # Find identifiers with no recent requests
        to_remove = [
            identifier
            for identifier, request_times in self.requests.items()
            if not request_times or max(request_times) < cutoff_time
        ]
        
        # Remove them
        for identifier in to_remove:
            del self.requests[identifier]
        
        if to_remove:
            logger.debug(f"🧹 Cleaned up {len(to_remove)} old rate limit entries")


# Create singleton instance
rate_limiter = SimpleRateLimiter()


def rate_limit(max_requests: int = 10, window_seconds: int = 60):
    """
    Decorator for rate limiting endpoints.
    
    Usage:
        @router.post("/api/chat")
        @rate_limit(max_requests=10, window_seconds=60)
        async def chat(request: Request, ...):
            ...
    
    Args:
        max_requests: Maximum requests allowed in window
        window_seconds: Time window in seconds
    """
    
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Find the Request object in args or kwargs
            request = None
            
            # Check args
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            
            # Check kwargs
            if not request and 'request' in kwargs:
                request = kwargs['request']
            
            if not request:
                # No Request object found, skip rate limiting
                logger.warning("⚠️ Rate limit decorator: No Request object found")
                return await func(*args, **kwargs)
            
            # Get client IP
            # Try X-Forwarded-For first (if behind proxy/load balancer)
            client_ip = request.headers.get('X-Forwarded-For')
            if client_ip:
                # X-Forwarded-For can be comma-separated list
                client_ip = client_ip.split(',')[0].strip()
            else:
                # Fallback to direct client IP
                client_ip = request.client.host if request.client else "unknown"
            
            # Check rate limit
            is_allowed, retry_after = rate_limiter.check_rate_limit(
                identifier=client_ip,
                max_requests=max_requests,
                window_seconds=window_seconds
            )
            
            if not is_allowed:
                # Rate limit exceeded
                raise HTTPException(
                    status_code=429,
                    detail={
                        "error": "rate_limit_exceeded",
                        "message": f"Too many requests. Please wait {retry_after} seconds.",
                        "retry_after": retry_after
                    }
                )
            
            # Call the actual endpoint function
            return await func(*args, **kwargs)
        
        return wrapper
    
    return decorator

