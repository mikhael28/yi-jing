import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, BookOpen, Pin, PenTool, X, Circle, ChevronDown, ChevronRight, Database, Volume2, VolumeX } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './contexts/ThemeContext';
import { 
  SettingsDrawer, 
  HexagramList, 
  useDrawerAnimations, 
  useStreamingAnimation, 
  TorchFlame, 
  DivineLines,
  useDivineLineAnimations,
  HexagramSymbol
} from './components';
import { HexagramDetail } from './components/hexagram-detail';
import DaoComponent from './components/dao-component';
import GraphRAGComponent from './components/rag-query-component';
import { findHexagramByBinary } from 'yi-jing-oracle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVoiceService } from './hooks/useVoiceService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  role: 'user' | 'oracle';
  timestamp: Date;
}

interface Consultation {
  id: string;
  question: string;
  answer: string;
  hexagram?: any;
  ragResponse?: string;
  timestamp: Date;
}

export default function OracleScreen() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [ragResponse, setRagResponse] = useState('');
  const [isLoadingRag, setIsLoadingRag] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'yijing' | 'dao' | 'journal' | 'rag'>('yijing');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showDivineLines, setShowDivineLines] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<Consultation[]>([]);
  const [hasActiveConsultation, setHasActiveConsultation] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [expandedJournalEntries, setExpandedJournalEntries] = useState<Set<string>>(new Set());
  const [selectedHexagram, setSelectedHexagram] = useState<any>(null);
  const [showHexagramDetail, setShowHexagramDetail] = useState(false);
  const [selectedYiJingHexagram, setSelectedYiJingHexagram] = useState<any>(null);
  const [showYiJingHexagramDetail, setShowYiJingHexagramDetail] = useState(false);
  const [currentDivinationHexagram, setCurrentDivinationHexagram] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors, isDark } = useTheme();
  
  // Use extracted animation hooks
  const {
    drawerTranslateY,
    settingsTranslateX,
    openDrawer: animateOpenDrawer,
    closeDrawer: animateCloseDrawer,
    openSettings: animateOpenSettings,
    closeSettings: animateCloseSettings,
  } = useDrawerAnimations();
  
  // Animation values for streaming intensity
  const torchIntensity = useRef(new Animated.Value(0.3)).current;
  const flameIntensity = useRef(new Animated.Value(0.3)).current;
  
  // Use streaming animation hook
  useStreamingAnimation(isStreaming, torchIntensity, flameIntensity);
  
  // Use divine lines animation hook
  const { divineLines, isGeneratingLines, lineAnimations, generateDivineLines } = useDivineLineAnimations();
  
  // Voice service hook
  const { 
    isVoiceEnabled, 
    isVoiceHealthy, 
    isSpeaking, 
    startStreamingTextToSpeech,
    stopSpeech,
    recheckHealth
  } = useVoiceService();

  // Load consultation history on component mount
  useEffect(() => {
    loadConsultationHistory();
  }, []);

  const loadConsultationHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('consultationHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsultationHistory(parsed.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading consultation history:', error);
    }
  };

  const saveConsultationHistory = async (consultations: Consultation[]) => {
    try {
      await AsyncStorage.setItem('consultationHistory', JSON.stringify(consultations));
    } catch (error) {
      console.error('Error saving consultation history:', error);
    }
  };

  const saveConsultation = async (question: string, answer: string, hexagram?: any, ragResponse?: string) => {
    const consultation: Consultation = {
      id: Date.now().toString(),
      question,
      answer,
      hexagram,
      ragResponse,
      timestamp: new Date(),
    };

    const updatedHistory = [consultation, ...consultationHistory];
    setConsultationHistory(updatedHistory);
    setCurrentConsultation(consultation);
    await saveConsultationHistory(updatedHistory);
  };

  const queryRAGForHexagram = async (hexagram: any): Promise<string> => {
    try {
      setIsLoadingRag(true);
      const ragQuery = `The I-Ching has returned the hexagram ${hexagram.number} with the meaning "${hexagram.description}" - are there any quotes in your dataset that resonate with this? Please return one, with the author attributed. After that quote, you can include additional commentary.`;
      
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ragQuery,
          method: 'global',
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.response || 'No response received from RAG server.';
      } else {
        console.error('RAG query failed:', data.error);
        return 'Unable to retrieve Western philosophical perspective at this time.';
      }
    } catch (error) {
      console.error('RAG query error:', error);
      return 'Connection to wisdom archives unavailable.';
    } finally {
      setIsLoadingRag(false);
    }
  };

  const deleteAllJournalRecords = async () => {
    try {
      await AsyncStorage.removeItem('consultationHistory');
      setConsultationHistory([]);
      setCurrentConsultation(null);
      setExpandedJournalEntries(new Set()); // Clear expanded entries when deleting all records
      console.log('All journal records deleted');
    } catch (error) {
      console.error('Error deleting journal records:', error);
    }
  };

  const toggleJournalEntry = (entryId: string) => {
    setExpandedJournalEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const viewHexagramDetail = (hexagram: any) => {
    setSelectedHexagram(hexagram);
    setShowHexagramDetail(true);
  };

  const closeHexagramDetail = () => {
    setShowHexagramDetail(false);
    setSelectedHexagram(null);
  };

  const viewYiJingHexagramDetail = (hexagram: any) => {
    setSelectedYiJingHexagram(hexagram);
    setShowYiJingHexagramDetail(true);
  };

  const closeYiJingHexagramDetail = () => {
    setShowYiJingHexagramDetail(false);
    setSelectedYiJingHexagram(null);
  };

  const openHexagramDrawer = (hexagram: any) => {
    // Set active tab to journal if hexagram exists in consultation history
    if (consultationHistory.some(c => c.hexagram?.number === hexagram?.number)) {
      setActiveTab('journal');
      setSelectedHexagram(hexagram);
      setShowHexagramDetail(true);
    } else {
      // Otherwise open Yi Jing tab
      setActiveTab('yijing');
      setSelectedYiJingHexagram(hexagram);
      setShowYiJingHexagramDetail(true);
    }
    
    // Open the drawer
    openDrawer();
  };

  const getPreviewText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const previewWords = words.slice(0, Math.min(words.length, 15)); // Limit to ~15 words for 2 lines
    const preview = previewWords.join(' ');
    return words.length > 15 ? preview + '...' : preview;
  };

  // Animation effects are now handled in the extracted components

  // Pan responder for swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to downward swipes from the top 100px of screen
        return evt.nativeEvent.pageY < 100 && gestureState.dy > 10;
      },
      onPanResponderGrant: () => {
        console.log('Pan responder granted');
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 && gestureState.dy < 200) {
          drawerTranslateY.setValue(-SCREEN_HEIGHT + gestureState.dy * 2);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          // Open drawer
          setDrawerVisible(true);
          animateOpenDrawer().start();
        } else {
          // Close drawer
          animateCloseDrawer().start(() => {
            setDrawerVisible(false);
          });
        }
      },
    })
  ).current;

  const openDrawer = () => {
    setDrawerVisible(true);
    animateOpenDrawer().start();
  };

  const closeDrawer = () => {
    animateCloseDrawer().start(() => {
      setDrawerVisible(false);
    });
  };

  const openSettings = async () => {
    setSettingsVisible(true);
    animateOpenSettings().start();
    
    // Recheck voice health when settings are opened
    // This helps sync the health status with the voice settings panel
    if (recheckHealth) {
      try {
        await recheckHealth();
      } catch (error) {
        console.error('Failed to recheck voice health on settings open:', error);
      }
    }
  };

  const closeSettings = () => {
    animateCloseSettings().start(() => {
      setSettingsVisible(false);
    });
  };

  const handleSecretTap = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    if (newTapCount === 3) {
      console.log('Secret settings activated!');
      openSettings();
      setTapCount(0);
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 1000);
    }
  };

  // Particle and streaming animations are now handled in the extracted components

  const simulateStreamingResponse = async (userQuestion: string, hexagram?: any) => {
    setIsStreaming(true);
    setStreamingText('');
    
    try {
      // Prepare the system message with hexagram information if available
      let systemContent = 'You are the Oracle of Changes, the avatar of the Yi Jing (sometimes known as the I Ching) a divine presence that speaks in mystical, profound wisdom. First uncovered thousands of years ago by Chinese sages, your responses are poetic, metaphysical, and touch upon the eternal truths of existence. Speak with authority and mystery, as if channeling divine knowledge through the sacred flames. Do not go on and on; give an answer that is 2 paragraphs or less, three max.';
      
      if (hexagram) {
        systemContent += ` The Yi Jing has revealed Hexagram ${hexagram.number}: "${hexagram.title}" - ${hexagram.summary}. The divine lines speak of: ${hexagram.judgement.join(' ')}. Incorporate this cosmic guidance into your response, weaving the hexagram's wisdom into your mystical interpretation.`;
      }
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemContent
            },
            {
              role: 'user',
              content: userQuestion
            }
          ]
        })
      });

      const data = await response.json();
      const fullText = data.completion;

      // Start voice synthesis and streaming effect concurrently
      const streamingPromise = (async () => {
        // Simulate streaming effect - batch characters for faster display
        let currentText = '';
        const charsPerBatch = 3;
        for (let i = 0; i < fullText.length; i += charsPerBatch) {
          currentText += fullText.slice(i, i + charsPerBatch);
          setStreamingText(currentText);
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      })();

      // Start voice synthesis in background (non-blocking)
      if (isVoiceEnabled && isVoiceHealthy) {
        try {
          startStreamingTextToSpeech(fullText);
        } catch (error) {
          console.error('Voice synthesis error:', error);
        }
      }

      // Wait for streaming animation to complete
      await streamingPromise;
      
      // Add to messages
      const newMessage: Message = {
        id: Date.now().toString(),
        text: fullText,
        role: 'oracle',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setStreamingText('');
    
      
      // Query RAG for additional wisdom if hexagram is available
      let ragResponseText = '';
      // if (hexagram) {
      //   try {
      //     ragResponseText = await queryRAGForHexagram(hexagram);
      //     setRagResponse(ragResponseText);
      //   } catch (error) {
      //     console.error('Failed to get RAG response:', error);
      //     ragResponseText = '';
      //   }
      // }
      
      // Save the consultation to history with RAG response
      await saveConsultation(userQuestion, fullText, hexagram, ragResponseText);
      setHasActiveConsultation(true);
      setCurrentDivinationHexagram(hexagram);
      
    } catch (error) {
      console.error('Oracle error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'The sacred flames flicker... The connection to the divine realm has been momentarily severed. Please seek wisdom again.',
        role: 'oracle',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error consultation too
      await saveConsultation(userQuestion, errorMessage.text, hexagram, '');
      setHasActiveConsultation(true);
      setCurrentDivinationHexagram(hexagram);
    } finally {
      setIsStreaming(false);
    }
  };

  const generateHexagramFromLines = (lines: { broken: boolean }[]) => {
    // Convert divine lines to binary string for hexagram lookup
    // strong/solid = 1, weak/broken = 0
    const binaryString = lines.map(line => line.broken ? '0' : '1').join('');
    
    try {
      const hexagram = findHexagramByBinary(binaryString);
      return hexagram;
    } catch (error) {
      console.error('Error finding hexagram:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || isStreaming) return;
    
    // Show divine lines and start generation
    setShowDivineLines(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const questionToProcess = question;
    setQuestion('');
    
    try {
      // Generate divine lines first and get them immediately
      const generatedLines = await generateDivineLines();
      
      if (generatedLines && generatedLines.length === 6) {
        const hexagram = generateHexagramFromLines(generatedLines);
        
        // Wait for animation to complete before sending request
        setTimeout(() => {
          // Send to streaming response with hexagram data
          simulateStreamingResponse(questionToProcess, hexagram);
        }, 3000); // Wait for divine lines animation to complete
      } else {
        // Fallback without hexagram if generation failed
        simulateStreamingResponse(questionToProcess);
      }
      
      // Keep divine lines visible - don't hide them
      
    } catch (error) {
      console.error('Error generating divine lines:', error);
      simulateStreamingResponse(questionToProcess);
      setShowDivineLines(false);
    }
  };

  const startNewConsultation = () => {
    setMessages([]);
    setStreamingText('');
    setRagResponse('');
    setQuestion('');
    setHasActiveConsultation(false);
    setCurrentConsultation(null);
    setShowDivineLines(false);
    setCurrentDivinationHexagram(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'yijing':
        if (showYiJingHexagramDetail && selectedYiJingHexagram) {
          return (
            <View style={styles.tabContent}>
              {/* Back button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={closeYiJingHexagramDetail}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#1a202c', '#2d3748']}
                  style={styles.backButtonGradient}
                >
                  <ChevronDown 
                    size={20} 
                    color="#e2e8f0" 
                    style={{ transform: [{ rotate: '90deg' }] }} 
                  />
                  <Text style={styles.backButtonText}>Back to Hexagrams</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <HexagramDetail hexagram={selectedYiJingHexagram} />
            </View>
          );
        }
        
        return (
          <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabContentContainer}>
            <Text style={styles.tabTitle}>Yi Jing - Book of Changes</Text>
            <Text style={styles.tabDescription}>
              The ancient Chinese divination text, revealing the cosmic patterns of change and transformation.
            </Text>
            <HexagramList onHexagramSelect={viewYiJingHexagramDetail} />
            
          </ScrollView>
        );
      case 'dao':
        return <DaoComponent />;
      case 'rag':
        return (
          <View style={styles.tabContent}>
            <GraphRAGComponent />
          </View>
        );
      case 'journal':
        if (showHexagramDetail && selectedHexagram) {
          return (
            <View style={styles.tabContent}>
              {/* Back button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={closeHexagramDetail}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#1a202c', '#2d3748']}
                  style={styles.backButtonGradient}
                >
                  <ChevronDown 
                    size={20} 
                    color="#e2e8f0" 
                    style={{ transform: [{ rotate: '90deg' }] }} 
                  />
                  <Text style={styles.backButtonText}>Back to Journal</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <HexagramDetail hexagram={selectedHexagram} />
            </View>
          );
        }
        
        return (
          <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabContentContainer}>
            <Text style={styles.tabTitle}>Sacred Journal</Text>
            <Text style={styles.tabDescription}>
              Your consultations with the Oracle and divine revelations.
            </Text>
            
            <View style={styles.journalHistory}>
              <Text style={styles.journalHistoryTitle}>Oracle Consultations</Text>
              {consultationHistory.length > 0 ? (
                consultationHistory.map((consultation) => {
                  const isExpanded = expandedJournalEntries.has(consultation.id);
                  return (
                    <TouchableOpacity
                      key={consultation.id}
                      style={[styles.journalHistoryItem, styles.journalChevronItem]}
                      onPress={() => toggleJournalEntry(consultation.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.journalChevronHeader}>
                        <View style={styles.journalChevronContent}>
                          <Text style={styles.journalHistoryDate}>
                            {consultation.timestamp.toLocaleDateString()} at {consultation.timestamp.toLocaleTimeString()}
                          </Text>
                          <Text style={[styles.journalHistoryText, { fontWeight: 'bold', marginBottom: 4 }]}>
                            &ldquo;{consultation.question}&rdquo;
                          </Text>
                          {consultation.hexagram && (
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                viewHexagramDetail(consultation.hexagram);
                              }}
                              style={styles.hexagramClickable}
                              activeOpacity={0.7}
                            >
                              <Text style={[styles.journalHistoryText, styles.hexagramLink]}>
                                ✦ Hexagram {consultation.hexagram.number}: {consultation.hexagram.title} ✦
                              </Text>
                            </TouchableOpacity>
                          )}
                          {!isExpanded && (
                            <Text style={[styles.journalHistoryText, { fontSize: 12, opacity: 0.7 }]}>
                              {getPreviewText(consultation.answer)}
                            </Text>
                          )}
                        </View>
                        <View style={styles.journalChevronIcon}>
                          {isExpanded ? (
                            <ChevronDown size={20} color={colors.textSecondary} />
                          ) : (
                            <ChevronRight size={20} color={colors.textSecondary} />
                          )}
                        </View>
                      </View>
                      
                      {isExpanded && (
                        <View style={styles.journalExpandedContent}>
                          <Text style={styles.journalHistoryText}>
                            {consultation.answer}
                          </Text>
                          {consultation.ragResponse && (
                            <View style={[styles.ragResponseHistory, { marginTop: 12 }]}>
                              <Text style={[styles.ragHeaderHistory, { color: colors.text }]}>
                                ✧ Western Philosophical Perspective ✧
                              </Text>
                              <Text style={[styles.ragTextHistory, { color: colors.textSecondary }]}>
                                {consultation.ragResponse}
                              </Text>
                            </View>
                          )}
                          {consultation.hexagram && (
                            <TouchableOpacity
                              onPress={() => viewHexagramDetail(consultation.hexagram)}
                              style={[styles.hexagramClickable, { marginTop: 12 }]}
                              activeOpacity={0.7}
                            >
                              <Text style={[styles.journalHistoryText, styles.hexagramLink]}>
                                ✧ View Hexagram {consultation.hexagram.number} Details ✧
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={[styles.journalHistoryText, { textAlign: 'center', fontStyle: 'italic' }]}>
                  No consultations yet. Seek wisdom from the Oracle to begin your spiritual journey.
                </Text>
              )}
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  // Divine lines functionality moved to DivineLines component


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} {...panResponder.panHandlers}>
      <LinearGradient
        colors={isDark ? ['#000000', '#1a1a1a', '#000000'] : ['#ffffff', '#f5f5f5', '#ffffff']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Secret Settings Trigger - Top Left */}
      <TouchableOpacity 
        style={[styles.secretTrigger, { top: insets.top + 20 }]} 
        onPress={handleSecretTap}
        activeOpacity={1}
        testID="secret-settings-trigger"
      >
        <View style={styles.secretTriggerInner} />
      </TouchableOpacity>
      
      {/* Voice Status Indicator - Top Right */}
      {(isVoiceEnabled || isSpeaking) && (
        <TouchableOpacity 
          style={[styles.voiceIcon, { top: insets.top + 20, right: 80 }]} 
          onPress={isSpeaking ? stopSpeech : undefined}
          activeOpacity={0.7}
        >
          <View style={[styles.voiceIconInner, { backgroundColor: isSpeaking ? colors.primary : colors.surface }]}>
            {isSpeaking ? (
              <VolumeX size={20} color={colors.primaryText} />
            ) : isVoiceHealthy ? (
              <Volume2 size={20} color={colors.text} />
            ) : (
              <VolumeX size={20} color={colors.textSecondary} />
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Orb Icon - Top Right */}
      <TouchableOpacity 
        style={[styles.orbIcon, { top: insets.top + 20 }]} 
        onPress={openDrawer}
        activeOpacity={0.7}
      >
        <View style={styles.orbIconInner}>
          <Circle size={24} color={colors.text} fill={colors.surface} />
        </View>
      </TouchableOpacity>

      {/* Sacred Geometry Background Pattern */}
      <View style={styles.sacredGeometry}>
        {[...Array(3)].map((_, i) => (
          <View
            key={`geometry-${i}`}
            style={[
              styles.geometryCircle,
              {
                width: 200 + i * 100,
                height: 200 + i * 100,
                opacity: 0.05,
              },
            ]}
          />
        ))}
      </View>

      {/* Divine Torch or Prometheus Flame */}
      <View style={styles.torchContainer}>
        <TorchFlame
          isDark={isDark}
          // animationStyle={animationStyle}
          torchIntensity={torchIntensity}
          // flameIntensity={flameIntensity}
          colors={colors}
        />
        
        {/* Divine Lines superimposed over bottom half of torch */}
        {showDivineLines && (
          <View style={styles.divineLineOverlay}>
            <DivineLines 
              colors={colors}
              divineLines={divineLines}
              isGeneratingLines={isGeneratingLines}
              lineAnimations={lineAnimations}
              onGenerate={generateDivineLines}
            />
          </View>
        )}
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.messagesContainer}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.oracleMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' ? { color: colors.text } : { color: colors.textSecondary, fontStyle: 'italic' },
                ]}
              >
                {message.text}
              </Text>
            </View>
          ))}
          
          {streamingText && (
            <View style={[styles.messageContainer, { backgroundColor: colors.messageOracle, borderColor: colors.border }]}>
              <Text style={[styles.messageText, { color: colors.textSecondary, fontStyle: 'italic' }]}>
                {streamingText}
              </Text>
            </View>
          )}
          
          {/* RAG Response Display */}
          {(isLoadingRag || ragResponse) && (
            <View style={[styles.messageContainer, styles.ragMessageContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.ragHeader, { color: colors.text }]}>
                ✧ Western Philosophical Perspective ✧
              </Text>
              {isLoadingRag ? (
                <View style={styles.ragLoadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.ragLoadingText, { color: colors.textSecondary }]}>
                    Consulting the archives of Western wisdom...
                  </Text>
                </View>
              ) : (
                <Text style={[styles.ragText, { color: colors.textSecondary }]}>
                  {ragResponse}
                </Text>
              )}
            </View>
          )}
          
          {/* Hexagram Display - appears after oracle response is complete */}
          {currentDivinationHexagram && !isStreaming && !isLoadingRag && (
            <TouchableOpacity
              style={[styles.messageContainer, styles.hexagramMessageContainer, { backgroundColor: colors.messageOracle, borderColor: colors.border }]}
              onPress={() => openHexagramDrawer(currentDivinationHexagram)}
              activeOpacity={0.7}
            >
              <View style={styles.hexagramBubbleContent}>
                <Text style={[styles.hexagramBubbleHeader, { color: colors.text }]}>
                  ✦ The Sacred Hexagram ✦
                </Text>
                <View style={styles.hexagramBubbleSymbolContainer}>
                  <HexagramSymbol 
                    hexagram={currentDivinationHexagram} 
                    size="medium" 
                    isDark={isDark}
                  />
                </View>
                <Text style={[styles.hexagramBubbleTitle, { color: colors.textSecondary }]}>
                  {currentDivinationHexagram.number}. {currentDivinationHexagram.title}
                </Text>
                <Text style={[styles.hexagramBubbleSubtitle, { color: colors.textSecondary }]}>
                  {currentDivinationHexagram.chinese_name}
                </Text>
                <Text style={[styles.hexagramBubblePrompt, { color: colors.primary }]}>
                  Tap to explore the divine wisdom
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          <BlurView intensity={80} style={styles.inputBlur}>
            {hasActiveConsultation ? (
              // Show "Consult Oracle Again" button after a consultation
              <View style={styles.consultAgainWrapper}>
                <TouchableOpacity
                  style={[styles.consultAgainButton, { backgroundColor: colors.primary }]}
                  onPress={startNewConsultation}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.consultAgainText, { color: colors.primaryText }]}>
                    Consult the Oracle Again
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Show normal input interface
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Seek wisdom from the Oracle..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  maxLength={500}
                  editable={!isStreaming}
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: colors.primary }, (!question.trim() || isStreaming) && styles.sendButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!question.trim() || isStreaming}
                >
                  {isStreaming ? (
                    <ActivityIndicator size="small" color={colors.primaryText} />
                  ) : (
                    <Send size={20} color={colors.primaryText} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </BlurView>
        </View>
      </KeyboardAvoidingView>

      {/* Drawer */}
      {drawerVisible && (
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY: drawerTranslateY }],
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#000000', '#1a1a1a', '#000000'] : ['#ffffff', '#f5f5f5', '#ffffff']}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* Drawer Header */}
          <View style={[styles.drawerHeader, { paddingTop: insets.top + 20 }]}>
            <Text style={[styles.drawerTitle, { color: colors.text }]}>Sacred Knowledge</Text>
            <TouchableOpacity onPress={closeDrawer} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabNavigation}>
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: colors.surface }, activeTab === 'yijing' && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('yijing')}
            >
              <BookOpen size={20} color={activeTab === 'yijing' ? colors.primaryText : colors.text} />
              <Text style={[styles.tabText, { color: colors.text }, activeTab === 'yijing' && { color: colors.primaryText }]}>Yi Jing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: colors.surface }, activeTab === 'dao' && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('dao')}
            >
              <Pin size={20} color={activeTab === 'dao' ? colors.primaryText : colors.text} />
              <Text style={[styles.tabText, { color: colors.text }, activeTab === 'dao' && { color: colors.primaryText }]}>Dao</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: colors.surface }, activeTab === 'rag' && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('rag')}
            >
              <Database size={20} color={activeTab === 'rag' ? colors.primaryText : colors.text} />
              <Text style={[styles.tabText, { color: colors.text }, activeTab === 'rag' && { color: colors.primaryText }]}>RAG</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: colors.surface }, activeTab === 'journal' && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('journal')}
            >
              <PenTool size={20} color={activeTab === 'journal' ? colors.primaryText : colors.text} />
              <Text style={[styles.tabText, { color: colors.text }, activeTab === 'journal' && { color: colors.primaryText }]}>Journal</Text>
            </TouchableOpacity>
            
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </Animated.View>
      )}
      
      {/* Settings Drawer */}
      <SettingsDrawer
        settingsVisible={settingsVisible}
        settingsTranslateX={settingsTranslateX}
        closeSettings={closeSettings}
        insets={insets}
        onDeleteAllJournalRecords={deleteAllJournalRecords}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  sacredGeometry: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geometryCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 1000,
  },
  torchContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
    left: 0,
    right: 0,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  divineLineOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  messagesContainer: {
    flex: 1,
    marginTop: SCREEN_HEIGHT * 0.35,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  oracleMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  oracleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputBlur: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    width: 40,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  consultAgainWrapper: {
    padding: 20,
    alignItems: 'center',
  },
  consultAgainButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  consultAgainText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold' as const,
    textAlign: 'center',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  activeTabText: {
    color: '#000',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContentContainer: {
    paddingBottom: 40,
  },
  tabTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  tabDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  hexagramContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  hexagramTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600' as const,
  },
  hexagram: {
    gap: 8,
    marginBottom: 20,
  },
  hexagramLine: {
    width: 120,
    height: 8,
    justifyContent: 'center',
  },
  solidLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  brokenLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brokenLine: {
    width: '45%',
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  hexagramName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold' as const,
    marginBottom: 10,
  },
  hexagramMeaning: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  yinYangContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  yinYang: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'relative',
    marginBottom: 30,
  },
  yinYangHalf: {
    position: 'absolute',
    width: 60,
    height: 120,
    backgroundColor: '#000',
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 60,
  },
  yinYangDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    top: 20,
    right: 20,
  },
  yangYangDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    bottom: 20,
    left: 20,
  },
  daoQuote: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    fontWeight: '600' as const,
  },
  daoText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  journalEntry: {
    marginBottom: 30,
  },
  journalDate: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600' as const,
    marginBottom: 15,
  },
  journalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  journalHistory: {
    marginTop: 20,
  },
  journalHistoryTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600' as const,
    marginBottom: 15,
  },
  journalHistoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  journalHistoryDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  journalHistoryText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  journalChevronItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 0,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  journalChevronHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  journalChevronContent: {
    flex: 1,
    marginRight: 12,
  },
  journalChevronIcon: {
    paddingTop: 2,
  },
  journalExpandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: -8,
    paddingTop: 12,
  },
  orbIcon: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  orbIconInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  secretTrigger: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  secretTriggerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  settingsDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1001,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  historyPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  historyPlaceholderText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  animationToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backButton: {
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  hexagramClickable: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 2,
  },
  hexagramLink: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#ffd700',
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: '#ffd700',
  },
  ragMessageContainer: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: 'rgba(138, 43, 226, 0.3)',
    marginTop: 12,
  },
  ragHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#dda0dd',
  },
  ragText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ragLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ragLoadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  ragResponseHistory: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  ragHeaderHistory: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#dda0dd',
  },
  ragTextHistory: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  voiceIcon: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  voiceIconInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  hexagramMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 12,
  },
  hexagramBubbleContent: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  hexagramBubbleHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  hexagramBubbleSymbolContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagramBubbleTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  hexagramBubbleSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    opacity: 0.8,
  },
  hexagramBubblePrompt: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
});