"""
LLM Adapter to integrate Hugging Face and GPT4All models with OpenManus
"""
import os
import json
import asyncio
from typing import Dict, List, Any, Optional, Union
from huggingface_hub import InferenceClient
import logging

from app.schema import Message
from app.config import config

logger = logging.getLogger(__name__)

class HuggingFaceLLM:
    """Hugging Face LLM adapter for OpenManus"""
    
    def __init__(self, model_name: str = None, api_key: str = None):
        self.model = model_name or config.llm.model or "microsoft/DialoGPT-medium"
        self.api_key = api_key or config.llm.api_key or os.getenv("HUGGINGFACE_API_KEY", "hf_dummy_key")
        self.max_tokens = getattr(config.llm, 'max_tokens', 512)
        self.temperature = getattr(config.llm, 'temperature', 0.7)
        self.base_url = getattr(config.llm, 'base_url', "https://api-inference.huggingface.co/models/")
        
        # Initialize Hugging Face client
        try:
            self.client = InferenceClient(model=self.model, token=self.api_key)
            logger.info(f"Initialized Hugging Face client with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize Hugging Face client: {e}")
            self.client = None
        
        # Token tracking
        self.total_input_tokens = 0
        self.total_completion_tokens = 0
    
    def count_tokens(self, text: str) -> int:
        """Simple token counting (approximation)"""
        if not text:
            return 0
        return len(text.split())
    
    def count_message_tokens(self, messages: List[dict]) -> int:
        """Count tokens in messages"""
        total = 0
        for message in messages:
            content = message.get("content", "")
            if isinstance(content, str):
                total += self.count_tokens(content)
            elif isinstance(content, list):
                for item in content:
                    if isinstance(item, dict) and "text" in item:
                        total += self.count_tokens(item["text"])
        return total
    
    def update_token_count(self, input_tokens: int, completion_tokens: int = 0) -> None:
        """Update token counts"""
        self.total_input_tokens += input_tokens
        self.total_completion_tokens += completion_tokens
        logger.info(f"Token usage: Input={input_tokens}, Completion={completion_tokens}")
    
    @staticmethod
    def format_messages(messages: List[Union[dict, Message]], supports_images: bool = False) -> List[dict]:
        """Format messages for Hugging Face models"""
        formatted_messages = []
        
        for message in messages:
            if isinstance(message, Message):
                message = message.to_dict()
            
            if isinstance(message, dict):
                # Remove base64_image if present (not supported by most HF models)
                if "base64_image" in message:
                    del message["base64_image"]
                
                formatted_messages.append(message)
        
        return formatted_messages
    
    def _convert_messages_to_prompt(self, messages: List[dict]) -> str:
        """Convert OpenAI-style messages to a single prompt for text generation"""
        prompt_parts = []
        
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            
            # Handle different content types
            if isinstance(content, list):
                text_content = ""
                for item in content:
                    if isinstance(item, dict) and "text" in item:
                        text_content += item["text"] + " "
                    elif isinstance(item, str):
                        text_content += item + " "
                content = text_content.strip()
            
            if role == "system":
                prompt_parts.append(f"System: {content}")
            elif role == "user":
                prompt_parts.append(f"Human: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
        
        prompt_parts.append("Assistant:")
        return "\n".join(prompt_parts)
    
    async def ask(
        self,
        messages: List[Union[dict, Message]],
        system_msgs: Optional[List[Union[dict, Message]]] = None,
        stream: bool = True,
        temperature: Optional[float] = None,
    ) -> str:
        """
        Send a prompt to Hugging Face model and get response
        """
        try:
            # Format messages
            if system_msgs:
                system_msgs = self.format_messages(system_msgs, False)
                messages = system_msgs + self.format_messages(messages, False)
            else:
                messages = self.format_messages(messages, False)
            
            # Convert to prompt
            prompt = self._convert_messages_to_prompt(messages)
            
            # Count input tokens
            input_tokens = self.count_tokens(prompt)
            
            if not self.client:
                # Fallback response if client not available
                response = "I'm an AI assistant powered by Hugging Face models. How can I help you today?"
                self.update_token_count(input_tokens, self.count_tokens(response))
                return response
            
            # Use temperature parameter if provided
            temp = temperature if temperature is not None else self.temperature
            
            if stream:
                # Streaming response
                response_text = ""
                try:
                    for token in self.client.text_generation(
                        prompt=prompt,
                        max_new_tokens=self.max_tokens,
                        temperature=temp,
                        do_sample=True,
                        return_full_text=False,
                        stream=True
                    ):
                        if hasattr(token, 'token'):
                            response_text += token.token.text
                        elif isinstance(token, dict) and 'token' in token:
                            response_text += token['token']['text']
                        else:
                            response_text += str(token)
                except Exception as e:
                    logger.warning(f"Streaming failed, falling back to non-streaming: {e}")
                    # Fallback to non-streaming
                    response_text = self.client.text_generation(
                        prompt=prompt,
                        max_new_tokens=self.max_tokens,
                        temperature=temp,
                        do_sample=True,
                        return_full_text=False
                    )
            else:
                # Non-streaming response
                response_text = self.client.text_generation(
                    prompt=prompt,
                    max_new_tokens=self.max_tokens,
                    temperature=temp,
                    do_sample=True,
                    return_full_text=False
                )
            
            # Clean up response
            if isinstance(response_text, str):
                response_text = response_text.strip()
            else:
                response_text = str(response_text).strip()
            
            # Update token counts
            completion_tokens = self.count_tokens(response_text)
            self.update_token_count(input_tokens, completion_tokens)
            
            return response_text
            
        except Exception as e:
            logger.error(f"Error in Hugging Face LLM: {e}")
            # Return a fallback response
            fallback = "I apologize, but I'm experiencing technical difficulties. Please try again."
            self.update_token_count(0, self.count_tokens(fallback))
            return fallback

class GPT4AllLLM:
    """GPT4All LLM adapter for local models"""
    
    def __init__(self, model_name: str = "orca-mini-3b-gguf2-q4_0.gguf"):
        self.model_name = model_name
        self.model = None
        self.max_tokens = 512
        self.temperature = 0.7
        self.total_input_tokens = 0
        self.total_completion_tokens = 0
        
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
    
    def count_tokens(self, text: str) -> int:
        """Simple token counting"""
        if not text:
            return 0
        return len(text.split())
    
    def count_message_tokens(self, messages: List[dict]) -> int:
        """Count tokens in messages"""
        total = 0
        for message in messages:
            content = message.get("content", "")
            if isinstance(content, str):
                total += self.count_tokens(content)
        return total
    
    def update_token_count(self, input_tokens: int, completion_tokens: int = 0) -> None:
        """Update token counts"""
        self.total_input_tokens += input_tokens
        self.total_completion_tokens += completion_tokens
        logger.info(f"GPT4All Token usage: Input={input_tokens}, Completion={completion_tokens}")
    
    @staticmethod
    def format_messages(messages: List[Union[dict, Message]], supports_images: bool = False) -> List[dict]:
        """Format messages for GPT4All"""
        formatted_messages = []
        
        for message in messages:
            if isinstance(message, Message):
                message = message.to_dict()
            
            if isinstance(message, dict):
                # Remove unsupported fields
                if "base64_image" in message:
                    del message["base64_image"]
                
                formatted_messages.append(message)
        
        return formatted_messages
    
    def _convert_messages_to_prompt(self, messages: List[dict]) -> str:
        """Convert messages to GPT4All prompt format"""
        prompt_parts = []
        
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            
            if isinstance(content, list):
                text_content = ""
                for item in content:
                    if isinstance(item, dict) and "text" in item:
                        text_content += item["text"] + " "
                content = text_content.strip()
            
            if role == "system":
                prompt_parts.append(f"### System:\n{content}")
            elif role == "user":
                prompt_parts.append(f"### Human:\n{content}")
            elif role == "assistant":
                prompt_parts.append(f"### Assistant:\n{content}")
        
        prompt_parts.append("### Assistant:\n")
        return "\n".join(prompt_parts)
    
    async def ask(
        self,
        messages: List[Union[dict, Message]],
        system_msgs: Optional[List[Union[dict, Message]]] = None,
        stream: bool = True,
        temperature: Optional[float] = None,
    ) -> str:
        """
        Send a prompt to GPT4All model and get response
        """
        try:
            # Format messages
            if system_msgs:
                system_msgs = self.format_messages(system_msgs, False)
                messages = system_msgs + self.format_messages(messages, False)
            else:
                messages = self.format_messages(messages, False)
            
            # Convert to prompt
            prompt = self._convert_messages_to_prompt(messages)
            
            # Count input tokens
            input_tokens = self.count_tokens(prompt)
            
            if not self.model:
                # Fallback response if model not available
                response = "I'm an AI assistant running locally with GPT4All. The model is not currently loaded."
                self.update_token_count(input_tokens, self.count_tokens(response))
                return response
            
            # Use temperature parameter if provided
            temp = temperature if temperature is not None else self.temperature
            
            # Generate response
            response = self.model.generate(
                prompt=prompt,
                max_tokens=self.max_tokens,
                temp=temp
            )
            
            # Clean up response
            response = response.strip()
            
            # Update token counts
            completion_tokens = self.count_tokens(response)
            self.update_token_count(input_tokens, completion_tokens)
            
            return response
            
        except Exception as e:
            logger.error(f"Error in GPT4All LLM: {e}")
            # Return a fallback response
            fallback = "I apologize, but I'm experiencing technical difficulties with the local model."
            self.update_token_count(0, self.count_tokens(fallback))
            return fallback

# Factory function to create LLM instances
def create_llm(provider: str = "huggingface", model_name: str = None) -> Union[HuggingFaceLLM, GPT4AllLLM]:
    """Create LLM instance based on provider"""
    if provider.lower() == "huggingface":
        return HuggingFaceLLM(model_name)
    elif provider.lower() == "gpt4all":
        return GPT4AllLLM(model_name)
    else:
        raise ValueError(f"Unsupported provider: {provider}")

