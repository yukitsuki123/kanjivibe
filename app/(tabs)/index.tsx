/**
 * KanjiVibe — Dashboard
 * Daily stats, weekly accuracy chart, quick challenges, kanji of the day
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Flame, Trophy, ArrowRight, BookOpen, Zap, CheckCircle, Target, BarChart2 } from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useApp } from '../../context/AppContext';
import { getKanjiOfTheDay } from '../../data/curriculum';

const { width: SCREEN_W } = Dimensions.get('window');
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const QUICK_CHALLENGES = [
  { id: 'kanji-blitz', label: '5-min Kanji Blitz', emoji: '⚡', type: 'kanji', mode: 'meaning', count: 10, color: Colors.primary },
  { id: 'reading-sprint', label: 'Reading Sprint', emoji: '🔤', type: 'kanji', mode: 'reading', count: 15, color: Colors.secondary },
  { id: 'hiragana-rush', label: 'Hiragana Rush', emoji: '✍️', type: 'hiragana', mode: 'reading', count: 10, color: Colors.tertiary },
  { id: 'mixed-vocab', label: 'Mixed Vocab', emoji: '🌈', type: 'vocabulary', mode: 'meaning', count: 20, color: '#F97316' },
  { id: 'katakana-quiz', label: 'Katakana Quiz', emoji: '🎨', type: 'katakana', mode: 'character', count: 8, color: '#EC4899' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const kotd = useMemo(() => getKanjiOfTheDay(), []);

  const dailyAccuracy = state.stats.dailyAnswered > 0
    ? Math.round((state.stats.dailyCorrect / state.stats.dailyAnswered) * 100)
    : 0;

  const weeklyAccuracyArr = useMemo(() => {
    return state.stats.weeklyCorrect.map((correct, i) => {
      const answered = state.stats.weeklyAnswered[i] || 0;
      return answered > 0 ? Math.round((correct / answered) * 100) : 0;
    });
  }, [state.stats.weeklyCorrect, state.stats.weeklyAnswered]);

  const maxBar = Math.max(...weeklyAccuracyArr, 1);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ─────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View style={styles.brandContainer}>
            <View style={styles.logoWrap}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.brand}>KANJIVIBE</Text>
            </View>
          </View>
          <View style={styles.streakBadge}>
            <Flame size={16} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.streakText}>{state.stats.streak}d</Text>
          </View>
        </View>

        {/* ── Today's Stats Row ───────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <CheckCircle size={16} color={Colors.secondary} />
            <Text style={[styles.statVal, { color: Colors.secondary }]}>{state.stats.dailyCorrect}</Text>
            <Text style={styles.statLbl}>Correct</Text>
          </View>
          <View style={styles.statCard}>
            <Target size={16} color={Colors.primary} />
            <Text style={[styles.statVal, { color: Colors.primary }]}>{dailyAccuracy}%</Text>
            <Text style={styles.statLbl}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <BookOpen size={16} color={Colors.tertiary} />
            <Text style={[styles.statVal, { color: Colors.tertiary }]}>{state.stats.weeklyVocab}</Text>
            <Text style={styles.statLbl}>Vocab</Text>
          </View>
          <View style={styles.statCard}>
            <Sparkles size={16} color='#F97316' />
            <Text style={[styles.statVal, { color: '#F97316' }]}>{state.stats.weeklyKanji}</Text>
            <Text style={styles.statLbl}>Kanji</Text>
          </View>
        </View>

        {/* ── Weekly Accuracy Chart ───────────────────────────────── */}
        <GlassCard glow="none" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <BarChart2 size={16} color={Colors.primary} />
            <Text style={styles.chartTitle}>Weekly Accuracy</Text>
            <Text style={styles.chartXp}>+{state.stats.xp} XP</Text>
          </View>
          <View style={styles.chartBars}>
            {weeklyAccuracyArr.map((pct, i) => (
              <View key={i} style={styles.chartBarCol}>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: `${(pct / maxBar) * 100}%`,
                        backgroundColor: pct > 70 ? Colors.secondary : pct > 40 ? Colors.primary : Colors.tertiary,
                        opacity: pct === 0 ? 0.15 : 1,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartDayLabel}>{DAY_LABELS[i]}</Text>
                {pct > 0 && <Text style={styles.chartPctLabel}>{pct}%</Text>}
              </View>
            ))}
          </View>
        </GlassCard>

        {/* ── Kanji of the Day ───────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/learning?category=${kotd.category}`)}
        >
          <GlassCard glow="purple" style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroLabel}>KANJI OF THE DAY</Text>
                <Text style={styles.heroKanji}>{kotd.kanji}</Text>
                <Text style={styles.heroMeaning}>{kotd.english}</Text>
                <View style={styles.tagRow}>
                  <View style={styles.tag}><Text style={styles.tagText}>{kotd.jlptLevel}</Text></View>
                  <View style={styles.tag}><Text style={styles.tagText}>{kotd.category.toUpperCase()}</Text></View>
                </View>
              </View>
              <View style={styles.heroRight}>
                <Text style={styles.heroHiragana}>{kotd.hiragana}</Text>
                <Text style={styles.heroRomaji}>{kotd.romaji?.toUpperCase()}</Text>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* ── Quick Challenges ────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Challenges</Text>
          <TouchableOpacity onPress={() => router.push('/quiz-config')}>
            <Text style={styles.seeAll}>Custom →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeScroll}
        >
          {QUICK_CHALLENGES.map(ch => (
            <TouchableOpacity
              key={ch.id}
              style={[styles.challengeChip, { borderColor: `${ch.color}30`, backgroundColor: `${ch.color}10` }]}
              onPress={() =>
                router.push(`/quiz-session?type=${ch.type}&mode=${ch.mode}&count=${ch.count}`)
              }
              activeOpacity={0.8}
            >
              <Text style={styles.challengeEmoji}>{ch.emoji}</Text>
              <Text style={[styles.challengeLabel, { color: ch.color }]}>{ch.label}</Text>
              <Text style={[styles.challengeCount, { color: ch.color }]}>{ch.count}Q</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Letter Challenge ─────────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/quiz-config?preType=hiragana')}
        >
          <GlassCard glow="cyan" style={styles.challengeCard}>
            <View style={styles.challengeRow}>
              <View style={styles.challengeIcon}>
                <Zap size={24} color={Colors.secondary} fill={Colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle}>Letter Challenge</Text>
                <Text style={styles.challengeDesc}>Test your speed identifying Hiragana & Katakana.</Text>
              </View>
              <ArrowRight size={20} color={Colors.onSurfaceVariant} />
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* ── Daily Progress ──────────────────────────────────────── */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          <GlassCard glow="none" style={styles.progressCard}>
            <ProgressBar
              progress={state.stats.dailyProgress / state.stats.dailyGoal}
              label="SRS Mastery Goal"
              showPercentage
            />
            <View style={styles.progressMeta}>
              <Text style={styles.metaText}>
                {state.stats.dailyProgress} of {state.stats.dailyGoal} cards reviewed
              </Text>
              <ArrowRight size={14} color={Colors.onSurfaceVariant} />
            </View>
          </GlassCard>
        </View>

        {/* ── Recent Activity ─────────────────────────────────────── */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          {state.recentActivity?.length > 0 ? (
            <View style={styles.activityList}>
              {state.recentActivity.slice(0, 5).map((item, idx) => (
                <View key={item.id} style={[styles.activityItem, idx === 0 && { paddingTop: 0 }]}>
                  <View style={[styles.activityDot, { backgroundColor: item.type === 'quiz' ? Colors.secondary : Colors.primary }]} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityTime}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <GlassCard glow="none" style={styles.emptyActivity}>
              <Text style={styles.emptyText}>No recent activity yet. Start a session!</Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingHorizontal: 20 },

  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28, paddingHorizontal: 4 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logo: { width: 38, height: 38 },
  welcomeText: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurfaceVariant },
  brand: { fontFamily: FontFamily.headline, fontSize: 22, color: Colors.primary, letterSpacing: -1 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: `${Colors.primary}15`, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: `${Colors.primary}20` },
  streakText: { fontFamily: FontFamily.headline, fontSize: 14, color: Colors.primary },

  // Today's stats
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.xl, paddingVertical: 12, gap: 4, borderWidth: 1, borderColor: Glass.border },
  statVal: { fontFamily: FontFamily.headline, fontSize: 18 },
  statLbl: { fontFamily: FontFamily.label, fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 0.5 },

  // Weekly chart
  chartCard: { marginBottom: 16, padding: 16 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  chartTitle: { flex: 1, fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Colors.onSurface },
  chartXp: { fontFamily: FontFamily.labelBold, fontSize: 11, color: Colors.tertiary },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 70, gap: 6 },
  chartBarCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartBarTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 4 },
  chartDayLabel: { fontFamily: FontFamily.labelBold, fontSize: 9, color: Colors.onSurfaceVariant },
  chartPctLabel: { fontFamily: FontFamily.label, fontSize: 8, color: Colors.onSurfaceVariant, opacity: 0.6 },

  // Hero card
  heroCard: { padding: 0, overflow: 'hidden', marginBottom: 16 },
  heroRow: { flexDirection: 'row', padding: 24, gap: 16 },
  heroLeft: { flex: 1 },
  heroLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, color: Colors.primary, letterSpacing: 2, marginBottom: 10 },
  heroKanji: { fontFamily: FontFamily.headlineLight, fontSize: 56, color: Colors.onSurface, marginBottom: 4 },
  heroMeaning: { fontFamily: FontFamily.bodySemiBold, fontSize: 18, color: Colors.onSurfaceVariant, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  tagText: { fontFamily: FontFamily.labelBold, fontSize: 9, color: Colors.onSurfaceVariant },
  heroRight: { justifyContent: 'center', alignItems: 'center', gap: 8 },
  heroHiragana: { fontFamily: FontFamily.headline, fontSize: 28, color: Colors.primary },
  heroRomaji: { fontFamily: FontFamily.labelBold, fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 2 },

  // Quick challenges
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  seeAll: { fontFamily: FontFamily.labelBold, fontSize: 12, color: Colors.primary },
  challengeScroll: { gap: 10, paddingBottom: 4, marginBottom: 16 },
  challengeChip: { borderRadius: Radius.xl, borderWidth: 1, padding: 14, minWidth: 130, gap: 6 },
  challengeEmoji: { fontSize: 24 },
  challengeLabel: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 16 },
  challengeCount: { fontFamily: FontFamily.labelBold, fontSize: 10, opacity: 0.7 },

  // Letter challenge card
  challengeCard: { padding: 20, marginBottom: 16 },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  challengeIcon: { width: 48, height: 48, borderRadius: Radius.xl, backgroundColor: `${Colors.secondary}20`, alignItems: 'center', justifyContent: 'center' },
  challengeTitle: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  challengeDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },

  // Daily progress
  progressSection: { gap: 12, marginBottom: 24 },
  progressCard: { padding: 20 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  metaText: { fontFamily: FontFamily.body, fontSize: 12, color: Colors.onSurfaceVariant },

  // Activity
  activitySection: { marginBottom: 32 },
  activityList: { backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.xl, padding: 20, borderWidth: 1, borderColor: Glass.borderGhost },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityInfo: { flex: 1 },
  activityTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Colors.onSurface },
  activityTime: { fontFamily: FontFamily.label, fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2 },
  emptyActivity: { padding: 20, alignItems: 'center' },
  emptyText: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant },
});
