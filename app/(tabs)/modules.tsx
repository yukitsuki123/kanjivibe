/**
 * KanjiVibe — Module Selection Screen
 * Centered layout with organic blob cards matching the design mockup
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Waves, Sparkles, Lock, User } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { OrganicBlob } from '../../components/ui/OrganicBlob';
import { useApp } from '../../context/AppContext';
import { modules } from '../../data/modules';
import { getKanjiOfTheDay } from '../../data/curriculum';

const accentColors = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  tertiary: Colors.tertiary,
  neutral: Colors.onSurface,
};

const glowShadows = {
  primary: Shadows.purpleGlow,
  secondary: Shadows.cyanGlow,
  tertiary: Shadows.magentaGlow,
  neutral: {},
};

function ModulesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const kanjiOfDay = getKanjiOfTheDay();

  const getButtonVariant = (level: string): 'primary' | 'secondary' | 'tertiary' | 'glass' => {
    if (level === 'beginner') return 'primary';
    if (level === 'intermediate') return 'secondary';
    if (level === 'advanced') return 'tertiary';
    return 'glass';
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ArrowRight': return <ArrowRight size={14} color={Colors.onPrimary} />;
      case 'Waves': return <Waves size={14} color={Colors.secondary} />;
      case 'Sparkles': return <Sparkles size={14} color={Colors.tertiary} />;
      case 'Lock': return <Lock size={14} color="#64748b" />;
      default: return null;
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Modules Content */}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.gridIcon}>
            <View style={styles.gridDot} /><View style={styles.gridDot} />
            <View style={styles.gridDot} /><View style={styles.gridDot} />
          </View>
          <Text style={styles.brand}>KANJIVIBE</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
          <User size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View>
          <Text style={styles.heroTitle}>Select Your Path</Text>
          <Text style={styles.heroSubtitle}>
            Master the strokes of destiny. Choose a module to begin your journey through the neon nocturnal world of Kanji.
          </Text>
        </View>

        {/* Module Cards */}
        {modules.map((mod, index) => {
          const accent = accentColors[mod.accentColor];
          const shadow = glowShadows[mod.accentColor];
          const isLocked = mod.level === 'locked';

          return (
            <View
              key={mod.id}
            >
              <View style={[styles.moduleOuter, shadow]}>
                {/* Glow border */}
                <View style={[styles.glowBorder, { borderColor: `${accent}15` }]} />
                <View style={[styles.moduleCard]}>
                  {/* Organic blob bg */}
                  <View style={[styles.blobBg, { backgroundColor: `${accent}15` }]} />

                  {/* Kanji + Badge */}
                  <View style={styles.moduleHeader}>
                    <Text style={[styles.moduleKanji, { color: accent, textShadowColor: `${accent}60` }]}>
                      {mod.kanji}
                    </Text>
                    <View style={[styles.levelBadge, { backgroundColor: `${accent}15`, borderColor: `${accent}30` }]}>
                      <Text style={[styles.levelBadgeText, { color: accent }]}>
                        {mod.subtitle}
                      </Text>
                    </View>
                    {state.stats?.moduleScores?.[mod.categories[0]] !== undefined && (
                      <View style={styles.scoreBadge}>
                        <Trophy size={10} color={Colors.tertiary} />
                        <Text style={styles.scoreBadgeText}>BEST: {state.stats.moduleScores[mod.categories[0]]}</Text>
                      </View>
                    )}
                  </View>

                  {/* Title & Description */}
                  <Text style={styles.moduleTitle}>{mod.title}</Text>
                  <Text style={styles.moduleDesc}>{mod.description}</Text>

                  {/* Button */}
                  {isLocked ? (
                    <View style={styles.lockedBtn}>
                      <Text style={styles.lockedText}>LOCKED</Text>
                      <Lock size={12} color="#64748b" />
                    </View>
                  ) : (
                    <NeonButton
                      label={mod.buttonLabel}
                      onPress={() => router.push(`/learning?category=${mod.categories[0]}`)}
                      variant={getButtonVariant(mod.level)}
                      icon={getIcon(mod.buttonIcon)}
                      fullWidth
                      style={{ marginTop: 16 }}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {/* Featured Character */}
        <View>
          <GlassCard glow="none" noPadding style={styles.featuredOuter}>
            <View style={styles.featuredCard}>
              {/* Kanji visual */}
              <View style={styles.featuredKanjiWrap}>
                <View style={styles.featuredKanjiBg} />
                <Text style={styles.featuredKanji}>{kanjiOfDay.kanji}</Text>
                <Text style={styles.featuredKanjiLabel}>
                  {kanjiOfDay.english.toUpperCase()} / {kanjiOfDay.romaji?.toUpperCase()}
                </Text>
              </View>

              {/* Details */}
              <View style={styles.featuredDetails}>
                <View style={styles.cotdBadge}>
                  <Text style={styles.cotdBadgeText}>CHARACTER OF THE DAY</Text>
                </View>
                <Text style={styles.featuredTitle}>Illuminate Your Learning</Text>
                <Text style={styles.featuredDesc}>
                  Let this character guide your study session today. Tap to begin a quick study module.
                </Text>
                <TouchableOpacity
                  style={styles.quickStudyLink}
                  onPress={() => router.push(`/learning?category=${kanjiOfDay.category}`)}
                >
                  <Text style={styles.quickStudyText}>QUICK STUDY MODULE</Text>
                  <ArrowRight size={12} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>


    </View>
  );
}

export default ModulesScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gridIcon: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'center' },
  gridDot: { width: 7, height: 7, borderRadius: 2, backgroundColor: Colors.primary, opacity: 0.8 },
  brand: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.primary, letterSpacing: -1, textShadowColor: 'rgba(210,187,255,0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  avatarBtn: { padding: 8, borderRadius: Radius.lg },

  content: { paddingHorizontal: 20, gap: 24, paddingTop: 8 },
  heroTitle: { fontFamily: FontFamily.headline, fontSize: 38, color: Colors.onSurface, letterSpacing: -1, marginBottom: 8 },
  heroSubtitle: { fontFamily: FontFamily.body, fontSize: 15, color: Colors.onSurfaceVariant, lineHeight: 22, maxWidth: 340 },

  // Module cards
  moduleOuter: { borderRadius: Radius.xl, overflow: 'visible' },
  glowBorder: { ...StyleSheet.absoluteFillObject, borderRadius: Radius.xl + 2, borderWidth: 1, margin: -1, opacity: 0.3 },
  moduleCard: {
    backgroundColor: Glass.background,
    borderWidth: 1,
    borderColor: Glass.borderSubtle,
    borderRadius: Radius.xl,
    padding: 28,
    overflow: 'hidden',
    alignItems: 'center',
  },
  blobBg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 160,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 100,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    opacity: 0.3,
  },
  moduleHeader: { alignItems: 'center', gap: 12, marginBottom: 16 },
  moduleKanji: { fontFamily: FontFamily.headline, fontSize: 56, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 },
  levelBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  levelBadgeText: { fontFamily: FontFamily.labelBold, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginTop: 4 },
  scoreBadgeText: { fontFamily: FontFamily.labelBold, fontSize: 8, color: Colors.tertiary, letterSpacing: 1 },
  moduleTitle: { fontFamily: FontFamily.headline, fontSize: 22, color: Colors.onSurface, marginBottom: 8, textAlign: 'center' },
  moduleDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, textAlign: 'center' },
  lockedBtn: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 16,
    borderRadius: Radius.lg,
    backgroundColor: `${Colors.surfaceContainerHighest}80`,
    borderWidth: 1,
    borderColor: Glass.borderGhost,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lockedText: { fontFamily: FontFamily.labelBold, fontSize: 10, letterSpacing: 2, color: '#64748b' },

  // Featured
  featuredOuter: { borderRadius: Radius['2xl'], overflow: 'hidden' },
  featuredCard: { overflow: 'hidden' },
  featuredKanjiWrap: { width: '100%', height: 200, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  featuredKanjiBg: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.secondary, opacity: 0.03 },
  featuredKanji: { fontFamily: FontFamily.headline, fontSize: 80, color: Colors.secondary, textShadowColor: 'rgba(211,251,255,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  featuredKanjiLabel: { fontFamily: FontFamily.headline, fontSize: 10, letterSpacing: 4, color: `${Colors.secondary}90`, marginTop: 8 },
  featuredDetails: { padding: 28 },
  cotdBadge: { backgroundColor: `${Colors.primary}25`, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, marginBottom: 12 },
  cotdBadgeText: { fontFamily: FontFamily.labelBold, fontSize: 9, letterSpacing: 2, color: Colors.primary },
  featuredTitle: { fontFamily: FontFamily.headline, fontSize: 24, color: Colors.onSurface, marginBottom: 8 },
  featuredDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, marginBottom: 16 },
  quickStudyLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quickStudyText: { fontFamily: FontFamily.labelBold, fontSize: 11, letterSpacing: 2, color: Colors.primary },

  // Decorations
  floatingRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: `${Colors.primary}15`, opacity: 0.2, pointerEvents: 'none' },
  floatingRingSm: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: `${Colors.secondary}15`, opacity: 0.1, pointerEvents: 'none' },
});
