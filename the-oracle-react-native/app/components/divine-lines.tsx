import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useDivineLineAnimations } from './animations';

interface DivineLinesProps {
  colors: {
    primary: string;
    primaryText: string;
    torch: string;
    text: string;
    textSecondary: string;
    surface: string;
    border: string;
  };
  divineLines?: { broken: boolean; animated: boolean }[];
  isGeneratingLines?: boolean;
  lineAnimations?: React.MutableRefObject<any[]>;
  onGenerate?: () => void;
}

export const DivineLines: React.FC<DivineLinesProps> = ({ 
  colors, 
  divineLines: externalDivineLines,
  isGeneratingLines: externalIsGeneratingLines,
  lineAnimations: externalLineAnimations,
  onGenerate 
}) => {
  const { divineLines: internalDivineLines, lineAnimations: internalLineAnimations } = useDivineLineAnimations();
  
  // Use external props if provided, otherwise use internal state
  const divineLines = externalDivineLines || internalDivineLines;
  const lineAnimations = externalLineAnimations || internalLineAnimations;

  return (
    <View style={styles.divineContainer}>
      <View style={styles.linesContainer}>
        {divineLines.map((line, index) => (
          <View key={`divine-line-${index}`} style={styles.lineWrapper}>
            {line.broken ? (
              <View style={styles.brokenDivineLine}>
                <Animated.View
                  style={[
                    styles.brokenLineSegment,
                    { backgroundColor: colors.torch },
                    {
                      opacity: lineAnimations.current[index * 2] || new Animated.Value(0),
                      transform: [
                        {
                          scaleX: lineAnimations.current[index * 2] ? 
                            lineAnimations.current[index * 2].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }) : 0,
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.brokenLineSegment,
                    { backgroundColor: colors.torch },
                    {
                      opacity: lineAnimations.current[index * 2 + 1] || new Animated.Value(0),
                      transform: [
                        {
                          scaleX: lineAnimations.current[index * 2 + 1] ? 
                            lineAnimations.current[index * 2 + 1].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }) : 0,
                        },
                      ],
                    },
                  ]}
                />
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.solidDivineLine,
                  { backgroundColor: colors.torch },
                  {
                    opacity: lineAnimations.current[index] || new Animated.Value(0),
                    transform: [
                      {
                        scaleX: lineAnimations.current[index] ? 
                          lineAnimations.current[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }) : 0,
                      },
                    ],
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  divineContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  linesContainer: {
    width: 280, // Fixed width instead of percentage
    gap: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  lineWrapper: {
    width: 280, // Fixed width
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidDivineLine: {
    width: 280, // Fixed width
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  brokenDivineLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280, // Fixed width
    gap: 20,
  },
  brokenLineSegment: {
    width: 100, // Fixed width instead of percentage
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  divineInterpretation: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  interpretationTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold' as const,
    marginBottom: 12,
    textAlign: 'center',
  },
  interpretationText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
