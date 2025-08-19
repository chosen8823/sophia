"""
OpenAI Tools Clone - Compatible API using Hugging Face models
Provides OpenAI-compatible endpoints for chat completions, embeddings, and more
"""
import os
import json
import time
import uuid
from typing import Dict, List, Any, Optional, Union
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import uvicorn
import asyncio
import logging
from huggingface_hub import InferenceClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="OpenAI Tools Clone", description="OpenAI-compatible API using Hugging Face models")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str = "microsoft/DialoGPT-medium"
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7
    stream: Optional[bool] = False
    top_p: Optional[float] = 1.0
    frequency_penalty: Optional[float] = 0.0
    presence_penalty: Optional[float] = 0.0

class ChatCompletionChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str

class ChatCompletionUsage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatCompletionChoice]
    usage: ChatCompletionUsage

class EmbeddingRequest(BaseModel):
    input: Union[str, List[str]]
    model: str = "sentence-transformers/all-MiniLM-L6-v2"

class EmbeddingData(BaseModel):
    object: str = "embedding"
    embedding: List[float]
    index: int

class EmbeddingResponse(BaseModel):
    object: str = "list"
    data: List[EmbeddingData]
    model: str
    usage: ChatCompletionUsage

class ModelInfo(BaseModel):
    id: str
    object: str = "model"
    created: int
    owned_by: str = "huggingface"

class ModelsResponse(BaseModel):
    object: str = "list"
    data: List[ModelInfo]

# Global clients for different models
clients = {}

def get_client(model_name: str) -> InferenceClient:
    """Get or create Hugging Face client for a model"""
    if model_name not in clients:
        api_key = os.getenv("HUGGINGFACE_API_KEY", "hf_dummy_key")
        clients[model_name] = InferenceClient(model=model_name, token=api_key)
    return clients[model_name]

def convert_messages_to_prompt(messages: List[ChatMessage]) -> str:
    """Convert OpenAI-style messages to a single prompt"""
    prompt_parts = []
    
    for message in messages:
        role = message.role
        content = message.content
        
        if role == "system":
            prompt_parts.append(f"System: {content}")
        elif role == "user":
            prompt_parts.append(f"Human: {content}")
        elif role == "assistant":
            prompt_parts.append(f"Assistant: {content}")
    
    prompt_parts.append("Assistant:")
    return "\n".join(prompt_parts)

def count_tokens(text: str) -> int:
    """Simple token counting approximation"""
    if not text:
        return 0
    return len(text.split())

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OpenAI Tools Clone API",
        "version": "1.0.0",
        "description": "OpenAI-compatible API using Hugging Face models",
        "endpoints": [
            "/v1/chat/completions",
            "/v1/embeddings",
            "/v1/models",
            "/health"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}

@app.get("/v1/models", response_model=ModelsResponse)
async def list_models():
    """List available models"""
    models = [
        ModelInfo(id="microsoft/DialoGPT-medium", created=int(time.time())),
        ModelInfo(id="microsoft/DialoGPT-large", created=int(time.time())),
        ModelInfo(id="facebook/blenderbot-400M-distill", created=int(time.time())),
        ModelInfo(id="microsoft/DialoGPT-small", created=int(time.time())),
        ModelInfo(id="sentence-transformers/all-MiniLM-L6-v2", created=int(time.time())),
        ModelInfo(id="sentence-transformers/all-mpnet-base-v2", created=int(time.time())),
    ]
    
    return ModelsResponse(data=models)

