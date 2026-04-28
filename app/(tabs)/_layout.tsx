/**
 * KanjiVibe — Tab Layout
 * Floating pill-shaped bottom tab bar with glass blur effect
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, Layers, Grid3x3, Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors, Glass, Shadows, Radius } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

const TAB_ITEMS = [
  { name: 'index', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'modules', label: 'Modules', icon: Grid3x3 },
  { name: 'settings', label: 'Settings', icon: Settings },
] as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 12) + 8,
          left: 24,
          right: 24,
          height: 64,
          borderRadius: Radius.full,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: Glass.border,
          ...Shadows.tabBarGlow,
          paddingBottom: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontFamily: FontFamily.labelBold,
          fontSize: 9,
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={60}
              tint="dark"
              style={[StyleSheet.absoluteFill, { borderRadius: Radius.full, overflow: 'hidden' }]}
            />
          ) : null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <LayoutDashboard size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="modules"
        options={{
          title: 'Modules',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Grid3x3 size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Settings size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRadius: Radius.full,
    padding: 8,
  },
});
