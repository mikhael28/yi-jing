import { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import { castYarrowHexagram } from './yarrow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Hook for torch and divine flame animations
export const useTorchAnimations = () => {
  // Animation values for the torch
  const torchPulse = useRef(new Animated.Value(1)).current;
  const torchWave1 = useRef(new Animated.Value(0)).current;
  const torchWave2 = useRef(new Animated.Value(0)).current;
  const torchWave3 = useRef(new Animated.Value(0)).current;
  const torchIntensity = useRef(new Animated.Value(0.3)).current;
  const torchRotation = useRef(new Animated.Value(0)).current;
  
  // Divine flame animation values - multiple layers for depth and majesty
  const flameHeight = useRef(new Animated.Value(1)).current;
  const flameScale = useRef(new Animated.Value(1.5)).current; // Bigger base scale
  const flameIntensity = useRef(new Animated.Value(0.4)).current;
  
  // Multiple flame layers for divine effect
  const flameCore = useRef(new Animated.Value(1)).current; // Inner core flame
  const flameMid = useRef(new Animated.Value(1)).current; // Middle layer
  const flameOuter = useRef(new Animated.Value(1)).current; // Outer divine glow
  
  // Individual flame tongue animations for realistic movement
  const flameTongue1 = useRef(new Animated.Value(0)).current;
  const flameTongue2 = useRef(new Animated.Value(0)).current;
  const flameTongue3 = useRef(new Animated.Value(0)).current;
  const flameTongue4 = useRef(new Animated.Value(0)).current;
  const flameTongue5 = useRef(new Animated.Value(0)).current;
  
  // Divine glow and ethereal effects
  const divineGlow = useRef(new Animated.Value(1)).current;
  const etherealWave = useRef(new Animated.Value(0)).current;
  const sacredPulse = useRef(new Animated.Value(1)).current;

  // Base pulsating animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(torchPulse, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(torchPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Wave animations
    const wave1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(torchWave1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(torchWave1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    wave1Animation.start();

    const wave2Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(torchWave2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(torchWave2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    wave2Animation.start();

    const wave3Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(torchWave3, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(torchWave3, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );
    wave3Animation.start();

    // Subtle rotation
    const rotationAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(torchRotation, {
          toValue: 0.05,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(torchRotation, {
          toValue: -0.05,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );
    rotationAnimation.start();

    // Divine flame animations - majestic and powerful
    const flameHeightAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameHeight, {
          toValue: 2.2, // Much taller flame
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(flameHeight, {
          toValue: 1.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameHeight, {
          toValue: 1.9,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flameHeight, {
          toValue: 1.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    flameHeightAnimation.start();

    // Divine flame scale breathing
    const flameScaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameScale, {
          toValue: 2.0, // Even bigger
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(flameScale, {
          toValue: 1.5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    flameScaleAnimation.start();

    // Multi-layered flame core animations
    const flameCoreAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameCore, {
          toValue: 1.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(flameCore, {
          toValue: 0.9,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flameCore, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flameCore, {
          toValue: 1.0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    flameCoreAnimation.start();

    const flameMidAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameMid, {
          toValue: 1.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameMid, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(flameMid, {
          toValue: 1.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(flameMid, {
          toValue: 1.0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    flameMidAnimation.start();

    const flameOuterAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameOuter, {
          toValue: 1.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flameOuter, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameOuter, {
          toValue: 1.5,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(flameOuter, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    flameOuterAnimation.start();

    // Individual flame tongues for realistic movement
    const flameTongue1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameTongue1, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue1, {
          toValue: -0.3,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue1, {
          toValue: 0.8,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue1, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ])
    );
    flameTongue1Animation.start();

    const flameTongue2Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameTongue2, {
          toValue: -0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue2, {
          toValue: 0.5,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue2, {
          toValue: -0.4,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue2, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    );
    flameTongue2Animation.start();

    const flameTongue3Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameTongue3, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue3, {
          toValue: -0.9,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue3, {
          toValue: 0.3,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue3, {
          toValue: 0,
          duration: 270,
          useNativeDriver: true,
        }),
      ])
    );
    flameTongue3Animation.start();

    const flameTongue4Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameTongue4, {
          toValue: -0.7,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue4, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue4, {
          toValue: -0.2,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue4, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    flameTongue4Animation.start();

    const flameTongue5Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameTongue5, {
          toValue: 0.9,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue5, {
          toValue: -0.6,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue5, {
          toValue: 0.4,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(flameTongue5, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
      ])
    );
    flameTongue5Animation.start();

    // Divine glow animation - sacred pulsing
    const divineGlowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(divineGlow, {
          toValue: 1.8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(divineGlow, {
          toValue: 1.2,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(divineGlow, {
          toValue: 1.5,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(divineGlow, {
          toValue: 1.0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    divineGlowAnimation.start();

    // Ethereal wave effect
    const etherealWaveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(etherealWave, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(etherealWave, {
          toValue: -1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    etherealWaveAnimation.start();

    // Sacred pulse - slower, deeper breathing
    const sacredPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sacredPulse, {
          toValue: 1.3,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(sacredPulse, {
          toValue: 0.9,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    sacredPulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      wave1Animation.stop();
      wave2Animation.stop();
      wave3Animation.stop();
      rotationAnimation.stop();
      flameHeightAnimation.stop();
      flameScaleAnimation.stop();
      flameCoreAnimation.stop();
      flameMidAnimation.stop();
      flameOuterAnimation.stop();
      flameTongue1Animation.stop();
      flameTongue2Animation.stop();
      flameTongue3Animation.stop();
      flameTongue4Animation.stop();
      flameTongue5Animation.stop();
      divineGlowAnimation.stop();
      etherealWaveAnimation.stop();
      sacredPulseAnimation.stop();
    };
  }, [torchPulse, torchWave1, torchWave2, torchWave3, torchRotation, flameHeight, flameScale, flameCore, flameMid, flameOuter, flameTongue1, flameTongue2, flameTongue3, flameTongue4, flameTongue5, divineGlow, etherealWave, sacredPulse, flameIntensity]);

  return {
    torchPulse,
    torchWave1,
    torchWave2,
    torchWave3,
    torchIntensity,
    torchRotation,
    flameHeight,
    flameScale,
    flameIntensity,
    flameCore,
    flameMid,
    flameOuter,
    flameTongue1,
    flameTongue2,
    flameTongue3,
    flameTongue4,
    flameTongue5,
    divineGlow,
    etherealWave,
    sacredPulse,
  };
};

// Hook for particle animations
export const useParticleAnimations = () => {
  // Particle animations
  const particles = useRef(
    Array.from({ length: 6 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Divine spark animations for the sacred flame
  const sparks = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  // Sacred embers - larger, slower moving particles
  const sacredEmbers = useRef(
    Array.from({ length: 8 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(1),
      rotation: new Animated.Value(0),
    }))
  ).current;

  // Particle animation loop
  useEffect(() => {
    const animateParticles = () => {
      particles.forEach((particle, index) => {
        const delay = index * 500;
        
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(particle.y, {
                toValue: -200,
                duration: 4000,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(particle.opacity, {
                  toValue: 0.6,
                  duration: 1000,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.opacity, {
                  toValue: 0,
                  duration: 3000,
                  useNativeDriver: true,
                }),
              ]),
              Animated.timing(particle.x, {
                toValue: (Math.random() - 0.5) * 100,
                duration: 4000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(particle.y, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(particle.x, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });
    };

    const animateSparks = () => {
      sparks.forEach((spark, index) => {
        const delay = index * 150;
        const direction = (Math.random() - 0.5) * 2;
        const distance = 80 + Math.random() * 150; // Larger distances for divine sparks
        
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(spark.y, {
                toValue: -distance * 1.5, // Higher reach
                duration: 1500 + Math.random() * 800,
                useNativeDriver: true,
              }),
              Animated.timing(spark.x, {
                toValue: direction * distance * 0.8,
                duration: 1500 + Math.random() * 800,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(spark.opacity, {
                  toValue: 0.9, // Brighter sparks
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(spark.opacity, {
                  toValue: 0,
                  duration: 1300 + Math.random() * 800,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(spark.scale, {
                  toValue: 1.5, // Larger sparks
                  duration: 150,
                  useNativeDriver: true,
                }),
                Animated.timing(spark.scale, {
                  toValue: 0.2,
                  duration: 1350 + Math.random() * 800,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.parallel([
              Animated.timing(spark.y, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(spark.x, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(spark.scale, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });
    };

    const animateSacredEmbers = () => {
      sacredEmbers.forEach((ember, index) => {
        const delay = index * 600;
        const direction = (Math.random() - 0.5) * 1.5;
        const distance = 120 + Math.random() * 200;
        
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(ember.y, {
                toValue: -distance * 2, // Very high for divine embers
                duration: 4000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(ember.x, {
                toValue: direction * distance * 0.6,
                duration: 4000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(ember.opacity, {
                  toValue: 0.7,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(ember.opacity, {
                  toValue: 0,
                  duration: 3500 + Math.random() * 2000,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(ember.scale, {
                  toValue: 2.0, // Large divine embers
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(ember.scale, {
                  toValue: 0.4,
                  duration: 3700 + Math.random() * 2000,
                  useNativeDriver: true,
                }),
              ]),
              Animated.timing(ember.rotation, {
                toValue: (Math.random() - 0.5) * 4, // Gentle rotation
                duration: 4000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(ember.y, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(ember.x, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(ember.scale, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(ember.rotation, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });
    };

    animateParticles();
    animateSparks();
    animateSacredEmbers();
  }, [particles, sparks, sacredEmbers]);

  return { particles, sparks, sacredEmbers };
};

// Hook for streaming intensity animation - enhanced for divine flame
export const useStreamingAnimation = (isStreaming: boolean, torchIntensity: Animated.Value, flameIntensity: Animated.Value, divineGlow?: Animated.Value, sacredPulse?: Animated.Value) => {
  useEffect(() => {
    if (isStreaming) {
      // Intensify the divine flame during streaming
      Animated.parallel([
        Animated.timing(torchIntensity, {
          toValue: 1.2, // Even brighter during streaming
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flameIntensity, {
          toValue: 1.3, // More intense divine flame
          duration: 300,
          useNativeDriver: true,
        }),
        divineGlow ? Animated.timing(divineGlow, {
          toValue: 2.0, // Radiant divine glow
          duration: 400,
          useNativeDriver: true,
        }) : Animated.delay(0),
        sacredPulse ? Animated.timing(sacredPulse, {
          toValue: 1.5, // Stronger sacred pulse
          duration: 400,
          useNativeDriver: true,
        }) : Animated.delay(0),
      ]).start();
    } else {
      // Return to peaceful divine state
      Animated.parallel([
        Animated.timing(torchIntensity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameIntensity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        divineGlow ? Animated.timing(divineGlow, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        }) : Animated.delay(0),
        sacredPulse ? Animated.timing(sacredPulse, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        }) : Animated.delay(0),
      ]).start();
    }
  }, [isStreaming, torchIntensity, flameIntensity, divineGlow, sacredPulse]);
};

// Hook for drawer animations
export const useDrawerAnimations = () => {
  const [screenWidth] = useState(() => Dimensions.get('window').width);
  const drawerTranslateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const settingsTranslateX = useRef(new Animated.Value(-screenWidth)).current;

  const openDrawer = () => {
    return Animated.spring(drawerTranslateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    });
  };

  const closeDrawer = () => {
    return Animated.spring(drawerTranslateY, {
      toValue: -SCREEN_HEIGHT,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    });
  };

  const openSettings = () => {
    return Animated.spring(settingsTranslateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    });
  };

  const closeSettings = () => {
    return Animated.spring(settingsTranslateX, {
      toValue: -screenWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    });
  };

  return {
    drawerTranslateY,
    settingsTranslateX,
    openDrawer,
    closeDrawer,
    openSettings,
    closeSettings,
  };
};

// Hook for divine lines animation
export const useDivineLineAnimations = () => {
  const [divineLines, setDivineLines] = useState<{ broken: boolean; animated: boolean }[]>([]);
  const [isGeneratingLines, setIsGeneratingLines] = useState(false);
  const lineAnimations = useRef<Animated.Value[]>([]);

  const generateDivineLines = async () => {
    if (isGeneratingLines) return;
    
    setIsGeneratingLines(true);
    setDivineLines([]);
    lineAnimations.current = [];
    
    // Generate authentic hexagram using yarrow stalk algorithm
    const hexagram = castYarrowHexagram();
    
    // Convert yarrow line results to animation format
    // In I Ching: weak lines are broken (yin), strong lines are solid (yang)
    const newLines = hexagram.lines.map(line => ({
      broken: line.type === 'weak', // weak = broken/yin, strong = solid/yang
      animated: false,
    }));
    
    setDivineLines(newLines);
    
    // Create animation values for each line/segment
    newLines.forEach((line, index) => {
      if (line.broken) {
        // Broken line needs 2 segments
        lineAnimations.current[index * 2] = new Animated.Value(0);
        lineAnimations.current[index * 2 + 1] = new Animated.Value(0);
      } else {
        // Solid line needs 1 segment
        lineAnimations.current[index] = new Animated.Value(0);
      }
    });
    
    // Animate lines appearing one by one with calligraphic effect
    for (let i = 0; i < newLines.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (newLines[i].broken) {
        // Animate broken line segments with slight delay between them
        Animated.sequence([
          Animated.timing(lineAnimations.current[i * 2], {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(lineAnimations.current[i * 2 + 1], {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Animate solid line
        Animated.timing(lineAnimations.current[i], {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    }
    
    setTimeout(() => {
      setIsGeneratingLines(false);
    }, newLines.length * 400 + 1000);
    
    // Return the generated lines for immediate use
    return newLines;
  };

  return {
    divineLines,
    isGeneratingLines,
    lineAnimations,
    generateDivineLines,
  };
};
