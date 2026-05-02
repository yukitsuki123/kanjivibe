/**
 * KanjiVibe — Learn Tab
 * Category browser: all study categories as scrollable cards
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, BookOpen, Zap } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useApp } from '../../context/AppContext';
import { modules, Module } from '../../data/modules';
import { getCategoryWordCount } from '../../data/curriculum';
import { createSRSCard } from '../../utils/srs';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 48) / 2;

type ModuleWithStats = Module & {
  totalWords: number;
  learnedWords: number;
  progress: number;
};

const ACCENT_COLORS: Record<string, string> = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  tertiary: Colors.tertiary,
  neutral: Colors.onSurface,
};

export default function LearnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  const moduleStats = useMemo(() => {
    return modules.map(mod => {
      const category = mod.categories[0];
      const totalWords = getCategoryWordCount(category as any);
      const learnedWords = Object.values(state.srsCards).filter(
        c => c.wordId.startsWith(category.slice(0, 2)) && c.repetitions >= 3
      ).length;
      const progress = totalWords > 0 ? Math.min(learnedWords / totalWords, 1) : 0;
      return { ...mod, totalWords, learnedWords, progress };
    });
  }, [state.srsCards]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>STUDY PATH</Text>
          <Text style={styles.headerTitle}>Learn</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Alphabets */}
        <Text style={styles.sectionLabel}>ALPHABETS</Text>
        <View style={styles.grid}>
          {moduleStats.filter(m => ['hiragana', 'katakana'].includes(m.id)).map(mod => (
            <CategoryCard
              key={mod.id}
              mod={mod}
              onPress={() => router.push(`/category/${mod.id}` as any)}
            />
          ))}
        </View>

        {/* Section: Kanji */}
        <Text style={styles.sectionLabel}>KANJI</Text>
        <View style={styles.grid}>
          {moduleStats.filter(m => m.id.startsWith('kanji-')).map(mod => (
            <CategoryCard
              key={mod.id}
              mod={mod}
              onPress={() => router.push(`/category/${mod.id}` as any)}
            />
          ))}
        </View>

        {/* Section: Vocabulary */}
        <Text style={styles.sectionLabel}>VOCABULARY</Text>
        <View style={styles.grid}>
          {moduleStats
            .filter(m => !['hiragana', 'katakana'].includes(m.id) && !m.id.startsWith('kanji-'))
            .map(mod => (
              <CategoryCard
                key={mod.id}
                mod={mod}
                onPress={() => router.push(`/category/${mod.id}` as any)}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

function CategoryCard({
  mod,
  onPress,
}: {
  mod: ModuleWithStats;
  onPress: () => void;
}) {
  const accent = ACCENT_COLORS[mod.accentColor] || Colors.primary;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: `${accent}20` }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Glow blob */}
      <View style={[styles.cardBlob, { backgroundColor: `${accent}15` }]} />

      {/* Top row */}
      <View style={styles.cardTop}>
        <Text style={[styles.cardKanji, { color: accent }]}>{mod.kanji}</Text>
        <View style={[styles.levelDot, { backgroundColor: `${accent}30` }]}>
          <Text style={[styles.levelDotText, { color: accent }]}>
            {mod.level === 'beginner' ? 'N5' : mod.level === 'intermediate' ? 'N4' : 'N3'}
          </Text>
        </View>
      </View>

      {/* Info */}
      <Text style={styles.cardTitle}>{mod.title}</Text>
      <Text style={styles.cardSub}>{mod.totalWords} words</Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(mod.progress || 0) * 100}%`, backgroundColor: accent }]} />
      </View>
      <Text style={styles.progressText}>
        {mod.learnedWords}/{mod.totalWords} learned
      </Text>

      {/* Arrow */}
      <View style={styles.cardArrow}>
        <ArrowRight size={14} color={accent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: FontFamily.labelBold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FontFamily.headline,
    fontSize: 32,
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  quizAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  quizAllText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 12,
    color: Colors.surface,
  },
  content: { paddingHorizontal: 16, gap: 8 },
  sectionLabel: {
    fontFamily: FontFamily.labelBold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_W,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 160,
  },
  cardBlob: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -20,
    right: -20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardKanji: {
    fontFamily: FontFamily.headline,
    fontSize: 36,
  },
  levelDot: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  levelDotText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: FontFamily.label,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: FontFamily.label,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});
