/**
 * React Hook for Voice Service Integration
 * Manages OpenAI TTS integration with streaming text
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { VoiceService, VoiceConfig } from "../services/VoiceService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VOICE_CONFIG_KEY = "oracle_voice_config";

export interface UseVoiceServiceReturn {
  voiceService: VoiceService | null;
  isVoiceEnabled: boolean;
  isVoiceHealthy: boolean;
  voiceConfig: VoiceConfig | null;
  isSpeaking: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceConfig: (config: Partial<VoiceConfig>) => void;
  speakText: (text: string) => Promise<void>;
  stopSpeech: () => Promise<void>;
  speakStreamingText: (text: string) => Promise<void>;
  startStreamingTextToSpeech: (text: string) => Promise<void>;
  recheckHealth: () => Promise<boolean>;
}

export const useVoiceService = (): UseVoiceServiceReturn => {
  const [voiceService, setVoiceService] = useState<VoiceService | null>(null);
  const [isVoiceHealthy, setIsVoiceHealthy] = useState(false);
  const [voiceConfig, setVoiceConfigState] = useState<VoiceConfig | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const initializingRef = useRef(false);

  // Load voice configuration from storage
  const loadVoiceConfig = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(VOICE_CONFIG_KEY);
      if (stored) {
        const config = JSON.parse(stored) as VoiceConfig;
        return config;
      }
    } catch (error) {
      console.error("Failed to load voice config:", error);
    }

    // Return default config
    return {
      voice: "sage" as const,
      model: "tts-1" as const,
      speed: 1.0,
      enabled: false, // Default to disabled
    };
  }, []);

  // Save voice configuration to storage
  const saveVoiceConfig = useCallback(async (config: VoiceConfig) => {
    try {
      await AsyncStorage.setItem(VOICE_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error("Failed to save voice config:", error);
    }
  }, []);

  // Initialize voice service
  const initializeVoiceService = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    try {
      const config = await loadVoiceConfig();
      setVoiceConfigState(config);

      const service = new VoiceService();
      service.setConfig(config);

      // Check if voice service is healthy
      const healthy = await service.checkHealth();
      setIsVoiceHealthy(healthy);

      // Always set the service, even if health check fails
      // This allows manual retries and the voice settings to work
      setVoiceService(service);

      if (healthy) {
        console.log("Voice service initialized successfully");
      } else {
        console.log(
          "Voice service not available - API may be down or API key missing"
        );
        console.log(
          "Retrying health check in case of temporary network issue..."
        );

        // Retry health check after a short delay
        setTimeout(async () => {
          const retryHealthy = await service.checkHealth();
          setIsVoiceHealthy(retryHealthy);
          if (retryHealthy) {
            console.log("Voice service health check succeeded on retry");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to initialize voice service:", error);
      setIsVoiceHealthy(false);
    } finally {
      initializingRef.current = false;
    }
  }, [loadVoiceConfig]);

  // Initialize on mount
  useEffect(() => {
    initializeVoiceService();
  }, [initializeVoiceService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceService) {
        voiceService.cleanup();
      }
    };
  }, [voiceService]);

  // Update voice service when config changes
  useEffect(() => {
    if (voiceService && voiceConfig) {
      voiceService.setConfig(voiceConfig);
    }
  }, [voiceService, voiceConfig]);

  const setVoiceEnabled = useCallback(
    (enabled: boolean) => {
      if (!voiceConfig) return;

      const newConfig = { ...voiceConfig, enabled };
      setVoiceConfigState(newConfig);
      saveVoiceConfig(newConfig);
    },
    [voiceConfig, saveVoiceConfig]
  );

  const setVoiceConfig = useCallback(
    (configUpdate: Partial<VoiceConfig>) => {
      if (!voiceConfig) return;

      const newConfig = { ...voiceConfig, ...configUpdate };
      setVoiceConfigState(newConfig);
      saveVoiceConfig(newConfig);
    },
    [voiceConfig, saveVoiceConfig]
  );

  const speakText = useCallback(
    async (text: string) => {
      if (!voiceService || !voiceConfig?.enabled) return;

      try {
        setIsSpeaking(true);
        await voiceService.speakText(text);
      } catch (error) {
        console.error("Failed to speak text:", error);
      } finally {
        setIsSpeaking(false);
      }
    },
    [voiceService, voiceConfig?.enabled]
  );

  const speakStreamingText = useCallback(
    async (text: string) => {
      if (!voiceService || !voiceConfig?.enabled) return;

      console.log("Speaking streaming text:", text);

      try {
        setIsSpeaking(true);
        await voiceService.streamTextToSpeech(text, (chunk) => {
          // Optional: could emit progress events here
          console.log("Speaking chunk:", chunk);
        });
      } catch (error) {
        console.error("Failed to speak streaming text:", error);
      } finally {
        setIsSpeaking(false);
      }
    },
    [voiceService, voiceConfig?.enabled]
  );

  const startStreamingTextToSpeech = useCallback(
    async (text: string) => {
      if (!voiceService || !voiceConfig?.enabled) return;

      console.log("Starting non-blocking streaming text:", text);

      try {
        setIsSpeaking(true);
        // Use the non-blocking version that starts audio but doesn't wait
        await voiceService.startStreamingTextToSpeech(text, (chunk) => {
          console.log("Speaking chunk:", chunk);
        });

        // Note: We don't set isSpeaking to false here because audio continues in background
        // The audio queue will handle the speaking state internally
      } catch (error) {
        console.error("Failed to start streaming text:", error);
        setIsSpeaking(false);
      }
    },
    [voiceService, voiceConfig?.enabled]
  );

  const stopSpeech = useCallback(async () => {
    if (!voiceService) return;

    try {
      await voiceService.stopSpeech();
      setIsSpeaking(false);
    } catch (error) {
      console.error("Failed to stop speech:", error);
    }
  }, [voiceService]);

  const recheckHealth = useCallback(async () => {
    if (!voiceService) return false;

    try {
      const healthy = await voiceService.checkHealth();
      setIsVoiceHealthy(healthy);
      return healthy;
    } catch (error) {
      console.error("Failed to recheck voice service health:", error);
      setIsVoiceHealthy(false);
      return false;
    }
  }, [voiceService]);

  return {
    voiceService,
    isVoiceEnabled: voiceConfig?.enabled ?? false,
    isVoiceHealthy,
    voiceConfig,
    isSpeaking,
    setVoiceEnabled,
    setVoiceConfig,
    speakText,
    stopSpeech,
    speakStreamingText,
    startStreamingTextToSpeech,
    recheckHealth,
  };
};
