"""
Audio Effects Processor for Divine Oracle Voice
Implements mystical audio effects including reverb, echo, chorus, and harmonics
"""

import numpy as np
import librosa
from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range
from scipy import signal
import io
import base64
from typing import Dict, Any, Optional

class MysticalAudioProcessor:
    """Processes audio with divine, otherworldly effects"""
    
    def __init__(self):
        self.sample_rate = 22050  # Standard for speech
        
    def apply_mystical_effects(self, audio_data: bytes, effects_config: Dict[str, Any]) -> bytes:
        """Apply all mystical effects to audio data"""
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
            
            # Apply effects in order
            if effects_config.get('reverb', {}).get('enabled', False):
                samples = self._apply_reverb(samples, effects_config['reverb'])
                
            if effects_config.get('echo', {}).get('enabled', False):
                samples = self._apply_echo(samples, effects_config['echo'])
                
            if effects_config.get('chorus', {}).get('enabled', False):
                samples = self._apply_chorus(samples, effects_config['chorus'])
                
            if effects_config.get('harmonics', {}).get('enabled', False):
                samples = self._apply_harmonics(samples, effects_config['harmonics'])
                
            if effects_config.get('pitchShift', {}).get('enabled', False):
                samples = self._apply_pitch_shift(samples, effects_config['pitchShift'])
            
            # Apply ambient layering
            if effects_config.get('ambience', {}).get('enabled', False):
                samples = self._apply_ambient_layer(samples, effects_config['ambience'])
            
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
    
    def _apply_reverb(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply reverb effect for subtle ethereal spaciousness"""
        room_size = config.get('roomSize', 0.8)
        damping = config.get('damping', 0.5)
        wet_level = config.get('wetLevel', 0.4)
        
        # Create more subtle impulse response for ethereal reverb
        decay_time = room_size * 1.2  # Shorter decay for less muddiness
        decay_samples = int(decay_time * self.sample_rate)
        
        # Generate smoother, more musical impulse response
        impulse = np.random.normal(0, 0.05, decay_samples)  # Reduced noise level
        
        # Create multiple decay curves for richer, more natural reverb
        early_decay = np.exp(-np.linspace(0, 3, decay_samples) * (2 + damping))
        late_decay = np.exp(-np.linspace(0, 8, decay_samples) * (0.5 + damping * 0.5))
        
        # Blend early and late reflections
        decay_curve = 0.7 * early_decay + 0.3 * late_decay
        impulse *= decay_curve
        
        # Add subtle spectral shaping for more ethereal quality
        frequencies = np.fft.fftfreq(len(impulse), 1/self.sample_rate)
        impulse_fft = np.fft.fft(impulse)
        
        # Enhance high frequencies slightly and reduce harsh mids
        spectral_shaping = np.ones_like(frequencies)
        spectral_shaping[np.abs(frequencies) > 2000] *= 1.2  # Boost highs
        spectral_shaping[np.logical_and(np.abs(frequencies) > 800, np.abs(frequencies) < 2000)] *= 0.8  # Reduce mids
        
        impulse_fft *= spectral_shaping
        impulse = np.real(np.fft.ifft(impulse_fft))
        
        # Apply convolution for reverb
        reverb_signal = signal.convolve(samples, impulse, mode='same')
        
        # Mix dry and wet signals with subtle blend
        return samples * (1 - wet_level) + reverb_signal * wet_level
    
    def _apply_echo(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply subtle echo effect for ethereal mystical resonance"""
        delay_ms = config.get('delay', 300)
        feedback = config.get('feedback', 0.3)
        wet_level = config.get('wetLevel', 0.2)
        
        # Create multiple subtle echo delays for more natural effect
        primary_delay = int(delay_ms * self.sample_rate / 1000)
        secondary_delay = int((delay_ms * 1.618) * self.sample_rate / 1000)  # Golden ratio for natural timing
        
        echo_signal = np.zeros_like(samples)
        
        # Primary echo with reduced feedback for less repetition
        for i in range(primary_delay, len(samples)):
            echo_signal[i] += samples[i - primary_delay] * feedback * 0.6
            
        # Secondary echo with even less feedback and high-frequency roll-off
        for i in range(secondary_delay, len(samples)):
            # Apply high-frequency dampening to secondary echo
            secondary_sample = samples[i - secondary_delay] * feedback * 0.3
            echo_signal[i] += secondary_sample
            
        # Add very subtle third echo for depth
        tertiary_delay = int((delay_ms * 2.3) * self.sample_rate / 1000)
        for i in range(tertiary_delay, len(samples)):
            if i < len(samples):
                echo_signal[i] += samples[i - tertiary_delay] * feedback * 0.15
        
        # Apply gentle low-pass filter to echo for smoother, more ethereal quality
        if len(echo_signal) > 0:
            # Simple low-pass filter using rolling average
            window_size = int(self.sample_rate * 0.001)  # 1ms window
            if window_size > 1:
                echo_signal = np.convolve(echo_signal, np.ones(window_size)/window_size, mode='same')
        
        return samples + echo_signal * wet_level
    
    def _apply_chorus(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply subtle chorus effect for gentle angelic choir-like quality"""
        depth = config.get('depth', 0.3)
        rate = config.get('rate', 0.5)
        wet_level = config.get('wetLevel', 0.15)
        
        # Create multiple LFOs for richer, more natural chorus
        t = np.linspace(0, len(samples) / self.sample_rate, len(samples))
        
        # Primary LFO with smooth sine wave
        lfo1 = np.sin(2 * np.pi * rate * t) * depth * 0.6
        
        # Secondary LFO slightly out of phase and different frequency for complexity
        lfo2 = np.sin(2 * np.pi * rate * 1.3 * t + np.pi/4) * depth * 0.4
        
        # Create two modulated signals for stereo-like chorus effect
        chorus_signal1 = np.zeros_like(samples)
        chorus_signal2 = np.zeros_like(samples)
        
        for i in range(len(samples)):
            # More subtle modulation with smaller delay variations
            shift1 = int(lfo1[i] * 3)  # Reduced modulation depth
            shift2 = int(lfo2[i] * 2)  # Even more subtle second voice
            
            # Apply delays with bounds checking
            if 0 <= i - shift1 < len(samples):
                chorus_signal1[i] = samples[i - shift1]
            else:
                chorus_signal1[i] = samples[i]
                
            if 0 <= i - shift2 < len(samples):
                chorus_signal2[i] = samples[i - shift2]
            else:
                chorus_signal2[i] = samples[i]
        
        # Blend the chorus voices with different levels for natural effect
        chorus_blend = chorus_signal1 * 0.7 + chorus_signal2 * 0.3
        
        # Apply gentle high-frequency emphasis to chorus for ethereal sparkle
        if len(chorus_blend) > 1:
            # Simple high-pass filter approximation
            chorus_filtered = np.zeros_like(chorus_blend)
            alpha = 0.95  # High-pass filter coefficient
            chorus_filtered[0] = chorus_blend[0]
            for i in range(1, len(chorus_blend)):
                chorus_filtered[i] = alpha * chorus_filtered[i-1] + alpha * (chorus_blend[i] - chorus_blend[i-1])
            
            # Mix filtered high frequencies back in subtly
            chorus_blend = chorus_blend * 0.8 + chorus_filtered * 0.2
        
        return samples * (1 - wet_level) + chorus_blend * wet_level
    
    def _apply_harmonics(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Add subtle harmonic layers for divine richness without muddiness"""
        layers = config.get('layers', 2)
        detune_cents = config.get('detune', 15)
        
        harmonic_signal = samples.copy()
        
        # Use more musical intervals for divine harmonics
        musical_intervals = [
            0.07,    # Slight detune for warmth
            0.19,    # Major third (approximately)
            0.32,    # Perfect fifth (approximately)
            0.58,    # Major seventh (approximately)
        ]
        
        for layer in range(1, min(layers + 1, len(musical_intervals) + 1)):
            # Use musical intervals instead of linear detuning
            if layer <= len(musical_intervals):
                cents_shift = detune_cents * musical_intervals[layer - 1] * 100
            else:
                cents_shift = detune_cents * layer
            
            # Only add harmonics if the shift is meaningful
            if abs(cents_shift) > 5:  # At least 5 cents difference
                try:
                    harmonic_layer = librosa.effects.pitch_shift(
                        samples, sr=self.sample_rate, n_steps=cents_shift/100
                    )
                    
                    # Apply progressively lower volume and high-frequency roll-off
                    layer_volume = 0.2 / (layer * 1.5)  # More gentle falloff
                    
                    # Apply gentle low-pass filter to higher harmonics to reduce harshness
                    if layer > 1:
                        # Simple low-pass filter using exponential moving average
                        filtered_layer = np.zeros_like(harmonic_layer)
                        alpha = 0.3 * layer  # More filtering for higher layers
                        filtered_layer[0] = harmonic_layer[0]
                        for i in range(1, len(harmonic_layer)):
                            filtered_layer[i] = (1 - alpha) * harmonic_layer[i] + alpha * filtered_layer[i-1]
                        harmonic_layer = filtered_layer
                    
                    harmonic_signal += harmonic_layer * layer_volume
                    
                except Exception as e:
                    # Skip this harmonic if pitch shifting fails
                    print(f"Skipping harmonic layer {layer}: {e}")
                    continue
        
        # Apply gentle compression to prevent harmonics from overwhelming
        harmonic_signal = np.tanh(harmonic_signal * 0.8) * 1.2
        
        return harmonic_signal
    
    def _apply_pitch_shift(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Apply pitch shifting for otherworldly voice"""
        semitones = config.get('semitones', 0)
        
        if semitones == 0:
            return samples
            
        return librosa.effects.pitch_shift(
            samples, sr=self.sample_rate, n_steps=semitones
        )
    
    def _apply_ambient_layer(self, samples: np.ndarray, config: Dict[str, Any]) -> np.ndarray:
        """Add ambient atmospheric layer"""
        ambience_type = config.get('type', 'celestial')
        volume = config.get('volume', 0.3)
        
        # Generate procedural ambient sounds based on type
        duration = len(samples) / self.sample_rate
        t = np.linspace(0, duration, len(samples))
        
        if ambience_type == 'celestial':
            # More subtle ethereal tones and harmonics
            # Use softer frequencies and gentler amplitude
            fundamental_freq = 55  # Lower, warmer fundamental
            ambient = (
                0.15 * np.sin(2 * np.pi * fundamental_freq * t) +  # Gentle low fundamental
                0.1 * np.sin(2 * np.pi * fundamental_freq * 2 * t) +  # Octave
                0.08 * np.sin(2 * np.pi * fundamental_freq * 3 * t) +  # Fifth
                0.06 * np.sin(2 * np.pi * fundamental_freq * 4 * t) +  # Major third
                0.03 * np.random.normal(0, 0.02, len(samples))  # Very soft atmospheric noise
            )
            
            # Apply multiple gentle modulations for organic feel
            # Slow tremolo
            tremolo = 1 + 0.05 * np.sin(2 * np.pi * 0.3 * t)
            # Add subtle vibrato
            vibrato = 1 + 0.02 * np.sin(2 * np.pi * 0.7 * t)
            # Add very slow amplitude sweep
            amplitude_sweep = 0.5 + 0.5 * np.sin(2 * np.pi * 0.1 * t)
            
            ambient *= tremolo * vibrato * amplitude_sweep
            
            # Apply gentle low-pass filtering for dreamlike quality
            if len(ambient) > 1:
                filtered_ambient = np.zeros_like(ambient)
                alpha = 0.15  # Strong low-pass for ethereal softness
                filtered_ambient[0] = ambient[0]
                for i in range(1, len(ambient)):
                    filtered_ambient[i] = (1 - alpha) * ambient[i] + alpha * filtered_ambient[i-1]
                ambient = filtered_ambient
            
        elif ambience_type == 'temple':
            # Bell-like tones with metallic resonance
            ambient = 0.2 * np.sin(2 * np.pi * 174 * t * np.exp(-t * 0.5))  # Decaying bell
            ambient += 0.1 * np.sin(2 * np.pi * 348 * t * np.exp(-t * 0.7))  # Harmonic
            
        elif ambience_type == 'cosmic':
            # Deep space-like drones
            ambient = (
                0.4 * np.sin(2 * np.pi * 55 * t) +   # Very low drone
                0.2 * np.sin(2 * np.pi * 82.5 * t) + # Fifth
                0.1 * np.random.normal(0, 0.03, len(samples))  # Space noise
            )
            
        elif ambience_type == 'forest':
            # Nature-based mystical sounds
            ambient = 0.1 * np.random.normal(0, 0.02, len(samples))  # Wind
            # Add occasional "sparkle" tones
            sparkle_times = np.random.poisson(0.5, int(duration)) * self.sample_rate
            for sparkle_time in sparkle_times:
                if sparkle_time < len(samples):
                    sparkle = 0.1 * np.sin(2 * np.pi * 1760 * t) * np.exp(-10 * t)
                    start_idx = min(int(sparkle_time), len(samples) - len(sparkle))
                    ambient[start_idx:start_idx + len(sparkle)] += sparkle[:len(ambient) - start_idx]
        else:
            ambient = np.zeros_like(samples)
        
        # Apply volume and mix
        ambient *= volume
        return samples + ambient
