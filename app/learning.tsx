/**
 * KanjiVibe — Dynamic Learning & Quiz
 * Enhanced with pre-quiz configuration (Kanji to English, English to Kanji, etc.)
 */

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Trophy, ArrowRight, BookOpen, X, Check, Eye, EyeOff, Settings2 } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../constants/theme';
import { FontFamily } from '../constants/typography';
import { useApp } from '../context/AppContext';
import { allWords, JapaneseWord } from '../data/curriculum';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.3;

type SessionMode = 'selection' | 'flashcards' | 'quiz' | 'config';
type QuizType = 'kanji_meaning' | 'meaning_kanji' | 'kanji_reading' | 'reading_kanji' | 'random';

export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { state, reviewKnownWord, reviewUnknownWord, toggleRomaji, addActivity, updateModuleScore } = useApp();

  const [mode, setMode] = useState<SessionMode>('selection');
  const [quizType, setQuizType] = useState<QuizType>('random');
  
  // ─── Quiz State ───────────────────────────────────────────────────
  const [roundStarted, setRoundStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hasChosen, setHasChosen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [choices, setChoices] = useState<JapaneseWord[]>([]);
  const [correctKanji, setCorrectKanji] = useState<JapaneseWord | null>(null);
  const [challengeField, setChallengeField] = useState<string>('');
  const [choiceField, setChoiceField] = useState<string>('');
  const [roundState, setRoundState] = useState(true);

  // ─── Flashcard State ──────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter words
  const moduleWords = useMemo(() => {
    let filtered = allWords.filter(w => w.category === (category || 'hiragana'));
    if (filtered.length === 0) filtered = allWords.slice(0, 40);
    return filtered;
  }, [category]);

  const currentFlashcard = moduleWords[currentIndex % moduleWords.length];

  // ─── Quiz Logic ───────────────────────────────────────────────────

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

      let filteredList = moduleWords.filter(w => {
        const val = getWordValue(w, randChallengeType);
        return val && val !== '-' && val.trim() !== '';
      });

      let newChoices: JapaneseWord[] = [];
      let usedValues = new Set();
      let tempFiltered = [...filteredList];

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

      if (newChoices.length === 4) {
        setChoices(newChoices);
        setCorrectKanji(newChoices[Math.floor(Math.random() * 4)]);
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
    if (isCorrect) {
      setScore(s => s + 1);
      setMessage({ text: 'Correct!', type: 'success' });
    } else {
      setScore(s => s - 1);
      setMessage({ text: 'Wrong!', type: 'error' });
    }
  }

  // ─── Flashcard Logic ──────────────────────────────────────────────

  const pan = useRef(new Animated.ValueXY()).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const nextCard = useCallback((known: boolean) => {
    if (known) reviewKnownWord(currentFlashcard.id);
    else reviewUnknownWord(currentFlashcard.id);
    setIsFlipped(false);
    flipAnim.setValue(0);
    pan.setValue({ x: 0, y: 0 });
    if (currentIndex + 1 >= moduleWords.length) setMode('selection');
    else setCurrentIndex(i => i + 1);
  }, [currentFlashcard, currentIndex, moduleWords.length]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, g) => {
        if (Math.abs(g.dx) > SWIPE_THRESHOLD) {
          const dir = g.dx > 0 ? 'right' : 'left';
          Animated.timing(pan, { toValue: { x: dir === 'right' ? SCREEN_W * 1.5 : -SCREEN_W * 1.5, y: g.dy }, duration: 200, useNativeDriver: false }).start(() => nextCard(dir === 'right'));
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const handleFlip = () => {
    Animated.spring(flipAnim, { toValue: isFlipped ? 0 : 1, friction: 8, useNativeDriver: false }).start();
    setIsFlipped(!isFlipped);
  };

  const rotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [0, 0, 1, 1] });

  // ─── UI Views ─────────────────────────────────────────────────────

  const formatCategory = (cat?: string) => {
    if (!cat) return 'PRACTICE';
    return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    setMode('quiz');
    setRoundStarted(true);
    addActivity(`Challenged ${formatCategory(category)} (${type})`, 'quiz');
  };

  if (mode === 'selection') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtnTop} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.selectionContent}>
          <Text style={styles.selectionTitle}>{formatCategory(category)}</Text>
          <Text style={styles.selectionSubtitle}>Choose your training method</Text>
          <TouchableOpacity style={styles.modeCard} onPress={() => setMode('flashcards')}>
            <View style={[styles.modeIcon, { backgroundColor: `${Colors.primary}20` }]}><BookOpen size={24} color={Colors.primary} /></View>
            <View style={{ flex: 1 }}><Text style={styles.modeTitle}>Flashcards</Text><Text style={styles.modeDesc}>Classic SRS study. Swipe to track mastery.</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeCard} onPress={() => setMode('config')}>
            <View style={[styles.modeIcon, { backgroundColor: `${Colors.secondary}20` }]}><Trophy size={24} color={Colors.secondary} /></View>
            <View style={{ flex: 1 }}><Text style={styles.modeTitle}>Challenge Mode</Text><Text style={styles.modeDesc}>Configure your quiz and test your knowledge.</Text></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (mode === 'config') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtnTop} onPress={() => setMode('selection')}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.configContent}>
          <Text style={styles.configTitle}>Quiz Configuration</Text>
          <Text style={styles.configSubtitle}>What would you like to focus on?</Text>
          
          <View style={styles.configGrid}>
            {[
              { id: 'kanji_meaning', label: 'Kanji → English', desc: 'Identify meaning' },
              { id: 'meaning_kanji', label: 'English → Kanji', desc: 'Reverse recall' },
              { id: 'kanji_reading', label: 'Kanji → Hiragana', desc: 'Test reading' },
              { id: 'reading_kanji', label: 'Hiragana → Kanji', desc: 'Test writing' },
              { id: 'random', label: 'Random Mix', desc: 'Full challenge' },
            ].map((opt) => (
              <TouchableOpacity key={opt.id} style={styles.configItem} onPress={() => startQuiz(opt.id as QuizType)}>
                <Text style={styles.configItemLabel}>{opt.label}</Text>
                <Text style={styles.configItemDesc}>{opt.desc}</Text>
                <ArrowRight size={16} color={Colors.primary} style={styles.configArrow} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (mode === 'quiz') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { setMode('selection'); setRoundStarted(false); }}><ChevronLeft size={24} color={Colors.onSurface} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Challenge</Text>
          <View style={styles.scorePill}><Text style={styles.scoreText}>SCORE: {score}</Text></View>
        </View>
        <ScrollView contentContainerStyle={styles.quizContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.quizKanjiDisplay}>{getWordValue(correctKanji!, challengeField)}</Text>
          <Text style={styles.quizPrompt}>What is the <Text style={{ color: Colors.secondary }}>{choiceField}</Text> of this <Text style={{ color: Colors.primary }}>{challengeField}</Text> word?</Text>
          <View style={styles.choicesGrid}>
            {choices.map((choice, index) => (
              <TouchableOpacity key={index} onPress={() => handleChoice(choice)} disabled={roundState} style={[styles.choiceBtn, hasChosen && (choice.id === correctKanji?.id ? styles.choiceCorrect : styles.choiceWrong)]}>
                <Text style={[styles.choiceText, hasChosen && { color: '#fff' }]}>{getWordValue(choice, choiceField)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.roundMessage, { color: message.type === 'success' ? Colors.secondary : Colors.error }]}>{message.text}</Text>
          {hasChosen && (
            <View style={styles.fullDetails}>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Kanji:</Text> {correctKanji?.kanji}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Reading:</Text> {correctKanji?.hiragana}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Romaji:</Text> {correctKanji?.romaji?.toUpperCase()}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>English:</Text> {correctKanji?.english}</Text>
            </View>
          )}
          <View style={styles.quizFooter}>
            <TouchableOpacity style={[styles.nextBtn, !roundState && styles.btnDisabled]} onPress={() => setRound(r => r + 1)} disabled={!roundState}><Text style={styles.nextBtnText}>Next round</Text></TouchableOpacity>
            <TouchableOpacity style={styles.giveUpBtn} onPress={() => { setScore(0); setRound(1); setRoundStarted(false); setMode('selection'); if (category) updateModuleScore(category, score); }}><Text style={styles.giveUpText}>Give up</Text></TouchableOpacity>
          </View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Score: {score}</Text><Text style={styles.statLabel}>Round: {round}</Text></View>
        </ScrollView>
      </View>
    );
  }

  // Flashcards UI
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMode('selection')}><ChevronLeft size={24} color={Colors.onSurface} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={styles.scorePill}><Text style={styles.scoreText}>{currentIndex + 1}/{moduleWords.length}</Text></View>
      </View>
      <View style={styles.cardArea}>
        <Animated.View {...panResponder.panHandlers} style={[styles.card, { transform: [{ translateX: pan.x }, { rotate: pan.x.interpolate({ inputRange: [-SCREEN_W, 0, SCREEN_W], outputRange: ['-30deg', '0deg', '30deg'] }) }] }]}>
          <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={StyleSheet.absoluteFill}>
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ perspective: 1000 }, { rotateY: rotateY }] }]}>
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: frontOpacity, zIndex: isFlipped ? 0 : 1 }]}>
                <View style={styles.cardInner}>
                  <Text style={styles.cardKanji}>{currentFlashcard?.kanji}</Text>
                  {state.showRomaji && <Text style={styles.cardRomaji}>{currentFlashcard?.romaji.toUpperCase()}</Text>}
                  <Text style={styles.tapHint}>Tap to flip</Text>
                </View>
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: backOpacity, transform: [{ rotateY: '180deg' }], zIndex: isFlipped ? 1 : 0 }]}>
                <View style={[styles.cardInner, styles.cardBack]}>
                  <Text style={styles.backMeaningLabel}>MEANING</Text>
                  <Text style={styles.backMeaning}>{currentFlashcard?.english}</Text>
                  <Text style={styles.backHiragana}>{currentFlashcard?.hiragana}</Text>
                </View>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.cardControls}>
          <TouchableOpacity style={[styles.controlBtn, { borderColor: Colors.error }]} onPress={() => nextCard(false)}><X size={24} color={Colors.error} /></TouchableOpacity>
          <TouchableOpacity style={styles.romajiToggle} onPress={toggleRomaji}>{state.showRomaji ? <EyeOff size={20} color={Colors.onSurfaceVariant} /> : <Eye size={20} color={Colors.primary} />}</TouchableOpacity>
          <TouchableOpacity style={[styles.controlBtn, { borderColor: Colors.secondary }]} onPress={() => nextCard(true)}><Check size={24} color={Colors.secondary} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  scorePill: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  scoreText: { fontFamily: FontFamily.labelBold, fontSize: 11, color: Colors.onSurfaceVariant },

  backBtnTop: { padding: 20 },
  selectionContent: { flex: 1, paddingHorizontal: 30, justifyContent: 'center', gap: 20 },
  selectionTitle: { fontFamily: FontFamily.headline, fontSize: 32, color: Colors.primary },
  selectionSubtitle: { fontFamily: FontFamily.body, fontSize: 16, color: Colors.onSurfaceVariant, marginBottom: 20 },
  modeCard: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: Colors.surfaceContainerLow, padding: 24, borderRadius: Radius['2xl'], borderWidth: 1, borderColor: Glass.borderGhost },
  modeIcon: { width: 56, height: 56, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.onSurface },
  modeDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 4 },

  configContent: { padding: 30 },
  configTitle: { fontFamily: FontFamily.headline, fontSize: 28, color: Colors.onSurface, marginBottom: 8 },
  configSubtitle: { fontFamily: FontFamily.body, fontSize: 16, color: Colors.onSurfaceVariant, marginBottom: 32 },
  configGrid: { gap: 12 },
  configItem: { backgroundColor: Colors.surfaceContainerLow, padding: 20, borderRadius: Radius.xl, borderWidth: 1, borderColor: Glass.borderGhost, position: 'relative' },
  configItemLabel: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  configItemDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  configArrow: { position: 'absolute', right: 20, top: '50%', marginTop: 2 },

  quizContent: { padding: 20, alignItems: 'center' },
  quizKanjiDisplay: { fontFamily: FontFamily.headlineLight, fontSize: 72, color: Colors.onSurface, textAlign: 'center', marginBottom: 12 },
  quizPrompt: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: 32 },
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 24 },
  choiceBtn: { width: (SCREEN_W - 60) / 2, height: 110, backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: Glass.borderGhost },
  choiceCorrect: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  choiceWrong: { backgroundColor: Colors.error, borderColor: Colors.error },
  choiceText: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, color: Colors.onSurface, textAlign: 'center' },

  roundMessage: { fontFamily: FontFamily.headline, fontSize: 18, marginVertical: 16 },
  fullDetails: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: Radius.xl, borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)', gap: 8 },
  detailText: { fontFamily: FontFamily.body, fontSize: 15, color: '#fff' },
  detailLabel: { fontFamily: FontFamily.labelBold, color: Colors.onSurfaceVariant },

  quizFooter: { width: '100%', marginTop: 32, gap: 12 },
  nextBtn: { backgroundColor: Colors.secondary, padding: 18, borderRadius: Radius.xl, alignItems: 'center' },
  giveUpBtn: { backgroundColor: Colors.error, padding: 18, borderRadius: Radius.xl, alignItems: 'center' },
  btnDisabled: { opacity: 0.3 },
  nextBtnText: { fontFamily: FontFamily.headline, fontSize: 16, color: '#fff' },
  giveUpText: { fontFamily: FontFamily.headline, fontSize: 16, color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 24, opacity: 0.5 },
  statLabel: { fontFamily: FontFamily.labelBold, fontSize: 12, color: Colors.onSurface },

  cardArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  card: { width: SCREEN_W - 80, aspectRatio: 0.75, borderRadius: 40 },
  cardInner: { flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: 40, borderWidth: 1, borderColor: Glass.border, padding: 30, alignItems: 'center', justifyContent: 'center' },
  cardBack: { backgroundColor: Colors.surfaceContainerHigh },
  cardKanji: { fontFamily: FontFamily.headlineLight, fontSize: 110, color: Colors.secondary },
  cardRomaji: { fontFamily: FontFamily.label, fontSize: 16, letterSpacing: 6, color: Colors.onSurfaceVariant, marginTop: 10 },
  tapHint: { position: 'absolute', bottom: 30, fontFamily: FontFamily.label, fontSize: 10, color: 'rgba(255,255,255,0.2)' },
  backMeaningLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, color: Colors.primary, marginBottom: 10 },
  backMeaning: { fontFamily: FontFamily.headline, fontSize: 36, color: Colors.onSurface, textAlign: 'center' },
  backHiragana: { fontFamily: FontFamily.body, fontSize: 22, color: Colors.onSurfaceVariant, marginTop: 10 },
  cardControls: { flexDirection: 'row', alignItems: 'center', gap: 30, marginTop: 40 },
  controlBtn: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  romajiToggle: { padding: 15, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.05)' },
});
