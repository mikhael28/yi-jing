import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { getAllTaoChapters } from 'yi-jing-oracle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = 'dao_current_chapter';

interface DaoChapter {
  chapter_number: string;
  poem: string[];
}

export default function DaoComponent() {
  const [chapters, setChapters] = useState<DaoChapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { colors } = useTheme();

  useEffect(() => {
    initializeDao();
  }, []);

  const initializeDao = async () => {
    try {
      // Get all Dao chapters from the yi-jing-oracle package
      const allChapters = getAllTaoChapters();
      setChapters(allChapters);

      // Load the saved chapter position
      const savedChapter = await AsyncStorage.getItem(STORAGE_KEY);
      const startIndex = savedChapter ? parseInt(savedChapter, 10) : 0;
      setCurrentChapterIndex(startIndex);
      
      setIsLoading(false);

      // Scroll to the saved chapter after a brief delay to ensure render
      setTimeout(() => {
        scrollToChapter(startIndex);
      }, 100);
    } catch (error) {
      console.error('Error initializing Dao:', error);
      setIsLoading(false);
    }
  };

  const scrollToChapter = (index: number) => {
    if (scrollViewRef.current && index >= 0 && index < chapters.length) {
      scrollViewRef.current.scrollTo({
        y: index * SCREEN_HEIGHT,
        animated: true,
      });
    }
  };

  const saveCurrentChapter = async (index: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, index.toString());
    } catch (error) {
      console.error('Error saving current chapter:', error);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / SCREEN_HEIGHT);
    
    if (newIndex !== currentChapterIndex && newIndex >= 0 && newIndex < chapters.length) {
      // Fade out briefly, then fade back in for smooth transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentChapterIndex(newIndex);
      saveCurrentChapter(newIndex);
    }
  };

  const renderChapter = (chapter: DaoChapter, index: number) => {
    return (
      <Animated.View 
        key={chapter.chapter_number} 
        style={[
          styles.chapterContainer, 
          { 
            backgroundColor: colors.background,
            opacity: fadeAnim,
          }
        ]}
      >
        <View style={styles.chapterContent}>
          <Animated.Text style={[styles.chapterNumber, { color: colors.primary }]}>
            Chapter {chapter.chapter_number}
          </Animated.Text>
          
          <ScrollView 
            style={styles.poemContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.poemContentContainer}
          >
            {chapter.poem.map((line, lineIndex) => (
              <Animated.Text 
                key={lineIndex} 
                style={[
                  styles.poemLine, 
                  { 
                    color: colors.text,
                    opacity: 0.9,
                  }
                ]}
              >
                {line}
              </Animated.Text>
            ))}
          </ScrollView>
          
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {index + 1} of {chapters.length}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${((index + 1) / chapters.length) * 100}%`
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading the wisdom of the Dao...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
      >
        {chapters.map((chapter, index) => renderChapter(chapter, index))}
      </ScrollView>
      
      {/* Floating chapter indicator */}
      <View style={[styles.chapterIndicator, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chapterIndicatorText, { color: colors.text }]}>
          {currentChapterIndex + 1}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  chapterContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  chapterContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 350,
    paddingVertical: 60,
  },
  chapterNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  poemContainer: {
    flex: 1,
    width: '100%',
  },
  poemContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  poemLine: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    width: '80%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  chapterIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  chapterIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
