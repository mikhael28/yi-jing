import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

type Theme = 'dark' | 'light';
type AnimationStyle = 'torch' | 'flame';

const THEME_STORAGE_KEY = '@oracle_theme';
const ANIMATION_STORAGE_KEY = '@oracle_animation';

const darkColors = {
  background: '#000000',
  surface: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  border: 'rgba(255, 255, 255, 0.2)',
  primary: '#ffffff',
  primaryText: '#000000',
  torch: '#ffffff',
  torchShadow: '#ffffff',
  messageUser: 'rgba(255, 255, 255, 0.1)',
  messageOracle: 'rgba(255, 255, 255, 0.05)',
  input: 'rgba(255, 255, 255, 0.1)',
};

const lightColors = {
  background: '#ffffff',
  surface: 'rgba(0, 0, 0, 0.1)',
  text: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.8)',
  border: 'rgba(0, 0, 0, 0.2)',
  primary: '#000000',
  primaryText: '#ffffff',
  torch: '#000000',
  torchShadow: '#000000',
  messageUser: 'rgba(0, 0, 0, 0.1)',
  messageOracle: 'rgba(0, 0, 0, 0.05)',
  input: 'rgba(0, 0, 0, 0.1)',
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('torch');
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme as Theme);
      }
      
      const savedAnimation = await AsyncStorage.getItem(ANIMATION_STORAGE_KEY);
      if (savedAnimation && (savedAnimation === 'torch' || savedAnimation === 'flame')) {
        setAnimationStyle(savedAnimation as AnimationStyle);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  }, [theme]);

  const toggleAnimationStyle = useCallback(async () => {
    const newStyle = animationStyle === 'torch' ? 'flame' : 'torch';
    setAnimationStyle(newStyle);
    try {
      await AsyncStorage.setItem(ANIMATION_STORAGE_KEY, newStyle);
    } catch (error) {
      console.log('Error saving animation style:', error);
    }
  }, [animationStyle]);

  const isDark = theme === 'dark';
  const colors = useMemo(() => isDark ? darkColors : lightColors, [isDark]);

  return useMemo(() => ({
    theme,
    toggleTheme,
    animationStyle,
    toggleAnimationStyle,
    isDark,
    colors,
    isLoaded,
  }), [theme, toggleTheme, animationStyle, toggleAnimationStyle, isDark, colors, isLoaded]);
});