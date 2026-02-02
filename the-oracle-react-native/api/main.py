"""
FastAPI implementation for OpenAI Real-time Voice API
Streams text-to-speech audio for the Oracle Yi Jing app
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Optional, Dict, Any

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import openai
from openai import OpenAI
import io
import base64
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from audio_effects import MysticalAudioProcessor
    AUDIO_PROCESSOR_TYPE = "full"
    logger.info("Loaded full mystical audio processor")
except ImportError as e:
    logger.warning(f"Full audio processor not available: {e}")
    logger.info("Falling back to simplified audio processor")
    from audio_effects_simple import SimpleMysticalAudioProcessor as MysticalAudioProcessor
    AUDIO_PROCESSOR_TYPE = "simple"

# Initialize FastAPI app
app = FastAPI(
    title="Oracle Voice API",
    description="OpenAI Real-time Voice API for Yi Jing Oracle",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize audio effects processor
audio_processor = MysticalAudioProcessor()

# Request/Response models
class TextToSpeechRequest(BaseModel):
    text: str
    voice: Optional[str] = "alloy"  # alloy, echo, fable, onyx, nova, shimmer
    model: Optional[str] = "tts-1"  # tts-1 or tts-1-hd
    speed: Optional[float] = 1.0
    mystical_effects: Optional[Dict[str, Any]] = None

class StreamingTextRequest(BaseModel):
    text: str
    voice: Optional[str] = "alloy"
    model: Optional[str] = "tts-1"
    speed: Optional[float] = 1.0
    chunk_size: Optional[int] = 50  # Characters per chunk
    mystical_effects: Optional[Dict[str, Any]] = None

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test OpenAI API key
        if not os.getenv("OPENAI_API_KEY"):
            return {
                "status": "unhealthy",
                "voice_available": False,
                "error": "OpenAI API key not configured"
            }
        return {
            "status": "healthy",
            "voice_available": True,
            "audio_processor": AUDIO_PROCESSOR_TYPE,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "voice_available": False,
            "error": str(e)
        }

@app.post("/tts")
async def text_to_speech(request: TextToSpeechRequest):
    """Convert text to speech using OpenAI TTS"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        # Generate speech using OpenAI TTS
        response = client.audio.speech.create(
            model=request.model,
            voice=request.voice,
            input=request.text,
            speed=request.speed
        )

        # Apply mystical effects if enabled
        audio_data = response.content
        if request.mystical_effects and request.mystical_effects.get('enabled', False):
            try:
                audio_data = audio_processor.apply_mystical_effects(audio_data, request.mystical_effects)
                logger.info("Applied mystical effects to TTS audio")
            except Exception as e:
                logger.error(f"Failed to apply mystical effects: {e}")
                # Continue with original audio if effects fail
        
        # Convert to base64 for easier transmission
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return {
            "success": True,
            "audio_base64": audio_base64,
            "mime_type": "audio/mpeg",
            "text": request.text,
            "voice": request.voice,
            "model": request.model,
            "mystical_effects_applied": request.mystical_effects is not None and request.mystical_effects.get('enabled', False)
        }

    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

