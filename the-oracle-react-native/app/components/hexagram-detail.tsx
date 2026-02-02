import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Hexagram } from 'yi-jing-oracle';
import { LinearGradient } from 'expo-linear-gradient';

interface HexagramDetailProps {
  hexagram: Hexagram;
  scrollViewRef?: React.RefObject<ScrollView | null>;
}

export function HexagramDetail({ hexagram, scrollViewRef }: HexagramDetailProps) {
  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section */}
      <LinearGradient
        colors={['#2d3748', '#4a5568']}
        style={styles.headerContainer}
      >
        <View style={styles.hexagramSymbol}>
          {hexagram.line_numbers.slice().reverse().map((line, i) => (
            <View key={i} style={styles.lineContainer}>
              {line === 1 ? (
                <LinearGradient
                  colors={['#f7fafc', '#edf2f7']}
                  style={styles.yinLine}
                />
              ) : (
                <View style={styles.yangLineContainer}>
                  <LinearGradient
                    colors={['#1a202c', '#2d3748']}
                    style={styles.yangLine}
                  />
                  <LinearGradient
                    colors={['#1a202c', '#2d3748']}
                    style={styles.yangLine}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.headerText}>
          <Text style={styles.character}>{hexagram.character}</Text>
          <Text style={styles.number}>#{hexagram.number}</Text>
        </View>
      </LinearGradient>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{hexagram.names.join(' • ')}</Text>
        <Text style={styles.subtitle}>{hexagram.chinese_name} ({hexagram.pinyin})</Text>
      </View>

      {/* Main Title */}
      <LinearGradient
        colors={['#1a202c', '#2d3748']}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionTitle}>✦ Title ✦</Text>
        <Text style={styles.primaryText}>{hexagram.title}</Text>
      </LinearGradient>

      {/* Summary */}
      <LinearGradient
        colors={['#2d3748', '#4a5568']}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionTitle}>◈ Summary ◈</Text>
        <Text style={styles.text}>{hexagram.summary}</Text>
      </LinearGradient>

      {/* Judgement */}
      <LinearGradient
        colors={['#1a202c', '#2d3748']}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionTitle}>☯ Judgement ☯</Text>
        {hexagram.judgement.map((j, i) => (
          <Text key={i} style={styles.judgementText}>{j}</Text>
        ))}
      </LinearGradient>

      {/* Image */}
      <LinearGradient
        colors={['#2d3748', '#4a5568']}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionTitle}>〇 Image 〇</Text>
        {hexagram.image.map((img, i) => (
          <Text key={i} style={styles.imageText}>{img}</Text>
        ))}
      </LinearGradient>

      {/* Lines */}
      <LinearGradient
        colors={['#1a202c', '#2d3748']}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionTitle}>▬ The Six Lines ▬</Text>
        {hexagram.lines.map((line, i) => (
          <View key={i} style={styles.lineTextContainer}>
            <Text style={styles.lineNumber}>Line {6 - i}:</Text>
            <Text style={styles.lineText}>{line}</Text>
          </View>
        ))}
      </LinearGradient>

      {/* Description */}
      <LinearGradient
        colors={['#2d3748', '#4a5568']}
        style={[styles.sectionContainer, styles.lastSection]}
      >
        <Text style={styles.sectionTitle}>⟐ Divine Interpretation ⟐</Text>
        <Text style={styles.descriptionText}>{hexagram.description}</Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hexagramSymbol: {
    flex: 1,
  },
  lineContainer: {
    width: 100,
    height: 10,
    justifyContent: 'center',
    marginVertical: 2,
  },
  yinLine: {
    width: '100%',
    height: 5,
    borderRadius: 2.5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  yangLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yangLine: {
    width: '45%',
    height: 5,
    borderRadius: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    alignItems: 'center',
    marginLeft: 20,
  },
  character: {
    fontSize: 48,
    color: '#f7fafc',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  number: {
    fontSize: 16,
    color: '#cbd5e0',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f7fafc',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  primaryText: {
    fontSize: 20,
    color: '#f7fafc',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28,
  },
  text: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 24,
    textAlign: 'justify',
  },
  judgementText: {
    fontSize: 16,
    color: '#ffd700',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  imageText: {
    fontSize: 16,
    color: '#90cdf4',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  lineTextContainer: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  lineNumber: {
    fontSize: 14,
    color: '#cbd5e0',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lineText: {
    fontSize: 15,
    color: '#e2e8f0',
    lineHeight: 22,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
  },
  descriptionText: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 26,
    textAlign: 'justify',
    fontStyle: 'italic',
  },
});
