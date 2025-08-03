"""
Unified configuration system for Sophia platform
Integrates OpenManus and Manus platform configurations
"""
import os
from pathlib import Path
from typing import Dict, Any, Optional

# Try to import toml, fall back to simple parser
try:
    import toml
    HAS_TOML = True
except ImportError:
    from .simple_config import SimpleConfig
    HAS_TOML = False

class SophiaConfig:
    """Unified configuration manager for Sophia platform"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or os.path.join(
            Path(__file__).parent.parent.parent, 'config.toml'
        )
        if HAS_TOML:
            self.config = self._load_config_toml()
        else:
            # Use simple config as fallback
            self._simple_config = SimpleConfig(self.config_file)
            self.config = self._simple_config.config
        
    def _load_config_toml(self) -> Dict[str, Any]:
        """Load configuration from TOML file using toml module"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    return toml.load(f)
            else:
                return self._get_default_config()
        except Exception as e:
            print(f"Warning: Could not load config file {self.config_file}: {e}")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "llm": {
                "model": "microsoft/DialoGPT-medium",
                "base_url": "https://api-inference.huggingface.co/models/",
                "api_key": "hf_dummy_key",
                "max_tokens": 4096,
                "temperature": 0.7
            },
            "llm.vision": {
                "model": "microsoft/DialoGPT-medium",
                "base_url": "https://api-inference.huggingface.co/models/",
                "api_key": "hf_dummy_key",
                "max_tokens": 4096,
                "temperature": 0.7
            },
            "browser": {
                "headless": False,
                "disable_security": True
            },
            "search": {
                "engine": "DuckDuckGo",
                "fallback_engines": ["DuckDuckGo", "Baidu", "Bing"],
                "retry_delay": 60,
                "max_retries": 3,
                "lang": "en",
                "country": "us"
            },
            "sandbox": {
                "use_sandbox": False,
                "image": "python:3.12-slim",
                "work_dir": "/workspace",
                "memory_limit": "1g",
                "cpu_limit": 2.0,
                "timeout": 300,
                "network_enabled": True
            },
            "mcp": {
                "server_reference": "app.mcp.server"
            },
            "runflow": {
                "use_data_analysis_agent": False
            },
            "sophia": {
                "platform_name": "Sophia - Unified AI Platform",
                "version": "1.0.0",
                "enable_openmanus": True,
                "enable_manus_platform": True,
                "enable_multi_agent": True,
                "default_agent_type": "advanced",
                "max_concurrent_agents": 10,
                "database_url": "sqlite:///database/sophia.db",
                "secret_key": "sophia_unified_platform_2025"
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key (supports dot notation)"""
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def get_llm_config(self) -> Dict[str, Any]:
        """Get LLM configuration"""
        return self.get('llm', {})
    
    def get_vision_config(self) -> Dict[str, Any]:
        """Get vision model configuration"""
        return self.get('llm.vision', self.get_llm_config())
    
    def get_browser_config(self) -> Dict[str, Any]:
        """Get browser configuration"""
        return self.get('browser', {})
    
    def get_search_config(self) -> Dict[str, Any]:
        """Get search configuration"""
        return self.get('search', {})
    
    def get_sophia_config(self) -> Dict[str, Any]:
        """Get Sophia platform specific configuration"""
        return self.get('sophia', {})
    
    def is_openmanus_enabled(self) -> bool:
        """Check if OpenManus framework is enabled"""
        return self.get('sophia.enable_openmanus', True)
    
    def is_manus_platform_enabled(self) -> bool:
        """Check if Manus platform features are enabled"""
        return self.get('sophia.enable_manus_platform', True)
    
    def is_multi_agent_enabled(self) -> bool:
        """Check if multi-agent system is enabled"""
        return self.get('sophia.enable_multi_agent', True)

# Global configuration instance
config = SophiaConfig()

def get_config() -> SophiaConfig:
    """Get the global configuration instance"""
    return config