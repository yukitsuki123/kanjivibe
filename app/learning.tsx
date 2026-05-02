/**
 * KanjiVibe — Dynamic Learning & Quiz
 * SM-2 visible intervals, responsive quiz, URL-param driven mode
 */

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Trophy, ArrowRight, BookOpen, X, Check, Eye, EyeOff, Zap } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../constants/theme';
import { FontFamily } from '../constants/typography';
import { useApp } from '../context/AppContext';
import { allWords, JapaneseWord } from '../data/curriculum';
import { intervalToString } from '../utils/srs';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.3;

type SessionMode = 'selection' | 'flashcards' | 'quiz' | 'config';
type QuizType = 'kanji_meaning' | 'meaning_kanji' | 'kanji_reading' | 'reading_kanji' | 'random';

export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    category?: string;
    mode?: string;
    quizType?: string;
    count?: string;
  }>();

  const { state, reviewKnownWord, reviewUnknownWord, toggleRomaji, addActivity, updateModuleScore, recordAnswer } = useApp();

  const resolveInitialMode = (): SessionMode => {
    if (params.mode === 'flashcards') return 'flashcards';
    if (params.mode === 'quiz') return 'quiz';
    return 'selection';
  };

  const [mode, setMode] = useState<SessionMode>(resolveInitialMode());
  const [quizType, setQuizType] = useState<QuizType>((params.quizType as QuizType) || 'random');
  const maxQuestions = params.count ? parseInt(params.count) : 0; // 0 = unlimited

  // Quiz State
  const [roundStarted, setRoundStarted] = useState(params.mode === 'quiz');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasChosen, setHasChosen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [choices, setChoices] = useState<JapaneseWord[]>([]);
  const [correctKanji, setCorrectKanji] = useState<JapaneseWord | null>(null);
  const [challengeField, setChallengeField] = useState('');
  const [choiceField, setChoiceField] = useState('');
  const [roundState, setRoundState] = useState(true);

  // Flashcard State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [srsToast, setSrsToast] = useState<{ text: string; correct: boolean } | null>(null);

  const category = params.category || 'hiragana';

  const moduleWords = useMemo(() => {
    let filtered = allWords.filter(w => w.category === category);
    if (filtered.length === 0) filtered = allWords.slice(0, 40);
    if (maxQuestions > 0) filtered = filtered.slice(0, maxQuestions);
    return filtered;
  }, [category, maxQuestions]);

  const currentFlashcard = moduleWords[currentIndex % moduleWords.length];

  // Quiz logic
  useEffect(() => {
    if (mode === 'quiz' && roundStarted && moduleWords.length > 0) {
      let randChallengeType = '';
      let randChoicesType = '';
      if (quizType === 'random') {
        const types = ['kanji', 'reading', 'meaning'];
        const randIdx = Math.floor(Math.random() * types.length);
        randChallengeType = types[randIdx];
        const remaining = types.filter(t => t !== randChallengeType);
        randChoicesType = remaining[Math.floor(Math.random() * remaining.length)];
      } else {
        const [chall, choice] = quizType.split('_');
        randChallengeType = chall;
        randChoicesType = choice;
      }

      const filteredList = moduleWords.filter(w => {
        const val = getWordValue(w, randChallengeType);
        return val && val !== '-' && val.trim() !== '';
      });

      const newChoices: JapaneseWord[] = [];
      const usedValues = new Set<string>();
      const tempFiltered = [...filteredList];

      while (newChoices.length < 4 && tempFiltered.length > 0) {
        const randIndex = Math.floor(Math.random() * tempFiltered.length);
        const selected = tempFiltered[randIndex];
        const val = getWordValue(selected, randChoicesType);
        if (val && !usedValues.has(val) && val !== '-' && val.trim() !== '') {
          newChoices.push(selected);
          usedValues.add(val);
        }
        tempFiltered.splice(randIndex, 1);
      }

      if (newChoices.length >= 2) {
        setChoices(newChoices);
        setCorrectKanji(newChoices[Math.floor(Math.random() * newChoices.length)]);
        setChallengeField(randChallengeType);
        setChoiceField(randChoicesType);
        setHasChosen(false);
        setRoundState(false);
        setMessage({ text: '', type: '' });
      }
    }
  }, [round, roundStarted, mode, moduleWords, quizType]);

  function getWordValue(word: JapaneseWord, type: string) {
    if (!word) return '';
    switch (type) {
      case 'kanji': return word.kanji;
      case 'reading': return word.hiragana || word.romaji;
      case 'meaning': return word.english;
      default: return '';
    }
  }

  function handleChoice(choice: JapaneseWord) {
    if (roundState) return;
    setHasChosen(true);
    setRoundState(true);
    const isCorrect = choice.id === correctKanji?.id;
    const wordType = ['hiragana', 'katakana'].includes(category) ? 'vocab' : 'kanji';
    recordAnswer(isCorrect, wordType as 'kanji' | 'vocab');
    if (isCorrect) {
      setScore(s => s + 1);
      setCorrectCount(c => c + 1);
      setMessage({ text: '✓ Correct!', type: 'success' });
    } else {
      setScore(s => Math.max(0, s - 1));
      setMessage({ text: '✗ Wrong', type: 'error' });
    }
    if (maxQuestions > 0 && round >= maxQuestions) {
      setTimeout(() => {
        if (category) updateModuleScore(category, score + (isCorrect ? 1 : 0));
        setMode('selection');
        setRoundStarted(false);
      }, 600);
    }
  }

  // Flashcard logic
  const pan = useRef(new Animated.ValueXY()).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const nextCard = useCallback((known: boolean) => {
    const wordType = ['hiragana', 'katakana'].includes(category) ? 'vocab' : 'kanji';
    if (known) {
      reviewKnownWord(currentFlashcard.id);
      recordAnswer(true, wordType as 'kanji' | 'vocab');
    } else {
      reviewUnknownWord(currentFlashcard.id);
      recordAnswer(false, wordType as 'kanji' | 'vocab');
    }
    const card = state.srsCards[currentFlashcard.id];
    const nextInterval = known ? (card?.interval || 1) : 1;
    setSrsToast({ text: known ? `+${intervalToString(nextInterval)}` : 'Again: 1 day', correct: known });
    setTimeout(() => setSrsToast(null), 1400);
    setIsFlipped(false);
    flipAnim.setValue(0);
    pan.setValue({ x: 0, y: 0 });
    if (currentIndex + 1 >= moduleWords.length) setMode('selection');
    else setCurrentIndex(i => i + 1);
  }, [currentFlashcard, currentIndex, moduleWords.length, category, state.srsCards]);

  const handleFlip = () => {
    Animated.spring(flipAnim, { toValue: isFlipped ? 0 : 1, friction: 8, useNativeDriver: false }).start();
    setIsFlipped(!isFlipped);
  };

  const rotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const formatCategory = (cat?: string) => {
    if (!cat) return 'PRACTICE';
    return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{currentIndex + 1}/{moduleWords.length}</Text>
        </View>
      </View>

      {/* SRS Toast */}
      {srsToast && (
        <View style={[styles.srsToast, { backgroundColor: srsToast.correct ? `${Colors.secondary}20` : `${Colors.error}20`, borderColor: srsToast.correct ? Colors.secondary : Colors.error }]}>
          <Text style={[styles.srsToastText, { color: srsToast.correct ? Colors.secondary : Colors.error }]}>
            {srsToast.correct ? '✓' : '✗'} {srsToast.text}
          </Text>
        </View>
      )}

      <View style={styles.cardArea}>
        <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={styles.card}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ perspective: 1000 }, { rotateY }] }]}>
            {/* Front */}
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: frontOpacity, zIndex: isFlipped ? 0 : 1 }]}>
              <View style={styles.cardInner}>
                <Text style={styles.cardKanji} adjustsFontSizeToFit numberOfLines={1}>
                  {currentFlashcard?.kanji}
                </Text>
                <Text style={styles.tapHint}>Tap to flip</Text>
              </View>
            </Animated.View>
            {/* Back */}
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: backOpacity, transform: [{ rotateY: '180deg' }], zIndex: isFlipped ? 1 : 0 }]}>
              <View style={[styles.cardInner, styles.cardBack]}>
                <Text style={styles.backMeaningLabel}>MEANING</Text>
                <Text style={styles.backMeaning}>{currentFlashcard?.english}</Text>
                <Text style={styles.backHiragana}>{currentFlashcard?.hiragana}</Text>
                {currentFlashcard?.onyomi && (
                  <Text style={styles.backOnyomi}>音: {currentFlashcard.onyomi}</Text>
                )}
                {/* SM-2 rate buttons shown after flip */}
                <View style={styles.rateRow}>
                  <TouchableOpacity style={[styles.rateBtn, { borderColor: Colors.error }]} onPress={() => nextCard(false)}>
                    <X size={20} color={Colors.error} />
                    <Text style={[styles.rateBtnText, { color: Colors.error }]}>Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.rateBtn, { borderColor: Colors.secondary }]} onPress={() => nextCard(true)}>
                    <Check size={20} color={Colors.secondary} />
                    <Text style={[styles.rateBtnText, { color: Colors.secondary }]}>Got it</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>

        {/* Controls (before flip) */}
        {!isFlipped && (
          <View style={styles.cardControls}>
            <TouchableOpacity style={[styles.controlBtn, { borderColor: Colors.error }]} onPress={() => nextCard(false)}>
              <X size={24} color={Colors.error} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlBtn, { borderColor: Colors.secondary }]} onPress={() => nextCard(true)}>
              <Check size={24} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  scorePill: { backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  scoreText: { fontFamily: FontFamily.labelBold, fontSize: 11, color: Colors.onSurfaceVariant },

  backBtnTop: { padding: 20 },
  selectionContent: { flex: 1, paddingHorizontal: 30, justifyContent: 'center', gap: 20 },
  selectionTitle: { fontFamily: FontFamily.headline, fontSize: 32, color: Colors.primary },
  selectionSubtitle: { fontFamily: FontFamily.body, fontSize: 16, color: Colors.onSurfaceVariant, marginBottom: 20 },
  modeCard: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: Colors.surfaceContainerLow, padding: 24, borderRadius: Radius['2xl'], borderWidth: 1, borderColor: Glass.borderGhost },
  modeIcon: { width: 56, height: 56, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.onSurface },
  modeDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 4 },

  // Quiz
  quizContent: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  progressRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  progressTrackQuiz: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
  progressFillQuiz: { height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  progressLabel: { fontFamily: FontFamily.labelBold, fontSize: 11, color: Colors.onSurfaceVariant },
  quizKanjiDisplay: { fontFamily: FontFamily.headlineLight, fontSize: 68, color: Colors.onSurface, textAlign: 'center', marginBottom: 8, maxWidth: '90%' },
  quizPrompt: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: 28 },
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 24, width: '100%' },
  choiceBtn: { flexBasis: '47%', minHeight: 90, backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', padding: 14, borderWidth: 1, borderColor: Glass.borderGhost },
  choiceCorrect: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  choiceWrong: { backgroundColor: Colors.error, borderColor: Colors.error },
  choiceText: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, color: Colors.onSurface, textAlign: 'center' },
  roundMessage: { fontFamily: FontFamily.headline, fontSize: 20, marginVertical: 12 },
  fullDetails: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: Radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 6 },
  detailText: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurface },
  detailLabel: { fontFamily: FontFamily.labelBold, color: Colors.onSurfaceVariant },
  quizFooter: { width: '100%', marginTop: 28, gap: 12 },
  nextBtn: { backgroundColor: Colors.secondary, padding: 18, borderRadius: Radius.xl, alignItems: 'center' },
  giveUpBtn: { backgroundColor: `${Colors.error}20`, padding: 14, borderRadius: Radius.xl, alignItems: 'center', borderWidth: 1, borderColor: `${Colors.error}40` },
  btnDisabled: { opacity: 0.3 },
  nextBtnText: { fontFamily: FontFamily.headline, fontSize: 16, color: '#fff' },
  giveUpText: { fontFamily: FontFamily.headline, fontSize: 14, color: Colors.error },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20, opacity: 0.5 },
  statLabel: { fontFamily: FontFamily.labelBold, fontSize: 11, color: Colors.onSurface },

  // Flashcards
  srsToast: { marginHorizontal: 24, marginBottom: 8, paddingVertical: 10, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center' },
  srsToastText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13 },
  cardArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: { width: SCREEN_W - 48, aspectRatio: 0.72, borderRadius: 36 },
  cardInner: { flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: 36, borderWidth: 1, borderColor: Glass.border, padding: 28, alignItems: 'center', justifyContent: 'center' },
  cardBack: { backgroundColor: Colors.surfaceContainerHigh },
  cardKanji: { fontFamily: FontFamily.headlineLight, fontSize: 96, color: Colors.secondary, maxWidth: '90%' },
  cardRomaji: { fontFamily: FontFamily.label, fontSize: 15, letterSpacing: 5, color: Colors.onSurfaceVariant, marginTop: 8 },
  tapHint: { position: 'absolute', bottom: 24, fontFamily: FontFamily.label, fontSize: 10, color: 'rgba(255,255,255,0.15)' },
  backMeaningLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, color: Colors.primary, marginBottom: 8 },
  backMeaning: { fontFamily: FontFamily.headline, fontSize: 34, color: Colors.onSurface, textAlign: 'center' },
  backHiragana: { fontFamily: FontFamily.body, fontSize: 20, color: Colors.onSurfaceVariant, marginTop: 8 },
  backOnyomi: { fontFamily: FontFamily.label, fontSize: 12, color: Colors.tertiary, marginTop: 6, opacity: 0.8 },
  rateRow: { flexDirection: 'row', gap: 16, marginTop: 24 },
  rateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  rateBtnText: { fontFamily: FontFamily.labelBold, fontSize: 13 },
  cardControls: { flexDirection: 'row', alignItems: 'center', gap: 30, marginTop: 36 },
  controlBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  romajiToggle: { padding: 14, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.05)' },
});
