"""
Hugging Face adapter for OpenManus to replace OpenAI API calls
"""
import os
import json
import requests
from typing import Dict, List, Any, Optional
from huggingface_hub import InferenceClient
import logging

logger = logging.getLogger(__name__)

class HuggingFaceAdapter:
    """Adapter to use Hugging Face models instead of OpenAI API"""
    
    def __init__(self, model_name: str = "microsoft/DialoGPT-medium", api_key: Optional[str] = None):
        self.model_name = model_name
        self.api_key = api_key or os.getenv("HUGGINGFACE_API_KEY", "hf_dummy_key")
        self.client = InferenceClient(model=model_name, token=self.api_key)
        self.base_url = "https://api-inference.huggingface.co/models/"
        
    def chat_completions_create(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """
        Create chat completions using Hugging Face models
        Compatible with OpenAI API format
        """
        try:
            # Convert messages to a single prompt for text generation models
            prompt = self._convert_messages_to_prompt(messages)
            
            # Use Hugging Face Inference API
            response = self.client.text_generation(
                prompt=prompt,
                max_new_tokens=kwargs.get("max_tokens", 512),
                temperature=kwargs.get("temperature", 0.7),
                do_sample=True,
                return_full_text=False
            )
            
            # Format response to match OpenAI API structure
            return {
                "id": "chatcmpl-hf-" + str(hash(prompt))[:8],
                "object": "chat.completion",
                "created": 1234567890,
                "model": self.model_name,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": len(prompt.split()),
                    "completion_tokens": len(response.split()),
                    "total_tokens": len(prompt.split()) + len(response.split())
                }
            }
            
        except Exception as e:
            logger.error(f"Error in Hugging Face chat completion: {e}")
            # Return a fallback response
            return {
                "id": "chatcmpl-hf-error",
                "object": "chat.completion",
                "created": 1234567890,
                "model": self.model_name,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "I'm an AI assistant powered by Hugging Face models. How can I help you today?"
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0
                }
            }
    
    def _convert_messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        """Convert OpenAI-style messages to a single prompt"""
        prompt_parts = []
        
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            
            if role == "system":
                prompt_parts.append(f"System: {content}")
            elif role == "user":
                prompt_parts.append(f"Human: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
        
        prompt_parts.append("Assistant:")
        return "\n".join(prompt_parts)

# GPT4All integration for local models
class GPT4AllAdapter:
    """Adapter for local GPT4All models"""
    
    def __init__(self, model_name: str = "orca-mini-3b-gguf2-q4_0.gguf"):
        self.model_name = model_name
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load GPT4All model locally"""
        try:
            import gpt4all
            self.model = gpt4all.GPT4All(self.model_name)
            logger.info(f"Loaded GPT4All model: {self.model_name}")
        except ImportError:
            logger.warning("GPT4All not installed. Install with: pip install gpt4all")
            self.model = None
        except Exception as e:
            logger.error(f"Error loading GPT4All model: {e}")
            self.model = None
    
    def chat_completions_create(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """Create chat completions using GPT4All"""
        if not self.model:
            return self._fallback_response()
        
        try:
            prompt = self._convert_messages_to_prompt(messages)
            
            response = self.model.generate(
                prompt=prompt,
                max_tokens=kwargs.get("max_tokens", 512),
                temp=kwargs.get("temperature", 0.7)
            )
            
            return {
                "id": "chatcmpl-gpt4all-" + str(hash(prompt))[:8],
                "object": "chat.completion",
                "created": 1234567890,
                "model": self.model_name,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": len(prompt.split()),
                    "completion_tokens": len(response.split()),
                    "total_tokens": len(prompt.split()) + len(response.split())
                }
            }
            
        except Exception as e:
            logger.error(f"Error in GPT4All completion: {e}")
            return self._fallback_response()
    
    def _convert_messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        """Convert messages to prompt format"""
        prompt_parts = []
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            
            if role == "system":
                prompt_parts.append(f"### System:\n{content}")
            elif role == "user":
                prompt_parts.append(f"### Human:\n{content}")
            elif role == "assistant":
                prompt_parts.append(f"### Assistant:\n{content}")
        
        prompt_parts.append("### Assistant:\n")
        return "\n".join(prompt_parts)
    
    def _fallback_response(self) -> Dict[str, Any]:
        """Fallback response when model is not available"""
        return {
            "id": "chatcmpl-gpt4all-fallback",
            "object": "chat.completion",
            "created": 1234567890,
            "model": self.model_name,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "I'm an AI assistant running locally with GPT4All. How can I help you?"
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }

# Factory function to create the appropriate adapter
def create_llm_adapter(provider: str = "huggingface", model_name: str = None) -> Any:
    """Create LLM adapter based on provider"""
    if provider.lower() == "huggingface":
        return HuggingFaceAdapter(model_name or "microsoft/DialoGPT-medium")
    elif provider.lower() == "gpt4all":
        return GPT4AllAdapter(model_name or "orca-mini-3b-gguf2-q4_0.gguf")
    else:
        raise ValueError(f"Unsupported provider: {provider}")