@app.post("/v1/chat/completions")
async def create_chat_completion(request: ChatCompletionRequest):
    """Create chat completion using Hugging Face models"""
    try:
        # Get client for the model
        client = get_client(request.model)
        
        # Convert messages to prompt
        prompt = convert_messages_to_prompt(request.messages)
        
        # Count input tokens
        prompt_tokens = count_tokens(prompt)
        
        if request.stream:
            # Streaming response
            async def generate_stream():
                try:
                    response_text = ""
                    chunk_id = f"chatcmpl-{uuid.uuid4().hex[:8]}"
                    
                    # Try streaming first
                    try:
                        for token in client.text_generation(
                            prompt=prompt,
                            max_new_tokens=request.max_tokens,
                            temperature=request.temperature,
                            do_sample=True,
                            return_full_text=False,
                            stream=True
                        ):
                            if hasattr(token, 'token'):
                                token_text = token.token.text
                            elif isinstance(token, dict) and 'token' in token:
                                token_text = token['token']['text']
                            else:
                                token_text = str(token)
                            
                            response_text += token_text
                            
                            # Create streaming chunk
                            chunk = {
                                "id": chunk_id,
                                "object": "chat.completion.chunk",
                                "created": int(time.time()),
                                "model": request.model,
                                "choices": [{
                                    "index": 0,
                                    "delta": {"content": token_text},
                                    "finish_reason": None
                                }]
                            }
                            
                            yield f"data: {json.dumps(chunk)}\n\n"
                    
                    except Exception as e:
                        logger.warning(f"Streaming failed, using non-streaming: {e}")
                        # Fallback to non-streaming
                        response_text = client.text_generation(
                            prompt=prompt,
                            max_new_tokens=request.max_tokens,
                            temperature=request.temperature,
                            do_sample=True,
                            return_full_text=False
                        )
                        
                        # Send the complete response as chunks
                        words = response_text.split()
                        for word in words:
                            chunk = {
                                "id": chunk_id,
                                "object": "chat.completion.chunk",
                                "created": int(time.time()),
                                "model": request.model,
                                "choices": [{
                                    "index": 0,
                                    "delta": {"content": word + " "},
                                    "finish_reason": None
                                }]
                            }
                            yield f"data: {json.dumps(chunk)}\n\n"
                            await asyncio.sleep(0.05)  # Small delay for streaming effect
                    
                    # Send final chunk
                    final_chunk = {
                        "id": chunk_id,
                        "object": "chat.completion.chunk",
                        "created": int(time.time()),
                        "model": request.model,
                        "choices": [{
                            "index": 0,
                            "delta": {},
                            "finish_reason": "stop"
                        }]
                    }
                    yield f"data: {json.dumps(final_chunk)}\n\n"
                    yield "data: [DONE]\n\n"
                    
                except Exception as e:
                    logger.error(f"Error in streaming: {e}")
                    error_chunk = {
                        "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                        "object": "chat.completion.chunk",
                        "created": int(time.time()),
                        "model": request.model,
                        "choices": [{
                            "index": 0,
                            "delta": {"content": "I apologize, but I'm experiencing technical difficulties."},
                            "finish_reason": "stop"
                        }]
                    }
                    yield f"data: {json.dumps(error_chunk)}\n\n"
                    yield "data: [DONE]\n\n"
            
            return StreamingResponse(generate_stream(), media_type="text/plain")
        
        else:
            # Non-streaming response
            try:
                response_text = client.text_generation(
                    prompt=prompt,
                    max_new_tokens=request.max_tokens,
                    temperature=request.temperature,
                    do_sample=True,
                    return_full_text=False
                )
            except Exception as e:
                logger.error(f"Error in text generation: {e}")
                response_text = "I apologize, but I'm experiencing technical difficulties. Please try again."
            
            # Clean up response
            if isinstance(response_text, str):
                response_text = response_text.strip()
            else:
                response_text = str(response_text).strip()
            
            # Count completion tokens
            completion_tokens = count_tokens(response_text)
            
            # Create response
            response = ChatCompletionResponse(
                id=f"chatcmpl-{uuid.uuid4().hex[:8]}",
                created=int(time.time()),
                model=request.model,
                choices=[
                    ChatCompletionChoice(
                        index=0,
                        message=ChatMessage(role="assistant", content=response_text),
                        finish_reason="stop"
                    )
                ],
                usage=ChatCompletionUsage(
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    total_tokens=prompt_tokens + completion_tokens
                )
            )
            
            return response
    
    except Exception as e:
        logger.error(f"Error in chat completion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/embeddings", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    """Create embeddings using Hugging Face models"""
    try:
        # Get client for the embedding model
        client = get_client(request.model)
        
        # Handle single string or list of strings
        texts = request.input if isinstance(request.input, list) else [request.input]
        
        embeddings_data = []
        total_tokens = 0
        
        for i, text in enumerate(texts):
            try:
                # Get embedding from Hugging Face
                embedding = client.feature_extraction(text)
                
                # Ensure embedding is a flat list of floats
                if isinstance(embedding, list) and len(embedding) > 0:
                    if isinstance(embedding[0], list):
                        # If it's a nested list, flatten it
                        flat_embedding = []
                        for sublist in embedding:
                            if isinstance(sublist, list):
                                flat_embedding.extend(sublist)
                            else:
                                flat_embedding.append(float(sublist))
                        embedding = flat_embedding
                    else:
                        embedding = [float(x) for x in embedding]
                else:
                    # Fallback: create a dummy embedding
                    embedding = [0.0] * 384  # Common embedding size
                
                embeddings_data.append(
                    EmbeddingData(
                        embedding=embedding,
                        index=i
                    )
                )
                
                total_tokens += count_tokens(text)
                
            except Exception as e:
                logger.error(f"Error creating embedding for text {i}: {e}")
                # Create a dummy embedding as fallback
                embeddings_data.append(
                    EmbeddingData(
                        embedding=[0.0] * 384,
                        index=i
                    )
                )
                total_tokens += count_tokens(text)
        
        return EmbeddingResponse(
            data=embeddings_data,
            model=request.model,
            usage=ChatCompletionUsage(
                prompt_tokens=total_tokens,
                completion_tokens=0,
                total_tokens=total_tokens
            )
        )
    
    except Exception as e:
        logger.error(f"Error in embeddings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Agent SDK compatibility endpoints
@app.post("/v1/agents/create")
async def create_agent(request: Request):
    """Create a new agent (placeholder for AgentsSDK compatibility)"""
    data = await request.json()
    agent_id = f"agent-{uuid.uuid4().hex[:8]}"
    
    return {
        "id": agent_id,
        "object": "agent",
        "created": int(time.time()),
        "name": data.get("name", "Unnamed Agent"),
        "description": data.get("description", ""),
        "model": data.get("model", "microsoft/DialoGPT-medium"),
        "instructions": data.get("instructions", ""),
        "tools": data.get("tools", []),
        "status": "active"
    }

@app.get("/v1/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details (placeholder for AgentsSDK compatibility)"""
    return {
        "id": agent_id,
        "object": "agent",
        "created": int(time.time()),
        "name": "Sample Agent",
        "description": "A sample agent for demonstration",
        "model": "microsoft/DialoGPT-medium",
        "instructions": "You are a helpful assistant.",
        "tools": [],
        "status": "active"
    }

@app.post("/v1/agents/{agent_id}/runs")
async def create_agent_run(agent_id: str, request: Request):
    """Create an agent run (placeholder for AgentsSDK compatibility)"""
    data = await request.json()
    run_id = f"run-{uuid.uuid4().hex[:8]}"
    
    return {
        "id": run_id,
        "object": "agent.run",
        "created": int(time.time()),
        "agent_id": agent_id,
        "status": "completed",
        "messages": data.get("messages", []),
        "result": "Agent run completed successfully"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

