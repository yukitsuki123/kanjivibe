/**
 * GlassCard — Solid surface container component (Simplified)
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Glass, Radius, Shadows } from '../../constants/theme';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  glow?: 'purple' | 'cyan' | 'magenta' | 'none';
  intensity?: 'light' | 'medium' | 'strong';
  radius?: number;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  glow = 'none',
  intensity = 'medium',
  radius = Radius['2xl'],
  noPadding = false,
}: GlassCardProps) {
  const bg = intensity === 'light' ? Colors.surfaceContainerLowest
    : intensity === 'strong' ? Colors.surfaceContainerHigh
    : Colors.surfaceContainerLow;

  return (
    <View style={[styles.container, { borderRadius: radius }, style]}>
      <View style={[
        styles.card,
        {
          borderRadius: radius,
          backgroundColor: bg,
          padding: noPadding ? 0 : 24,
        },
      ]}>
        {children}
      </View>
    </View>
  );
}

/** A variant that uses LinearGradient for subtle depth (now solid) */
export function GlassGradientCard({
  children,
  style,
  radius = Radius['2xl'],
}: GlassCardProps) {
  return (
    <View style={[{ borderRadius: radius }, style]}>
      <View
        style={[styles.gradientCard, { borderRadius: radius, backgroundColor: Colors.surfaceContainerLow }]}
      >
        <View style={{ padding: 24 }}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  card: {
    borderWidth: 1,
    borderColor: Glass.border,
    overflow: 'hidden',
  },
  gradientCard: {
    borderWidth: 1,
    borderColor: Glass.border,
    overflow: 'hidden',
  },
});
