/**
 * KanjiVibe — Module Detail Screen
 * Shows all words in a module as a FlashList with progress indicators
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react-native';
import { Colors, Radius, Glass } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useApp } from '../../context/AppContext';
import { getModuleById } from '../../data/modules';
import { allWords, JapaneseWord } from '../../data/curriculum';

function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const module = getModuleById(id || '');

  const words = useMemo(() => {
    if (!module) return [];
    return allWords.filter(w => module.categories.includes(w.category));
  }, [module]);

  const accentColor = module?.accentColor === 'secondary' ? Colors.secondary
    : module?.accentColor === 'tertiary' ? Colors.tertiary
    : Colors.primary;

  if (!module) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Module not found</Text>
      </View>
    );
  }

  const getCardStatus = (wordId: string): 'new' | 'learning' | 'mastered' => {
    const card = state.srsCards[wordId];
    if (!card) return 'new';
    if (card.repetitions >= 3) return 'mastered';
    return 'learning';
  };

  const statusColors = {
    new: Colors.onSurfaceVariant,
    learning: Colors.secondary,
    mastered: Colors.primary,
  };

  const renderWord = ({ item, index }: { item: JapaneseWord; index: number }) => {
    const status = getCardStatus(item.id);
    return (
      <View>
        <TouchableOpacity style={styles.wordRow} activeOpacity={0.7}>
          {/* Status dot */}
          <View style={[styles.statusDot, { backgroundColor: statusColors[status] }]} />

          {/* Kanji */}
          <View style={styles.kanjiCol}>
            <Text style={[styles.wordKanji, { color: accentColor }]}>{item.kanji}</Text>
          </View>

          {/* Details */}
          <View style={styles.detailCol}>
            <Text style={styles.wordHiragana}>{item.hiragana}</Text>
            {state.showRomaji && (
              <Text style={styles.wordRomaji}>{item.romaji}</Text>
            )}
          </View>

          {/* English */}
          <View style={styles.englishCol}>
            <Text style={styles.wordEnglish} numberOfLines={2}>{item.english}</Text>
          </View>

          <ChevronRight size={16} color={Colors.outlineVariant} />
        </TouchableOpacity>
      </View>
    );
  };

  const masteredCount = words.filter(w => getCardStatus(w.id) === 'mastered').length;
  const learningCount = words.filter(w => getCardStatus(w.id) === 'learning').length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerKanji, { color: accentColor }]}>{module.kanji}</Text>
          <Text style={styles.headerTitle}>{module.title}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statChip}>
          <View style={[styles.statDot, { backgroundColor: Colors.onSurfaceVariant }]} />
          <Text style={styles.statText}>{words.length - masteredCount - learningCount} New</Text>
        </View>
        <View style={styles.statChip}>
          <View style={[styles.statDot, { backgroundColor: Colors.secondary }]} />
          <Text style={styles.statText}>{learningCount} Learning</Text>
        </View>
        <View style={styles.statChip}>
          <View style={[styles.statDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.statText}>{masteredCount} Mastered</Text>
        </View>
      </View>

      {/* Word List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={words}
          renderItem={renderWord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <BookOpen size={48} color={Colors.outlineVariant} />
              <Text style={styles.emptyText}>No words in this module yet</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

export default ModuleDetailScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  errorText: { fontFamily: FontFamily.body, fontSize: 16, color: Colors.error, textAlign: 'center', marginTop: 100 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  headerCenter: { alignItems: 'center', gap: 2 },
  headerKanji: { fontFamily: FontFamily.headline, fontSize: 28, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  headerTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Colors.onSurfaceVariant },

  statsBar: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statText: { fontFamily: FontFamily.label, fontSize: 12, color: Colors.onSurfaceVariant },

  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  kanjiCol: { width: 60 },
  wordKanji: { fontFamily: FontFamily.headline, fontSize: 22 },
  detailCol: { flex: 1 },
  wordHiragana: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurface },
  wordRomaji: { fontFamily: FontFamily.label, fontSize: 11, color: Colors.primary, letterSpacing: 0.5, marginTop: 2 },
  englishCol: { flex: 1.2, alignItems: 'flex-end' },
  wordEnglish: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'right' },

  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginLeft: 20 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: FontFamily.body, fontSize: 15, color: Colors.onSurfaceVariant },
});
