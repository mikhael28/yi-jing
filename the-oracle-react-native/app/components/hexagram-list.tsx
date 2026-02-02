
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getAllHexagrams, Hexagram } from 'yi-jing-oracle';
import { LinearGradient } from 'expo-linear-gradient';

interface HexagramListProps {
  onHexagramSelect?: (hexagram: Hexagram) => void;
}

export default function HexagramList({ onHexagramSelect }: HexagramListProps) {
  const [hexagrams, setHexagrams] = React.useState<Hexagram[]>([]);
  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    setHexagrams(getAllHexagrams());
  }, []);

  const handleHexagramPress = (hexagram: Hexagram) => {
    if (onHexagramSelect) {
      onHexagramSelect(hexagram);
    }
  };

  return (
    <View style={listStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={listStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hexagrams.map((hex, idx) => (
          <TouchableOpacity
            key={hex.number}
            style={listStyles.hexagramCard}
            onPress={() => handleHexagramPress(hex)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#2d3748', '#4a5568', '#2d3748']}
              style={listStyles.hexagramGradient}
            >
              {/* Hexagram number in corner */}
              <View style={listStyles.hexagramNumber}>
                <Text style={listStyles.hexagramNumberText}>{hex.number}</Text>
              </View>
              
              {/* Hexagram symbol */}
              <View style={listStyles.hexagramSymbol}>
                {hex.line_numbers.slice().reverse().map((line, i) => (
                  <View key={i} style={listStyles.hexagramLineContainer}>
                    {line === 1 ? (
                      <LinearGradient
                        colors={['#f7fafc', '#edf2f7']}
                        style={listStyles.yinLine}
                      />
                    ) : (
                      <View style={listStyles.yangLineContainer}>
                        <LinearGradient
                          colors={['#1a202c', '#2d3748']}
                          style={listStyles.yangLine}
                        />
                        <LinearGradient
                          colors={['#1a202c', '#2d3748']}
                          style={listStyles.yangLine}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
              
              {/* Title and character */}
              <View style={listStyles.hexagramText}>
                <Text style={listStyles.hexagramCharacter}>{hex.character}</Text>
                <Text style={listStyles.hexagramTitle} numberOfLines={2}>{hex.title}</Text>
                <Text style={listStyles.hexagramSubtitle}>{hex.chinese_name}</Text>
              </View>
              
              {/* Mystical border effect */}
              <View style={listStyles.mysticalBorder} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  hexagramCard: {
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hexagramGradient: {
    width: 160,
    height: 200,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hexagramNumber: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hexagramNumberText: {
    color: '#cbd5e0',
    fontSize: 12,
    fontWeight: '600',
  },
  hexagramSymbol: {
    marginTop: 20,
    marginBottom: 12,
  },
  hexagramLineContainer: {
    width: 80,
    height: 8,
    justifyContent: 'center',
    marginVertical: 2,
  },
  yinLine: {
    width: '100%',
    height: 4,
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
  },
  yangLine: {
    width: '45%',
    height: 4,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  hexagramText: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  hexagramCharacter: {
    fontSize: 28,
    color: '#f7fafc',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hexagramTitle: {
    fontSize: 14,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 2,
  },
  hexagramSubtitle: {
    fontSize: 11,
    color: '#a0aec0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mysticalBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});