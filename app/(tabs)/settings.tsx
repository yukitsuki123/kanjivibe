/**
 * KanjiVibe — Settings Screen
 * Enhanced with Dark Mode, Font Size selection, and About App details
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Eye, 
  Target, 
  RotateCcw, 
  Info, 
  ChevronRight, 
  Moon, 
  Type, 
  Code, 
  Heart 
} from 'lucide-react-native';
import { Colors, Radius, Glass } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { GlassCard } from '../../components/ui/GlassCard';
import { useApp, FontSize } from '../../context/AppContext';

function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, toggleRomaji, setDailyGoal, resetProgress, setDarkMode, setFontSize } = useApp();

  const goalOptions = [10, 15, 20, 30, 50];
  const fontSizeOptions: { label: string, value: FontSize }[] = [
    { label: 'A', value: 'small' },
    { label: 'A', value: 'medium' },
    { label: 'A', value: 'large' },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View>
          <Text style={styles.sectionLabel}>APPEARANCE</Text>
          <GlassCard glow="none" style={styles.settingsCard}>


            {/* Font Size */}
            <View style={styles.settingColumn}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${Colors.tertiary}20` }]}>
                  <Type size={18} color={Colors.tertiary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Font Size</Text>
                  <Text style={styles.settingDesc}>Adjust text scale for readability</Text>
                </View>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.fontRow}
              >
                {fontSizeOptions.map((opt, idx) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.fontChip,
                      state.fontSize === opt.value && styles.fontChipActive,
                    ]}
                    onPress={() => setFontSize(opt.value)}
                  >
                    <Text style={[
                      styles.fontChipText,
                      { fontSize: 12 + idx * 4 },
                      state.fontSize === opt.value && styles.fontChipTextActive,
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </GlassCard>
        </View>

        {/* Study Preferences */}
        <View>
          <Text style={styles.sectionLabel}>STUDY PREFERENCES</Text>
          <GlassCard glow="none" style={styles.settingsCard}>
            {/* Romaji Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${Colors.secondary}20` }]}>
                  <Eye size={18} color={Colors.secondary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Show Romaji</Text>
                  <Text style={styles.settingDesc}>Display phonetic guides</Text>
                </View>
              </View>
              <Switch
                value={state.showRomaji}
                onValueChange={toggleRomaji}
                trackColor={{ false: Colors.surfaceContainerHighest, true: `${Colors.primary}60` }}
                thumbColor={state.showRomaji ? Colors.primary : Colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.divider} />

            {/* Daily Goal */}
            <View style={styles.settingColumn}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${Colors.primary}20` }]}>
                  <Target size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Daily Goal</Text>
                  <Text style={styles.settingDesc}>Cards to review per day</Text>
                </View>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.goalRow}
              >
                {goalOptions.map(goal => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalChip,
                      state.stats.dailyGoal === goal && styles.goalChipActive,
                    ]}
                    onPress={() => setDailyGoal(goal)}
                  >
                    <Text style={[
                      styles.goalChipText,
                      state.stats.dailyGoal === goal && styles.goalChipTextActive,
                    ]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </GlassCard>
        </View>

        {/* Data Management */}
        <View>
          <Text style={styles.sectionLabel}>DATA MANAGEMENT</Text>
          <GlassCard glow="none" style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow} onPress={resetProgress}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${Colors.error}20` }]}>
                  <RotateCcw size={18} color={Colors.error} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: Colors.error }]}>Reset Progress</Text>
                  <Text style={styles.settingDesc}>Clear all XP and SRS data</Text>
                </View>
              </View>
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* About App */}
        <View>
          <Text style={styles.sectionLabel}>ABOUT APP</Text>
          <GlassCard glow="purple" style={styles.settingsCard}>
            <View style={styles.aboutContent}>
              <View style={styles.aboutHeader}>
                <View style={styles.logoWrap}>
                  <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.aboutAppName}>KanjiVibe</Text>
                  <Text style={styles.aboutVersion}>Version 1.2.0 • Pro Edition</Text>
                </View>
              </View>
              
              <Text style={styles.aboutBio}>
                KanjiVibe is a premium Japanese learning tool designed for the modern era. Combining SRS algorithms with a Liquid Glass aesthetic, it makes mastering Kanji an immersive nocturnal experience.
              </Text>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.aboutLink}>
                <Code size={16} color={Colors.onSurfaceVariant} />
                <Text style={styles.aboutLinkText}>Follow on GitHub</Text>
                <ChevronRight size={14} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>

              <View style={styles.footerBranding}>
                <Heart size={12} color={Colors.error} fill={Colors.error} />
                <Text style={styles.footerText}>Made for Japanese Enthusiasts</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontFamily: FontFamily.headline, fontSize: 28, color: Colors.onSurface, letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, gap: 16 },

  sectionLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, letterSpacing: 2, color: Colors.onSurfaceVariant, marginBottom: 10, marginTop: 16, marginLeft: 4 },

  settingsCard: { overflow: 'hidden' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  settingColumn: { gap: 14 },
  settingIcon: { width: 40, height: 40, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, color: Colors.onSurface },
  settingDesc: { fontFamily: FontFamily.body, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 16 },

  goalRow: { gap: 8, paddingLeft: 54, paddingRight: 20 },
  goalChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surfaceContainerHighest, borderWidth: 1, borderColor: 'transparent' },
  goalChipActive: { backgroundColor: `${Colors.primary}20`, borderColor: `${Colors.primary}40` },
  goalChipText: { fontFamily: FontFamily.labelBold, fontSize: 13, color: Colors.onSurfaceVariant },
  goalChipTextActive: { color: Colors.primary },

  fontRow: { gap: 12, paddingLeft: 54, paddingRight: 20 },
  fontChip: { width: 44, height: 44, borderRadius: Radius.lg, backgroundColor: Colors.surfaceContainerHighest, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  fontChipActive: { backgroundColor: `${Colors.tertiary}20`, borderColor: `${Colors.tertiary}40` },
  fontChipText: { fontFamily: FontFamily.headline, color: Colors.onSurfaceVariant },
  fontChipTextActive: { color: Colors.tertiary },

  aboutContent: { padding: 4 },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  logoWrap: { width: 48, height: 48, borderRadius: Radius.xl, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImage: { width: 42, height: 42 },
  aboutAppName: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.onSurface },
  aboutVersion: { fontFamily: FontFamily.labelBold, fontSize: 10, color: Colors.onSurfaceVariant, textTransform: 'uppercase' },
  aboutBio: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20 },
  aboutLink: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  aboutLinkText: { flex: 1, fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Colors.onSurface },
  footerBranding: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 20, opacity: 0.5 },
  footerText: { fontFamily: FontFamily.labelBold, fontSize: 9, color: Colors.onSurfaceVariant, textTransform: 'uppercase' },
});
