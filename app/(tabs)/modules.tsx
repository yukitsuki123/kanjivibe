/**
 * KanjiVibe — Modules Tab
 * 2-column bento grid of all 14 categories with SRS progress and quick actions
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trophy, Zap, BookOpen, ArrowRight } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useApp } from '../../context/AppContext';
import { modules, Module } from '../../data/modules';
import { getCategoryWordCount, Category, allWords } from '../../data/curriculum';
import { isDue } from '../../utils/srs';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 48) / 2;

const ACCENT_COLORS: Record<string, string> = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  tertiary: Colors.tertiary,
  neutral: Colors.onSurface,
};

export default function ModulesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  const moduleStats = useMemo(() => {
    return modules.map(mod => {
      const category = mod.categories[0] as Category;
      const totalWords = getCategoryWordCount(category);
      const learnedWords = Object.values(state.srsCards).filter(c => {
        const word = allWords.find(w => w.id === c.wordId);
        return word && word.category === category && c.repetitions >= 3;
      }).length;
      const dueWords = Object.values(state.srsCards).filter(c => {
        const word = allWords.find(w => w.id === c.wordId);
        return word && word.category === category && isDue(c);
      }).length;
      const progress = totalWords > 0 ? Math.min(learnedWords / totalWords, 1) : 0;
      const bestScore = state.stats.moduleScores[category] || 0;
      return { ...mod, totalWords, learnedWords, dueWords, progress, bestScore };
    });
  }, [state.srsCards, state.stats.moduleScores]);

  const renderCard = useCallback((mod: typeof moduleStats[0]) => {
    const accent = ACCENT_COLORS[mod.accentColor] || Colors.primary;
    return (
      <TouchableOpacity
        key={mod.id}
        style={[styles.card, { borderColor: `${accent}18` }]}
        onPress={() => router.push(`/quiz-config?category=${mod.categories[0]}`)}
        activeOpacity={0.8}
      >
        {/* Blob bg */}
        <View style={[styles.blob, { backgroundColor: `${accent}12` }]} />

        {/* Top: kanji + score badge */}
        <View style={styles.cardTop}>
          <Text style={[styles.cardKanji, { color: accent }]}>{mod.kanji}</Text>
          {mod.bestScore > 0 && (
            <View style={styles.scoreBadge}>
              <Trophy size={9} color={Colors.tertiary} />
              <Text style={styles.scoreBadgeText}>{mod.bestScore}</Text>
            </View>
          )}
        </View>

        {/* Name + count */}
        <Text style={styles.cardTitle}>{mod.title}</Text>
        <Text style={styles.cardSub}>{mod.totalWords} words</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${mod.progress * 100}%`, backgroundColor: accent },
            ]}
          />
        </View>

        {/* Due badge */}
        {mod.dueWords > 0 && (
          <View style={[styles.dueBadge, { backgroundColor: `${Colors.tertiary}20` }]}>
            <Text style={[styles.dueBadgeText, { color: Colors.tertiary }]}>
              {mod.dueWords} due
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${accent}15` }]}
            onPress={() =>
              router.push(`/learning?category=${mod.categories[0]}&mode=flashcards`)
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BookOpen size={12} color={accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${accent}15` }]}
            onPress={() => router.push(`/quiz-config?category=${mod.categories[0]}`)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Zap size={12} color={accent} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [router]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>STUDY CATALOG</Text>
          <Text style={styles.headerTitle}>Modules</Text>
        </View>
      </View>

      {/* Summary strip */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryVal}>{modules.length}</Text>
          <Text style={styles.summaryLabel}>Categories</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryVal, { color: Colors.secondary }]}>
            {Object.values(state.srsCards).filter(c => c.repetitions >= 3).length}
          </Text>
          <Text style={styles.summaryLabel}>Learned</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryVal, { color: Colors.tertiary }]}>
            {Object.values(state.srsCards).filter(c => isDue(c)).length}
          </Text>
          <Text style={styles.summaryLabel}>Due</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {moduleStats.map(renderCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
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
  challengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  challengeBtnText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 12,
    color: Colors.surface,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  summaryChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  summaryVal: {
    fontFamily: FontFamily.headline,
    fontSize: 18,
    color: Colors.primary,
  },
  summaryLabel: {
    fontFamily: FontFamily.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Grid
  grid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Card
  card: {
    width: CARD_W,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 170,
  },
  blob: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -10,
    right: -10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardKanji: {
    fontFamily: FontFamily.headline,
    fontSize: 34,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: `${Colors.tertiary}15`,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  scoreBadgeText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 9,
    color: Colors.tertiary,
  },
  cardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: FontFamily.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  dueBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginBottom: 8,
  },
  dueBadgeText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  cardActions: {
    position: 'absolute',
    bottom: 12,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
