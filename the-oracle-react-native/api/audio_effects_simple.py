"""
Simplified Audio Effects Processor for Divine Oracle Voice
Fallback implementation using only basic dependencies
"""

import numpy as np
from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range
from scipy import signal
import io
import base64
from typing import Dict, Any, Optional

class SimpleMysticalAudioProcessor:
    """Simplified version of mystical audio processor with fewer dependencies"""
    
    def __init__(self):
        self.sample_rate = 22050  # Standard for speech
        
    def apply_mystical_effects(self, audio_data: bytes, effects_config: Dict[str, Any]) -> bytes:
        """Apply mystical effects to audio data using simplified methods"""
        try:
            # Convert audio bytes to AudioSegment
            audio = AudioSegment.from_file(io.BytesIO(audio_data), format="mp3")
            
            # Convert to numpy array for processing
            samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
            if audio.channels == 2:
                samples = samples.reshape((-1, 2))
                samples = samples.mean(axis=1)  # Convert to mono
            
            # Normalize to [-1, 1]
            samples = samples / (2**15)
            
            # Apply effects in order (simplified versions)
            if effects_config.get('reverb', {}).get('enabled', False):
                samples = self._apply_simple_reverb(samples, effects_config['reverb'])
                
            if effects_config.get('echo', {}).get('enabled', False):
                samples = self._apply_simple_echo(samples, effects_config['echo'])
                
            if effects_config.get('chorus', {}).get('enabled', False):
                samples = self._apply_simple_chorus(samples, effects_config['chorus'])
                
            if effects_config.get('harmonics', {}).get('enabled', False):
                samples = self._apply_simple_harmonics(samples, effects_config['harmonics'])
            
            # Apply ambient layering
            if effects_config.get('ambience', {}).get('enabled', False):
                samples = self._apply_simple_ambient_layer(samples, effects_config['ambience'])
            
            # Convert back to audio
            samples = np.clip(samples, -1, 1)
            samples = (samples * 32767).astype(np.int16)
            
            # Create new AudioSegment
            processed_audio = AudioSegment(
                samples.tobytes(),
                frame_rate=self.sample_rate,
                sample_width=2,
                channels=1
            )
            
            # Apply final normalization and compression
            processed_audio = normalize(processed_audio)
            processed_audio = compress_dynamic_range(processed_audio)
            
            # Export back to bytes
            output_buffer = io.BytesIO()
            processed_audio.export(output_buffer, format="mp3", bitrate="128k")
            return output_buffer.getvalue()
            
        except Exception as e:
            print(f"Error applying mystical effects: {e}")
            return audio_data  # Return original if processing fails
    
    def _apply_simple_reverb(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply simple reverb effect"""
        room_size = config.get('roomSize', 0.8)
        wet_level = config.get('wetLevel', 0.4)
        
        # Simple reverb using multiple delays
        delay1_samples = int(0.03 * self.sample_rate)  # 30ms
        delay2_samples = int(0.07 * self.sample_rate)  # 70ms
        delay3_samples = int(0.12 * self.sample_rate)  # 120ms
        
        reverb_signal = np.zeros_like(samples)
        
        # Add multiple delayed versions with decay
        if len(samples) > delay1_samples:
            reverb_signal[delay1_samples:] += samples[:-delay1_samples] * 0.3 * room_size
        if len(samples) > delay2_samples:
            reverb_signal[delay2_samples:] += samples[:-delay2_samples] * 0.2 * room_size
        if len(samples) > delay3_samples:
            reverb_signal[delay3_samples:] += samples[:-delay3_samples] * 0.1 * room_size
        
        return samples * (1 - wet_level) + reverb_signal * wet_level
    
    def _apply_simple_echo(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply simple echo effect"""
        delay_ms = config.get('delay', 300)
        feedback = config.get('feedback', 0.3)
        wet_level = config.get('wetLevel', 0.2)
        
        delay_samples = int(delay_ms * self.sample_rate / 1000)
        
        if delay_samples >= len(samples):
            return samples
        
        echo_signal = np.zeros_like(samples)
        echo_signal[delay_samples:] = samples[:-delay_samples] * feedback
        
        return samples + echo_signal * wet_level
    
    def _apply_simple_chorus(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply simple chorus effect using slight delay modulation"""
        depth = config.get('depth', 0.3)
        rate = config.get('rate', 0.5)
        wet_level = config.get('wetLevel', 0.15)
        
        # Create a simple modulated delay line
        t = np.arange(len(samples)) / self.sample_rate
        lfo = np.sin(2 * np.pi * rate * t) * depth
        
        # Apply simple pitch-like modulation by sample shifting
        modulated_signal = np.zeros_like(samples)
        for i in range(len(samples)):
            shift = int(lfo[i] * 10)  # Convert to sample shift
            src_idx = i - shift
            if 0 <= src_idx < len(samples):
                modulated_signal[i] = samples[src_idx]
            else:
                modulated_signal[i] = samples[i]
        
        return samples * (1 - wet_level) + modulated_signal * wet_level
    
    def _apply_simple_harmonics(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Add simple harmonic layers by pitch shifting"""
        layers = config.get('layers', 2)
        detune_cents = config.get('detune', 15)
        
        harmonic_signal = samples.copy()
        
        # Simple harmonic generation by time-stretching approximation
        for layer in range(1, min(layers + 1, 4)):  # Limit layers to prevent overload
            # Simple pitch shift by resampling approximation
            shift_ratio = 2 ** (detune_cents * layer / 1200)
            if shift_ratio > 0.8 and shift_ratio < 1.2:  # Only small shifts
                try:
                    # Resample to approximate pitch shift
                    new_length = int(len(samples) / shift_ratio)
                    if new_length > 0 and new_length < len(samples) * 2:
                        resampled = signal.resample(samples, new_length)
                        # Pad or trim to original length
                        if len(resampled) > len(samples):
                            resampled = resampled[:len(samples)]
                        else:
                            padded = np.zeros(len(samples))
                            padded[:len(resampled)] = resampled
                            resampled = padded
                        
                        harmonic_signal += resampled * (0.3 / layer)
                except:
                    continue  # Skip this layer if resampling fails
        
        return harmonic_signal
    
    def _apply_simple_ambient_layer(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Add simple ambient atmospheric layer"""
        ambience_type = config.get('type', 'celestial')
        volume = config.get('volume', 0.3)
        
        # Generate simple ambient sounds
        duration = len(samples) / self.sample_rate
        t = np.linspace(0, duration, len(samples))
        
        if ambience_type == 'celestial':
            # Ethereal tones
            ambient = (
                0.3 * np.sin(2 * np.pi * 110 * t) +  # Low fundamental
                0.2 * np.sin(2 * np.pi * 220 * t) +  # Octave
                0.1 * np.sin(2 * np.pi * 330 * t)    # Fifth
            )
            # Apply slow tremolo
            tremolo = 1 + 0.1 * np.sin(2 * np.pi * 0.5 * t)
            ambient *= tremolo
            
        elif ambience_type == 'temple':
            # Bell-like tones
            ambient = 0.2 * np.sin(2 * np.pi * 174 * t * np.exp(-t * 0.5))
            ambient += 0.1 * np.sin(2 * np.pi * 348 * t * np.exp(-t * 0.7))
            
        elif ambience_type == 'cosmic':
            # Deep space drones
            ambient = (
                0.4 * np.sin(2 * np.pi * 55 * t) +     # Very low drone
                0.2 * np.sin(2 * np.pi * 82.5 * t) +   # Fifth
                0.1 * np.random.normal(0, 0.03, len(samples))  # Space noise
            )
            
        elif ambience_type == 'forest':
            # Nature sounds
            ambient = 0.1 * np.random.normal(0, 0.02, len(samples))  # Wind
            # Add some sparkle
            sparkle_freq = 1760
            sparkle = 0.05 * np.sin(2 * np.pi * sparkle_freq * t) * np.exp(-2 * t)
            ambient += sparkle
            
        else:
            ambient = np.zeros_like(samples)
        
        # Apply volume and mix
        ambient *= volume
        return samples + ambient
