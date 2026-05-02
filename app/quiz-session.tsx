import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Glass } from '../constants/theme';
import { FontFamily } from '../constants/typography';
import { useApp } from '../context/AppContext';
import { allWords } from '../data/curriculum';

// --- Fisher-Yates Shuffle ---
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Question {
  id: string;
  wordId: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

export default function QuizSessionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, recordAnswer, updateModuleScore, reviewKnownWord, reviewUnknownWord } = useApp();
  const params = useLocalSearchParams<{ type: string; mode: string; count: string; category?: string }>();

  const type = params.type ?? 'kanji';
  const mode = params.mode ?? 'meaning';
  const count = parseInt(params.count ?? '10', 10);
  const category = params.category;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  // Generate Questions
  useEffect(() => {
    let sourceWords = allWords;
    if (category && category !== 'undefined') {
      sourceWords = allWords.filter(w => w.category === category);
    } else {
      sourceWords = allWords.filter(w => w.id.startsWith(type));
    }

    if (sourceWords.length === 0) sourceWords = allWords;

    // Shuffle and pick top N
    const shuffledPool = shuffleArray(sourceWords);
    const selectedWords = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

    const generated: Question[] = selectedWords.map(word => {
      let qText = '';
      let correct = '';
      let poolForDistractors: string[] = [];

      if (mode === 'meaning') {
        qText = word.kanji || word.hiragana;
        correct = word.english;
        poolForDistractors = sourceWords.map(w => w.english);
      } else if (mode === 'reading') {
        qText = word.kanji || word.english;
        correct = word.romaji || word.hiragana;
        poolForDistractors = sourceWords.map(w => w.romaji || w.hiragana);
      } else if (mode === 'character') {
        qText = word.english || word.romaji;
        correct = word.kanji || word.hiragana;
        poolForDistractors = sourceWords.map(w => w.kanji || w.hiragana);
      } else {
        qText = word.kanji;
        correct = word.english;
        poolForDistractors = sourceWords.map(w => w.english);
      }

      // Ensure distractors are unique and valid
      poolForDistractors = Array.from(new Set(poolForDistractors.filter(p => p && p !== correct)));
      const shuffledPoolForDist = shuffleArray(poolForDistractors);
      const distractors = shuffledPoolForDist.slice(0, 3);

      const options = shuffleArray([correct, ...distractors]);

      return {
        id: Math.random().toString(),
        wordId: word.id,
        question: qText,
        correctAnswer: correct,
        options,
      };
    });

    setQuestions(generated);
  }, [type, mode, count, category]);

  // Update Progress Bar
  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progressAnim, {
        toValue: current / questions.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [current, questions.length]);

  function shake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function handleAnswer(option: string) {
    if (answered) return;
    const q = questions[current];
    const isCorrect = option === q.correctAnswer;
    setSelected(option);
    setAnswered(true);

    // Record SRS progress & Stats
    const wordType = (params.type === 'hiragana' || params.type === 'katakana') ? 'vocab' : (params.type as 'kanji' | 'vocab');
    recordAnswer(isCorrect, wordType);
    if (isCorrect) {
      reviewKnownWord(q.wordId);
    } else {
      reviewUnknownWord(q.wordId);
    }

    if (isCorrect) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.spring(cardScale, { toValue: 1.05, useNativeDriver: true }).start(() => {
        Animated.spring(cardScale, { toValue: 1, useNativeDriver: true }).start();
      });
      setScore(s => s + 1);
    } else {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
    }

    // Fast transition as requested
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        if (category) {
          updateModuleScore(category, score + (isCorrect ? 1 : 0));
        }
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
        setAnswered(false);
      }
    }, 1700); // Balanced transition to allow seeing feedback
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (questions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.surface }]}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>Preparing quiz...</Text>
      </View>
    );
  }

  if (done) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.root, { backgroundColor: Colors.surface, paddingTop: topPad + 20 }]}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultKanji}>完</Text>
          <Text style={styles.resultScore}>{score}/{questions.length}</Text>
          <Text style={styles.resultAccuracy}>{accuracy}% accuracy</Text>

          <View style={styles.resultBadges}>
            <View style={[styles.accBadge, {
              backgroundColor: accuracy >= 70 ? `${Colors.secondary}20` : `${Colors.error}20`,
              borderColor: accuracy >= 70 ? Colors.secondary : Colors.error
            }]}>
              <Text style={[styles.accBadgeText, { color: accuracy >= 70 ? Colors.secondary : Colors.error }]}>
                {accuracy >= 90 ? "Excellent" : accuracy >= 70 ? "Good" : accuracy >= 50 ? "Keep going" : "Keep practicing"}
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.homeBtn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.homeBtnText}>Return to Catalog</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const q = questions[current];

  return (
    <View style={[styles.root, { backgroundColor: Colors.surface }]}>
      <View style={[styles.container, { paddingTop: topPad + 8 }]}>
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Text style={styles.exitText}>✕</Text>
          </Pressable>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.countText}>{current + 1}/{questions.length}</Text>
        </View>

        {/* Score & Type Info */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>⚡ {score}</Text>
          </View>
          <Text style={styles.typeLabel}>{type.toUpperCase()} • {mode.toUpperCase()}</Text>
        </View>

        {/* Question Card */}
        <Animated.View
          style={[
            styles.questionCard,
            { transform: [{ translateX: shakeAnim }, { scale: cardScale }] }
          ]}
        >
          <Text style={styles.questionPrompt}>
            {mode === "meaning" ? "What does this mean?" : mode === "reading" ? "How do you read this?" : "Which character?"}
          </Text>
          <Text style={styles.questionText} adjustsFontSizeToFit numberOfLines={2}>{q.question}</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsGrid}>
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.correctAnswer;
            const isSelected = opt === selected;

            let bgColor: string = Colors.surfaceContainerLow;
            let borderColor: string = Glass.border;
            let textColor: string = Colors.onSurface;

            if (answered) {
              if (isCorrect) {
                bgColor = `${Colors.secondary}20`;
                borderColor = Colors.secondary;
                textColor = Colors.secondary;
              } else if (isSelected && !isCorrect) {
                bgColor = `${Colors.error}20`;
                borderColor = Colors.error;
                textColor = Colors.error;
              }
            } else if (isSelected) {
              bgColor = `${Colors.primary}20`;
              borderColor = Colors.primary;
            }

            return (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.optionBtn,
                  { backgroundColor: bgColor, borderColor, opacity: pressed && !answered ? 0.8 : 1 },
                ]}
                onPress={() => handleAnswer(opt)}
                disabled={answered}
              >
                <Text style={[styles.optionText, { color: textColor }]} numberOfLines={2}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  container: { flex: 1, paddingHorizontal: 20 },

  progressHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  exitText: { fontSize: 20, fontFamily: FontFamily.headline, color: Colors.onSurfaceVariant },
  progressBarBg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: Colors.surfaceContainerHighest, overflow: "hidden" },
  progressBarFill: { height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  countText: { fontSize: 13, fontFamily: FontFamily.labelBold, color: Colors.onSurfaceVariant, minWidth: 32 },

  scoreRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 24 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: `${Colors.primary}20`, borderWidth: 1, borderColor: `${Colors.primary}40` },
  scoreBadgeText: { fontSize: 13, fontFamily: FontFamily.labelBold, color: Colors.primary },
  typeLabel: { fontSize: 11, fontFamily: FontFamily.labelBold, color: Colors.onSurfaceVariant, letterSpacing: 0.8 },

  questionCard: {
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: Glass.border,
    backgroundColor: Colors.surfaceContainer,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
    minHeight: 180,
    justifyContent: "center"
  },
  questionPrompt: { fontSize: 13, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 12 },
  questionText: { fontSize: 60, fontFamily: FontFamily.headline, color: Colors.onSurface, textAlign: "center" },

  optionsGrid: { gap: 12 },
  optionBtn: { padding: 18, borderRadius: Radius.xl, borderWidth: 1.5, alignItems: "center" },
  optionText: { fontSize: 16, fontFamily: FontFamily.labelBold, textAlign: "center" },

  resultsContainer: { flex: 1, alignItems: "center", paddingHorizontal: 32, justifyContent: "center" },
  resultTitle: { fontSize: 24, fontFamily: FontFamily.headline, color: Colors.onSurface, marginBottom: 8 },
  resultKanji: { fontSize: 100, fontFamily: FontFamily.headline, color: `${Colors.primary}40`, marginVertical: -10 },
  resultScore: { fontSize: 48, fontFamily: FontFamily.headline, color: Colors.onSurface, marginTop: 8 },
  resultAccuracy: { fontSize: 16, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 4, marginBottom: 24 },
  resultBadges: { flexDirection: "row", gap: 10, marginBottom: 40 },
  accBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  accBadgeText: { fontSize: 14, fontFamily: FontFamily.labelBold },

  homeBtn: { width: "100%", paddingVertical: 18, borderRadius: 16, alignItems: "center", backgroundColor: Colors.primary, marginBottom: 12 },
  homeBtnText: { fontSize: 16, fontFamily: FontFamily.headline, color: "#fff" },
});
