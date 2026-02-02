# Oracle Voice API

FastAPI implementation for OpenAI Real-time Voice API integration with the Yi Jing Oracle React Native app.

## Features

- Text-to-Speech (TTS) conversion using OpenAI's TTS API
- Streaming TTS for real-time audio generation
- WebSocket support for real-time voice streaming
- Multiple voice options (alloy, echo, fable, onyx, nova, shimmer)
- Configurable speech speed and model selection
- CORS enabled for React Native integration

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set OpenAI API Key:**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key-here"
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```

   The server will start on `http://localhost:8001`

## API Endpoints

### Health Check
- `GET /health` - Check service status and OpenAI API availability

### Voices
- `GET /voices` - Get available voices and configuration options

### Text-to-Speech
- `POST /tts` - Convert text to speech (returns base64 encoded audio)
- `POST /tts/stream` - Streaming text-to-speech for real-time synthesis

### WebSocket
- `WS /ws/voice` - Real-time voice streaming via WebSocket

## Usage Examples

### Basic TTS
```json
POST /tts
{
  "text": "The Oracle speaks wisdom through divine flames",
  "voice": "alloy",
  "model": "tts-1",
  "speed": 1.0
}
```

### Streaming TTS
```json
POST /tts/stream
{
  "text": "Long oracle response that needs to be streamed...",
  "voice": "fable",
  "chunk_size": 50
}
```

### WebSocket Usage
```javascript
const ws = new WebSocket('ws://localhost:8001/ws/voice');

ws.send(JSON.stringify({
  type: 'text',
  text: 'Seek wisdom from the Oracle',
  voice: 'nova'
}));
```

## Integration with React Native

The API is designed to work seamlessly with the existing Oracle app's streaming LLM responses. Audio data is returned as base64 encoded strings for easy playback in React Native using libraries like `react-native-sound` or `expo-av`.

## Configuration

- **Port**: Set `PORT` environment variable (default: 8001)
- **OpenAI API Key**: Set `OPENAI_API_KEY` environment variable
- **Log Level**: Configurable via uvicorn settings

## Voice Options

- **alloy**: Neutral, balanced voice
- **echo**: Male voice with clarity  
- **fable**: British accent, storytelling
- **onyx**: Deep, authoritative male voice
- **nova**: Friendly female voice
- **shimmer**: Soft, whispery female voice

## Models

- **tts-1**: Standard quality, faster generation
- **tts-1-hd**: High definition, better quality

## Speed Range

- **0.25x** to **4.0x** normal speed