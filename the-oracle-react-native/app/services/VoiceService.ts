/**
 * Voice Service for Oracle App
 * Integrates OpenAI TTS with streaming text responses
 */

import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";

export interface VoiceConfig {
  voice:
    | "alloy"
    | "echo"
    | "fable"
    | "onyx"
    | "nova"
    | "shimmer"
    | "coral"
    | "sage";
  model: "tts-1" | "tts-1-hd";
  speed: number;
  enabled: boolean;
  mysticalEffects: {
    enabled: boolean;
    reverb: {
      enabled: boolean;
      roomSize: number; // 0.0 - 1.0
      damping: number; // 0.0 - 1.0
      wetLevel: number; // 0.0 - 1.0
    };
    echo: {
      enabled: boolean;
      delay: number; // milliseconds
      feedback: number; // 0.0 - 1.0
      wetLevel: number; // 0.0 - 1.0
    };
    chorus: {
      enabled: boolean;
      depth: number; // 0.0 - 1.0
      rate: number; // Hz
      wetLevel: number; // 0.0 - 1.0
    };
    pitchShift: {
      enabled: boolean;
      semitones: number; // -12 to +12
    };
    ambience: {
      enabled: boolean;
      type: "temple" | "cosmic" | "forest" | "celestial";
      volume: number; // 0.0 - 1.0
    };
    harmonics: {
      enabled: boolean;
      layers: number; // 1-5
      detune: number; // cents
    };
  };
}

export interface AudioChunk {
  audio_base64: string;
  text: string;
  mime_type: string;
}

export class VoiceService {
  private baseUrl: string;
  private config: VoiceConfig;
  private currentSound: Audio.Sound | null = null;
  private audioQueue: AudioChunk[] = [];
  private isPlaying: boolean = false;
  private ambienceSound: Audio.Sound | null = null;
  private isAmbiencePlaying: boolean = false;

