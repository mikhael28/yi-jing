import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTorchAnimations, useParticleAnimations } from './animations';

interface TorchFlameProps {
  isDark: boolean;
  torchIntensity: Animated.Value;
  colors: {
    torch: string;
  };
}

export const TorchFlame: React.FC<TorchFlameProps> = ({
  isDark,
  torchIntensity,
  colors,
}) => {
  const {
    torchPulse,
    torchWave1,
    torchWave2,
    torchWave3,
    torchRotation,
  } = useTorchAnimations();

  const { particles } = useParticleAnimations();

  return (
    <>
      <Animated.View
        style={[
          styles.torch,
          {
            transform: [
              { scale: torchPulse },
              { rotate: torchRotation.interpolate({
                inputRange: [-0.05, 0.05],
                outputRange: ['-3deg', '3deg'],
              }) },
            ],
          },
        ]}
      >
        {/* Core Flame */}
        <Animated.View
          style={[
            styles.flameCore,
            {
              opacity: torchIntensity.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.8, 1],
              }),
              transform: [
                {
                  scale: torchIntensity.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#ffffff', '#f0f0f0', '#d0d0d0'] : ['#000000', '#333333', '#666666']}
            style={styles.flameGradient}
          />
        </Animated.View>

        {/* Outer Flames */}
        <Animated.View
          style={[
            styles.flameOuter,
            {
              opacity: torchWave1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
              transform: [
                {
                  scale: torchWave1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.1, 1.4],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.View
          style={[
            styles.flameOuter2,
            {
              opacity: torchWave2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.5],
              }),
              transform: [
                {
                  scale: torchWave2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.2, 1.6],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.flameOuter3,
            {
              opacity: torchWave3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
              transform: [
                {
                  scale: torchWave3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.3, 1.8],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>

      {/* Particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
            },
          ]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  torch: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameCore: {
    width: 80,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  flameGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  flameOuter: {
    position: 'absolute',
    width: 100,
    height: 120,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  flameOuter2: {
    position: 'absolute',
    width: 120,
    height: 140,
    borderRadius: 60,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
  },
  flameOuter3: {
    position: 'absolute',
    width: 140,
    height: 160,
    borderRadius: 70,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});
