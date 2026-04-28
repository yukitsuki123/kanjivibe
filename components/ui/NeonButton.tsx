/**
 * NeonButton — Primary and Glass button variants (Standard Animated API)
 */

import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'glass' | 'secondary' | 'tertiary';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function NeonButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: NeonButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scale }],
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <Animated.View style={[animatedStyle]}>
          <LinearGradient
            colors={[Colors.primaryContainer, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.button,
              disabled && styles.disabled,
            ]}
          >
            <Text style={[styles.primaryText, textStyle]}>{label}</Text>
            {icon}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    glass: {
      bg: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.15)',
      text: Colors.onSurface,
    },
    secondary: {
      bg: 'rgba(255,255,255,0.05)',
      border: `${Colors.secondary}50`,
      text: Colors.secondary,
    },
    tertiary: {
      bg: 'rgba(255,255,255,0.05)',
      border: `${Colors.tertiary}50`,
      text: Colors.tertiary,
    },
  };

  const v = variantStyles[variant] || variantStyles.glass;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.7}
      style={[fullWidth && { width: '100%' }, style]}
    >
      <Animated.View
        style={[
          styles.button,
          animatedStyle,
          {
            backgroundColor: v.bg,
            borderWidth: 1,
            borderColor: v.border,
          },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.glassText, { color: v.text }, textStyle]}>{label}</Text>
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.onPrimary,
  },
  glassText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.4,
  },
});