  constructor(baseUrl: string = "http://localhost:8001") {
    this.baseUrl = baseUrl;
    this.config = {
      voice: "sage",
      model: "tts-1",
      speed: 1.0,
      enabled: true,
      mysticalEffects: {
        enabled: true,
        reverb: {
          enabled: true,
          roomSize: 0.6, // Reduced from 0.8 for less bathtub effect
          damping: 0.7, // Increased for warmer, softer reverb
          wetLevel: 0.25, // Reduced from 0.4 for more subtlety
        },
        echo: {
          enabled: true,
          delay: 450, // Increased for more ethereal spacing
          feedback: 0.2, // Reduced from 0.3 for less repetition
          wetLevel: 0.12, // Reduced from 0.2 for subtlety
        },
        chorus: {
          enabled: true,
          depth: 0.2, // Reduced from 0.3 for gentler effect
          rate: 0.3, // Slower for more natural modulation
          wetLevel: 0.1, // Reduced from 0.15 for subtlety
        },
        pitchShift: {
          enabled: false,
          semitones: 0,
        },
        ambience: {
          enabled: true,
          type: "celestial",
          volume: 0.18, // Reduced from 0.3 for softer presence
        },
        harmonics: {
          enabled: true,
          layers: 2,
          detune: 12, // Reduced from 15 for less aggressive harmonics
        },
      },
    };

    // Initialize audio
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.voice_available === true;
    } catch (error) {
      console.error("Voice service health check failed:", error);
      return false;
    }
  }

  async getAvailableVoices(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`);
      return await response.json();
    } catch (error) {
      console.error("Failed to get voices:", error);
      return null;
    }
  }

  setConfig(config: Partial<VoiceConfig>) {
    const oldAmbienceConfig = this.config.mysticalEffects?.ambience;
    this.config = { ...this.config, ...config };

    // Handle ambience changes
    const newAmbienceConfig = this.config.mysticalEffects?.ambience;
    if (newAmbienceConfig && oldAmbienceConfig) {
      // If ambience type changed, restart ambience
      if (
        newAmbienceConfig.type !== oldAmbienceConfig.type ||
        newAmbienceConfig.enabled !== oldAmbienceConfig.enabled
      ) {
        if (newAmbienceConfig.enabled) {
          this.startAmbience();
        } else {
          this.stopAmbience();
        }
      }
      // If only volume changed, update volume
      else if (newAmbienceConfig.volume !== oldAmbienceConfig.volume) {
        this.updateAmbienceVolume();
      }
    }
  }

  getConfig(): VoiceConfig {
    return { ...this.config };
  }

  async speakText(text: string): Promise<void> {
    if (!this.config.enabled || !text.trim()) return;

    // Start mystical ambience
    await this.startAmbience();

    try {
      const response = await fetch(`${this.baseUrl}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: this.config.voice,
          model: this.config.model,
          speed: this.config.speed,
          mystical_effects: this.config.mysticalEffects.enabled
            ? this.config.mysticalEffects
            : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await this.playAudioFromBase64(data.audio_base64);
      } else {
        throw new Error(data.error || "TTS request failed");
      }
    } catch (error) {
      console.error("TTS error:", error);
    }
  }

  async streamTextToSpeech(
    text: string,
    onProgress?: (chunk: string) => void
  ): Promise<void> {
    if (!this.config.enabled || !text.trim()) return;

    // Start mystical ambience
    await this.startAmbience();

    try {
      const response = await fetch(`${this.baseUrl}/tts/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: this.config.voice,
          model: this.config.model,
          speed: this.config.speed,
          chunk_size: 50,
          mystical_effects: this.config.mysticalEffects.enabled
            ? this.config.mysticalEffects
            : null,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.substring(6));

                if (data.type === "audio") {
                  // Queue audio for playback
                  this.audioQueue.push({
                    audio_base64: data.audio_base64,
                    text: data.text,
                    mime_type: data.mime_type,
                  });

                  // Start playing queue if not already playing
                  if (!this.isPlaying) {
                    this.playAudioQueue();
                  }

                  if (onProgress) {
                    onProgress(data.text);
                  }
                } else if (data.type === "error") {
                  console.error("Streaming TTS error:", data.error);
                } else if (data.type === "complete") {
                  console.log("TTS streaming completed");
                }
              } catch (parseError) {
                console.error("Failed to parse streaming data:", parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Streaming TTS error:", error);
    }
  }

  // New non-blocking version that starts audio but doesn't wait for it to finish
  startStreamingTextToSpeech(
    text: string,
    onProgress?: (chunk: string) => void
  ): Promise<void> {
    // Start the streaming process but don't await its completion
    this.streamTextToSpeech(text, onProgress).catch((error) => {
      console.error("Background streaming TTS error:", error);
    });

    // Return immediately resolved promise
    return Promise.resolve();
  }

  private async playAudioQueue() {
    if (this.isPlaying || this.audioQueue.length === 0) return;

    this.isPlaying = true;

    while (this.audioQueue.length > 0) {
      const audioChunk = this.audioQueue.shift();
      if (audioChunk) {
        await this.playAudioFromBase64(audioChunk.audio_base64);
      }
    }

    this.isPlaying = false;
  }

  private async playAudioFromBase64(audioBase64: string): Promise<void> {
    try {
      // Stop current sound if playing
      if (this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }

      // Create audio URI from base64
      const audioUri = `data:audio/mpeg;base64,${audioBase64}`;

      // Load and play the audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume: 1.0 }
      );

      this.currentSound = sound;

      // Wait for audio to finish
      return new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish) {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }

  async stopSpeech(): Promise<void> {
    try {
      // Clear audio queue
      this.audioQueue = [];
      this.isPlaying = false;

      // Stop current sound
      if (this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
    } catch (error) {
      console.error("Failed to stop speech:", error);
    }
  }

  private getAmbiencePath(type: string): any {
    // For now, we'll use a programmatically generated ambient tone
    // In the future, these can be replaced with actual audio files
    const ambienceAssets = {
      temple: null, // require('../../assets/audio/ambience/temple-bells.mp3'),
      cosmic: null, // require('../../assets/audio/ambience/cosmic-wind.mp3'),
      forest: null, // require('../../assets/audio/ambience/mystical-forest.mp3'),
      celestial: require("../../assets/audio/ambience/celestial-choir.mp3"),
    };
    return ambienceAssets[type as keyof typeof ambienceAssets];
  }

  private async startAmbience(): Promise<void> {
    if (
      !this.config.mysticalEffects.enabled ||
      !this.config.mysticalEffects.ambience.enabled
    ) {
      return;
    }

    try {
      // Stop current ambience if playing
      await this.stopAmbience();

      const ambienceAsset = this.getAmbiencePath(
        this.config.mysticalEffects.ambience.type
      );

      // For now, skip ambience if no asset is available
      // The mystical effects will be handled by the backend audio processing
      if (!ambienceAsset) {
        console.log(
          `Ambience type '${this.config.mysticalEffects.ambience.type}' will be handled by backend processing`
        );
        return;
      }

      // Load and play ambient sound
      const { sound } = await Audio.Sound.createAsync(ambienceAsset, {
        shouldPlay: true,
        isLooping: true,
        volume: this.config.mysticalEffects.ambience.volume,
      });

      this.ambienceSound = sound;
      this.isAmbiencePlaying = true;
    } catch (error) {
      console.error("Failed to start ambience:", error);
    }
  }

  private async stopAmbience(): Promise<void> {
    try {
      if (this.ambienceSound) {
        await this.ambienceSound.stopAsync();
        await this.ambienceSound.unloadAsync();
        this.ambienceSound = null;
      }
      this.isAmbiencePlaying = false;
    } catch (error) {
      console.error("Failed to stop ambience:", error);
    }
  }

  private async updateAmbienceVolume(): Promise<void> {
    if (this.ambienceSound && this.isAmbiencePlaying) {
      try {
        await this.ambienceSound.setVolumeAsync(
          this.config.mysticalEffects.ambience.volume
        );
      } catch (error) {
        console.error("Failed to update ambience volume:", error);
      }
    }
  }

  async cleanup(): Promise<void> {
    await this.stopSpeech();
    await this.stopAmbience();
  }
}
