/**
 * ProgressBar — Animated gradient progress bar (Standard Animated API)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  height?: number;
  gradientColors?: [string, string];
  glowColor?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  height = 12,
  gradientColors = [Colors.primary, Colors.tertiary],
  glowColor = Colors.primary,
}: ProgressBarProps) {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: Math.min(progress, 1),
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width cannot use native driver
    }).start();
  }, [progress]);

  const percentage = Math.round(progress * 100);

  const widthStyle = {
    width: animWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && (
            <Text style={styles.label}>{label}</Text>
          )}
          {showPercentage && (
            <Text style={[styles.percentage, { color: gradientColors[0] }]}>
              {percentage}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, widthStyle, { height }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: Radius.full },
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: FontFamily.labelBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.onSurfaceVariant,
  },
  percentage: {
    fontFamily: FontFamily.labelBold,
    fontSize: 13,
  },
  track: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
});
