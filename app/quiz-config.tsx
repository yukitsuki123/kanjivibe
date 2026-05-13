/**
 * KanjiVibe — Quiz Configuration Screen
 * Matches the provided design: SELECT TYPE / SELECT MODE / QUESTIONS / Start Quiz / Flashcard Mode
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Zap, BookOpen, Eye, Mic, PenLine, Globe, Repeat, Type, MessageSquare } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../constants/theme';
import { FontFamily } from '../constants/typography';

const { width: SCREEN_W } = Dimensions.get('window');

type QuizType = 'kanji' | 'hiragana';

interface QuizMode {
  id: string;
  label: string;
  description: string;
  apiMode: 'meaning' | 'reading' | 'character' | 'onyomi_to_kanji' | 'english_to_hiragana';
  icon: any;
}

const TYPE_OPTIONS: { id: QuizType; label: string; char: string; color: string }[] = [
  { id: 'kanji', label: 'Kanji', char: '漢', color: Colors.primary },
  { id: 'hiragana', label: 'Hiragana', char: 'あ', color: Colors.secondary },
];

const MODES_BY_TYPE: Record<QuizType, QuizMode[]> = {
  kanji: [
    { id: "meaning", label: "Kanji to English", description: "See a kanji, guess the English meaning", apiMode: "meaning", icon: Eye },
    { id: "reading", label: "Kanji to Onyomi", description: "See a kanji, guess the onyomi reading", apiMode: "reading", icon: Mic },
    { id: "writing", label: "Meaning to Kanji", description: "See a meaning, guess the kanji", apiMode: "character", icon: PenLine },
    { id: "onyomi_to_kanji", label: "Onyomi to Kanji", description: "See onyomi, guess the kanji", apiMode: "onyomi_to_kanji", icon: Type },
  ],
  hiragana: [
    { id: "meaning", label: "Hiragana to English", description: "See hiragana, guess the English meaning", apiMode: "meaning", icon: Globe },
    { id: "reading", label: "Hiragana to Romaji", description: "See hiragana, choose the romaji", apiMode: "reading", icon: Type },
    { id: "character", label: "Romaji to Hiragana", description: "See romaji, choose the hiragana", apiMode: "character", icon: Eye },
    { id: "english_to_hiragana", label: "English to Hiragana", description: "See English, choose the hiragana", apiMode: "english_to_hiragana", icon: MessageSquare },
  ],
};

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function QuizConfigScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; preType?: string }>();

  const resolveInitialType = (): QuizType => {
    if (params.preType && (params.preType === 'kanji' || params.preType === 'hiragana')) {
      return params.preType as QuizType;
    }
    if (params.category === 'hiragana') return 'hiragana';
    return 'kanji';
  };

  const [selectedType, setSelectedType] = useState<QuizType>(resolveInitialType());
  const [selectedMode, setSelectedMode] = useState<QuizMode>(MODES_BY_TYPE[resolveInitialType()][0]);
  const [questionCount, setQuestionCount] = useState(10);

  const handleTypeSelect = (type: QuizType) => {
    setSelectedType(type);
    setSelectedMode(MODES_BY_TYPE[type][0]);
  };

  const handleStartQuiz = () => {
    // Determine category based on type if not explicitly passed
    let cat = params.category;
    if (!cat) {
      if (selectedType === 'kanji') cat = 'kanji_basic';
      if (selectedType === 'hiragana') cat = 'hiragana';
    }

    router.replace(
      `/quiz-session?type=${selectedType}&mode=${selectedMode.apiMode}&count=${questionCount}&category=${cat}`
    );
  };

  const typeColor = TYPE_OPTIONS.find(t => t.id === selectedType)?.color || Colors.primary;
  const modes = MODES_BY_TYPE[selectedType];
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Setup</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!(params.category === 'hiragana' || params.category?.startsWith('kanji_')) && (
          <>
            <Text style={styles.sectionLabel}>SELECT TYPE</Text>
            <View style={styles.typeGrid}>
              {TYPE_OPTIONS.map(qt => (
                <TouchableOpacity
                  key={qt.id}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: selectedType === qt.id ? `${qt.color}22` : Colors.surfaceContainer,
                      borderColor: selectedType === qt.id ? qt.color : Glass.border,
                    },
                  ]}
                  onPress={() => handleTypeSelect(qt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.typeChar, { color: qt.color }]}>{qt.char}</Text>
                  <Text style={[styles.typeLabel, { color: selectedType === qt.id ? qt.color : Colors.onSurface }]}>
                    {qt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Mode Selector */}
        <Text style={styles.sectionLabel}>SELECT MODE</Text>
        <View style={styles.modeList}>
          {modes.map(mode => {
            const Icon = mode.icon;
            const isSelected = selectedMode.id === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  {
                    backgroundColor: isSelected ? `${typeColor}18` : Colors.surfaceContainer,
                    borderColor: isSelected ? typeColor : Glass.border,
                  },
                ]}
                onPress={() => setSelectedMode(mode)}
                activeOpacity={0.8}
              >
                <View style={[styles.modeIconBg, { backgroundColor: `${typeColor}22` }]}>
                  <Icon size={18} color={typeColor} />
                </View>
                <View style={styles.modeTextCol}>
                  <Text style={[styles.modeLabel, { color: Colors.onSurface }]}>{mode.label}</Text>
                  <Text style={[styles.modeDesc, { color: Colors.onSurfaceVariant }]}>{mode.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Count Selector */}
        <Text style={styles.sectionLabel}>QUESTIONS</Text>
        <View style={styles.countRow}>
          {QUESTION_COUNTS.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.countPill,
                { 
                  backgroundColor: questionCount === c ? typeColor : Colors.surfaceContainer,
                  borderColor: questionCount === c ? typeColor : Glass.border
                },
              ]}
              onPress={() => setQuestionCount(c)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.countText, 
                { color: questionCount === c ? '#fff' : Colors.onSurfaceVariant }
              ]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: typeColor }]}
          onPress={handleStartQuiz}
          activeOpacity={0.85}
        >
          <Zap size={20} color="#fff" fill="#fff" />
          <Text style={styles.startBtnText}>Start Quiz</Text>
        </TouchableOpacity>
        
        {params.category && (
          <TouchableOpacity
            style={styles.flashBtn}
            onPress={() => router.replace(`/learning?category=${params.category}&mode=flashcards`)}
            activeOpacity={0.8}
          >
            <BookOpen size={18} color={typeColor} />
            <Text style={[styles.flashText, { color: typeColor }]}>Flashcard Mode</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: { padding: 4, width: 40 },
  headerTitle: {
    fontFamily: FontFamily.headline,
    fontSize: 18,
    color: Colors.onSurface,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: FontFamily.labelBold,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 24,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  typeCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  typeChar: {
    fontFamily: FontFamily.headline,
    fontSize: 28,
    lineHeight: 34,
  },
  typeLabel: {
    fontFamily: FontFamily.labelBold,
    fontSize: 10,
  },
  modeList: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  modeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTextCol: {
    flex: 1,
  },
  modeLabel: {
    fontFamily: FontFamily.headline,
    fontSize: 16,
  },
  modeDesc: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    marginTop: 2,
  },
  countRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countPill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  countText: {
    fontFamily: FontFamily.headline,
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Glass.border,
    backgroundColor: Colors.surface,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  startBtnText: {
    fontFamily: FontFamily.headline,
    fontSize: 17,
    color: '#fff',
  },
  flashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Glass.border,
    backgroundColor: Colors.surfaceContainerLow,
  },
  flashText: {
    fontFamily: FontFamily.headline,
    fontSize: 15,
  },
});
