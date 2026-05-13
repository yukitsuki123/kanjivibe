import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

const { width } = Dimensions.get('window');

export function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brand}>KANJIVIBE</Text>
        <View style={styles.loaderBar}>
          <Animated.View style={styles.loaderFill} />
        </View>
        <Text style={styles.status}>Mastering the Vibe...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  brand: {
    fontFamily: FontFamily.headline,
    fontSize: 24,
    color: Colors.onSurface,
    letterSpacing: 4,
    marginTop: 10,
  },
  loaderBar: {
    width: width * 0.5,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 1,
    overflow: 'hidden',
    marginTop: 20,
  },
  loaderFill: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
  },
  status: {
    fontFamily: FontFamily.labelBold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  }
});
