/**
 * KanjiVibe — Dashboard
 * High-performance bento grid navigation with personalized progress tracking
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  ArrowRight, 
  BookOpen, 
  Waves,
  MessageCircle,
  Zap,
  Globe,
  PenTool,
  Type
} from 'lucide-react-native';
import { Colors, Radius, Glass, Shadows } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { OrganicBlob } from '../../components/ui/OrganicBlob';
import { useApp } from '../../context/AppContext';
import { getKanjiOfTheDay } from '../../data/curriculum';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  const kotd = useMemo(() => getKanjiOfTheDay(), []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Dashboard Content */}

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <View style={styles.brandRow}>
              <Text style={styles.brand}>KANJIVIBE</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Flame size={16} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.statValue}>{state.stats.streak}</Text>
          </View>
          <View style={styles.statChip}>
            <Trophy size={16} color={Colors.tertiary} />
            <Text style={styles.statValue}>LVL {state.stats.level}</Text>
          </View>
          <View style={styles.statChip}>
            <Sparkles size={16} color={Colors.secondary} />
            <Text style={styles.statValue}>{state.stats.xp} XP</Text>
          </View>
        </View>

        {/* ─── Hero Card: Kanji of the Day ─── */}
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
                <View style={styles.circleProgress}>
                  <Text style={styles.progressVal}>72%</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* ─── Challenge Card ─── */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push('/letters-quiz')}
          style={{ marginBottom: 24 }}
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

        {/* ─── Module Bento Grid ─── */}
        <View style={styles.bentoGrid}>
          {/* Hiragana — Large Card */}
          <View style={styles.bentoLarge}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.bentoCard, styles.bentoLargeInner]}
              onPress={() => router.push('/learning?category=hiragana')}
            >
              <View style={styles.bentoHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>46 LESSONS</Text>
                </View>
                <Type size={20} color={Colors.primary} />
              </View>
              <Text style={styles.kanjiLarge}>あ</Text>
              <View style={{ marginTop: 'auto' }}>
                <Text style={styles.cardTitle}>Hiragana</Text>
                <Text style={styles.cardDesc}>The phonetic foundation of Japanese writing.</Text>
              </View>
            </TouchableOpacity>
            </View>

          {/* Katakana — Wide Card */}
          <View style={styles.bentoWide}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.bentoCard, styles.bentoWideInner]}
              onPress={() => router.push('/learning?category=katakana')}
            >
              <View style={styles.animalRow}>
                <View style={styles.animalThumb}>
                  <Type size={32} color={Colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.animalHeader}>
                    <Text style={styles.cardTitleSm}>Katakana</Text>
                    <Text style={[styles.kanjiSmall, { color: Colors.secondary }]}>ア</Text>
                  </View>
                  <Text style={styles.cardDescSm}>Master loanwords and modern emphasis.</Text>
                </View>
              </View>
            </TouchableOpacity>
            </View>

          {/* Small Cards Row */}
          <View style={styles.smallRow}>
            <View style={styles.bentoSmall}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={[styles.bentoCard, styles.bentoSmallInner]}
                onPress={() => router.push('/learning?category=kanji_basic')}
              >
                <View style={[styles.smallIcon, { backgroundColor: `${Colors.tertiary}30` }]}>
                  <Zap size={18} color={Colors.tertiary} />
                </View>
                <Text style={styles.cardTitleSm}>Numbers</Text>
                <Text style={[styles.kanjiSmall, { color: Colors.tertiary }]}>一</Text>
              </TouchableOpacity>
              </View>

            <View style={styles.bentoSmall}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={[styles.bentoCard, styles.bentoSmallInner]}
                onPress={() => router.push('/learning?category=greetings')}
              >
                <View style={[styles.smallIcon, { backgroundColor: `${Colors.primary}30` }]}>
                  <MessageCircle size={18} color={Colors.primary} />
                </View>
                <Text style={styles.cardTitleSm}>Greetings</Text>
                <Text style={[styles.kanjiSmall, { color: Colors.primary }]}>話</Text>
              </TouchableOpacity>
              </View>
          </View>
        </View>

        {/* ─── Recent Activity ─── */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          
          {state.recentActivity?.length > 0 ? (
            <View style={styles.activityList}>
              {state.recentActivity.slice(0, 3).map((item, idx) => (
                <View key={item.id} style={[styles.activityItem, idx === 0 && { paddingTop: 0 }]}>
                  <View style={[styles.activityDot, { backgroundColor: item.type === 'quiz' ? Colors.secondary : Colors.primary }]} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <ArrowRight size={14} color={Colors.onSurfaceVariant} opacity={0.3} />
                </View>
              ))}
            </View>
          ) : (
            <GlassCard glow="none" style={styles.emptyActivity}>
              <Text style={styles.emptyText}>No recent activity yet. Start a session!</Text>
            </GlassCard>
          )}
        </View>

        {/* ─── Daily Progress ─── */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          <GlassCard glow="none" style={styles.progressCard}>
            <ProgressBar 
              progress={state.stats.dailyProgress / state.stats.dailyGoal} 
              label="SRS Mastery Goal" 
              showPercentage 
            />
            <View style={styles.progressMeta}>
              <Text style={styles.metaText}>{state.stats.dailyProgress} of {state.stats.dailyGoal} cards reviewed</Text>
              <ArrowRight size={14} color={Colors.onSurfaceVariant} />
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingHorizontal: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  welcomeText: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurfaceVariant },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  brand: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.primary, letterSpacing: -1 },
  avatarBtn: { padding: 4 },
  avatar: { width: 42, height: 42, borderRadius: Radius.full, backgroundColor: Colors.surfaceContainerHigh },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statValue: { fontFamily: FontFamily.labelBold, fontSize: 12, color: Colors.onSurface },

  // Hero Card
  heroCard: { padding: 0, overflow: 'hidden' },
  heroRow: { flexDirection: 'row', padding: 24, gap: 16 },
  heroLeft: { flex: 1 },
  heroLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, color: Colors.primary, letterSpacing: 2, marginBottom: 12 },
  heroKanji: { fontFamily: FontFamily.headlineLight, fontSize: 56, color: Colors.onSurface, marginBottom: 4 },
  heroMeaning: { fontFamily: FontFamily.bodySemiBold, fontSize: 18, color: Colors.onSurfaceVariant, marginBottom: 16 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  tagText: { fontFamily: FontFamily.labelBold, fontSize: 9, color: Colors.onSurfaceVariant },
  heroRight: { justifyContent: 'center' },
  circleProgress: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: 'rgba(255,255,255,0.05)', borderTopColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  progressVal: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },

  // Challenge Card
  challengeCard: { padding: 20 },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  challengeIcon: { width: 48, height: 48, borderRadius: Radius.xl, backgroundColor: `${Colors.secondary}20`, alignItems: 'center', justifyContent: 'center' },
  challengeTitle: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  challengeDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },

  // Bento Grid
  bentoGrid: { gap: 16, marginBottom: 24 },
  bentoCard: { backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius['2xl'], borderWidth: 1, borderColor: Glass.borderGhost, padding: 20 },
  bentoLarge: { width: '100%' },
  bentoLargeInner: { minHeight: 220 },
  bentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badge: { backgroundColor: `${Colors.primary}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontFamily: FontFamily.labelBold, fontSize: 9, color: Colors.primary },
  kanjiLarge: { fontFamily: FontFamily.headlineLight, fontSize: 80, color: Colors.primary, opacity: 0.9, position: 'absolute', right: 10, top: 40 },
  cardTitle: { fontFamily: FontFamily.headline, fontSize: 24, color: Colors.onSurface, marginBottom: 4 },
  cardDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, maxWidth: '70%' },

  bentoWide: { width: '100%' },
  bentoWideInner: { minHeight: 110, justifyContent: 'center' },
  animalRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  animalThumb: { width: 60, height: 60, borderRadius: Radius.xl, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  animalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitleSm: { fontFamily: FontFamily.bodySemiBold, fontSize: 16, color: Colors.onSurface },
  kanjiSmall: { fontFamily: FontFamily.headline, fontSize: 20 },
  cardDescSm: { fontFamily: FontFamily.body, fontSize: 12, color: Colors.onSurfaceVariant },
  miniProgress: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  miniTrack: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
  miniFill: { height: 4, borderRadius: 2 },
  miniPercent: { fontFamily: FontFamily.labelBold, fontSize: 10 },

  smallRow: { flexDirection: 'row', gap: 16 },
  bentoSmall: { flex: 1 },
  bentoSmallInner: { height: 160, gap: 12 },
  smallIcon: { width: 36, height: 36, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },

  activitySection: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAll: { fontFamily: FontFamily.labelBold, fontSize: 12, color: Colors.primary },
  activityList: { backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.xl, padding: 20, borderWidth: 1, borderColor: Glass.borderGhost },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityInfo: { flex: 1 },
  activityTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Colors.onSurface },
  activityTime: { fontFamily: FontFamily.label, fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2 },
  emptyActivity: { padding: 20, alignItems: 'center' },
  emptyText: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant },

  progressSection: { gap: 12 },
  sectionTitle: { fontFamily: FontFamily.headline, fontSize: 18, color: Colors.onSurface },
  progressCard: { padding: 20 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  metaText: { fontFamily: FontFamily.body, fontSize: 12, color: Colors.onSurfaceVariant },
});
