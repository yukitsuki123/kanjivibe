/**
 * KanjiVibe — Letters Quiz
 * Multiple choice challenge for Hiragana, Katakana, and Romaji
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trophy, Zap, AlertCircle } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../constants/theme';
import { FontFamily } from '../constants/typography';
import { rawLetters } from '../data/curriculum';

const { width: SCREEN_W } = Dimensions.get('window');

type QuizChar = { hiragana: string; katakana: string; romaji: string };
type ChallengeType = 'hiragana' | 'katakana' | 'romaji';

export default function LettersQuiz() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, addActivity } = useApp();

  useEffect(() => {
    addActivity('Started Letter Quiz', 'quiz');
  }, []);
  const [quizType, setQuizType] = useState<ChallengeType>('hiragana');
  const [quizChar, setQuizChar] = useState<QuizChar | null>(null);
  const [options, setOptions] = useState<QuizChar[]>([]);
  const [message, setMessage] = useState<{ answer: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  const generateChoices = useCallback(() => {
    const shuffled = [...rawLetters].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 4);
    
    const types: ChallengeType[] = ['hiragana', 'katakana', 'romaji'];
    const currentQuizType = types[Math.floor(Math.random() * 3)];
    const remainingTypes = types.filter(t => t !== currentQuizType);
    const currentMode = remainingTypes[Math.floor(Math.random() * 2)];
    
    const correctChoice = choices[Math.floor(Math.random() * 4)];
    
    setOptions(choices);
    setQuizType(currentQuizType);
    setQuizChar(correctChoice);
    setMode(currentMode);
  }, []);

  useEffect(() => {
    generateChoices();
  }, [generateChoices]);

  const checkAnswer = (answer: string) => {
    if (!quizChar) return;

    const isCorrect = answer === quizChar[mode];
    if (isCorrect) {
      setMessage({
        answer: true,
        text: `✅ ${quizChar.romaji.toUpperCase()} = ${quizChar.katakana} = ${quizChar.hiragana}`
      });
      setScore(s => s + 1);
    } else {
      setMessage({
        answer: false,
        text: `❌ Correct: ${quizChar[mode]}`
      });
      setScore(s => Math.max(0, s - 1));
    }

    // Auto-generate next after delay
    setTimeout(() => {
      setMessage(null);
      generateChoices();
    }, 1500);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Letter Quiz</Text>
        <View style={styles.scoreContainer}>
          <Zap size={14} color={Colors.tertiary} fill={Colors.tertiary} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Message Toast */}
      {message && (
        <View style={[
          styles.messageBox, 
          { backgroundColor: message.answer ? `${Colors.secondary}20` : `${Colors.error}20` },
          { borderColor: message.answer ? Colors.secondary : Colors.error }
        ]}>
          <Text style={[styles.messageText, { color: message.answer ? Colors.secondary : Colors.error }]}>
            {message.text}
          </Text>
        </View>
      )}

      {/* Quiz Area */}
      <View style={styles.quizArea}>
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>IDENTIFY THIS {quizType.toUpperCase()}</Text>
          <Text style={styles.questionChar}>{quizChar ? quizChar[quizType] : '?'}</Text>
        </View>

        <View style={styles.optionsGrid}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionBtn}
              onPress={() => checkAnswer(option[mode])}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option[mode]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer Hint */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.hintBox}>
          <AlertCircle size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.hintText}>Tap the correct {mode} equivalent</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.onSurface },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: `${Colors.tertiary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  scoreText: { fontFamily: FontFamily.labelBold, fontSize: 14, color: Colors.tertiary },

  messageBox: { marginHorizontal: 20, marginTop: 8, paddingVertical: 12, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center' },
  messageText: { fontFamily: FontFamily.bodySemiBold, fontSize: 14 },

  quizArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 40 },
  questionCard: { alignItems: 'center', gap: 16 },
  questionLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, letterSpacing: 2, color: Colors.onSurfaceVariant },
  questionChar: { fontFamily: FontFamily.headlineLight, fontSize: 100, color: Colors.primary, textAlign: 'center' },

  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  optionBtn: { 
    width: (SCREEN_W - 80) / 2, 
    aspectRatio: 1, 
    backgroundColor: Colors.surfaceContainerLow, 
    borderRadius: Radius['2xl'], 
    borderWidth: 1, 
    borderColor: Glass.border,
    alignItems: 'center', 
    justifyContent: 'center',
    ...Shadows.tabBarGlow
  },
  optionText: { fontFamily: FontFamily.headline, fontSize: 32, color: Colors.onSurface },

  footer: { alignItems: 'center' },
  hintBox: { flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.4 },
  hintText: { fontFamily: FontFamily.label, fontSize: 11, color: Colors.onSurfaceVariant },
});
