import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HexagramSymbolProps {
  hexagram: any;
  size?: 'small' | 'medium' | 'large';
  isDark?: boolean;
}

export function HexagramSymbol({ hexagram, size = 'medium', isDark = true }: HexagramSymbolProps) {
  if (!hexagram?.line_numbers) {
    return null;
  }

  const sizeConfig = {
    small: { width: 60, lineHeight: 4, gap: 1 },
    medium: { width: 80, lineHeight: 5, gap: 2 },
    large: { width: 100, lineHeight: 6, gap: 3 }
  };

  const config = sizeConfig[size];

  return (
    <View style={[styles.container, { width: config.width }]}>
      {hexagram.line_numbers.slice().reverse().map((line: number, i: number) => (
        <View key={i} style={[styles.lineContainer, { height: config.lineHeight + config.gap * 2, marginVertical: config.gap / 2 }]}>
          {line === 1 ? (
            // Yin line (solid)
            <LinearGradient
              colors={isDark ? ['#f7fafc', '#edf2f7'] : ['#2d3748', '#1a202c']}
              style={[styles.yinLine, { height: config.lineHeight }]}
            />
          ) : (
            // Yang line (broken)
            <View style={styles.yangLineContainer}>
              <LinearGradient
                colors={isDark ? ['#1a202c', '#2d3748'] : ['#f7fafc', '#edf2f7']}
                style={[styles.yangLine, { height: config.lineHeight, width: `${42}%` }]}
              />
              <LinearGradient
                colors={isDark ? ['#1a202c', '#2d3748'] : ['#f7fafc', '#edf2f7']}
                style={[styles.yangLine, { height: config.lineHeight, width: `${42}%` }]}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yinLine: {
    width: '100%',
    borderRadius: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  yangLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  yangLine: {
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 1,
  },
});
