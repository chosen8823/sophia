"""
Simplified configuration system that doesn't require toml module
"""
import os
import json
from pathlib import Path
from typing import Dict, Any, Optional

class SimpleConfig:
    """Simple configuration parser for basic TOML-like syntax"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or os.path.join(
            Path(__file__).parent.parent.parent, 'config.toml'
        )
        self.config = self._load_config()
        
    def _parse_toml_simple(self, content: str) -> Dict[str, Any]:
        """Simple TOML parser for basic sections and key-value pairs"""
        config = {}
        current_section = None
        
        for line in content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            # Section header
            if line.startswith('[') and line.endswith(']'):
                section_name = line[1:-1]
                if '.' in section_name:
                    # Handle nested sections like [llm.vision]
                    parts = section_name.split('.')
                    current_section = parts
                    # Create nested structure
                    temp = config
                    for part in parts[:-1]:
                        if part not in temp:
                            temp[part] = {}
                        temp = temp[part]
                    if parts[-1] not in temp:
                        temp[parts[-1]] = {}
                else:
                    current_section = [section_name]
                    if section_name not in config:
                        config[section_name] = {}
                continue
            
            # Key-value pair
            if '=' in line and current_section:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                # Remove quotes
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                # Handle boolean values
                elif value.lower() in ('true', 'false'):
                    value = value.lower() == 'true'
                # Handle numeric values
                elif value.isdigit():
                    value = int(value)
                elif value.replace('.', '').isdigit():
                    value = float(value)
                # Handle arrays (simple)
                elif value.startswith('[') and value.endswith(']'):
                    # Simple array parsing
                    array_content = value[1:-1].strip()
                    if array_content:
                        items = [item.strip().strip('"\'') for item in array_content.split(',')]
                        value = items
                    else:
                        value = []
                
                # Set value in nested structure
                temp = config
                for section in current_section[:-1]:
                    temp = temp[section]
                temp[current_section[-1]][key] = value
        
        return config
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    content = f.read()
                    return self._parse_toml_simple(content)
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
                "temperature": 0.7,
                "vision": {
                    "model": "microsoft/DialoGPT-medium",
                    "base_url": "https://api-inference.huggingface.co/models/",
                    "api_key": "hf_dummy_key",
                    "max_tokens": 4096,
                    "temperature": 0.7
                }
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
            "sophia": {
                "platform_name": "Sophia - Unified AI Platform",
                "version": "1.0.0",
                "enable_openmanus": True,
                "enable_manus_platform": True,
                "enable_multi_agent": True,
                "default_agent_type": "advanced",
                "max_concurrent_agents": 10
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

# Global configuration instance
config = SimpleConfig()

def get_config() -> SimpleConfig:
    """Get the global configuration instance"""
    return config