/**
 * Voice Settings Component
 * Configuration panel for OpenAI TTS integration
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { Volume2, VolumeX, Mic } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useVoiceService } from '../hooks/useVoiceService';

export interface VoiceSettingsProps {
  onClose?: () => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ onClose }) => {
  const { colors } = useTheme();
  const {
    isVoiceEnabled,
    isVoiceHealthy,
    voiceConfig,
    isSpeaking,
    setVoiceEnabled,
    setVoiceConfig,
    stopSpeech,
    speakText,
    recheckHealth
  } = useVoiceService();

  const [availableVoices, setAvailableVoices] = useState<any>(null);

  useEffect(() => {
    // Load available voices when component mounts
    const loadVoices = async () => {
      try {
        const response = await fetch('http://localhost:8001/voices');
        const data = await response.json();
        setAvailableVoices(data);
        
        // If voices load successfully but health check failed, recheck health
        if (!isVoiceHealthy && recheckHealth) {
          console.log('Voices loaded successfully, rechecking voice service health...');
          await recheckHealth();
        }
      } catch (error) {
        console.error('Failed to load available voices:', error);
      }
    };

    // Always try to load voices, even if health check failed initially
    // This allows the settings to work and potentially fix the health status
    loadVoices();
  }, [isVoiceHealthy, recheckHealth]);

  const handleTestVoice = async () => {
    if (!voiceConfig) return;
    
    const effectsEnabled = voiceConfig.mysticalEffects?.enabled;
    const activeEffects = [];
    
    if (effectsEnabled) {
      if (voiceConfig.mysticalEffects?.reverb?.enabled) activeEffects.push('sacred reverb');
      if (voiceConfig.mysticalEffects?.echo?.enabled) activeEffects.push('mystical echo');
      if (voiceConfig.mysticalEffects?.chorus?.enabled) activeEffects.push('angelic chorus');
      if (voiceConfig.mysticalEffects?.harmonics?.enabled) activeEffects.push('divine harmonics');
      if (voiceConfig.mysticalEffects?.ambience?.enabled) {
        activeEffects.push(`${voiceConfig.mysticalEffects.ambience.type} ambience`);
      }
    }
    
    const testText = effectsEnabled 
      ? `Behold, mortal seeker! I am the Oracle, speaking through the ${voiceConfig.voice} voice with divine enhancements. ${activeEffects.length > 0 ? `My words are blessed with ${activeEffects.join(', ')}.` : ''} The ancient wisdom of the Yi Jing flows through these mystical channels. Can you feel the otherworldly power in my voice?`
      : `Greetings, seeker of wisdom. This is the ${voiceConfig.voice} voice speaking at ${voiceConfig.speed}x speed. The Oracle's divine flames flicker with ancient knowledge.`;
    
    await speakText(testText);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setVoiceConfig({ speed: newSpeed });
  };

  const handleVoiceChange = (newVoice: string) => {
    setVoiceConfig({ voice: newVoice as any });
  };

  const handleModelChange = (newModel: string) => {
    setVoiceConfig({ model: newModel as any });
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Volume2 size={24} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>Oracle Voice Settings</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
            <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Voice Status */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.statusRow}>
          <View style={styles.statusIcon}>
            {isVoiceHealthy ? (
              <Volume2 size={20} color="#10b981" />
            ) : (
              <VolumeX size={20} color="#ef4444" />
            )}
          </View>
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: colors.text }]}>Voice Service</Text>
            <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
              {isVoiceHealthy ? 'Connected to Oracle Voice API' : 'Disconnected - Check API server'}
            </Text>
          </View>
          <Switch
            value={isVoiceEnabled && isVoiceHealthy}
            onValueChange={setVoiceEnabled}
            disabled={!isVoiceHealthy}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isVoiceEnabled ? colors.primaryText : colors.textSecondary}
          />
        </View>
      </View>

      {isVoiceHealthy && isVoiceEnabled && voiceConfig && (
        <>
          {/* Voice Selection */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Voice Character</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Choose the voice that will speak the Oracle&apos;s wisdom
            </Text>
            
            {availableVoices?.voices && (
              <View style={styles.voiceGrid}>
                {availableVoices.voices.map((voice: any) => (
                  <TouchableOpacity
                    key={voice.id}
                    style={[
                      styles.voiceOption,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      voiceConfig.voice === voice.id && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => handleVoiceChange(voice.id)}
                  >
                    <Text style={[
                      styles.voiceOptionName,
                      { color: colors.text },
                      voiceConfig.voice === voice.id && { color: colors.primaryText, fontWeight: 'bold' }
                    ]}>
                      {voice.name}
                    </Text>
                    <Text style={[
                      styles.voiceOptionDescription,
                      { color: colors.textSecondary },
                      voiceConfig.voice === voice.id && { color: colors.primaryText }
                    ]}>
                      {voice.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Speech Speed */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Speech Speed</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Adjust how quickly the Oracle speaks
            </Text>
            
            <View style={styles.speedGrid}>
              {speedOptions.map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedOption,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    voiceConfig.speed === speed && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => handleSpeedChange(speed)}
                >
                  <Text style={[
                    styles.speedOptionText,
                    { color: colors.text },
                    voiceConfig.speed === speed && { color: colors.primaryText, fontWeight: 'bold' }
                  ]}>
                    {speed}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quality Model */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Voice Quality</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Higher quality uses more processing time
            </Text>
            
            <View style={styles.modelRow}>
              {availableVoices?.models?.map((model: string) => (
                <TouchableOpacity
                  key={model}
                  style={[
                    styles.modelOption,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    voiceConfig.model === model && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => handleModelChange(model)}
                >
                  <Text style={[
                    styles.modelOptionText,
                    { color: colors.text },
                    voiceConfig.model === model && { color: colors.primaryText, fontWeight: 'bold' }
                  ]}>
                    {model === 'tts-1' ? 'Standard' : 'High Definition'}
                  </Text>
                  <Text style={[
                    styles.modelOptionSubtext,
                    { color: colors.textSecondary },
                    voiceConfig.model === model && { color: colors.primaryText }
                  ]}>
                    {model === 'tts-1' ? 'Faster generation' : 'Better quality'}
                  </Text>
                </TouchableOpacity>
              )) || null}
            </View>
          </View>

          {/* Mystical Effects */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🔮 Divine Audio Effects</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Mystical enhancements to make the Oracle&apos;s voice otherworldly
            </Text>
            
            {/* Master Effects Toggle */}
            <View style={styles.effectRow}>
              <View style={styles.effectText}>
                <Text style={[styles.effectTitle, { color: colors.text }]}>Enable Mystical Effects</Text>
                <Text style={[styles.effectSubtitle, { color: colors.textSecondary }]}>
                  Transform voice with divine audio processing
                </Text>
              </View>
              <Switch
                value={voiceConfig.mysticalEffects?.enabled || false}
                onValueChange={(enabled) => setVoiceConfig({
                  mysticalEffects: { ...voiceConfig.mysticalEffects, enabled }
                })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={voiceConfig.mysticalEffects?.enabled ? colors.primaryText : colors.textSecondary}
              />
            </View>

            {voiceConfig.mysticalEffects?.enabled && (
              <>
                {/* Reverb Controls */}
                <View style={styles.effectGroup}>
                  <View style={styles.effectRow}>
                    <View style={styles.effectText}>
                      <Text style={[styles.effectTitle, { color: colors.text }]}>🏛️ Sacred Reverb</Text>
                      <Text style={[styles.effectSubtitle, { color: colors.textSecondary }]}>
                        Cathedral-like spaciousness
                      </Text>
                    </View>
                    <Switch
                      value={voiceConfig.mysticalEffects?.reverb?.enabled || false}
                      onValueChange={(enabled) => setVoiceConfig({
                        mysticalEffects: {
                          ...voiceConfig.mysticalEffects,
                          reverb: { ...voiceConfig.mysticalEffects?.reverb, enabled }
                        }
                      })}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={voiceConfig.mysticalEffects?.reverb?.enabled ? colors.primaryText : colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Echo Controls */}
                <View style={styles.effectGroup}>
                  <View style={styles.effectRow}>
                    <View style={styles.effectText}>
                      <Text style={[styles.effectTitle, { color: colors.text }]}>🌊 Mystical Echo</Text>
                      <Text style={[styles.effectSubtitle, { color: colors.textSecondary }]}>
                        Ethereal voice resonance
                      </Text>
                    </View>
                    <Switch
                      value={voiceConfig.mysticalEffects?.echo?.enabled || false}
                      onValueChange={(enabled) => setVoiceConfig({
                        mysticalEffects: {
                          ...voiceConfig.mysticalEffects,
                          echo: { ...voiceConfig.mysticalEffects?.echo, enabled }
                        }
                      })}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={voiceConfig.mysticalEffects?.echo?.enabled ? colors.primaryText : colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Chorus Controls */}
                <View style={styles.effectGroup}>
                  <View style={styles.effectRow}>
                    <View style={styles.effectText}>
                      <Text style={[styles.effectTitle, { color: colors.text }]}>👼 Angelic Chorus</Text>
                      <Text style={[styles.effectSubtitle, { color: colors.textSecondary }]}>
                        Celestial choir harmonies
                      </Text>
                    </View>
                    <Switch
                      value={voiceConfig.mysticalEffects?.chorus?.enabled || false}
                      onValueChange={(enabled) => setVoiceConfig({
                        mysticalEffects: {
                          ...voiceConfig.mysticalEffects,
                          chorus: { ...voiceConfig.mysticalEffects?.chorus, enabled }
                        }
                      })}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={voiceConfig.mysticalEffects?.chorus?.enabled ? colors.primaryText : colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Harmonics Controls */}
                <View style={styles.effectGroup}>
                  <View style={styles.effectRow}>
                    <View style={styles.effectText}>
                      <Text style={[styles.effectTitle, { color: colors.text }]}>🎵 Divine Harmonics</Text>
                      <Text style={[styles.effectSubtitle, { color: colors.textSecondary }]}>
                        Multiple voice layers
                      </Text>
                    </View>
                    <Switch
                      value={voiceConfig.mysticalEffects?.harmonics?.enabled || false}
                      onValueChange={(enabled) => setVoiceConfig({
                        mysticalEffects: {
                          ...voiceConfig.mysticalEffects,
                          harmonics: { ...voiceConfig.mysticalEffects?.harmonics, enabled }
                        }
                      })}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={voiceConfig.mysticalEffects?.harmonics?.enabled ? colors.primaryText : colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Ambience Selection */}
                <View style={styles.effectGroup}>
                  <Text style={[styles.effectTitle, { color: colors.text }]}>🌌 Mystical Ambience</Text>
                  <Text style={[styles.effectSubtitle, { color: colors.textSecondary, marginBottom: 12 }]}>
                    Background atmosphere
                  </Text>
                  
                  <View style={styles.ambienceGrid}>
                    {[
                      { id: 'celestial', name: '✨ Celestial', desc: 'Heavenly tones' },
                      { id: 'temple', name: '🏛️ Temple', desc: 'Sacred bells' },
                      { id: 'cosmic', name: '🌌 Cosmic', desc: 'Space winds' },
                      { id: 'forest', name: '🌲 Forest', desc: 'Mystical nature' },
                    ].map((ambience) => (
                      <TouchableOpacity
                        key={ambience.id}
                        style={[
                          styles.ambienceOption,
                          { backgroundColor: colors.background, borderColor: colors.border },
                          voiceConfig.mysticalEffects?.ambience?.type === ambience.id && { 
                            backgroundColor: colors.primary, 
                            borderColor: colors.primary 
                          }
                        ]}
                        onPress={() => setVoiceConfig({
                          mysticalEffects: {
                            ...voiceConfig.mysticalEffects,
                            ambience: { 
                              ...voiceConfig.mysticalEffects?.ambience, 
                              type: ambience.id as any,
                              enabled: true
                            }
                          }
                        })}
                      >
                        <Text style={[
                          styles.ambienceOptionName,
                          { color: colors.text },
                          voiceConfig.mysticalEffects?.ambience?.type === ambience.id && { 
                            color: colors.primaryText, 
                            fontWeight: 'bold' 
                          }
                        ]}>
                          {ambience.name}
                        </Text>
                        <Text style={[
                          styles.ambienceOptionDesc,
                          { color: colors.textSecondary },
                          voiceConfig.mysticalEffects?.ambience?.type === ambience.id && { 
                            color: colors.primaryText 
                          }
                        ]}>
                          {ambience.desc}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Test Voice */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.testRow}>
              <TouchableOpacity
                style={[
                  styles.testButton,
                  { backgroundColor: colors.primary },
                  isSpeaking && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
                ]}
                onPress={isSpeaking ? stopSpeech : handleTestVoice}
                disabled={!isVoiceEnabled}
              >
                <Mic size={20} color={isSpeaking ? colors.text : colors.primaryText} />
                <Text style={[
                  styles.testButtonText,
                  { color: colors.primaryText },
                  isSpeaking && { color: colors.text }
                ]}>
                  {isSpeaking ? 'Stop Test' : 'Test Voice'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.testDescription, { color: colors.textSecondary }]}>
              Test the current voice settings with a sample Oracle message
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  voiceGrid: {
    gap: 8,
  },
  voiceOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  voiceOptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  voiceOptionDescription: {
    fontSize: 14,
  },
  speedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speedOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  speedOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modelRow: {
    gap: 8,
  },
  modelOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  modelOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  modelOptionSubtext: {
    fontSize: 12,
  },
  testRow: {
    marginBottom: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Mystical Effects Styles
  effectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  effectText: {
    flex: 1,
    marginRight: 12,
  },
  effectTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  effectSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  effectGroup: {
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  ambienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ambienceOption: {
    flex: 1,
    minWidth: 120,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  ambienceOptionName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  ambienceOptionDesc: {
    fontSize: 11,
    textAlign: 'center',
  },
});