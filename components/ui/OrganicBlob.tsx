/**
 * OrganicBlob — Animated background shape (Standard Animated API)
 * Creates asymmetric blob shapes that float slowly
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../constants/theme';

interface OrganicBlobProps {
  color?: string;
  size?: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  opacity?: number;
  blur?: number;
  speed?: number;
}

export function OrganicBlob({
  color = Colors.primary,
  size = 200,
  top,
  left,
  right,
  bottom,
  opacity = 0.1,
  blur = 80,
  speed = 8000,
}: OrganicBlobProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Loop for translateX
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 15,
          duration: speed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -15,
          duration: speed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loop for translateY
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: speed * 1.2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: speed * 1.2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loop for scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: speed * 0.8,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: speed * 0.8,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle = {
    transform: [
      { translateX: translateX },
      { translateY: translateY },
      { scale: scale },
    ],
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          borderRadius: size * 0.42,
          top: top as number | undefined,
          left: left as number | undefined,
          right: right as number | undefined,
          bottom: bottom as number | undefined,
        },
        styles.blob,
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    // Asymmetric border radius for organic feel
    borderTopLeftRadius: 120,
    borderTopRightRadius: 160,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 100,
  },
});
