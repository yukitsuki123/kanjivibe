/**
 * KanjiVibe — Global App Context
 * Manages romaji toggle, SM-2 SRS progress, user stats, daily analytics, and per-module scores
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SRSCard, Category } from '../data/curriculum';
import { createSRSCard, reviewKnown, reviewUnknown } from '../utils/srs';

// ─── State Types ─────────────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  type: 'learning' | 'quiz' | 'mastery';
}

interface UserStats {
  level: number;
  xp: number;
  streak: number;
  lastStudyDate: string;
  totalMastered: number;
  dailyGoal: number;
  dailyProgress: number;
  monthlyMastered: number;
  moduleScores: Record<string, number>;
  // Daily answer tracking
  dailyCorrect: number;
  dailyAnswered: number;
  // Weekly analytics [Mon=0 .. Sun=6]
  weeklyCorrect: number[];
  weeklyAnswered: number[];
  weeklyKanji: number;
  weeklyVocab: number;
}

export type FontSize = 'small' | 'medium' | 'large';

interface AppState {
  showRomaji: boolean;
  darkMode: boolean;
  fontSize: FontSize;
  srsCards: Record<string, SRSCard>;
  stats: UserStats;
  recentActivity: Activity[];
  ready: boolean;
}

type AppAction =
  | { type: 'SET_ROMAJI'; payload: boolean }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_FONT_SIZE'; payload: FontSize }
  | { type: 'REVIEW_KNOWN'; payload: string }
  | { type: 'REVIEW_UNKNOWN'; payload: string }
  | { type: 'RECORD_ANSWER'; payload: { correct: boolean; wordType: 'kanji' | 'vocab' } }
  | { type: 'ADD_ACTIVITY'; payload: Omit<Activity, 'id'> }
  | { type: 'SET_DAILY_GOAL'; payload: number }
  | { type: 'UPDATE_MODULE_SCORE'; payload: { category: string; score: number } }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'SET_READY' }
  | { type: 'RESET_PROGRESS' };

// ─── Initial State ───────────────────────────────────────────────────

const defaultStats: UserStats = {
  level: 1,
  xp: 0,
  streak: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalMastered: 0,
  dailyGoal: 20,
  dailyProgress: 0,
  monthlyMastered: 0,
  moduleScores: {},
  dailyCorrect: 0,
  dailyAnswered: 0,
  weeklyCorrect: [0, 0, 0, 0, 0, 0, 0],
  weeklyAnswered: [0, 0, 0, 0, 0, 0, 0],
  weeklyKanji: 0,
  weeklyVocab: 0,
};

const initialState: AppState = {
  showRomaji: true,
  darkMode: true,
  fontSize: 'medium',
  srsCards: {},
  stats: defaultStats,
  recentActivity: [],
  ready: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────

function getDayIndex(): number {
  // 0=Mon, 1=Tue, ... 6=Sun
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// ─── Reducer ─────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROMAJI':
      return { ...state, showRomaji: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };

    case 'REVIEW_KNOWN': {
      const card = state.srsCards[action.payload] || createSRSCard(action.payload);
      const updated = reviewKnown(card);
      const xpGain = 10;
      const newXp = state.stats.xp + xpGain;
      return {
        ...state,
        srsCards: { ...state.srsCards, [action.payload]: updated },
        stats: {
          ...state.stats,
          xp: newXp,
          level: Math.floor(newXp / 100) + 1,
          dailyProgress: state.stats.dailyProgress + 1,
          totalMastered: updated.repetitions === 3 ? state.stats.totalMastered + 1 : state.stats.totalMastered,
        },
      };
    }

    case 'REVIEW_UNKNOWN': {
      const card = state.srsCards[action.payload] || createSRSCard(action.payload);
      const updated = reviewUnknown(card);
      return {
        ...state,
        srsCards: { ...state.srsCards, [action.payload]: updated },
        stats: { ...state.stats, dailyProgress: state.stats.dailyProgress + 1 },
      };
    }

    case 'RECORD_ANSWER': {
      const { correct, wordType } = action.payload;
      const dayIdx = getDayIndex();
      const newWeeklyCorrect = [...state.stats.weeklyCorrect];
      const newWeeklyAnswered = [...state.stats.weeklyAnswered];
      if (correct) newWeeklyCorrect[dayIdx] = (newWeeklyCorrect[dayIdx] || 0) + 1;
      newWeeklyAnswered[dayIdx] = (newWeeklyAnswered[dayIdx] || 0) + 1;
      const xpGain = correct ? 5 : 0;
      const newXp = state.stats.xp + xpGain;
      return {
        ...state,
        stats: {
          ...state.stats,
          xp: newXp,
          level: Math.floor(newXp / 100) + 1,
          dailyCorrect: correct ? state.stats.dailyCorrect + 1 : state.stats.dailyCorrect,
          dailyAnswered: state.stats.dailyAnswered + 1,
          dailyProgress: state.stats.dailyProgress + 1,
          weeklyCorrect: newWeeklyCorrect,
          weeklyAnswered: newWeeklyAnswered,
          weeklyKanji: wordType === 'kanji' ? state.stats.weeklyKanji + 1 : state.stats.weeklyKanji,
          weeklyVocab: wordType === 'vocab' ? state.stats.weeklyVocab + 1 : state.stats.weeklyVocab,
        },
      };
    }

    case 'ADD_ACTIVITY':
      return {
        ...state,
        recentActivity: [
          { ...action.payload, id: Math.random().toString(36).substr(2, 9) },
          ...state.recentActivity.slice(0, 9),
        ],
      };

    case 'UPDATE_MODULE_SCORE': {
      const currentScore = state.stats.moduleScores[action.payload.category] || 0;
      return {
        ...state,
        stats: {
          ...state.stats,
          moduleScores: {
            ...state.stats.moduleScores,
            [action.payload.category]: Math.max(currentScore, action.payload.score),
          }
        }
      };
    }

    case 'SET_DAILY_GOAL':
      return { ...state, stats: { ...state.stats, dailyGoal: action.payload } };

    case 'LOAD_STATE':
      return { ...state, ...action.payload, ready: true };

    case 'SET_READY':
      return { ...state, ready: true };

    case 'RESET_PROGRESS':
      return { ...initialState, ready: true };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  toggleRomaji: () => void;
  setDarkMode: (val: boolean) => void;
  setFontSize: (val: FontSize) => void;
  reviewKnownWord: (wordId: string) => void;
  reviewUnknownWord: (wordId: string) => void;
  recordAnswer: (correct: boolean, wordType: 'kanji' | 'vocab') => void;
  addActivity: (title: string, type: Activity['type']) => void;
  updateModuleScore: (category: string, score: number) => void;
  setDailyGoal: (goal: number) => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@kanjivibe_state');
        if (saved) {
          const parsed = JSON.parse(saved);

          // Ensure nested objects exist
          if (parsed.stats) {
            parsed.stats.moduleScores = parsed.stats.moduleScores || {};
            parsed.stats.dailyCorrect = parsed.stats.dailyCorrect ?? 0;
            parsed.stats.dailyAnswered = parsed.stats.dailyAnswered ?? 0;
            parsed.stats.weeklyCorrect = parsed.stats.weeklyCorrect ?? [0,0,0,0,0,0,0];
            parsed.stats.weeklyAnswered = parsed.stats.weeklyAnswered ?? [0,0,0,0,0,0,0];
            parsed.stats.weeklyKanji = parsed.stats.weeklyKanji ?? 0;
            parsed.stats.weeklyVocab = parsed.stats.weeklyVocab ?? 0;
          }
          parsed.recentActivity = parsed.recentActivity || [];

          const today = new Date().toISOString().split('T')[0];
          if (parsed.stats?.lastStudyDate !== today) {
            parsed.stats = {
              ...parsed.stats,
              dailyProgress: 0,
              dailyCorrect: 0,
              dailyAnswered: 0,
              lastStudyDate: today,
              streak: parsed.stats?.lastStudyDate === yesterday() ? (parsed.stats?.streak || 0) + 1 : 1,
            };
          }
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        } else {
          dispatch({ type: 'SET_READY' });
        }
      } catch {
        dispatch({ type: 'SET_READY' });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    AsyncStorage.setItem('@kanjivibe_state', JSON.stringify({
      showRomaji: state.showRomaji,
      darkMode: state.darkMode,
      fontSize: state.fontSize,
      srsCards: state.srsCards,
      stats: state.stats,
      recentActivity: state.recentActivity,
    })).catch(() => {});
  }, [state]);

  const toggleRomaji = useCallback(() => dispatch({ type: 'SET_ROMAJI', payload: !state.showRomaji }), [state.showRomaji]);
  const setDarkMode = useCallback((val: boolean) => dispatch({ type: 'SET_DARK_MODE', payload: val }), []);
  const setFontSize = useCallback((val: FontSize) => dispatch({ type: 'SET_FONT_SIZE', payload: val }), []);
  const reviewKnownWord = useCallback((id: string) => dispatch({ type: 'REVIEW_KNOWN', payload: id }), []);
  const reviewUnknownWord = useCallback((id: string) => dispatch({ type: 'REVIEW_UNKNOWN', payload: id }), []);
  const recordAnswer = useCallback((correct: boolean, wordType: 'kanji' | 'vocab') =>
    dispatch({ type: 'RECORD_ANSWER', payload: { correct, wordType } }), []);
  const addActivity = useCallback((title: string, type: Activity['type']) =>
    dispatch({ type: 'ADD_ACTIVITY', payload: { title, type, timestamp: new Date().toISOString() } }), []);
  const updateModuleScore = useCallback((category: string, score: number) =>
    dispatch({ type: 'UPDATE_MODULE_SCORE', payload: { category, score } }), []);
  const setDailyGoal = useCallback((goal: number) => dispatch({ type: 'SET_DAILY_GOAL', payload: goal }), []);
  const resetProgress = useCallback(() => dispatch({ type: 'RESET_PROGRESS' }), []);

  return (
    <AppContext.Provider value={{
      state, toggleRomaji, setDarkMode, setFontSize, reviewKnownWord, reviewUnknownWord,
      recordAnswer, addActivity, updateModuleScore, setDailyGoal, resetProgress
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
