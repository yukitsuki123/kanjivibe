/**
 * KanjiVibe — Category Detail Screen
 * Shows all words in a category with SRS badges, word cards, and action buttons
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Zap,
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { Colors, Radius, Glass } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useApp } from '../../context/AppContext';
import { getWordsByCategory, JapaneseWord, Category } from '../../data/curriculum';
import { getModuleById } from '../../data/modules';
import { isDue, intervalToString } from '../../utils/srs';

const { width: SCREEN_W } = Dimensions.get('window');

function getSRSStatus(card: any): 'new' | 'due' | 'learned' {
  if (!card) return 'new';
  if (isDue(card)) return 'due';
  if (card.repetitions >= 3) return 'learned';
  return 'due';
}

const SRS_BADGE = {
  new: { label: 'New', bg: `${Colors.primary}20`, color: Colors.primary },
  due: { label: 'Due', bg: `${Colors.tertiary}20`, color: Colors.tertiary },
  learned: { label: '✓ Learned', bg: `${Colors.secondary}20`, color: Colors.secondary },
};

export default function CategoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const [showRomaji, setShowRomaji] = useState(state.showRomaji);

  const module = getModuleById(id || '');
  const category = module?.categories[0] as Category | undefined;
  const words = useMemo(
    () => (category ? getWordsByCategory(category) : []),
    [category]
  );

  const stats = useMemo(() => {
    const learned = words.filter(w => {
      const c = state.srsCards[w.id];
      return c && c.repetitions >= 3;
    }).length;
    const due = words.filter(w => {
      const c = state.srsCards[w.id];
      return c && isDue(c) && c.repetitions < 3;
    }).length;
    return { learned, due, total: words.length };
  }, [words, state.srsCards]);

  const progress = stats.total > 0 ? stats.learned / stats.total : 0;
  const accent = Colors.primary;

  const renderWord = ({ item }: { item: JapaneseWord }) => {
    const card = state.srsCards[item.id];
    const status = getSRSStatus(card);
    const badge = SRS_BADGE[status];

    return (
      <View style={styles.wordCard}>
        <View style={styles.wordLeft}>
          <Text style={styles.wordKanji}>{item.kanji}</Text>
          {showRomaji && (
            <Text style={styles.wordRomaji}>{item.romaji}</Text>
          )}
        </View>
        <View style={styles.wordCenter}>
          <Text style={styles.wordHiragana}>{item.hiragana}</Text>
          <Text style={styles.wordEnglish}>{item.english}</Text>
        </View>
        <View style={[styles.srsBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.srsBadgeText, { color: badge.color }]}>
            {status === 'learned' && card
              ? `+${intervalToString(card.interval)}`
              : badge.label}
          </Text>
        </View>
      </View>
    );
  };

  if (!module || !category) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: Colors.onSurfaceVariant, fontFamily: FontFamily.body }}>
          Category not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerKanji}>{module.kanji}</Text>
          <View>
            <Text style={styles.headerTitle}>{module.title}</Text>
            <Text style={styles.headerSub}>{module.subtitle}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.romajiToggle}
          onPress={() => setShowRomaji(r => !r)}
        >
          <Text style={styles.romajiToggleText}>
            {showRomaji ? 'ローマ字 ON' : 'ローマ字 OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.statVal}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Clock size={14} color={Colors.tertiary} />
          <Text style={[styles.statVal, { color: Colors.tertiary }]}>{stats.due}</Text>
          <Text style={styles.statLabel}>Due</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <CheckCircle size={14} color={Colors.secondary} />
          <Text style={[styles.statVal, { color: Colors.secondary }]}>{stats.learned}</Text>
          <Text style={styles.statLabel}>Learned</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
      </View>

      {/* Word list */}
      <FlatList
        data={words}
        keyExtractor={item => item.id}
        renderItem={renderWord}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerKanji: {
    fontFamily: FontFamily.headline,
    fontSize: 32,
    color: Colors.primary,
  },
  headerTitle: {
    fontFamily: FontFamily.headline,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSub: {
    fontFamily: FontFamily.label,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  romajiToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  romajiToggleText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Glass.border,
    paddingVertical: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontFamily: FontFamily.headline,
    fontSize: 20,
    color: Colors.onSurface,
  },
  statLabel: {
    fontFamily: FontFamily.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  progressPct: {
    fontFamily: FontFamily.labelBold,
    fontSize: 11,
    color: Colors.primary,
    minWidth: 36,
    textAlign: 'right',
  },

  // Word list
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  wordLeft: { alignItems: 'center', width: 56 },
  wordKanji: {
    fontFamily: FontFamily.headline,
    fontSize: 28,
    color: Colors.onSurface,
  },
  wordRomaji: {
    fontFamily: FontFamily.label,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  wordCenter: { flex: 1 },
  wordHiragana: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  wordEnglish: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  srsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  srsBadgeText: {
    fontFamily: FontFamily.labelBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  flashcardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
  },
  flashcardBtnText: {
    fontFamily: FontFamily.headline,
    fontSize: 15,
    color: '#fff',
  },
  quizBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
  },
  quizBtnText: {
    fontFamily: FontFamily.headline,
    fontSize: 15,
    color: '#fff',
  },
});