@app.post("/tts/stream")
async def stream_text_to_speech(request: StreamingTextRequest):
    """Stream text-to-speech for real-time synthesis"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        async def generate_audio_chunks():
            # Split text into chunks for streaming
            words = request.text.split()
            current_chunk = ""
            
            for word in words:
                current_chunk += word + " "
                
                # When chunk reaches desired size, generate audio
                if len(current_chunk) >= request.chunk_size:
                    try:
                        # Generate speech for this chunk
                        response = client.audio.speech.create(
                            model=request.model,
                            voice=request.voice,
                            input=current_chunk.strip(),
                            speed=request.speed
                        )
                        
                        # Apply mystical effects if enabled
                        audio_data = response.content
                        if request.mystical_effects and request.mystical_effects.get('enabled', False):
                            try:
                                audio_data = audio_processor.apply_mystical_effects(audio_data, request.mystical_effects)
                            except Exception as e:
                                logger.error(f"Failed to apply mystical effects to chunk: {e}")
                        
                        # Encode audio as base64
                        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                        
                        # Yield chunk as JSON
                        chunk_data = {
                            "type": "audio",
                            "audio_base64": audio_base64,
                            "text": current_chunk.strip(),
                            "mime_type": "audio/mpeg",
                            "mystical_effects_applied": request.mystical_effects is not None and request.mystical_effects.get('enabled', False)
                        }
                        
                        yield f"data: {json.dumps(chunk_data)}\n\n"
                        current_chunk = ""
                        
                        # Add small delay to prevent overwhelming
                        await asyncio.sleep(0.1)
                        
                    except Exception as e:
                        logger.error(f"Chunk TTS error: {e}")
                        error_data = {
                            "type": "error",
                            "error": str(e),
                            "text": current_chunk.strip()
                        }
                        yield f"data: {json.dumps(error_data)}\n\n"
            
            # Process remaining text
            if current_chunk.strip():
                try:
                    response = client.audio.speech.create(
                        model=request.model,
                        voice=request.voice,
                        input=current_chunk.strip(),
                        speed=request.speed
                    )
                    
                    # Apply mystical effects if enabled
                    audio_data = response.content
                    if request.mystical_effects and request.mystical_effects.get('enabled', False):
                        try:
                            audio_data = audio_processor.apply_mystical_effects(audio_data, request.mystical_effects)
                        except Exception as e:
                            logger.error(f"Failed to apply mystical effects to final chunk: {e}")
                    
                    audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                    
                    chunk_data = {
                        "type": "audio",
                        "audio_base64": audio_base64,
                        "text": current_chunk.strip(),
                        "mime_type": "audio/mpeg",
                        "mystical_effects_applied": request.mystical_effects is not None and request.mystical_effects.get('enabled', False)
                    }
                    
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                    
                except Exception as e:
                    logger.error(f"Final chunk TTS error: {e}")
                    error_data = {
                        "type": "error",
                        "error": str(e),
                        "text": current_chunk.strip()
                    }
                    yield f"data: {json.dumps(error_data)}\n\n"
            
            # Send completion signal
            completion_data = {
                "type": "complete",
                "message": "TTS stream completed"
            }
            yield f"data: {json.dumps(completion_data)}\n\n"

        return StreamingResponse(
            generate_audio_chunks(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream"
            }
        )

    except Exception as e:
        logger.error(f"Streaming TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Streaming TTS failed: {str(e)}")

# WebSocket endpoint for real-time voice streaming
@app.websocket("/ws/voice")
async def websocket_voice_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time voice streaming"""
    await websocket.accept()
    
    try:
        while True:
            # Receive text from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "text":
                text = message.get("text", "")
                voice = message.get("voice", "alloy")
                model = message.get("model", "tts-1")
                speed = message.get("speed", 1.0)
                
                if not text.strip():
                    await websocket.send_json({
                        "type": "error",
                        "error": "Empty text received"
                    })
                    continue
                
                try:
                    # Generate speech
                    response = client.audio.speech.create(
                        model=model,
                        voice=voice,
                        input=text,
                        speed=speed
                    )
                    
                    # Send audio back as base64
                    audio_data = response.content
                    audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                    
                    await websocket.send_json({
                        "type": "audio",
                        "audio_base64": audio_base64,
                        "text": text,
                        "mime_type": "audio/mpeg"
                    })
                    
                except Exception as e:
                    logger.error(f"WebSocket TTS error: {e}")
                    await websocket.send_json({
                        "type": "error",
                        "error": str(e)
                    })
            
            elif message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
                
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "error": str(e)
            })
        except:
            pass

# Available voices endpoint
@app.get("/voices")
async def get_available_voices():
    """Get list of available OpenAI TTS voices"""
    return {
        "voices": [
            {"id": "alloy", "name": "Alloy", "description": "Neutral, balanced voice"},
            { "id": "sage", "name": "Sage", "description": "Deep, authoritative female voice"},
            {"id": "echo", "name": "Echo", "description": "Male voice with clarity"},
            {"id": "fable", "name": "Fable", "description": "British accent, storytelling"},
            {"id": "onyx", "name": "Onyx", "description": "Deep, authoritative male voice"},
            {"id": "nova", "name": "Nova", "description": "Friendly female voice"},
            {"id": "shimmer", "name": "Shimmer", "description": "Soft, whispery female voice"}
        ],
        "models": ["tts-1", "tts-1-hd"],
        "speed_range": [0.25, 4.0]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )